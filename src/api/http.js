import axios from 'axios';
import { API_URL } from '@/utils/constants';
import { useAuthStore } from '@/features/auth/authStore';
import { refreshToken } from '@/api/authApi';

export const http = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

let refreshing = false;
let waitList = [];

function runWaitList(error, token) {
  waitList.forEach((item) => {
    if (error || !token) {
      item.reject(error);
    } else {
      item.resolve(token);
    }
  });
  waitList = [];
}

function goLogin() {
  useAuthStore.getState().clearAuth();
  const path = window.location.pathname;
  if (path !== '/login' && path !== '/register') {
    window.location.assign('/login');
  }
}

http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;
    if (!request || error.response?.status !== 401) {
      return Promise.reject(error);
    }
    const url = request.url ?? '';
    if (url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/refresh')) {
      return Promise.reject(error);
    }
    if (request._retry) {
      goLogin();
      return Promise.reject(error);
    }
    if (refreshing) {
      return new Promise((resolve, reject) => {
        waitList.push({
          resolve: (token) => {
            request.headers.Authorization = `Bearer ${token}`;
            resolve(http(request));
          },
          reject,
        });
      });
    }
    request._retry = true;
    refreshing = true;
    try {
      const result = await refreshToken();
      useAuthStore.getState().setToken(result.token);
      if (result.user) {
        useAuthStore.getState().setUser(result.user);
      }
      runWaitList(null, result.token);
      request.headers.Authorization = `Bearer ${result.token}`;
      return http(request);
    } catch (refreshError) {
      runWaitList(refreshError, null);
      goLogin();
      return Promise.reject(refreshError);
    } finally {
      refreshing = false;
    }
  },
);
