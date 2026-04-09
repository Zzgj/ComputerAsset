@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

:: ============================================================
::  ComputerAsset 一键部署脚本
::  在 Windows Server 2019 内网服务器上运行
::  要求: Node.js >= 20 已安装
:: ============================================================

set "ROOT_DIR=%~dp0"
if "%ROOT_DIR:~-1%"=="\" set "ROOT_DIR=%ROOT_DIR:~0,-1%"
set "BACKEND_DIR=%ROOT_DIR%\backend"
set "FRONTEND_DIR=%ROOT_DIR%\frontend"
set "PORT=3000"
set "FAIL=0"

cls
echo.
echo   +---------------------------------------------------+
echo   ^|                                                   ^|
echo   ^|   ComputerAsset 一键部署                          ^|
echo   ^|   电脑资产管理系统 v1.2.0                         ^|
echo   ^|                                                   ^|
echo   ^|   目标环境: Windows Server 2019 (内网)            ^|
echo   ^|                                                   ^|
echo   +---------------------------------------------------+
echo.
echo   部署目录 : %ROOT_DIR%
echo   部署时间 : %date% %time:~0,8%
echo.

:: ============================================================
::  阶段 1: 环境检查
:: ============================================================
echo -----------------------------------------------------------
echo   阶段 1/4  环境检查
echo -----------------------------------------------------------

echo.
echo [1] 检查 Node.js ...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo     [失败] 未安装 Node.js
    echo     [提示] 请先安装 Node.js ^>= 20, 下载地址: https://nodejs.org/
    set /a FAIL+=1
    goto :check_dirs
)
for /f "tokens=*" %%v in ('node -v') do set "NODE_VER=%%v"
echo     [通过] Node.js %NODE_VER%

:: 检查版本 >= 20
for /f "tokens=1 delims=." %%m in ("%NODE_VER:~1%") do set "NODE_MAJOR=%%m"
if %NODE_MAJOR% lss 20 (
    echo     [失败] Node.js 版本过低, 需要 v20 或更高 (当前: %NODE_VER%)
    set /a FAIL+=1
)

:check_dirs
echo.
echo [2] 检查部署文件完整性 ...
set "DIRS_OK=1"
if not exist "%BACKEND_DIR%\dist\server.js" (
    echo     [失败] 缺少 backend\dist\server.js (后端构建产物)
    set "DIRS_OK=0"
    set /a FAIL+=1
)
if not exist "%BACKEND_DIR%\node_modules" (
    echo     [失败] 缺少 backend\node_modules (后端依赖)
    set "DIRS_OK=0"
    set /a FAIL+=1
)
if not exist "%FRONTEND_DIR%\dist\index.html" (
    echo     [失败] 缺少 frontend\dist\index.html (前端构建产物)
    set "DIRS_OK=0"
    set /a FAIL+=1
)
if not exist "%BACKEND_DIR%\prisma\schema.prisma" (
    echo     [失败] 缺少 backend\prisma\schema.prisma
    set "DIRS_OK=0"
    set /a FAIL+=1
)
if "%DIRS_OK%"=="1" (
    echo     [通过] 所有必要文件完整
)

:: ============================================================
::  阶段 2: 配置
:: ============================================================
echo.
echo -----------------------------------------------------------
echo   阶段 2/4  配置
echo -----------------------------------------------------------

echo.
echo [3] 检查 .env 配置文件 ...
if exist "%BACKEND_DIR%\.env" (
    echo     [通过] .env 已存在
) else (
    if exist "%BACKEND_DIR%\.env.example" (
        copy "%BACKEND_DIR%\.env.example" "%BACKEND_DIR%\.env" >nul
        echo     [通过] 已从 .env.example 创建 .env
    ) else (
        echo     [失败] 找不到 .env.example
        set /a FAIL+=1
    )
)

:: 读取端口
for /f "tokens=1,* delims==" %%a in ('findstr /b "PORT=" "%BACKEND_DIR%\.env" 2^>nul') do (
    set "PORT=%%b"
)
for /f "tokens=* delims= " %%x in ("!PORT!") do set "PORT=%%~x"
echo     [信息] 服务端口: %PORT%

echo.
echo [4] 创建数据目录 ...
if not exist "%BACKEND_DIR%\data" mkdir "%BACKEND_DIR%\data"
echo     [通过] backend\data\ 已就绪

:: ============================================================
::  阶段 3: 数据库
:: ============================================================
echo.
echo -----------------------------------------------------------
echo   阶段 3/4  数据库初始化
echo -----------------------------------------------------------

echo.
echo [5] 执行数据库迁移 ...
cd /d "%BACKEND_DIR%"

:: prisma migrate deploy 需要 node 能找到 prisma CLI
:: 在无 pnpm 环境下直接用 node 调用 prisma
set "PRISMA_CLI=%BACKEND_DIR%\node_modules\.bin\prisma.cmd"
if exist "%PRISMA_CLI%" (
    call "%PRISMA_CLI%" migrate deploy 2>&1
    if !errorlevel! neq 0 (
        echo     [警告] 数据库迁移可能未完全成功
    ) else (
        echo     [通过] 数据库迁移完成
    )
) else (
    :: 回退方案: 直接调用 prisma 的 JS 入口
    node "%BACKEND_DIR%\node_modules\prisma\build\index.js" migrate deploy 2>&1
    if !errorlevel! neq 0 (
        echo     [警告] 数据库迁移可能未完全成功
    ) else (
        echo     [通过] 数据库迁移完成
    )
)

:: ============================================================
::  阶段 4: 端口检查与启动
:: ============================================================
echo.
echo -----------------------------------------------------------
echo   阶段 4/4  启动服务
echo -----------------------------------------------------------

echo.
echo [6] 检查端口 :%PORT% ...
set "PORT_PID="
for /f "tokens=5" %%p in ('netstat -ano 2^>nul ^| findstr ":%PORT% " ^| findstr "LISTENING"') do (
    if not defined PORT_PID set "PORT_PID=%%p"
)
if defined PORT_PID (
    echo     [冲突] 端口 %PORT% 已被占用 (PID: !PORT_PID!)
    for /f "tokens=1" %%n in ('tasklist /fi "PID eq !PORT_PID!" /fo csv /nh 2^>nul') do (
        echo     [信息] 占用进程: %%~n
    )
    echo.
    set /p "KILL_CHOICE=     是否终止该进程? (y/N) "
    if /i "!KILL_CHOICE!"=="y" (
        taskkill /pid !PORT_PID! /f >nul 2>&1
        timeout /t 2 /nobreak >nul
        echo     [通过] 已终止进程
    ) else (
        echo     [失败] 端口被占用, 无法启动
        set /a FAIL+=1
    )
) else (
    echo     [通过] 端口 %PORT% 可用
)

:: -- 检查汇总 --
echo.
echo -----------------------------------------------------------
if %FAIL% gtr 0 (
    echo   [!] 发现 %FAIL% 个问题
    echo -----------------------------------------------------------
    echo.
    set /p "CONT=  是否仍然尝试启动? (y/N) "
    if /i not "!CONT!"=="y" (
        echo.
        echo   已取消。请修复上述问题后重试。
        pause
        exit /b 1
    )
) else (
    echo   [OK] 所有检查通过!
    echo -----------------------------------------------------------
)

:: -- 启动 --
echo.
echo [7] 启动 ComputerAsset 服务 ...
echo     端口   : http://127.0.0.1:%PORT%
echo     模式   : 生产模式 (前后端合一)
echo.

cd /d "%BACKEND_DIR%"
start "[ComputerAsset] 服务" /D "%BACKEND_DIR%" cmd /k "title [ComputerAsset] 服务 (端口:%PORT%) && node dist/server.js"

:: 等待服务就绪
echo     等待服务启动 ...
set WAIT=0
:wait_start
if %WAIT% geq 30 goto :start_timeout
timeout /t 1 /nobreak >nul
set /a WAIT+=1

:: 健康检查
where curl >nul 2>&1
if %errorlevel% equ 0 (
    curl -s --connect-timeout 2 "http://127.0.0.1:%PORT%/api/health" >nul 2>&1
    if !errorlevel! equ 0 goto :start_ok
) else (
    powershell -Command "try { Invoke-WebRequest -Uri 'http://127.0.0.1:%PORT%/api/health' -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop; exit 0 } catch { exit 1 }" >nul 2>&1
    if !errorlevel! equ 0 goto :start_ok
)
goto :wait_start

:start_timeout
echo     [警告] 服务可能仍在启动中 (已等待 %WAIT%s)
echo     [提示] 请查看服务窗口确认是否有错误信息
goto :done

:start_ok
echo     [通过] 服务已就绪 (%WAIT%s)

:done
echo.
echo.
echo   +---------------------------------------------------+
echo   ^|                                                   ^|
echo   ^|   ComputerAsset 部署完成!                         ^|
echo   ^|                                                   ^|
echo   ^|   访问地址 : http://127.0.0.1:%PORT%                   ^|
echo   ^|   局域网   : http://本机IP:%PORT%                      ^|
echo   ^|                                                   ^|
echo   ^|   默认账号 : admin                                ^|
echo   ^|   默认密码 : admin123                              ^|
echo   ^|                                                   ^|
echo   ^|   重要: 首次登录后请立即修改默认密码!             ^|
echo   ^|                                                   ^|
echo   +---------------------------------------------------+
echo.
echo   停止服务: 运行 stop.bat 或关闭服务窗口
echo   重新部署: 运行 deploy.bat
echo.
pause
