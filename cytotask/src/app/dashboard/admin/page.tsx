'use client';

import { useState } from 'react';
import { useAuthUser, useProfile, useTasks, useUsers } from '@/hooks';
import { TaskCard } from '@/components/tasks/task-card';
import { Badge } from '@/components/ui/badge';
import type { TaskStatus, TaskPriority } from '@/types';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { data: user, isLoading: isAuthLoading } = useAuthUser();
  const { data: profile, isLoading: isProfileLoading } = useProfile(user?.id);
  const { data: tasks, isLoading: isTasksLoading, error: tasksError } = useTasks();
  const { data: allUsers, isLoading: isUsersLoading } = useUsers();
  
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');

  // Combined loading state
  if (isAuthLoading || isProfileLoading || isTasksLoading || isUsersLoading) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        <p className="text-sm text-gray-400">Loading admin console...</p>
      </div>
    );
  }

  // Security Check
  if (!profile?.is_admin) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 text-red-500 shadow-lg shadow-red-500/20">
          <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Access Denied</h1>
        <p className="mt-2 max-w-md text-gray-400">
          You do not have the required permissions to view this page. This area is restricted to administrators only.
        </p>
        <Link 
          href="/dashboard"
          className="mt-8 rounded-xl bg-gray-800 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  // Error state for tasks
  if (tasksError) {
    return (
      <div className="card border-red-500/20 bg-red-500/10 p-12 text-center text-red-400">
        <svg className="mx-auto mb-4 h-12 w-12 text-red-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="font-semibold">Failed to load system tasks</p>
        <p className="mt-1 text-sm opacity-80">{tasksError.message}</p>
      </div>
    );
  }

  const safeTasks = tasks || [];
  const safeUsers = allUsers || [];

  // Filter tasks
  const filteredTasks = safeTasks.filter((task) => {
    if (statusFilter !== 'all' && task.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 border-b border-gray-800 pb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 shadow-[0_0_20px_rgba(139,92,246,0.3)] text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white">Admin Console</h1>
              <p className="text-sm font-medium text-gray-500">System-wide governance and team management.</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-lg bg-gray-900/50 px-4 py-2 border border-gray-800">
            <span className="text-sm font-medium text-gray-400">System Tasks:</span>
            <span className="text-lg font-bold text-brand-400">{safeTasks.length}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-gray-900/50 px-4 py-2 border border-gray-800">
            <span className="text-sm font-medium text-gray-400">Total Users:</span>
            <span className="text-lg font-bold text-blue-400">{safeUsers.length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Main Content: Tasks */}
        <div className="space-y-6 lg:col-span-3">
          {/* Filter Bar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center rounded-xl bg-surface-raised p-4 border border-gray-800">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="text-sm font-medium text-gray-300">Filter Tasks:</span>
            </div>
            
            <div className="flex flex-1 flex-wrap gap-4">
              <select
                className="input w-full sm:w-40 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M7%2010l5%205%205-5%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:24px_24px] bg-[right_8px_center] bg-no-repeat pr-10"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}
              >
                <option value="all">All Statuses</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>

              <select
                className="input w-full sm:w-40 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M7%2010l5%205%205-5%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:24px_24px] bg-[right_8px_center] bg-no-repeat pr-10"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | 'all')}
              >
                <option value="all">All Priorities</option>
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>

          {/* Task Grid */}
          {filteredTasks.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} isAdminView={true} />
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center text-gray-400 border-dashed border-gray-700 bg-surface/50">
              <p className="font-medium text-gray-300">No tasks match these filters.</p>
            </div>
          )}
        </div>

        {/* Sidebar: Users List */}
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-800 bg-surface-raised p-5">
            <div className="mb-4 flex items-center gap-2">
              <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h2 className="text-lg font-bold text-white">System Users</h2>
            </div>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {safeUsers.map((u) => (
                <div key={u.id} className="flex items-center gap-3 border-b border-gray-800/50 pb-3 last:border-0 last:pb-0">
                  <div className="flex h-10 w-10 shrink-0 overflow-hidden items-center justify-center rounded-full border border-gray-700 bg-gray-800">
                    {u.avatar_url ? (
                      <img src={u.avatar_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-gray-400">
                        {(u.full_name?.charAt(0) || u.email.charAt(0)).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-100">
                      {u.full_name || 'No Name Set'}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {u.email}
                    </p>
                  </div>
                  {u.is_admin && (
                    <Badge variant="blue" className="shrink-0 px-1.5 py-0">
                      Admin
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-gray-800 bg-surface-raised/50 p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Quick Tip</p>
            <p className="mt-2 text-xs leading-relaxed text-gray-400">
              As an administrator, you can reassign any task to any user listed above directly from the task card.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
