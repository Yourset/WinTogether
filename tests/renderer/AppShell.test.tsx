// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { AppShell } from "../../src/renderer/components/layout/AppShell";
import { HomePage } from "../../src/renderer/routes/HomePage";
import { useAppStore } from "../../src/renderer/store/appStore";

describe("AppShell workbench layout", () => {
  beforeEach(() => {
    useAppStore.setState({
      activeMissionId: null,
      timelineItems: [],
      language: "zh-CN",
      recentMissions: [],
      currentWorkspacePath: "D:/development/WinTogether2"
    });

    Object.defineProperty(window, "winTogether", {
      configurable: true,
      value: {
        getDefaultWorkspacePath: vi.fn().mockResolvedValue("D:/development/WinTogether2"),
        startMission: vi.fn()
      }
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("shows a sidebar workbench with a direct mission input page by default", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<HomePage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("任务指挥台")).toBeTruthy();
    expect(screen.getByText("新建任务")).toBeTruthy();
    expect(screen.getByText("当前协作室")).toBeTruthy();
    expect(screen.getByText("任务记录")).toBeTruthy();
    expect(screen.getByText("记忆中心")).toBeTruthy();
    expect(screen.getByText("最近任务")).toBeTruthy();
    expect(screen.getByText("当前工作区")).toBeTruthy();
    expect(screen.getByText("D:/development/WinTogether2")).toBeTruthy();
    expect(screen.getByText("把目标交给 Captain")).toBeTruthy();
    expect(screen.getByPlaceholderText("告诉 Captain 你的目标...")).toBeTruthy();
    expect(screen.getByRole("button", { name: "开始协作" })).toBeTruthy();
  });

  it("shows recent missions in the sidebar and switches copy to English", () => {
    useAppStore.setState({
      activeMissionId: "mission-7",
      timelineItems: [],
      language: "zh-CN",
      currentWorkspacePath: "D:/development/WinTogether2",
      recentMissions: [
        {
          id: "mission-7",
          title: "登录流程首轮",
          goal: "先把登录流程跑通",
          workspacePath: "D:/development/WinTogether2",
          status: "draft",
          createdAt: "2026-04-14T20:00:00.000Z"
        }
      ]
    });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<HomePage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("登录流程首轮")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "EN" }));

    expect(screen.getByText("Mission control")).toBeTruthy();
    expect(screen.getByText("New Mission")).toBeTruthy();
    expect(screen.getByText("Current Room")).toBeTruthy();
    expect(screen.getByText("Mission History")).toBeTruthy();
    expect(screen.getByText("Memory Center")).toBeTruthy();
    expect(screen.getByText("Recent Missions")).toBeTruthy();
    expect(screen.getByText("Current Workspace")).toBeTruthy();
    expect(screen.getByText("Hand the goal to Captain")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Start Collaboration" })).toBeTruthy();
  });
});
