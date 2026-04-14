import { mkdtemp, readFile, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { MemoryManager } from "../../src/runtime/core/MemoryManager";

describe("MemoryManager", () => {
  it("creates the base memory structure and appends to the work log", async () => {
    const rootPath = await mkdtemp(join(tmpdir(), "memory-manager-"));
    const memoryManager = new MemoryManager(rootPath);

    await memoryManager.ensureBaseStructure();
    await memoryManager.appendWorkLog("task 3 started");

    await expect(stat(join(rootPath, "WIN_MEMORY", "INDEX.md"))).resolves.toBeTruthy();

    const workLog = await readFile(join(rootPath, "WIN_MEMORY", "work-log", "current.md"), "utf8");
    expect(workLog.trimEnd().split(/\r?\n/)).toEqual([
      "# Current Work Log",
      "",
      "## Entries",
      "",
      "- Initialized work log.",
      "- task 3 started"
    ]);
  });
});
