import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { WorkspaceManager } from "../../src/runtime/core/WorkspaceManager";

describe("WorkspaceManager", () => {
  it("normalizes equivalent workspace paths to the same resolved path", () => {
    const manager = new WorkspaceManager("D:/development/WinTogether2");
    const expected = resolve("D:/development/WinTogether2");

    expect(manager.normalizeWorkspacePath("D:/development/WinTogether2/")).toBe(expected);
    expect(manager.normalizeWorkspacePath("D:\\development\\WinTogether2\\./")).toBe(expected);
  });
});
