@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

:: ============================================================
::  ComputerAsset 一键启动脚本 (Windows)
:: ============================================================

set "ROOT_DIR=%~dp0"
if "%ROOT_DIR:~-1%"=="\" set "ROOT_DIR=%ROOT_DIR:~0,-1%"
set "BACKEND_DIR=%ROOT_DIR%\backend"
set "FRONTEND_DIR=%ROOT_DIR%\frontend"
set "BACKEND_PORT=3000"
set "FRONTEND_PORT=5173"
set "FAIL_COUNT=0"
set "STEP=0"

cls
echo.
echo   +---------------------------------------------------+
echo   ^|                                                   ^|
echo   ^|        ComputerAsset                              ^|
echo   ^|        电脑资产管理系统 v1.4.0                    ^|
echo   ^|                                                   ^|
echo   +---------------------------------------------------+
echo.
echo     项目目录 : %ROOT_DIR%
echo     启动时间 : %date% %time:~0,8%
echo.

:: =============================================================
::  阶段 1 : 环境检查
:: =============================================================
echo -----------------------------------------------------------
echo   阶段 1/4  环境检查
echo -----------------------------------------------------------

:: -- 1. Node.js --
set /a STEP+=1
echo.
echo [%STEP%] 检查 Node.js ...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo     [失败] 未安装 Node.js, 请先安装 https://nodejs.org/
    set /a FAIL_COUNT+=1
    goto :check_pnpm
)
for /f "tokens=*" %%v in ('node -v') do set "NODE_VER=%%v"
echo     [通过] Node.js %NODE_VER%

:check_pnpm
:: -- 2. pnpm --
set /a STEP+=1
echo.
echo [%STEP%] 检查 pnpm 包管理器 ...
where pnpm >nul 2>&1
if %errorlevel% neq 0 (
    echo     [提示] 未找到 pnpm, 尝试通过 corepack 启用 ...
    corepack enable >nul 2>&1
    where pnpm >nul 2>&1
    if !errorlevel! neq 0 (
        echo     [失败] 无法安装 pnpm, 请运行: npm install -g pnpm
        set /a FAIL_COUNT+=1
    ) else (
        for /f "tokens=*" %%v in ('pnpm -v') do echo     [通过] pnpm v%%v (corepack)
    )
) else (
    for /f "tokens=*" %%v in ('pnpm -v') do echo     [通过] pnpm v%%v
)

:: -- 3. 项目目录 --
set /a STEP+=1
echo.
echo [%STEP%] 检查项目目录 ...
if exist "%BACKEND_DIR%" (
    echo     [通过] backend/
) else (
    echo     [失败] 缺少 backend/ 目录
    set /a FAIL_COUNT+=1
)
if exist "%FRONTEND_DIR%" (
    echo     [通过] frontend/
) else (
    echo     [失败] 缺少 frontend/ 目录
    set /a FAIL_COUNT+=1
)

:: -- 4. 网络 --
set /a STEP+=1
echo.
echo [%STEP%] 检查网络连通性 ...
ping -n 1 -w 3000 8.8.8.8 >nul 2>&1
if %errorlevel% equ 0 (
    echo     [通过] 网络连通
) else (
    echo     [警告] 网络不通, 若依赖已安装则不影响启动
)

:: =============================================================
::  阶段 2 : 依赖与配置
:: =============================================================
echo.
echo -----------------------------------------------------------
echo   阶段 2/4  依赖与配置
echo -----------------------------------------------------------

:: -- 5. .env --
set /a STEP+=1
echo.
echo [%STEP%] 检查后端 .env 配置 ...
if exist "%BACKEND_DIR%\.env" (
    echo     [通过] .env 文件已存在
) else (
    if exist "%BACKEND_DIR%\.env.example" (
        copy "%BACKEND_DIR%\.env.example" "%BACKEND_DIR%\.env" >nul
        echo     [通过] 已从 .env.example 创建 .env
        echo     [警告] 生产环境请务必修改 JWT_SECRET !
    ) else (
        echo     [失败] 找不到 .env.example
        set /a FAIL_COUNT+=1
    )
)

:: 读取 PORT
for /f "tokens=1,* delims==" %%a in ('findstr /b "PORT=" "%BACKEND_DIR%\.env" 2^>nul') do (
    set "BACKEND_PORT=%%b"
)
for /f "tokens=* delims= " %%x in ("!BACKEND_PORT!") do set "BACKEND_PORT=%%~x"

:: -- 6. 后端依赖 --
set /a STEP+=1
echo.
echo [%STEP%] 检查后端依赖 ...
if exist "%BACKEND_DIR%\node_modules" (
    echo     [通过] node_modules 已存在
) else (
    echo     [....] 正在安装后端依赖 ...
    cd /d "%BACKEND_DIR%"
    call pnpm install
    if exist "%BACKEND_DIR%\node_modules" (
        echo     [通过] 后端依赖安装完成
    ) else (
        echo     [失败] 后端依赖安装失败
        set /a FAIL_COUNT+=1
    )
)
echo     [....] 构建原生模块 (esbuild, prisma, better-sqlite3) ...
cd /d "%BACKEND_DIR%"
call pnpm approve-builds --all >nul 2>&1
echo     [通过] 原生模块构建完成

:: -- 7. 前端依赖 --
set /a STEP+=1
echo.
echo [%STEP%] 检查前端依赖 ...
if exist "%FRONTEND_DIR%\node_modules" (
    echo     [通过] node_modules 已存在
) else (
    echo     [....] 正在安装前端依赖 ...
    cd /d "%FRONTEND_DIR%"
    call pnpm install
    if exist "%FRONTEND_DIR%\node_modules" (
        echo     [通过] 前端依赖安装完成
    ) else (
        echo     [失败] 前端依赖安装失败
        set /a FAIL_COUNT+=1
    )
)
cd /d "%FRONTEND_DIR%"
call pnpm approve-builds --all >nul 2>&1

:: -- 8. Prisma 客户端 --
set /a STEP+=1
echo.
echo [%STEP%] 生成 Prisma 客户端 ...
cd /d "%BACKEND_DIR%"
call pnpm exec prisma generate >nul 2>&1
if %errorlevel% neq 0 (
    echo     [警告] 首次生成失败, 重试中 ...
    call pnpm exec prisma generate
    if !errorlevel! neq 0 (
        echo     [失败] Prisma 客户端生成失败
        set /a FAIL_COUNT+=1
    ) else (
        echo     [通过] Prisma 客户端已生成 (重试成功)
    )
) else (
    echo     [通过] Prisma 客户端已生成
)

:: -- 9. 数据库迁移 --
set /a STEP+=1
echo.
echo [%STEP%] 执行数据库迁移 ...
cd /d "%BACKEND_DIR%"
call pnpm exec prisma migrate deploy >nul 2>&1
if %errorlevel% neq 0 (
    echo     [警告] 数据库迁移可能未完全成功, 请检查后端日志
) else (
    echo     [通过] 数据库迁移完成
)

:: =============================================================
::  阶段 3 : 端口检查
:: =============================================================
echo.
echo -----------------------------------------------------------
echo   阶段 3/4  端口检查
echo -----------------------------------------------------------

:: -- 后端端口 --
set /a STEP+=1
echo.
echo [%STEP%] 检查后端端口 :%BACKEND_PORT% ...
set "BACKEND_PORT_PID="
for /f "tokens=5" %%p in ('netstat -ano 2^>nul ^| findstr ":%BACKEND_PORT% " ^| findstr "LISTENING"') do (
    if not defined BACKEND_PORT_PID set "BACKEND_PORT_PID=%%p"
)
if defined BACKEND_PORT_PID (
    echo     [冲突] 端口 %BACKEND_PORT% 已被占用 (PID: !BACKEND_PORT_PID!)
    for /f "tokens=1" %%n in ('tasklist /fi "PID eq !BACKEND_PORT_PID!" /fo csv /nh 2^>nul') do (
        echo     [信息] 占用进程: %%~n
    )
    echo.
    set /p "KILL_CHOICE=     是否终止该进程以释放端口? (y/N) "
    if /i "!KILL_CHOICE!"=="y" (
        taskkill /pid !BACKEND_PORT_PID! /f >nul 2>&1
        timeout /t 1 /nobreak >nul
        set "CHECK_AGAIN="
        for /f "tokens=5" %%q in ('netstat -ano 2^>nul ^| findstr ":%BACKEND_PORT% " ^| findstr "LISTENING"') do (
            set "CHECK_AGAIN=1"
        )
        if defined CHECK_AGAIN (
            echo     [失败] 无法释放端口 %BACKEND_PORT%
            set /a FAIL_COUNT+=1
        ) else (
            echo     [通过] 端口 %BACKEND_PORT% 已释放
        )
    ) else (
        echo     [失败] 端口 %BACKEND_PORT% 被占用, 后端可能无法启动
        set /a FAIL_COUNT+=1
    )
) else (
    echo     [通过] 端口 %BACKEND_PORT% 可用
)

:: -- 前端端口 --
set /a STEP+=1
echo.
echo [%STEP%] 检查前端端口 :%FRONTEND_PORT% ...
set "FRONTEND_PORT_PID="
for /f "tokens=5" %%p in ('netstat -ano 2^>nul ^| findstr ":%FRONTEND_PORT% " ^| findstr "LISTENING"') do (
    if not defined FRONTEND_PORT_PID set "FRONTEND_PORT_PID=%%p"
)
if defined FRONTEND_PORT_PID (
    echo     [冲突] 端口 %FRONTEND_PORT% 已被占用 (PID: !FRONTEND_PORT_PID!)
    echo.
    set /p "KILL_FE=     是否终止该进程以释放端口? (y/N) "
    if /i "!KILL_FE!"=="y" (
        taskkill /pid !FRONTEND_PORT_PID! /f >nul 2>&1
        timeout /t 1 /nobreak >nul
        echo     [通过] 已尝试释放端口 %FRONTEND_PORT%
    ) else (
        echo     [警告] 端口被占用, Vite 会自动尝试下一个端口
    )
) else (
    echo     [通过] 端口 %FRONTEND_PORT% 可用
)

:: =============================================================
::  检查汇总
:: =============================================================
echo.
echo -----------------------------------------------------------
if %FAIL_COUNT% gtr 0 (
    echo   [!] 预检发现 %FAIL_COUNT% 个问题
    echo -----------------------------------------------------------
    echo.
    set /p "CONT=  是否仍然尝试启动? (y/N) "
    if /i not "!CONT!"=="y" (
        echo.
        echo   已取消启动, 请修复上述问题后重试。
        echo.
        pause
        exit /b 1
    )
) else (
    echo   [OK] 所有检查通过!
    echo -----------------------------------------------------------
)

:: =============================================================
::  阶段 4 : 启动服务
:: =============================================================
echo.
echo -----------------------------------------------------------
echo   阶段 4/4  启动服务
echo -----------------------------------------------------------

:: -- 后端 --
set /a STEP+=1
echo.
echo [%STEP%] 启动后端服务 (Express + Prisma + SQLite) ...
echo     端口 : http://127.0.0.1:%BACKEND_PORT%

start "ComputerAsset-Backend" /D "%BACKEND_DIR%" cmd /k "title [ComputerAsset] 后端服务 && pnpm run dev"

:: 等待后端就绪
echo     等待后端服务就绪 ...
set WAIT=0
:wait_backend
if %WAIT% geq 30 goto :backend_timeout
timeout /t 1 /nobreak >nul
set /a WAIT+=1

:: 检查后端窗口是否还存在
tasklist /fi "WINDOWTITLE eq [ComputerAsset] 后端服务*" 2>nul | findstr "cmd" >nul 2>&1
if %errorlevel% neq 0 (
    if %WAIT% gtr 5 goto :backend_crashed
)

:: 健康检查 - 优先 curl, 回退 powershell
where curl >nul 2>&1
if %errorlevel% equ 0 (
    curl -s --connect-timeout 2 "http://127.0.0.1:%BACKEND_PORT%/api/health" >nul 2>&1
    if !errorlevel! equ 0 (
        echo     [通过] 后端服务已就绪 (%WAIT%s)
        goto :start_frontend
    )
) else (
    powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://127.0.0.1:%BACKEND_PORT%/api/health' -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop; exit 0 } catch { exit 1 }" >nul 2>&1
    if !errorlevel! equ 0 (
        echo     [通过] 后端服务已就绪 (%WAIT%s)
        goto :start_frontend
    )
)
goto :wait_backend

:backend_crashed
echo.
echo     [失败] 后端服务启动失败!
echo.
echo     +--------------------------------------------------+
echo     ^|  常见原因及解决方法:                             ^|
echo     ^|                                                  ^|
echo     ^|  1. 端口被占用                                   ^|
echo     ^|     -^> 修改 backend\.env 中的 PORT              ^|
echo     ^|                                                  ^|
echo     ^|  2. Prisma 客户端未正确生成                      ^|
echo     ^|     -^> 运行: cd backend ^&^& pnpm exec prisma generate ^|
echo     ^|                                                  ^|
echo     ^|  3. 数据库文件损坏                               ^|
echo     ^|     -^> 删除 backend\data\dev.db 后重新迁移      ^|
echo     ^|                                                  ^|
echo     ^|  4. 依赖缺失                                     ^|
echo     ^|     -^> 运行: cd backend ^&^& pnpm install        ^|
echo     ^|                                                  ^|
echo     ^|  查看后端窗口的错误信息以确认具体原因            ^|
echo     +--------------------------------------------------+
echo.
set /p "CONT_AFTER_FAIL=  是否仍然启动前端? (y/N) "
if /i not "!CONT_AFTER_FAIL!"=="y" (
    echo.
    echo   已取消。请根据上方提示修复后重试。
    echo.
    pause
    exit /b 1
)
goto :start_frontend

:backend_timeout
echo     [警告] 后端服务可能仍在启动中 (已等待 %WAIT%s)

:start_frontend
:: -- 前端 --
set /a STEP+=1
echo.
echo [%STEP%] 启动前端服务 (Vite + Vue 3) ...
echo     端口 : http://localhost:%FRONTEND_PORT%

start "ComputerAsset-Frontend" /D "%FRONTEND_DIR%" cmd /k "title [ComputerAsset] 前端服务 && pnpm run dev"

timeout /t 3 /nobreak >nul

echo.
echo.
echo   +---------------------------------------------------+
echo   ^|                                                   ^|
echo   ^|    ComputerAsset 启动成功!                        ^|
echo   ^|                                                   ^|
echo   ^|    前端地址 : http://localhost:%FRONTEND_PORT%            ^|
echo   ^|    后端地址 : http://127.0.0.1:%BACKEND_PORT%            ^|
echo   ^|                                                   ^|
echo   ^|    默认账号 : admin                               ^|
echo   ^|    默认密码 : admin123                             ^|
echo   ^|                                                   ^|
echo   +---------------------------------------------------+
echo.
echo   提示: 关闭 "后端服务" 和 "前端服务" 两个窗口即可停止
echo.
pause
