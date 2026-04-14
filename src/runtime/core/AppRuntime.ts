import type { AgentRecord } from "../../shared/contracts/agent";
import type { AppEvent } from "../../shared/contracts/events";
import type { MissionRecord } from "../../shared/contracts/mission";
import type { CodexCliHealth } from "../adapters/CodexCliAdapter";
import type { StartMissionInput, StartMissionResult } from "./MissionOrchestrator";
import type { RecentMissionRecord } from "./TranscriptStore";

export interface AppRuntime {
  startMission(input: StartMissionInput): Promise<AppRuntimeMissionStartResult>;
  getMemoryOverview?(): Promise<AppMemoryOverview>;
  getRecentMissions?(): Promise<RecentMissionRecord[]>;
  getRuntimeStatus?(): Promise<AppRuntimeStatus>;
}

export type { StartMissionInput };
export type AppMission = MissionRecord;
export type AppAgent = AgentRecord;
export type AppRecentMission = RecentMissionRecord;

export interface AppRuntimeStatus {
  codexCli: CodexCliHealth;
}

export interface AppMemoryOverview {
  indexContent: string;
  workLogContent: string;
}

export interface RuntimePersistenceStatus {
  transcript: {
    status: "written" | "failed";
  };
}

export interface AppRuntimeMissionStartResult extends StartMissionResult {
  events?: AppEvent[];
  persistence: RuntimePersistenceStatus;
}
