import React, { useState, useRef, useEffect } from 'react';
import { Send, Languages } from 'lucide-react';
import type { User } from '../types/index';

interface Message {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  originalContent?: string;
  originalLanguage?: string;
  timestamp: Date;
  translated?: boolean;
}

interface ChatPageProps {
  currentUser: User;
}

export function ChatPage({ currentUser }: ChatPageProps): React.JSX.Element {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      userId: '2',
      userName: 'Sarah Johnson',
      userAvatar: '👩‍💻',
      content: '早上好！今天的站会几点开始？',
      originalContent: 'Good morning! What time is the standup today?',
      originalLanguage: 'en',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      translated: true,
    },
    {
      id: '2',
      userId: '4',
      userName: 'Maria Garcia',
      userAvatar: '👩‍🎨',
      content: '我刚刚更新了设计稿，大家可以看一下',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
    },
    {
      id: '3',
      userId: '3',
      userName: '李明',
      userAvatar: '👨‍💻',
      content: 'API已经部署完成了，可以开始测试',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [autoTranslate, setAutoTranslate] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (): void => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar || '',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex-1 flex flex-col bg-white h-full w-full overflow-hidden">
      {/* 聊天标题栏 */}
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-slate-900 font-semibold text-lg">团队聊天</h1>
            <p className="text-slate-600 text-sm mt-1">与团队保持联系</p>
          </div>
          <button
            onClick={() => setAutoTranslate(!autoTranslate)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              autoTranslate ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            title="自动翻译"
          >
            <Languages className="w-4 h-4" />
            <span className="text-sm">翻译</span>
          </button>
        </div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 min-h-0">
        {messages.map((message) => {
          const isCurrentUser = message.userId === currentUser.id;
          
          return (
            <div
              key={message.id}
              className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}
            >
              {/* 用户头像 */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl">
                  {message.userAvatar}
                </div>
              </div>

              {/* 消息内容 */}
              <div className={`flex-1 ${isCurrentUser ? 'flex flex-col items-end' : ''} max-w-2xl`}>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className={`text-sm font-medium text-slate-900 ${isCurrentUser ? 'order-2' : ''}`}>
                    {message.userName}
                  </span>
                  <span className={`text-xs text-slate-400 ${isCurrentUser ? 'order-1' : ''}`}>
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                
                <div className={`inline-block rounded-lg px-4 py-2 ${
                  isCurrentUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-900'
                }`}>
                  <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                  
                  {/* 翻译标记 */}
                  {message.translated && autoTranslate && (
                    <div className={`mt-2 pt-2 border-t ${
                      isCurrentUser ? 'border-blue-500/30' : 'border-slate-300'
                    }`}>
                      <div className="flex items-center gap-1">
                        <Languages className={`w-3 h-3 ${isCurrentUser ? 'text-blue-200' : 'text-slate-500'}`} />
                        <span className={`text-xs ${isCurrentUser ? 'text-blue-200' : 'text-slate-500'}`}>
                          由 {message.originalLanguage === 'en' ? '英语' : message.originalLanguage} 翻译
                        </span>
                      </div>
                      <p className={`text-xs mt-1 italic ${isCurrentUser ? 'text-blue-100' : 'text-slate-600'}`}>
                        &quot;{message.originalContent}&quot;
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入框 */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 flex-shrink-0">
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          <div className="flex-1 bg-white rounded-lg border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 shadow-sm">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入消息... (Enter发送，Shift+Enter换行)"
              className="w-full px-4 py-3 bg-transparent resize-none focus:outline-none text-sm text-black placeholder:text-slate-400"
              rows={2}
            />
          </div>
          
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim()}
            className="flex-shrink-0 w-12 h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center transition-colors shadow-md"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        {autoTranslate && (
          <p className="text-xs text-slate-500 mt-3 flex items-center gap-1 max-w-4xl mx-auto">
            <Languages className="w-3 h-3" />
            自动翻译已启用 - 消息将自动翻译为接收者的语言
          </p>
        )}
      </div>
    </div>
  );
}

