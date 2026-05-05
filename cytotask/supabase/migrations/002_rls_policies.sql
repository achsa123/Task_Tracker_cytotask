-- Turn on Row Level Security
alter table public.profiles enable row level security;
alter table public.tasks enable row level security;

-- ==========================================
-- 1. PROFILES POLICIES
-- ==========================================
create policy "Public profiles are viewable by everyone." 
  on public.profiles for select using (true);

create policy "Users can insert their own profile." 
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile." 
  on public.profiles for update using (auth.uid() = id);

create policy "Admins can update any profile." 
  on public.profiles for update using (
    (select is_admin from public.profiles where id = auth.uid()) = true
  );

create policy "Admins can delete any profile." 
  on public.profiles for delete using (
    (select is_admin from public.profiles where id = auth.uid()) = true
  );

-- ==========================================
-- 2. TASKS POLICIES
-- ==========================================
create policy "Tasks are viewable by admins, creators, or assignees." 
  on public.tasks for select 
  using (
    (select is_admin from public.profiles where id = auth.uid()) = true
    or auth.uid() = created_by
    or (auth.jwt() ->> 'email') = assigned_to
  );

create policy "Users can create tasks" 
  on public.tasks for insert 
  with check (auth.uid() = created_by);

create policy "Tasks can be updated by admins, creators, or assignees." 
  on public.tasks for update 
  using (
    (select is_admin from public.profiles where id = auth.uid()) = true
    or auth.uid() = created_by 
    or (auth.jwt() ->> 'email') = assigned_to
  );

create policy "Users can delete their own tasks" 
  on public.tasks for delete 
  using (auth.uid() = created_by);

-- ==========================================
-- 3. STORAGE POLICIES
-- ==========================================
create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Authenticated users can upload an avatar to their own folder."
  on storage.objects for insert
  to authenticated
  with check ( 
    bucket_id = 'avatars' 
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update their own avatar."
  on storage.objects for update
  to authenticated
  using ( 
    bucket_id = 'avatars' 
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete their own avatar."
  on storage.objects for delete
  to authenticated
  using ( 
    bucket_id = 'avatars' 
    and (storage.foldername(name))[1] = auth.uid()::text
  );
