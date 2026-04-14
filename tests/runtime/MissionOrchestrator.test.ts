import { describe, expect, it } from "vitest";
import { EventBus } from "../../src/runtime/core/EventBus";
import { MissionOrchestrator } from "../../src/runtime/core/MissionOrchestrator";

describe("MissionOrchestrator", () => {
  it("emits mission.created and agent.spawned in order when a mission starts", async () => {
    const bus = new EventBus();
    const events: Array<{ type: string; missionId?: string }> = [];

    bus.subscribe("mission.created", (event) => {
      events.push({ type: event.type, missionId: event.payload.mission.id });
    });

    bus.subscribe("agent.spawned", (event) => {
      events.push({ type: event.type, missionId: event.payload.missionId });
    });

    const orchestrator = new MissionOrchestrator(bus);

    await orchestrator.startMission({
      goal: "Build the Team Room foundation",
      workspacePath: "D:/development/WinTogether2"
    });

    expect(events).toEqual([
      { type: "mission.created", missionId: expect.any(String) },
      { type: "agent.spawned", missionId: expect.any(String) }
    ]);
    expect(events[0]?.missionId).toBe(events[1]?.missionId);
  });
});
