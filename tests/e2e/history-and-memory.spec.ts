import { expect, test } from "@playwright/test";

test("a first-time user can revisit mission history and memory after starting a mission", async ({ page }, testInfo) => {
  await page.goto("/?bridge-delay-ms=500");

  await expect(page.getByTestId("app-shell-brand")).toContainText("Win Together");
  await expect(page.getByTestId("nav-history")).toBeVisible();
  await expect(page.getByTestId("nav-memory")).toBeVisible();

  await page.getByTestId("mission-workspace-input").fill("D:/development/WinTogether2");
  await page.getByTestId("mission-goal-input").fill("Build a browser-first history and memory regression path.");
  await page.getByTestId("mission-submit-button").click();

  await expect(page.getByTestId("mission-composer-home")).toHaveAttribute("aria-busy", "true", {
    timeout: 5000
  });
  await expect(page).toHaveURL(/\/team\/mission-/);
  const missionIdMatch = page.url().match(/\/team\/([^/?#]+)/);
  expect(missionIdMatch?.[1]).toBeTruthy();
  const missionId = missionIdMatch?.[1] ?? "";
  await expect(page.getByTestId("team-room-page")).toBeVisible({ timeout: 30000 });
  await expect(page.getByText(/Browser Captain is ready to coordinate the first mission\./)).toBeVisible({
    timeout: 30000
  });

  await page.getByTestId("nav-history").click();
  await expect(page).toHaveURL(/\/history/);
  await expect(page.getByTestId("mission-history-page")).toBeVisible();
  await expect(page.getByTestId("mission-history-card")).toBeVisible();
  await expect(page.getByTestId("mission-history-card")).toContainText("Build a browser-first history and memory regression path.");
  await expect(page.getByTestId(`sidebar-mission-link-${missionId}`)).toBeVisible();
  await expect(page.getByTestId(`mission-history-open-room-${missionId}`)).toBeVisible();
  await expect(page.getByTestId("mission-history-card")).toContainText(
    'Browser Captain summarized the first pass for "Build a browser-first history and memory regression path.".'
  );

  await page.getByTestId("nav-memory").click();
  await expect(page).toHaveURL(/\/memory/);
  await expect(page.getByTestId("memory-viewer-page")).toBeVisible();
  await expect(page.getByTestId("memory-viewer-index-card")).toBeVisible();
  await expect(page.getByTestId("memory-viewer-work-log-card")).toBeVisible();
  await expect(page.getByTestId("memory-viewer-index-card").getByText("Browser bridge", { exact: false })).toBeVisible();
  await expect(page.getByTestId("memory-viewer-work-log-card")).toContainText("Mission started: Build a browser-first history and memory regression path.");
  await expect(page.getByTestId("memory-viewer-work-log-card")).toContainText('Summary: Browser Captain summarized the first pass for "Build a browser-first history and memory regression path.".');

  await page.screenshot({
    path: testInfo.outputPath("history-and-memory-final.png"),
    fullPage: true
  });
});
