// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { TeamRoomPage } from "../../src/renderer/routes/TeamRoomPage";
import { useAppStore } from "../../src/renderer/store/appStore";

describe("TeamRoomPage", () => {
  afterEach(() => {
    cleanup();
  });

  it("shows the team room layout with timeline, agents, context, and composer", () => {
    useAppStore.setState({ activeMissionId: null, timelineItems: [] });

    render(
      <MemoryRouter initialEntries={["/team/mission-42"]}>
        <Routes>
          <Route path="/team/:missionId" element={<TeamRoomPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Team Room")).toBeTruthy();
    expect(screen.getByText("Mission ID: mission-42")).toBeTruthy();
    expect(screen.getByText("Timeline")).toBeTruthy();
    expect(screen.getByText("Agents")).toBeTruthy();
    expect(screen.getByText("Context")).toBeTruthy();
    expect(screen.getByPlaceholderText("Tell Captain the goal...")).toBeTruthy();
    expect(useAppStore.getState().activeMissionId).toBe("mission-42");
  });

  it("starts a mission from the composer and appends captain updates to the timeline", async () => {
    useAppStore.setState({ activeMissionId: null, timelineItems: [] });
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

    fireEvent.change(screen.getByPlaceholderText("Tell Captain the goal..."), {
      target: { value: "Ship the first loop" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => {
      expect(startMission).toHaveBeenCalledWith({
        goal: "Ship the first loop",
        workspacePath: "D:/development/WinTogether2/.worktrees/feature-v1-foundation"
      });
    });

    expect(getDefaultWorkspacePath).toHaveBeenCalledTimes(1);
    expect(await screen.findByText('Mission "Ship the first loop" started.')).toBeTruthy();
    expect(await screen.findByText("Captain is planning the next steps for: Ship the first loop")).toBeTruthy();
    expect(useAppStore.getState().activeMissionId).toBe("mission-123");
  });
});
