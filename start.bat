@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

:: ============================================================
::  ComputerAsset 一键启动脚本 (Windows)
::  适用于 Windows 10 / 11 / Server
:: ============================================================

set "ROOT_DIR=%~dp0"
set "ROOT_DIR=%ROOT_DIR:~0,-1%"
set "BACKEND_DIR=%ROOT_DIR%\backend"
set "FRONTEND_DIR=%ROOT_DIR%\frontend"
set "BACKEND_PORT=3000"
set "FRONTEND_PORT=5173"
set "FAIL_COUNT=0"
set "STEP=0"

cls
echo.
echo   ╔═══════════════════════════════════════════════╗
echo   ║                                               ║
echo   ║        ComputerAsset  启动程序                ║
echo   ║        电脑资产管理系统 v1.1.5                ║
echo   ║                                               ║
echo   ╚═══════════════════════════════════════════════╝
echo.
echo     项目目录: %ROOT_DIR%
echo     启动时间: %date% %time:~0,8%
echo.

:: ═══════════════════════════════════════════════════════════
::  阶段 1：环境检查
:: ═══════════════════════════════════════════════════════════
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   阶段 1/4  环境检查
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

:: 1. Node.js
set /a STEP+=1
echo.
echo [%STEP%] 检查 Node.js 运行时
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo     X 未安装 Node.js — 请先安装 https://nodejs.org/
    set /a FAIL_COUNT+=1
    goto :check_pnpm
)
for /f "tokens=*" %%v in ('node -v') do set "NODE_VER=%%v"
echo     √ Node.js %NODE_VER%

:check_pnpm
:: 2. pnpm
set /a STEP+=1
echo.
echo [%STEP%] 检查 pnpm 包管理器
where pnpm >nul 2>&1
if %errorlevel% neq 0 (
    echo     ! 未安装 pnpm，尝试 corepack 启用...
    corepack enable >nul 2>&1
    where pnpm >nul 2>&1
    if !errorlevel! neq 0 (
        echo     X 安装 pnpm 失败，请运行: npm install -g pnpm
        set /a FAIL_COUNT+=1
    ) else (
        for /f "tokens=*" %%v in ('pnpm -v') do echo     √ 已安装 pnpm v%%v
    )
) else (
    for /f "tokens=*" %%v in ('pnpm -v') do echo     √ pnpm v%%v
)

:: 3. 项目目录
set /a STEP+=1
echo.
echo [%STEP%] 检查项目目录结构
if exist "%BACKEND_DIR%" (
    echo     √ backend/ 存在
) else (
    echo     X 缺少 backend/ 目录
    set /a FAIL_COUNT+=1
)
if exist "%FRONTEND_DIR%" (
    echo     √ frontend/ 存在
) else (
    echo     X 缺少 frontend/ 目录
    set /a FAIL_COUNT+=1
)

:: 4. 网络
set /a STEP+=1
echo.
echo [%STEP%] 检查网络连通性
ping -n 1 -w 3000 8.8.8.8 >nul 2>&1
if %errorlevel% equ 0 (
    echo     √ 网络连通
) else (
    echo     ! 网络不通 — 若依赖已安装则不影响启动
)

:: ═══════════════════════════════════════════════════════════
::  阶段 2：依赖与配置
:: ═══════════════════════════════════════════════════════════
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   阶段 2/4  依赖与配置
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

:: 5. .env
set /a STEP+=1
echo.
echo [%STEP%] 检查后端环境变量配置
if exist "%BACKEND_DIR%\.env" (
    echo     √ .env 文件已存在
) else (
    if exist "%BACKEND_DIR%\.env.example" (
        copy "%BACKEND_DIR%\.env.example" "%BACKEND_DIR%\.env" >nul
        echo     √ 已从 .env.example 创建 .env
        echo     ! 生产环境请务必修改 JWT_SECRET！
    ) else (
        echo     X 找不到 .env.example
        set /a FAIL_COUNT+=1
    )
)

:: 读取 PORT
for /f "tokens=1,* delims==" %%a in ('findstr /b "PORT=" "%BACKEND_DIR%\.env" 2^>nul') do (
    set "BACKEND_PORT=%%b"
)

:: 6. 后端依赖
set /a STEP+=1
echo.
echo [%STEP%] 检查后端依赖
if exist "%BACKEND_DIR%\node_modules" (
    echo     √ node_modules 已存在
) else (
    echo     ● 正在安装后端依赖...
    cd /d "%BACKEND_DIR%"
    call pnpm install --frozen-lockfile
    if exist "%BACKEND_DIR%\node_modules" (
        echo     √ 后端依赖安装完成
    ) else (
        echo     X 后端依赖安装失败
        set /a FAIL_COUNT+=1
    )
)
echo     ● 允许原生模块构建...
cd /d "%BACKEND_DIR%"
call pnpm approve-builds --all >nul 2>&1
echo     √ 原生模块构建完成

:: 7. 前端依赖
set /a STEP+=1
echo.
echo [%STEP%] 检查前端依赖
if exist "%FRONTEND_DIR%\node_modules" (
    echo     √ node_modules 已存在
) else (
    echo     ● 正在安装前端依赖...
    cd /d "%FRONTEND_DIR%"
    call pnpm install --frozen-lockfile
    if exist "%FRONTEND_DIR%\node_modules" (
        echo     √ 前端依赖安装完成
    ) else (
        echo     X 前端依赖安装失败
        set /a FAIL_COUNT+=1
    )
)
cd /d "%FRONTEND_DIR%"
call pnpm approve-builds --all >nul 2>&1

:: 8. Prisma 客户端生成
set /a STEP+=1
echo.
echo [%STEP%] 生成 Prisma 客户端
cd /d "%BACKEND_DIR%"
call pnpm exec prisma generate >nul 2>&1
echo     √ Prisma 客户端已生成

:: 9. 数据库迁移
set /a STEP+=1
echo.
echo [%STEP%] 执行数据库迁移
cd /d "%BACKEND_DIR%"
call pnpm exec prisma migrate deploy >nul 2>&1
echo     √ 数据库迁移完成

:: ═══════════════════════════════════════════════════════════
::  阶段 3：端口检查
:: ═══════════════════════════════════════════════════════════
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   阶段 3/4  端口检查
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

set /a STEP+=1
echo.
echo [%STEP%] 检查后端端口 :%BACKEND_PORT%
netstat -ano 2>nul | findstr ":%BACKEND_PORT% " | findstr "LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo     ! 端口 %BACKEND_PORT% 已被占用，后端可能无法启动
    echo     ! 请手动关闭占用进程或修改 .env 中的 PORT
    set /a FAIL_COUNT+=1
) else (
    echo     √ 端口 %BACKEND_PORT% 可用
)

set /a STEP+=1
echo.
echo [%STEP%] 检查前端端口 :%FRONTEND_PORT%
netstat -ano 2>nul | findstr ":%FRONTEND_PORT% " | findstr "LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo     ! 端口 %FRONTEND_PORT% 已被占用 (Vite 会自动尝试下一个端口)
) else (
    echo     √ 端口 %FRONTEND_PORT% 可用
)

:: ═══════════════════════════════════════════════════════════
::  检查汇总
:: ═══════════════════════════════════════════════════════════
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
if %FAIL_COUNT% gtr 0 (
    echo   预检发现 %FAIL_COUNT% 个问题
    echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    echo.
    set /p "CONT=  是否仍然尝试启动？(y/N) "
    if /i not "!CONT!"=="y" (
        echo.
        echo   已取消启动。请修复上述问题后重试。
        echo.
        pause
        exit /b 1
    )
) else (
    echo   所有检查通过！
    echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
)

:: ═══════════════════════════════════════════════════════════
::  阶段 4：启动服务
:: ═══════════════════════════════════════════════════════════
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   阶段 4/4  启动服务
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

set /a STEP+=1
echo.
echo [%STEP%] 启动后端服务 (Express + Prisma + SQLite)
echo     → 端口: http://127.0.0.1:%BACKEND_PORT%
start "ComputerAsset-Backend" cmd /c "cd /d "%BACKEND_DIR%" && title ComputerAsset Backend && pnpm run dev"

:: 等待后端就绪
echo     等待后端服务就绪...
set WAIT=0
:wait_backend
if %WAIT% geq 20 goto :backend_timeout
timeout /t 1 /nobreak >nul
set /a WAIT+=1
curl -s --connect-timeout 2 "http://127.0.0.1:%BACKEND_PORT%/api/health" >nul 2>&1
if %errorlevel% equ 0 (
    echo     √ 后端服务已就绪 (%WAIT%s^)
    goto :start_frontend
)
goto :wait_backend

:backend_timeout
echo     ! 后端服务可能仍在启动中 (已等待 %WAIT%s^)

:start_frontend
set /a STEP+=1
echo.
echo [%STEP%] 启动前端服务 (Vite + Vue 3)
echo     → 端口: http://localhost:%FRONTEND_PORT%
start "ComputerAsset-Frontend" cmd /c "cd /d "%FRONTEND_DIR%" && title ComputerAsset Frontend && pnpm run dev"

timeout /t 3 /nobreak >nul

echo.
echo.
echo   ╔═══════════════════════════════════════════════╗
echo   ║                                               ║
echo   ║    √  ComputerAsset 启动成功！                ║
echo   ║                                               ║
echo   ╠═══════════════════════════════════════════════╣
echo   ║                                               ║
echo   ║    前端:  http://localhost:%FRONTEND_PORT%           ║
echo   ║    后端:  http://127.0.0.1:%BACKEND_PORT%           ║
echo   ║                                               ║
echo   ║    默认账号: admin / admin123                  ║
echo   ║                                               ║
echo   ╚═══════════════════════════════════════════════╝
echo.
echo   提示：关闭此窗口不会停止服务
echo   要停止服务，请关闭 Backend 和 Frontend 两个命令行窗口
echo.
pause
