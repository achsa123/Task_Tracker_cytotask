'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import type { Task, TaskStatus } from '@/types';
import { useAuthUser, useUpdateTask, useDeleteTask, useProfile, useUsers } from '@/hooks';

interface TaskCardProps {
  task: Task;
  isAdminView?: boolean;
}

export function TaskCard({ task, isAdminView = false }: TaskCardProps) {
  const { data: user } = useAuthUser();
  const { data: profile } = useProfile(user?.id);
  const { data: allProfiles } = useUsers();
  const { mutate: updateTask, isPending } = useUpdateTask();

  const currentAssignee = allProfiles?.find(p => p.email === task.assigned_to);

  // Check permissions
  const isCreator = user?.id === task.created_by;
  const isAssignee = user?.email && user.email === task.assigned_to;
  const isAdmin = profile?.is_admin;
  const canEditStatus = isCreator || isAssignee || isAdmin;
  const canReassign = isAdmin && isAdminView;

  // Map status to styles
  const statusConfig = {
    todo: { label: 'Open', variant: 'gray' as const, bg: 'bg-gray-900', text: 'text-gray-300' },
    in_progress: { label: 'In Progress', variant: 'blue' as const, bg: 'bg-blue-900', text: 'text-blue-300' },
    done: { label: 'Done', variant: 'green' as const, bg: 'bg-green-900', text: 'text-green-300' },
  };

  // Map priority to badge styles
  const priorityConfig = {
    low: { label: 'Low', variant: 'blue' as const },
    medium: { label: 'Medium', variant: 'yellow' as const },
    high: { label: 'High', variant: 'red' as const },
  };

  const status = statusConfig[task.status];
  const priority = priorityConfig[task.priority];

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateTask({ id: task.id, updates: { status: e.target.value as TaskStatus } });
  };

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateTask({ id: task.id, updates: { assigned_to: e.target.value } });
  };

  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      deleteTask(task.id);
    }
  };

  return (
    <div className={`card group flex flex-col justify-between gap-4 transition-all hover:border-gray-600 hover:shadow-md ${isPending || isDeleting ? 'opacity-50' : ''}`}>
      {isAdminView && (
        <div className="mb-[-8px] flex items-center justify-between">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-500/80">
            Admin Management
          </span>
          <div className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
        </div>
      )}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-100 line-clamp-2 pr-2">{task.title}</h3>
          
          <div className="flex shrink-0 items-center gap-2">
            {canEditStatus ? (
              <select
                value={task.status}
                onChange={handleStatusChange}
                disabled={isPending || isDeleting}
                className={`cursor-pointer appearance-none rounded-full border px-2 py-0.5 text-xs font-medium outline-none transition-colors ${status.bg} ${status.text} border-transparent hover:border-gray-500 focus:ring-2 focus:ring-brand-500`}
              >
                <option value="todo" className="bg-gray-900 text-gray-200">Open</option>
                <option value="in_progress" className="bg-gray-900 text-gray-200">In Progress</option>
                <option value="done" className="bg-gray-900 text-gray-200">Done</option>
              </select>
            ) : (
              <Badge variant={status.variant}>
                {status.label}
              </Badge>
            )}

            {isCreator && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-lg p-1 text-gray-500 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Delete task"
                title="Delete task"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {task.description && (
          <p className="text-sm text-gray-400 line-clamp-2">{task.description}</p>
        )}
      </div>

      <div className="mt-auto space-y-4 pt-4">
        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={priority.variant}>
            {priority.label} Priority
          </Badge>
          
          {task.due_date && (
            <span className="flex items-center gap-1 text-xs font-medium text-gray-400">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(task.due_date).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Footer info row */}
        <div className="flex flex-col gap-3 border-t border-gray-800 pt-3">
          {canReassign ? (
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Reassign Task
              </label>
              <div className="flex w-full items-center gap-3 rounded-lg bg-gray-900/50 p-2 border border-gray-800 focus-within:border-brand-500/50 transition-colors">
                <div className="flex h-7 w-7 shrink-0 overflow-hidden items-center justify-center rounded-full border border-gray-700 bg-gray-800 text-[10px] font-bold text-gray-300 shadow-sm">
                  {currentAssignee?.avatar_url ? (
                    <img src={currentAssignee.avatar_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    (currentAssignee?.full_name?.charAt(0) || task.assigned_to?.charAt(0) || '?').toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <select
                    value={task.assigned_to || ''}
                    onChange={handleAssigneeChange}
                    disabled={isPending}
                    className="w-full bg-transparent text-xs font-semibold text-gray-200 outline-none hover:text-white transition-colors cursor-pointer truncate"
                  >
                    <option value="" className="bg-gray-900 text-gray-200">Unassigned</option>
                    {allProfiles?.map((p) => (
                      <option key={p.id} value={p.email} className="bg-gray-900 text-gray-200">
                        {p.full_name || p.email}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 text-xs font-medium text-gray-300">
                  {task.assigned_to ? task.assigned_to.charAt(0).toUpperCase() : '?'}
                </div>
                <span className="text-xs font-medium text-gray-400">
                  {task.assigned_to || 'Unassigned'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
