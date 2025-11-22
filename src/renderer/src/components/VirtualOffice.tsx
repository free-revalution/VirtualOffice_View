import { useState } from 'react';
import { UserAvatar } from './UserAvatar';
import { Coffee, Wifi, Monitor } from 'lucide-react';

interface User {
  id: string;
  name: string;
  avatar: string;
  avatarType?: 'emoji' | 'image';
  status: 'online' | 'away' | 'busy' | 'offline';
  role: string;
  position?: { x: number; y: number };
}

interface VirtualOfficeProps {
  currentUser: User;
  onPositionChange: (position: { x: number; y: number }) => void;
}

export function VirtualOffice({ currentUser, onPositionChange }: VirtualOfficeProps) {
  const [users] = useState<User[]>([
    {
      id: '1',
      name: '张三',
      avatar: '👨‍💼',
      avatarType: 'emoji',
      status: 'online',
      role: '产品经理',
      position: { x: 20, y: 30 },
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      avatar: '👩‍💻',
      avatarType: 'emoji',
      status: 'online',
      role: 'Frontend Developer',
      position: { x: 45, y: 25 },
    },
    {
      id: '3',
      name: '李明',
      avatar: '👨‍💻',
      avatarType: 'emoji',
      status: 'busy',
      role: '后端开发',
      position: { x: 70, y: 35 },
    },
    {
      id: '4',
      name: 'Maria Garcia',
      avatar: '👩‍🎨',
      avatarType: 'emoji',
      status: 'online',
      role: 'UI/UX Designer',
      position: { x: 30, y: 60 },
    },
    {
      id: '5',
      name: '王芳',
      avatar: '👩‍💼',
      avatarType: 'emoji',
      status: 'away',
      role: '项目经理',
      position: { x: 60, y: 55 },
    },
  ]);

  // 更新当前用户的位置以便显示
  const allUsers = users.map(user => 
    user.id === currentUser.id ? currentUser : user
  );

  return (
    <div className="flex-1 relative bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden h-full w-full">
      {/* 办公室背景装饰 */}
      <div className="absolute inset-0">
        {/* 工作区域 */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/40 rounded-lg backdrop-blur-sm border border-white/60 flex items-center justify-center">
          <Monitor className="w-12 h-12 text-slate-400" />
        </div>
        
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/40 rounded-lg backdrop-blur-sm border border-white/60 flex items-center justify-center">
          <Coffee className="w-12 h-12 text-slate-400" />
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-40 h-32 bg-white/40 rounded-lg backdrop-blur-sm border border-white/60 flex items-center justify-center">
          <Wifi className="w-12 h-12 text-slate-400" />
        </div>

        {/* 网格背景 */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: 'linear-gradient(to right, #cbd5e1 1px, transparent 1px), linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
        </div>
      </div>

      {/* 用户虚拟形象 */}
      {allUsers.map((user) => (
        <UserAvatar
          key={user.id}
          user={user}
          isCurrentUser={user.id === currentUser.id}
          onPositionChange={user.id === currentUser.id ? onPositionChange : undefined}
        />
      ))}

      {/* 顶部状态栏 */}
      <div className="absolute top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-white/60 px-6 py-3 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-slate-900 font-semibold">虚拟办公室</h1>
            <p className="text-slate-600 text-sm">{users.filter(u => u.status === 'online').length} 位同事在线</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-slate-600">已连接</span>
          </div>
        </div>
      </div>

      {/* 底部提示 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 border border-slate-200 shadow-lg z-10">
        <p className="text-sm text-slate-600">拖动你的虚拟形象移动位置 · 点击同事开始交流</p>
      </div>
    </div>
  );
}