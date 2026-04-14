import type { AgentRecord } from "../../shared/contracts/agent";
import type { MissionRecord } from "../../shared/contracts/mission";
import type { StartMissionInput, StartMissionResult } from "./MissionOrchestrator";
import type { RecentMissionRecord } from "./TranscriptStore";

export interface AppRuntime {
  startMission(input: StartMissionInput): Promise<AppRuntimeMissionStartResult>;
  getRecentMissions?(): Promise<RecentMissionRecord[]>;
}

export type { StartMissionInput };
export type AppMission = MissionRecord;
export type AppAgent = AgentRecord;
export type AppRecentMission = RecentMissionRecord;

export interface RuntimePersistenceStatus {
  transcript: {
    status: "written" | "failed";
  };
}

export interface AppRuntimeMissionStartResult extends StartMissionResult {
  persistence: RuntimePersistenceStatus;
}
