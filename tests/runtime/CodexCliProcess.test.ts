import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { spawn } from "node:child_process";
import { spawnCodexProcess } from "../../src/runtime/adapters/CodexCliProcess";

vi.mock("node:child_process", () => ({
  spawn: vi.fn()
}));

const mockedSpawn = vi.mocked(spawn);
const platformDescriptor = Object.getOwnPropertyDescriptor(process, "platform");

function setPlatform(platform: NodeJS.Platform): void {
  Object.defineProperty(process, "platform", {
    configurable: true,
    value: platform
  });
}

describe("spawnCodexProcess", () => {
  beforeEach(() => {
    mockedSpawn.mockReturnValue({} as never);
  });

  afterEach(() => {
    mockedSpawn.mockReset();

    if (platformDescriptor) {
      Object.defineProperty(process, "platform", platformDescriptor);
    }
  });

  it("spawns codex directly on non-Windows platforms", () => {
    setPlatform("linux");

    spawnCodexProcess(["--task", "demo"], "C:\\repo");

    expect(mockedSpawn).toHaveBeenCalledWith("codex", ["--task", "demo"], {
      cwd: "C:\\repo",
      stdio: "pipe"
    });
  });

  it("enables shell resolution on Windows installs", () => {
    setPlatform("win32");

    spawnCodexProcess(["--task", "demo"], "C:\\repo");

    expect(mockedSpawn).toHaveBeenCalledWith("codex", ["--task", "demo"], {
      cwd: "C:\\repo",
      shell: true,
      stdio: "pipe"
    });
  });
});
