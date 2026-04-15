import type { AgentRecord } from "./agent";
import type { TeamTemplate } from "./teamTemplate";

export interface MissionTeamMemberRecord {
  templateMemberId: string;
  role: AgentRecord["role"];
  displayName: string;
  description: string;
  primary: boolean;
  agent: AgentRecord;
}

export interface MissionTeamRecord {
  template: Pick<TeamTemplate, "id" | "name" | "summary" | "allowsDynamicExpansion">;
  members: MissionTeamMemberRecord[];
}
