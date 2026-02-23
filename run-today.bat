@echo off
setlocal

set "PROJECT_DIR=%~dp0"
cd /d "%PROJECT_DIR%"

where npm >nul 2>&1
if errorlevel 1 (
  echo [ERROR] npm not found. Please install Node.js LTS first.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 (
    echo [ERROR] npm install failed.
    pause
    exit /b 1
  )
)

echo Starting to day MVP...
start "" http://localhost:3000
call npm run dev

