import { EventBus } from "./EventBus";
import { MissionOrchestrator, type StartMissionInput, type StartMissionResult } from "./MissionOrchestrator";
import { TranscriptStore } from "./TranscriptStore";
import { WorkspaceManager } from "./WorkspaceManager";
import type { AppRuntime, AppRuntimeMissionStartResult } from "./AppRuntime";

interface AppRuntimeDependencies {
  missionOrchestrator: MissionOrchestrator;
  workspaceManager: WorkspaceManager;
  transcriptStore: TranscriptStore;
}

export class AppRuntimeImpl implements AppRuntime {
  readonly missionOrchestrator: MissionOrchestrator;
  readonly workspaceManager: WorkspaceManager;
  readonly transcriptStore: TranscriptStore;

  constructor(rootPath: string, dependencies: Partial<AppRuntimeDependencies> = {}) {
    this.workspaceManager = dependencies.workspaceManager ?? new WorkspaceManager(rootPath);
    this.transcriptStore = dependencies.transcriptStore ?? new TranscriptStore(rootPath);
    this.missionOrchestrator =
      dependencies.missionOrchestrator ?? new MissionOrchestrator(new EventBus());
  }

  get eventBus() {
    return this.missionOrchestrator.eventBus;
  }

  async startMission(input: StartMissionInput): Promise<AppRuntimeMissionStartResult> {
    const workspacePath = this.workspaceManager.normalizeWorkspacePath(input.workspacePath);
    const result = await this.missionOrchestrator.startMission({
      goal: input.goal,
      workspacePath
    });

    const transcriptStatus = await this.persistMissionStart(result).catch(() => "failed" as const);

    return {
      ...result,
      persistence: {
        transcript: {
          status: transcriptStatus
        }
      }
    };
  }

  private async persistMissionStart(result: StartMissionResult) {
    await this.transcriptStore.appendEntry({
      missionId: result.mission.id,
      message: `Started mission: ${result.mission.goal}`
    });

    return "written" as const;
  }
}
