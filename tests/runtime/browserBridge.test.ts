import { describe, expect, it, vi } from "vitest";

import { createBrowserBridge, shouldInstallBrowserBridge } from "../../src/renderer/support/browserBridge";

describe("browserBridge", () => {
  it("only enables the browser bridge in explicit browser mode or browser query params", () => {
    expect(shouldInstallBrowserBridge({ mode: "browser", search: "" })).toBe(true);
    expect(shouldInstallBrowserBridge({ mode: "development", search: "" })).toBe(false);
    expect(shouldInstallBrowserBridge({ mode: "development", search: "?browser=1" })).toBe(true);
    expect(shouldInstallBrowserBridge({ mode: "development", search: "?browser-bridge=1" })).toBe(true);
  });

  it("provides a browser-mode Win Together API for renderer startup and mission flow", async () => {
    const bridge = createBrowserBridge();

    await expect(bridge.getDefaultWorkspacePath()).resolves.toMatch(/WinTogether2/);
    await expect(bridge.getRuntimeStatus?.()).resolves.toEqual({
      codexCli: {
        status: "ready",
        message: "Browser bridge ready"
      }
    });

    await expect(
      bridge.runCodexSmokeTest?.("Say one short sentence that confirms the browser bridge is wired.")
    ).resolves.toEqual({
      status: "success",
      message: "Browser bridge is ready.",
      rawOutput: "Browser bridge is ready."
    });

    const missionResult = await bridge.startMission({
      goal: "Build the first login flow",
      workspacePath: "D:/development/WinTogether2"
    });

    expect(missionResult.mission.goal).toBe("Build the first login flow");
    expect(missionResult.mission.workspacePath).toBe("D:/development/WinTogether2");
    expect(missionResult.recentMission).toEqual(
      expect.objectContaining({
        id: missionResult.mission.id,
        goal: "Build the first login flow",
        summary: expect.stringContaining("Browser Captain")
      })
    );
    expect(missionResult.events?.some((event) => event.type === "mission.created")).toBe(true);
    expect(missionResult.events?.some((event) => event.type === "agent.spawned")).toBe(true);
    expect(missionResult.events?.some((event) => event.type === "agent.message")).toBe(true);
    expect(
      missionResult.events?.find((event) => event.type === "memory.written")?.payload.memory.sourceEventId
    ).toEqual(missionResult.events?.find((event) => event.type === "agent.message" && event.payload.text === "captain.summary")?.id);

    await expect(bridge.getRecentMissions?.()).resolves.toEqual([
      expect.objectContaining({
        id: missionResult.mission.id,
        goal: "Build the first login flow",
        summary: expect.stringContaining("Browser Captain")
      })
    ]);

    await expect(bridge.getMemoryOverview?.()).resolves.toEqual({
      indexContent: expect.stringContaining("Browser bridge"),
      workLogContent: expect.stringContaining("Build the first login flow")
    });
  });

  it("keeps smoke tests and mission starts pending when a bridge delay is configured", async () => {
    vi.useFakeTimers();

    try {
      const bridge = createBrowserBridge({ responseDelayMs: 750 });

      const smokePromise = bridge.runCodexSmokeTest?.("Say one short sentence that confirms the bridge waits.");
      const missionPromise = bridge.startMission({
        goal: "Build the first login flow",
        workspacePath: "D:/development/WinTogether2"
      });

      await vi.advanceTimersByTimeAsync(750);

      await expect(smokePromise).resolves.toEqual({
        status: "success",
        message: "Browser bridge is ready.",
        rawOutput: "Browser bridge is ready."
      });
      await expect(missionPromise).resolves.toEqual(
        expect.objectContaining({
          mission: expect.objectContaining({
            goal: "Build the first login flow"
          }),
          persistence: {
            transcript: {
              status: "written"
            }
          }
        })
      );
    } finally {
      vi.useRealTimers();
    }
  });
});
