import { contextBridge, ipcRenderer } from "electron";

import { runtimeStartMissionChannel } from "../main/ipc/channels/runtimeChannels";
import { workspaceDefaultPathChannel } from "../main/ipc/channels/workspaceChannels";

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
  startMission(input: StartMissionInput): Promise<StartMissionResult>;
}

const api: WinTogetherApi = {
  getDefaultWorkspacePath: () => ipcRenderer.invoke(workspaceDefaultPathChannel),
  startMission: (input) => ipcRenderer.invoke(runtimeStartMissionChannel, input)
};

contextBridge.exposeInMainWorld("winTogether", api);
