const express = require('express');
const cors = require('cors');
const config = require('../config/config');
const { pool } = require('./utils/db');

// 导入路由
const authRoutes = require('./routes/auth');
const deviceRoutes = require('./routes/devices');
const alarmRoutes = require('./routes/alarms');
const chatRoutes = require('./routes/chat');

const app = express();

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: '阀门系统API服务运行正常' });
});

// API路由
app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/alarms', alarmRoutes);
app.use('/api/chat', chatRoutes);

// API根路径路由
app.get('/api', (req, res) => {
  res.json({
    message: '阀门系统API',
    version: '1.0.0',
    availableEndpoints: [
      { path: '/api/auth/login', method: 'POST', description: '用户登录' },
      { path: '/api/auth/register', method: 'POST', description: '用户注册' },
      { path: '/api/devices', method: 'GET', description: '获取设备列表' },
      { path: '/api/alarms', method: 'GET', description: '获取报警信息' },
      { path: '/api/chat', method: 'POST', description: '聊天接口' }
    ]
  });
});

// 静态文件服务（用于前端部署）
app.use(express.static('../frontend/build'));

// 404处理
app.use((req, res) => {
  res.status(404).json({ message: 'API端点不存在' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({ message: '服务器内部错误', error: err.message });
});

// 防止进程意外退出
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的Promise拒绝:', reason);
});

// 启动服务器
const PORT = config.server.port || 3000;
app.listen(PORT, async () => {
  try {
    // 测试数据库连接
    const connection = await pool.getConnection();
    console.log('数据库连接成功');
    connection.release();
    
    console.log(`阀门系统API服务器启动成功，监听端口 ${PORT}`);
    console.log(`健康检查地址: http://${config.server.host}:${config.server.port}/health`);
    console.log(`API基础路径: http://${config.server.host}:${config.server.port}/api/*`);
    console.log(`可用API端点:`);
    console.log(`  - 认证: /api/auth/login, /api/auth/register`);
    console.log(`  - 设备: /api/devices/*`);
    console.log(`  - 报警: /api/alarms/*`);
    console.log(`  - 聊天: /api/chat/*`);
  } catch (error) {
    console.error('数据库连接失败:', error);
    console.log('服务器已启动，但数据库连接失败');
  }
});

// 优雅关闭
process.on('SIGINT', async () => {
  console.log('正在关闭服务器...');
  try {
    await pool.end();
    console.log('数据库连接池已关闭');
    process.exit(0);
  } catch (error) {
    console.error('关闭数据库连接池失败:', error);
    process.exit(1);
  }
});