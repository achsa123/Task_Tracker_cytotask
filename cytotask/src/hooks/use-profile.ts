import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Profile } from '@/types';

export function useProfile(userId: string | undefined) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      return data as Profile | null;
    },
    enabled: !!userId,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({
      userId,
      email,
      updates,
    }: {
      userId: string;
      email: string;
      updates: Partial<Profile>;
    }) => {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({ id: userId, email, ...updates })
        .select()
        .single();

      if (error) throw error;
      return data as Profile;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['profile', variables.userId], data);
    },
  });
}

export function useUploadAvatar() {
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({
      userId,
      file,
    }: {
      userId: string;
      file: File;
    }) => {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    },
  });
}

export function useDeleteAvatar() {
  const supabase = createClient();

  return useMutation({
    mutationFn: async (filePath: string) => {
      const { error } = await supabase.storage
        .from('avatars')
        .remove([filePath]);

      if (error) throw error;
    },
  });
}

export function useUsers() {
  const supabase = createClient();

  return useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name', { ascending: true });

      if (error) throw error;
      return data as Profile[];
    },
  });
}
