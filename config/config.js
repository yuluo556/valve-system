// 配置文件
module.exports = {
  // 数据库配置
  database: {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '123456',
    database: 'valve_system',
    connectionLimit: 10
  },
  // 扣子API配置
  cozeApi: {
    apiKey: 'demo_api_key_placeholder',
    baseUrl: 'https://api.coze.com'
  },
  // 服务器配置
  server: {
    port: 3004,
    host: '10.91.210.247'
  },
  // 安全配置
  security: {
    jwtSecret: 'your_jwt_secret_key',
    tokenExpiry: '24h'
  }
};