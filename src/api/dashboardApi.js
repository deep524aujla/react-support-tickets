import { http } from '@/api/http';
import { getData, getList } from '@/api/apiData';

export async function getDashboard() {
  const response = await http.get('/dashboard');
  return getData(response.data);
}

export async function getRoles() {
  const response = await http.get('/roles');
  return getList(response.data);
}
