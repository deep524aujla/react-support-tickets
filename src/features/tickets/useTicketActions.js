import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createTicket, deleteTicket, updateTicket } from '@/api/ticketApi';
import { queryKeys } from '@/app/queryKeys';
import { getError } from '@/utils/errors';

export function useCreateTicket(onDone) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      toast.success('Ticket created');
      if (onDone) {
        onDone();
      }
    },
    onError: (error) => toast.error(getError(error)),
  });
}

export function useUpdateTicket(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData) => updateTicket(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      toast.success('Ticket updated');
    },
    onError: (error) => toast.error(getError(error)),
  });
}

export function useDeleteTicket(onDone) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      toast.success('Ticket deleted');
      if (onDone) {
        onDone();
      }
    },
    onError: (error) => toast.error(getError(error)),
  });
}
