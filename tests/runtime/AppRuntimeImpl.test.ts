import { describe, expect, it } from "vitest";
import { EventBus } from "../../src/runtime/core/EventBus";
import { AppRuntimeImpl } from "../../src/runtime/core/AppRuntimeImpl";
import { MissionOrchestrator } from "../../src/runtime/core/MissionOrchestrator";
import { TranscriptStore, type TranscriptEntry } from "../../src/runtime/core/TranscriptStore";
import { CodexCliAdapter } from "../../src/runtime/adapters/CodexCliAdapter";

class FailingTranscriptStore extends TranscriptStore {
  override async appendEntry(_entry: TranscriptEntry) {
    throw new Error("disk full");
  }
}

const smokeTestAdapter = {
  buildTaskPrompt: () => "",
  checkHealth: async () => ({
    status: "ready" as const,
    message: "codex 1.2.3"
  }),
  runSmokePrompt: async () => ({
    status: "success" as const,
    message: "Codex CLI is working.",
    rawOutput: "Codex CLI is working."
  })
} as unknown as CodexCliAdapter;

describe("AppRuntimeImpl", () => {
  it("returns mission start success even if transcript persistence fails", async () => {
    const bus = new EventBus();
    const missionOrchestrator = new MissionOrchestrator(bus, {
      teamTemplateLoader: async () => ({
        id: "default-software-team",
        name: "Default Software Team",
        summary: "A small software delivery team with a Captain and four specialist roles.",
        allowsDynamicExpansion: true,
        members: [
          {
            id: "captain",
            role: "captain" as const,
            displayName: "Captain",
            description: "Owns direction, scope, and coordination.",
            primary: true
          },
          {
            id: "researcher",
            role: "researcher" as const,
            displayName: "Researcher",
            description: "Clarifies requirements and gathers context.",
            primary: false
          },
          {
            id: "builder",
            role: "builder" as const,
            displayName: "Builder",
            description: "Implements the requested change.",
            primary: false
          },
          {
            id: "reviewer",
            role: "reviewer" as const,
            displayName: "Reviewer",
            description: "Checks quality, risks, and regressions.",
            primary: false
          },
          {
            id: "tester",
            role: "tester" as const,
            displayName: "Tester",
            description: "Verifies behavior from the user perspective.",
            primary: false
          }
        ]
      })
    });
    const runtime = new AppRuntimeImpl("D:/development/WinTogether2", {
      missionOrchestrator,
      transcriptStore: new FailingTranscriptStore("D:/development/WinTogether2"),
      codexCliAdapter: smokeTestAdapter
    });

    const result = await runtime.startMission({
      goal: "Build the Team Room foundation",
      workspacePath: "D:/development/WinTogether2"
    });

    expect(result.persistence.transcript.status).toBe("failed");
    expect(result.mission.goal).toBe("Build the Team Room foundation");
    expect(result.team.members).toHaveLength(5);
    expect(result.team.members[0]?.displayName).toBe("Captain");
  });

  it("shares the mission orchestrator event bus", () => {
    const bus = new EventBus();
    const runtime = new AppRuntimeImpl("D:/development/WinTogether2", {
      missionOrchestrator: new MissionOrchestrator(bus, {
        teamTemplateLoader: async () => ({
          id: "default-software-team",
          name: "Default Software Team",
          summary: "A small software delivery team with a Captain and four specialist roles.",
          allowsDynamicExpansion: true,
          members: []
        })
      }),
      codexCliAdapter: smokeTestAdapter
    });

    expect(runtime.eventBus).toBe(bus);
    expect(runtime.eventBus).toBe(runtime.missionOrchestrator.eventBus);
  });

  it("runs the standalone Codex smoke test through the adapter", async () => {
    const runtime = new AppRuntimeImpl("D:/development/WinTogether2", {
      codexCliAdapter: smokeTestAdapter
    });

    await expect(runtime.runCodexSmokeTest?.("Say hello")).resolves.toEqual({
      status: "success",
      message: "Codex CLI is working.",
      rawOutput: "Codex CLI is working."
    });
  });
});
