const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const CozeAPI = require('../utils/CozeAPI');

const router = express.Router();
const cozeAPI = new CozeAPI();

// 创建新的聊天会话
router.post('/session', authenticateToken, async (req, res) => {
  try {
    const session = await cozeAPI.createChatSession();
    res.json(session);
  } catch (error) {
    console.error('创建聊天会话错误:', error);
    res.status(500).json({ message: '创建聊天会话失败: ' + error.message });
  }
});

// 发送消息到扣子API
router.post('/message', authenticateToken, [
  body('content').notEmpty().withMessage('消息内容不能为空'),
  body('chatId').optional().isString().withMessage('聊天ID必须是字符串')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { content, chatId } = req.body;

  try {
    // 可以在这里添加消息预处理逻辑
    // 例如添加设备上下文信息
    
    const response = await cozeAPI.sendMessage({
      content,
      chatId
    });
    
    res.json(response);
  } catch (error) {
    console.error('发送消息错误:', error);
    res.status(500).json({ message: '发送消息失败: ' + error.message });
  }
});

// 获取聊天历史
router.get('/history/:chatId', authenticateToken, async (req, res) => {
  const { chatId } = req.params;
  
  try {
    const history = await cozeAPI.getChatHistory(chatId);
    res.json(history);
  } catch (error) {
    console.error('获取聊天历史错误:', error);
    res.status(500).json({ message: '获取聊天历史失败: ' + error.message });
  }
});

// 通过链接打开阀门系统的特殊端点
router.get('/valve/control', async (req, res) => {
  const { valveId, action, value } = req.query;
  
  // 验证参数
  if (!valveId || !action) {
    return res.status(400).json({ message: '缺少必要参数valveId或action' });
  }
  
  if (action === 'adjust' && !value) {
    return res.status(400).json({ message: '调节操作需要提供value参数' });
  }

  try {
    // 调用扣子API控制阀门
    const result = await cozeAPI.controlValve(valveId, action, value ? parseInt(value) : null);
    
    // 返回HTML页面给用户展示结果
    res.send(`
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>阀门控制结果</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
          }
          .success {
            color: #4CAF50;
          }
          .error {
            color: #f44336;
          }
          .info {
            margin: 20px 0;
            padding: 15px;
            background-color: #f5f5f5;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <h1>阀门控制结果</h1>
        ${result.success ? 
          `<div class="success"><h2>操作成功</h2></div>` : 
          `<div class="error"><h2>操作失败</h2></div>`
        }
        <div class="info">
          <p><strong>阀门ID:</strong> ${valveId}</p>
          <p><strong>操作类型:</strong> ${action}</p>
          ${value ? `<p><strong>调节值:</strong> ${value}</p>` : ''}
          <p><strong>结果:</strong> ${result.message || '未知'}</p>
        </div>
        <a href="/">返回首页</a>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('通过链接控制阀门错误:', error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>操作失败</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
          }
          .error {
            color: #f44336;
          }
        </style>
      </head>
      <body>
        <h1 class="error">操作失败</h1>
        <p>错误信息: ${error.message}</p>
        <a href="/">返回首页</a>
      </body>
      </html>
    `);
  }
});

module.exports = router;