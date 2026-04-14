@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

set "ROOT_DIR=%~dp0"
if "%ROOT_DIR:~-1%"=="\" set "ROOT_DIR=%ROOT_DIR:~0,-1%"
set "BACKEND_DIR=%ROOT_DIR%\backend"
set "PORT=3000"

if exist "%BACKEND_DIR%\.env" (
    for /f "tokens=1,* delims==" %%a in ('findstr /b "PORT=" "%BACKEND_DIR%\.env" 2^>nul') do (
        set "PORT=%%b"
    )
    for /f "tokens=* delims= " %%x in ("!PORT!") do set "PORT=%%~x"
)

echo.
echo   ComputerAsset - Stop (dev backend port)
echo   -----------------------------------------------------------
echo   Backend dir: %BACKEND_DIR%
echo   Port: %PORT%
echo.

set "FOUND=0"
for /f "tokens=5" %%p in ('netstat -ano 2^>nul ^| findstr ":%PORT% " ^| findstr "LISTENING"') do (
    if not defined DONE (
        set "DONE=1"
        set "FOUND=1"
        echo   [INFO] Listening PID %%p on port %PORT%
        taskkill /pid %%p /f >nul 2>&1
        if !errorlevel! equ 0 (
            echo   [OK] Stopped
        ) else (
            echo   [FAIL] Cannot stop PID %%p
        )
    )
)

if "%FOUND%"=="0" (
    echo   [INFO] No LISTENING process on port %PORT%
)

echo.
if /i "%~1"=="nopause" exit /b 0
pause
