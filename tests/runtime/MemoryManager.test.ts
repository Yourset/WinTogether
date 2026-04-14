import { mkdtemp, readFile, stat, writeFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";
import { MemoryManager, resolveTemplateRoot } from "../../src/runtime/core/MemoryManager";

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

  it("rejects multiline work log entries without changing the work log", async () => {
    const rootPath = await mkdtemp(join(tmpdir(), "memory-manager-multiline-"));
    const memoryManager = new MemoryManager(rootPath);
    const workLogPath = join(rootPath, "WIN_MEMORY", "work-log", "current.md");

    await memoryManager.ensureBaseStructure();
    const before = await readFile(workLogPath, "utf8");

    await expect(memoryManager.appendWorkLog("first line\nsecond line")).rejects.toThrow(
      "Work log entries must be a single line"
    );

    const after = await readFile(workLogPath, "utf8");
    expect(after).toBe(before);
  });

  it("resolves templates from the built layout when the source layout is unavailable", async () => {
    const tempRoot = await mkdtemp(join(tmpdir(), "memory-manager-build-layout-"));
    const builtMemoryRoot = join(tempRoot, "out", "WIN_MEMORY");

    await mkdir(builtMemoryRoot, { recursive: true });
    await writeFile(join(builtMemoryRoot, "INDEX.md"), "# Memory Index\n", "utf8");

    const moduleUrl = pathToFileURL(join(tempRoot, "out", "main", "main.js")).toString();
    const resolvedRoot = await resolveTemplateRoot(moduleUrl);

    expect(resolvedRoot).toBe(builtMemoryRoot);
  });
});
