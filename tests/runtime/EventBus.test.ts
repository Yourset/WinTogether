import { describe, expect, it } from "vitest";
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
});
