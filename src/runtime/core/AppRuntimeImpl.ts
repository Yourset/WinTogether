import { CodexCliAdapter } from "../adapters/CodexCliAdapter";
import type { AppEvent } from "../../shared/contracts/events";
import { EventBus } from "./EventBus";
import { MemoryManager } from "./MemoryManager";
import { MissionOrchestrator, type StartMissionInput, type StartMissionResult } from "./MissionOrchestrator";
import { TranscriptStore, type RecentMissionRecord } from "./TranscriptStore";
import { WorkspaceManager } from "./WorkspaceManager";
import type {
  AppMemoryOverview,
  AppRuntime,
  AppRuntimeMissionStartResult,
  AppRuntimeStatus
} from "./AppRuntime";

interface AppRuntimeDependencies {
  codexCliAdapter: CodexCliAdapter;
  memoryManager: MemoryManager;
  missionOrchestrator: MissionOrchestrator;
  workspaceManager: WorkspaceManager;
  transcriptStore: TranscriptStore;
}

export class AppRuntimeImpl implements AppRuntime {
  readonly codexCliAdapter: CodexCliAdapter;
  readonly memoryManager: MemoryManager;
  readonly missionOrchestrator: MissionOrchestrator;
  readonly workspaceManager: WorkspaceManager;
  readonly transcriptStore: TranscriptStore;

  constructor(rootPath: string, dependencies: Partial<AppRuntimeDependencies> = {}) {
    this.codexCliAdapter = dependencies.codexCliAdapter ?? new CodexCliAdapter();
    this.memoryManager = dependencies.memoryManager ?? new MemoryManager(rootPath);
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
    const cliResult = await this.codexCliAdapter.runSmokePrompt(
      workspacePath,
      this.buildCaptainPrompt(input.goal)
    );

    this.missionOrchestrator.publishCaptainMessage(
      result.mission.id,
      result.captain.id,
      cliResult.status === "success" ? cliResult.message : `cli.error:${cliResult.message}`
    );

    const transcriptStatus = await this.persistMissionStart(result).catch(() => "failed" as const);

    return {
      ...result,
      events: this.eventBus.getEvents().filter((event) => this.belongsToMission(event, result.mission.id)),
      persistence: {
        transcript: {
          status: transcriptStatus
        }
      }
    };
  }

  async getRecentMissions(): Promise<RecentMissionRecord[]> {
    return this.transcriptStore.listRecentMissions();
  }

  async getRuntimeStatus(): Promise<AppRuntimeStatus> {
    return {
      codexCli: await this.codexCliAdapter.checkHealth(this.workspaceManager.getRootPath())
    };
  }

  async runCodexSmokeTest(prompt = 'Reply with a short "Codex CLI is working." message.'): Promise<{
    status: "success" | "error";
    message: string;
    rawOutput: string;
  }> {
    return this.codexCliAdapter.runSmokePrompt(this.workspaceManager.getRootPath(), prompt);
  }

  async getMemoryOverview(): Promise<AppMemoryOverview> {
    return this.memoryManager.readOverview();
  }

  private async persistMissionStart(result: StartMissionResult) {
    await this.transcriptStore.appendEntry({
      missionId: result.mission.id,
      mission: result.mission,
      message: `Started mission: ${result.mission.goal} with ${result.team.template.name}`,
      timestamp: result.mission.createdAt
    });

    return "written" as const;
  }

  private belongsToMission(event: AppEvent, missionId: string) {
    if (event.type === "mission.created") {
      return event.payload.mission.id === missionId;
    }

    if ("missionId" in event.payload) {
      return event.payload.missionId === missionId;
    }

    return false;
  }

  private buildCaptainPrompt(goal: string) {
    return [
      "You are Captain inside Win Together.",
      `The user goal is: ${goal}`,
      "Reply with a short first-step plan in plain text.",
      "Do not use bullet points."
    ].join(" ");
  }
}
