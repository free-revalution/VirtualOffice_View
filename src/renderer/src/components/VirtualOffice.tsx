import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { UserAvatar } from './UserAvatar';
import { Coffee, Wifi, Monitor, AlertCircle, RefreshCw } from 'lucide-react';
import { virtualSpaceService } from '../api';
import { handleApiError } from '../api/utils';
import type { User } from '../types/index';

interface VirtualOfficeProps {
  currentUser: User;
  onPositionChange: (position: { x: number; y: number }) => void;
}

// 防抖函数，使用更精确的类型定义
function debounce(func: (position: { x: number; y: number }) => Promise<void>, wait: number): (position: { x: number; y: number }) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (position: { x: number; y: number }) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(position);
    }, wait);
  };
}

export function VirtualOffice({ currentUser, onPositionChange }: VirtualOfficeProps): React.JSX.Element {
  // 使用useState管理用户数据和加载状态
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [spaceId] = useState<string>('main-virtual-office'); // 默认虚拟空间ID

  // 创建防抖的位置更新函数
    const debouncedPositionUpdate = useMemo(() => {
      return debounce(async (position: { x: number; y: number }) => {
        try {
          // 调用API更新位置
          if (virtualSpaceService.updatePosition) {
            await virtualSpaceService.updatePosition({
              spaceId,
              x: position.x,
              y: position.y,
              userId: currentUser.id
            });
          }
        // 通知父组件位置更新
        if (onPositionChange) {
          onPositionChange(position);
        }
      } catch (err) {
        console.error('更新位置失败:', err);
      }
    }, 300);
  }, [onPositionChange, currentUser.id, spaceId]);
  
  // 获取虚拟空间数据
  const fetchVirtualSpaceData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // 加入虚拟空间
      await virtualSpaceService.enterSpace(spaceId);
      
      // 获取空间内的所有用户
      // 获取空间成员
      const members = await virtualSpaceService.getSpaceMembers(spaceId);
      // 转换MemberPresence为User类型
      const usersList = members.map(member => ({
        id: member.userId,
        name: `用户${member.userId}`,
        email: '',
        avatar: '👤',
        role: '团队成员',
        status: member.status || 'offline',
        position: member.position
      } as User));
      setUsers(usersList);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('获取虚拟空间数据失败:', err);
    } finally {
      setLoading(false);
    }
  }, [spaceId]);
  
  // 组件挂载时获取虚拟空间数据
  useEffect(() => {
    fetchVirtualSpaceData();
    
    // 组件卸载时离开虚拟空间
    return () => {
      virtualSpaceService.leaveSpace(spaceId).catch(err => {
        console.error('离开虚拟空间失败:', err);
      });
    };
  }, [fetchVirtualSpaceData, spaceId]);
  
  // 定期刷新用户数据
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        fetchVirtualSpaceData();
      }
    }, 15000); // 每15秒刷新一次
    
    return () => clearInterval(interval);
  }, [fetchVirtualSpaceData, loading]);
  
  // 使用useMemo优化派生数据，避免每次渲染都重新计算
  const allUsers = useMemo(() => {
    // 确保当前用户的位置总是最新的
    const usersWithCurrentUser = users.map(user => 
      user.id === currentUser.id ? currentUser : user
    );
    
    // 如果当前用户不在列表中，添加进去
    if (!usersWithCurrentUser.some(user => user.id === currentUser.id)) {
      usersWithCurrentUser.push(currentUser);
    }
    
    return usersWithCurrentUser;
  }, [users, currentUser]);
  
  // 过滤出在线用户用于显示
  const onlineUsers = useMemo(() => {
    return allUsers.filter(user => user.status === 'online');
  }, [allUsers]);
  
  // 重试获取数据
  const handleRetry = useCallback((): void => {
    fetchVirtualSpaceData();
  }, [fetchVirtualSpaceData]);
  
  // 使用useCallback优化位置更新函数
  const handlePositionChange = useCallback((position: { x: number; y: number }): void => {
    // 使用防抖函数通知父组件更新位置
    debouncedPositionUpdate(position);
  }, [debouncedPositionUpdate]);

  return (
    <div className="flex-1 relative bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden h-full w-full">
      {/* 加载状态 */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-slate-700 font-medium">加载虚拟办公室...</p>
          </div>
        </div>
      )}
      
      {/* 错误状态 */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md flex flex-col items-center text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">连接失败</h3>
            <p className="text-slate-600 mb-6">{error}</p>
            <button 
              onClick={handleRetry}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
            >
              重试
            </button>
          </div>
        </div>
      )}
      
      {/* 办公室背景装饰 */}
      <div className="absolute inset-0">
        {/* 工作区域 - 从后端获取或使用默认值 */}
        <WorkArea 
          x="10%" y="15%" 
          color="blue" 
          icon={<Monitor className="w-12 h-12" />}
        />
        
        <WorkArea 
          x="80%" y="15%" 
          color="green" 
          icon={<Coffee className="w-12 h-12" />}
        />
        
        <WorkArea 
          x="45%" y="70%" 
          color="purple" 
          icon={<Wifi className="w-12 h-12" />}
        />

        {/* 网格背景 */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: 'linear-gradient(to right, #cbd5e1 1px, transparent 1px), linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        {/* 连接点和连线 - 增强视觉效果 */}
        <ConnectionLines />
      </div>

      {/* 用户虚拟形象 - 使用优化后的处理函数 */}
      {allUsers.map((user) => (
        <UserAvatar
          key={user.id}
          user={{ ...user, avatar: user.avatar || '' }}
          isCurrentUser={user.id === currentUser.id}
          onPositionChange={user.id === currentUser.id ? handlePositionChange : undefined}
        />
      ))}

      {/* 顶部状态栏 - 优化设计和性能 */}
      <div className="absolute top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-white/60 px-6 py-3 z-10 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-slate-900 font-semibold">虚拟办公室</h1>
            <p className="text-slate-600 text-sm">{onlineUsers.length} 位同事在线</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusIndicator />
          </div>
        </div>
      </div>

      {/* 底部提示 - 优化设计 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 border border-slate-200 shadow-lg z-10 animate-fade-in">
        <p className="text-sm text-slate-600">拖动你的虚拟形象移动位置 · 点击同事开始交流</p>
      </div>
    </div>
  );
}

// 工作区域组件 - 提高代码复用性
function WorkArea({ x, y, color, icon }: {
  x: string;
  y: string;
  color: 'blue' | 'green' | 'purple';
  icon: React.ReactNode;
}): React.JSX.Element {
  const colorClasses = {
    blue: 'bg-blue-100/50 border-blue-200 hover:bg-blue-200/50',
    green: 'bg-green-100/50 border-green-200 hover:bg-green-200/50',
    purple: 'bg-purple-100/50 border-purple-200 hover:bg-purple-200/50'
  }[color];
  
  return (
    <div className={`absolute left-[${x}] top-[${y}] w-32 h-32 ${colorClasses} rounded-lg backdrop-blur-md border flex items-center justify-center shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer`}>
      {icon}
    </div>
  );
}

// 状态指示器组件
function StatusIndicator(): React.JSX.Element {
  return (
    <div className="flex items-center gap-2 bg-slate-100/70 px-3 py-1.5 rounded-full">
      <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
      <span className="text-sm font-medium text-slate-700">已连接</span>
    </div>
  );
}

// 连接线路组件
function ConnectionLines(): React.JSX.Element {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <line x1="15%" y1="25%" x2="45%" y2="70%" stroke="url(#lineGradient)" strokeWidth="1" />
      <line x1="85%" y1="25%" x2="45%" y2="70%" stroke="url(#lineGradient)" strokeWidth="1" />
      <line x1="15%" y1="25%" x2="85%" y2="25%" stroke="url(#lineGradient)" strokeWidth="1" strokeDasharray="5,5" />
    </svg>
   );
 }