# Win Together Playwright Browser-First Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a browser-first development path plus Playwright-based UX regression so Win Together can be iterated through realistic automated user flows, while Electron remains the final runtime for desktop-specific validation.

**Architecture:** Introduce a renderer-safe browser bridge that mimics the Electron preload API, mount the React app in plain Vite for browser development, and add Playwright as a first-class end-to-end layer focused on first-use UX flows with longer AI/CLI waits and screenshot capture. Keep desktop-only verification in Electron, but move most UI iteration into browser mode.

**Tech Stack:** Vite, React 19, React Router 7, Zustand, Electron, electron-vite, Playwright, Vitest, TypeScript

---

## File Structure

**Create:**
- `D:\development\WinTogether2\.worktrees\feature-v1-foundation\playwright.config.ts` - Playwright project config, base URL, timeouts, screenshot policy
- `D:\development\WinTogether2\.worktrees\feature-v1-foundation\tests\e2e\fixtures\browserBridge.ts` - browser-mode fake bridge data and helpers
- `D:\development\WinTogether2\.worktrees\feature-v1-foundation\tests\e2e\first-launch.spec.ts` - first-user UX flows
- `D:\development\WinTogether2\.worktrees\feature-v1-foundation\tests\e2e\ai-waiting.spec.ts` - delayed AI/CLI states and screenshot assertions
- `D:\development\WinTogether2\.worktrees\feature-v1-foundation\tests\e2e\README.md` - how to run Playwright UX tests and what they cover

**Modify:**
- `D:\development\WinTogether2\.worktrees\feature-v1-foundation\package.json` - add browser dev and Playwright scripts
- `D:\development\WinTogether2\.worktrees\feature-v1-foundation\vite.config.ts` - expose stable dev server settings for browser-mode runs
- `D:\development\WinTogether2\.worktrees\feature-v1-foundation\src\renderer\main.tsx` - install browser bridge during browser-mode startup
- `D:\development\WinTogether2\.worktrees\feature-v1-foundation\src\renderer\App.tsx` - support browser-mode routing defaults if needed
- `D:\development\WinTogether2\.worktrees\feature-v1-foundation\src\renderer\store\appStore.ts` - tolerate browser bridge and expose helpers useful for UX tests
- `D:\development\WinTogether2\.worktrees\feature-v1-foundation\src\renderer\components\team-room\MissionComposer.tsx` - stable loading/error/test ids for automated flows
- `D:\development\WinTogether2\.worktrees\feature-v1-foundation\src\renderer\routes\HomePage.tsx` - stable smoke-test states and AI waiting hooks
- `D:\development\WinTogether2\.worktrees\feature-v1-foundation\src\renderer\components\layout\AppShell.tsx` - stable selectors and environment badge behavior in browser mode
- `D:\development\WinTogether2\.worktrees\feature-v1-foundation\src\renderer\styles.css` - keep browser-mode visuals consistent enough for screenshots
- `D:\development\WinTogether2\.worktrees\feature-v1-foundation\WIN_MEMORY\work-log\current.md` - note the new browser-first testing path

**Test:**
- `D:\development\WinTogether2\.worktrees\feature-v1-foundation\tests\renderer\HomePage.test.tsx`
- `D:\development\WinTogether2\.worktrees\feature-v1-foundation\tests\renderer\TeamRoomPage.test.tsx`
- `D:\development\WinTogether2\.worktrees\feature-v1-foundation\tests\renderer\AppShell.test.tsx`

### Task 1: Add Browser Bridge Foundation

**Files:**
- Create: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\tests\e2e\fixtures\browserBridge.ts`
- Modify: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\src\renderer\main.tsx`
- Modify: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\src\renderer\store\appStore.ts`
- Test: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\tests\renderer\HomePage.test.tsx`

- [ ] **Step 1: Write the failing browser-bridge test**

```tsx
it("uses a browser bridge when preload is unavailable", async () => {
  delete (window as typeof window & { winTogether?: unknown }).winTogether;

  await import("@/renderer/main");

  expect(window.winTogether).toBeDefined();
  await expect(window.winTogether.getDefaultWorkspacePath()).resolves.toContain("browser-workspace");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/renderer/HomePage.test.tsx`
Expected: FAIL because `window.winTogether` is undefined in browser-mode startup.

- [ ] **Step 3: Write minimal browser bridge implementation**

```ts
// src/renderer/main.tsx
import { installBrowserBridge } from "../../tests/e2e/fixtures/browserBridge";

if (!window.winTogether && import.meta.env.DEV) {
  window.winTogether = installBrowserBridge();
}
```

```ts
// tests/e2e/fixtures/browserBridge.ts
export function installBrowserBridge(): WinTogetherApi {
  return {
    async getDefaultWorkspacePath() {
      return "D:/browser-workspace";
    },
    async getRuntimeStatus() {
      return { codexCli: { status: "ready", message: "browser stub" } };
    },
    async runCodexSmokeTest() {
      return { status: "success", message: "browser smoke ok", rawOutput: "browser smoke ok" };
    },
    async startMission(input) {
      return createStubMissionResult(input.goal, input.workspacePath ?? "D:/browser-workspace");
    }
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- tests/renderer/HomePage.test.tsx`
Expected: PASS and existing HomePage expectations still green.

- [ ] **Step 5: Commit**

```bash
git add tests/e2e/fixtures/browserBridge.ts src/renderer/main.tsx src/renderer/store/appStore.ts tests/renderer/HomePage.test.tsx
git commit -m "feat: add browser bridge for renderer development"
```

### Task 2: Add Playwright Project and Browser Dev Scripts

**Files:**
- Create: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\playwright.config.ts`
- Modify: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\package.json`
- Modify: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\vite.config.ts`
- Test: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\tests\e2e\README.md`

- [ ] **Step 1: Write the failing config existence test**

```ts
import { existsSync } from "node:fs";

it("includes a Playwright config and browser dev scripts", () => {
  expect(existsSync("playwright.config.ts")).toBe(true);
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  expect(pkg.scripts["dev:web"]).toBeDefined();
  expect(pkg.scripts["test:e2e"]).toBeDefined();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/runtime/playwright-config.test.ts`
Expected: FAIL because no Playwright config or scripts exist yet.

- [ ] **Step 3: Write minimal config and scripts**

```json
// package.json scripts
{
  "dev:web": "vite --host 127.0.0.1 --port 4173",
  "test:e2e": "playwright test",
  "test:e2e:headed": "playwright test --headed"
}
```

```ts
// playwright.config.ts
export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 90_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: "http://127.0.0.1:4173",
    screenshot: "only-on-failure"
  },
  webServer: {
    command: "npm run dev:web",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: true,
    timeout: 120_000
  }
});
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- tests/runtime/playwright-config.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add package.json vite.config.ts playwright.config.ts tests/e2e/README.md tests/runtime/playwright-config.test.ts
git commit -m "test: add playwright browser workflow"
```

### Task 3: Add First-Use UX Playwright Coverage

**Files:**
- Create: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\tests\e2e\first-launch.spec.ts`
- Modify: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\src\renderer\routes\HomePage.tsx`
- Modify: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\src\renderer\components\team-room\MissionComposer.tsx`
- Modify: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\src\renderer\components\layout\AppShell.tsx`
- Test: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\tests\renderer\TeamRoomPage.test.tsx`

- [ ] **Step 1: Write the failing Playwright first-launch test**

```ts
test("first-time user can start a mission from the home page", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "把目标交给 Captain" })).toBeVisible();
  await page.getByPlaceholder("告诉 Captain 你想完成什么").fill("帮我规划一个登录页面");
  await page.getByRole("button", { name: "开始协作" }).click();
  await expect(page.getByRole("heading", { name: "团队协作室" })).toBeVisible();
  await expect(page.getByText("Captain")).toBeVisible();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:e2e -- tests/e2e/first-launch.spec.ts`
Expected: FAIL because selectors and browser-mode mission flow are not stable enough yet.

- [ ] **Step 3: Write minimal implementation**

```tsx
// MissionComposer.tsx
<textarea
  data-testid="mission-goal-input"
  placeholder={strings.goalPlaceholder}
/>
<button data-testid="mission-submit-button">
  {submitLabel ?? strings.send}
</button>
```

```tsx
// HomePage.tsx
<section data-testid="home-page">
```

```tsx
// AppShell.tsx
<nav data-testid="sidebar-nav">
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:e2e -- tests/e2e/first-launch.spec.ts`
Expected: PASS with stable route change into Team Room.

- [ ] **Step 5: Commit**

```bash
git add tests/e2e/first-launch.spec.ts src/renderer/routes/HomePage.tsx src/renderer/components/team-room/MissionComposer.tsx src/renderer/components/layout/AppShell.tsx tests/renderer/TeamRoomPage.test.tsx
git commit -m "test: cover first mission flow with playwright"
```

### Task 4: Add AI Waiting-State UX Coverage

**Files:**
- Create: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\tests\e2e\ai-waiting.spec.ts`
- Modify: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\tests\e2e\fixtures\browserBridge.ts`
- Modify: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\src\renderer\routes\HomePage.tsx`
- Modify: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\src\renderer\components\team-room\MissionComposer.tsx`
- Modify: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\src\renderer\styles.css`

- [ ] **Step 1: Write the failing delayed-response Playwright test**

```ts
test("shows a visible waiting state while the browser bridge simulates AI delay", async ({ page }) => {
  await page.goto("/?scenario=slow-mission");
  await page.getByTestId("mission-goal-input").fill("帮我先分析这个需求");
  await page.getByTestId("mission-submit-button").click();
  await expect(page.getByText("正在启动任务")).toBeVisible();
  await page.screenshot({ path: "test-results/slow-mission-loading.png", fullPage: true });
  await expect(page.getByText("Captain")).toBeVisible({ timeout: 30_000 });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:e2e -- tests/e2e/ai-waiting.spec.ts`
Expected: FAIL because the browser bridge returns immediately and no explicit loading state is exposed.

- [ ] **Step 3: Write minimal implementation**

```ts
// browserBridge.ts
const isSlowMission = new URL(window.location.href).searchParams.get("scenario") === "slow-mission";
if (isSlowMission) {
  await new Promise((resolve) => setTimeout(resolve, 2500));
}
```

```tsx
// MissionComposer.tsx
{isStartingMission ? <p data-testid="mission-starting-state">{strings.missionStarting}</p> : null}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:e2e -- tests/e2e/ai-waiting.spec.ts`
Expected: PASS and screenshot file created during the delayed state.

- [ ] **Step 5: Commit**

```bash
git add tests/e2e/ai-waiting.spec.ts tests/e2e/fixtures/browserBridge.ts src/renderer/components/team-room/MissionComposer.tsx src/renderer/routes/HomePage.tsx src/renderer/styles.css
git commit -m "test: cover delayed ai mission UX"
```

### Task 5: Document and Record the New Flow

**Files:**
- Modify: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\WIN_MEMORY\work-log\current.md`
- Modify: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\docs\superpowers\specs\2026-04-14-foundation-checkpoint.md`
- Create: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\tests\e2e\README.md`

- [ ] **Step 1: Write the failing documentation expectation**

```md
The docs must explain:
- how to run browser-only dev
- how to run Playwright tests
- that AI/CLI tests may take longer
- that stale windows should be closed before reruns
```

- [ ] **Step 2: Verify documentation is missing**

Run: `rg "dev:web|test:e2e|stale windows|Playwright" docs tests/e2e WIN_MEMORY`
Expected: Missing or incomplete references.

- [ ] **Step 3: Write minimal documentation updates**

```md
Run browser mode: `npm run dev:web`
Run UX tests: `npm run test:e2e`
Before reruns, close stale Win Together / browser windows.
Expect longer waits for AI/CLI scenarios.
```

- [ ] **Step 4: Verify documentation is present**

Run: `rg "dev:web|test:e2e|stale windows|Playwright" docs tests/e2e WIN_MEMORY`
Expected: Matching lines found in all intended files.

- [ ] **Step 5: Commit**

```bash
git add WIN_MEMORY/work-log/current.md docs/superpowers/specs/2026-04-14-foundation-checkpoint.md tests/e2e/README.md
git commit -m "docs: describe browser-first playwright workflow"
```
