const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const { query } = require('../utils/db');

const router = express.Router();

// 登录路由
router.post('/login', [
  body('username').notEmpty().withMessage('用户名不能为空'),
  body('password').notEmpty().withMessage('密码不能为空')
], async (req, res) => {
  // 验证请求参数
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    // 查询用户信息
    const users = await query('SELECT * FROM users WHERE username = ?', [username]);
    
    if (users.length === 0) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    const user = users[0];
    
    // 验证密码（明文比较）
    if (password !== user.password) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 修改为使用id字段而不是user_id
    const userId = user.id || null;
    // 简化角色查询，直接从用户表的role_id获取角色信息
    const roles = await query(
      'SELECT role_name FROM roles WHERE id = ?',
      [user.role_id]
    );

    // 创建JWT令牌
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        roles: roles.map(role => role.role_name)
      },
      config.security.jwtSecret,
      { expiresIn: config.security.tokenExpiry }
    );

    res.json({
      message: '登录成功',
      token,
      user: {
        userId: user.id,
        username: user.username,
        email: user.email,
        real_name: user.real_name,
        roles: roles.map(role => role.role_name)
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ message: '登录失败: ' + error.message });
  }
});

// 注册路由
router.post('/register', [
  body('username').notEmpty().withMessage('用户名不能为空'),
  body('email').isEmail().withMessage('邮箱格式不正确'),
  body('password').isLength({ min: 6 }).withMessage('密码长度至少6位')
], async (req, res) => {
  // 验证请求参数
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    // 检查用户名是否已存在
    const existingUsers = await query('SELECT * FROM users WHERE username = ?', [username]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: '用户名已存在' });
    }

    // 检查邮箱是否已存在
    const existingEmails = await query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingEmails.length > 0) {
      return res.status(400).json({ message: '邮箱已被注册' });
    }

    // 直接使用明文密码存储
    // const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPassword = password;

    // 获取user角色的ID
    const userRoles = await query('SELECT id FROM roles WHERE role_name = ?', ['user']);
    if (userRoles.length === 0) {
      return res.status(500).json({ message: '系统角色未初始化，请联系管理员' });
    }
    const userRoleId = userRoles[0].id;

    // 创建用户
    const result = await query(
      'INSERT INTO users (username, email, password, role_id, created_at) VALUES (?, ?, ?, ?, NOW())',
      [username, email, hashedPassword, userRoleId]
    );

    const userId = result.insertId;

    // 用户角色已在users表的role_id字段中设置，无需额外插入user_roles表

    res.status(201).json({ message: '注册成功' });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ message: '注册失败: ' + error.message });
  }
});

module.exports = router;