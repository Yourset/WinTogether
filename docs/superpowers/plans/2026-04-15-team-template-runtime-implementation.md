# Win Together Team Template Runtime Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move Team Room team composition from hardcoded runtime constants to a file-based default team template that can later support user-created and AI-generated templates.

**Architecture:** Add a template loader that reads a default team template from `WIN_MEMORY/teams/templates/`, have runtime materialize Captain and worker agents from that template, and update Team Room to render template-driven roster and timeline data. Keep the first pass simple: one default template, no picker UI yet, but structure everything so future templates can be swapped in without rewriting the runtime.

**Tech Stack:** TypeScript, React 19, Zustand, Electron, Playwright, Vitest, JSON file templates

---

## File Structure

**Create:**
- `D:\development\WinTogether2\.worktrees\feature-v1-foundation\WIN_MEMORY\teams\templates\default-software-team.json` - default built-in team template
- `D:\development\WinTogether2\.worktrees\feature-v1-foundation\src\shared\contracts\teamTemplate.ts` - template schema and runtime materialization types
- `D:\development\WinTogether2\.worktrees\feature-v1-foundation\src\runtime\core\TeamTemplateLoader.ts` - file-based template loading and validation
- `D:\development\WinTogether2\.worktrees\feature-v1-foundation\tests\runtime\TeamTemplateLoader.test.ts` - template loading tests

**Modify:**
- `D:\development\WinTogether2\.worktrees\feature-v1-foundation\src\runtime\core\MemoryManager.ts` - ensure template files are part of base structure
- `D:\development\WinTogether2\.worktrees\feature-v1-foundation\src\runtime\core\MissionOrchestrator.ts` - build team from template instead of hardcoded Captain-only flow
- `D:\development\WinTogether2\.worktrees\feature-v1-foundation\src\runtime\core\AppRuntimeImpl.ts` - load default template and pass it into orchestration
- `D:\development\WinTogether2\.worktrees\feature-v1-foundation\src\runtime\core\AppRuntime.ts` - expose template-driven mission result fields
- `D:\development\WinTogether2\.worktrees\feature-v1-foundation\src\shared\contracts\agent.ts` - support template-driven default status/name usage if needed
- `D:\development\WinTogether2\.worktrees\feature-v1-foundation\src\shared\contracts\events.ts` - keep any event payloads aligned with template-driven agents
- `D:\development\WinTogether2\.worktrees\feature-v1-foundation\src\renderer\store\appStore.ts` - store template-driven team agents
- `D:\development\WinTogether2\.worktrees\feature-v1-foundation\src\renderer\routes\TeamRoomPage.tsx` - use store-driven roster instead of hardcoded roles
- `D:\development\WinTogether2\.worktrees\feature-v1-foundation\src\renderer\components\team-room\RosterPanel.tsx` - render richer agent cards from template data
- `D:\development\WinTogether2\.worktrees\feature-v1-foundation\src\renderer\components\team-room\MessageTimeline.tsx` - show clearer system/captain/worker layers from template-driven events
- `D:\development\WinTogether2\.worktrees\feature-v1-foundation\src\renderer\i18n.ts` - strings for worker stage messages
- `D:\development\WinTogether2\.worktrees\feature-v1-foundation\src\renderer\support\browserBridge.ts` - mirror template-driven team for browser-mode tests
- `D:\development\WinTogether2\.worktrees\feature-v1-foundation\tests\runtime\MissionOrchestrator.test.ts` - assert template-driven team and messages
- `D:\development\WinTogether2\.worktrees\feature-v1-foundation\tests\runtime\AppRuntimeImpl.test.ts` - assert runtime returns template-driven team
- `D:\development\WinTogether2\.worktrees\feature-v1-foundation\tests\renderer\TeamRoomPage.test.tsx` - assert dynamic roster/timeline rendering
- `D:\development\WinTogether2\.worktrees\feature-v1-foundation\tests\e2e\first-user-journey.spec.ts` - assert richer team room after mission start
- `D:\development\WinTogether2\.worktrees\feature-v1-foundation\WIN_MEMORY\work-log\current.md` - record milestone

### Task 1: Add the Default Team Template and Loader

**Files:**
- Create: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\WIN_MEMORY\teams\templates\default-software-team.json`
- Create: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\src\shared\contracts\teamTemplate.ts`
- Create: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\src\runtime\core\TeamTemplateLoader.ts`
- Test: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\tests\runtime\TeamTemplateLoader.test.ts`

- [ ] **Step 1: Write the failing loader test**

```ts
it("loads the default software team template from WIN_MEMORY", async () => {
  const loader = new TeamTemplateLoader(workspaceRoot);

  const template = await loader.loadDefaultTemplate();

  expect(template.id).toBe("default-software-team");
  expect(template.captain.role).toBe("captain");
  expect(template.workers.map((worker) => worker.role)).toEqual(["researcher", "builder"]);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/runtime/TeamTemplateLoader.test.ts`
Expected: FAIL because no template loader or default template file exists yet.

- [ ] **Step 3: Write minimal implementation**

```json
{
  "id": "default-software-team",
  "name": "Default Software Team",
  "description": "Captain-led general software development team.",
  "version": 1,
  "captain": {
    "name": "Captain",
    "role": "captain",
    "status": "planning",
    "prompt": "Lead the mission, recruit specialists, summarize progress."
  },
  "workers": [
    {
      "id": "researcher",
      "name": "Researcher",
      "role": "researcher",
      "defaultStatus": "running",
      "prompt": "Inspect the codebase, compare options, and identify risks."
    },
    {
      "id": "builder",
      "name": "Builder",
      "role": "builder",
      "defaultStatus": "idle",
      "prompt": "Implement approved changes and report outcomes."
    }
  ],
  "runtime": {
    "allowDynamicExpansion": true,
    "defaultActiveWorkers": ["researcher", "builder"]
  }
}
```

```ts
export class TeamTemplateLoader {
  constructor(private readonly rootPath: string) {}

  async loadDefaultTemplate() {
    const filePath = join(this.rootPath, "WIN_MEMORY", "teams", "templates", "default-software-team.json");
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as TeamTemplateRecord;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/runtime/TeamTemplateLoader.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add WIN_MEMORY/teams/templates/default-software-team.json src/shared/contracts/teamTemplate.ts src/runtime/core/TeamTemplateLoader.ts tests/runtime/TeamTemplateLoader.test.ts
git commit -m "feat: add default team template loader"
```

### Task 2: Ensure Memory Structure Includes Team Templates

**Files:**
- Modify: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\src\runtime\core\MemoryManager.ts`
- Test: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\tests\runtime\MemoryManager.test.ts`

- [ ] **Step 1: Write the failing memory test**

```ts
it("creates the default team template when ensuring memory structure", async () => {
  const manager = new MemoryManager(tempRoot);

  await manager.ensureBaseStructure();

  await expect(
    readFile(join(tempRoot, "WIN_MEMORY", "teams", "templates", "default-software-team.json"), "utf8")
  ).resolves.toContain('"id": "default-software-team"');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/runtime/MemoryManager.test.ts`
Expected: FAIL because the template file is not part of the ensured base structure.

- [ ] **Step 3: Write minimal implementation**

```ts
const TEMPLATE_FILES = [
  // existing files...
  "teams/templates/default-software-team.json"
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/runtime/MemoryManager.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/runtime/core/MemoryManager.ts tests/runtime/MemoryManager.test.ts
git commit -m "feat: include team templates in memory bootstrap"
```

### Task 3: Materialize Team from the Default Template

**Files:**
- Modify: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\src\runtime\core\MissionOrchestrator.ts`
- Modify: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\src\runtime\core\AppRuntimeImpl.ts`
- Modify: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\src\runtime\core\AppRuntime.ts`
- Test: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\tests\runtime\MissionOrchestrator.test.ts`
- Test: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\tests\runtime\AppRuntimeImpl.test.ts`

- [ ] **Step 1: Write the failing runtime tests**

```ts
it("builds captain and workers from the loaded team template", async () => {
  const result = await runtime.startMission({
    goal: "Build login flow",
    workspacePath: "D:/workspace"
  });

  expect(result.team?.map((agent) => agent.role)).toEqual(["captain", "researcher", "builder"]);
});
```

```ts
it("publishes spawned events for all template-driven agents", async () => {
  const result = await orchestrator.startMission(input, template);

  const spawnedRoles = bus.getEvents()
    .filter((event) => event.type === "agent.spawned")
    .map((event) => event.payload.agent.role);

  expect(spawnedRoles).toEqual(["captain", "researcher", "builder"]);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- tests/runtime/MissionOrchestrator.test.ts tests/runtime/AppRuntimeImpl.test.ts`
Expected: FAIL because the runtime still hardcodes Captain-only behavior.

- [ ] **Step 3: Write minimal implementation**

```ts
const template = await this.teamTemplateLoader.loadDefaultTemplate();
const captain = materializeCaptain(template);
const workers = template.workers.map(materializeWorker);
const team = [captain, ...workers];
```

```ts
for (const agent of team) {
  this.eventBus.publish({
    id: createId("event"),
    type: "agent.spawned",
    timestamp: nowIso(),
    payload: { agent, missionId: mission.id }
  });
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- tests/runtime/MissionOrchestrator.test.ts tests/runtime/AppRuntimeImpl.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/runtime/core/MissionOrchestrator.ts src/runtime/core/AppRuntimeImpl.ts src/runtime/core/AppRuntime.ts tests/runtime/MissionOrchestrator.test.ts tests/runtime/AppRuntimeImpl.test.ts
git commit -m "feat: build mission team from default template"
```

### Task 4: Render Template-Driven Roster and Timeline

**Files:**
- Modify: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\src\renderer\store\appStore.ts`
- Modify: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\src\renderer\routes\TeamRoomPage.tsx`
- Modify: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\src\renderer\components\team-room\RosterPanel.tsx`
- Modify: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\src\renderer\components\team-room\MessageTimeline.tsx`
- Modify: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\src\renderer\i18n.ts`
- Test: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\tests\renderer\TeamRoomPage.test.tsx`

- [ ] **Step 1: Write the failing renderer test**

```tsx
it("renders template-driven team members in the roster", async () => {
  renderTeamRoomWithMissionResult({
    team: [
      { id: "captain-1", role: "captain", name: "Captain", status: "planning" },
      { id: "researcher-1", role: "researcher", name: "Researcher", status: "running" },
      { id: "builder-1", role: "builder", name: "Builder", status: "idle" }
    ]
  });

  expect(await screen.findByText("Researcher")).toBeTruthy();
  expect(await screen.findByText("Builder")).toBeTruthy();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/renderer/TeamRoomPage.test.tsx`
Expected: FAIL because the roster still uses a hardcoded array.

- [ ] **Step 3: Write minimal implementation**

```ts
// store
teamAgents: [],
recordMissionStarted: (result) => set({
  teamAgents: result.team ?? [result.captain]
})
```

```tsx
// TeamRoomPage
const agents = useAppStore((state) => state.teamAgents);
<RosterPanel agents={agents} />
```

```tsx
// RosterPanel
agents.map((agent) => (
  <li key={agent.id}>
    <div>{agent.name}</div>
    <div>{agent.role}</div>
    <div>{agent.status}</div>
  </li>
))
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/renderer/TeamRoomPage.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/renderer/store/appStore.ts src/renderer/routes/TeamRoomPage.tsx src/renderer/components/team-room/RosterPanel.tsx src/renderer/components/team-room/MessageTimeline.tsx src/renderer/i18n.ts tests/renderer/TeamRoomPage.test.tsx
git commit -m "feat: render template-driven team room roster"
```

### Task 5: Keep Browser and First-Use Flows Aligned

**Files:**
- Modify: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\src\renderer\support\browserBridge.ts`
- Modify: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\tests\e2e\first-user-journey.spec.ts`
- Test: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\tests\e2e\first-user-journey.spec.ts`

- [ ] **Step 1: Write the failing e2e assertion**

```ts
await expect(page.getByText("Researcher")).toBeVisible();
await expect(page.getByText("Builder")).toBeVisible();
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:e2e -- tests/e2e/first-user-journey.spec.ts`
Expected: FAIL because browser bridge still returns a thinner team result.

- [ ] **Step 3: Write minimal implementation**

```ts
const team = [captain, researcher, builder];
return {
  mission,
  captain,
  team,
  recentMission: updatedMission,
  events
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:e2e -- tests/e2e/first-user-journey.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/renderer/support/browserBridge.ts tests/e2e/first-user-journey.spec.ts
git commit -m "test: align browser bridge with template-driven teams"
```

### Task 6: Record the Template-Driven Milestone

**Files:**
- Modify: `D:\development\WinTogether2\.worktrees\feature-v1-foundation\WIN_MEMORY\work-log\current.md`

- [ ] **Step 1: Add the milestone note**

```md
- 2026-04-15 team-template checkpoint: Team Room now builds its initial Captain and worker roster from the default team template instead of hardcoded runtime constants.
```

- [ ] **Step 2: Verify the note exists**

Run: `rg "team-template checkpoint" WIN_MEMORY/work-log/current.md`
Expected: One matching line.

- [ ] **Step 3: Commit**

```bash
git add WIN_MEMORY/work-log/current.md
git commit -m "docs: record template-driven team checkpoint"
```
