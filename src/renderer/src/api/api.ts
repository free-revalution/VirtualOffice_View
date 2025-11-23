import axios from 'axios';
import { handleApiError } from './utils';

// API基础URL配置
const API_BASE_URL = 'http://localhost:8080/api/v1';

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// 请求拦截器 - 添加认证token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理常见错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 处理401未授权错误
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_info');
      window.location.href = '/';
    }
    // 使用统一的错误处理函数
    handleApiError(error);
    return Promise.reject(error);
  }
);

// 请求方法封装
export const request = {
  get: <T = any>(url: string, params?: any) => 
    api.get(url, { params }).then(res => res.data as T),
  
  post: <T = any>(url: string, data?: any) => 
    api.post(url, data).then(res => res.data as T),
  
  put: <T = any>(url: string, data?: any) => 
    api.put(url, data).then(res => res.data as T),
  
  delete: <T = any>(url: string) => 
    api.delete(url).then(res => res.data as T),
};

export default api;