import { request } from '../api';
import type { VirtualSpace, VirtualSpaceZone, MemberPresence, User } from '../../types';

// 位置更新请求参数
interface PositionUpdateRequest {
  spaceId: string;
  zoneId?: string;
  x: number;
  y: number;
  userId: string;
}

// 虚拟空间服务
export const virtualSpaceService = {
  // 获取所有虚拟空间
  async getAllSpaces(): Promise<VirtualSpace[]> {
    try {
      const response = await request.get<VirtualSpace[]>('/virtual-spaces');
      return response;
    } catch (error) {
      console.error('获取虚拟空间列表失败:', error);
      throw error;
    }
  },
  
  // 根据ID获取虚拟空间详情
  async getSpaceById(spaceId: string): Promise<VirtualSpace> {
    try {
      const response = await request.get<VirtualSpace>(`/virtual-spaces/${spaceId}`);
      return response;
    } catch (error) {
      console.error(`获取虚拟空间 ${spaceId} 详情失败:`, error);
      throw error;
    }
  },
  
  // 获取虚拟空间中的在线成员
  async getSpaceMembers(spaceId: string): Promise<MemberPresence[]> {
    try {
      const response = await request.get<MemberPresence[]>(`/virtual-spaces/${spaceId}/members`);
      return response;
    } catch (error) {
      console.error(`获取虚拟空间 ${spaceId} 成员失败:`, error);
      throw error;
    }
  },
  
  // 更新用户在虚拟空间中的位置
  async updatePosition(data: PositionUpdateRequest): Promise<MemberPresence> {
    try {
      const response = await request.put<MemberPresence>('/virtual-spaces/position', data);
      return response;
    } catch (error) {
      console.error('更新位置失败:', error);
      throw error;
    }
  },
  
  // 进入虚拟空间
  async enterSpace(spaceId: string): Promise<MemberPresence> {
    try {
      const response = await request.post<MemberPresence>(`/virtual-spaces/${spaceId}/enter`);
      return response;
    } catch (error) {
      console.error(`进入虚拟空间 ${spaceId} 失败:`, error);
      throw error;
    }
  },
  
  // 离开虚拟空间
  async leaveSpace(spaceId: string): Promise<{ success: boolean }> {
    try {
      const response = await request.post<{ success: boolean }>(`/virtual-spaces/${spaceId}/leave`);
      return response;
    } catch (error) {
      console.error(`离开虚拟空间 ${spaceId} 失败:`, error);
      throw error;
    }
  },
  
  // 获取虚拟空间区域
  async getSpaceZones(spaceId: string): Promise<VirtualSpaceZone[]> {
    try {
      const response = await request.get<VirtualSpaceZone[]>(`/virtual-spaces/${spaceId}/zones`);
      return response;
    } catch (error) {
      console.error(`获取虚拟空间 ${spaceId} 区域失败:`, error);
      throw error;
    }
  },
  
  // 创建虚拟空间（管理员功能）
  async createSpace(data: Omit<VirtualSpace, 'id' | 'createdAt' | 'updatedAt' | 'zones'>): Promise<VirtualSpace> {
    try {
      const response = await request.post<VirtualSpace>('/virtual-spaces', data);
      return response;
    } catch (error) {
      console.error('创建虚拟空间失败:', error);
      throw error;
    }
  },
  
  // 更新虚拟空间（管理员功能）
  async updateSpace(spaceId: string, data: Partial<VirtualSpace>): Promise<VirtualSpace> {
    try {
      const response = await request.put<VirtualSpace>(`/virtual-spaces/${spaceId}`, data);
      return response;
    } catch (error) {
      console.error(`更新虚拟空间 ${spaceId} 失败:`, error);
      throw error;
    }
  },
  
  // 删除虚拟空间（管理员功能）
  async deleteSpace(spaceId: string): Promise<{ success: boolean }> {
    try {
      const response = await request.delete<{ success: boolean }>(`/virtual-spaces/${spaceId}`);
      return response;
    } catch (error) {
      console.error(`删除虚拟空间 ${spaceId} 失败:`, error);
      throw error;
    }
  },
  
  // 获取虚拟空间中的用户详细信息
  async getUsersInSpace(spaceId: string): Promise<User[]> {
    try {
      const response = await request.get<User[]>(`/virtual-spaces/${spaceId}/users`);
      return response;
    } catch (error) {
      console.error(`获取虚拟空间 ${spaceId} 中的用户信息失败:`, error);
      throw error;
    }
  },
  
  // 更新用户状态
  async updateUserStatus(spaceId: string, status: 'online' | 'away' | 'busy'): Promise<MemberPresence> {
    try {
      const response = await request.put<MemberPresence>(`/virtual-spaces/${spaceId}/status`, { status });
      return response;
    } catch (error) {
      console.error('更新用户状态失败:', error);
      throw error;
    }
  },
};