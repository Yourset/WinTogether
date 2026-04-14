export type AppLanguage = "zh-CN" | "en";

export type AppStrings = {
  shellTagline: string;
  navHome: string;
  navTeamRoom: string;
  navHistory: string;
  navMemory: string;
  navTeamRoomHint: string;
  homeIntro: string;
  homeStartNew: string;
  homeEnterRoom: string;
  homeResumeLast: string;
  homeHint: string;
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
  systemActor: string;
  missionStarted: (goal: string) => string;
  captainPlanning: (goal: string) => string;
};

const zhCN: AppStrings = {
  shellTagline: "任务指挥台",
  navHome: "首页",
  navTeamRoom: "团队协作室",
  navHistory: "任务记录",
  navMemory: "记忆中心",
  navTeamRoomHint: "先开始一个任务，再进入团队协作室",
  homeIntro: "把你的目标交给 AI 团队，然后在同一个房间里观察、纠偏和继续推进。",
  homeStartNew: "开始一个新任务",
  homeEnterRoom: "进入 Team Room",
  homeResumeLast: "继续上一次任务",
  homeHint: "建议先点击“开始一个新任务”，系统会带你进入当前任务房间。",
  teamRoomTitle: "团队协作室",
  missionIdLabel: "任务 ID",
  missionIdUnassigned: "未分配",
  timelineTitle: "协作时间线",
  rosterTitle: "当前成员",
  contextTitle: "当前上下文",
  contextMission: "任务",
  contextFocus: "焦点",
  contextFocusValue: "先对齐下一步任务目标。",
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
  systemActor: "系统",
  missionStarted: (goal) => `任务“${goal}”已启动。`,
  captainPlanning: (goal) => `Captain 正在为这个目标规划下一步：${goal}`
};

const en: AppStrings = {
  shellTagline: "Mission control",
  navHome: "Home",
  navTeamRoom: "Team Room",
  navHistory: "History",
  navMemory: "Memory",
  navTeamRoomHint: "Start a mission first to open the team room",
  homeIntro: "Hand a goal to your AI team, then observe, steer, and continue the work from one shared room.",
  homeStartNew: "Start a new mission",
  homeEnterRoom: "Enter the Team Room",
  homeResumeLast: "Resume the last mission",
  homeHint: "Start with a new mission to enter the active team room.",
  teamRoomTitle: "Team Room",
  missionIdLabel: "Mission ID",
  missionIdUnassigned: "Unassigned",
  timelineTitle: "Timeline",
  rosterTitle: "Agents",
  contextTitle: "Context",
  contextMission: "Mission",
  contextFocus: "Focus",
  contextFocusValue: "Align on the next mission step.",
  composerTitle: "Mission Composer",
  workspaceLabel: "Workspace path",
  workspacePlaceholder: "Enter the workspace path",
  workspaceLoading: "Loading the app default workspace...",
  workspaceDefault: "Using the default workspace provided by the app. Edit it here if you want to override it.",
  workspaceManual: "Using a workspace path you entered for this mission.",
  workspaceMissing: "No default workspace is available. Enter a workspace path before starting the mission.",
  goalPlaceholder: "Tell Captain the goal...",
  send: "Send",
  startMissionFallbackError: "Mission start failed. Check the workspace path and try again.",
  systemActor: "System",
  missionStarted: (goal) => `Mission "${goal}" started.`,
  captainPlanning: (goal) => `Captain is planning the next steps for: ${goal}`
};

export function getStrings(language: AppLanguage): AppStrings {
  return language === "en" ? en : zhCN;
}
