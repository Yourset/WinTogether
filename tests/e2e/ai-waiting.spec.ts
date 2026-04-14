import { expect, test } from "@playwright/test";

test("a first-time user can see visible waiting states while the browser bridge responds", async ({ page }, testInfo) => {
  await page.goto("/?bridge-delay-ms=1200");

  await page.getByRole("button", { name: "EN" }).click();
  await expect(page.getByText("Hand the goal to Captain")).toBeVisible();

  await page.getByRole("button", { name: "Test Codex CLI" }).click();
  await expect(page.getByText("Running the Codex CLI smoke test...")).toBeVisible({ timeout: 5000 });
  await page.screenshot({
    path: testInfo.outputPath("codex-smoke-test-pending.png"),
    fullPage: true
  });
  await expect(page.getByText("Codex CLI test succeeded: Browser bridge is ready.")).toBeVisible({
    timeout: 30000
  });

  await page.getByPlaceholder("Tell Captain the goal...").fill("Build the first login flow and keep the UI easy to understand.");
  await page.getByRole("button", { name: "Start Collaboration" }).click();

  await expect(page.getByText("Captain is waiting for Codex CLI to answer. Please hold on...")).toBeVisible({
    timeout: 5000
  });
  await page.screenshot({
    path: testInfo.outputPath("mission-start-pending.png"),
    fullPage: true
  });
  await expect(page).toHaveURL(/\/team\/mission-/);
  await expect(page.getByRole("heading", { name: "Team Room" })).toBeVisible({ timeout: 30000 });
  await expect(page.getByText("Captain received the first Codex CLI response: Browser Captain is ready to coordinate the first mission.")).toBeVisible({
    timeout: 30000
  });
});
