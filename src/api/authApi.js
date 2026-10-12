import axios from 'axios';
import { http } from '@/api/http';
import { getData } from '@/api/apiData';
import { useAuthStore } from '@/features/auth/authStore';
import { API_URL } from '@/utils/constants';

function readAuth(raw) {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error('Invalid auth response');
  }
  if ('user' in raw && 'token' in raw) {
    return { user: raw.user, token: String(raw.token), expires_in: raw.expires_in };
  }
  if ('access_token' in raw) {
    return {
      user: raw.user ?? raw.data,
      token: String(raw.access_token),
      expires_in: raw.expires_in,
    };
  }
  return raw;
}

export async function login(formData) {
  const response = await http.post('/auth/login', formData);
  return readAuth(getData(response.data));
}

export async function register(formData) {
  const response = await http.post('/auth/register', formData);
  return readAuth(getData(response.data));
}

export async function logout() {
  try {
    await http.post('/auth/logout');
  } catch {
    return;
  }
}

export async function refreshToken() {
  const token = useAuthStore.getState().token;
  const response = await axios.post(`${API_URL}/auth/refresh`, null, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return readAuth(getData(response.data));
}

export async function getMe() {
  const response = await http.get('/auth/me');
  return getData(response.data);
}
