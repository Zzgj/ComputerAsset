@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

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
echo   ^|   ComputerAsset v1.2.0                            ^|
echo   ^|                                                   ^|
echo   +---------------------------------------------------+
echo.
echo   Path : %ROOT_DIR%
echo   Time : %date% %time:~0,8%
echo.

echo -----------------------------------------------------------
echo   [1/4] Environment Check
echo -----------------------------------------------------------

echo.
echo [1] Node.js ...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo     [FAIL] Node.js not found
    set /a FAIL+=1
    goto :step2
)
for /f "tokens=*" %%v in ('node -v') do set "NODE_VER=%%v"
echo     [OK] Node.js %NODE_VER%

for /f "tokens=1 delims=." %%m in ("%NODE_VER:~1%") do set "NODE_MAJOR=%%m"
if !NODE_MAJOR! lss 20 (
    echo     [FAIL] Node.js too old, need v20+
    set /a FAIL+=1
)

:step2
echo.
echo [2] Files ...
set "FILES_OK=1"
if not exist "%BACKEND_DIR%\dist\server.js" (
    echo     [FAIL] backend\dist\server.js missing
    set "FILES_OK=0"
    set /a FAIL+=1
)
if not exist "%BACKEND_DIR%\node_modules" (
    echo     [FAIL] backend\node_modules missing
    set "FILES_OK=0"
    set /a FAIL+=1
)
if not exist "%FRONTEND_DIR%\dist\index.html" (
    echo     [FAIL] frontend\dist\index.html missing
    set "FILES_OK=0"
    set /a FAIL+=1
)
if not exist "%BACKEND_DIR%\prisma\schema.prisma" (
    echo     [FAIL] backend\prisma\schema.prisma missing
    set "FILES_OK=0"
    set /a FAIL+=1
)
if "!FILES_OK!"=="1" (
    echo     [OK] All files present
)

echo.
echo -----------------------------------------------------------
echo   [2/4] Configuration
echo -----------------------------------------------------------

echo.
echo [3] .env ...
if exist "%BACKEND_DIR%\.env" (
    echo     [OK] .env exists
) else (
    if exist "%BACKEND_DIR%\.env.example" (
        copy "%BACKEND_DIR%\.env.example" "%BACKEND_DIR%\.env" >nul
        echo     [OK] .env created from .env.example
    ) else (
        echo     [FAIL] .env.example not found
        set /a FAIL+=1
    )
)

for /f "tokens=1,* delims==" %%a in ('findstr /b "PORT=" "%BACKEND_DIR%\.env" 2^>nul') do (
    set "PORT=%%b"
)
for /f "tokens=* delims= " %%x in ("!PORT!") do set "PORT=%%~x"
echo     [INFO] PORT = %PORT%

echo.
echo [4] Data directory ...
if not exist "%BACKEND_DIR%\data" mkdir "%BACKEND_DIR%\data"
echo     [OK] backend\data\

echo.
echo -----------------------------------------------------------
echo   [3/4] Database
echo -----------------------------------------------------------

echo.
echo [5] Prisma migrate deploy ...
cd /d "%BACKEND_DIR%"

set "PRISMA_CLI=%BACKEND_DIR%\node_modules\.bin\prisma.cmd"
if exist "!PRISMA_CLI!" (
    call "!PRISMA_CLI!" migrate deploy 2>&1
    if !errorlevel! neq 0 (
        echo     [WARN] Migration may have issues
    ) else (
        echo     [OK] Migration done
    )
) else (
    node "%BACKEND_DIR%\node_modules\prisma\build\index.js" migrate deploy 2>&1
    if !errorlevel! neq 0 (
        echo     [WARN] Migration may have issues
    ) else (
        echo     [OK] Migration done
    )
)

echo.
echo -----------------------------------------------------------
echo   [4/4] Start Service
echo -----------------------------------------------------------

echo.
echo [6] Port %PORT% ...
set "PORT_PID="
for /f "tokens=5" %%p in ('netstat -ano 2^>nul ^| findstr ":%PORT% " ^| findstr "LISTENING"') do (
    if not defined PORT_PID set "PORT_PID=%%p"
)
if defined PORT_PID (
    echo     [!!] Port %PORT% in use, PID !PORT_PID!
    for /f "tokens=1" %%n in ('tasklist /fi "PID eq !PORT_PID!" /fo csv /nh 2^>nul') do (
        echo     [INFO] Process %%~n
    )
    echo.
    set /p "KILL_CHOICE=     Kill it? (y/N) "
    if /i "!KILL_CHOICE!"=="y" (
        taskkill /pid !PORT_PID! /f >nul 2>&1
        timeout /t 2 /nobreak >nul
        echo     [OK] Process killed
    ) else (
        echo     [FAIL] Port blocked
        set /a FAIL+=1
    )
) else (
    echo     [OK] Port %PORT% available
)

echo.
echo -----------------------------------------------------------
if !FAIL! gtr 0 (
    echo   [!] Found !FAIL! issue(s)
    echo -----------------------------------------------------------
    echo.
    set /p "CONT=  Continue anyway? (y/N) "
    if /i not "!CONT!"=="y" (
        echo.
        echo   Cancelled.
        pause
        exit /b 1
    )
) else (
    echo   [OK] All checks passed!
    echo -----------------------------------------------------------
)

echo.
echo [7] Starting ComputerAsset ...
echo     PORT %PORT%
echo     MODE Production (frontend + backend)
echo.

cd /d "%BACKEND_DIR%"
start "ComputerAsset" /D "%BACKEND_DIR%" cmd /k "title ComputerAsset && node dist/server.js"

echo     Waiting ...
set WAIT=0
:wait_start
if %WAIT% geq 30 goto :start_timeout
timeout /t 1 /nobreak >nul
set /a WAIT+=1

where curl >nul 2>&1
if !errorlevel! equ 0 (
    curl -s --connect-timeout 2 "http://127.0.0.1:%PORT%/api/health" >nul 2>&1
    if !errorlevel! equ 0 goto :start_ok
) else (
    powershell -Command "try { Invoke-WebRequest -Uri 'http://127.0.0.1:%PORT%/api/health' -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop; exit 0 } catch { exit 1 }" >nul 2>&1
    if !errorlevel! equ 0 goto :start_ok
)
goto :wait_start

:start_timeout
echo     [WARN] Service may still be starting (%WAIT%s)
goto :done

:start_ok
echo     [OK] Service ready (%WAIT%s)

:done
echo.
echo.
echo   +---------------------------------------------------+
echo   ^|                                                   ^|
echo   ^|   ComputerAsset - OK!                             ^|
echo   ^|                                                   ^|
echo   ^|   Local   http://127.0.0.1:%PORT%                      ^|
echo   ^|   LAN     http://SERVER_IP:%PORT%                      ^|
echo   ^|                                                   ^|
echo   ^|   User    admin                                   ^|
echo   ^|   Pass    admin123                                ^|
echo   ^|                                                   ^|
echo   ^|   CHANGE DEFAULT PASSWORD AFTER FIRST LOGIN!      ^|
echo   ^|                                                   ^|
echo   +---------------------------------------------------+
echo.
echo   [Stop]    stop.bat
echo   [Restart] deploy.bat
echo.
pause
