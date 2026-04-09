@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

set "BACKEND_DIR=%~dp0backend"
set "PORT=3000"

if exist "%BACKEND_DIR%\.env" (
    for /f "tokens=1,* delims==" %%a in ('findstr /b "PORT=" "%BACKEND_DIR%\.env" 2^>nul') do (
        set "PORT=%%b"
    )
    for /f "tokens=* delims= " %%x in ("!PORT!") do set "PORT=%%~x"
)

echo.
echo   ComputerAsset - 停止服务
echo   -----------------------------------------------------------
echo.

set "FOUND=0"
for /f "tokens=5" %%p in ('netstat -ano 2^>nul ^| findstr ":%PORT% " ^| findstr "LISTENING"') do (
    if not defined DONE (
        set "DONE=1"
        set "FOUND=1"
        echo   [信息] 发现服务进程 PID %%p, 端口 %PORT%
        taskkill /pid %%p /f >nul 2>&1
        if !errorlevel! equ 0 (
            echo   [通过] 服务已停止
        ) else (
            echo   [失败] 无法停止进程, 请手动关闭服务窗口
        )
    )
)

if "%FOUND%"=="0" (
    echo   [信息] 端口 %PORT% 上没有运行中的服务
)

echo.
pause
