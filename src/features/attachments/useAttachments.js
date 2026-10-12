import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  deleteAttachment,
  downloadAttachment,
  getAttachments,
  uploadAttachment,
} from '@/api/attachmentApi';
import { queryKeys } from '@/app/queryKeys';
import { getError } from '@/utils/errors';

export function useAttachments(ticketId) {
  return useQuery({
    queryKey: queryKeys.attachments.list(ticketId),
    queryFn: () => getAttachments(ticketId),
    enabled: ticketId > 0,
  });
}

export function useUploadAttachment(ticketId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, onProgress }) => uploadAttachment(ticketId, file, onProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attachments.list(ticketId) });
      toast.success('File uploaded');
    },
    onError: (error) => toast.error(getError(error)),
  });
}

export function useDeleteAttachment(ticketId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (attachmentId) => deleteAttachment(ticketId, attachmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attachments.list(ticketId) });
      toast.success('Attachment removed');
    },
    onError: (error) => toast.error(getError(error)),
  });
}

export async function downloadFile(ticketId, attachmentId, filename) {
  const blob = await downloadAttachment(ticketId, attachmentId);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
}
