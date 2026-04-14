import { describe, expect, it } from "vitest";
import { EventBus } from "../../src/runtime/core/EventBus";
import { AppRuntimeImpl } from "../../src/runtime/core/AppRuntimeImpl";
import { MissionOrchestrator } from "../../src/runtime/core/MissionOrchestrator";
import { TranscriptStore, type TranscriptEntry } from "../../src/runtime/core/TranscriptStore";

class FailingTranscriptStore extends TranscriptStore {
  override async appendEntry(_entry: TranscriptEntry) {
    throw new Error("disk full");
  }
}

describe("AppRuntimeImpl", () => {
  it("returns mission start success even if transcript persistence fails", async () => {
    const bus = new EventBus();
    const missionOrchestrator = new MissionOrchestrator(bus);
    const runtime = new AppRuntimeImpl("D:/development/WinTogether2", {
      missionOrchestrator,
      transcriptStore: new FailingTranscriptStore("D:/development/WinTogether2")
    });

    const result = await runtime.startMission({
      goal: "Build the Team Room foundation",
      workspacePath: "D:/development/WinTogether2"
    });

    expect(result.persistence.transcript.status).toBe("failed");
    expect(result.mission.goal).toBe("Build the Team Room foundation");
  });

  it("shares the mission orchestrator event bus", () => {
    const bus = new EventBus();
    const runtime = new AppRuntimeImpl("D:/development/WinTogether2", {
      missionOrchestrator: new MissionOrchestrator(bus)
    });

    expect(runtime.eventBus).toBe(bus);
    expect(runtime.eventBus).toBe(runtime.missionOrchestrator.eventBus);
  });
});
