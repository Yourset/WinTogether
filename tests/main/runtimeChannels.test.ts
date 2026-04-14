import { describe, expect, it, vi } from "vitest";

import {
  registerRuntimeChannels,
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
});
