'use client';

import { useState } from 'react';
import { useAuthUser, useTasks } from '@/hooks';
import { TaskCard } from '@/components/tasks/task-card';
import { CreateTaskModal } from '@/components/tasks/create-task-modal';
import { Button } from '@/components/ui/button';
import type { TaskStatus, TaskPriority } from '@/types';

export default function DashboardPage() {
  const { data: user, isLoading: isAuthLoading } = useAuthUser();
  const { data: tasks, isLoading: isTasksLoading, error: tasksError } = useTasks(
    user ? { userId: user.id, email: user.email } : undefined
  );
  
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Combined loading state
  if (isAuthLoading || isTasksLoading) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        <p className="text-sm text-gray-400">Loading your tasks...</p>
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
        <p className="font-semibold">Failed to load tasks</p>
        <p className="mt-1 text-sm opacity-80">{tasksError.message}</p>
      </div>
    );
  }

  // Ensure tasks is an array before filtering
  const safeTasks = tasks || [];

  // Filter tasks based on selected filters
  const filteredTasks = safeTasks.filter((task) => {
    if (statusFilter !== 'all' && task.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-100">Tasks</h1>
          <p className="mt-1 text-sm text-gray-400">Manage your projects and tasks.</p>
        </div>
        <Button 
          className="shrink-0 shadow-brand-500/20 shadow-lg"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center rounded-xl bg-surface-raised p-4 border border-gray-800">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="text-sm font-medium text-gray-300">Filter by:</span>
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center text-gray-400 border-dashed border-gray-700 bg-surface/50">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 mb-4">
            <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="font-medium text-gray-300">No tasks found</p>
          <p className="mt-1 text-sm">Try adjusting your filters or create a new task.</p>
        </div>
      )}

      {/* Modals */}
      <CreateTaskModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
}
