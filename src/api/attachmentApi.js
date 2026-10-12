import { http } from '@/api/http';
import { getData, getList } from '@/api/apiData';

export async function getAttachments(ticketId) {
  const response = await http.get(`/tickets/${ticketId}/attachments`);
  return getList(response.data);
}

export async function uploadAttachment(ticketId, file, onProgress) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await http.post(`/tickets/${ticketId}/attachments`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      if (!onProgress || !event.total) {
        return;
      }
      onProgress(Math.round((event.loaded / event.total) * 100));
    },
  });
  return getData(response.data);
}

export async function downloadAttachment(ticketId, attachmentId) {
  const response = await http.get(`/tickets/${ticketId}/attachments/${attachmentId}/download`, {
    responseType: 'blob',
  });
  return response.data;
}

export async function deleteAttachment(ticketId, attachmentId) {
  await http.delete(`/tickets/${ticketId}/attachments/${attachmentId}`);
}
