import { describe, expect, it } from "vitest";
import { EventBus } from "../../src/runtime/core/EventBus";
import { MissionOrchestrator } from "../../src/runtime/core/MissionOrchestrator";

describe("MissionOrchestrator", () => {
  it("builds the initial team from the default template when a mission starts", async () => {
    const bus = new EventBus();
    const events: Array<{ type: string; missionId?: string; text?: string }> = [];
    const template = {
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
    };

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

    const orchestrator = new MissionOrchestrator(bus, {
      teamTemplateLoader: async () => template
    });

    const result = await orchestrator.startMission({
      goal: "Build the Team Room foundation",
      workspacePath: "D:/development/WinTogether2"
    });

    expect(result.team.template).toEqual({
      id: "default-software-team",
      name: "Default Software Team",
      summary: "A small software delivery team with a Captain and four specialist roles.",
      allowsDynamicExpansion: true
    });
    expect(result.team.members.map((member) => member.displayName)).toEqual([
      "Captain",
      "Researcher",
      "Builder",
      "Reviewer",
      "Tester"
    ]);
    expect(events).toEqual([
      { type: "mission.created", missionId: expect.any(String) },
      { type: "agent.spawned", missionId: expect.any(String) },
      { type: "agent.spawned", missionId: expect.any(String) },
      { type: "agent.spawned", missionId: expect.any(String) },
      { type: "agent.spawned", missionId: expect.any(String) },
      { type: "agent.spawned", missionId: expect.any(String) },
      { type: "agent.message", missionId: expect.any(String), text: "captain.planning" },
      {
        type: "agent.message",
        missionId: expect.any(String),
        text: "researcher.context"
      },
      {
        type: "agent.message",
        missionId: expect.any(String),
        text: "builder.ready"
      },
      { type: "agent.message", missionId: expect.any(String), text: "captain.summary" }
    ]);
    expect(events[0]?.missionId).toBe(events[1]?.missionId);
  });
});
