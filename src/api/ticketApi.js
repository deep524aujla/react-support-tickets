import { http } from '@/api/http';
import { getData, getPage } from '@/api/apiData';

export async function getTickets(filters) {
  const response = await http.get('/tickets', { params: filters });
  return getPage(response.data);
}

export async function getTicket(id) {
  const response = await http.get(`/tickets/${id}`);
  return getData(response.data);
}

export async function createTicket(formData) {
  const response = await http.post('/tickets', formData);
  return getData(response.data);
}

export async function updateTicket(id, formData) {
  const response = await http.put(`/tickets/${id}`, formData);
  return getData(response.data);
}

export async function deleteTicket(id) {
  await http.delete(`/tickets/${id}`);
}
