export interface MissionCreatedEventPayload {
  mission: MissionRecord;
}

export interface MissionRecord {
  id: string;
  title: string;
  workspacePath: string;
  goal: string;
  status: "draft" | "running" | "paused" | "done";
  createdAt: string;
}
