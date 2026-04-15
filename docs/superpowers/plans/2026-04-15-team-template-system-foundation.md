# Team Template System Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the first template-driven team foundation so `Win Together` can load a default software team template from `WIN_MEMORY`, expose a shared schema, and ensure the memory base structure materializes the template files automatically.

**Architecture:** Keep the first pass minimal and file-based. A new shared contract will define the template shape, a loader will read and validate the default template from disk, and `MemoryManager.ensureBaseStructure()` will copy the template assets into every memory root alongside the existing memory files. The implementation stays focused on the default template only, while leaving room for later template selection and AI-generated templates.

**Tech Stack:** TypeScript, Node `fs/promises`, Vitest.

---

### Task 1: Define the team template contract and default template asset

**Files:**
- Create: `src/shared/contracts/teamTemplate.ts`
- Create: `WIN_MEMORY/teams/templates/default-software-team.json`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { loadDefaultTeamTemplate } from "../../src/runtime/core/TeamTemplateLoader";

describe("TeamTemplateLoader", () => {
  it("loads the default software team template from WIN_MEMORY", async () => {
    const template = await loadDefaultTeamTemplate();

    expect(template.id).toBe("default-software-team");
    expect(template.name).toBe("Default Software Team");
    expect(template.members[0]).toMatchObject({ id: "captain", role: "Captain" });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/runtime/TeamTemplateLoader.test.ts`
Expected: fail because `TeamTemplateLoader` and the template contract do not exist yet.

- [ ] **Step 3: Write the minimal implementation**

```ts
export interface TeamTemplateMember {
  id: string;
  role: string;
  description: string;
  primary: boolean;
}

export interface TeamTemplate {
  id: string;
  name: string;
  summary: string;
  members: TeamTemplateMember[];
  allowsDynamicExpansion: boolean;
}
```

Create `WIN_MEMORY/teams/templates/default-software-team.json` with a small default template:

```json
{
  "id": "default-software-team",
  "name": "Default Software Team",
  "summary": "A small software delivery team with a Captain and four specialist roles.",
  "allowsDynamicExpansion": true,
  "members": [
    {
      "id": "captain",
      "role": "Captain",
      "description": "Owns direction, scope, and coordination.",
      "primary": true
    },
    {
      "id": "researcher",
      "role": "Researcher",
      "description": "Clarifies requirements and gathers context.",
      "primary": false
    },
    {
      "id": "builder",
      "role": "Builder",
      "description": "Implements the requested change.",
      "primary": false
    },
    {
      "id": "reviewer",
      "role": "Reviewer",
      "description": "Checks quality, risks, and regressions.",
      "primary": false
    },
    {
      "id": "tester",
      "role": "Tester",
      "description": "Verifies behavior from the user perspective.",
      "primary": false
    }
  ]
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- tests/runtime/TeamTemplateLoader.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/shared/contracts/teamTemplate.ts WIN_MEMORY/teams/templates/default-software-team.json tests/runtime/TeamTemplateLoader.test.ts
git commit -m "feat: add default team template contract"
```

### Task 2: Add a template loader

**Files:**
- Create: `src/runtime/core/TeamTemplateLoader.ts`
- Test: `tests/runtime/TeamTemplateLoader.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { loadDefaultTeamTemplate } from "../../src/runtime/core/TeamTemplateLoader";

describe("TeamTemplateLoader", () => {
  it("loads the default software team template from WIN_MEMORY", async () => {
    const template = await loadDefaultTeamTemplate();

    expect(template.id).toBe("default-software-team");
    expect(template.members).toHaveLength(5);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/runtime/TeamTemplateLoader.test.ts`
Expected: fail because the loader is missing.

- [ ] **Step 3: Write the minimal implementation**

```ts
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import type { TeamTemplate } from "../../shared/contracts/teamTemplate";

const MODULE_URL = import.meta.url;

export async function loadDefaultTeamTemplate(moduleUrl: string = MODULE_URL): Promise<TeamTemplate> {
  const templateRoot = fileURLToPath(new URL("../../../WIN_MEMORY/teams/templates/", moduleUrl));
  const templatePath = join(templateRoot, "default-software-team.json");
  return JSON.parse(await readFile(templatePath, "utf8")) as TeamTemplate;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- tests/runtime/TeamTemplateLoader.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/runtime/core/TeamTemplateLoader.ts tests/runtime/TeamTemplateLoader.test.ts
git commit -m "feat: add team template loader"
```

### Task 3: Teach MemoryManager to materialize the default template

**Files:**
- Modify: `src/runtime/core/MemoryManager.ts`
- Test: `tests/runtime/MemoryManager.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
it("creates the default team template alongside the base memory structure", async () => {
  const rootPath = await mkdtemp(join(tmpdir(), "memory-manager-template-"));
  const memoryManager = new MemoryManager(rootPath);

  await memoryManager.ensureBaseStructure();

  const template = await readFile(
    join(rootPath, "WIN_MEMORY", "teams", "templates", "default-software-team.json"),
    "utf8"
  );

  expect(JSON.parse(template)).toMatchObject({
    id: "default-software-team",
    name: "Default Software Team"
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/runtime/MemoryManager.test.ts`
Expected: fail because `ensureBaseStructure()` does not yet copy the template file.

- [ ] **Step 3: Write the minimal implementation**

```ts
import { loadDefaultTeamTemplate } from "./TeamTemplateLoader";

const TEMPLATE_FILES = [
  "README.md",
  "INDEX.md",
  "memory-policy.md",
  "user/user-preferences.md",
  "teams/INDEX.md",
  "teams/default-team.md",
  "teams/roles/captain.md",
  "teams/roles/researcher.md",
  "teams/roles/builder.md",
  "teams/roles/reviewer.md",
  "teams/roles/tester.md",
  "teams/templates/default-software-team.json",
  "missions/INDEX.md",
  "workspaces/INDEX.md",
  "knowledge/INDEX.md",
  "work-log/current.md"
];

async function ensureDefaultTemplate(rootPath: string, templateRoot: string) {
  const template = await loadDefaultTeamTemplate();
  const targetPath = join(rootPath, "WIN_MEMORY", "teams", "templates", "default-software-team.json");
  await this.writeIfMissing(targetPath, JSON.stringify(template, null, 2) + "\n");
}
```

Implement it in the simplest safe way so the file is copied into `WIN_MEMORY/teams/templates/` during base structure creation.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- tests/runtime/MemoryManager.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/runtime/core/MemoryManager.ts tests/runtime/MemoryManager.test.ts src/runtime/core/TeamTemplateLoader.ts
git commit -m "feat: materialize default team template in memory"
```

### Task 4: Update project memory and verify the package

**Files:**
- Modify: `WIN_MEMORY/work-log/current.md`

- [ ] **Step 1: Append a concise work-log entry**

```md
- 2026-04-15 team template foundation: added the default software team template contract, loader, and memory bootstrap so every memory root can materialize the base template automatically.
```

- [ ] **Step 2: Run the focused tests**

Run:
- `npm test -- tests/runtime/TeamTemplateLoader.test.ts tests/runtime/MemoryManager.test.ts`
- `npm run lint`

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add WIN_MEMORY/work-log/current.md
git commit -m "chore: record team template foundation work"
```

