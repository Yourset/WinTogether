import { describe, expect, it } from "vitest";
import { EventBus } from "../../src/runtime/core/EventBus";
import { MissionOrchestrator } from "../../src/runtime/core/MissionOrchestrator";

describe("MissionOrchestrator", () => {
  it("emits mission.created and agent.spawned in order when a mission starts", async () => {
    const bus = new EventBus();
    const events: string[] = [];

    bus.subscribe("mission.created", (event) => {
      events.push(event.type);
    });

    bus.subscribe("agent.spawned", (event) => {
      events.push(event.type);
    });

    const orchestrator = new MissionOrchestrator(bus);

    await orchestrator.startMission({
      goal: "Build the Team Room foundation",
      workspacePath: "D:/development/WinTogether2"
    });

    expect(events).toEqual(["mission.created", "agent.spawned"]);
  });
});
