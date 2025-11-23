import { useState } from 'react';
import { Mic, MicOff, Video, VideoOff, Monitor, MonitorOff, PhoneOff, Users, Settings, Hand } from 'lucide-react';
import type { User } from '../types/index';

interface MeetingParticipant extends User {
  isMuted: boolean;
  isVideoOn: boolean;
  isSharingScreen: boolean;
  isHandRaised: boolean;
}

interface MeetingRoomProps {
  currentUser: User;
}

export function MeetingRoom({ currentUser }: MeetingRoomProps): React.JSX.Element {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);

  const [participants] = useState<MeetingParticipant[]>([
    {
      id: currentUser.id,
      name: currentUser.name,
      avatar: currentUser.avatar || '',
      email: currentUser.email || '',
      status: currentUser.status,
      role: currentUser.role,
      isMuted: false,
      isVideoOn: true,
      isSharingScreen: false,
      isHandRaised: false,
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      avatar: '👩‍💻',
      email: 'sarah@example.com',
      status: 'online',
      role: 'Frontend Developer',
      isMuted: false,
      isVideoOn: true,
      isSharingScreen: false,
      isHandRaised: false,
    },
    {
      id: '3',
      name: '李明',
      avatar: '👨‍💻',
      email: 'liming@example.com',
      status: 'online',
      role: '后端开发',
      isMuted: true,
      isVideoOn: false,
      isSharingScreen: false,
      isHandRaised: false,
    },
    {
      id: '4',
      name: 'Maria Garcia',
      avatar: '👩‍🎨',
      email: 'maria@example.com',
      status: 'online',
      role: 'UI/UX Designer',
      isMuted: false,
      isVideoOn: true,
      isSharingScreen: true,
      isHandRaised: false,
    },
  ]);

  const toggleScreenShare = (): void => {
    setIsSharingScreen(!isSharingScreen);
  };

  const leaveMeeting = (): void => {
    if (confirm('确定要离开会议吗？')) {
      alert('已离开会议');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-900 h-full w-full overflow-hidden">
      {/* 顶部信息栏 */}
      <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white">团队快速会议</h1>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-400">{participants.length} 位参会者</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm text-slate-400">进行中</span>
              </div>
            </div>
          </div>
          
          <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm flex items-center gap-2 transition-colors">
            <Settings className="w-4 h-4" />
            会议设置
          </button>
        </div>
      </div>

      {/* 主视频区域 */}
      <div className="flex-1 p-6 overflow-y-auto min-h-0">
        {/* 共享屏幕视图 */}
        {participants.some(p => p.isSharingScreen) && (
          <div className="mb-6">
            <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
              <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                <div className="text-center">
                  <Monitor className="w-16 h-16 text-slate-400 mx-auto mb-3" />
                  <p className="text-white">
                    {participants.find(p => p.isSharingScreen)?.name} 正在共享屏幕
                  </p>
                  <p className="text-sm text-slate-400 mt-1">屏幕共享内容</p>
                </div>
              </div>
              <div className="px-4 py-2 bg-slate-900/50 border-t border-slate-700">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-slate-300">
                    {participants.find(p => p.isSharingScreen)?.name} 的屏幕
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 参会者视频网格 */}
        <div className="grid grid-cols-2 gap-4">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="relative bg-slate-800 rounded-xl overflow-hidden border border-slate-700 aspect-video"
            >
              {/* 视频/头像 */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
                {participant.isVideoOn ? (
                  <div className="text-center">
                    <div className="text-6xl mb-2">{participant.avatar}</div>
                    <p className="text-sm text-slate-400">摄像头已开启</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-4xl">{participant.avatar}</span>
                    </div>
                    <p className="text-sm text-slate-400">摄像头已关闭</p>
                  </div>
                )}
              </div>

              {/* 参会者信息 */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/90 to-transparent p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm">{participant.name}</span>
                    {participant.id === currentUser.id && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded">你</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {!participant.isMuted ? (
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                        <Mic className="w-3 h-3 text-white" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 bg-red-500/80 rounded-full flex items-center justify-center">
                        <MicOff className="w-3 h-3 text-white" />
                      </div>
                    )}
                    
                    {participant.isHandRaised && (
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Hand className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 共享屏幕标记 */}
              {participant.isSharingScreen && (
                <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                  <Monitor className="w-3 h-3" />
                  共享中
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 底部控制栏 */}
      <div className="px-6 py-4 bg-slate-800 border-t border-slate-700 flex-shrink-0">
        <div className="flex items-center justify-center gap-3">
          {/* 麦克风 */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-700 hover:bg-slate-600'
            }`}
            title={isMuted ? '取消静音' : '静音'}
          >
            {isMuted ? (
              <MicOff className="w-5 h-5 text-white" />
            ) : (
              <Mic className="w-5 h-5 text-white" />
            )}
          </button>

          {/* 摄像头 */}
          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              !isVideoOn ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-700 hover:bg-slate-600'
            }`}
            title={isVideoOn ? '关闭摄像头' : '开启摄像头'}
          >
            {isVideoOn ? (
              <Video className="w-5 h-5 text-white" />
            ) : (
              <VideoOff className="w-5 h-5 text-white" />
            )}
          </button>

          {/* 共享屏幕 */}
          <button
            onClick={toggleScreenShare}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              isSharingScreen ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-700 hover:bg-slate-600'
            }`}
            title={isSharingScreen ? '停止共享' : '共享屏幕'}
          >
            {isSharingScreen ? (
              <MonitorOff className="w-5 h-5 text-white" />
            ) : (
              <Monitor className="w-5 h-5 text-white" />
            )}
          </button>

          {/* 举手 */}
          <button
            onClick={() => setIsHandRaised(!isHandRaised)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              isHandRaised ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-slate-700 hover:bg-slate-600'
            }`}
            title={isHandRaised ? '放下手' : '举手'}
          >
            <Hand className="w-5 h-5 text-white" />
          </button>

          {/* 离开会议 */}
          <button
            onClick={leaveMeeting}
            className="w-12 h-12 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors ml-3"
            title="离开会议"
          >
            <PhoneOff className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* 控制说明 */}
        <div className="flex items-center justify-center gap-6 mt-3 text-xs text-slate-400">
          <span>静音: {isMuted ? '开启' : '关闭'}</span>
          <span>视频: {isVideoOn ? '开启' : '关闭'}</span>
          <span>共享: {isSharingScreen ? '进行中' : '未开启'}</span>
        </div>
      </div>
    </div>
  );
}
