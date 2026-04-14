import type {
  AppMemoryOverview,
  AppRuntimeMissionStartResult,
  AppRuntimeStatus
} from "../../../runtime/core/AppRuntime";
import type { RecentMissionRecord } from "../../../runtime/core/TranscriptStore";

export const runtimeStartMissionChannel = "runtime:start-mission";
export const runtimeGetRecentMissionsChannel = "runtime:get-recent-missions";
export const runtimeGetStatusChannel = "runtime:get-status";
export const runtimeGetMemoryOverviewChannel = "runtime:get-memory-overview";

export interface RuntimeStartMissionRequest {
  goal: string;
  workspacePath?: string;
}

export interface RuntimeChannelRegistrar {
  handle: <T>(
    channel: string,
    listener: (_event: unknown, input?: RuntimeStartMissionRequest) => Promise<T> | T
  ) => void;
}

export interface RuntimeMissionStarter {
  startMission(input: RuntimeStartMissionRequest): Promise<AppRuntimeMissionStartResult>;
}

export interface RuntimeRecentMissionsReader {
  getRecentMissions(): Promise<RecentMissionRecord[]>;
}

export interface RuntimeStatusReader {
  getRuntimeStatus(): Promise<AppRuntimeStatus>;
}

export interface RuntimeMemoryReader {
  getMemoryOverview(): Promise<AppMemoryOverview>;
}

export function registerRuntimeChannels(
  ipcMain: RuntimeChannelRegistrar,
  runtimeService: RuntimeMissionStarter &
    Partial<RuntimeRecentMissionsReader & RuntimeStatusReader & RuntimeMemoryReader>
) {
  ipcMain.handle(runtimeStartMissionChannel, (_event, input) => {
    if (!input) {
      throw new Error("Missing runtime:start-mission payload");
    }

    return runtimeService.startMission(input);
  });

  if (runtimeService.getRecentMissions) {
    ipcMain.handle(runtimeGetRecentMissionsChannel, () =>
      Promise.resolve(runtimeService.getRecentMissions?.() ?? [])
    );
  }

  if (runtimeService.getRuntimeStatus) {
    ipcMain.handle(runtimeGetStatusChannel, () => Promise.resolve(runtimeService.getRuntimeStatus?.()));
  }

  if (runtimeService.getMemoryOverview) {
    ipcMain.handle(runtimeGetMemoryOverviewChannel, () =>
      Promise.resolve(runtimeService.getMemoryOverview?.())
    );
  }
}
