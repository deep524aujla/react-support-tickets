import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createUser, deleteUser, getUsers, updateUser } from '@/api/userApi';
import { queryKeys } from '@/app/queryKeys';
import { getError } from '@/utils/errors';

export function useUsers(filters) {
  
  return useQuery({
    queryKey: queryKeys.users.list(filters),
    queryFn: () => getUsers(filters),
    placeholderData: keepPreviousData,
  });
}

export function useCreateUser(onDone) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success('User created');
      if (onDone) {
        onDone();
      }
    },
    onError: (error) => toast.error(getError(error)),
  });
}

export function useUpdateUser(id, onDone) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData) => updateUser(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) });
      toast.success('User updated');
      if (onDone) {
        onDone();
      }
    },
    onError: (error) => toast.error(getError(error)),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success('User deleted');
    },
    onError: (error) => toast.error(getError(error)),
  });
}
