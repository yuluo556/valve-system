const { query } = require('./utils/db');

async function updateAdminPassword() {
  try {
    console.log('开始更新管理员密码...');
    
    // 直接使用明文密码 'admin123' 更新 admin 用户
    const result = await query(
      'UPDATE users SET password = ? WHERE username = ?',
      ['admin123', 'admin']
    );
    
    if (result.affectedRows > 0) {
      console.log('管理员密码更新成功！新密码: admin123');
    } else {
      console.log('未找到 admin 用户');
    }
  } catch (error) {
    console.error('更新密码失败:', error);
  } finally {
    process.exit();
  }
}

updateAdminPassword();