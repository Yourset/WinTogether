import type { AgentRole } from "./agent";

export interface TeamTemplateMember {
  id: string;
  role: AgentRole;
  displayName: string;
  description: string;
  primary: boolean;
}

export interface TeamTemplate {
  id: string;
  name: string;
  summary: string;
  allowsDynamicExpansion: boolean;
  members: TeamTemplateMember[];
}
