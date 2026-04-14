import path from "node:path";

import { expect, test } from "@playwright/test";
import { _electron as electron, type Page } from "playwright";

async function launchElectronApp() {
  const appRoot = path.resolve(process.cwd());

  return electron.launch({
    args: [appRoot],
    env: {
      ...process.env,
      WIN_TOGETHER_DEFAULT_WORKSPACE: appRoot
    }
  });
}

async function readPreloadState(page: Page) {
  return page.evaluate(async () => {
    const api = (globalThis as typeof globalThis & {
      winTogether?: {
        getDefaultWorkspacePath(): Promise<string>;
        getRuntimeStatus?(): Promise<unknown>;
        getMemoryOverview?(): Promise<unknown>;
      };
    }).winTogether;

    if (!api) {
      return {
        available: false as const
      };
    }

    const [defaultWorkspacePath, runtimeStatus, memoryOverview] = await Promise.all([
      api.getDefaultWorkspacePath(),
      api.getRuntimeStatus?.(),
      api.getMemoryOverview?.()
    ]);

    return {
      available: true as const,
      hasGetDefaultWorkspacePath: typeof api.getDefaultWorkspacePath === "function",
      hasGetRuntimeStatus: typeof api.getRuntimeStatus === "function",
      hasGetMemoryOverview: typeof api.getMemoryOverview === "function",
      defaultWorkspacePath,
      runtimeStatus,
      memoryOverview
    };
  });
}

test("Electron shell loads the main workbench and exposes preload IPC", async () => {
  const appRoot = path.resolve(process.cwd());
  const app = await launchElectronApp();

  try {
    const page = await app.firstWindow();

    await expect(page.getByTestId("app-shell-brand")).toBeVisible({ timeout: 30000 });
    await expect(page.getByTestId("mission-composer-home")).toBeVisible();
    await expect(page.getByTestId("mission-workspace-input")).toBeVisible();
    await expect(page.getByTestId("app-shell-runtime-panel")).toBeVisible();

    const preloadState = await readPreloadState(page);

    expect(preloadState.available).toBe(true);
    expect(preloadState.hasGetDefaultWorkspacePath).toBe(true);
    expect(preloadState.hasGetRuntimeStatus).toBe(true);
    expect(preloadState.hasGetMemoryOverview).toBe(true);
    expect(preloadState.defaultWorkspacePath).toBe(appRoot);
    expect(preloadState.runtimeStatus).toMatchObject({
      codexCli: {
        status: expect.stringMatching(/^(ready|unavailable)$/)
      }
    });
    expect(preloadState.memoryOverview).toMatchObject({
      indexContent: expect.any(String),
      workLogContent: expect.any(String)
    });

    const workspaceInputValue = await page.getByTestId("mission-workspace-input").inputValue();
    expect(workspaceInputValue).toBe(appRoot);
  } finally {
    await app.close();
  }
});
