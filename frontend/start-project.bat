@echo off

echo 正在安装项目依赖...
npm install

if %errorlevel% equ 0 (
    echo 依赖安装成功，正在启动项目...
    npm start
) else (
    echo 依赖安装失败，请检查错误信息
    pause
)