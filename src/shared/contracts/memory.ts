export interface MemoryWrittenEventPayload {
  memory: MemoryWriteRecord;
}

export type MemoryScope = "user" | "team" | "mission" | "workspace" | "knowledge" | "work-log";

export interface MemoryWriteRecord {
  id: string;
  scope: MemoryScope;
  targetPath: string;
  summary: string;
  sourceEventId?: string;
}
