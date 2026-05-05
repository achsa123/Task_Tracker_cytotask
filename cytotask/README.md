# CytoTask 🚀

CytoTask is a modern, full-stack task management application designed for teams to organize, track, and manage their workflow with ease. It provides a secure, role-based environment for efficient project collaboration and oversight.

## ✨ Features

- **Robust Authentication**: Secure sign-up and login powered by Supabase Auth.
- **Profile Management**: Custom user profiles with support for full names and avatar uploads.
- **Role-Based Access Control (RBAC)**: Distinct views and permissions for System Administrators and regular Users.
- **Task Management**: Create, edit, delete, and track tasks with status and priority levels.
- **Admin Console**: Global system oversight, including the ability to reassign tasks and manage users.
- **Secure Storage**: Avatar images are stored in protected Supabase Storage buckets with strict RLS policies.
- **Real-time UX**: Seamless data fetching and caching with React Query.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend**: [Supabase](https://supabase.com/) (Auth, PostgreSQL, Storage)
- **State Management**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A Supabase project

### 1. Clone the Repository

```bash
git clone https://github.com/achsa123/Task_Tracker_cytotask.git
cd cytotask
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup (Migrations)

Execute the migration scripts in your Supabase **SQL Editor** in the following order:

1.  Run the contents of `supabase/migrations/001_initial_schema.sql` to create tables, functions, and triggers.
2.  Run the contents of `supabase/migrations/002_rls_policies.sql` to enable security and access control policies.

### 5. Run the Application

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## 📂 Folder Structure

```text
src/
├── app/            # Next.js Pages, Layouts, and API routes
├── components/     # Reusable UI and business components
│   ├── ui/         # Base UI components (buttons, inputs, etc.)
│   └── tasks/      # Task-specific components
├── hooks/          # Custom React Query hooks for data fetching
├── lib/            # Configuration (Supabase client, etc.)
├── schemas/        # Zod validation schemas
└── types/          # TypeScript interfaces and types
supabase/
└── migrations/     # Database migration scripts
```

## 📊 Database Schema

### `profiles` Table
Stores user information synced from Supabase Auth.
- `id`: Unique user identifier (matches Auth UID).
- `email`: User's primary email.
- `full_name`: User's display name.
- `avatar_url`: Path to the user's profile picture in storage.
- `is_admin`: Boolean flag for administrative privileges.

### `tasks` Table
Stores all task-related data.
- `id`: Unique task identifier.
- `title`: Short summary of the task.
- `description`: Detailed task requirements.
- `status`: current state (`todo`, `in_progress`, `done`).
- `priority`: urgency level (`low`, `medium`, `high`).
- `created_by`: Reference to the creator's profile.
- `assigned_to`: Email of the user responsible for the task.

## 🔒 Security

This project implements strict **Row-Level Security (RLS)**:
- Users can only view tasks they created or are assigned to.
- Admins have system-wide visibility and management capabilities.
- Storage files are partitioned by User ID to prevent unauthorized access or deletion.

---

Built with ❤️ by the CytoTask Team.
