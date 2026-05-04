'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createTaskSchema, type CreateTaskInput } from '@/schemas';
import { useCreateTask } from '@/hooks';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormValues = z.input<typeof createTaskSchema>;

export function CreateTaskModal({ isOpen, onClose }: CreateTaskModalProps) {
  const { mutate: createTask, isPending, error } = useCreateTask();
  const [successMsg, setSuccessMsg] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      status: 'todo',
      priority: 'medium',
      assigned_to: '',
      due_date: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    setSuccessMsg('');
    const payload: CreateTaskInput = {
      ...data,
      title: data.title,
      status: data.status || 'todo',
      priority: data.priority || 'medium',
      assigned_to: data.assigned_to || null,
      due_date: data.due_date || null,
    };

    createTask(payload, {
      onSuccess: () => {
        setSuccessMsg('Task created successfully!');
        setTimeout(() => {
          reset();
          setSuccessMsg('');
          onClose();
        }, 1200);
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        <Input
          label="Task Title"
          placeholder="Enter task title"
          {...register('title')}
          error={errors.title?.message}
        />

        <div className="flex w-full flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-300">Description</label>
          <textarea
            className={`input min-h-[100px] resize-none ${errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Add task details..."
            {...register('description')}
          />
          {errors.description && <span className="field-error">{errors.description.message}</span>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-300">Priority</label>
            <select className="input appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M7%2010l5%205%205-5%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:24px_24px] bg-[right_8px_center] bg-no-repeat pr-10" {...register('priority')}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <Input
            label="Due Date"
            type="date"
            {...register('due_date')}
            error={errors.due_date?.message}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-300">Assignee</label>
          <select className="input appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M7%2010l5%205%205-5%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:24px_24px] bg-[right_8px_center] bg-no-repeat pr-10" {...register('assigned_to')}>
            <option value="">Unassigned</option>
            <option value="alice@example.com">Alice (alice@example.com)</option>
            <option value="bob@example.com">Bob (bob@example.com)</option>
            <option value="charlie@example.com">Charlie (charlie@example.com)</option>
          </select>
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
            {error.message}
          </div>
        )}

        {successMsg && (
          <div className="animate-fade-in rounded-lg bg-green-500/10 p-3 text-sm text-green-400 border border-green-500/20">
            {successMsg}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isPending}>
            Create Task
          </Button>
        </div>
      </form>
    </Modal>
  );
}
