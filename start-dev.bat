@echo off
setlocal

title Win Together Dev
cd /d "%~dp0"

if not exist "package.json" (
  echo [Win Together] package.json not found.
  echo Please run this script from the project root.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo [Win Together] node_modules not found. Running npm install first...
  call npm install
  if errorlevel 1 (
    echo [Win Together] npm install failed.
    pause
    exit /b 1
  )
)

echo [Win Together] Starting development mode...
echo [Win Together] Hot reload will stay enabled while this window remains open.
call npm run dev

if errorlevel 1 (
  echo [Win Together] Development server exited with an error.
  pause
  exit /b 1
)

endlocal
