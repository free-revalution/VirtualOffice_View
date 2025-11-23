# Virtual Office API 接口文档

本文档描述了Virtual Office前端与Spring Boot后端之间的所有API交互接口。

## 基础配置

- **API基础URL**: `http://localhost:8080/api/v1`
- **认证方式**: JWT Token (Bearer 认证)
- **请求/响应格式**: JSON

## 1. 用户认证 (Authentication)

### 1.1 用户登录

**URL**: `/auth/login`
**方法**: `POST`
**请求体**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "rememberMe": true
}
```
**成功响应**:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "1",
    "name": "John Doe",
    "email": "user@example.com",
    "avatar": "https://example.com/avatar.jpg",
    "role": "user",
    "status": "online"
  }
}
```

### 1.2 用户注册

**URL**: `/auth/register`
**方法**: `POST`
**请求体**:
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "role": "user"
}
```
**成功响应**:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "1",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "user"
  }
}
```

### 1.3 获取当前用户信息

**URL**: `/auth/me`
**方法**: `GET`
**认证**: 需要JWT Token
**成功响应**:
```json
{
  "id": "1",
  "name": "John Doe",
  "email": "user@example.com",
  "avatar": "https://example.com/avatar.jpg",
  "role": "user",
  "status": "online"
}
```

### 1.4 更新用户信息

**URL**: `/auth/profile`
**方法**: `PUT`
**认证**: 需要JWT Token
**请求体**:
```json
{
  "name": "John Smith",
  "avatar": "https://example.com/new_avatar.jpg"
}
```
**成功响应**:
```json
{
  "id": "1",
  "name": "John Smith",
  "email": "user@example.com",
  "avatar": "https://example.com/new_avatar.jpg",
  "role": "user"
}
```

### 1.5 忘记密码

**URL**: `/auth/forgot-password`
**方法**: `POST`
**请求体**:
```json
{
  "email": "user@example.com"
}
```
**成功响应**:
```json
{
  "success": true,
  "message": "重置密码邮件已发送"
}
```

### 1.6 重置密码

**URL**: `/auth/reset-password`
**方法**: `POST`
**请求体**:
```json
{
  "token": "reset_token_here",
  "newPassword": "new_password123",
  "confirmPassword": "new_password123"
}
```
**成功响应**:
```json
{
  "success": true,
  "message": "密码重置成功"
}
```

## 2. 虚拟空间 (Virtual Space)

### 2.1 获取所有虚拟空间

**URL**: `/virtual-spaces`
**方法**: `GET`
**认证**: 需要JWT Token
**成功响应**:
```json
[
  {
    "id": "1",
    "name": "Main Office",
    "description": "Main virtual office space",
    "zones": [...],
    "createdAt": "2023-01-01T00:00:00Z"
  }
]
```

### 2.2 获取虚拟空间详情

**URL**: `/virtual-spaces/:spaceId`
**方法**: `GET`
**认证**: 需要JWT Token
**成功响应**:
```json
{
  "id": "1",
  "name": "Main Office",
  "description": "Main virtual office space",
  "zones": [
    {
      "id": "zone1",
      "spaceId": "1",
      "name": "Work Area",
      "type": "workspace",
      "coordinates": {
        "x": 0,
        "y": 0,
        "width": 100,
        "height": 100
      }
    }
  ],
  "createdAt": "2023-01-01T00:00:00Z"
}
```

### 2.3 更新用户位置

**URL**: `/virtual-spaces/position`
**方法**: `PUT`
**认证**: 需要JWT Token
**请求体**:
```json
{
  "spaceId": "1",
  "zoneId": "zone1",
  "x": 50,
  "y": 30
}
```
**成功响应**:
```json
{
  "id": "presence1",
  "userId": "1",
  "spaceId": "1",
  "zoneId": "zone1",
  "position": { "x": 50, "y": 30 },
  "status": "online",
  "lastActive": "2023-01-01T10:00:00Z"
}
```

### 2.4 进入虚拟空间

**URL**: `/virtual-spaces/:spaceId/enter`
**方法**: `POST`
**认证**: 需要JWT Token
**成功响应**:
```json
{
  "id": "presence1",
  "userId": "1",
  "spaceId": "1",
  "position": { "x": 0, "y": 0 },
  "status": "online",
  "lastActive": "2023-01-01T10:00:00Z"
}
```

### 2.5 离开虚拟空间

**URL**: `/virtual-spaces/:spaceId/leave`
**方法**: `POST`
**认证**: 需要JWT Token
**成功响应**:
```json
{
  "success": true
}
```

### 2.6 获取空间成员

**URL**: `/virtual-spaces/:spaceId/members`
**方法**: `GET`
**认证**: 需要JWT Token
**成功响应**:
```json
[
  {
    "id": "presence1",
    "userId": "1",
    "spaceId": "1",
    "position": { "x": 50, "y": 30 },
    "status": "online",
    "lastActive": "2023-01-01T10:00:00Z"
  }
]
```

## 3. 聊天功能 (Chat)

### 3.1 获取聊天频道列表

**URL**: `/chat/channels`
**方法**: `GET`
**认证**: 需要JWT Token
**成功响应**:
```json
[
  {
    "id": "channel1",
    "name": "General",
    "type": "public",
    "members": [...],
    "createdAt": "2023-01-01T00:00:00Z",
    "lastMessage": {
      "id": "msg1",
      "content": "Hello everyone",
      "createdAt": "2023-01-01T10:00:00Z"
    }
  }
]
```

### 3.2 获取聊天消息

**URL**: `/chat/channels/:channelId/messages`
**方法**: `GET`
**查询参数**: `limit=50&offset=0`
**认证**: 需要JWT Token
**成功响应**:
```json
[
  {
    "id": "msg1",
    "channelId": "channel1",
    "senderId": "1",
    "content": "Hello everyone",
    "type": "text",
    "createdAt": "2023-01-01T10:00:00Z",
    "sender": {
      "id": "1",
      "name": "John Doe",
      "avatar": "https://example.com/avatar.jpg"
    }
  }
]
```

### 3.3 发送消息

**URL**: `/chat/channels/:channelId/messages`
**方法**: `POST`
**认证**: 需要JWT Token
**请求体**:
```json
{
  "content": "Hello there!",
  "type": "text"
}
```
**成功响应**:
```json
{
  "id": "msg2",
  "channelId": "channel1",
  "senderId": "1",
  "content": "Hello there!",
  "type": "text",
  "createdAt": "2023-01-01T10:05:00Z"
}
```

### 3.4 翻译消息

**URL**: `/chat/messages/:messageId/translate`
**方法**: `POST`
**认证**: 需要JWT Token
**请求体**:
```json
{
  "targetLanguage": "zh"
}
```
**成功响应**:
```json
{
  "translatedText": "你好！",
  "sourceLanguage": "en",
  "targetLanguage": "zh"
}
```

### 3.5 创建聊天频道

**URL**: `/chat/channels`
**方法**: `POST`
**认证**: 需要JWT Token
**请求体**:
```json
{
  "name": "Project Team",
  "type": "group"
}
```
**成功响应**:
```json
{
  "id": "channel2",
  "name": "Project Team",
  "type": "group",
  "members": [...],
  "createdAt": "2023-01-01T11:00:00Z"
}
```

## 4. 会议功能 (Meeting)

### 4.1 获取会议室列表

**URL**: `/meetings/rooms`
**方法**: `GET`
**认证**: 需要JWT Token
**成功响应**:
```json
[
  {
    "id": "meeting1",
    "name": "Conference Room A",
    "capacity": 10,
    "isLocked": false,
    "participants": [...]
  }
]
```

### 4.2 创建会议室

**URL**: `/meetings/rooms`
**方法**: `POST`
**认证**: 需要JWT Token
**请求体**:
```json
{
  "name": "Team Meeting",
  "virtualSpaceId": "1",
  "capacity": 8
}
```
**成功响应**:
```json
{
  "id": "meeting2",
  "name": "Team Meeting",
  "virtualSpaceId": "1",
  "capacity": 8,
  "isLocked": false,
  "participants": []
}
```

### 4.3 加入会议

**URL**: `/meetings/rooms/:meetingId/join`
**方法**: `POST`
**认证**: 需要JWT Token
**成功响应**:
```json
{
  "id": "participant1",
  "meetingId": "meeting1",
  "userId": "1",
  "user": {
    "id": "1",
    "name": "John Doe"
  },
  "isHost": false,
  "isSpeaking": false,
  "hasMic": true,
  "hasCamera": true,
  "hasHandRaised": false,
  "joinedAt": "2023-01-01T12:00:00Z"
}
```

### 4.4 离开会议

**URL**: `/meetings/rooms/:meetingId/leave`
**方法**: `POST`
**认证**: 需要JWT Token
**成功响应**:
```json
{
  "success": true
}
```

### 4.5 更新参与者状态

**URL**: `/meetings/rooms/:meetingId/participant/status`
**方法**: `PUT`
**认证**: 需要JWT Token
**请求体**:
```json
{
  "hasMic": false,
  "hasCamera": true,
  "hasHandRaised": false
}
```
**成功响应**:
```json
{
  "id": "participant1",
  "meetingId": "meeting1",
  "userId": "1",
  "hasMic": false,
  "hasCamera": true,
  "hasHandRaised": false
}
```

### 4.6 开始/停止录制

**URL**: `/meetings/rooms/:meetingId/recording/start`
**方法**: `POST`
**认证**: 需要JWT Token (主持人)
**成功响应**:
```json
{
  "success": true,
  "recordingId": "recording1"
}
```

**URL**: `/meetings/rooms/:meetingId/recording/stop`
**方法**: `POST`
**认证**: 需要JWT Token (主持人)
**成功响应**:
```json
{
  "success": true,
  "recordingUrl": "https://example.com/recordings/recording1.mp4"
}
```

## 5. 文件上传

### 5.1 上传文件

**URL**: `/upload`
**方法**: `POST`
**认证**: 需要JWT Token
**Content-Type**: `multipart/form-data`
**表单数据**:
- `file`: 文件对象

**成功响应**:
```json
{
  "url": "https://example.com/uploads/file123.jpg",
  "filename": "document.pdf",
  "size": 204800,
  "type": "application/pdf",
  "id": "file123"
}
```

## 6. WebSocket通信

### 6.1 连接信息

**URL**: `ws://localhost:8080/ws`
**认证**: 需要在URL参数中提供JWT Token: `?token=jwt_token_here`

### 6.2 消息类型

**用户位置更新**:
```json
{
  "type": "POSITION_UPDATE",
  "data": {
    "userId": "1",
    "spaceId": "1",
    "position": { "x": 50, "y": 30 }
  }
}
```

**新消息通知**:
```json
{
  "type": "NEW_MESSAGE",
  "data": {
    "channelId": "channel1",
    "message": {...}
  }
}
```

**会议状态更新**:
```json
{
  "type": "MEETING_STATUS",
  "data": {
    "meetingId": "meeting1",
    "participants": [...]
  }
}
```

## 错误处理

所有API返回标准的HTTP状态码:
- `200 OK`: 请求成功
- `400 Bad Request`: 请求参数错误
- `401 Unauthorized`: 未授权
- `403 Forbidden`: 权限不足
- `404 Not Found`: 资源不存在
- `500 Internal Server Error`: 服务器错误

错误响应格式:
```json
{
  "error": "错误消息",
  "message": "详细错误描述"
}