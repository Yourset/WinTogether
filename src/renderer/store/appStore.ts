import { create } from "zustand";

import type { AgentRecord } from "../../shared/contracts/agent";
import type { MissionRecord } from "../../shared/contracts/mission";

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

export interface TimelineItem {
  id: string;
  actor: string;
  message: string;
  time: string;
}

export interface WinTogetherApi {
  getDefaultWorkspacePath(): Promise<string>;
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
  setActiveMissionId: (missionId: string | null) => void;
  recordMissionStarted: (result: StartMissionResult) => void;
};

function formatTimelineTime(timestamp: string) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

export const useAppStore = create<AppState>()((set) => ({
  activeMissionId: null,
  timelineItems: [],
  setActiveMissionId: (missionId) => set({ activeMissionId: missionId }),
  recordMissionStarted: (result) =>
    set((state) => ({
      activeMissionId: result.mission.id,
      timelineItems: [
        ...state.timelineItems,
        {
          id: `${result.mission.id}-mission`,
          actor: "System",
          message: `Mission "${result.mission.goal}" started.`,
          time: formatTimelineTime(result.mission.createdAt)
        },
        {
          id: `${result.mission.id}-captain`,
          actor: result.captain.name,
          message: `Captain is planning the next steps for: ${result.mission.goal}`,
          time: formatTimelineTime(result.mission.createdAt)
        }
      ]
    }))
}));
