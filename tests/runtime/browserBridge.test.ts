import { describe, expect, it } from "vitest";

import { createBrowserBridge } from "../e2e/fixtures/browserBridge";

describe("browserBridge", () => {
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
    expect(missionResult.events?.some((event) => event.type === "mission.created")).toBe(true);
    expect(missionResult.events?.some((event) => event.type === "agent.spawned")).toBe(true);
    expect(missionResult.events?.some((event) => event.type === "agent.message")).toBe(true);

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
});
