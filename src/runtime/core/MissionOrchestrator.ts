import type { AgentRecord, AgentRole } from "../../shared/contracts/agent";
import type { MissionRecord } from "../../shared/contracts/mission";
import type { MissionTeamMemberRecord, MissionTeamRecord } from "../../shared/contracts/team";
import type { TeamTemplate } from "../../shared/contracts/teamTemplate";
import { EventBus } from "./EventBus";
import { loadDefaultTeamTemplate } from "./TeamTemplateLoader";
import { createId } from "../utils/id";
import { nowIso } from "../utils/time";

export interface StartMissionInput {
  goal: string;
  workspacePath: string;
}

export interface StartMissionResult {
  mission: MissionRecord;
  captain: AgentRecord;
  team: MissionTeamRecord;
}

interface MissionOrchestratorDependencies {
  teamTemplateLoader?: () => Promise<TeamTemplate>;
}

export class MissionOrchestrator {
  private readonly teamTemplateLoader: () => Promise<TeamTemplate>;

  constructor(public readonly eventBus: EventBus, dependencies: MissionOrchestratorDependencies = {}) {
    this.teamTemplateLoader = dependencies.teamTemplateLoader ?? loadDefaultTeamTemplate;
  }

  async startMission(input: StartMissionInput): Promise<StartMissionResult> {
    const timestamp = nowIso();
    const template = await this.teamTemplateLoader();
    const team = this.createTeamFromTemplate(template);
    const captainMember = team.members.find((member) => member.primary) ?? team.members[0];

    if (!captainMember) {
      throw new Error(`Team template ${template.id} does not define a captain`);
    }

    const mission: MissionRecord = {
      id: createId("mission"),
      title: input.goal,
      goal: input.goal,
      workspacePath: input.workspacePath,
      status: "draft",
      createdAt: timestamp
    };

    this.eventBus.publish({
      id: createId("event"),
      type: "mission.created",
      timestamp,
      payload: { mission }
    });

    for (const member of team.members) {
      this.eventBus.publish({
        id: createId("event"),
        type: "agent.spawned",
        timestamp: nowIso(),
        payload: { agent: member.agent, missionId: mission.id }
      });
    }

    this.eventBus.publish({
      id: createId("event"),
      type: "agent.message",
      timestamp: nowIso(),
      payload: {
        agentId: captainMember.agent.id,
        missionId: mission.id,
        text: "captain.planning"
      }
    });

    const researcher = team.members.find((member) => member.role === "researcher");
    if (researcher) {
      this.eventBus.publish({
        id: createId("event"),
        type: "agent.message",
        timestamp: nowIso(),
        payload: {
          agentId: researcher.agent.id,
          missionId: mission.id,
          text: "researcher.context"
        }
      });
    }

    const builder = team.members.find((member) => member.role === "builder");
    if (builder) {
      this.eventBus.publish({
        id: createId("event"),
        type: "agent.message",
        timestamp: nowIso(),
        payload: {
          agentId: builder.agent.id,
          missionId: mission.id,
          text: "builder.ready"
        }
      });
    }

    this.eventBus.publish({
      id: createId("event"),
      type: "agent.message",
      timestamp: nowIso(),
      payload: {
        agentId: captainMember.agent.id,
        missionId: mission.id,
        text: "captain.summary"
      }
    });

    return { mission, captain: captainMember.agent, team };
  }

  publishCaptainMessage(missionId: string, captainId: string, text: string) {
    this.eventBus.publish({
      id: createId("event"),
      type: "agent.message",
      timestamp: nowIso(),
      payload: {
        agentId: captainId,
        missionId,
        text
      }
    });
  }

  private createTeamFromTemplate(template: TeamTemplate): MissionTeamRecord {
    const members = template.members.map((templateMember) => this.createTeamMember(templateMember));

    return {
      template: {
        id: template.id,
        name: template.name,
        summary: template.summary,
        allowsDynamicExpansion: template.allowsDynamicExpansion
      },
      members
    };
  }

  private createTeamMember(templateMember: TeamTemplate["members"][number]): MissionTeamMemberRecord {
    return {
      templateMemberId: templateMember.id,
      role: templateMember.role,
      displayName: templateMember.displayName,
      description: templateMember.description,
      primary: templateMember.primary,
      agent: {
        id: createId("agent"),
        role: templateMember.role,
        name: templateMember.displayName,
        status: this.getInitialAgentStatus(templateMember.role, templateMember.primary)
      }
    };
  }

  private getInitialAgentStatus(role: AgentRole, primary: boolean): AgentRecord["status"] {
    if (primary) {
      return "planning";
    }

    if (role === "researcher" || role === "builder") {
      return "running";
    }

    return "idle";
  }
}
