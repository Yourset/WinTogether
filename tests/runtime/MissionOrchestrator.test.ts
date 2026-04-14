import { describe, expect, it } from "vitest";
import { EventBus } from "../../src/runtime/core/EventBus";
import { MissionOrchestrator } from "../../src/runtime/core/MissionOrchestrator";

describe("MissionOrchestrator", () => {
  it("emits a fuller mission event sequence when a mission starts", async () => {
    const bus = new EventBus();
    const events: Array<{ type: string; missionId?: string; text?: string }> = [];

    bus.subscribe("mission.created", (event) => {
      events.push({ type: event.type, missionId: event.payload.mission.id });
    });

    bus.subscribe("agent.spawned", (event) => {
      events.push({ type: event.type, missionId: event.payload.missionId });
    });

    bus.subscribe("agent.message", (event) => {
      events.push({
        type: event.type,
        missionId: event.payload.missionId,
        text: event.payload.text
      });
    });

    const orchestrator = new MissionOrchestrator(bus);

    await orchestrator.startMission({
      goal: "Build the Team Room foundation",
      workspacePath: "D:/development/WinTogether2"
    });

    expect(events).toEqual([
      { type: "mission.created", missionId: expect.any(String) },
      { type: "agent.spawned", missionId: expect.any(String) },
      { type: "agent.message", missionId: expect.any(String), text: "captain.planning" },
      { type: "agent.message", missionId: expect.any(String), text: "captain.summary" }
    ]);
    expect(events[0]?.missionId).toBe(events[1]?.missionId);
  });
});
