import { http } from '@/api/http';
import { getData, getPage } from '@/api/apiData';

export async function getUsers(filters) {
   const response = await http.get('/users', { params: filters });
  return getPage(response.data);
}

export async function getUser(id) {
  const response = await http.get(`/users/${id}`);
  return getData(response.data);
}

export async function createUser(formData) {
  const response = await http.post('/users', formData);
  return getData(response.data);
}

export async function updateUser(id, formData) {
  const response = await http.put(`/users/${id}`, formData);
  return getData(response.data);
}

export async function deleteUser(id) {
  await http.delete(`/users/${id}`);
}
