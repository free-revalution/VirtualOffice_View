# Virtual Office 项目

一个基于 Electron + React + TypeScript 的虚拟办公空间应用，提供在线协作、实时聊天和视频会议等功能。

## 项目概览

Virtual Office 是一个现代化的远程办公协作平台，通过虚拟空间模拟线下办公室环境，让团队成员可以在线进行实时交流和协作。

### 主要功能

- 🚀 **虚拟办公空间**：可视化办公环境，显示团队成员位置和状态
- 💬 **实时聊天**：支持公共频道和私人消息，支持消息翻译
- 📹 **视频会议**：创建会议室，支持音视频通话、屏幕共享
- 👤 **用户管理**：用户认证、个人资料管理、头像创建
- 📱 **响应式设计**：支持桌面和移动设备

## 项目结构

```
├── src/
│   ├── main/             # Electron 主进程
│   │   └── index.ts      # 主进程入口文件
│   ├── preload/          # 预加载脚本
│   │   ├── index.d.ts    # 类型定义
│   │   └── index.ts      # 预加载脚本实现
│   └── renderer/         # 渲染进程
│       ├── index.html    # HTML 入口
│       └── src/
│           ├── App.tsx   # 应用主组件
│           ├── api/      # API 接口服务
│           ├── assets/   # 静态资源
│           ├── components/ # React 组件
│           ├── styles/   # 样式文件
│           ├── types/    # TypeScript 类型定义
│           └── main.tsx  # 渲染进程入口
├── build/                # 构建相关资源
├── electron.vite.config.ts # Vite 配置
├── tsconfig.json         # TypeScript 配置
└── package.json          # 项目依赖和脚本
```

### 核心组件

- **VirtualOffice**：虚拟办公空间主组件，管理用户位置和交互
- **UserAvatar**：用户头像组件，支持拖放移动和信息展示
- **ChatPage**：聊天功能页面，包含聊天频道和消息界面
- **MeetingRoom**：视频会议室组件
- **OnlinePanel**：在线用户面板
- **Auth**：用户认证组件

## 技术栈

- **前端框架**：React 19 + TypeScript
- **桌面应用框架**：Electron 38
- **构建工具**：Vite 7
- **UI 组件库**：Radix UI
- **样式方案**：Tailwind CSS 4
- **状态管理**：React Hooks
- **HTTP 客户端**：Axios
- **图标库**：Lucide React

## 开发与构建

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装依赖

```bash
$ npm install
```

### 开发模式

```bash
$ npm run dev
```

### 构建应用

```bash
# Windows 版本
$ npm run build:win

# macOS 版本
$ npm run build:mac

# Linux 版本
$ npm run build:linux
```

## 后端 Spring Boot 开发人员接口使用手册

### 接口基础信息

- **API 基础 URL**：`http://localhost:8080/api/v1`
- **认证方式**：JWT Token (Bearer 认证)
- **请求/响应格式**：JSON
- **WebSocket URL**：`ws://localhost:8080/ws` (需在查询参数中提供 token)

### 后端实现指南

#### 1. 用户认证模块

后端需实现以下 API 接口：

- **登录**：`POST /auth/login`
- **注册**：`POST /auth/register`
- **获取当前用户信息**：`GET /auth/me`
- **更新用户信息**：`PUT /auth/profile`

#### 2. 虚拟空间模块

后端需实现以下功能：

- **虚拟空间管理**：创建、查询虚拟空间及其区域定义
- **用户位置跟踪**：更新和广播用户在虚拟空间中的位置
- **在线状态管理**：实时更新和广播用户在线状态

核心接口：
- `GET /virtual-spaces` - 获取所有虚拟空间
- `PUT /virtual-spaces/position` - 更新用户位置
- `GET /virtual-spaces/:spaceId/members` - 获取空间成员

#### 3. 聊天模块

后端需实现：

- **频道管理**：创建和管理聊天频道
- **消息系统**：发送、接收和存储消息
- **消息翻译**：集成第三方翻译服务

核心接口：
- `GET /chat/channels` - 获取频道列表
- `GET /chat/channels/:channelId/messages` - 获取消息
- `POST /chat/channels/:channelId/messages` - 发送消息

#### 4. 会议模块

后端需实现：

- **会议室管理**：创建和配置会议室
- **参与者管理**：加入/离开会议，更新参与者状态
- **录制功能**：会议录制的开始、停止和存储

核心接口：
- `GET /meetings/rooms` - 获取会议室列表
- `POST /meetings/rooms/:meetingId/join` - 加入会议
- `PUT /meetings/rooms/:meetingId/participant/status` - 更新参与者状态

### WebSocket 实现要求

后端需实现 WebSocket 服务，用于实时通信：

1. **认证处理**：验证 URL 中的 JWT Token
2. **消息类型**：
   - `POSITION_UPDATE`: 用户位置更新广播
   - `NEW_MESSAGE`: 新消息通知
   - `MEETING_STATUS`: 会议状态更新

### 数据模型设计

主要实体关系：

1. **用户 (User)**
   - 与用户会话、消息、会议参与者等关联

2. **虚拟空间 (VirtualSpace)**
   - 包含多个区域 (Zone)
   - 与用户存在状态 (UserPresence) 关联

3. **聊天频道 (ChatChannel)**
   - 包含多个消息 (Message)
   - 与用户多对多关联

4. **会议室 (MeetingRoom)**
   - 包含多个参与者 (MeetingParticipant)

### 安全建议

1. **认证与授权**：
   - 所有 API 端点需验证 JWT Token
   - 实现细粒度的权限控制

2. **数据验证**：
   - 对所有输入参数进行严格验证
   - 防止 SQL 注入和 XSS 攻击

3. **速率限制**：
   - 对敏感接口实现速率限制
   - 防止恶意请求和滥用

## 调试与测试

前端提供了测试 API 客户端，位于 `src/renderer/src/api/test-api.ts`，后端开发人员可以参考该文件了解前端的 API 调用方式。

## 常见问题

1. **JWT 过期处理**：前端会自动处理 Token 过期，后端需返回 401 状态码
2. **WebSocket 连接断开**：前端会自动重连，后端需正确处理连接状态
3. **跨域问题**：开发环境中需配置 CORS 允许前端域名访问

## 更多资源

- 完整 API 文档：`src/renderer/src/api/API_DOCUMENTATION.md`
- TypeScript 类型定义：`src/renderer/src/types/index.ts`
