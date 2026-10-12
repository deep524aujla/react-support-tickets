import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { logout } from '@/api/authApi';
import { useAuthStore } from '@/features/auth/authStore';
import { queryClient } from '@/app/queryClient';

export function useLogout() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      clearAuth();
      queryClient.clear();
      navigate('/login');
      toast.success('Logged out');
    },
  });
}
