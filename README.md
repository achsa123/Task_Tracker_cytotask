# 🚀 CytoTask — Task Management Web App

CytoTask is a full-stack task management application that allows users to create, assign, and track tasks within a team.
It is built with a production-focused architecture including authentication, secure database access, protected routing, and real-time UI updates.

This project demonstrates best practices in full-stack development using Next.js, Supabase, and modern React patterns.

---

## ✨ Features

* 🔐 User authentication (Signup, Login, Logout)
* 📊 Task dashboard (created + assigned tasks)
* 📝 Create, update, and delete tasks
* 🔄 Inline task status updates (Open → In Progress → Done)
* 🎯 Task filtering (status and priority)
* 👤 Profile management with avatar upload
* ⚡ Instant UI updates using React Query
* 🔒 Row Level Security (RLS) enforced at database level
* 👑 Admin View (optional): view all tasks and reassign users

---

## 🛠️ Tech Stack

* **Frontend**: Next.js 14 (App Router), TypeScript
* **Styling**: Tailwind CSS
* **Backend**: Supabase (Auth, PostgreSQL, Storage)
* **Data Fetching**: React Query (TanStack Query)
* **Forms & Validation**: React Hook Form + Zod

---

## 📦 Prerequisites

Make sure you have:

* Node.js (v18 or higher recommended)
* npm or yarn
* A Supabase account → https://supabase.com

---

## 🔑 Environment Variables

Create a `.env.local` file in the root of the project:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Description:

* `NEXT_PUBLIC_SUPABASE_URL` → Your Supabase project URL (Dashboard → Settings → API)
* `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Your public (anon) API key

⚠️ Do NOT commit real keys to GitHub

---

## 🧱 Database Setup

1. Go to your Supabase project
2. Open **SQL Editor**
3. Run the following files in order:

* `supabase/migrations/001_initial_schema.sql`
* `supabase/migrations/002_rls_policies.sql`

These will:

* Create tables (`profiles`, `tasks`)
* Add relationships and triggers
* Enable Row Level Security (RLS)
* Define access control policies

---

## 🗂️ Database Schema Overview

### 👤 profiles

Stores user information

* `id` → linked to auth.users
* `display_name` → user's name
* `avatar_url` → profile image
* `is_admin` → admin access flag

---

### 📋 tasks

Stores task data

* `id` → unique task ID
* `title` → task title
* `description` → optional details
* `status` → Open / In Progress / Done
* `priority` → Low / Medium / High
* `due_date` → deadline
* `created_by` → creator user ID
* `assigned_to` → assigned user ID
* `created_at` → timestamp

---

## 🔒 Security (RLS)

Row Level Security (RLS) is enabled on all tables.

### Rules:

* Users can only view tasks they created or are assigned to
* Users can create tasks (with their own user ID)
* Users can update tasks they created or are assigned to
* Only task creators can delete tasks
* Admins can view and update all tasks

---

## 🚀 Local Development Setup

```bash
# Clone repository
git clone https://github.com/your-username/cytotask.git

# Navigate into project
cd cytotask

# Install dependencies
npm install

# Create environment file
touch .env.local
# (add your Supabase keys)

# Run development server
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 📁 Project Structure

```
src/
 ├── app/                # App Router pages
 ├── components/        # UI components
 ├── hooks/             # React Query hooks
 ├── lib/               # Supabase client
 ├── schemas/           # Zod schemas
 ├── types/             # TypeScript types

supabase/
 ├── migrations/        # SQL migration files
```

---

## ⚠️ Important Notes

* All Supabase calls are handled via React Query hooks
* No direct database calls inside components
* Forms are validated using Zod
* Errors are handled explicitly (no generic messages)
* Loading states are implemented for all async operations

---

