export interface BuildTaskPromptInput {
  missionGoal: string;
  agentRole: string;
  scope: string;
}

export interface AgentRuntimeAdapter {
  buildTaskPrompt(input: BuildTaskPromptInput): string;
}
