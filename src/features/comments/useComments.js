import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createComment, deleteComment, getComments, updateComment } from '@/api/commentApi';
import { queryKeys } from '@/app/queryKeys';
import { getError } from '@/utils/errors';

export function useComments(ticketId) {
  return useQuery({
    queryKey: queryKeys.comments.list(ticketId),
    queryFn: () => getComments(ticketId),
    enabled: ticketId > 0,
  });
}

export function useCreateComment(ticketId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData) => createComment(ticketId, formData),
    onMutate: async (formData) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.comments.list(ticketId) });
      const previous = queryClient.getQueryData(queryKeys.comments.list(ticketId));
      const temp = {
        id: Date.now() * -1,
        ticket_id: ticketId,
        body: formData.body,
        user_id: -1,
        created_at: new Date().toISOString(),
      };
      queryClient.setQueryData(queryKeys.comments.list(ticketId), (old) => [...(old ?? []), temp]);
      return { previous };
    },
    onError: (error, formData, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.comments.list(ticketId), context.previous);
      }
      toast.error(getError(error));
    },
    onSuccess: () => toast.success('Comment added'),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.list(ticketId) });
    },
  });
}

export function useUpdateComment(ticketId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }) => updateComment(id, { body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.list(ticketId) });
      toast.success('Comment updated');
    },
    onError: (error) => toast.error(getError(error)),
  });
}

export function useDeleteComment(ticketId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteComment,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.comments.list(ticketId) });
      const previous = queryClient.getQueryData(queryKeys.comments.list(ticketId));
      queryClient.setQueryData(queryKeys.comments.list(ticketId), (old) =>
        (old ?? []).filter((comment) => comment.id !== id),
      );
      return { previous };
    },
    onError: (error, id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.comments.list(ticketId), context.previous);
      }
      toast.error(getError(error));
    },
    onSuccess: () => toast.success('Comment deleted'),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.list(ticketId) });
    },
  });
}
