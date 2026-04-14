import type { AgentRecord } from "../../shared/contracts/agent";
import type { MissionRecord } from "../../shared/contracts/mission";
import { EventBus } from "./EventBus";
import { createId } from "../utils/id";
import { nowIso } from "../utils/time";

export interface StartMissionInput {
  goal: string;
  workspacePath: string;
}

export interface StartMissionResult {
  mission: MissionRecord;
  captain: AgentRecord;
}

export class MissionOrchestrator {
  constructor(public readonly eventBus: EventBus) {}

  async startMission(input: StartMissionInput): Promise<StartMissionResult> {
    const timestamp = nowIso();
    const mission: MissionRecord = {
      id: createId("mission"),
      title: input.goal,
      goal: input.goal,
      workspacePath: input.workspacePath,
      status: "draft",
      createdAt: timestamp
    };

    const captain: AgentRecord = {
      id: createId("agent"),
      role: "captain",
      name: "Captain",
      status: "planning"
    };

    this.eventBus.publish({
      id: createId("event"),
      type: "mission.created",
      timestamp,
      payload: { mission }
    });

    this.eventBus.publish({
      id: createId("event"),
      type: "agent.spawned",
      timestamp: nowIso(),
      payload: { agent: captain, missionId: mission.id }
    });

    this.eventBus.publish({
      id: createId("event"),
      type: "agent.message",
      timestamp: nowIso(),
      payload: {
        agentId: captain.id,
        missionId: mission.id,
        text: "captain.planning"
      }
    });

    this.eventBus.publish({
      id: createId("event"),
      type: "agent.message",
      timestamp: nowIso(),
      payload: {
        agentId: captain.id,
        missionId: mission.id,
        text: "captain.summary"
      }
    });

    return { mission, captain };
  }
}
