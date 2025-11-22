import { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock, User, Eye, EyeOff, Sparkles, Users } from 'lucide-react';

interface AuthProps {
  onLogin: (user: { id: string; name: string; email: string }) => void;
}

export function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (isLogin) {
      // 登录逻辑
      if (!formData.email || !formData.password) {
        alert('请填写邮箱和密码');
        setIsSubmitting(false);
        return;
      }
      
      // 模拟登录
      onLogin({
        id: '1',
        name: formData.email.split('@')[0] || '用户',
        email: formData.email,
      });
    } else {
      // 注册逻辑
      if (!formData.name || !formData.email || !formData.password) {
        alert('请填写所有必填项');
        setIsSubmitting(false);
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        alert('两次输入的密码不一致');
        setIsSubmitting(false);
        return;
      }
      
      if (formData.password.length < 6) {
        alert('密码长度至少为6位');
        setIsSubmitting(false);
        return;
      }
      
      // 模拟注册并自动登录
      onLogin({
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
      });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center p-4">
      {/* 动态背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
        {/* 网格纹理 */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
        
        {/* 浮动光球 */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animation: 'blob 7s infinite' }}></div>
        <div className="absolute top-40 right-40 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animation: 'blob 7s infinite 2s' }}></div>
        <div className="absolute -bottom-32 left-40 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animation: 'blob 7s infinite 4s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/标题区域 */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-lg rounded-3xl mb-6 shadow-2xl border border-white/30 transform hover:scale-110 transition-transform duration-300">
            <div className="relative">
              <Users className="w-12 h-12 text-white" />
              <Sparkles className="w-5 h-5 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
            </div>
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-3 drop-shadow-lg">
            虚拟办公室
          </h1>
          <p className="text-white/90 text-lg font-light">随时随地，与团队协作</p>
        </div>

        {/* 表单卡片 - 玻璃态效果 */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 animate-slide-up">
          {/* 切换标签 */}
          <div className="flex gap-2 mb-8 p-1 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                isLogin
                  ? 'bg-white text-blue-600 shadow-lg transform scale-105'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <LogIn className="w-4 h-4 inline-block mr-2" />
              登录
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                !isLogin
                  ? 'bg-white text-blue-600 shadow-lg transform scale-105'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <UserPlus className="w-4 h-4 inline-block mr-2" />
              注册
            </button>
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="animate-fade-in">
                <label className="block text-sm font-semibold text-white mb-2">
                  姓名
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="请输入您的姓名"
                    className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-white placeholder:text-white/50 hover:bg-white/15"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="animate-fade-in">
              <label className="block text-sm font-semibold text-white mb-2">
                邮箱
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="请输入您的邮箱"
                  className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-white placeholder:text-white/50 hover:bg-white/15"
                  required
                />
              </div>
            </div>

            <div className="animate-fade-in">
              <label className="block text-sm font-semibold text-white mb-2">
                密码
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={isLogin ? '请输入密码' : '至少6位字符'}
                  className="w-full pl-12 pr-12 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-white placeholder:text-white/50 hover:bg-white/15"
                  required
                  minLength={isLogin ? undefined : 6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="animate-fade-in">
                <label className="block text-sm font-semibold text-white mb-2">
                  确认密码
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="请再次输入密码"
                    className="w-full pl-12 pr-12 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-white placeholder:text-white/50 hover:bg-white/15"
                    required={!isLogin}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between text-sm animate-fade-in">
                <label className="flex items-center gap-2 text-white/80 cursor-pointer hover:text-white transition-colors">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-white/30 rounded focus:ring-blue-400 bg-white/10"
                  />
                  <span>记住我</span>
                </label>
                <a href="#" className="text-white/80 hover:text-white transition-colors font-medium">
                  忘记密码？
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3.5 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>处理中...</span>
                  </>
                ) : (
                  <span>{isLogin ? '登录' : '注册'}</span>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </button>
          </form>

          {/* 第三方登录选项 */}
          <div className="mt-8 animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-white/70 border border-white/20">或使用</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-all text-white/90 hover:text-white hover:scale-105 active:scale-95"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="text-sm font-medium">Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-all text-white/90 hover:text-white hover:scale-105 active:scale-95"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
                <span className="text-sm font-medium">GitHub</span>
              </button>
            </div>
          </div>
        </div>

        {/* 底部提示 */}
        <p className="text-center text-sm text-white/80 mt-8 animate-fade-in">
          {isLogin ? (
            <>
              还没有账号？{' '}
              <button
                onClick={() => setIsLogin(false)}
                className="text-white font-semibold hover:text-yellow-300 transition-colors underline decoration-2 underline-offset-2"
              >
                立即注册
              </button>
            </>
          ) : (
            <>
              已有账号？{' '}
              <button
                onClick={() => setIsLogin(true)}
                className="text-white font-semibold hover:text-yellow-300 transition-colors underline decoration-2 underline-offset-2"
              >
                立即登录
              </button>
            </>
          )}
        </p>
      </div>

    </div>
  );
}
