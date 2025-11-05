const express = require('express');
const path = require('path');
const http = require('http');

const app = express();

// 启用详细日志记录
app.use((req, res, next) => {
  console.log(`请求URL: ${req.originalUrl}`);
  next();
});

// 简单的API代理实现，使用Node.js内置http模块
app.use('/api', (req, res) => {
  // 构建代理请求选项
  const options = {
    hostname: 'localhost',
    port: 3004,
    path: req.originalUrl,
    method: req.method,
    headers: req.headers
  };
  
  console.log(`代理请求: ${req.method} ${req.originalUrl} -> http://localhost:3004${req.originalUrl}`);
  
  // 创建代理请求
  const proxyReq = http.request(options, (proxyRes) => {
    // 转发状态码
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    
    // 转发响应体
    proxyRes.on('data', (chunk) => {
      res.write(chunk);
    });
    
    proxyRes.on('end', () => {
      res.end();
    });
  });
  
  // 处理代理请求错误
  proxyReq.on('error', (error) => {
    console.error('代理错误:', error.message);
    res.status(502).send('代理错误，请检查后端服务是否运行');
  });
  
  // 转发请求体
  req.on('data', (chunk) => {
    proxyReq.write(chunk);
  });
  
  req.on('end', () => {
    proxyReq.end();
  });
});

// 检查build目录路径
const buildPath = path.join(__dirname, 'build');
console.log(`构建目录路径: ${buildPath}`);

// 提供静态文件
app.use(express.static(buildPath));

// 重要：对于所有未匹配到静态文件的请求，返回index.html，让React Router处理路由
app.use((req, res) => {
  try {
    const indexPath = path.join(buildPath, 'index.html');
    console.log(`提供index.html: ${indexPath}`);
    res.sendFile(indexPath);
  } catch (error) {
    console.error('发送index.html时出错:', error);
    res.status(500).send('服务器错误');
  }
});

// 全局错误处理
app.use((err, req, res, next) => {
  console.error('未捕获的错误:', err);
  res.status(500).send('内部服务器错误');
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`阀门系统前端服务运行在 http://localhost:${PORT}`);
  console.log('现在React Router应该能正确处理客户端路由了');
});