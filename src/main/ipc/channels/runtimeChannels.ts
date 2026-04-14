import type { AppRuntimeMissionStartResult } from "../../../runtime/core/AppRuntime";
import type { RecentMissionRecord } from "../../../runtime/core/TranscriptStore";

export const runtimeStartMissionChannel = "runtime:start-mission";
export const runtimeGetRecentMissionsChannel = "runtime:get-recent-missions";

export interface RuntimeStartMissionRequest {
  goal: string;
  workspacePath?: string;
}

export interface RuntimeChannelRegistrar {
  handle: <T>(
    channel: string,
    listener: (_event: unknown, input: RuntimeStartMissionRequest) => Promise<T> | T
  ) => void;
}

export interface RuntimeMissionStarter {
  startMission(input: RuntimeStartMissionRequest): Promise<AppRuntimeMissionStartResult>;
}

export interface RuntimeRecentMissionsReader {
  getRecentMissions(): Promise<RecentMissionRecord[]>;
}

export function registerRuntimeChannels(
  ipcMain: RuntimeChannelRegistrar,
  runtimeService: RuntimeMissionStarter & Partial<RuntimeRecentMissionsReader>
) {
  ipcMain.handle(runtimeStartMissionChannel, (_event, input) => runtimeService.startMission(input));

  if (runtimeService.getRecentMissions) {
    ipcMain.handle(runtimeGetRecentMissionsChannel, () =>
      Promise.resolve(runtimeService.getRecentMissions?.() ?? [])
    );
  }
}
