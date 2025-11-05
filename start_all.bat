@echo off

echo 开始启动阀门系统...

REM 启动后端服务
echo 启动后端服务...
start "后端服务" cmd /k "cd backend && node server.js"

REM 等待后端服务启动
ping -n 3 127.0.0.1 > nul

REM 启动前端服务
echo 启动前端服务...
start "前端服务" cmd /k "cd frontend && node server.js"

echo 阀门系统已启动！
echo 后端服务地址: http://localhost:3004
echo 前端服务地址: http://localhost:3005
echo 按任意键退出此窗口...
pause > nul