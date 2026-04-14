import path from "node:path";

import { app, BrowserWindow } from "electron";

import { registerAppIpc } from "./ipc/registerAppIpc";
import { AppRuntimeService } from "./services/runtime/AppRuntimeService";
import { createAppRuntime } from "./services/runtime/createAppRuntime";
import { WorkspacePickerService } from "./services/workspace/WorkspacePickerService";

function resolveDefaultWorkspacePath() {
  const configuredWorkspacePath = process.env.WIN_TOGETHER_DEFAULT_WORKSPACE?.trim();

  if (configuredWorkspacePath) {
    return path.resolve(configuredWorkspacePath);
  }

  return process.cwd();
}

const rootPath = resolveDefaultWorkspacePath();
const workspacePickerService = new WorkspacePickerService(rootPath);
const runtimeService = new AppRuntimeService({
  rootPath,
  runtime: createAppRuntime(rootPath),
  workspacePickerService
});

function createWindow() {
  const window = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.mjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const rendererUrl = process.env.ELECTRON_RENDERER_URL;

  if (rendererUrl) {
    void window.loadURL(rendererUrl);
    window.webContents.openDevTools({ mode: "detach" });
    return;
  }

  void window.loadFile(path.join(__dirname, "../renderer/index.html"));
}

app.whenReady().then(() => {
  registerAppIpc({
    runtimeService,
    workspacePickerService
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
