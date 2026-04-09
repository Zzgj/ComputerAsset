@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

:: ============================================================
::  ComputerAsset 部署包构建脚本
::  在有网络的机器上运行，生成可直接部署到内网服务器的完整包
:: ============================================================

set "ROOT_DIR=%~dp0.."
if "%ROOT_DIR:~-1%"=="\" set "ROOT_DIR=%ROOT_DIR:~0,-1%"
set "DEPLOY_DIR=%ROOT_DIR%\deploy-package"
set "BACKEND_DIR=%ROOT_DIR%\backend"
set "FRONTEND_DIR=%ROOT_DIR%\frontend"

echo.
echo   +---------------------------------------------------+
echo   ^|                                                   ^|
echo   ^|   ComputerAsset 部署包构建工具                    ^|
echo   ^|                                                   ^|
echo   ^|   本脚本需在有网络的机器上运行                    ^|
echo   ^|   构建产物可直接拷贝到内网服务器部署              ^|
echo   ^|                                                   ^|
echo   +---------------------------------------------------+
echo.

:: -- 检查环境 --
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

:: -- 清理旧的构建产物 --
echo.
echo [2] 清理旧的构建产物 ...
if exist "%DEPLOY_DIR%" rd /s /q "%DEPLOY_DIR%"
mkdir "%DEPLOY_DIR%"
echo     [通过] 已清理

:: -- 安装后端依赖 --
echo.
echo [3] 安装后端依赖 ...
cd /d "%BACKEND_DIR%"
call pnpm install
call pnpm approve-builds --all >nul 2>&1
echo     [通过] 后端依赖安装完成

:: -- 构建后端 --
echo.
echo [4] 构建后端 ...
cd /d "%BACKEND_DIR%"
call pnpm run build
if %errorlevel% neq 0 (
    echo     [失败] 后端构建失败
    pause
    exit /b 1
)
echo     [通过] 后端构建完成

:: -- 生成 Prisma 客户端 --
echo.
echo [5] 生成 Prisma 客户端 ...
cd /d "%BACKEND_DIR%"
call pnpm exec prisma generate
if %errorlevel% neq 0 (
    echo     [失败] Prisma 客户端生成失败
    pause
    exit /b 1
)
echo     [通过] Prisma 客户端已生成

:: -- 安装前端依赖并构建 --
echo.
echo [6] 安装前端依赖并构建 ...
cd /d "%FRONTEND_DIR%"
call pnpm install
call pnpm approve-builds --all >nul 2>&1
call pnpm run build
if %errorlevel% neq 0 (
    echo     [失败] 前端构建失败
    pause
    exit /b 1
)
echo     [通过] 前端构建完成

:: -- 组装部署包 --
echo.
echo [7] 组装部署包 ...

:: 后端运行时
mkdir "%DEPLOY_DIR%\backend"
mkdir "%DEPLOY_DIR%\backend\dist"
mkdir "%DEPLOY_DIR%\backend\prisma"
mkdir "%DEPLOY_DIR%\backend\prisma\migrations"
xcopy "%BACKEND_DIR%\dist" "%DEPLOY_DIR%\backend\dist" /e /q /y >nul
xcopy "%BACKEND_DIR%\node_modules" "%DEPLOY_DIR%\backend\node_modules" /e /q /y >nul
xcopy "%BACKEND_DIR%\prisma\schema.prisma" "%DEPLOY_DIR%\backend\prisma\" /q /y >nul
xcopy "%BACKEND_DIR%\prisma\migrations" "%DEPLOY_DIR%\backend\prisma\migrations" /e /q /y >nul
copy "%BACKEND_DIR%\prisma.config.ts" "%DEPLOY_DIR%\backend\" >nul
copy "%BACKEND_DIR%\package.json" "%DEPLOY_DIR%\backend\" >nul
copy "%BACKEND_DIR%\.env.example" "%DEPLOY_DIR%\backend\" >nul

:: 前端静态文件
mkdir "%DEPLOY_DIR%\frontend"
xcopy "%FRONTEND_DIR%\dist" "%DEPLOY_DIR%\frontend\dist" /e /q /y >nul

:: 部署脚本
copy "%ROOT_DIR%\deploy\deploy.bat" "%DEPLOY_DIR%\" >nul
copy "%ROOT_DIR%\deploy\stop.bat" "%DEPLOY_DIR%\" >nul
copy "%ROOT_DIR%\deploy\README.txt" "%DEPLOY_DIR%\" >nul

echo     [通过] 部署包组装完成

:: -- 统计大小 --
echo.
echo [8] 部署包信息 ...
echo     位置 : %DEPLOY_DIR%
for /f "tokens=3" %%s in ('dir "%DEPLOY_DIR%" /s /-c 2^>nul ^| findstr "个文件"') do (
    set /a SIZE_MB=%%s/1024/1024
    echo     大小 : 约 !SIZE_MB! MB
)

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
