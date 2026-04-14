@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

set "ROOT_DIR=%~dp0.."
if "%ROOT_DIR:~-1%"=="\" set "ROOT_DIR=%ROOT_DIR:~0,-1%"
set "DEPLOY_DIR=%ROOT_DIR%\deploy-package"
set "BACKEND_DIR=%ROOT_DIR%\backend"
set "FRONTEND_DIR=%ROOT_DIR%\frontend"

echo.
echo   +---------------------------------------------------+
echo   ^|                                                   ^|
echo   ^|   ComputerAsset                                   ^|
echo   ^|                                                   ^|
echo   ^|   本脚本需在有网络的机器上运行                    ^|
echo   ^|   构建产物可直接拷贝到内网服务器部署              ^|
echo   ^|                                                   ^|
echo   +---------------------------------------------------+
echo.

echo [1] 检查环境 ...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo     [失败] 未安装 Node.js
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('node -v') do echo     [通过] Node.js %%v

where pnpm >nul 2>&1
if %errorlevel% neq 0 (
    echo     [提示] 未找到 pnpm, 正在通过 npm 安装 ...
    call npm install -g pnpm
)
for /f "tokens=*" %%v in ('pnpm -v') do echo     [通过] pnpm v%%v

echo.
echo [2] 清理旧的构建产物 ...
if exist "%DEPLOY_DIR%" rd /s /q "%DEPLOY_DIR%"
mkdir "%DEPLOY_DIR%"
echo     [通过] 已清理

echo.
echo [3] 安装后端依赖 ...
cd /d "%BACKEND_DIR%"
call pnpm install --force
call pnpm approve-builds --all >nul 2>&1
echo     [通过] 后端依赖安装完成

if not exist "%BACKEND_DIR%\.env" (
    if exist "%BACKEND_DIR%\.env.example" (
        copy "%BACKEND_DIR%\.env.example" "%BACKEND_DIR%\.env" >nul
        echo     [通过] 已从 .env.example 创建 .env
    )
)

echo.
echo [4] 生成 Prisma 客户端 ...
cd /d "%BACKEND_DIR%"
call pnpm exec prisma generate
if %errorlevel% neq 0 (
    echo     [失败] Prisma 客户端生成失败
    pause
    exit /b 1
)
echo     [通过] Prisma 客户端已生成

echo.
echo [5] 构建后端 ...
cd /d "%BACKEND_DIR%"
call pnpm run build
if %errorlevel% neq 0 (
    echo     [失败] 后端构建失败
    pause
    exit /b 1
)
echo     [通过] 后端构建完成

echo.
echo [6] 安装前端依赖并构建 ...
cd /d "%FRONTEND_DIR%"
if exist "%FRONTEND_DIR%\env.deployment" (
    copy /y "%FRONTEND_DIR%\env.deployment" "%FRONTEND_DIR%\.env.production.local" >nul
    echo     [提示] 已复制 env.deployment 为 .env.production.local（签名链接站点地址等）
)
call pnpm install --force
call pnpm approve-builds --all >nul 2>&1
call pnpm run build
if %errorlevel% neq 0 (
    echo     [失败] 前端构建失败
    pause
    exit /b 1
)
echo     [通过] 前端构建完成

echo.
echo [7] 组装部署包 ...

echo     正在复制后端构建产物 ...
mkdir "%DEPLOY_DIR%\backend\dist" >nul 2>&1
robocopy "%BACKEND_DIR%\dist" "%DEPLOY_DIR%\backend\dist" /e /nfl /ndl /njh /njs /nc /ns /np >nul

echo     正在复制 Prisma 数据库文件 ...
mkdir "%DEPLOY_DIR%\backend\prisma\migrations" >nul 2>&1
copy "%BACKEND_DIR%\prisma\schema.prisma" "%DEPLOY_DIR%\backend\prisma\" >nul
robocopy "%BACKEND_DIR%\prisma\migrations" "%DEPLOY_DIR%\backend\prisma\migrations" /e /nfl /ndl /njh /njs /nc /ns /np >nul

echo     正在复制配置文件 ...
copy "%BACKEND_DIR%\prisma.config.ts" "%DEPLOY_DIR%\backend\" >nul
copy "%BACKEND_DIR%\package.json" "%DEPLOY_DIR%\backend\" >nul
copy "%BACKEND_DIR%\.env.example" "%DEPLOY_DIR%\backend\" >nul

echo     正在安装生产依赖 (使用 npm, 生成标准 node_modules) ...
cd /d "%DEPLOY_DIR%\backend"
call npm install --production
echo     [通过] 生产依赖安装完成

echo     正在复制 Prisma 引擎和客户端 ...
mkdir "%DEPLOY_DIR%\backend\node_modules\.prisma" >nul 2>&1
robocopy "%BACKEND_DIR%\node_modules\.prisma" "%DEPLOY_DIR%\backend\node_modules\.prisma" /e /nfl /ndl /njh /njs /nc /ns /np >nul
if exist "%BACKEND_DIR%\node_modules\@prisma\engines" (
    mkdir "%DEPLOY_DIR%\backend\node_modules\@prisma\engines" >nul 2>&1
    robocopy "%BACKEND_DIR%\node_modules\@prisma\engines" "%DEPLOY_DIR%\backend\node_modules\@prisma\engines" /e /nfl /ndl /njh /njs /nc /ns /np >nul
)
echo     [通过] Prisma 文件复制完成

echo     正在复制 prisma CLI ...
if not exist "%DEPLOY_DIR%\backend\node_modules\prisma" (
    mkdir "%DEPLOY_DIR%\backend\node_modules\prisma" >nul 2>&1
    robocopy "%BACKEND_DIR%\node_modules\prisma" "%DEPLOY_DIR%\backend\node_modules\prisma" /e /nfl /ndl /njh /njs /nc /ns /np >nul
)
echo     [通过] prisma CLI 复制完成

echo     正在复制前端静态文件 ...
mkdir "%DEPLOY_DIR%\frontend\dist" >nul 2>&1
robocopy "%FRONTEND_DIR%\dist" "%DEPLOY_DIR%\frontend\dist" /e /nfl /ndl /njh /njs /nc /ns /np >nul

echo     正在复制部署脚本 ...
copy "%ROOT_DIR%\deploy\deploy.bat" "%DEPLOY_DIR%\" >nul
copy "%ROOT_DIR%\deploy\stop.bat" "%DEPLOY_DIR%\" >nul
copy "%ROOT_DIR%\deploy\restart.bat" "%DEPLOY_DIR%\" >nul
copy "%ROOT_DIR%\deploy\README.txt" "%DEPLOY_DIR%\" >nul

echo     [通过] 部署包组装完成

echo.
echo   +---------------------------------------------------+
echo   ^|                                                   ^|
echo   ^|   构建完成!                                       ^|
echo   ^|                                                   ^|
echo   ^|   部署包位置: deploy-package\                     ^|
echo   ^|                                                   ^|
echo   ^|   将整个 deploy-package 文件夹拷贝到目标服务器    ^|
echo   ^|   然后运行 deploy.bat 即可一键部署                ^|
echo   ^|                                                   ^|
echo   +---------------------------------------------------+
echo.
pause
