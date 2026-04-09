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
echo   ComputerAsset - Stop Service
echo   -----------------------------------------------------------
echo.

set "FOUND=0"
for /f "tokens=5" %%p in ('netstat -ano 2^>nul ^| findstr ":%PORT% " ^| findstr "LISTENING"') do (
    if not defined DONE (
        set "DONE=1"
        set "FOUND=1"
        echo   [INFO] Found process PID %%p on port %PORT%
        taskkill /pid %%p /f >nul 2>&1
        if !errorlevel! equ 0 (
            echo   [OK] Service stopped
        ) else (
            echo   [FAIL] Cannot stop, close the service window manually
        )
    )
)

if "%FOUND%"=="0" (
    echo   [INFO] No service running on port %PORT%
)

echo.
pause
