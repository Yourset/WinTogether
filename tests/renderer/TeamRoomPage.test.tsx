// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { TeamRoomPage } from "../../src/renderer/routes/TeamRoomPage";
import { useAppStore } from "../../src/renderer/store/appStore";

describe("TeamRoomPage", () => {
  it("syncs the routed mission id into app state", () => {
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
    expect(useAppStore.getState().activeMissionId).toBe("mission-42");
  });
});
