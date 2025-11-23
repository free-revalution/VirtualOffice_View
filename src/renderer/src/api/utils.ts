// API工具函数

/**
 * 处理API错误，返回友好的错误信息
 * @param error 错误对象
 * @returns 错误信息字符串
 */
export function handleApiError(error: any): string {
  // 检查是否是API响应错误
  if (error.response) {
    // 服务器返回了错误状态码
    const { status, data } = error.response;
    
    // 根据错误状态码返回不同的错误信息
    switch (status) {
      case 400:
        return data.message || '请求参数错误';
      case 401:
        return data.message || '未授权，请重新登录';
      case 403:
        return data.message || '没有权限执行此操作';
      case 404:
        return data.message || '请求的资源不存在';
      case 409:
        return data.message || '资源冲突，请检查后重试';
      case 500:
        return data.message || '服务器内部错误';
      default:
        return data.message || `请求失败，状态码: ${status}`;
    }
  } else if (error.request) {
    // 请求已发出，但没有收到响应
    return '网络连接失败，请检查您的网络';
  } else {
    // 请求配置出错
    return error.message || '请求发生错误';
  }
}

/**
 * 检查API响应是否成功
 * @param response API响应对象
 * @returns 是否成功
 */
export function isApiResponseSuccess(response: any): boolean {
  return response && response.status >= 200 && response.status < 300;
}

/**
 * 格式化API响应数据
 * @param data 原始数据
 * @returns 格式化后的数据
 */
export function formatApiResponse<T>(data: T): T {
  return data;
}

/**
 * 生成API请求ID（用于追踪）
 * @returns 请求ID
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}