import { contextBridge, ipcRenderer } from "electron";

import {
  runtimeGetMemoryOverviewChannel,
  runtimeGetRecentMissionsChannel,
  runtimeGetStatusChannel,
  runtimeRunCodexSmokeTestChannel,
  runtimeStartMissionChannel
} from "../main/ipc/channels/runtimeChannels";
import { workspaceDefaultPathChannel } from "../main/ipc/channels/workspaceChannels";
import type { AppMemoryOverview, AppRuntimeSmokeTestResult, AppRuntimeStatus } from "../runtime/core/AppRuntime";
import type { AppEvent } from "../shared/contracts/events";
import type { RecentMissionRecord } from "../runtime/core/TranscriptStore";

interface MissionRecord {
  id: string;
  title: string;
  workspacePath: string;
  goal: string;
  status: "draft" | "running" | "paused" | "done";
  createdAt: string;
}

interface AgentRecord {
  id: string;
  role: "captain" | "researcher" | "builder" | "reviewer" | "tester";
  name: string;
  status: "idle" | "planning" | "running" | "blocked" | "done";
}

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

export interface WinTogetherApi {
  getDefaultWorkspacePath(): Promise<string>;
  getMemoryOverview?(): Promise<AppMemoryOverview>;
  getRecentMissions?(): Promise<RecentMissionRecord[]>;
  getRuntimeStatus?(): Promise<AppRuntimeStatus>;
  runCodexSmokeTest?(prompt?: string): Promise<AppRuntimeSmokeTestResult>;
  startMission(input: StartMissionInput): Promise<StartMissionResult>;
}

const api: WinTogetherApi = {
  getDefaultWorkspacePath: () => ipcRenderer.invoke(workspaceDefaultPathChannel),
  getMemoryOverview: () => ipcRenderer.invoke(runtimeGetMemoryOverviewChannel),
  getRecentMissions: () => ipcRenderer.invoke(runtimeGetRecentMissionsChannel),
  getRuntimeStatus: () => ipcRenderer.invoke(runtimeGetStatusChannel),
  runCodexSmokeTest: (prompt) => ipcRenderer.invoke(runtimeRunCodexSmokeTestChannel, prompt),
  startMission: (input) => ipcRenderer.invoke(runtimeStartMissionChannel, input)
};

contextBridge.exposeInMainWorld("winTogether", api);
