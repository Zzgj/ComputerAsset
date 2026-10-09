@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

REM ============================================================
REM  ComputerAsset Upgrade Script
REM  Performs an in-place upgrade of a deployed ComputerAsset
REM  instance by replacing backend/frontend files from a new
REM  deploy-package, running migrations, and restarting.
REM  The upgrade package is the directory where this script lives.
REM ============================================================

set "NEW_PKG=%~dp0"
if "%NEW_PKG:~-1%"=="\" set "NEW_PKG=%NEW_PKG:~0,-1%"
set "NEW_BACKEND=%NEW_PKG%\backend"
set "NEW_FRONTEND=%NEW_PKG%\frontend"
set "INSTALL_DIR=C:\ComputerAsset-releases\deploy-package"
set "PORT=3000"
set "FAIL=0"

cls
echo.
echo   +---------------------------------------------------+
echo   ^|                                                   ^|
echo   ^|   ComputerAsset - Upgrade                         ^|
echo   ^|                                                   ^|
echo   +---------------------------------------------------+
echo.
echo   New Package : %NEW_PKG%
echo   Time        : %date% %time:~0,8%
echo.
REM ----------------------------------------------------------
REM [1/12] Detect install directory
REM ----------------------------------------------------------
echo -----------------------------------------------------------
echo   [1/12] Detect Install Directory
echo -----------------------------------------------------------
echo.

if exist "%INSTALL_DIR%\backend\dist\server.js" (
    echo     [OK] Found install dir: %INSTALL_DIR%
) else (
    echo     [WARN] Default install dir not found: %INSTALL_DIR%
    echo     [INFO] Searching common locations...
    set "FOUND_DIR="
    for %%d in (C:\ComputerAsset-releases\deploy-package D:\ComputerAsset-releases\deploy-package C:\ComputerAsset\deploy-package D:\ComputerAsset\deploy-package) do (
        if not defined FOUND_DIR (
            if exist "%%d\backend\dist\server.js" (
                set "FOUND_DIR=%%d"
            )
        )
    )
    if defined FOUND_DIR (
        set "INSTALL_DIR=!FOUND_DIR!"
        echo     [OK] Found install dir: !INSTALL_DIR!
    ) else (
        echo     [INFO] Could not auto-detect install directory.
        set /p "INSTALL_DIR=     Enter install directory path: "
        if not exist "%INSTALL_DIR%\backend\dist\server.js" (
            echo     [FAIL] No backend\dist\server.js found in: %INSTALL_DIR%
            echo     Cannot continue without a valid install directory.
            pause
            exit /b 1
        )
        echo     [OK] Using: %INSTALL_DIR%
    )
)

set "BK_BACKEND=%INSTALL_DIR%\backend"
set "BK_FRONTEND=%INSTALL_DIR%\frontend"
REM ----------------------------------------------------------
REM [2/12] Read PORT from backend\.env
REM ----------------------------------------------------------
echo.
echo -----------------------------------------------------------
echo   [2/12] Read Configuration
echo -----------------------------------------------------------
echo.

if exist "%BK_BACKEND%\.env" (
    echo     [OK] .env found
    for /f "tokens=1,* delims==" %%a in ('findstr /b "PORT=" "%BK_BACKEND%\.env" 2^^>nul') do (
        set "PORT=%%b"
    )
    for /f "tokens=* delims= " %%x in ("!PORT!") do set "PORT=%%~x"
) else (
    echo     [WARN] .env not found, using default PORT=3000
)
echo     [INFO] PORT = %PORT%
REM ----------------------------------------------------------
REM [3/12] Stop running service
REM ----------------------------------------------------------
echo.
echo -----------------------------------------------------------
echo   [3/12] Stop Running Service
echo -----------------------------------------------------------
echo.

set "SERVICE_STOPPED=0"

if exist "%INSTALL_DIR%\stop.bat" (
    echo     [INFO] Calling stop.bat ...
    call "%INSTALL_DIR%\stop.bat" nopause
    set "SERVICE_STOPPED=1"
    echo     [OK] stop.bat executed
)

if "%SERVICE_STOPPED%"=="0" (
    echo     [INFO] stop.bat not found, killing process on port %PORT%...
    set "PORT_PID="
    for /f "tokens=5" %%p in ('netstat -ano 2^^>nul ^^| findstr ":%PORT% " ^^| findstr "LISTENING"') do (
        if not defined PORT_PID set "PORT_PID=%%p"
    )
    if defined PORT_PID (
        echo     [INFO] Found PID !PORT_PID! on port %PORT%
        taskkill /pid !PORT_PID! /f >nul 2>&1
        timeout /t 2 /nobreak >nul
        echo     [OK] Process killed
    ) else (
        echo     [OK] No process found on port %PORT%
    )
)

REM Verify port is free
set "PORT_STILL_BUSY="
for /f "tokens=5" %%p in ('netstat -ano 2^^>nul ^^| findstr ":%PORT% " ^^| findstr "LISTENING"') do (
    if not defined PORT_STILL_BUSY set "PORT_STILL_BUSY=%%p"
)
if defined PORT_STILL_BUSY (
    echo     [WARN] Port %PORT% still in use by PID !PORT_STILL_BUSY!, force killing...
    taskkill /pid !PORT_STILL_BUSY! /f >nul 2>&1
    timeout /t 3 /nobreak >nul
)

echo     [OK] Port %PORT% is free
REM ----------------------------------------------------------
REM [4/12] Backup current version
REM ----------------------------------------------------------
echo.
echo -----------------------------------------------------------
echo   [4/12] Backup Current Version
echo -----------------------------------------------------------
echo.

REM Build timestamp YYYYMMDD-HHMMSS
set "BACKUP_TS="
for /f "tokens=2 delims==" %%a in ('wmic os get localdatetime /value 2^^>nul ^^| findstr "="') do set "_dt=%%a"
if defined _dt (
    set "BACKUP_TS=!_dt:~0,8!-!_dt:~8,6!"
) else (
    REM Fallback: use date and time
    set "BACKUP_TS=%date:~0,4%%date:~5,2%%date:~8,2%-%time:~0,2%%time:~3,2%%time:~6,2%"
    set "BACKUP_TS=!BACKUP_TS: =0!"
)

REM Resolve absolute backup path
pushd "%INSTALL_DIR%\.." >nul 2>&1
set "BACKUP_DIR=%CD%\deploy-backup-!BACKUP_TS!"
popd >nul 2>&1

echo     [INFO] Backup target: !BACKUP_DIR!

REM Backup backend (exclude node_modules and data)
echo     [INFO] Backing up backend ^(excluding node_modules, data^)...
robocopy "%BK_BACKEND%" "!BACKUP_DIR!\backend" /e /nfl /ndl /njh /njs /nc /ns /np /xd node_modules data >nul 2>&1
set "RC=!errorlevel!"
if !RC! gtr 7 (
    echo     [WARN] robocopy backend returned !RC! - backup may be incomplete
) else (
    echo     [OK] Backend backed up
)

REM Backup frontend (exclude node_modules if any)
echo     [INFO] Backing up frontend...
if exist "%BK_FRONTEND%" (
    robocopy "%BK_FRONTEND%" "!BACKUP_DIR!\frontend" /e /nfl /ndl /njh /njs /nc /ns /np /xd node_modules >nul 2>&1
    set "RC=!errorlevel!"
    if !RC! gtr 7 (
        echo     [WARN] robocopy frontend returned !RC! - backup may be incomplete
    ) else (
        echo     [OK] Frontend backed up
    )
) else (
    echo     [INFO] No frontend dir to backup
)

REM Backup .env separately for safety
if exist "%BK_BACKEND%\.env" copy "%BK_BACKEND%\.env" "!BACKUP_DIR!\backend\.env.bak" >nul 2>&1

echo     [OK] Backup complete
REM ----------------------------------------------------------
REM [5/12] Replace backend files from new package
REM ----------------------------------------------------------
echo.
echo -----------------------------------------------------------
echo   [5/12] Replace Backend Files
echo -----------------------------------------------------------
echo.

REM Replace backend\dist
echo     [INFO] Replacing backend\dist ...
if exist "%BK_BACKEND%\dist" rmdir /s /q "%BK_BACKEND%\dist" 2>nul
if exist "%NEW_BACKEND%\dist" (
    robocopy "%NEW_BACKEND%\dist" "%BK_BACKEND%\dist" /e /nfl /ndl /njh /njs /nc /ns /np >nul 2>&1
    set "RC=!errorlevel!"
    if !RC! gtr 7 (
        echo     [FAIL] Failed to copy backend\dist ^(rc=!RC!^)
        set /a FAIL+=1
    ) else (
        echo     [OK] backend\dist replaced
    )
) else (
    echo     [FAIL] New backend\dist not found in package
    set /a FAIL+=1
)

REM Replace backend\prisma
echo     [INFO] Replacing backend\prisma ...
if exist "%BK_BACKEND%\prisma" rmdir /s /q "%BK_BACKEND%\prisma" 2>nul
if exist "%NEW_BACKEND%\prisma" (
    robocopy "%NEW_BACKEND%\prisma" "%BK_BACKEND%\prisma" /e /nfl /ndl /njh /njs /nc /ns /np >nul 2>&1
    set "RC=!errorlevel!"
    if !RC! gtr 7 (
        echo     [FAIL] Failed to copy backend\prisma ^(rc=!RC!^)
        set /a FAIL+=1
    ) else (
        echo     [OK] backend\prisma replaced
    )
) else (
    echo     [FAIL] New backend\prisma not found in package
    set /a FAIL+=1
)

REM Replace backend\package.json
echo     [INFO] Replacing backend\package.json ...
if exist "%NEW_BACKEND%\package.json" (
    copy /y "%NEW_BACKEND%\package.json" "%BK_BACKEND%\package.json" >nul 2>&1
    echo     [OK] backend\package.json replaced
) else (
    echo     [FAIL] New backend\package.json not found in package
    set /a FAIL+=1
)

REM Replace backend\prisma.config.ts
echo     [INFO] Replacing backend\prisma.config.ts ...
if exist "%NEW_BACKEND%\prisma.config.ts" (
    copy /y "%NEW_BACKEND%\prisma.config.ts" "%BK_BACKEND%\prisma.config.ts" >nul 2>&1
    echo     [OK] backend\prisma.config.ts replaced
) else (
    echo     [INFO] prisma.config.ts not in new package, keeping existing
)
REM ----------------------------------------------------------
REM [6/12] Replace frontend files from new package
REM ----------------------------------------------------------
echo.
echo -----------------------------------------------------------
echo   [6/12] Replace Frontend Files
echo -----------------------------------------------------------
echo.

echo     [INFO] Replacing frontend\dist ...
if exist "%BK_FRONTEND%\dist" rmdir /s /q "%BK_FRONTEND%\dist" 2>nul
if exist "%NEW_FRONTEND%\dist" (
    robocopy "%NEW_FRONTEND%\dist" "%BK_FRONTEND%\dist" /e /nfl /ndl /njh /njs /nc /ns /np >nul 2>&1
    set "RC=!errorlevel!"
    if !RC! gtr 7 (
        echo     [FAIL] Failed to copy frontend\dist ^(rc=!RC!^)
        set /a FAIL+=1
    ) else (
        echo     [OK] frontend\dist replaced
    )
) else (
    echo     [FAIL] New frontend\dist not found in package
    set /a FAIL+=1
)
REM ----------------------------------------------------------
REM [7/12] Check if dependencies need updating
REM ----------------------------------------------------------
echo.
echo -----------------------------------------------------------
echo   [7/12] Update node_modules (offline: copy from new package)
echo -----------------------------------------------------------
echo.

REM 内网环境无法 npm install，直接从新部署包复制 node_modules
if exist "%NEW_BACKEND%\node_modules" (
    echo     [INFO] Copying node_modules from new package ...
    if exist "%BK_BACKEND%\node_modules" rmdir /s /q "%BK_BACKEND%\node_modules" 2>nul
    robocopy "%NEW_BACKEND%\node_modules" "%BK_BACKEND%\node_modules" /e /nfl /ndl /njh /njs /nc /ns /np >nul 2>&1
    set "RC=!errorlevel!"
    if !RC! gtr 7 (
        echo     [FAIL] Failed to copy node_modules ^(rc=!RC!^)
        set /a FAIL+=1
    ) else (
        echo     [OK] node_modules copied from new package
    )
) else (
    echo     [INFO] New package has no node_modules, keeping existing
    if not exist "%BK_BACKEND%\node_modules\dotenv" (
        echo     [WARN] dotenv missing - service may not start
        set /a FAIL+=1
    )
    if not exist "%BK_BACKEND%\node_modules\express" (
        echo     [WARN] express missing - service may not start
        set /a FAIL+=1
    )
)
REM ----------------------------------------------------------
REM [8/12] Copy Prisma client from new package
REM ----------------------------------------------------------
echo.
echo -----------------------------------------------------------
echo   [8/12] Copy Prisma Client
echo -----------------------------------------------------------
echo.

if exist "%NEW_BACKEND%\node_modules\.prisma" (
    echo     [INFO] Copying node_modules\.prisma from new package ...
    if exist "%BK_BACKEND%\node_modules\.prisma" rmdir /s /q "%BK_BACKEND%\node_modules\.prisma" 2>nul
    robocopy "%NEW_BACKEND%\node_modules\.prisma" "%BK_BACKEND%\node_modules\.prisma" /e /nfl /ndl /njh /njs /nc /ns /np >nul 2>&1
    set "RC=!errorlevel!"
    if !RC! gtr 7 (
        echo     [WARN] Failed to copy .prisma client ^(rc=!RC!^)
    ) else (
        echo     [OK] Prisma client copied
    )
) else (
    echo     [INFO] No .prisma in new package, generating from schema...
    pushd "%BK_BACKEND%"
    set "PRISMA_CLI=%BK_BACKEND%\node_modules\.bin\prisma.cmd"
    if exist "!PRISMA_CLI!" (
        call "!PRISMA_CLI!" generate 2>&1
    ) else (
        node "%BK_BACKEND%\node_modules\prisma\build\index.js" generate 2>&1
    )
    if !errorlevel! neq 0 (
        echo     [WARN] prisma generate had issues
    ) else (
        echo     [OK] Prisma client generated
    )
    popd
)
REM ----------------------------------------------------------
REM [9/12] Ensure Prisma CLI exists
REM ----------------------------------------------------------
echo.
echo -----------------------------------------------------------
echo   [9/12] Ensure Prisma CLI
echo -----------------------------------------------------------
echo.

set "PRISMA_CLI=%BK_BACKEND%\node_modules\.bin\prisma.cmd"
set "PRISMA_CLI_FALLBACK=%BK_BACKEND%\node_modules\prisma\build\index.js"

if exist "!PRISMA_CLI!" (
    echo     [OK] Prisma CLI found at node_modules\.bin\prisma.cmd
) else if exist "!PRISMA_CLI_FALLBACK!" (
    echo     [OK] Prisma CLI found at node_modules\prisma\build\index.js
) else (
    echo     [FAIL] Prisma CLI not found in node_modules
    echo     [INFO] Make sure prepare.bat was run to generate complete deploy-package
    set /a FAIL+=1
)
REM ----------------------------------------------------------
REM [10/12] Run prisma migrate deploy
REM ----------------------------------------------------------
echo.
echo -----------------------------------------------------------
echo   [10/12] Database Migration
echo -----------------------------------------------------------
echo.

REM Ensure TEMP directory exists
set "TEMP_DIR=%TEMP%"
if not exist "%TEMP_DIR%" (
    echo     [INFO] TEMP dir missing, creating %TEMP_DIR% ...
    mkdir "%TEMP_DIR%" 2>nul
)

REM Ensure data directory exists
set "DATA_DIR=%BK_BACKEND%\data"
if not exist "%DATA_DIR%" (
    echo     [INFO] Creating data directory ...
    mkdir "%DATA_DIR%"
)

pushd "%BK_BACKEND%"

set "PRISMA_CLI=%BK_BACKEND%\node_modules\.bin\prisma.cmd"
if exist "!PRISMA_CLI!" (
    echo     [INFO] Running prisma migrate deploy ...
    call "!PRISMA_CLI!" migrate deploy 2>&1
    set "MIG_RC=!errorlevel!"
) else (
    echo     [INFO] Running prisma migrate deploy ^(fallback path^) ...
    node "%BK_BACKEND%\node_modules\prisma\build\index.js" migrate deploy 2>&1
    set "MIG_RC=!errorlevel!"
)

popd

if !MIG_RC! neq 0 (
    echo.
    echo     [FAIL] Database migration failed! ^(rc=!MIG_RC!^)
    echo.
    echo     Common causes:
    echo       - prisma\migrations folder is incomplete
    echo       - data\dev.db is locked by another process
    echo       - existing dev.db is from an incompatible older version
    echo       - Windows TEMP directory missing
    echo.
    set /p "MIG_CONT=     Continue starting service anyway? (y/N) "
    if /i not "!MIG_CONT!"=="y" (
        echo.
        echo   Upgrade cancelled. Fix migration first.
        echo   Backup is at: !BACKUP_DIR!
        pause
        exit /b 1
    )
    echo     [WARN] Continuing despite migration failure
) else (
    echo     [OK] Migration complete
)
REM ----------------------------------------------------------
REM [11/12] Start service
REM ----------------------------------------------------------
echo.
echo -----------------------------------------------------------
echo   [11/12] Start Service
echo -----------------------------------------------------------
echo.

echo     [INFO] Starting ComputerAsset on port %PORT% ...
pushd "%BK_BACKEND%"
start "ComputerAsset" /D "%BK_BACKEND%" cmd /k "title ComputerAsset && node dist/server.js"
popd

echo     [INFO] Waiting for service to start ...
set "WAIT=0"

:health_check
if !WAIT! geq 30 goto :health_timeout
timeout /t 1 /nobreak >nul
set /a WAIT+=1

where curl >nul 2>&1
if !errorlevel! equ 0 (
    curl -s --connect-timeout 2 "http://127.0.0.1:%PORT%/api/health" >nul 2>&1
    if !errorlevel! equ 0 goto :health_ok
) else (
    powershell -Command "try { Invoke-WebRequest -Uri 'http://127.0.0.1:%PORT%/api/health' -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop; exit 0 } catch { exit 1 }" >nul 2>&1
    if !errorlevel! equ 0 goto :health_ok
)
goto :health_check

:health_timeout
echo     [WARN] Service health check timed out after !WAIT!s
echo     [INFO] The service may still be starting. Check the ComputerAsset window.
goto :upgrade_done

:health_ok
echo     [OK] Service is ready ^(!WAIT!s^)

:upgrade_done
REM ----------------------------------------------------------
REM [12/12] Show success message
REM ----------------------------------------------------------
echo.
echo -----------------------------------------------------------
echo   [12/12] Upgrade Complete
echo -----------------------------------------------------------
echo.

if !FAIL! gtr 0 (
    echo   [!] Upgrade completed with !FAIL! warning(s)
    echo   [!] Check output above for details.
    echo.
) else (
    echo   [OK] All steps completed successfully!
    echo.
)

echo.
echo   +---------------------------------------------------+
echo   ^|                                                   ^|
echo   ^|   ComputerAsset - Upgrade OK!                     ^|
echo   ^|                                                   ^|
echo   ^|   Local   http://127.0.0.1:%PORT%                      ^|
echo   ^|   LAN     http://SERVER_IP:%PORT%                      ^|
echo   ^|                                                   ^|
echo   ^|   Backup  !BACKUP_DIR!  ^|
echo   ^|                                                   ^|
echo   +---------------------------------------------------+
echo.
echo   [Stop]    stop.bat
echo   [Restart] restart.bat
echo.

if !FAIL! gtr 0 (
    echo   [!] If something went wrong, you can restore from backup:
    echo       !BACKUP_DIR!
    echo.
)

pause
endlocal
exit /b 0