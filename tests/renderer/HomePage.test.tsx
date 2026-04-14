// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

import { HomePage } from "../../src/renderer/routes/HomePage";
import { useAppStore } from "../../src/renderer/store/appStore";

describe("HomePage", () => {
  beforeEach(() => {
    useAppStore.setState({
      activeMissionId: null,
      timelineItems: [],
      language: "zh-CN",
      recentMissions: [],
      currentWorkspacePath: "D:/development/WinTogether2",
      runtimeStatus: {
        codexCli: {
          status: "ready",
          message: "codex 1.2.3"
        }
      },
      codexSmokeTestResult: null,
      isCodexSmokeTestRunning: false
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("runs the dedicated Codex CLI smoke test from the home page", async () => {
    Object.defineProperty(window, "winTogether", {
      configurable: true,
      value: {
        getDefaultWorkspacePath: vi.fn().mockResolvedValue("D:/development/WinTogether2"),
        startMission: vi.fn(),
        runCodexSmokeTest: vi.fn().mockResolvedValue({
          status: "success",
          message: "Codex CLI is working.",
          rawOutput: "Codex CLI is working."
        })
      }
    });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "测试 Codex CLI" }));

    expect(await screen.findByText("Codex CLI 测试成功：Codex CLI is working.")).toBeTruthy();
    expect(screen.getByText("CLI 原始返回")).toBeTruthy();
    expect(screen.getByText("Codex CLI is working.")).toBeTruthy();

    await waitFor(() => {
      expect(window.winTogether.runCodexSmokeTest).toHaveBeenCalledTimes(1);
    });
  });
});
