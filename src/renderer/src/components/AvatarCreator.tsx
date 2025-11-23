import { useState, useRef } from 'react';
import { X, Save, Upload, Trash2 } from 'lucide-react';
import type { User } from '../types/index';

// 扩展User接口以包含组件所需的额外字段
interface UserWithAvatarType extends User {
  avatarType?: 'emoji' | 'image';
}

interface AvatarCreatorProps {
  currentUser: UserWithAvatarType;
  onSave: (user: User) => void;
  onClose: () => void;
}

const AVATAR_OPTIONS = [
  { category: '商务', emojis: ['👨‍💼', '👩‍💼', '🧑‍💼', '👔', '💼'] },
  { category: '技术', emojis: ['👨‍💻', '👩‍💻', '🧑‍💻', '💻', '⌨️'] },
  { category: '设计', emojis: ['👨‍🎨', '👩‍🎨', '🧑‍🎨', '🎨', '✏️'] },
  { category: '其他', emojis: ['👨', '👩', '🧑', '😊', '🙂', '😎', '🤓', '🧐'] },
];

const STATUS_OPTIONS = [
  { value: 'online' as const, label: '在线', color: 'bg-green-500' },
  { value: 'away' as const, label: '离开', color: 'bg-yellow-500' },
  { value: 'busy' as const, label: '忙碌', color: 'bg-red-500' },
  { value: 'offline' as const, label: '离线', color: 'bg-slate-400' },
];

export function AvatarCreator({ currentUser, onSave, onClose }: AvatarCreatorProps) {
  const [name, setName] = useState(currentUser.name);
  const [role, setRole] = useState(currentUser.role);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [avatarType, setAvatarType] = useState<'emoji' | 'image'>(currentUser.avatarType || 'emoji');
  const [status, setStatus] = useState<'online' | 'offline' | 'away' | 'busy'>(currentUser.status || 'offline');
  const [uploadedImage, setUploadedImage] = useState<string | null>(
    currentUser.avatarType === 'image' && currentUser.avatar ? currentUser.avatar : null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件');
      return;
    }

    // 验证文件大小 (最大 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedImage(result);
      setAvatar(result);
      setAvatarType('image');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setAvatar('👨‍💼');
    setAvatarType('emoji');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setAvatar(emoji);
    setAvatarType('emoji');
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    // 创建不包含avatarType的用户对象，以匹配User接口
    const userToSave = {
      ...currentUser,
      name,
      role,
      avatar,
      status,
    };
    // 删除可能存在的avatarType属性
    delete (userToSave as any).avatarType;
    onSave(userToSave);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* 标题栏 */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-slate-900">编辑虚拟形象</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 hover:bg-slate-100 rounded-lg flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 当前形象预览 */}
          <div className="flex flex-col items-center gap-4 py-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden">
                {avatarType === 'image' && uploadedImage ? (
                  <img 
                    src={uploadedImage} 
                    alt="Avatar preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-6xl">{avatar}</span>
                )}
              </div>
              <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white ${STATUS_OPTIONS.find(s => s.value === status)?.color || 'bg-slate-400'}`} />
            </div>
            <div className="text-center">
              <p className="text-slate-900">{name || '请输入姓名'}</p>
              <p className="text-sm text-slate-600">{role || '请输入职位'}</p>
            </div>
          </div>

          {/* 基本信息 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-700 mb-1.5">姓名</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="请输入您的姓名"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-1.5">职位</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="请输入您的职位"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* 状态选择 */}
          <div>
            <label className="block text-sm text-slate-700 mb-2">在线状态</label>
            <div className="grid grid-cols-4 gap-2">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setStatus(option.value)}
                  className={`px-4 py-2.5 rounded-lg border-2 transition-all ${
                    status === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${option.color}`} />
                    <span className="text-sm text-slate-900">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 头像上传 */}
          <div>
            <label className="block text-sm text-slate-700 mb-2">上传自定义头像</label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
              {uploadedImage ? (
                <div className="flex items-center gap-4">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded avatar" 
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-slate-900">已上传自定义头像</p>
                    <p className="text-xs text-slate-500 mt-1">点击下方按钮可更换或删除</p>
                  </div>
                  <button
                    onClick={handleRemoveImage}
                    className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                    title="删除图片"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <p className="text-sm text-slate-600 mb-1">点击上传或拖拽图片到此处</p>
                  <p className="text-xs text-slate-500">支持 JPG、PNG 格式，最大 5MB</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full mt-3 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                {uploadedImage ? '更换图片' : '选择图片'}
              </button>
            </div>
          </div>

          {/* 形象选择 */}
          <div>
            <label className="block text-sm text-slate-700 mb-3">
              或选择表情头像
              {avatarType === 'image' && uploadedImage && (
                <span className="ml-2 text-xs text-slate-500">(选择表情将替换上传的图片)</span>
              )}
            </label>
            <div className="space-y-4">
              {AVATAR_OPTIONS.map((category) => (
                <div key={category.category}>
                  <p className="text-xs text-slate-600 mb-2">{category.category}</p>
                  <div className="grid grid-cols-8 gap-2">
                    {category.emojis.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleEmojiSelect(emoji)}
                        className={`aspect-square rounded-lg border-2 text-2xl flex items-center justify-center transition-all hover:scale-110 ${
                          avatar === emoji && avatarType === 'emoji'
                            ? 'border-blue-500 bg-blue-50 scale-110'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 底部操作按钮 */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim() || !role.trim()}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4" />
            保存
          </button>
        </div>
      </div>
    </div>
  );
}