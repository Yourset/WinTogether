import { expect, test } from "@playwright/test";

test("a first-time user can start a mission from the browser app", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Win Together")).toBeVisible();
  await expect(page.getByText("把目标交给 Captain")).toBeVisible();
  await expect(page.getByRole("button", { name: "测试 Codex CLI" })).toBeVisible();

  await page.getByRole("button", { name: "测试 Codex CLI" }).click();
  await expect(page.getByText("Codex CLI 测试成功：Browser bridge is ready.")).toBeVisible({
    timeout: 30000
  });
  await expect(page.getByText("Browser bridge is ready.", { exact: true })).toBeVisible();

  await page.getByLabel("工作区路径").fill("D:/development/WinTogether2");
  await page.getByPlaceholder("告诉 Captain 你的目标...").fill("Build the first login flow and keep the UI easy to understand.");
  await page.getByRole("button", { name: "开始协作" }).click();

  await expect(page).toHaveURL(/\/team\/mission-/);
  await expect(page.getByRole("heading", { name: "团队协作室" })).toBeVisible({ timeout: 60000 });
  await expect(page.getByText("任务 ID")).toBeVisible();
  await expect(page.getByText("Browser Captain 已加入当前协作室。", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Captain 收到了 Codex CLI 的第一轮回应：Browser Captain is ready to coordinate the first mission.", {
      exact: true
    })
  ).toBeVisible({
    timeout: 30000
  });
  await expect(page.getByText("Build the first login flow and keep the UI easy to understand.", { exact: true })).toBeVisible();
});
