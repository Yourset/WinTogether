import { create } from "zustand";

import type { AgentRecord } from "../../shared/contracts/agent";
import type { MissionRecord } from "../../shared/contracts/mission";
import { getStrings, type AppLanguage } from "../i18n";

export interface StartMissionInput {
  goal: string;
  workspacePath?: string;
}

export interface StartMissionResult {
  mission: MissionRecord;
  captain: AgentRecord;
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

export interface TimelineItem {
  id: string;
  actor: string;
  message: string;
  time: string;
}

export interface WinTogetherApi {
  getDefaultWorkspacePath(): Promise<string>;
  getRecentMissions?(): Promise<RecentMissionRecord[]>;
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
  currentWorkspacePath: string | null;
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  setActiveMissionId: (missionId: string | null) => void;
  setCurrentWorkspacePath: (workspacePath: string | null) => void;
  setRecentMissions: (recentMissions: RecentMissionRecord[]) => void;
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

export const useAppStore = create<AppState>()((set) => ({
  activeMissionId: null,
  timelineItems: [],
  recentMissions: [],
  currentWorkspacePath: null,
  language: "zh-CN",
  setLanguage: (language) => set({ language }),
  setActiveMissionId: (missionId) => set({ activeMissionId: missionId }),
  setCurrentWorkspacePath: (workspacePath) => set({ currentWorkspacePath: workspacePath?.trim() ? workspacePath.trim() : null }),
  setRecentMissions: (recentMissions) => set({ recentMissions: recentMissions.slice(0, 8) }),
  recordMissionStarted: (result) =>
    set((state) => {
      const strings = getStrings(state.language);

      return {
        activeMissionId: result.mission.id,
        currentWorkspacePath: result.mission.workspacePath,
        recentMissions: mergeRecentMissions(state.recentMissions, result.mission),
        timelineItems: [
          ...state.timelineItems,
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
        ]
      };
    })
}));
