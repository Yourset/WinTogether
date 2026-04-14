// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { TeamRoomPage } from "../../src/renderer/routes/TeamRoomPage";
import { useAppStore } from "../../src/renderer/store/appStore";

describe("TeamRoomPage", () => {
  it("shows the team room layout with timeline, agents, context, and composer", () => {
    useAppStore.setState({ activeMissionId: null });

    render(
      <MemoryRouter initialEntries={["/team/mission-42"]}>
        <Routes>
          <Route path="/team/:missionId" element={<TeamRoomPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Team Room")).toBeTruthy();
    expect(screen.getByText("Mission ID: mission-42")).toBeTruthy();
    expect(screen.getByText("Timeline")).toBeTruthy();
    expect(screen.getByText("Agents")).toBeTruthy();
    expect(screen.getByText("Context")).toBeTruthy();
    expect(screen.getByPlaceholderText("告诉 Captain 你的目标...")).toBeTruthy();
    expect(useAppStore.getState().activeMissionId).toBe("mission-42");
  });
});
