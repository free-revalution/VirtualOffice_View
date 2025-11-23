import React, { useState, useEffect } from 'react';
import { authService } from './api/services/auth.service';
import { handleApiError } from './api/utils';
import { VirtualOffice } from './components/VirtualOffice';
import { OnlinePanel } from './components/OnlinePanel';
import { ChatPage } from './components/ChatPage';
import { MeetingRoom } from './components/MeetingRoom';
import { AvatarCreator } from './components/AvatarCreator';
import { Auth } from './components/Auth';
import { Video, MessageSquare, Users, Settings, LogOut, Menu, X, Home } from 'lucide-react';
import type { User } from './types/index';

export default function App(): React.JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState<'office' | 'meeting' | 'chat'>('office');
  const [showAvatarCreator, setShowAvatarCreator] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // 检测屏幕宽度变化，用于响应式设计
  useEffect(() => {
    const handleResize = (): void => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = (user: { id: string; name: string; email: string; role: string }): void => {
    // 转换为系统需要的User类型，确保包含所有必需字段
    const formattedUser: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: '', // 设置默认头像
      status: 'online', // 设置默认状态
      role: user.role
    };
    setCurrentUser(formattedUser);
      setIsAuthenticated(true);
  };

  const handleLogout = async (): Promise<void> => {
    if (confirm('确定要退出登录吗？')) {
      try {
        await authService.logout();
        setIsAuthenticated(false);
        setCurrentUser(null);
      } catch (error) {
        console.error('退出登录失败:', error);
        handleApiError(error);
        // 即使API调用失败也清除本地状态
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    }
  };

  const updateUserPosition = (position: { x: number; y: number }): void => {
    if (currentUser) {
      setCurrentUser(prev => prev ? ({ ...prev, position }) : null);
    }
  };

  // 如果未登录，显示登录页面
  if (!isAuthenticated || !currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-full w-full bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden relative">
      {/* 移动端菜单按钮 */}
      {isMobile && (
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="absolute top-4 left-4 z-50 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-slate-900"
          title={isMobileMenuOpen ? "关闭菜单" : "打开菜单"}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      )}
      
      {/* 左侧导航栏 - 桌面版 */}
      {!isMobile && (
        <div className="w-16 bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col items-center py-4 gap-4 flex-shrink-0 border-r border-slate-700 shadow-lg">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center mb-4 shadow-md hover:shadow-lg transition-shadow">
            <Home className="w-6 h-6 text-white" />
          </div>
          
          <NavButton 
            icon={<Users className="w-5 h-5" />} 
            active={activeView === 'office'} 
            onClick={() => setActiveView('office')} 
            title="办公室"
          />
          
          <NavButton 
            icon={<Video className="w-5 h-5" />} 
            active={activeView === 'meeting'} 
            onClick={() => setActiveView('meeting')} 
            title="会议室"
          />
          
          <NavButton 
            icon={<MessageSquare className="w-5 h-5" />} 
            active={activeView === 'chat'} 
            onClick={() => setActiveView('chat')} 
            title="团队聊天"
          />
          
          <div className="flex-1" />
          
          <NavButton 
            icon={<Settings className="w-5 h-5" />} 
            active={false} 
            onClick={() => setShowAvatarCreator(true)} 
            title="设置"
          />

          <NavButton 
            icon={<LogOut className="w-5 h-5" />} 
            active={false} 
            onClick={handleLogout} 
            title="退出登录"
            danger
          />
        </div>
      )}
      
      {/* 移动端导航菜单 */}
      {isMobile && (
        <div className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className={`absolute left-0 top-0 bottom-0 w-64 bg-slate-900 transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col py-4 px-2 shadow-xl`}>
            <div className="w-full h-12 flex items-center justify-center mb-6 border-b border-slate-800">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
            </div>
            
            <MobileNavButton 
              icon={<Users className="w-5 h-5" />} 
              label="办公室"
              active={activeView === 'office'} 
              onClick={() => {setActiveView('office'); setIsMobileMenuOpen(false);}}
            />
            
            <MobileNavButton 
              icon={<Video className="w-5 h-5" />} 
              label="会议室"
              active={activeView === 'meeting'} 
              onClick={() => {setActiveView('meeting'); setIsMobileMenuOpen(false);}}
            />
            
            <MobileNavButton 
              icon={<MessageSquare className="w-5 h-5" />} 
              label="团队聊天"
              active={activeView === 'chat'} 
              onClick={() => {setActiveView('chat'); setIsMobileMenuOpen(false);}}
            />
            
            <div className="flex-1" />
            
            <MobileNavButton 
              icon={<Settings className="w-5 h-5" />} 
              label="设置"
              active={false} 
              onClick={() => {setShowAvatarCreator(true); setIsMobileMenuOpen(false);}}
            />

            <MobileNavButton 
              icon={<LogOut className="w-5 h-5" />} 
              label="退出登录"
              active={false} 
              onClick={() => {handleLogout(); setIsMobileMenuOpen(false);}}
              danger
            />
          </div>
        </div>
      )}

      {/* 主内容区域 */}
      <div className={`flex-1 flex min-w-0 overflow-hidden ${isMobileMenuOpen ? 'pointer-events-none' : ''}`}>
        {activeView === 'chat' ? (
          /* 聊天页面 - 全屏显示 */
          currentUser && <ChatPage currentUser={currentUser} />
        ) : (
          <>
            {/* 办公室或会议室视图 */}
            {activeView === 'office' ? (
              currentUser && <VirtualOffice 
                currentUser={currentUser} 
                onPositionChange={updateUserPosition}
              />
            ) : (
              currentUser && <MeetingRoom currentUser={currentUser} />
            )}
            
            {/* 右侧面板 - 只在办公室或会议室时显示（桌面版） */}
            {!isMobile && (
              <div className="w-80 border-l border-slate-200 bg-white shadow-sm flex flex-col flex-shrink-0 h-full overflow-hidden transition-all duration-300">
                {currentUser && <OnlinePanel currentUser={currentUser} />}
              </div>
            )}
          </>
        )}
      </div>

      {/* 虚拟形象创建器 */}
      {showAvatarCreator && currentUser && (
        <AvatarCreator
          currentUser={currentUser}
          onSave={(updatedUser) => {
            // 确保更新的用户对象包含所有必需字段
            setCurrentUser({
              ...currentUser,
              ...updatedUser,
              email: (currentUser?.email || '')
            });
            setShowAvatarCreator(false);
          }}
          onClose={() => setShowAvatarCreator(false)}
        />
      )}
    </div>
  );
}

// 桌面版导航按钮组件
function NavButton({ icon, active, onClick, title, danger = false }: { icon: React.ReactNode; active: boolean; onClick: () => void; title: string; danger?: boolean }): React.JSX.Element {
  return (
    <button
      onClick={onClick}
      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 group relative ${danger ? 
        'hover:bg-red-900/30 text-slate-400 hover:text-red-400' : 
        (active 
          ? 'bg-gradient-to-br from-blue-700 to-indigo-700 text-white shadow-md' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white')
      }`}
      title={title}
    >
      {icon}
      {active && (
        <span className="absolute right-0 w-1 h-6 bg-white rounded-l-lg" />
      )}
      {/* 悬停时显示工具提示 */}
      <span className="absolute left-full ml-3 whitespace-nowrap bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        {title}
      </span>
    </button>
  );
}

// 移动端导航按钮组件
function MobileNavButton({ icon, label, active, onClick, danger = false }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void; danger?: boolean }): React.JSX.Element {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${danger ? 
        'hover:bg-red-900/30 text-slate-400 hover:text-red-400' : 
        (active 
          ? 'bg-gradient-to-r from-blue-900/50 to-indigo-900/50 text-white' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white')
      }`}
    >
      <div className="flex-shrink-0">{icon}</div>
      <span className="font-medium">{label}</span>
    </button>
  );
}
