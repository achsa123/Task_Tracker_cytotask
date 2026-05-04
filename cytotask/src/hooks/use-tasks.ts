import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { queryKeys } from '@/lib/query-keys';
import type { Task, TaskStatus } from '@/types';

export function useTasks(filters?: { userId?: string; email?: string }) {
  const supabase = createClient();

  return useQuery({
    queryKey: filters ? [...queryKeys.tasks.all, filters] : queryKeys.tasks.all,
    queryFn: async () => {
      let query = supabase
        .from('tasks')
        .select('*');

      // If personal filters are provided, we apply them.
      // For non-admins, RLS handles this, but for admins we need explicit filtering
      // to avoid showing the entire system's tasks on their personal dashboard.
      if (filters?.userId && filters?.email) {
        query = query.or(`created_by.eq.${filters.userId},assigned_to.eq.${filters.email}`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data as Task[];
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateTaskInput } from '@/schemas';

export function useCreateTask() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: CreateTaskInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          ...task,
          created_by: user.id, // Set the creator explicitly to created_by
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as Task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
  });
}

export function useUpdateTask() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as Task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
  });
}

export function useDeleteTask() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
  });
}
