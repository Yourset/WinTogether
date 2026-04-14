import type { AgentRuntimeAdapter, BuildTaskPromptInput } from "./AgentRuntimeAdapter";
import { runCodexCommand, type CodexCommandResult } from "./CodexCliProcess";

export interface CodexCliHealth {
  status: "ready" | "unavailable";
  message: string;
}

interface CodexCliAdapterOptions {
  runCommand?: (args: string[], cwd: string) => Promise<CodexCommandResult>;
}

export class CodexCliAdapter implements AgentRuntimeAdapter {
  private readonly runCommand: (args: string[], cwd: string) => Promise<CodexCommandResult>;

  constructor(options: CodexCliAdapterOptions = {}) {
    this.runCommand = options.runCommand ?? runCodexCommand;
  }

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

  async checkHealth(cwd: string): Promise<CodexCliHealth> {
    try {
      const result = await this.runCommand(["--version"], cwd);
      const message = result.stdout || result.stderr || "Codex CLI is available";

      return {
        status: result.exitCode === 0 ? "ready" : "unavailable",
        message
      };
    } catch (error) {
      return {
        status: "unavailable",
        message: error instanceof Error ? error.message : "Unable to start Codex CLI"
      };
    }
  }
}
