@echo off
setlocal

title Win Together Dev
cd /d "%~dp0"

if not exist "package.json" (
  echo [Win Together] 未找到 package.json。
  echo [Win Together] 请从项目根目录运行这个脚本。
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo [Win Together] 未找到 node_modules，先执行 npm install...
  call npm install
  if errorlevel 1 (
    echo [Win Together] npm install 失败。
    pause
    exit /b 1
  )
)

echo [Win Together] 正在启动开发模式...
echo [Win Together] 只要这个窗口保持打开，热更新就会持续生效。
echo.
echo [Win Together] 这一版建议重点检查：
echo [1] 左侧最近任务、Codex CLI 状态、语言切换是否正常
echo [2] 首页输入目标后，Team Room 时间线是否更像真实协作过程
echo [3] 任务记录页是否能看到真实历史摘要
echo [4] 记忆中心是否能看到 WIN_MEMORY 索引和当前工作日志
echo.
call npm run dev

if errorlevel 1 (
  echo [Win Together] 开发服务异常退出。
  pause
  exit /b 1
)

endlocal
