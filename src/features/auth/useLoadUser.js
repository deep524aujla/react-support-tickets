import { useQuery } from '@tanstack/react-query';
import { getMe } from '@/api/authApi';
import { queryKeys } from '@/app/queryKeys';
import { useAuthStore } from '@/features/auth/authStore';

export function useLoadUser() {
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);

  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      const user = await getMe();
      setUser(user);
      return user;
    },
    enabled: Boolean(token),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}
