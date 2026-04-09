@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

:: ============================================================
::  ComputerAsset - One-Click Startup Script (Windows)
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
echo   +===================================================+
echo   ^|                                                   ^|
echo   ^|        ComputerAsset Launcher                     ^|
echo   ^|        Computer Asset Management System v1.1.5    ^|
echo   ^|                                                   ^|
echo   +===================================================+
echo.
echo     Project : %ROOT_DIR%
echo     Time    : %date% %time:~0,8%
echo.

:: =============================================================
::  Phase 1: Environment Check
:: =============================================================
echo -----------------------------------------------------------
echo   Phase 1/4  Environment Check
echo -----------------------------------------------------------

:: -- 1. Node.js --
set /a STEP+=1
echo.
echo [%STEP%] Checking Node.js ...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo     [FAIL] Node.js not installed. Please install from https://nodejs.org/
    set /a FAIL_COUNT+=1
    goto :check_pnpm
)
for /f "tokens=*" %%v in ('node -v') do set "NODE_VER=%%v"
echo     [OK] Node.js %NODE_VER%

:check_pnpm
:: -- 2. pnpm --
set /a STEP+=1
echo.
echo [%STEP%] Checking pnpm ...
where pnpm >nul 2>&1
if %errorlevel% neq 0 (
    echo     [WARN] pnpm not found, trying corepack ...
    corepack enable >nul 2>&1
    where pnpm >nul 2>&1
    if !errorlevel! neq 0 (
        echo     [FAIL] Cannot install pnpm. Run: npm install -g pnpm
        set /a FAIL_COUNT+=1
    ) else (
        for /f "tokens=*" %%v in ('pnpm -v') do echo     [OK] pnpm v%%v (via corepack)
    )
) else (
    for /f "tokens=*" %%v in ('pnpm -v') do echo     [OK] pnpm v%%v
)

:: -- 3. Directories --
set /a STEP+=1
echo.
echo [%STEP%] Checking project directories ...
if exist "%BACKEND_DIR%" (
    echo     [OK] backend/
) else (
    echo     [FAIL] Missing backend/
    set /a FAIL_COUNT+=1
)
if exist "%FRONTEND_DIR%" (
    echo     [OK] frontend/
) else (
    echo     [FAIL] Missing frontend/
    set /a FAIL_COUNT+=1
)

:: -- 4. Network --
set /a STEP+=1
echo.
echo [%STEP%] Checking network ...
ping -n 1 -w 3000 8.8.8.8 >nul 2>&1
if %errorlevel% equ 0 (
    echo     [OK] Network is reachable
) else (
    echo     [WARN] Network unreachable - OK if dependencies are already installed
)

:: =============================================================
::  Phase 2: Dependencies ^& Configuration
:: =============================================================
echo.
echo -----------------------------------------------------------
echo   Phase 2/4  Dependencies ^& Configuration
echo -----------------------------------------------------------

:: -- 5. .env --
set /a STEP+=1
echo.
echo [%STEP%] Checking backend .env ...
if exist "%BACKEND_DIR%\.env" (
    echo     [OK] .env exists
) else (
    if exist "%BACKEND_DIR%\.env.example" (
        copy "%BACKEND_DIR%\.env.example" "%BACKEND_DIR%\.env" >nul
        echo     [OK] Created .env from .env.example
        echo     [WARN] Change JWT_SECRET before production use!
    ) else (
        echo     [FAIL] .env.example not found
        set /a FAIL_COUNT+=1
    )
)

:: Read PORT from .env
for /f "tokens=1,* delims==" %%a in ('findstr /b "PORT=" "%BACKEND_DIR%\.env" 2^>nul') do (
    set "BACKEND_PORT=%%b"
)
:: Trim spaces/quotes
for /f "tokens=* delims= " %%x in ("!BACKEND_PORT!") do set "BACKEND_PORT=%%~x"

:: -- 6. Backend deps --
set /a STEP+=1
echo.
echo [%STEP%] Checking backend dependencies ...
if exist "%BACKEND_DIR%\node_modules" (
    echo     [OK] node_modules exists
) else (
    echo     [..] Installing backend dependencies ...
    cd /d "%BACKEND_DIR%"
    call pnpm install --frozen-lockfile
    if exist "%BACKEND_DIR%\node_modules" (
        echo     [OK] Backend dependencies installed
    ) else (
        echo     [FAIL] Backend dependency installation failed
        set /a FAIL_COUNT+=1
    )
)
echo     [..] Building native modules (esbuild, prisma, better-sqlite3) ...
cd /d "%BACKEND_DIR%"
call pnpm approve-builds --all >nul 2>&1
echo     [OK] Native modules ready

:: -- 7. Frontend deps --
set /a STEP+=1
echo.
echo [%STEP%] Checking frontend dependencies ...
if exist "%FRONTEND_DIR%\node_modules" (
    echo     [OK] node_modules exists
) else (
    echo     [..] Installing frontend dependencies ...
    cd /d "%FRONTEND_DIR%"
    call pnpm install --frozen-lockfile
    if exist "%FRONTEND_DIR%\node_modules" (
        echo     [OK] Frontend dependencies installed
    ) else (
        echo     [FAIL] Frontend dependency installation failed
        set /a FAIL_COUNT+=1
    )
)
cd /d "%FRONTEND_DIR%"
call pnpm approve-builds --all >nul 2>&1

:: -- 8. Prisma generate --
set /a STEP+=1
echo.
echo [%STEP%] Generating Prisma client ...
cd /d "%BACKEND_DIR%"
call pnpm exec prisma generate 2>&1 | findstr /i "error" >nul 2>&1
if %errorlevel% equ 0 (
    echo     [WARN] Prisma generate may have errors, trying again ...
    call pnpm exec prisma generate
) else (
    echo     [OK] Prisma client generated
)

:: -- 9. DB migration --
set /a STEP+=1
echo.
echo [%STEP%] Running database migration ...
cd /d "%BACKEND_DIR%"
call pnpm exec prisma migrate deploy >nul 2>&1
echo     [OK] Database migration done

:: =============================================================
::  Phase 3: Port Check
:: =============================================================
echo.
echo -----------------------------------------------------------
echo   Phase 3/4  Port Check
echo -----------------------------------------------------------

set /a STEP+=1
echo.
echo [%STEP%] Checking backend port :%BACKEND_PORT% ...
netstat -ano 2>nul | findstr ":%BACKEND_PORT% " | findstr "LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo     [FAIL] Port %BACKEND_PORT% is already in use!
    echo     [WARN] Close the process or change PORT in .env
    set /a FAIL_COUNT+=1
) else (
    echo     [OK] Port %BACKEND_PORT% is available
)

set /a STEP+=1
echo.
echo [%STEP%] Checking frontend port :%FRONTEND_PORT% ...
netstat -ano 2>nul | findstr ":%FRONTEND_PORT% " | findstr "LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo     [WARN] Port %FRONTEND_PORT% in use (Vite will auto-pick next port)
) else (
    echo     [OK] Port %FRONTEND_PORT% is available
)

:: =============================================================
::  Summary
:: =============================================================
echo.
echo -----------------------------------------------------------
if %FAIL_COUNT% gtr 0 (
    echo   [!] Found %FAIL_COUNT% issue(s)
    echo -----------------------------------------------------------
    echo.
    set /p "CONT=  Continue anyway? (y/N) "
    if /i not "!CONT!"=="y" (
        echo.
        echo   Cancelled. Please fix the issues above and retry.
        echo.
        pause
        exit /b 1
    )
) else (
    echo   [OK] All checks passed!
    echo -----------------------------------------------------------
)

:: =============================================================
::  Phase 4: Launch Services
:: =============================================================
echo.
echo -----------------------------------------------------------
echo   Phase 4/4  Launch Services
echo -----------------------------------------------------------

:: -- Backend --
set /a STEP+=1
echo.
echo [%STEP%] Starting backend (Express + Prisma + SQLite) ...
echo     Port: http://127.0.0.1:%BACKEND_PORT%

start "ComputerAsset-Backend" /D "%BACKEND_DIR%" cmd /k "title ComputerAsset Backend && pnpm run dev"

:: Wait for backend health
echo     Waiting for backend to be ready ...
set WAIT=0
:wait_backend
if %WAIT% geq 30 goto :backend_timeout
timeout /t 1 /nobreak >nul
set /a WAIT+=1
curl -s --connect-timeout 2 "http://127.0.0.1:%BACKEND_PORT%/api/health" >nul 2>&1
if %errorlevel% equ 0 (
    echo     [OK] Backend ready (%WAIT%s)
    goto :start_frontend
)
goto :wait_backend

:backend_timeout
echo     [WARN] Backend may still be starting (%WAIT%s elapsed)

:start_frontend
:: -- Frontend --
set /a STEP+=1
echo.
echo [%STEP%] Starting frontend (Vite + Vue 3) ...
echo     Port: http://localhost:%FRONTEND_PORT%

start "ComputerAsset-Frontend" /D "%FRONTEND_DIR%" cmd /k "title ComputerAsset Frontend && pnpm run dev"

timeout /t 3 /nobreak >nul

echo.
echo.
echo   +===================================================+
echo   ^|                                                   ^|
echo   ^|    [OK] ComputerAsset started successfully!       ^|
echo   ^|                                                   ^|
echo   ^|    Frontend : http://localhost:%FRONTEND_PORT%            ^|
echo   ^|    Backend  : http://127.0.0.1:%BACKEND_PORT%            ^|
echo   ^|                                                   ^|
echo   ^|    Login    : admin / admin123                     ^|
echo   ^|                                                   ^|
echo   +===================================================+
echo.
echo   Tip: Close the Backend and Frontend windows to stop services.
echo.
pause
