import { create } from "zustand";

import type { AgentRecord } from "../../shared/contracts/agent";
import type { AppEvent } from "../../shared/contracts/events";
import type { MissionRecord } from "../../shared/contracts/mission";
import { getStrings, type AppLanguage } from "../i18n";

export interface StartMissionInput {
  goal: string;
  workspacePath?: string;
}

export interface StartMissionResult {
  mission: MissionRecord;
  captain: AgentRecord;
  events?: AppEvent[];
  persistence: {
    transcript: {
      status: "written" | "failed";
    };
  };
}

export interface RecentMissionRecord extends MissionRecord {
  summary?: string;
  lastUpdatedAt?: string;
}

export interface RuntimeStatus {
  codexCli: {
    status: "ready" | "unavailable";
    message: string;
  };
}

export interface TimelineItem {
  id: string;
  actor: string;
  message: string;
  time: string;
}

export interface WinTogetherApi {
  getDefaultWorkspacePath(): Promise<string>;
  getRecentMissions?(): Promise<RecentMissionRecord[]>;
  getRuntimeStatus?(): Promise<RuntimeStatus>;
  startMission(input: StartMissionInput): Promise<StartMissionResult>;
}

declare global {
  interface Window {
    winTogether: WinTogetherApi;
  }
}

type AppState = {
  activeMissionId: string | null;
  timelineItems: TimelineItem[];
  recentMissions: RecentMissionRecord[];
  runtimeStatus: RuntimeStatus | null;
  currentWorkspacePath: string | null;
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  setActiveMissionId: (missionId: string | null) => void;
  setCurrentWorkspacePath: (workspacePath: string | null) => void;
  setRecentMissions: (recentMissions: RecentMissionRecord[]) => void;
  setRuntimeStatus: (runtimeStatus: RuntimeStatus | null) => void;
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
      return {
        id: event.id,
        actor: strings.systemActor,
        message: strings.captainJoined(event.payload.agent.name),
        time: formatTimelineTime(event.timestamp)
      };
    }

    if (event.type === "agent.message") {
      return {
        id: event.id,
        actor: result.captain.name,
        message:
          event.payload.text === "captain.summary"
            ? strings.captainSummary(result.mission.goal)
            : strings.captainPlanning(result.mission.goal),
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
  timelineItems: [],
  recentMissions: [],
  runtimeStatus: null,
  currentWorkspacePath: null,
  language: "zh-CN",
  setLanguage: (language) => set({ language }),
  setActiveMissionId: (missionId) => set({ activeMissionId: missionId }),
  setCurrentWorkspacePath: (workspacePath) => set({ currentWorkspacePath: workspacePath?.trim() ? workspacePath.trim() : null }),
  setRecentMissions: (recentMissions) => set({ recentMissions: recentMissions.slice(0, 8) }),
  setRuntimeStatus: (runtimeStatus) => set({ runtimeStatus }),
  recordMissionStarted: (result) =>
    set((state) => {
      return {
        activeMissionId: result.mission.id,
        currentWorkspacePath: result.mission.workspacePath,
        recentMissions: mergeRecentMissions(state.recentMissions, result.mission),
        timelineItems: [...state.timelineItems, ...mapEventsToTimelineItems(result, state.language)]
      };
    })
}));
