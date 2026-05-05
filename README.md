CytoTask — Task Management App

CytoTask is a full-stack task management web application built using modern web technologies.
It allows users to create, assign, and track tasks efficiently within a team.

✨ Features

🔐 Authentication
User signup and login using Supabase Auth
Secure session handling
Proper error messages (invalid email, wrong password)
Protected routes (redirects unauthenticated users)

📊 Dashboard
View all tasks:
Created by you
Assigned to you
Task card includes:
Title
Status (Open / In Progress / Done)
Priority (Low / Medium / High)
Assignee
Due date
Filter tasks by:
Status
Priority

📝 Task Management
Create tasks with:
Title (required)
Description (optional)
Priority (required)
Assignee (required)
Due date (required)
Instant UI update after task creation

🔄 Task Actions
Update task status inline (no save button)
Delete task (only by creator)
Confirmation before deletion

👤 Profile & Avatar
Update display name
Upload profile picture (stored in Supabase Storage)
Avatar updates instantly in navbar

👑 Admin View (Stretch Goal)
Admin-only dashboard
View ALL tasks across users
Reassign tasks to any user
Fully secured using Row Level Security (RLS)

🛠️ Tech Stack
Frontend: Next.js 14 (App Router), TypeScript
Styling: Tailwind CSS
Backend: Supabase (Auth, Database, Storage)
Data Fetching: React Query (TanStack Query)
Forms & Validation: React Hook Form + Zod

📁 Project Structure
src/
 ├── app/                # App Router pages
 ├── components/        # Reusable UI components
 ├── hooks/             # React Query hooks
 ├── lib/               # Supabase client
 ├── schemas/           # Zod validation schemas
 ├── types/             # TypeScript types

supabase/
 ├── migrations/        # SQL migration files
 
🧱 Database Schema
profiles
id (uuid, primary key)
display_name
avatar_url
is_admin (boolean)
tasks
id (uuid)
title
description
status
priority
due_date
created_by (uuid)
assigned_to (uuid)
created_at

🔐 Security (RLS)

Row Level Security (RLS) is enabled on all tables.

Policies:
Users can view tasks they created or are assigned to
Users can insert tasks (created_by = auth.uid())
Users can update tasks if creator or assignee
Only creator can delete tasks
Admins can:
View all tasks
Update any task

⚙️ Environment Variables

Create a .env.local file:

NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_publishable_key

🚀 Getting Started
1. Clone the repository
git clone <your-repo-url>
cd cytotask
2. Install dependencies
npm install
3. Setup environment variables

Create .env.local and add your Supabase keys

4. Run the app
npm run dev

App runs on:

http://localhost:3000

🧪 Database Setup
Create a Supabase project
Run SQL migrations from /supabase/migrations
Enable RLS on all tables
Add policies as defined above

⚠️ Notes
No direct Supabase calls inside components (uses React Query hooks)
TypeScript used strictly (no any)
All forms validated using Zod
Errors handled properly (no generic messages)
Loading states implemented across app
