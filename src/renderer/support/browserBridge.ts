import type { AppEvent } from "../../shared/contracts/events";
import type { AgentRecord } from "../../shared/contracts/agent";
import type { MissionRecord } from "../../shared/contracts/mission";
import type { MissionTeamRecord } from "../../shared/contracts/team";
import type {
  CodexSmokeTestResult,
  MemoryOverview,
  RecentMissionRecord,
  RuntimeStatus,
  StartMissionInput,
  StartMissionResult,
  WinTogetherApi
} from "../store/appStore";

type BrowserBridgeTarget = Window & {
  winTogether?: WinTogetherApi;
};

export interface BrowserBridgeOptions {
  defaultWorkspacePath?: string;
  responseDelayMs?: number;
  failureMode?: "mission-start" | "smoke-test";
}

export interface BrowserBridgeActivationInput {
  mode?: string;
  search?: string;
}

function nowIso() {
  return new Date().toISOString();
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function parseDelayMs(search: string | undefined) {
  const params = new URLSearchParams(search ?? "");
  const rawDelay = params.get("bridge-delay-ms") ?? params.get("bridge-delay");
  const parsedDelay = Number.parseInt(rawDelay ?? "", 10);

  return Number.isFinite(parsedDelay) && parsedDelay > 0 ? parsedDelay : 0;
}

function parseFailureMode(search: string | undefined) {
  const params = new URLSearchParams(search ?? "");
  const rawFailureMode = params.get("bridge-error") ?? params.get("bridge-fail");

  if (rawFailureMode === "mission-start" || rawFailureMode === "smoke-test") {
    return rawFailureMode;
  }

  return undefined;
}

function wait(ms: number) {
  if (ms <= 0) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

function createTeam(): MissionTeamRecord {
  return {
    template: {
      id: "default-software-team",
      name: "Default Software Team",
      summary: "A small software delivery team with a Captain and four specialist roles.",
      allowsDynamicExpansion: true
    },
    members: [
      createTeamMember("captain", "captain", "Browser Captain", "Owns direction, scope, and coordination.", true, "planning"),
      createTeamMember(
        "researcher",
        "researcher",
        "Browser Researcher",
        "Clarifies requirements and gathers context.",
        false,
        "running"
      ),
      createTeamMember("builder", "builder", "Browser Builder", "Implements the requested change.", false, "running"),
      createTeamMember("reviewer", "reviewer", "Browser Reviewer", "Checks quality, risks, and regressions.", false, "idle"),
      createTeamMember("tester", "tester", "Browser Tester", "Verifies behavior from the user perspective.", false, "idle")
    ]
  };
}

function createTeamMember(
  templateMemberId: string,
  role: AgentRecord["role"],
  displayName: string,
  description: string,
  primary: boolean,
  status: AgentRecord["status"]
) {
  return {
    templateMemberId,
    role,
    displayName,
    description,
    primary,
    agent: {
      id: makeId("agent"),
      role,
      name: displayName,
      status
    }
  };
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

function createMissionEvents(mission: MissionRecord, team: MissionTeamRecord): AppEvent[] {
  const createdAt = mission.createdAt;
  const executionId = makeId("execution");
  const summaryEventId = makeId("event");
  const memoryEventId = makeId("event");
  const captain = team.members.find((member) => member.primary) ?? team.members[0];
  const researcher = team.members.find((member) => member.role === "researcher");
  const builder = team.members.find((member) => member.role === "builder");

  const events: AppEvent[] = [
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
      type: "execution.started",
      timestamp: createdAt,
      payload: {
        executionId,
        missionId: mission.id
      }
    }
  ];

  for (const member of team.members) {
    events.push({
      id: makeId("event"),
      type: "agent.spawned",
      timestamp: createdAt,
      payload: {
        agent: member.agent,
        missionId: mission.id
      }
    });
  }

  if (captain) {
    events.push({
      id: makeId("event"),
      type: "agent.message",
      timestamp: createdAt,
      payload: {
        missionId: mission.id,
        agentId: captain.agent.id,
        text: "captain.planning"
      }
    });
  }

  if (researcher) {
    events.push({
      id: makeId("event"),
      type: "agent.message",
      timestamp: nowIso(),
      payload: {
        missionId: mission.id,
        agentId: researcher.agent.id,
        text: "researcher.context"
      }
    });
  }

  if (builder) {
    events.push({
      id: makeId("event"),
      type: "agent.message",
      timestamp: nowIso(),
      payload: {
        missionId: mission.id,
        agentId: builder.agent.id,
        text: "builder.ready"
      }
    });
  }

  if (captain) {
    events.push({
      id: summaryEventId,
      type: "agent.message",
      timestamp: nowIso(),
      payload: {
        missionId: mission.id,
        agentId: captain.agent.id,
        text: "captain.summary"
      }
    });

    events.push({
      id: makeId("event"),
      type: "agent.message",
      timestamp: nowIso(),
      payload: {
        missionId: mission.id,
        agentId: captain.agent.id,
        text: "Browser bridge is ready."
      }
    });
  }

  events.push({
    id: makeId("event"),
    type: "execution.finished",
    timestamp: nowIso(),
    payload: {
      executionId,
      missionId: mission.id,
      status: "success"
    }
  });

  events.push({
    id: memoryEventId,
    type: "memory.written",
    timestamp: nowIso(),
    payload: {
      memory: {
        id: makeId("memory"),
        scope: "mission",
        targetPath: `WIN_MEMORY/missions/${mission.id}.json`,
        summary: `Browser bridge recorded ${mission.goal}`,
        sourceEventId: summaryEventId
      }
    }
  });

  return events;
}

function formatSummary(goal: string) {
  return `Browser Captain summarized the first pass for "${goal}".`;
}

export function shouldInstallBrowserBridge(input: BrowserBridgeActivationInput) {
  const params = new URLSearchParams(input.search ?? "");
  return input.mode === "browser" || params.get("browser") === "1" || params.get("browser-bridge") === "1";
}

export function createBrowserBridge(options: BrowserBridgeOptions = {}): WinTogetherApi {
  const defaultWorkspacePath =
    options.defaultWorkspacePath ?? "D:/development/WinTogether2/.worktrees/feature-v1-foundation";
  const responseDelayMs = options.responseDelayMs ?? 0;
  const failureMode = options.failureMode;
  const recentMissions: RecentMissionRecord[] = [];
  const memoryIndexContent = [
    "# Browser bridge",
    "",
    "- Mirrors the renderer bridge during pure Vite browser development.",
    "- Keeps mission flow, team roster state, and recent mission history available without Electron preload."
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
    runCodexSmokeTest: async (_prompt?: string): Promise<CodexSmokeTestResult> => {
      await wait(responseDelayMs);

      if (failureMode === "smoke-test") {
        throw new Error("Codex CLI smoke test failed inside browser bridge.");
      }

      return {
        status: "success",
        message: "Browser bridge is ready.",
        rawOutput: "Browser bridge is ready."
      };
    },
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
      const team = createTeam();
      const captain = team.members.find((member) => member.primary) ?? team.members[0];
      const events = createMissionEvents(mission, team);
      const summary = formatSummary(goal);
      const updatedMission: RecentMissionRecord = {
        ...mission,
        summary,
        lastUpdatedAt: nowIso()
      };

      await wait(responseDelayMs);

      if (failureMode === "mission-start") {
        throw new Error("Mission start failed inside browser bridge.");
      }

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

      if (!captain) {
        throw new Error("Browser bridge failed to assemble a captain.");
      }

      return {
        mission,
        captain: {
          ...captain.agent,
          status: "done"
        },
        team,
        recentMission: updatedMission,
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

  const bridge = createBrowserBridge({
    responseDelayMs: parseDelayMs((resolvedWindow as { location?: { search?: string } }).location?.search),
    failureMode: parseFailureMode((resolvedWindow as { location?: { search?: string } }).location?.search)
  });
  Object.defineProperty(resolvedWindow, "winTogether", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: bridge
  });

  return bridge;
}
