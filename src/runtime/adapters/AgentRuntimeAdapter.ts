export interface BuildTaskPromptInput {
  missionGoal: string;
  scope: string;
}

export interface AgentRuntimeAdapter {
  buildTaskPrompt(input: BuildTaskPromptInput): string;
}
