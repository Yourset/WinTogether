import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { AppRuntimeService } from "../../src/main/services/runtime/AppRuntimeService";
import { WorkspacePickerService } from "../../src/main/services/workspace/WorkspacePickerService";
import type { AppRuntime, AppRuntimeMissionStartResult } from "../../src/runtime/core/AppRuntime";

class FakeRuntime implements AppRuntime {
  calls: Array<{ goal: string; workspacePath: string }> = [];

  async startMission(input: { goal: string; workspacePath: string }): Promise<AppRuntimeMissionStartResult> {
    this.calls.push(input);

    return {
      mission: {
        id: "mission-123",
        title: input.goal,
        goal: input.goal,
        workspacePath: input.workspacePath,
        status: "draft",
        createdAt: "2026-04-14T12:00:00.000Z"
      },
      captain: {
        id: "agent-123",
        role: "captain",
        name: "Captain",
        status: "planning"
      },
      team: {
        template: {
          id: "default-software-team",
          name: "Default Software Team",
          summary: "A small software delivery team with a Captain and four specialist roles.",
          allowsDynamicExpansion: true
        },
        members: [
          {
            templateMemberId: "captain",
            role: "captain",
            displayName: "Captain",
            description: "Owns direction, scope, and coordination.",
            primary: true,
            agent: {
              id: "agent-123",
              role: "captain",
              name: "Captain",
              status: "planning"
            }
          }
        ]
      },
      persistence: {
        transcript: {
          status: "written"
        }
      }
    };
  }
}

describe("AppRuntimeService", () => {
  it("starts a mission with a resolved workspace path and appends a work-log entry", async () => {
    const rootPath = await mkdtemp(join(tmpdir(), "app-runtime-service-"));
    const runtime = new FakeRuntime();
    const workspacePickerService = new WorkspacePickerService(rootPath);
    const service = new AppRuntimeService({
      rootPath,
      runtime,
      workspacePickerService
    });

    const result = await service.startMission({
      goal: "  Build the Team Room loop  ",
      workspacePath: "."
    });

    expect(runtime.calls).toEqual([
      {
        goal: "Build the Team Room loop",
        workspacePath: rootPath
      }
    ]);
    expect(result.mission.id).toBe("mission-123");
    expect(result.team.template.name).toBe("Default Software Team");

    const workLog = await readFile(join(rootPath, "WIN_MEMORY", "work-log", "current.md"), "utf8");
    expect(workLog).toContain("Mission started: Build the Team Room loop");
    expect(workLog).toContain("mission-123");
    expect(workLog).toContain("Captain");
  });

  it("rejects an empty mission goal before calling the runtime", async () => {
    const rootPath = await mkdtemp(join(tmpdir(), "app-runtime-service-empty-"));
    const runtime = new FakeRuntime();
    const service = new AppRuntimeService({
      rootPath,
      runtime,
      workspacePickerService: new WorkspacePickerService(rootPath)
    });

    await expect(
      service.startMission({
        goal: "   ",
        workspacePath: rootPath
      })
    ).rejects.toThrow("Mission goal is required");

    expect(runtime.calls).toHaveLength(0);
  });
});
