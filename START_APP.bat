@echo off
echo ========================================
echo   AI YouTube Agency - Quick Start
echo ========================================
echo.
echo Starting your AI YouTube Agency...
echo App will open at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

cd /d "%~dp0"
call npm run dev

pause