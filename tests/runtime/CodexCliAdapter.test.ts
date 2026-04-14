import { EventEmitter } from "node:events";
import { spawn } from "node:child_process";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CodexCliAdapter } from "../../src/runtime/adapters/CodexCliAdapter";

vi.mock("node:child_process", () => ({
  spawn: vi.fn()
}));

const mockedSpawn = vi.mocked(spawn);

function createMockProcess() {
  const process = new EventEmitter() as EventEmitter & {
    stdout: EventEmitter;
    stderr: EventEmitter;
  };

  process.stdout = new EventEmitter();
  process.stderr = new EventEmitter();

  return process;
}

describe("CodexCliAdapter", () => {
  afterEach(() => {
    mockedSpawn.mockReset();
  });

  it("buildTaskPrompt includes the mission goal, agent role, and scope", () => {
    const adapter = new CodexCliAdapter();

    const prompt = adapter.buildTaskPrompt({
      missionGoal: "Build the foundation runtime",
      agentRole: "builder",
      scope: "Only create the adapter skeleton and prompt builder."
    });

    expect(prompt).toContain("Build the foundation runtime");
    expect(prompt).toContain("builder");
    expect(prompt).toContain("Only create the adapter skeleton and prompt builder.");
  });

  it("reports the Codex CLI version when the executable is available", async () => {
    const adapter = new CodexCliAdapter();
    const child = createMockProcess();

    mockedSpawn.mockReturnValue(child as never);

    const healthPromise = adapter.checkHealth("D:/development/WinTogether2");

    child.stdout.emit("data", "codex 1.2.3\n");
    child.emit("close", 0);

    await expect(healthPromise).resolves.toEqual({
      status: "ready",
      message: "codex 1.2.3"
    });
  });

  it("returns an unavailable status with the spawn error message when Codex cannot start", async () => {
    const adapter = new CodexCliAdapter();
    const child = createMockProcess();

    mockedSpawn.mockReturnValue(child as never);

    const healthPromise = adapter.checkHealth("D:/development/WinTogether2");

    child.emit("error", new Error("spawn ENOENT"));

    await expect(healthPromise).resolves.toEqual({
      status: "unavailable",
      message: "spawn ENOENT"
    });
  });
});
