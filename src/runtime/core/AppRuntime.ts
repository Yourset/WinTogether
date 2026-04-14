import type { AgentRecord } from "../../shared/contracts/agent";
import type { MissionRecord } from "../../shared/contracts/mission";
import type { StartMissionInput, StartMissionResult } from "./MissionOrchestrator";

export interface AppRuntime {
  startMission(input: StartMissionInput): Promise<StartMissionResult>;
}

export type { StartMissionInput, StartMissionResult };
export type AppMission = MissionRecord;
export type AppAgent = AgentRecord;
