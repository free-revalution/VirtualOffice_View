// 统一的用户类型定义
export interface User {
  id: string;
  name: string;
  avatar: string;
  avatarType?: 'emoji' | 'image';
  status: 'online' | 'away' | 'busy' | 'offline';
  role: string;
  position?: { x: number; y: number };
  email?: string; // 可选字段，仅在认证时使用
}

