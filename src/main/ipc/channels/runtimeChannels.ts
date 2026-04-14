import type { AppRuntimeMissionStartResult } from "../../../runtime/core/AppRuntime";

export const runtimeStartMissionChannel = "runtime:start-mission";

export interface RuntimeStartMissionRequest {
  goal: string;
  workspacePath?: string;
}

export interface RuntimeChannelRegistrar {
  handle: (
    channel: string,
    listener: (_event: unknown, input: RuntimeStartMissionRequest) => Promise<AppRuntimeMissionStartResult>
  ) => void;
}

export interface RuntimeMissionStarter {
  startMission(input: RuntimeStartMissionRequest): Promise<AppRuntimeMissionStartResult>;
}

export function registerRuntimeChannels(
  ipcMain: RuntimeChannelRegistrar,
  runtimeService: RuntimeMissionStarter
) {
  ipcMain.handle(runtimeStartMissionChannel, (_event, input) => runtimeService.startMission(input));
}
