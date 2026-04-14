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
  sidebarWorkspace: string;
  sidebarWorkspaceEmpty: string;
  sidebarLanguage: string;
  homeTitle: string;
  homeIntro: string;
  homeHint: string;
  homeSubmit: string;
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
  missionStarted: (goal: string) => string;
  captainPlanning: (goal: string) => string;
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
  sidebarWorkspace: "当前工作区",
  sidebarWorkspaceEmpty: "尚未选择工作区",
  sidebarLanguage: "界面语言",
  homeTitle: "把目标交给 Captain",
  homeIntro: "描述你现在想推进的任务，Captain 会先接需求、拆计划，然后在合适的时候拉起需要的专业 Agent。",
  homeHint: "建议直接写一句清楚的目标，例如“先做登录流程并给我一个可运行的第一版”。",
  homeSubmit: "开始协作",
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
  missionStarted: (goal) => `任务“${goal}”已启动。`,
  captainPlanning: (goal) => `Captain 正在为这个目标规划下一步：${goal}`
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
  sidebarWorkspace: "Current Workspace",
  sidebarWorkspaceEmpty: "No workspace selected yet",
  sidebarLanguage: "Language",
  homeTitle: "Hand the goal to Captain",
  homeIntro: "Describe what you want to move forward. Captain will take the request, break the plan down, and assemble the right specialist agents when needed.",
  homeHint: 'Try a direct goal such as "Build the first login flow and give me a runnable first pass."',
  homeSubmit: "Start Collaboration",
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
  missionStarted: (goal) => `Mission "${goal}" started.`,
  captainPlanning: (goal) => `Captain is planning the next steps for: ${goal}`
};

export function getStrings(language: AppLanguage): AppStrings {
  return language === "en" ? en : zhCN;
}
