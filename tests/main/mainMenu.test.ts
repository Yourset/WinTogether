import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const setApplicationMenu = vi.fn();
  const browserWindowInstance = {
    webContents: {
      on: vi.fn(),
      openDevTools: vi.fn()
    },
    loadURL: vi.fn().mockResolvedValue(undefined),
    loadFile: vi.fn().mockResolvedValue(undefined)
  };

  const browserWindowMock = Object.assign(vi.fn(() => browserWindowInstance), {
    getAllWindows: vi.fn(() => [])
  });

  return {
    setApplicationMenu,
    browserWindowInstance,
    browserWindowMock
  };
});

vi.mock("electron", () => ({
  app: {
    whenReady: vi.fn(() => Promise.resolve()),
    on: vi.fn(),
    quit: vi.fn()
  },
  BrowserWindow: mocks.browserWindowMock,
  Menu: {
    setApplicationMenu: mocks.setApplicationMenu
  }
}));

vi.mock("../../src/main/ipc/registerAppIpc", () => ({
  registerAppIpc: vi.fn()
}));

vi.mock("../../src/main/services/runtime/AppRuntimeService", () => ({
  AppRuntimeService: vi.fn().mockImplementation(() => ({}))
}));

vi.mock("../../src/main/services/runtime/createAppRuntime", () => ({
  createAppRuntime: vi.fn(() => ({}))
}));

vi.mock("../../src/main/services/workspace/WorkspacePickerService", () => ({
  WorkspacePickerService: vi.fn().mockImplementation(() => ({}))
}));

vi.mock("../../src/main/window/createMainWindowOptions", () => ({
  createMainWindowOptions: vi.fn(() => ({
    width: 1280,
    height: 800,
    autoHideMenuBar: true,
    backgroundColor: "#f3f7fb",
    webPreferences: {
      preload: "D:/preload/index.mjs",
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  }))
}));

describe("main process menu setup", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("clears the application menu when the app becomes ready", async () => {
    await import("../../src/main/main");
    await Promise.resolve();

    expect(mocks.setApplicationMenu).toHaveBeenCalledWith(null);
  });
});
