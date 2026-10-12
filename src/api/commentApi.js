import { http } from '@/api/http';
import { getData, getList } from '@/api/apiData';

export async function getComments(ticketId) {
  const response = await http.get(`/tickets/${ticketId}/comments`);
  return getList(response.data);
}

export async function createComment(ticketId, formData) {
  const response = await http.post(`/tickets/${ticketId}/comments`, formData);
  return getData(response.data);
}

export async function updateComment(id, formData) {
  const response = await http.put(`/comments/${id}`, formData);
  return getData(response.data);
}

export async function deleteComment(id) {
  await http.delete(`/comments/${id}`);
}
