import { create } from "zustand";

import type { AgentRecord } from "../../shared/contracts/agent";
import type { AppEvent } from "../../shared/contracts/events";
import type { MissionRecord } from "../../shared/contracts/mission";
import type { MissionTeamRecord } from "../../shared/contracts/team";
import { getStrings, type AppLanguage } from "../i18n";

export interface StartMissionInput {
  goal: string;
  workspacePath?: string;
}

export interface RecentMissionRecord extends MissionRecord {
  summary?: string;
  lastUpdatedAt?: string;
}

export interface StartMissionResult {
  mission: MissionRecord;
  captain: AgentRecord;
  team: MissionTeamRecord;
  recentMission?: RecentMissionRecord;
  events?: AppEvent[];
  persistence: {
    transcript: {
      status: "written" | "failed";
    };
  };
}

export interface RuntimeStatus {
  codexCli: {
    status: "ready" | "unavailable";
    message: string;
  };
}

export interface CodexSmokeTestResult {
  status: "success" | "error";
  message: string;
  rawOutput: string;
}

export interface MemoryOverview {
  indexContent: string;
  workLogContent: string;
}

export interface TimelineItem {
  id: string;
  actor: string;
  message: string;
  time: string;
}

export interface WinTogetherApi {
  getDefaultWorkspacePath(): Promise<string>;
  getMemoryOverview?(): Promise<MemoryOverview>;
  getRecentMissions?(): Promise<RecentMissionRecord[]>;
  getRuntimeStatus?(): Promise<RuntimeStatus>;
  runCodexSmokeTest?(prompt?: string): Promise<CodexSmokeTestResult>;
  startMission(input: StartMissionInput): Promise<StartMissionResult>;
}

declare global {
  interface Window {
    winTogether: WinTogetherApi;
  }
}

type AppState = {
  activeMissionId: string | null;
  activeTeam: MissionTeamRecord | null;
  timelineItems: TimelineItem[];
  recentMissions: RecentMissionRecord[];
  runtimeStatus: RuntimeStatus | null;
  codexSmokeTestResult: CodexSmokeTestResult | null;
  isCodexSmokeTestRunning: boolean;
  currentWorkspacePath: string | null;
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  setActiveMissionId: (missionId: string | null) => void;
  setActiveTeam: (team: MissionTeamRecord | null) => void;
  setCurrentWorkspacePath: (workspacePath: string | null) => void;
  setRecentMissions: (recentMissions: RecentMissionRecord[]) => void;
  setRuntimeStatus: (runtimeStatus: RuntimeStatus | null) => void;
  setCodexSmokeTestResult: (result: CodexSmokeTestResult | null) => void;
  setCodexSmokeTestRunning: (isRunning: boolean) => void;
  recordMissionStarted: (result: StartMissionResult) => void;
};

function formatTimelineTime(timestamp: string) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function mergeRecentMissions(previous: RecentMissionRecord[], mission: RecentMissionRecord) {
  return [mission, ...previous.filter((item) => item.id !== mission.id)].slice(0, 8);
}

function getTeamMemberByAgentId(result: StartMissionResult, agentId?: string) {
  return result.team.members.find((member) => member.agent.id === agentId);
}

function mapEventsToTimelineItems(result: StartMissionResult, language: AppLanguage): TimelineItem[] {
  const strings = getStrings(language);
  const events = result.events ?? [];

  if (events.length === 0) {
    return [
      {
        id: `${result.mission.id}-mission`,
        actor: strings.systemActor,
        message: strings.missionStarted(result.mission.goal),
        time: formatTimelineTime(result.mission.createdAt)
      },
      {
        id: `${result.mission.id}-captain`,
        actor: result.captain.name,
        message: strings.captainPlanning(result.mission.goal),
        time: formatTimelineTime(result.mission.createdAt)
      }
    ];
  }

  return events.map((event) => {
    if (event.type === "mission.created") {
      return {
        id: event.id,
        actor: strings.systemActor,
        message: strings.missionStarted(result.mission.goal),
        time: formatTimelineTime(event.timestamp)
      };
    }

    if (event.type === "agent.spawned") {
      const member = getTeamMemberByAgentId(result, event.payload.agent.id);
      const actor = member?.displayName ?? event.payload.agent.name;

      return {
        id: event.id,
        actor,
        message: member?.primary ? strings.captainJoined(actor) : strings.agentJoined(actor),
        time: formatTimelineTime(event.timestamp)
      };
    }

    if (event.type === "agent.message") {
      const member = getTeamMemberByAgentId(result, event.payload.agentId);
      const actor = member?.displayName ?? result.captain.name;

      if (event.payload.text.startsWith("cli.error:")) {
        return {
          id: event.id,
          actor: result.captain.name,
          message: strings.captainCliFailure(event.payload.text.replace("cli.error:", "")),
          time: formatTimelineTime(event.timestamp)
        };
      }

      if (event.payload.text === "captain.summary") {
        return {
          id: event.id,
          actor: result.captain.name,
          message: strings.captainSummary(result.mission.goal),
          time: formatTimelineTime(event.timestamp)
        };
      }

      if (event.payload.text === "captain.planning") {
        return {
          id: event.id,
          actor: result.captain.name,
          message: strings.captainPlanning(result.mission.goal),
          time: formatTimelineTime(event.timestamp)
        };
      }

      if (event.payload.text === "researcher.context") {
        return {
          id: event.id,
          actor,
          message: strings.researcherContext(result.mission.goal),
          time: formatTimelineTime(event.timestamp)
        };
      }

      if (event.payload.text === "builder.ready") {
        return {
          id: event.id,
          actor,
          message: strings.builderReady(result.mission.goal),
          time: formatTimelineTime(event.timestamp)
        };
      }

      if (member?.role === "captain") {
        return {
          id: event.id,
          actor,
          message: strings.captainCliResponse(event.payload.text),
          time: formatTimelineTime(event.timestamp)
        };
      }

      return {
        id: event.id,
        actor,
        message: strings.agentUpdate(actor, event.payload.text),
        time: formatTimelineTime(event.timestamp)
      };
    }

    return {
      id: event.id,
      actor: strings.systemActor,
      message: event.type,
      time: formatTimelineTime(event.timestamp)
    };
  });
}

export const useAppStore = create<AppState>()((set) => ({
  activeMissionId: null,
  activeTeam: null,
  timelineItems: [],
  recentMissions: [],
  runtimeStatus: null,
  codexSmokeTestResult: null,
  isCodexSmokeTestRunning: false,
  currentWorkspacePath: null,
  language: "zh-CN",
  setLanguage: (language) => set({ language }),
  setActiveMissionId: (missionId) => set({ activeMissionId: missionId }),
  setActiveTeam: (activeTeam) => set({ activeTeam }),
  setCurrentWorkspacePath: (workspacePath) => set({ currentWorkspacePath: workspacePath?.trim() ? workspacePath.trim() : null }),
  setRecentMissions: (recentMissions) => set({ recentMissions: recentMissions.slice(0, 8) }),
  setRuntimeStatus: (runtimeStatus) => set({ runtimeStatus }),
  setCodexSmokeTestResult: (codexSmokeTestResult) => set({ codexSmokeTestResult }),
  setCodexSmokeTestRunning: (isCodexSmokeTestRunning) => set({ isCodexSmokeTestRunning }),
  recordMissionStarted: (result) =>
    set((state) => {
      const mission = result.recentMission ?? result.mission;

      return {
        activeMissionId: result.mission.id,
        activeTeam: result.team,
        currentWorkspacePath: result.mission.workspacePath,
        recentMissions: mergeRecentMissions(state.recentMissions, mission),
        timelineItems: [...state.timelineItems, ...mapEventsToTimelineItems(result, state.language)]
      };
    })
}));
