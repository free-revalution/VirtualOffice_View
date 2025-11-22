import { useState } from 'react';
import { VirtualOffice } from './components/VirtualOffice';
import { OnlinePanel } from './components/OnlinePanel';
import { ChatPage } from './components/ChatPage';
import { MeetingRoom } from './components/MeetingRoom';
import { AvatarCreator } from './components/AvatarCreator';
import { Auth } from './components/Auth';
import { Video, MessageSquare, Users, Settings, LogOut } from 'lucide-react';
import type { User } from './types';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState<'office' | 'meeting' | 'chat'>('office');
  const [showAvatarCreator, setShowAvatarCreator] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (userData: { id: string; name: string; email: string }) => {
    // 初始化用户信息
    const user: User = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      avatar: '👨‍💼',
      avatarType: 'emoji',
      status: 'online',
      role: '团队成员',
      position: { x: 20, y: 30 },
    };
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    if (confirm('确定要退出登录吗？')) {
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
  };

  const updateUserPosition = (position: { x: number; y: number }) => {
    if (currentUser) {
      setCurrentUser(prev => prev ? ({ ...prev, position }) : null);
    }
  };

  // 如果未登录，显示登录页面
  if (!isAuthenticated || !currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-full w-full bg-slate-50 overflow-hidden">
      {/* 左侧导航栏 */}
      <div className="w-16 bg-slate-900 flex flex-col items-center py-4 gap-4 flex-shrink-0">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
          <Users className="w-6 h-6 text-white" />
        </div>
        
        <button
          onClick={() => setActiveView('office')}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
            activeView === 'office' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
          title="办公室"
        >
          <Users className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => setActiveView('meeting')}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
            activeView === 'meeting' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
          title="会议室"
        >
          <Video className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => setActiveView('chat')}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
            activeView === 'chat' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
          title="团队聊天"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
        
        <div className="flex-1" />
        
        <button
          onClick={() => setShowAvatarCreator(true)}
          className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          title="设置"
        >
          <Settings className="w-5 h-5" />
        </button>

        <button
          onClick={handleLogout}
          className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          title="退出登录"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex min-w-0 overflow-hidden">
        {activeView === 'chat' ? (
          /* 聊天页面 - 全屏显示 */
          <ChatPage currentUser={currentUser} />
        ) : (
          <>
            {/* 办公室或会议室视图 */}
            {activeView === 'office' ? (
              <VirtualOffice 
                currentUser={currentUser} 
                onPositionChange={updateUserPosition}
              />
            ) : (
              <MeetingRoom currentUser={currentUser} />
            )}
            
            {/* 右侧面板 - 只在办公室或会议室时显示 */}
            <div className="w-80 border-l border-slate-200 bg-white flex flex-col flex-shrink-0 h-full overflow-hidden">
              <OnlinePanel currentUser={currentUser} />
            </div>
          </>
        )}
      </div>

      {/* 虚拟形象创建器 */}
      {showAvatarCreator && currentUser && (
        <AvatarCreator
          currentUser={currentUser}
          onSave={(updatedUser) => {
            setCurrentUser(updatedUser);
            setShowAvatarCreator(false);
          }}
          onClose={() => setShowAvatarCreator(false)}
        />
      )}
    </div>
  );
}
