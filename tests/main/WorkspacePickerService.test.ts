import { describe, expect, it } from "vitest";

import { WorkspacePickerService } from "../../src/main/services/workspace/WorkspacePickerService";

describe("WorkspacePickerService", () => {
  it("returns the configured fallback workspace path when no override is provided", () => {
    const service = new WorkspacePickerService("D:/development/WinTogether2/.worktrees/feature-v1-foundation");

    expect(service.getDefaultWorkspacePath()).toBe("D:/development/WinTogether2/.worktrees/feature-v1-foundation");
    expect(service.resolveWorkspacePath()).toBe("D:/development/WinTogether2/.worktrees/feature-v1-foundation");
  });

  it("resolves relative workspace overrides against the configured fallback workspace path", () => {
    const service = new WorkspacePickerService("D:/development/WinTogether2");

    expect(service.resolveWorkspacePath("./apps/team-room")).toBe("D:\\development\\WinTogether2\\apps\\team-room");
  });
});
