import { request } from '../api';
import type { User } from '../../types';

// 登录请求参数
interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// 注册请求参数
interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: string;
}

// 认证响应
interface AuthResponse {
  token: string;
  user: User;
}

// 用户认证服务
export const authService = {
  // 用户登录
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await request.post<AuthResponse>('/auth/login', data);
      // 保存token和用户信息到localStorage
      if (data.rememberMe) {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user_info', JSON.stringify(response.user));
      } else {
        sessionStorage.setItem('auth_token', response.token);
        sessionStorage.setItem('user_info', JSON.stringify(response.user));
      }
      return response;
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  },
  
  // 用户注册
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await request.post<AuthResponse>('/auth/register', data);
      return response;
    } catch (error) {
      console.error('注册失败:', error);
      throw error;
    }
  },
  
  // 获取当前登录用户信息
  async getCurrentUser(): Promise<User> {
    try {
      const response = await request.get<User>('/auth/me');
      return response;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      throw error;
    }
  },
  
  // 更新用户信息
  async updateUserProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await request.put<User>('/auth/profile', data);
      // 更新本地存储的用户信息
      const storageKey = localStorage.getItem('auth_token') ? 'localStorage' : 'sessionStorage';
      if (storageKey === 'localStorage') {
        const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
        localStorage.setItem('user_info', JSON.stringify({ ...userInfo, ...response }));
      } else {
        const userInfo = JSON.parse(sessionStorage.getItem('user_info') || '{}');
        sessionStorage.setItem('user_info', JSON.stringify({ ...userInfo, ...response }));
      }
      return response;
    } catch (error) {
      console.error('更新用户信息失败:', error);
      throw error;
    }
  },
  
  // 用户登出
  logout(): void {
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    sessionStorage.removeItem('user_info');
  },
  
  // 检查用户是否已登录
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token') || !!sessionStorage.getItem('auth_token');
  },
  
  // 获取存储的用户信息
  getStoredUser(): User | null {
    const storageKey = localStorage.getItem('auth_token') ? 'localStorage' : 'sessionStorage';
    const userStr = storageKey === 'localStorage' 
      ? localStorage.getItem('user_info')
      : sessionStorage.getItem('user_info');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  // 忘记密码
  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await request.post<{ success: boolean; message: string }>('/auth/forgot-password', { email });
      return response;
    } catch (error) {
      console.error('发送重置密码邮件失败:', error);
      throw error;
    }
  },
  
  // 重置密码
  async resetPassword(token: string, newPassword: string, confirmPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await request.post<{ success: boolean; message: string }>('/auth/reset-password', {
        token,
        newPassword,
        confirmPassword
      });
      return response;
    } catch (error) {
      console.error('重置密码失败:', error);
      throw error;
    }
  },
};