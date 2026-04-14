@echo off
chcp 65001 >nul 2>&1
setlocal

set "ROOT_DIR=%~dp0"
if "%ROOT_DIR:~-1%"=="\" set "ROOT_DIR=%ROOT_DIR:~0,-1%"

cd /d "%ROOT_DIR%"
echo.
echo   ComputerAsset - Restart (stop backend port, then start.bat)
echo   -----------------------------------------------------------
call "%ROOT_DIR%\stop.bat" nopause
echo.
call "%ROOT_DIR%\start.bat"
