export type AppLanguage = "zh-CN" | "en";

export type AppStrings = {
  shellTagline: string;
  navHome: string;
  navTeamRoom: string;
  navHistory: string;
  navMemory: string;
  navTeamRoomHint: string;
  sidebarRecentMissions: string;
  sidebarNoRecentMissions: string;
  sidebarCodexCli: string;
  sidebarWorkspace: string;
  sidebarWorkspaceEmpty: string;
  sidebarLanguage: string;
  runtimeReady: string;
  runtimeUnavailable: string;
  homeTitle: string;
  homeIntro: string;
  homeHint: string;
  homeSubmit: string;
  homeEnvironmentTitle: string;
  homeCodexReady: (message: string) => string;
  homeCodexUnavailable: (message: string) => string;
  homeSmokeTestLabel: string;
  homeSmokeTestIdle: string;
  homeSmokeTestRunning: string;
  homeSmokeTestSuccess: (message: string) => string;
  homeSmokeTestFailed: (message: string) => string;
  homeSmokeTestRawOutput: string;
  teamRoomTitle: string;
  missionIdLabel: string;
  missionIdUnassigned: string;
  timelineTitle: string;
  rosterTitle: string;
  contextTitle: string;
  contextMission: string;
  contextFocus: string;
  contextFocusValue: string;
  composerTitle: string;
  workspaceLabel: string;
  workspacePlaceholder: string;
  workspaceLoading: string;
  workspaceDefault: string;
  workspaceManual: string;
  workspaceMissing: string;
  goalPlaceholder: string;
  send: string;
  startMissionFallbackError: string;
  bridgeUnavailable: string;
  systemActor: string;
  historyTitle: string;
  historyIntro: string;
  historyOpenRoom: string;
  memoryTitle: string;
  memoryIntro: string;
  memoryIndexSection: string;
  memoryWorkLogSection: string;
  memoryLoading: string;
  missionStarted: (goal: string) => string;
  captainJoined: (name: string) => string;
  captainPlanning: (goal: string) => string;
  captainSummary: (goal: string) => string;
  captainCliResponse: (message: string) => string;
  captainCliFailure: (message: string) => string;
};

const zhCN: AppStrings = {
  shellTagline: "任务指挥台",
  navHome: "新建任务",
  navTeamRoom: "当前协作室",
  navHistory: "任务记录",
  navMemory: "记忆中心",
  navTeamRoomHint: "先创建一个任务，才能进入当前协作室",
  sidebarRecentMissions: "最近任务",
  sidebarNoRecentMissions: "还没有最近任务，先创建一个新的目标吧。",
  sidebarCodexCli: "Codex CLI",
  sidebarWorkspace: "当前工作区",
  sidebarWorkspaceEmpty: "尚未选择工作区",
  sidebarLanguage: "界面语言",
  runtimeReady: "已就绪",
  runtimeUnavailable: "未就绪",
  homeTitle: "把目标交给 Captain",
  homeIntro: "描述你现在想推进的任务。Captain 会先接需求、拆计划，然后在合适的时候拉起需要的专业 Agent。",
  homeHint: "建议直接写一句清楚的目标，例如“先做登录流程并给我一个可运行的第一版”。",
  homeSubmit: "开始协作",
  homeEnvironmentTitle: "开发环境",
  homeCodexReady: (message) => `Codex CLI 已就绪：${message}`,
  homeCodexUnavailable: (message) => `Codex CLI 未就绪：${message}`,
  homeSmokeTestLabel: "测试 Codex CLI",
  homeSmokeTestIdle: "先跑一次最小测试，确认 Codex CLI 不只是显示就绪，而是真的能返回结果。",
  homeSmokeTestRunning: "正在测试 Codex CLI，请稍等...",
  homeSmokeTestSuccess: (message) => `Codex CLI 测试成功：${message}`,
  homeSmokeTestFailed: (message) => `Codex CLI 测试失败：${message}`,
  homeSmokeTestRawOutput: "CLI 原始返回",
  teamRoomTitle: "团队协作室",
  missionIdLabel: "任务 ID",
  missionIdUnassigned: "未分配",
  timelineTitle: "协作时间线",
  rosterTitle: "当前成员",
  contextTitle: "当前上下文",
  contextMission: "任务",
  contextFocus: "焦点",
  contextFocusValue: "先对齐当前目标，再继续推进执行。",
  composerTitle: "任务输入区",
  workspaceLabel: "工作区路径",
  workspacePlaceholder: "输入要协作的项目路径",
  workspaceLoading: "正在读取应用默认工作区...",
  workspaceDefault: "当前使用应用提供的默认工作区；如果你想切换到别的项目，可以直接改这里。",
  workspaceManual: "当前使用你手动输入的工作区路径。",
  workspaceMissing: "当前没有可用的默认工作区，请先输入一个工作区路径。",
  goalPlaceholder: "告诉 Captain 你的目标...",
  send: "开始执行",
  startMissionFallbackError: "任务启动失败，请检查工作区路径后重试。",
  bridgeUnavailable: "应用运行桥接没有成功加载，请关闭后重新启动 Win Together。",
  systemActor: "系统",
  historyTitle: "任务记录",
  historyIntro: "这里会展示过去的任务、阶段总结和结果回顾。",
  historyOpenRoom: "进入协作室",
  memoryTitle: "记忆中心",
  memoryIntro: "这里会展示项目记忆、团队记忆和关键上下文沉淀。",
  memoryIndexSection: "记忆索引",
  memoryWorkLogSection: "当前工作日志",
  memoryLoading: "正在读取记忆内容...",
  missionStarted: (goal) => `任务“${goal}”已启动。`,
  captainJoined: (name) => `${name} 已加入当前协作室。`,
  captainPlanning: (goal) => `Captain 正在为这个目标规划下一步：${goal}`,
  captainSummary: (goal) => `Captain 已给出第一版执行摘要，接下来会围绕“${goal}”继续组织协作。`,
  captainCliResponse: (message) => `Captain 收到了 Codex CLI 的第一轮回应：${message}`,
  captainCliFailure: (message) => `Captain 尝试调用 Codex CLI 时遇到问题：${message}`
};

const en: AppStrings = {
  shellTagline: "Mission control",
  navHome: "New Mission",
  navTeamRoom: "Current Room",
  navHistory: "Mission History",
  navMemory: "Memory Center",
  navTeamRoomHint: "Create a mission first to open the current room",
  sidebarRecentMissions: "Recent Missions",
  sidebarNoRecentMissions: "No recent missions yet. Start with a new goal.",
  sidebarCodexCli: "Codex CLI",
  sidebarWorkspace: "Current Workspace",
  sidebarWorkspaceEmpty: "No workspace selected yet",
  sidebarLanguage: "Language",
  runtimeReady: "Ready",
  runtimeUnavailable: "Unavailable",
  homeTitle: "Hand the goal to Captain",
  homeIntro: "Describe what you want to move forward. Captain will take the request, break the plan down, and assemble the right specialist agents when needed.",
  homeHint: 'Try a direct goal such as "Build the first login flow and give me a runnable first pass."',
  homeSubmit: "Start Collaboration",
  homeEnvironmentTitle: "Environment",
  homeCodexReady: (message) => `Codex CLI ready: ${message}`,
  homeCodexUnavailable: (message) => `Codex CLI unavailable: ${message}`,
  homeSmokeTestLabel: "Test Codex CLI",
  homeSmokeTestIdle: "Run a minimal smoke test first so we know Codex CLI can actually return a result.",
  homeSmokeTestRunning: "Running the Codex CLI smoke test...",
  homeSmokeTestSuccess: (message) => `Codex CLI test succeeded: ${message}`,
  homeSmokeTestFailed: (message) => `Codex CLI test failed: ${message}`,
  homeSmokeTestRawOutput: "Raw CLI output",
  teamRoomTitle: "Team Room",
  missionIdLabel: "Mission ID",
  missionIdUnassigned: "Unassigned",
  timelineTitle: "Timeline",
  rosterTitle: "Agents",
  contextTitle: "Context",
  contextMission: "Mission",
  contextFocus: "Focus",
  contextFocusValue: "Align on the current goal before continuing execution.",
  composerTitle: "Mission Composer",
  workspaceLabel: "Workspace path",
  workspacePlaceholder: "Enter the workspace path",
  workspaceLoading: "Loading the app default workspace...",
  workspaceDefault: "Using the default workspace provided by the app. Edit it here if you want to override it.",
  workspaceManual: "Using a workspace path you entered for this mission.",
  workspaceMissing: "No default workspace is available. Enter a workspace path before starting the mission.",
  goalPlaceholder: "Tell Captain the goal...",
  send: "Start Mission",
  startMissionFallbackError: "Mission start failed. Check the workspace path and try again.",
  bridgeUnavailable: "The Win Together bridge failed to load. Please restart the app.",
  systemActor: "System",
  historyTitle: "Mission History",
  historyIntro: "Review past missions, stage summaries, and outcomes here.",
  historyOpenRoom: "Open room",
  memoryTitle: "Memory Center",
  memoryIntro: "Inspect project memory, team memory, and saved context here.",
  memoryIndexSection: "Memory Index",
  memoryWorkLogSection: "Current Work Log",
  memoryLoading: "Loading memory content...",
  missionStarted: (goal) => `Mission "${goal}" started.`,
  captainJoined: (name) => `${name} joined the current room.`,
  captainPlanning: (goal) => `Captain is planning the next steps for: ${goal}`,
  captainSummary: (goal) => `Captain has posted the first execution summary for "${goal}".`,
  captainCliResponse: (message) => `Captain received the first Codex CLI response: ${message}`,
  captainCliFailure: (message) => `Captain hit a Codex CLI problem: ${message}`
};

export function getStrings(language: AppLanguage): AppStrings {
  return language === "en" ? en : zhCN;
}
