import { contextBridge, ipcRenderer } from "electron";

import {
  runtimeGetRecentMissionsChannel,
  runtimeGetStatusChannel,
  runtimeStartMissionChannel
} from "../main/ipc/channels/runtimeChannels";
import { workspaceDefaultPathChannel } from "../main/ipc/channels/workspaceChannels";
import type { AppRuntimeStatus } from "../runtime/core/AppRuntime";
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
  persistence: {
    transcript: {
      status: "written" | "failed";
    };
  };
}

export interface WinTogetherApi {
  getDefaultWorkspacePath(): Promise<string>;
  getRecentMissions?(): Promise<RecentMissionRecord[]>;
  getRuntimeStatus?(): Promise<AppRuntimeStatus>;
  startMission(input: StartMissionInput): Promise<StartMissionResult>;
}

const api: WinTogetherApi = {
  getDefaultWorkspacePath: () => ipcRenderer.invoke(workspaceDefaultPathChannel),
  getRecentMissions: () => ipcRenderer.invoke(runtimeGetRecentMissionsChannel),
  getRuntimeStatus: () => ipcRenderer.invoke(runtimeGetStatusChannel),
  startMission: (input) => ipcRenderer.invoke(runtimeStartMissionChannel, input)
};

contextBridge.exposeInMainWorld("winTogether", api);
