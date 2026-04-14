import type { AgentRuntimeAdapter, BuildTaskPromptInput } from "./AgentRuntimeAdapter";

export class CodexCliAdapter implements AgentRuntimeAdapter {
  buildTaskPrompt(input: BuildTaskPromptInput): string {
    return [
      "Mission Goal:",
      input.missionGoal,
      "",
      "Agent Role:",
      input.agentRole,
      "",
      "Scope:",
      input.scope
    ].join("\n");
  }
}
