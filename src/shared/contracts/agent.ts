export type AgentRole = "captain" | "researcher" | "builder" | "reviewer" | "tester";

export interface AgentRecord {
  id: string;
  role: AgentRole;
  name: string;
  status: "idle" | "planning" | "running" | "blocked" | "done";
}
