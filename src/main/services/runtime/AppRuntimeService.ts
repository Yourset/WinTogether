import { MemoryManager } from "../../../runtime/core/MemoryManager";
import type {
  AppMemoryOverview,
  AppRuntime,
  AppRuntimeMissionStartResult,
  AppRuntimeStatus
} from "../../../runtime/core/AppRuntime";
import type { RecentMissionRecord } from "../../../runtime/core/TranscriptStore";
import type { RuntimeStartMissionRequest } from "../../ipc/channels/runtimeChannels";
import type { WorkspacePickerService } from "../workspace/WorkspacePickerService";

interface AppRuntimeServiceOptions {
  rootPath: string;
  runtime: AppRuntime;
  workspacePickerService: WorkspacePickerService;
  memoryManager?: MemoryManager;
}

export class AppRuntimeService {
  private readonly memoryManager: MemoryManager;

  constructor(private readonly options: AppRuntimeServiceOptions) {
    this.memoryManager = options.memoryManager ?? new MemoryManager(options.rootPath);
  }

  async startMission(input: RuntimeStartMissionRequest): Promise<AppRuntimeMissionStartResult> {
    const goal = input.goal.trim();
    if (!goal) {
      throw new Error("Mission goal is required");
    }

    const workspacePath = this.options.workspacePickerService.resolveWorkspacePath(input.workspacePath);
    const result = await this.options.runtime.startMission({
      goal,
      workspacePath
    });

    await this.memoryManager.appendWorkLog(
      `Mission started: ${result.mission.goal} (${result.mission.id}) by ${result.captain.name} in ${workspacePath}`
    );

    return result;
  }

  async getRecentMissions(): Promise<RecentMissionRecord[]> {
    return this.options.runtime.getRecentMissions?.() ?? [];
  }

  async getRuntimeStatus(): Promise<AppRuntimeStatus> {
    return (
      (await this.options.runtime.getRuntimeStatus?.()) ?? {
        codexCli: {
          status: "unavailable",
          message: "Codex CLI status unavailable"
        }
      }
    );
  }

  async getMemoryOverview(): Promise<AppMemoryOverview> {
    return this.memoryManager.readOverview();
  }
}
