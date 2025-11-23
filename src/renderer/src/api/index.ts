// 导出API基础配置
export { default as api } from './api';
export { request } from './api';

// 导出所有服务
export * from './services/auth.service';
export * from './services/virtualSpace.service';
export * from './services/chat.service';
export * from './services/meeting.service';

// 导出API错误处理工具
export const handleApiError = (error: any): string => {
  if (error.response) {
    // 服务器返回错误响应
    return error.response.data?.error || error.response.data?.message || '服务器错误';
  } else if (error.request) {
    // 请求已发出但没有收到响应
    return '网络错误，请检查您的连接';
  } else {
    // 请求配置出错
    return error.message || '请求错误';
  }
};

// 导出API状态检查工具
export const isApiSuccess = (response: any): boolean => {
  return response && response.success !== false;
};

// 导出统一的API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 导出便捷的API调用包装函数
export const apiCall = async <T = any>(
  apiFunction: () => Promise<T>,
  onSuccess?: (data: T) => void,
  onError?: (error: string) => void
): Promise<T | null> => {
  try {
    const data = await apiFunction();
    if (onSuccess) {
      onSuccess(data);
    }
    return data;
  } catch (error) {
    const errorMessage = handleApiError(error);
    if (onError) {
      onError(errorMessage);
    } else {
      console.error(errorMessage);
    }
    return null;
  }
};