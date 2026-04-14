import path from "node:path";

import { app, BrowserWindow, Menu } from "electron";

import { registerAppIpc } from "./ipc/registerAppIpc";
import { AppRuntimeService } from "./services/runtime/AppRuntimeService";
import { createAppRuntime } from "./services/runtime/createAppRuntime";
import { WorkspacePickerService } from "./services/workspace/WorkspacePickerService";
import { createMainWindowOptions } from "./window/createMainWindowOptions";

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
  const window = new BrowserWindow(createMainWindowOptions(path.join(__dirname, "../preload/index.mjs")));

  const rendererUrl = process.env.ELECTRON_RENDERER_URL;

  window.webContents.on("did-fail-load", (_event, errorCode, errorDescription, validatedUrl) => {
    console.error("[Win Together] Renderer failed to load", {
      errorCode,
      errorDescription,
      validatedUrl
    });
  });

  window.webContents.on("render-process-gone", (_event, details) => {
    console.error("[Win Together] Renderer process exited", details);
  });

  window.webContents.on("console-message", (_event, level, message, line, sourceId) => {
    console.log("[Win Together] Renderer console", {
      level,
      message,
      line,
      sourceId
    });
  });

  if (rendererUrl) {
    void window.loadURL(rendererUrl);
    window.webContents.openDevTools({ mode: "detach" });
    return;
  }

  void window.loadFile(path.join(__dirname, "../renderer/index.html"));
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
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
