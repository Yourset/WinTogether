import { describe, expect, it, vi } from "vitest";
import { EventBus } from "../../src/runtime/core/EventBus";

describe("EventBus", () => {
  it("delivers published agent.message events to subscribers", () => {
    const bus = new EventBus();
    const received: Array<{ type: string; payload: { text: string } }> = [];

    bus.subscribe("agent.message", (event) => {
      received.push(event);
    });

    bus.publish({
      id: "evt-1",
      type: "agent.message",
      timestamp: "2026-04-14T00:00:00.000Z",
      payload: { text: "hello" }
    });

    expect(received).toEqual([
      {
        id: "evt-1",
        type: "agent.message",
        timestamp: "2026-04-14T00:00:00.000Z",
        payload: { text: "hello" }
      }
    ]);
  });

  it("continues delivering later listeners when one listener throws", () => {
    const bus = new EventBus();
    const received: string[] = [];
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    try {
      bus.subscribe("agent.message", () => {
        throw new Error("boom");
      });

      bus.subscribe("agent.message", (event) => {
        received.push(event.payload.text);
      });

      bus.publish({
        id: "evt-2",
        type: "agent.message",
        timestamp: "2026-04-14T00:00:00.000Z",
        payload: { text: "still delivered" }
      });

      expect(received).toEqual(["still delivered"]);
      expect(consoleError).toHaveBeenCalledTimes(1);
    } finally {
      consoleError.mockRestore();
    }
  });

  it("preserves event-specific payload types for subscribers", () => {
    const bus = new EventBus();

    bus.subscribe("mission.created", (event) => {
      const missionId: string = event.payload.mission.id;
      const missionGoal: string = event.payload.mission.goal;
      const missionStatus: "draft" | "running" | "paused" | "done" = event.payload.mission.status;

      expect(missionId).toBeTypeOf("string");
      expect(missionGoal).toBeTypeOf("string");
      expect(missionStatus).toBe("draft");
      // @ts-expect-error mission.created payload does not expose agent data
      event.payload.agent;
    });

    bus.publish({
      id: "evt-3",
      type: "mission.created",
      timestamp: "2026-04-14T00:00:00.000Z",
      payload: {
        mission: {
          id: "mission-1",
          title: "Build the foundation",
          workspacePath: "D:/development/WinTogether2",
          goal: "Build the foundation",
          status: "draft",
          createdAt: "2026-04-14T00:00:00.000Z"
        }
      }
    });
  });
});
