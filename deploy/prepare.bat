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
echo   ^|   ComputerAsset deploy package builder            ^|
echo   ^|                                                   ^|
echo   ^|   Run this on a machine WITH internet access.     ^|
echo   ^|   Output can be copied to air-gapped servers.     ^|
echo   ^|                                                   ^|
echo   +---------------------------------------------------+
echo.

echo [1] Check environment ...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo     [FAIL] Node.js not installed
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('node -v') do echo     [OK] Node.js %%v

where pnpm >nul 2>&1
if %errorlevel% neq 0 (
    echo     [INFO] pnpm not found, installing via npm ...
    call npm install -g pnpm
)
for /f "tokens=*" %%v in ('pnpm -v') do echo     [OK] pnpm v%%v

echo.
echo [2] Clean previous build ...
if exist "%DEPLOY_DIR%" rd /s /q "%DEPLOY_DIR%"
mkdir "%DEPLOY_DIR%"
echo     [OK] Cleaned

echo.
echo [3] Install backend dependencies ...
cd /d "%BACKEND_DIR%"
call pnpm install
call pnpm approve-builds --all >nul 2>&1
echo     [OK] Backend dependencies installed

if not exist "%BACKEND_DIR%\.env" (
    if exist "%BACKEND_DIR%\.env.example" (
        copy "%BACKEND_DIR%\.env.example" "%BACKEND_DIR%\.env" >nul
        echo     [OK] Created .env from .env.example
    )
)

echo.
echo [4] Generate Prisma client ...
cd /d "%BACKEND_DIR%"
call pnpm exec prisma generate
if %errorlevel% neq 0 (
    echo     [FAIL] Prisma generate failed
    pause
    exit /b 1
)
echo     [OK] Prisma client generated

echo.
echo [5] Build backend ...
cd /d "%BACKEND_DIR%"
call pnpm run build
if %errorlevel% neq 0 (
    echo     [FAIL] Backend build failed
    pause
    exit /b 1
)
echo     [OK] Backend built

echo.
echo [6] Install frontend dependencies and build ...
cd /d "%FRONTEND_DIR%"
call pnpm install
call pnpm approve-builds --all >nul 2>&1
call pnpm run build
if %errorlevel% neq 0 (
    echo     [FAIL] Frontend build failed
    pause
    exit /b 1
)
echo     [OK] Frontend built

echo.
echo [7] Assemble deploy package ...
echo     Copying backend dist ...
mkdir "%DEPLOY_DIR%\backend\dist" >nul 2>&1
robocopy "%BACKEND_DIR%\dist" "%DEPLOY_DIR%\backend\dist" /e /nfl /ndl /njh /njs /nc /ns /np >nul

echo     Copying backend node_modules (this may take a minute) ...
mkdir "%DEPLOY_DIR%\backend\node_modules" >nul 2>&1
robocopy "%BACKEND_DIR%\node_modules" "%DEPLOY_DIR%\backend\node_modules" /e /nfl /ndl /njh /njs /nc /ns /np >nul

echo     Copying prisma schema and migrations ...
mkdir "%DEPLOY_DIR%\backend\prisma\migrations" >nul 2>&1
copy "%BACKEND_DIR%\prisma\schema.prisma" "%DEPLOY_DIR%\backend\prisma\" >nul
robocopy "%BACKEND_DIR%\prisma\migrations" "%DEPLOY_DIR%\backend\prisma\migrations" /e /nfl /ndl /njh /njs /nc /ns /np >nul

echo     Copying config files ...
copy "%BACKEND_DIR%\prisma.config.ts" "%DEPLOY_DIR%\backend\" >nul
copy "%BACKEND_DIR%\package.json" "%DEPLOY_DIR%\backend\" >nul
copy "%BACKEND_DIR%\.env.example" "%DEPLOY_DIR%\backend\" >nul

echo     Copying frontend dist ...
mkdir "%DEPLOY_DIR%\frontend\dist" >nul 2>&1
robocopy "%FRONTEND_DIR%\dist" "%DEPLOY_DIR%\frontend\dist" /e /nfl /ndl /njh /njs /nc /ns /np >nul

echo     Copying deploy scripts ...
copy "%ROOT_DIR%\deploy\deploy.bat" "%DEPLOY_DIR%\" >nul
copy "%ROOT_DIR%\deploy\stop.bat" "%DEPLOY_DIR%\" >nul
copy "%ROOT_DIR%\deploy\README.txt" "%DEPLOY_DIR%\" >nul

echo     [OK] Deploy package assembled

echo.
echo   +---------------------------------------------------+
echo   ^|                                                   ^|
echo   ^|   Build complete!                                 ^|
echo   ^|                                                   ^|
echo   ^|   Output: deploy-package\                         ^|
echo   ^|                                                   ^|
echo   ^|   Copy the entire deploy-package folder to the    ^|
echo   ^|   target server, then run deploy.bat              ^|
echo   ^|                                                   ^|
echo   +---------------------------------------------------+
echo.
pause
