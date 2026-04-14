// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TeamRoomPage } from "../../src/renderer/routes/TeamRoomPage";

describe("TeamRoomPage", () => {
  it('renders the text "Team Room"', () => {
    render(<TeamRoomPage />);

    expect(screen.getByText("Team Room")).toBeTruthy();
  });
});
