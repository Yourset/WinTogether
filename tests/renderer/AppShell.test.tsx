// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { AppShell } from "../../src/renderer/components/layout/AppShell";
import { HomePage } from "../../src/renderer/routes/HomePage";
import { useAppStore } from "../../src/renderer/store/appStore";

describe("AppShell localization and home guidance", () => {
  beforeEach(() => {
    useAppStore.setState({
      activeMissionId: null,
      timelineItems: [],
      language: "zh-CN"
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("shows Chinese-first navigation and guided home actions by default", () => {
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
    expect(screen.getByText("首页")).toBeTruthy();
    expect(screen.getByText("团队协作室")).toBeTruthy();
    expect(screen.getByText("任务记录")).toBeTruthy();
    expect(screen.getByText("记忆中心")).toBeTruthy();
    expect(screen.getByText("开始一个新任务")).toBeTruthy();
    expect(screen.getByText("进入 Team Room")).toBeTruthy();
    expect(screen.getByText("继续上一次任务")).toBeTruthy();
  });

  it("switches the shell and home copy to English", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<HomePage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "EN" }));

    expect(screen.getByText("Mission control")).toBeTruthy();
    expect(screen.getByText("Home")).toBeTruthy();
    expect(screen.getByText("Team Room")).toBeTruthy();
    expect(screen.getByText("History")).toBeTruthy();
    expect(screen.getByText("Memory")).toBeTruthy();
    expect(screen.getByText("Start a new mission")).toBeTruthy();
    expect(screen.getByText("Enter the Team Room")).toBeTruthy();
    expect(screen.getByText("Resume the last mission")).toBeTruthy();
  });
});
