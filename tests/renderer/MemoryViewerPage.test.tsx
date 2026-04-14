// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

import { MemoryViewerPage } from "../../src/renderer/routes/MemoryViewerPage";
import { useAppStore } from "../../src/renderer/store/appStore";

describe("MemoryViewerPage", () => {
  beforeEach(() => {
    useAppStore.setState({
      activeMissionId: null,
      currentWorkspacePath: "D:/development/WinTogether2",
      language: "zh-CN",
      recentMissions: [],
      runtimeStatus: null,
      timelineItems: []
    });

    Object.defineProperty(window, "winTogether", {
      configurable: true,
      value: {
        getMemoryOverview: vi.fn().mockResolvedValue({
          indexContent: "# Memory Index\n\n- [Current Work Log](./work-log/current.md)",
          workLogContent: "# Current Work Log\n\n- memory overview requested"
        })
      }
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("shows real memory content instead of only placeholder copy", async () => {
    render(
      <MemoryRouter>
        <MemoryViewerPage />
      </MemoryRouter>
    );

    expect(screen.getByText("记忆中心")).toBeTruthy();
    expect(await screen.findByText("记忆索引")).toBeTruthy();
    expect(screen.getByText("当前工作日志")).toBeTruthy();
    expect(screen.getAllByText(/Current Work Log/).length).toBeGreaterThan(0);
    expect(screen.getByText(/memory overview requested/)).toBeTruthy();
  });
});
