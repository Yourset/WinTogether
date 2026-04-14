export type AppEventType =
  | "mission.created"
  | "agent.spawned"
  | "agent.message"
  | "execution.started"
  | "execution.finished"
  | "memory.written"
  | "system.alert";

export interface AppEvent<TPayload = unknown> {
  id: string;
  type: AppEventType;
  timestamp: string;
  payload: TPayload;
}
