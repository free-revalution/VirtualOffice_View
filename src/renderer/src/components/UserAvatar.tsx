import { useState, useRef } from 'react';
import { Video, MessageCircle, Phone, Move } from 'lucide-react';

interface User {
  id: string;
  name: string;
  avatar: string;
  avatarType?: 'emoji' | 'image';
  status: 'online' | 'away' | 'busy' | 'offline';
  role: string;
  position?: { x: number; y: number };
}

interface UserAvatarProps {
  user: User;
  isCurrentUser: boolean;
  onPositionChange?: (position: { x: number; y: number }) => void;
}

export function UserAvatar({ user, isCurrentUser, onPositionChange }: UserAvatarProps) {
  const [showActions, setShowActions] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number } | null>(null);

  const statusColors = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
    offline: 'bg-slate-400',
  };

  const position = user.position || { x: 50, y: 50 };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isCurrentUser || !onPositionChange) return;
    
    e.preventDefault();
    setIsDragging(true);
    
    const container = e.currentTarget.parentElement;
    if (!container) return;
    
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: position.x,
      startPosY: position.y,
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current || !container) return;
      
      const containerRect = container.getBoundingClientRect();
      const deltaX = e.clientX - dragRef.current.startX;
      const deltaY = e.clientY - dragRef.current.startY;
      
      const deltaXPercent = (deltaX / containerRect.width) * 100;
      const deltaYPercent = (deltaY / containerRect.height) * 100;
      
      let newX = dragRef.current.startPosX + deltaXPercent;
      let newY = dragRef.current.startPosY + deltaYPercent;
      
      // 限制在边界内
      newX = Math.max(5, Math.min(95, newX));
      newY = Math.max(10, Math.min(90, newY));
      
      onPositionChange({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      className="absolute group"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: isDragging ? 50 : 10,
        pointerEvents: 'auto',
      }}
      onMouseEnter={() => !isCurrentUser && !isDragging && setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* 虚拟形象 */}
      <div className="relative">
        <div 
          className={`w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center text-4xl transition-all ${
            isCurrentUser 
              ? `ring-4 ring-blue-500 ${isDragging ? 'cursor-grabbing scale-110' : 'cursor-grab'}` 
              : 'cursor-pointer'
          } ${!isCurrentUser && 'hover:scale-110'} ${isDragging ? 'shadow-2xl' : ''}`}
          onMouseDown={handleMouseDown}
        >
          {user.avatarType === 'image' ? (
            <img 
              src={user.avatar} 
              alt={user.name}
              className="w-full h-full rounded-full object-cover"
              draggable={false}
            />
          ) : (
            user.avatar
          )}
        </div>
        
        {/* 状态指示器 */}
        <div className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white ${statusColors[user.status]}`} />
        
        {/* 可拖动提示 */}
        {isCurrentUser && !isDragging && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap flex items-center gap-1">
            <Move className="w-3 h-3" />
            拖动移动
          </div>
        )}
      </div>

      {/* 用户信息 */}
      <div className="mt-2 text-center pointer-events-none">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-md">
          <p className="text-sm text-slate-900">{user.name}</p>
          <p className="text-xs text-slate-600">{user.role}</p>
        </div>
      </div>

      {/* 快捷操作按钮 */}
      {showActions && !isCurrentUser && !isDragging && (
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-50 transition-colors group/btn">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap">
              发送消息
            </span>
          </button>
          
          <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-50 transition-colors group/btn">
            <Phone className="w-5 h-5 text-green-600" />
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap">
              语音通话
            </span>
          </button>
          
          <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-purple-50 transition-colors group/btn">
            <Video className="w-5 h-5 text-purple-600" />
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap">
              视频会议
            </span>
          </button>
        </div>
      )}
    </div>
  );
}