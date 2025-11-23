// 用户相关类型
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
  position?: {
    x: number;
    y: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

// 消息类型
export interface Message {
  id: string;
  channelId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  createdAt: string;
  updatedAt?: string;
  sender?: User;
  translation?: {
    content: string;
    language: string;
  };
}

// 聊天频道类型
export interface ChatChannel {
  id: string;
  name?: string;
  type: 'private' | 'group' | 'public';
  members: User[];
  createdAt: string;
  updatedAt?: string;
  lastMessage?: Message;
}

// 虚拟空间类型
export interface VirtualSpace {
  id: string;
  name: string;
  description?: string;
  zones: VirtualSpaceZone[];
  createdAt: string;
  updatedAt?: string;
}

// 虚拟空间区域类型
export interface VirtualSpaceZone {
  id: string;
  spaceId: string;
  name: string;
  description?: string;
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  type: 'workspace' | 'meeting' | 'chat' | 'relax';
}

// 成员在线状态类型
export interface MemberPresence {
  id: string;
  userId: string;
  spaceId: string;
  zoneId?: string;
  position: {
    x: number;
    y: number;
  };
  status: 'online' | 'away' | 'busy';
  lastActive: string;
}

// 会议相关类型
export interface MeetingRoom {
  id: string;
  name: string;
  virtualSpaceId?: string;
  capacity: number;
  isLocked: boolean;
  hostId?: string;
  startTime?: string;
  endTime?: string;
  participants: MeetingParticipant[];
}

// 会议参与者类型
export interface MeetingParticipant {
  id: string;
  meetingId: string;
  userId: string;
  user: User;
  isHost: boolean;
  isSpeaking: boolean;
  hasMic: boolean;
  hasCamera: boolean;
  hasHandRaised: boolean;
  joinedAt: string;
}

// 认证相关类型
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  confirmPassword: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

// API响应通用类型
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 翻译相关类型
export interface TranslationRequest {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string;
}

export interface TranslationResponse {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

// 上传文件类型
export interface UploadFileResponse {
  url: string;
  filename: string;
  size: number;
  type: string;
  id: string;
}