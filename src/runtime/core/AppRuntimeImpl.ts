import { EventBus } from "./EventBus";
import { MissionOrchestrator, type StartMissionInput, type StartMissionResult } from "./MissionOrchestrator";
import { TranscriptStore } from "./TranscriptStore";
import { WorkspaceManager } from "./WorkspaceManager";
import type { AppRuntime } from "./AppRuntime";

interface AppRuntimeDependencies {
  eventBus: EventBus;
  missionOrchestrator: MissionOrchestrator;
  workspaceManager: WorkspaceManager;
  transcriptStore: TranscriptStore;
}

export class AppRuntimeImpl implements AppRuntime {
  readonly eventBus: EventBus;
  readonly missionOrchestrator: MissionOrchestrator;
  readonly workspaceManager: WorkspaceManager;
  readonly transcriptStore: TranscriptStore;

  constructor(rootPath: string, dependencies: Partial<AppRuntimeDependencies> = {}) {
    this.eventBus = dependencies.eventBus ?? new EventBus();
    this.workspaceManager = dependencies.workspaceManager ?? new WorkspaceManager(rootPath);
    this.transcriptStore = dependencies.transcriptStore ?? new TranscriptStore(rootPath);
    this.missionOrchestrator =
      dependencies.missionOrchestrator ?? new MissionOrchestrator(this.eventBus);
  }

  async startMission(input: StartMissionInput): Promise<StartMissionResult> {
    const workspacePath = this.workspaceManager.normalizeWorkspacePath(input.workspacePath);
    const result = await this.missionOrchestrator.startMission({
      goal: input.goal,
      workspacePath
    });

    await this.transcriptStore.appendEntry({
      missionId: result.mission.id,
      message: `Started mission: ${result.mission.goal}`
    });

    return result;
  }
}
