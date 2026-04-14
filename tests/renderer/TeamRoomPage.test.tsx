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

describe("TeamRoomPage", () => {
  afterEach(() => {
    cleanup();
  });

  it("shows the team room layout with timeline, agents, context, and composer", () => {
    useAppStore.setState({
      activeMissionId: null,
      timelineItems: [],
      language: "zh-CN",
      recentMissions: [],
      runtimeStatus: null,
      codexSmokeTestResult: null,
      isCodexSmokeTestRunning: false
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

    expect(screen.getByText("团队协作室")).toBeTruthy();
    expect(screen.getByText("任务 ID: mission-42")).toBeTruthy();
    expect(screen.getByText("协作时间线")).toBeTruthy();
    expect(screen.getByText("当前成员")).toBeTruthy();
    expect(screen.getByText("当前上下文")).toBeTruthy();
    expect(screen.getByPlaceholderText("告诉 Captain 你的目标...")).toBeTruthy();
    expect(useAppStore.getState().activeMissionId).toBe("mission-42");
  });

  it("starts a mission from the composer and appends captain updates to the timeline", async () => {
    useAppStore.setState({
      activeMissionId: null,
      timelineItems: [],
      language: "zh-CN",
      recentMissions: [],
      runtimeStatus: null,
      codexSmokeTestResult: null,
      isCodexSmokeTestRunning: false
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
        id: "agent-123",
        role: "captain",
        name: "Captain",
        status: "planning"
      },
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
              id: "agent-123",
              role: "captain",
              name: "Captain",
              status: "planning"
            }
          }
        },
        {
          id: "event-3",
          type: "agent.message",
          timestamp: "2026-04-14T12:00:02.000Z",
          payload: {
            missionId: "mission-123",
            agentId: "agent-123",
            text: "captain.planning"
          }
        },
        {
          id: "event-4",
          type: "agent.message",
          timestamp: "2026-04-14T12:00:03.000Z",
          payload: {
            missionId: "mission-123",
            agentId: "agent-123",
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
    expect(screen.getByText("当前使用应用提供的默认工作区；如果你想切换到别的项目，可以直接改这里。")).toBeTruthy();

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
    expect(await screen.findByText("Captain 正在为这个目标规划下一步：Ship the first loop")).toBeTruthy();
    expect(
      await screen.findByText("Captain 收到了 Codex CLI 的第一轮回应：Captain will start by reviewing the workspace and outlining the first build step.")
    ).toBeTruthy();
    expect(useAppStore.getState().activeMissionId).toBe("mission-123");
    expect(screen.getByTestId("location-path").textContent).toBe("/team/mission-123");
  });

  it("lets the tester override the workspace path before starting a mission", async () => {
    useAppStore.setState({
      activeMissionId: null,
      timelineItems: [],
      language: "zh-CN",
      recentMissions: [],
      runtimeStatus: null,
      codexSmokeTestResult: null,
      isCodexSmokeTestRunning: false
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
        id: "agent-123",
        role: "captain",
        name: "Captain",
        status: "planning"
      },
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
      timelineItems: [],
      language: "zh-CN",
      recentMissions: [],
      runtimeStatus: null,
      codexSmokeTestResult: null,
      isCodexSmokeTestRunning: false
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

    const workspaceField = screen.getByLabelText("工作区路径") as HTMLInputElement;
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
      timelineItems: [],
      language: "zh-CN",
      recentMissions: [],
      runtimeStatus: null,
      codexSmokeTestResult: null,
      isCodexSmokeTestRunning: false
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

  it("shows a visible bridge error instead of crashing when the preload API is unavailable", async () => {
    useAppStore.setState({
      activeMissionId: null,
      timelineItems: [],
      language: "zh-CN",
      recentMissions: [],
      runtimeStatus: null,
      codexSmokeTestResult: null,
      isCodexSmokeTestRunning: false
    });
    Object.defineProperty(window, "winTogether", {
      configurable: true,
      value: undefined
    });

    render(
      <MemoryRouter initialEntries={["/team/draft"]}>
        <Routes>
          <Route path="/team/:missionId" element={<TeamRoomPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getAllByRole("heading").length).toBeGreaterThan(0);
    expect(await screen.findByRole("alert")).toBeTruthy();
  });

  it("shows a visible waiting state while the mission is still starting", async () => {
    useAppStore.setState({
      activeMissionId: null,
      timelineItems: [],
      language: "en",
      recentMissions: [],
      runtimeStatus: null,
      codexSmokeTestResult: null,
      isCodexSmokeTestRunning: false
    });
    const deferredStartMission = createDeferredPromise<{
      mission: {
        id: string;
        title: string;
        goal: string;
        workspacePath: string;
        status: string;
        createdAt: string;
      };
      captain: {
        id: string;
        role: string;
        name: string;
        status: string;
      };
      persistence: {
        transcript: {
          status: "written";
        };
      };
    }>();
    const getDefaultWorkspacePath = vi.fn().mockResolvedValue("D:/development/WinTogether2/.worktrees/feature-v1-foundation");
    const startMission = vi.fn().mockReturnValue(deferredStartMission.promise);

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
      expect((screen.getByLabelText("Workspace path") as HTMLInputElement).value).toBe(
        "D:/development/WinTogether2/.worktrees/feature-v1-foundation"
      );
    });

    fireEvent.change(screen.getByPlaceholderText("Tell Captain the goal..."), {
      target: { value: "Build the first login flow" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Start Mission" }));

    expect((screen.getByRole("button", { name: "Start Mission" }) as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByRole("status") as HTMLElement).textContent).toContain(
      "Captain is waiting for Codex CLI to answer"
    );

    deferredStartMission.resolve({
      mission: {
        id: "mission-123",
        title: "Build the first login flow",
        goal: "Build the first login flow",
        workspacePath: "D:/development/WinTogether2/.worktrees/feature-v1-foundation",
        status: "draft",
        createdAt: "2026-04-14T12:00:00.000Z"
      },
      captain: {
        id: "agent-123",
        role: "captain",
        name: "Captain",
        status: "planning"
      },
      persistence: {
        transcript: {
          status: "written"
        }
      }
    });

    await waitFor(() => {
      expect(screen.getByTestId("location-path").textContent).toBe("/team/mission-123");
    });
  });
});
