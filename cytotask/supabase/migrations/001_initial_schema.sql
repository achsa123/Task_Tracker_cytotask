-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create ENUMs for task status and priority
create type task_status as enum ('todo', 'in_progress', 'done');
create type task_priority as enum ('low', 'medium', 'high');

-- ==========================================
-- 1. PROFILES TABLE
-- ==========================================
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  avatar_url text,
  is_admin boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trigger to automatically create a profile when a user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Trigger to prevent non-admins from changing is_admin status
create or replace function public.protect_is_admin()
returns trigger as $$
begin
  -- Check if is_admin is being changed
  if new.is_admin is distinct from old.is_admin then
    -- Allow if the user making the change is already an admin
    if not (select is_admin from public.profiles where id = auth.uid()) then
      raise exception 'Only administrators can change admin status.';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_profile_is_admin_update
  before update on public.profiles
  for each row execute procedure public.protect_is_admin();


-- ==========================================
-- 2. TASKS TABLE
-- ==========================================
create table public.tasks (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  status task_status default 'todo'::task_status not null,
  priority task_priority default 'medium'::task_priority not null,
  due_date timestamp with time zone,
  created_by uuid references auth.users(id) on delete cascade not null,
  assigned_to text, -- Using text since we mocked it with emails
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trigger to automatically update the updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_task_updated
  before update on public.tasks
  for each row execute procedure public.handle_updated_at();

-- Trigger to prevent non-admins from changing assigned_to status
create or replace function public.protect_task_reassignment()
returns trigger as $$
begin
  -- Check if assigned_to is being changed
  if new.assigned_to is distinct from old.assigned_to then
    -- Allow if the user making the change is an admin
    if not (select is_admin from public.profiles where id = auth.uid()) then
      raise exception 'Only administrators can reassign tasks.';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_task_reassignment_update
  before update on public.tasks
  for each row execute procedure public.protect_task_reassignment();

-- ==========================================
-- 3. STORAGE BUCKETS
-- ==========================================
insert into storage.buckets (id, name, public) 
values ('avatars', 'avatars', true)
on conflict (id) do nothing;
