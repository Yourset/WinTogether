import { describe, expect, it } from "vitest";
import { CodexCliAdapter } from "../../src/runtime/adapters/CodexCliAdapter";

describe("CodexCliAdapter", () => {
  it("buildTaskPrompt includes the mission goal and scope", () => {
    const adapter = new CodexCliAdapter();

    const prompt = adapter.buildTaskPrompt({
      missionGoal: "Build the foundation runtime",
      scope: "Only create the adapter skeleton and prompt builder."
    });

    expect(prompt).toContain("Build the foundation runtime");
    expect(prompt).toContain("Only create the adapter skeleton and prompt builder.");
  });
});
