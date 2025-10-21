import axios, { AxiosRequestConfig } from 'axios';
import { getDataFromLc } from './helper';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'https://ai-tools-api-klod.onrender.com/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use((config: any) => {
  const token = getDataFromLc('token');
  const publicRoutes = ['/auth/login', '/auth/signup'];

  if (config.url) {
    const isPublic = publicRoutes.some(route => config.url?.includes(route));

    if (!isPublic && token) {
      if (!config.headers) config.headers = {};
      config.headers['Authorization'] = `${token}`;
    }
  }

  return config;
});

export default axiosInstance;