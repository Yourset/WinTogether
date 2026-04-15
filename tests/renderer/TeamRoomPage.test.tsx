// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";

import { TeamRoomPage } from "../../src/renderer/routes/TeamRoomPage";
import { useAppStore } from "../../src/renderer/store/appStore";

function createDeferredPromise<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

function LocationProbe() {
  const location = useLocation();

  return <p data-testid="location-path">{location.pathname}</p>;
}

function createTeam() {
  return {
    template: {
      id: "default-software-team",
      name: "Default Software Team",
      summary: "A small software delivery team with a Captain and four specialist roles.",
      allowsDynamicExpansion: true
    },
    members: [
      {
        templateMemberId: "captain",
        role: "captain" as const,
        displayName: "Captain",
        description: "Owns direction, scope, and coordination.",
        primary: true,
        agent: {
          id: "agent-captain",
          role: "captain" as const,
          name: "Captain",
          status: "planning" as const
        }
      },
      {
        templateMemberId: "researcher",
        role: "researcher" as const,
        displayName: "Researcher",
        description: "Clarifies requirements and gathers context.",
        primary: false,
        agent: {
          id: "agent-researcher",
          role: "researcher" as const,
          name: "Researcher",
          status: "running" as const
        }
      },
      {
        templateMemberId: "builder",
        role: "builder" as const,
        displayName: "Builder",
        description: "Implements the requested change.",
        primary: false,
        agent: {
          id: "agent-builder",
          role: "builder" as const,
          name: "Builder",
          status: "running" as const
        }
      },
      {
        templateMemberId: "reviewer",
        role: "reviewer" as const,
        displayName: "Reviewer",
        description: "Checks quality, risks, and regressions.",
        primary: false,
        agent: {
          id: "agent-reviewer",
          role: "reviewer" as const,
          name: "Reviewer",
          status: "idle" as const
        }
      },
      {
        templateMemberId: "tester",
        role: "tester" as const,
        displayName: "Tester",
        description: "Verifies behavior from the user perspective.",
        primary: false,
        agent: {
          id: "agent-tester",
          role: "tester" as const,
          name: "Tester",
          status: "idle" as const
        }
      }
    ]
  };
}

describe("TeamRoomPage", () => {
  afterEach(() => {
    cleanup();
  });

  it("shows a template-driven roster when a team is active", () => {
    useAppStore.setState({
      activeMissionId: "mission-42",
      activeTeam: createTeam(),
      timelineItems: [],
      language: "zh-CN",
      recentMissions: [],
      runtimeStatus: null,
      codexSmokeTestResult: null,
      isCodexSmokeTestRunning: false,
      currentWorkspacePath: null
    });

    Object.defineProperty(window, "winTogether", {
      configurable: true,
      value: {
        getDefaultWorkspacePath: vi.fn().mockResolvedValue("D:/development/WinTogether2/.worktrees/feature-v1-foundation"),
        runCodexSmokeTest: vi.fn(),
        startMission: vi.fn()
      }
    });

    render(
      <MemoryRouter initialEntries={["/team/mission-42"]}>
        <Routes>
          <Route path="/team/:missionId" element={<TeamRoomPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("team-room-page")).toBeTruthy();
    expect(screen.getByTestId("roster-member-captain")).toBeTruthy();
    expect(screen.getByTestId("roster-member-researcher")).toBeTruthy();
    expect(screen.getByTestId("roster-member-builder")).toBeTruthy();
    expect(screen.getByTestId("roster-member-reviewer")).toBeTruthy();
    expect(screen.getByTestId("roster-member-tester")).toBeTruthy();
    expect(useAppStore.getState().activeMissionId).toBe("mission-42");
  });

  it("starts a mission from the composer and appends template-driven updates to the timeline", async () => {
    useAppStore.setState({
      activeMissionId: null,
      activeTeam: null,
      timelineItems: [],
      language: "zh-CN",
      recentMissions: [],
      runtimeStatus: null,
      codexSmokeTestResult: null,
      isCodexSmokeTestRunning: false,
      currentWorkspacePath: null
    });
    const getDefaultWorkspacePath = vi
      .fn()
      .mockResolvedValue("D:/development/WinTogether2/.worktrees/feature-v1-foundation");
    const startMission = vi.fn().mockResolvedValue({
      mission: {
        id: "mission-123",
        title: "Ship the first loop",
        goal: "Ship the first loop",
        workspacePath: "D:/development/WinTogether2/.worktrees/feature-v1-foundation",
        status: "draft",
        createdAt: "2026-04-14T12:00:00.000Z"
      },
      captain: {
        id: "agent-captain",
        role: "captain",
        name: "Captain",
        status: "planning"
      },
      team: createTeam(),
      events: [
        {
          id: "event-1",
          type: "mission.created",
          timestamp: "2026-04-14T12:00:00.000Z",
          payload: {
            mission: {
              id: "mission-123",
              title: "Ship the first loop",
              goal: "Ship the first loop",
              workspacePath: "D:/development/WinTogether2/.worktrees/feature-v1-foundation",
              status: "draft",
              createdAt: "2026-04-14T12:00:00.000Z"
            }
          }
        },
        {
          id: "event-2",
          type: "agent.spawned",
          timestamp: "2026-04-14T12:00:01.000Z",
          payload: {
            missionId: "mission-123",
            agent: {
              id: "agent-captain",
              role: "captain",
              name: "Captain",
              status: "planning"
            }
          }
        },
        {
          id: "event-3",
          type: "agent.spawned",
          timestamp: "2026-04-14T12:00:01.100Z",
          payload: {
            missionId: "mission-123",
            agent: {
              id: "agent-researcher",
              role: "researcher",
              name: "Researcher",
              status: "running"
            }
          }
        },
        {
          id: "event-4",
          type: "agent.spawned",
          timestamp: "2026-04-14T12:00:01.200Z",
          payload: {
            missionId: "mission-123",
            agent: {
              id: "agent-builder",
              role: "builder",
              name: "Builder",
              status: "running"
            }
          }
        },
        {
          id: "event-5",
          type: "agent.message",
          timestamp: "2026-04-14T12:00:02.000Z",
          payload: {
            missionId: "mission-123",
            agentId: "agent-captain",
            text: "captain.planning"
          }
        },
        {
          id: "event-6",
          type: "agent.message",
          timestamp: "2026-04-14T12:00:02.100Z",
          payload: {
            missionId: "mission-123",
            agentId: "agent-researcher",
            text: "researcher.context"
          }
        },
        {
          id: "event-7",
          type: "agent.message",
          timestamp: "2026-04-14T12:00:02.200Z",
          payload: {
            missionId: "mission-123",
            agentId: "agent-builder",
            text: "builder.ready"
          }
        },
        {
          id: "event-8",
          type: "agent.message",
          timestamp: "2026-04-14T12:00:03.000Z",
          payload: {
            missionId: "mission-123",
            agentId: "agent-captain",
            text: "Captain will start by reviewing the workspace and outlining the first build step."
          }
        }
      ],
      persistence: {
        transcript: {
          status: "written"
        }
      }
    });

    Object.defineProperty(window, "winTogether", {
      configurable: true,
      value: {
        getDefaultWorkspacePath,
        runCodexSmokeTest: vi.fn(),
        startMission
      }
    });

    render(
      <MemoryRouter initialEntries={["/team/draft"]}>
        <LocationProbe />
        <Routes>
          <Route path="/team/:missionId" element={<TeamRoomPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect((screen.getByLabelText("工作区路径") as HTMLInputElement).value).toBe(
        "D:/development/WinTogether2/.worktrees/feature-v1-foundation"
      );
    });

    fireEvent.change(screen.getByPlaceholderText("告诉 Captain 你的目标..."), {
      target: { value: "Ship the first loop" }
    });
    fireEvent.click(screen.getByRole("button", { name: "开始执行" }));

    await waitFor(() => {
      expect(startMission).toHaveBeenCalledWith({
        goal: "Ship the first loop",
        workspacePath: "D:/development/WinTogether2/.worktrees/feature-v1-foundation"
      });
    });

    expect(getDefaultWorkspacePath).toHaveBeenCalledTimes(1);
    expect(await screen.findByText("任务“Ship the first loop”已启动。")).toBeTruthy();
    expect(await screen.findByText("Captain 已加入当前协作室。")).toBeTruthy();
    expect(await screen.findByText("Researcher 已加入当前协作室。")).toBeTruthy();
    expect(await screen.findByText("Builder 已加入当前协作室。")).toBeTruthy();
    expect(
      await screen.findByText("Captain 收到 Codex CLI 的第一轮回应：Captain will start by reviewing the workspace and outlining the first build step.")
    ).toBeTruthy();
    expect(screen.getByTestId("roster-member-captain")).toBeTruthy();
    expect(screen.getByTestId("roster-member-researcher")).toBeTruthy();
    expect(screen.getByTestId("roster-member-builder")).toBeTruthy();
    expect(useAppStore.getState().activeMissionId).toBe("mission-123");
    expect(screen.getByTestId("location-path").textContent).toBe("/team/mission-123");
  });

  it("lets the tester override the workspace path before starting a mission", async () => {
    useAppStore.setState({
      activeMissionId: null,
      activeTeam: null,
      timelineItems: [],
      language: "zh-CN",
      recentMissions: [],
      runtimeStatus: null,
      codexSmokeTestResult: null,
      isCodexSmokeTestRunning: false,
      currentWorkspacePath: null
    });
    const getDefaultWorkspacePath = vi.fn().mockResolvedValue("D:/default-workspace");
    const startMission = vi.fn().mockResolvedValue({
      mission: {
        id: "mission-456",
        title: "Test override",
        goal: "Test override",
        workspacePath: "D:/manual-override",
        status: "draft",
        createdAt: "2026-04-14T12:00:00.000Z"
      },
      captain: {
        id: "agent-captain",
        role: "captain",
        name: "Captain",
        status: "planning"
      },
      team: createTeam(),
      persistence: {
        transcript: {
          status: "written"
        }
      }
    });

    Object.defineProperty(window, "winTogether", {
      configurable: true,
      value: {
        getDefaultWorkspacePath,
        runCodexSmokeTest: vi.fn(),
        startMission
      }
    });

    render(
      <MemoryRouter initialEntries={["/team/draft"]}>
        <Routes>
          <Route path="/team/:missionId" element={<TeamRoomPage />} />
        </Routes>
      </MemoryRouter>
    );

    const workspaceField = await screen.findByLabelText("工作区路径");
    fireEvent.change(workspaceField, {
      target: { value: "D:/manual-override" }
    });
    fireEvent.change(screen.getByPlaceholderText("告诉 Captain 你的目标..."), {
      target: { value: "Test override" }
    });
    fireEvent.click(screen.getByRole("button", { name: "开始执行" }));

    await waitFor(() => {
      expect(startMission).toHaveBeenCalledWith({
        goal: "Test override",
        workspacePath: "D:/manual-override"
      });
    });
  });

  it("does not let a delayed default workspace overwrite a manual workspace path", async () => {
    useAppStore.setState({
      activeMissionId: null,
      activeTeam: null,
      timelineItems: [],
      language: "zh-CN",
      recentMissions: [],
      runtimeStatus: null,
      codexSmokeTestResult: null,
      isCodexSmokeTestRunning: false,
      currentWorkspacePath: null
    });
    const deferredDefaultWorkspace = createDeferredPromise<string>();

    Object.defineProperty(window, "winTogether", {
      configurable: true,
      value: {
        getDefaultWorkspacePath: vi.fn().mockReturnValue(deferredDefaultWorkspace.promise),
        runCodexSmokeTest: vi.fn(),
        startMission: vi.fn()
      }
    });

    render(
      <MemoryRouter initialEntries={["/team/draft"]}>
        <Routes>
          <Route path="/team/:missionId" element={<TeamRoomPage />} />
        </Routes>
      </MemoryRouter>
    );

    const workspaceField = (screen.getByLabelText("工作区路径") as HTMLInputElement);
    expect(workspaceField.value).toBe("");
    expect(screen.getByText("正在读取应用默认工作区...")).toBeTruthy();

    fireEvent.change(workspaceField, {
      target: { value: "D:/manual-before-default" }
    });

    await waitFor(() => {
      expect(screen.getByText("当前使用你手动输入的工作区路径。")).toBeTruthy();
    });

    deferredDefaultWorkspace.resolve("D:/late-default");

    await waitFor(() => {
      expect(workspaceField.value).toBe("D:/manual-before-default");
    });
    expect(screen.getByText("当前使用你手动输入的工作区路径。")).toBeTruthy();
  });

  it("shows a visible error when mission start fails and keeps the tester on the draft route", async () => {
    useAppStore.setState({
      activeMissionId: null,
      activeTeam: null,
      timelineItems: [],
      language: "zh-CN",
      recentMissions: [],
      runtimeStatus: null,
      codexSmokeTestResult: null,
      isCodexSmokeTestRunning: false,
      currentWorkspacePath: null
    });
    const getDefaultWorkspacePath = vi.fn().mockResolvedValue("D:/default-workspace");
    const startMission = vi.fn().mockRejectedValue(new Error("Captain could not start the mission."));

    Object.defineProperty(window, "winTogether", {
      configurable: true,
      value: {
        getDefaultWorkspacePath,
        runCodexSmokeTest: vi.fn(),
        startMission
      }
    });

    render(
      <MemoryRouter initialEntries={["/team/draft"]}>
        <LocationProbe />
        <Routes>
          <Route path="/team/:missionId" element={<TeamRoomPage />} />
        </Routes>
      </MemoryRouter>
    );

    await screen.findByLabelText("工作区路径");
    fireEvent.change(screen.getByPlaceholderText("告诉 Captain 你的目标..."), {
      target: { value: "Trigger failure" }
    });
    fireEvent.click(screen.getByRole("button", { name: "开始执行" }));

    expect((await screen.findByRole("alert")).textContent).toContain("Captain could not start the mission.");
    expect(screen.getByTestId("location-path").textContent).toBe("/team/draft");
    expect(useAppStore.getState().activeMissionId).toBe("draft");
  });
});
