import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api',
});

// Attach JWT from localStorage on every request.
api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('auth');
  if (raw) {
    try {
      const token = JSON.parse(raw)?.token;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {
      /* ignore malformed storage */
    }
  }
  return config;
});

export function apiErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message ?? err.message ?? 'Request failed';
  }
  return 'Something went wrong';
}

export default api;
