import type {
  AgentMessageEventPayload,
  AgentSpawnedEventPayload
} from "./agent";
import type {
  MissionCreatedEventPayload
} from "./mission";
import type {
  MemoryWrittenEventPayload
} from "./memory";

export interface ExecutionStartedEventPayload {
  executionId: string;
  missionId: string;
}

export interface ExecutionFinishedEventPayload {
  executionId: string;
  missionId: string;
  status: "success" | "failed";
}

export interface SystemAlertEventPayload {
  message: string;
  severity: "info" | "warning" | "error";
}

export interface AppEventMap {
  "mission.created": MissionCreatedEventPayload;
  "agent.spawned": AgentSpawnedEventPayload;
  "agent.message": AgentMessageEventPayload;
  "execution.started": ExecutionStartedEventPayload;
  "execution.finished": ExecutionFinishedEventPayload;
  "memory.written": MemoryWrittenEventPayload;
  "system.alert": SystemAlertEventPayload;
}

export type AppEventType = keyof AppEventMap;

export interface AppEventBase<TType extends AppEventType, TPayload> {
  id: string;
  type: TType;
  timestamp: string;
  payload: TPayload;
}

export type AppEvent<TType extends AppEventType = AppEventType> = {
  [K in TType]: AppEventBase<K, AppEventMap[K]>;
}[TType];

export type AppEventHandler<TType extends AppEventType> = (event: AppEvent<TType>) => void;
