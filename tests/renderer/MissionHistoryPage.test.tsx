// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";

import { MissionHistoryPage } from "../../src/renderer/routes/MissionHistoryPage";
import { useAppStore } from "../../src/renderer/store/appStore";

describe("MissionHistoryPage", () => {
  afterEach(() => {
    cleanup();
  });

  it("shows persisted mission history entries", () => {
    useAppStore.setState({
      activeMissionId: null,
      currentWorkspacePath: null,
      language: "en",
      recentMissions: [
        {
          id: "mission-7",
          title: "Login flow",
          goal: "Build the login flow",
          workspacePath: "D:/workspace",
          status: "draft",
          createdAt: "2026-04-14T12:30:00.000Z",
          summary: "Started mission: Build the login flow"
        }
      ],
      timelineItems: []
    });

    render(
      <MemoryRouter>
        <MissionHistoryPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Mission History")).toBeTruthy();
    expect(screen.getByText("Login flow")).toBeTruthy();
    expect(screen.getByText("Build the login flow")).toBeTruthy();
    expect(screen.getByText("Started mission: Build the login flow")).toBeTruthy();
  });
});
