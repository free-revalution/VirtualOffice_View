import { request } from '../api';
import type { ChatChannel, Message, TranslationRequest, TranslationResponse } from '../../types';

// 发送消息请求参数
interface SendMessageRequest {
  channelId: string;
  content: string;
  type?: 'text' | 'image' | 'file';
}

// 聊天服务
export const chatService = {
  // 获取用户的所有聊天频道
  async getChannels(): Promise<ChatChannel[]> {
    try {
      const response = await request.get<ChatChannel[]>('/chat/channels');
      return response;
    } catch (error) {
      console.error('获取聊天频道失败:', error);
      throw error;
    }
  },
  
  // 获取聊天频道详情
  async getChannelById(channelId: string): Promise<ChatChannel> {
    try {
      const response = await request.get<ChatChannel>(`/chat/channels/${channelId}`);
      return response;
    } catch (error) {
      console.error(`获取聊天频道 ${channelId} 详情失败:`, error);
      throw error;
    }
  },
  
  // 获取聊天消息
  async getMessages(channelId: string, limit: number = 50, offset: number = 0): Promise<Message[]> {
    try {
      const response = await request.get<Message[]>(`/chat/channels/${channelId}/messages`, {
        limit,
        offset
      });
      return response;
    } catch (error) {
      console.error(`获取聊天消息失败:`, error);
      throw error;
    }
  },
  
  // 发送消息
  async sendMessage(data: SendMessageRequest): Promise<Message> {
    try {
      const response = await request.post<Message>(`/chat/channels/${data.channelId}/messages`, {
        content: data.content,
        type: data.type || 'text'
      });
      return response;
    } catch (error) {
      console.error('发送消息失败:', error);
      throw error;
    }
  },
  
  // 删除消息
  async deleteMessage(messageId: string): Promise<{ success: boolean }> {
    try {
      const response = await request.delete<{ success: boolean }>(`/chat/messages/${messageId}`);
      return response;
    } catch (error) {
      console.error(`删除消息 ${messageId} 失败:`, error);
      throw error;
    }
  },
  
  // 更新消息
  async updateMessage(messageId: string, content: string): Promise<Message> {
    try {
      const response = await request.put<Message>(`/chat/messages/${messageId}`, { content });
      return response;
    } catch (error) {
      console.error(`更新消息 ${messageId} 失败:`, error);
      throw error;
    }
  },
  
  // 创建聊天频道
  async createChannel(data: Omit<ChatChannel, 'id' | 'members' | 'createdAt' | 'updatedAt' | 'lastMessage'>): Promise<ChatChannel> {
    try {
      const response = await request.post<ChatChannel>('/chat/channels', data);
      return response;
    } catch (error) {
      console.error('创建聊天频道失败:', error);
      throw error;
    }
  },
  
  // 加入聊天频道
  async joinChannel(channelId: string): Promise<{ success: boolean }> {
    try {
      const response = await request.post<{ success: boolean }>(`/chat/channels/${channelId}/join`);
      return response;
    } catch (error) {
      console.error(`加入聊天频道 ${channelId} 失败:`, error);
      throw error;
    }
  },
  
  // 离开聊天频道
  async leaveChannel(channelId: string): Promise<{ success: boolean }> {
    try {
      const response = await request.post<{ success: boolean }>(`/chat/channels/${channelId}/leave`);
      return response;
    } catch (error) {
      console.error(`离开聊天频道 ${channelId} 失败:`, error);
      throw error;
    }
  },
  
  // 翻译消息
  async translateMessage(messageId: string, targetLanguage: string): Promise<TranslationResponse> {
    try {
      const response = await request.post<TranslationResponse>(`/chat/messages/${messageId}/translate`, {
        targetLanguage
      });
      return response;
    } catch (error) {
      console.error(`翻译消息 ${messageId} 失败:`, error);
      throw error;
    }
  },
  
  // 翻译文本
  async translateText(data: TranslationRequest): Promise<TranslationResponse> {
    try {
      const response = await request.post<TranslationResponse>('/chat/translate', data);
      return response;
    } catch (error) {
      console.error('翻译文本失败:', error);
      throw error;
    }
  },
  
  // 添加频道成员
  async addChannelMember(channelId: string, userId: string): Promise<{ success: boolean }> {
    try {
      const response = await request.post<{ success: boolean }>(`/chat/channels/${channelId}/members`, { userId });
      return response;
    } catch (error) {
      console.error(`添加频道成员失败:`, error);
      throw error;
    }
  },
  
  // 移除频道成员
  async removeChannelMember(channelId: string, userId: string): Promise<{ success: boolean }> {
    try {
      const response = await request.delete<{ success: boolean }>(`/chat/channels/${channelId}/members/${userId}`);
      return response;
    } catch (error) {
      console.error(`移除频道成员失败:`, error);
      throw error;
    }
  },
  
  // 获取频道成员
  async getChannelMembers(channelId: string): Promise<any[]> {
    try {
      const response = await request.get<any[]>(`/chat/channels/${channelId}/members`);
      return response;
    } catch (error) {
      console.error(`获取频道成员失败:`, error);
      throw error;
    }
  },
};