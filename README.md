# 阀门控制系统

## 项目简介

阀门控制系统是一个基于Node.js和React的智能阀门管理平台，提供设备监控、报警管理、远程控制和智能对话功能，支持通过链接直接控制阀门操作。

## 系统架构

### 后端（Backend）
- **技术栈**：Node.js + Express + MySQL
- **主要功能**：
  - 用户认证与授权（JWT）
  - 设备管理与控制
  - 报警处理与统计
  - 智能对话接口（对接扣子API）
  - 设备实时数据获取

### 前端（Frontend）
- **技术栈**：React + Ant Design + ECharts
- **主要功能**：
  - 系统仪表盘（设备状态统计、报警概览）
  - 设备管理界面
  - 报警管理界面
  - 阀门远程控制
  - 智能助手对话
  - 控制链接生成

## 快速开始

### 环境要求
- Node.js >= 14
- MySQL >= 5.7
- npm 或 yarn

### 后端部署

1. 进入后端目录
```bash
cd valve-system/backend
```

2. 安装依赖
```bash
npm install
```

3. 配置数据库
   - 创建MySQL数据库
   - 修改配置文件中的数据库连接信息

4. 启动服务
```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

### 前端部署

1. 进入前端目录
```bash
cd valve-system/frontend
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 构建生产版本
```bash
npm run build
```

## API接口文档

### 认证相关
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册

### 设备管理
- `GET /api/devices` - 获取所有设备
- `GET /api/devices/:id` - 获取设备详情
- `POST /api/devices` - 创建新设备
- `PUT /api/devices/:id` - 更新设备信息
- `DELETE /api/devices/:id` - 删除设备
- `POST /api/devices/:id/control` - 控制设备状态
- `GET /api/devices/:id/realtime-data` - 获取设备实时数据

### 报警管理
- `GET /api/alarms` - 获取报警列表
- `GET /api/alarms/:id` - 获取报警详情
- `PUT /api/alarms/:id/confirm` - 确认报警
- `PUT /api/alarms/:id/resolve` - 解决报警
- `GET /api/alarms/stats` - 获取报警统计

### 聊天功能
- `POST /api/chat/create-session` - 创建聊天会话
- `POST /api/chat/send-message` - 发送消息
- `GET /api/chat/history/:sessionId` - 获取聊天历史

## 链接控制功能

系统支持通过URL参数直接控制阀门，格式如下：

```
http://yourdomain.com/valve-control?valveId=1&action=open
http://yourdomain.com/valve-control?valveId=1&action=close
http://yourdomain.com/valve-control?valveId=1&action=adjust&value=60
```

参数说明：
- `valveId`：阀门ID
- `action`：操作类型（open/close/adjust）
- `value`：当action为adjust时，指定阀门开度百分比

## 系统安全

1. 用户认证使用JWT进行身份验证
2. 密码存储采用加密方式
3. 所有API接口都有权限控制
4. 输入参数经过严格验证

## 开发说明

### 后端配置

数据库配置和其他系统配置请在相关配置文件中设置。

### 前端配置

前端代理配置已设置为指向后端API（默认端口3000）。

## 许可证

MIT