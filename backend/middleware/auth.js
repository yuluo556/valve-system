const jwt = require('jsonwebtoken');
const config = require('../../config/config');

/**
 * 认证中间件
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - 下一个中间件
 */
function authenticateToken(req, res, next) {
  // 从请求头获取token
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ message: '未提供认证令牌' });
  }

  jwt.verify(token, config.security.jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: '无效的认证令牌' });
    }
    req.user = user;
    next();
  });
}

/**
 * 权限检查中间件
 * @param {Array} allowedRoles - 允许的角色列表
 */
function authorizeRoles(allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
      return res.status(403).json({ message: '用户角色未定义' });
    }

    // 检查用户是否有允许的角色
    const hasRole = req.user.roles.some(role => allowedRoles.includes(role));
    if (!hasRole) {
      return res.status(403).json({ message: '权限不足，无法访问此资源' });
    }

    next();
  };
}

module.exports = {
  authenticateToken,
  authorizeRoles
};