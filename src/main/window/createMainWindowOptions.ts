import type { BrowserWindowConstructorOptions } from "electron";

export function createMainWindowOptions(preloadPath: string): BrowserWindowConstructorOptions {
  return {
    width: 1280,
    height: 800,
    autoHideMenuBar: true,
    backgroundColor: "#f3f7fb",
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  };
}
