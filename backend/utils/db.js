const mysql = require('mysql2/promise');
const config = require('../../config/config');

// 创建数据库连接池
const pool = mysql.createPool({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
  connectionLimit: config.database.connectionLimit,
  waitForConnections: true,
  queueLimit: 0
});

/**
 * 执行SQL查询
 * @param {string} sql - SQL查询语句
 * @param {Array} params - 查询参数
 * @returns {Promise<Object>} - 查询结果
 */
async function query(sql, params = []) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [results] = await connection.execute(sql, params);
    return results;
  } catch (error) {
    console.error('数据库查询错误:', error);
    throw new Error('数据库操作失败: ' + error.message);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

/**
 * 执行事务
 * @param {Function} callback - 事务回调函数
 * @returns {Promise<any>} - 事务结果
 */
async function transaction(callback) {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('事务执行错误:', error);
    throw new Error('事务执行失败: ' + error.message);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

module.exports = {
  pool,
  query,
  transaction
};