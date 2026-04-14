import { ipcMain } from "electron";

import { registerRuntimeChannels, type RuntimeMissionStarter } from "./channels/runtimeChannels";
import { registerWorkspaceChannels, type WorkspacePathProvider } from "./channels/workspaceChannels";

export interface AppIpcServices {
  runtimeService: RuntimeMissionStarter;
  workspacePickerService: WorkspacePathProvider;
}

export function registerAppIpc(services: AppIpcServices) {
  registerRuntimeChannels(ipcMain, services.runtimeService);
  registerWorkspaceChannels(ipcMain, services.workspacePickerService);
}
