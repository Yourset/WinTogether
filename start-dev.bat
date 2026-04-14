@echo off
setlocal

title Win Together Dev
cd /d "%~dp0"

if not exist "package.json" (
  echo [Win Together] package.json not found.
  echo [Win Together] Please run this script from the project worktree.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo [Win Together] node_modules not found. Running npm install...
  call npm install
  if errorlevel 1 (
    echo [Win Together] npm install failed.
    pause
    exit /b 1
  )
)

echo [Win Together] Starting dev mode...
echo [Win Together] Keep this window open for hot reload.
echo.
echo [Win Together] Quick checks:
echo [1] Sidebar shows recent missions, Codex CLI status, and language switch.
echo [2] Home page lets you enter a goal and start a mission.
echo [3] Mission history shows real summaries.
echo [4] Memory viewer shows WIN_MEMORY index and current work log.
echo.

call npm run dev

if errorlevel 1 (
  echo [Win Together] Dev server exited with an error.
  pause
  exit /b 1
)

endlocal
