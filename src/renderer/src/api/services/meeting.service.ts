import { request } from '../api';
import type { MeetingRoom, MeetingParticipant } from '../../types';

// 创建会议请求参数
interface CreateMeetingRequest {
  name: string;
  virtualSpaceId?: string;
  capacity: number;
  scheduledStartTime?: string;
  scheduledEndTime?: string;
}

// 更新参与者状态请求参数
interface UpdateParticipantStatusRequest {
  hasMic?: boolean;
  hasCamera?: boolean;
  hasHandRaised?: boolean;
  isSpeaking?: boolean;
}

// 会议服务
export const meetingService = {
  // 获取所有会议室
  async getAllMeetingRooms(): Promise<MeetingRoom[]> {
    try {
      const response = await request.get<MeetingRoom[]>('/meetings/rooms');
      return response;
    } catch (error) {
      console.error('获取会议室列表失败:', error);
      throw error;
    }
  },
  
  // 根据ID获取会议室详情
  async getMeetingRoomById(meetingId: string): Promise<MeetingRoom> {
    try {
      const response = await request.get<MeetingRoom>(`/meetings/rooms/${meetingId}`);
      return response;
    } catch (error) {
      console.error(`获取会议室 ${meetingId} 详情失败:`, error);
      throw error;
    }
  },
  
  // 创建会议室
  async createMeetingRoom(data: CreateMeetingRequest): Promise<MeetingRoom> {
    try {
      const response = await request.post<MeetingRoom>('/meetings/rooms', data);
      return response;
    } catch (error) {
      console.error('创建会议室失败:', error);
      throw error;
    }
  },
  
  // 更新会议室信息
  async updateMeetingRoom(meetingId: string, data: Partial<MeetingRoom>): Promise<MeetingRoom> {
    try {
      const response = await request.put<MeetingRoom>(`/meetings/rooms/${meetingId}`, data);
      return response;
    } catch (error) {
      console.error(`更新会议室 ${meetingId} 失败:`, error);
      throw error;
    }
  },
  
  // 删除会议室
  async deleteMeetingRoom(meetingId: string): Promise<{ success: boolean }> {
    try {
      const response = await request.delete<{ success: boolean }>(`/meetings/rooms/${meetingId}`);
      return response;
    } catch (error) {
      console.error(`删除会议室 ${meetingId} 失败:`, error);
      throw error;
    }
  },
  
  // 加入会议
  async joinMeeting(meetingId: string): Promise<MeetingParticipant> {
    try {
      const response = await request.post<MeetingParticipant>(`/meetings/rooms/${meetingId}/join`);
      return response;
    } catch (error) {
      console.error(`加入会议 ${meetingId} 失败:`, error);
      throw error;
    }
  },
  
  // 离开会议
  async leaveMeeting(meetingId: string): Promise<{ success: boolean }> {
    try {
      const response = await request.post<{ success: boolean }>(`/meetings/rooms/${meetingId}/leave`);
      return response;
    } catch (error) {
      console.error(`离开会议 ${meetingId} 失败:`, error);
      throw error;
    }
  },
  
  // 更新参与者状态
  async updateParticipantStatus(meetingId: string, data: UpdateParticipantStatusRequest): Promise<MeetingParticipant> {
    try {
      const response = await request.put<MeetingParticipant>(`/meetings/rooms/${meetingId}/participant/status`, data);
      return response;
    } catch (error) {
      console.error('更新参与者状态失败:', error);
      throw error;
    }
  },
  
  // 锁定/解锁会议
  async toggleMeetingLock(meetingId: string, isLocked: boolean): Promise<MeetingRoom> {
    try {
      const response = await request.put<MeetingRoom>(`/meetings/rooms/${meetingId}/lock`, { isLocked });
      return response;
    } catch (error) {
      console.error(`切换会议锁定状态失败:`, error);
      throw error;
    }
  },
  
  // 踢人
  async removeParticipant(meetingId: string, participantId: string): Promise<{ success: boolean }> {
    try {
      const response = await request.delete<{ success: boolean }>(`/meetings/rooms/${meetingId}/participants/${participantId}`);
      return response;
    } catch (error) {
      console.error(`移除参与者 ${participantId} 失败:`, error);
      throw error;
    }
  },
  
  // 移交主持人
  async transferHost(meetingId: string, newHostId: string): Promise<{ success: boolean }> {
    try {
      const response = await request.put<{ success: boolean }>(`/meetings/rooms/${meetingId}/host`, { newHostId });
      return response;
    } catch (error) {
      console.error(`移交主持人失败:`, error);
      throw error;
    }
  },
  
  // 邀请用户加入会议
  async inviteToMeeting(meetingId: string, email: string): Promise<{ success: boolean }> {
    try {
      const response = await request.post<{ success: boolean }>(`/meetings/rooms/${meetingId}/invite`, { email });
      return response;
    } catch (error) {
      console.error(`发送会议邀请失败:`, error);
      throw error;
    }
  },
  
  // 开始录制会议
  async startRecording(meetingId: string): Promise<{ success: boolean; recordingId: string }> {
    try {
      const response = await request.post<{ success: boolean; recordingId: string }>(`/meetings/rooms/${meetingId}/recording/start`);
      return response;
    } catch (error) {
      console.error(`开始会议录制失败:`, error);
      throw error;
    }
  },
  
  // 停止录制会议
  async stopRecording(meetingId: string): Promise<{ success: boolean; recordingUrl: string }> {
    try {
      const response = await request.post<{ success: boolean; recordingUrl: string }>(`/meetings/rooms/${meetingId}/recording/stop`);
      return response;
    } catch (error) {
      console.error(`停止会议录制失败:`, error);
      throw error;
    }
  },
  
  // 获取会议参与者列表
  async getMeetingParticipants(meetingId: string): Promise<MeetingParticipant[]> {
    try {
      const response = await request.get<MeetingParticipant[]>(`/meetings/rooms/${meetingId}/participants`);
      return response;
    } catch (error) {
      console.error(`获取会议参与者列表失败:`, error);
      throw error;
    }
  },
};