import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { TranscriptStore } from "../../src/runtime/core/TranscriptStore";

describe("TranscriptStore", () => {
  it("lists recent missions in reverse chronological order", async () => {
    const rootPath = await mkdtemp(join(tmpdir(), "transcript-store-list-"));
    const store = new TranscriptStore(rootPath) as TranscriptStore & {
      listRecentMissions(limit?: number): Promise<Array<{ id: string }>>;
    };

    await store.appendEntry({
      missionId: "mission-1",
      mission: {
        id: "mission-1",
        title: "Ship the first loop",
        goal: "Ship the first loop",
        workspacePath: "D:/workspace",
        status: "draft",
        createdAt: "2026-04-14T10:00:00.000Z"
      },
      message: "Started mission: Ship the first loop",
      timestamp: "2026-04-14T10:00:00.000Z"
    });

    await store.appendEntry({
      missionId: "mission-2",
      mission: {
        id: "mission-2",
        title: "Improve onboarding",
        goal: "Improve onboarding",
        workspacePath: "D:/workspace",
        status: "draft",
        createdAt: "2026-04-14T11:00:00.000Z"
      },
      message: "Started mission: Improve onboarding",
      timestamp: "2026-04-14T11:00:00.000Z"
    });

    await expect(store.listRecentMissions()).resolves.toEqual([
      expect.objectContaining({ id: "mission-2" }),
      expect.objectContaining({ id: "mission-1" })
    ]);
  });

  it("reads a single persisted mission summary", async () => {
    const rootPath = await mkdtemp(join(tmpdir(), "transcript-store-summary-"));
    const store = new TranscriptStore(rootPath) as TranscriptStore & {
      readMissionSummary(missionId: string): Promise<{ id: string; summary?: string } | null>;
    };

    await store.appendEntry({
      missionId: "mission-7",
      mission: {
        id: "mission-7",
        title: "Login flow",
        goal: "Build the login flow",
        workspacePath: "D:/workspace",
        status: "draft",
        createdAt: "2026-04-14T12:30:00.000Z"
      },
      message: "Started mission: Build the login flow",
      timestamp: "2026-04-14T12:30:00.000Z"
    });

    await expect(store.readMissionSummary("mission-7")).resolves.toEqual(
      expect.objectContaining({
        id: "mission-7",
        summary: "Started mission: Build the login flow"
      })
    );
  });
});
