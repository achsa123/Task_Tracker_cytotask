// Query key factories — keeps all cache keys consistent across hooks

export const queryKeys = {
  tasks: {
    all: ['tasks'] as const,
    lists: () => [...queryKeys.tasks.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.tasks.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.tasks.all, 'detail', id] as const,
  },
  profile: {
    all: ['profile'] as const,
    detail: (id: string) => [...queryKeys.profile.all, id] as const,
  },
} as const;
