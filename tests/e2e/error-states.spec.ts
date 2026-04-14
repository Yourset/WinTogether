import { expect, test } from "@playwright/test";

test("a first-time user sees a visible mission-start error from the browser bridge", async ({ page }) => {
  await page.goto("/?bridge-delay-ms=800&bridge-error=mission-start");

  await page.getByRole("button", { name: "EN" }).click();
  await expect(page.getByText("Hand the goal to Captain")).toBeVisible();

  await page.getByTestId("mission-workspace-input").fill("D:/development/WinTogether2");
  await page.getByTestId("mission-goal-input").fill("Build the first login flow and keep the UI easy to understand.");
  await page.getByTestId("mission-submit-button").click();

  await expect(page.locator(".composer-panel__status--pending")).toContainText(
    "Captain is waiting for Codex CLI to answer. Please hold on...",
    {
    timeout: 5000
    }
  );
  await expect(page.getByRole("alert")).toContainText("Mission start failed inside browser bridge.", {
    timeout: 15000
  });
  await expect(page.getByText("Hand the goal to Captain")).toBeVisible();
});
