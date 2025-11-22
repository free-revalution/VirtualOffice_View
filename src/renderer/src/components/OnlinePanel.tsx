import { useState } from 'react';
import { Search, Users, Video } from 'lucide-react';

interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  role: string;
}

interface OnlinePanelProps {
  currentUser: User;
}

export function OnlinePanel({ currentUser }: OnlinePanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  const [users] = useState<User[]>([
    { id: '1', name: '张三', avatar: '👨‍💼', status: 'online', role: '产品经理' },
    { id: '2', name: 'Sarah Johnson', avatar: '👩‍💻', status: 'online', role: 'Frontend Developer' },
    { id: '3', name: '李明', avatar: '👨‍💻', status: 'busy', role: '后端开发' },
    { id: '4', name: 'Maria Garcia', avatar: '👩‍🎨', status: 'online', role: 'UI/UX Designer' },
    { id: '5', name: '王芳', avatar: '👩‍💼', status: 'away', role: '项目经理' },
    { id: '6', name: 'John Smith', avatar: '👨‍🔧', status: 'online', role: 'DevOps Engineer' },
  ]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const startQuickMeeting = () => {
    if (selectedUsers.length > 0) {
      alert(`正在邀请 ${selectedUsers.length} 位同事加入快速会议...`);
      setSelectedUsers([]);
    }
  };

  const statusColors = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
    offline: 'bg-slate-400',
  };

  const statusText = {
    online: '在线',
    away: '离开',
    busy: '忙碌',
    offline: '离线',
  };

  return (
    <div className="flex flex-col border-b border-slate-200 flex-shrink-0">
      {/* 标题栏 */}
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex-shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-slate-700" />
          <h2 className="text-slate-900 font-semibold">在线同事</h2>
          <span className="ml-auto bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
            {users.filter(u => u.status === 'online').length}
          </span>
        </div>
        
        {/* 搜索框 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="搜索同事..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* 用户列表 */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className={`px-4 py-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors ${
              selectedUsers.includes(user.id) ? 'bg-blue-50' : ''
            }`}
            onClick={() => toggleUserSelection(user.id)}
          >
            <div className="flex items-center gap-3">
              {/* 虚拟形象 */}
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl">
                  {user.avatar}
                </div>
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${statusColors[user.status]}`} />
              </div>

              {/* 用户信息 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-slate-900 truncate">{user.name}</p>
                  {selectedUsers.includes(user.id) && (
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-slate-600 truncate">{user.role}</p>
                  <span className="text-xs text-slate-400">·</span>
                  <span className={`text-xs ${
                    user.status === 'online' ? 'text-green-600' :
                    user.status === 'away' ? 'text-yellow-600' :
                    user.status === 'busy' ? 'text-red-600' :
                    'text-slate-400'
                  }`}>
                    {statusText[user.status]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 快速会议按钮 */}
      {selectedUsers.length > 0 && (
        <div className="p-3 bg-white border-t border-slate-200 flex-shrink-0">
          <button
            onClick={startQuickMeeting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 px-4 flex items-center justify-center gap-2 transition-colors"
          >
            <Video className="w-4 h-4" />
            <span className="text-sm">邀请 {selectedUsers.length} 位同事加入会议</span>
          </button>
        </div>
      )}
    </div>
  );
}
