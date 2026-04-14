export const workspaceDefaultPathChannel = "workspace:get-default-path";

export interface WorkspaceChannelRegistrar {
  handle: (channel: string, listener: (_event: unknown) => string | Promise<string>) => void;
}

export interface WorkspacePathProvider {
  getDefaultWorkspacePath(): string;
}

export function registerWorkspaceChannels(
  ipcMain: WorkspaceChannelRegistrar,
  workspacePickerService: WorkspacePathProvider
) {
  ipcMain.handle(workspaceDefaultPathChannel, () => workspacePickerService.getDefaultWorkspacePath());
}
