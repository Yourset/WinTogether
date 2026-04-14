import { describe, expect, it, vi } from "vitest";

import {
  registerRuntimeChannels,
  runtimeGetMemoryOverviewChannel,
  runtimeGetStatusChannel,
  runtimeGetRecentMissionsChannel,
  runtimeStartMissionChannel
} from "../../src/main/ipc/channels/runtimeChannels";

describe("registerRuntimeChannels", () => {
  it("registers the runtime:start-mission handler and forwards the invoke payload", async () => {
    const handle = vi.fn();
    const startMission = vi.fn().mockResolvedValue({ mission: { id: "mission-123" } });

    registerRuntimeChannels(
      { handle },
      {
        startMission
      }
    );

    expect(handle).toHaveBeenCalledTimes(1);
    expect(handle).toHaveBeenCalledWith(runtimeStartMissionChannel, expect.any(Function));

    const handler = handle.mock.calls[0]?.[1] as ((event: unknown, input: unknown) => Promise<unknown>) | undefined;
    const payload = {
      goal: "Build the Team Room loop",
      workspacePath: "D:/development/WinTogether2/.worktrees/feature-v1-foundation"
    };

    await expect(handler?.({}, payload)).resolves.toEqual({ mission: { id: "mission-123" } });
    expect(startMission).toHaveBeenCalledWith(payload);
  });

  it("registers the runtime:get-recent-missions handler when the runtime service supports it", async () => {
    const handle = vi.fn();
    const getRecentMissions = vi.fn().mockResolvedValue([
      {
        id: "mission-7",
        title: "Login flow",
        goal: "Build the login flow",
        workspacePath: "D:/development/WinTogether2/.worktrees/feature-v1-foundation",
        status: "draft",
        createdAt: "2026-04-14T12:30:00.000Z"
      }
    ]);

    registerRuntimeChannels(
      { handle },
      {
        startMission: vi.fn(),
        getRecentMissions
      }
    );

    expect(handle).toHaveBeenCalledWith(runtimeGetRecentMissionsChannel, expect.any(Function));

    const handler = handle.mock.calls[1]?.[1] as (() => Promise<unknown>) | undefined;
    await expect(handler?.()).resolves.toEqual([
      {
        id: "mission-7",
        title: "Login flow",
        goal: "Build the login flow",
        workspacePath: "D:/development/WinTogether2/.worktrees/feature-v1-foundation",
        status: "draft",
        createdAt: "2026-04-14T12:30:00.000Z"
      }
    ]);
    expect(getRecentMissions).toHaveBeenCalledTimes(1);
  });

  it("registers the runtime:get-status handler when the runtime service supports it", async () => {
    const handle = vi.fn();
    const getRuntimeStatus = vi.fn().mockResolvedValue({
      codexCli: {
        status: "ready",
        message: "codex 1.2.3"
      }
    });

    registerRuntimeChannels(
      { handle },
      {
        startMission: vi.fn(),
        getRuntimeStatus
      }
    );

    expect(handle).toHaveBeenCalledWith(runtimeGetStatusChannel, expect.any(Function));

    const handler = handle.mock.calls[1]?.[1] as (() => Promise<unknown>) | undefined;
    await expect(handler?.()).resolves.toEqual({
      codexCli: {
        status: "ready",
        message: "codex 1.2.3"
      }
    });
    expect(getRuntimeStatus).toHaveBeenCalledTimes(1);
  });

  it("registers the runtime:get-memory-overview handler when the runtime service supports it", async () => {
    const handle = vi.fn();
    const getMemoryOverview = vi.fn().mockResolvedValue({
      indexContent: "# Memory Index",
      workLogContent: "# Current Work Log"
    });

    registerRuntimeChannels(
      { handle },
      {
        startMission: vi.fn(),
        getMemoryOverview
      }
    );

    expect(handle).toHaveBeenCalledWith(runtimeGetMemoryOverviewChannel, expect.any(Function));

    const handler = handle.mock.calls[1]?.[1] as (() => Promise<unknown>) | undefined;
    await expect(handler?.()).resolves.toEqual({
      indexContent: "# Memory Index",
      workLogContent: "# Current Work Log"
    });
    expect(getMemoryOverview).toHaveBeenCalledTimes(1);
  });
});
