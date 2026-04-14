import type { AppEvent } from "../../../src/shared/contracts/events";
import type { AgentRecord } from "../../../src/shared/contracts/agent";
import type { MissionRecord } from "../../../src/shared/contracts/mission";
import type {
  CodexSmokeTestResult,
  MemoryOverview,
  RecentMissionRecord,
  RuntimeStatus,
  StartMissionInput,
  StartMissionResult,
  WinTogetherApi
} from "../../../src/renderer/store/appStore";

type BrowserBridgeTarget = Window & {
  winTogether?: WinTogetherApi;
};

type BrowserBridgeOptions = {
  defaultWorkspacePath?: string;
};

function nowIso() {
  return new Date().toISOString();
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function createMission(goal: string, workspacePath: string): MissionRecord {
  const createdAt = nowIso();

  return {
    id: makeId("mission"),
    title: goal,
    workspacePath,
    goal,
    status: "running",
    createdAt
  };
}

function createCaptain(): AgentRecord {
  return {
    id: makeId("agent"),
    role: "captain",
    name: "Browser Captain",
    status: "planning"
  };
}

function formatSummary(goal: string) {
  return `Browser Captain summarized the first pass for "${goal}".`;
}

function createMissionEvents(mission: MissionRecord, captain: AgentRecord): AppEvent[] {
  const createdAt = mission.createdAt;
  const responseText = "Browser Captain is ready to coordinate the first mission.";
  const executionId = makeId("execution");
  const memoryEventId = makeId("event");

  return [
    {
      id: makeId("event"),
      type: "mission.created",
      timestamp: createdAt,
      payload: {
        mission
      }
    },
    {
      id: makeId("event"),
      type: "agent.spawned",
      timestamp: createdAt,
      payload: {
        agent: captain,
        missionId: mission.id
      }
    },
    {
      id: makeId("event"),
      type: "execution.started",
      timestamp: createdAt,
      payload: {
        executionId,
        missionId: mission.id
      }
    },
    {
      id: makeId("event"),
      type: "agent.message",
      timestamp: createdAt,
      payload: {
        missionId: mission.id,
        agentId: captain.id,
        text: responseText
      }
    },
    {
      id: makeId("event"),
      type: "agent.message",
      timestamp: nowIso(),
      payload: {
        missionId: mission.id,
        agentId: captain.id,
        text: "captain.summary"
      }
    },
    {
      id: makeId("event"),
      type: "execution.finished",
      timestamp: nowIso(),
      payload: {
        executionId,
        missionId: mission.id,
        status: "success"
      }
    },
    {
      id: memoryEventId,
      type: "memory.written",
      timestamp: nowIso(),
      payload: {
        memory: {
          id: makeId("memory"),
          scope: "mission",
          targetPath: `WIN_MEMORY/missions/${mission.id}.json`,
          summary: `Browser bridge recorded ${mission.goal}`,
          sourceEventId: memoryEventId
        }
      }
    }
  ];
}

export function createBrowserBridge(options: BrowserBridgeOptions = {}): WinTogetherApi {
  const defaultWorkspacePath =
    options.defaultWorkspacePath ?? "D:/development/WinTogether2/.worktrees/feature-v1-foundation";
  const recentMissions: RecentMissionRecord[] = [];
  const memoryIndexContent = [
    "# Browser bridge",
    "",
    "- Mirrors the renderer bridge during pure Vite browser development.",
    "- Keeps mission flow and recent mission state available without Electron preload."
  ].join("\n");
  let workLogContent = [
    "# Browser work log",
    "",
    "- Browser bridge installed.",
    "- Ready for Playwright-driven user journey tests."
  ].join("\n");

  const runtimeStatus: RuntimeStatus = {
    codexCli: {
      status: "ready",
      message: "Browser bridge ready"
    }
  };

  return {
    getDefaultWorkspacePath: async () => defaultWorkspacePath,
    getMemoryOverview: async () => ({
      indexContent: memoryIndexContent,
      workLogContent
    }),
    getRecentMissions: async () => [...recentMissions],
    getRuntimeStatus: async () => runtimeStatus,
    runCodexSmokeTest: async (_prompt?: string): Promise<CodexSmokeTestResult> => ({
      status: "success",
      message: "Browser bridge is ready.",
      rawOutput: "Browser bridge is ready."
    }),
    startMission: async (input: StartMissionInput): Promise<StartMissionResult> => {
      const goal = input.goal.trim();
      const workspacePath = input.workspacePath?.trim() || defaultWorkspacePath;

      if (!goal) {
        throw new Error("Mission goal is required");
      }

      if (!workspacePath) {
        throw new Error("Workspace path is required");
      }

      const mission = createMission(goal, workspacePath);
      const captain = createCaptain();
      const events = createMissionEvents(mission, captain);
      const summary = formatSummary(goal);
      const updatedMission: RecentMissionRecord = {
        ...mission,
        summary,
        lastUpdatedAt: nowIso()
      };

      recentMissions.unshift(updatedMission);
      workLogContent = [
        "# Browser work log",
        "",
        "- Browser bridge installed.",
        "- Ready for Playwright-driven user journey tests.",
        "",
        `Mission started: ${mission.goal} (${mission.id})`,
        `Workspace: ${workspacePath}`,
        `Summary: ${summary}`
      ].join("\n");

      return {
        mission,
        captain: {
          ...captain,
          status: "done"
        },
        events,
        persistence: {
          transcript: {
            status: "written"
          }
        }
      };
    }
  };
}

export function installBrowserBridge(targetWindow?: BrowserBridgeTarget) {
  const resolvedWindow = targetWindow ?? (globalThis as typeof globalThis & { window?: BrowserBridgeTarget }).window;

  if (!resolvedWindow) {
    return createBrowserBridge();
  }

  if (resolvedWindow.winTogether) {
    return resolvedWindow.winTogether;
  }

  const bridge = createBrowserBridge();
  Object.defineProperty(resolvedWindow, "winTogether", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: bridge
  });

  return bridge;
}
