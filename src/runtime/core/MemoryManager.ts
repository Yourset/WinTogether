import { access, appendFile, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const UTF8 = "utf8";

const BASE_FILES: Record<string, string> = {
  "README.md": `# WIN_MEMORY\n\nThis directory is the document-based memory store for the WinTogether runtime.\n\nIt is organized so code can write structured notes without needing a database:\n\n- \`INDEX.md\` links the main memory areas.\n- \`memory-policy.md\` defines what may be written and how.\n- \`user/\` stores user preferences and long-lived context.\n- \`teams/\` stores team definitions and roles.\n- \`missions/\` stores mission records and status notes.\n- \`workspaces/\` stores workspace-scoped context.\n- \`knowledge/\` stores durable reference knowledge.\n- \`work-log/\` stores the current running log of work.\n\nUse markdown files for simple, reviewable state. Keep entries small, factual, and easy to append.\n`,
  "INDEX.md": `# Memory Index\n\n## Core\n\n- [README](./README.md)\n- [Memory Policy](./memory-policy.md)\n\n## User\n\n- [User Preferences](./user/user-preferences.md)\n\n## Teams\n\n- [Teams Index](./teams/INDEX.md)\n- [Default Team](./teams/default-team.md)\n- [Captain Role](./teams/roles/captain.md)\n- [Researcher Role](./teams/roles/researcher.md)\n- [Builder Role](./teams/roles/builder.md)\n- [Reviewer Role](./teams/roles/reviewer.md)\n- [Tester Role](./teams/roles/tester.md)\n\n## Missions\n\n- [Missions Index](./missions/INDEX.md)\n\n## Workspaces\n\n- [Workspaces Index](./workspaces/INDEX.md)\n\n## Knowledge\n\n- [Knowledge Index](./knowledge/INDEX.md)\n\n## Work Log\n\n- [Current Work Log](./work-log/current.md)\n`,
  "memory-policy.md": `# Memory Policy\n\n## Purpose\n\n\`WIN_MEMORY\` is the durable, human-readable memory layer for the project.\n\n## Rules\n\n- Prefer concise markdown entries over large prose blocks.\n- Store stable facts, preferences, roles, and mission state here.\n- Append new work-log entries instead of rewriting history.\n- Keep one idea per file when the topic is naturally narrow.\n- Do not store secrets, tokens, or transient runtime noise.\n- When a file is missing, create it with starter content before writing to it.\n\n## Writing Style\n\n- Use plain language.\n- Keep headings stable so automated tools can link to them.\n- Make updates easy to review in git diffs.\n`,
  "user/user-preferences.md": `# User Preferences\n\n## Captured Preferences\n\n- Language: not yet captured\n- Team style: not yet captured\n- Work-log style: not yet captured\n\n## Notes\n\nUse this file for durable user-specific preferences that should influence future work.\n`,
  "teams/INDEX.md": `# Teams\n\nThis folder stores reusable team definitions.\n\n- \`default-team.md\` is the baseline team configuration.\n- \`roles/\` contains role descriptions used by team definitions.\n`,
  "teams/default-team.md": `# Default Team\n\n## Purpose\n\nThe default team is the shared working group used when no custom team is specified.\n\n## Roles\n\n- Captain\n- Researcher\n- Builder\n- Reviewer\n- Tester\n\n## Notes\n\nKeep the default team small and predictable so it can serve as the foundation for new missions.\n`,
  "teams/roles/captain.md": `# Captain\n\n## Responsibility\n\nOwn direction, scope, and coordination.\n\n## Expectations\n\n- Clarify the goal.\n- Keep the team aligned.\n- Make trade-offs explicit.\n`,
  "teams/roles/researcher.md": `# Researcher\n\n## Responsibility\n\nGather facts, constraints, and references before implementation.\n\n## Expectations\n\n- Verify assumptions.\n- Surface missing context.\n- Keep findings concise and traceable.\n`,
  "teams/roles/builder.md": `# Builder\n\n## Responsibility\n\nImplement the agreed work with the smallest correct change.\n\n## Expectations\n\n- Follow the plan.\n- Keep code and docs consistent.\n- Prefer simple, maintainable solutions.\n`,
  "teams/roles/reviewer.md": `# Reviewer\n\n## Responsibility\n\nCheck for correctness, regressions, and alignment with the plan.\n\n## Expectations\n\n- Read changes critically.\n- Call out risks clearly.\n- Prefer evidence over assumptions.\n`,
  "teams/roles/tester.md": `# Tester\n\n## Responsibility\n\nValidate behavior with automated checks and targeted manual review.\n\n## Expectations\n\n- Write or run focused tests.\n- Confirm failure before fix when practical.\n- Report results clearly.\n`,
  "missions/INDEX.md": `# Missions\n\nMission records live here.\n\n- Create one file per mission when mission tracking is needed.\n- Keep this index updated as new mission files are added.\n`,
  "workspaces/INDEX.md": `# Workspaces\n\nWorkspace-scoped context lives here.\n\n- Add one file per workspace or branch when needed.\n- Keep entries short and current.\n`,
  "knowledge/INDEX.md": `# Knowledge\n\nReference material lives here.\n\n- Use small notes for durable technical knowledge.\n- Prefer linking to source files when the answer already exists in code.\n`,
  "work-log/current.md": `# Current Work Log\n\n## Entries\n\n- Initialized work log.\n`
};

const DIRECTORIES = [
  "WIN_MEMORY",
  "WIN_MEMORY/user",
  "WIN_MEMORY/teams",
  "WIN_MEMORY/teams/roles",
  "WIN_MEMORY/missions",
  "WIN_MEMORY/workspaces",
  "WIN_MEMORY/knowledge",
  "WIN_MEMORY/work-log"
];

export class MemoryManager {
  constructor(private readonly rootPath: string) {}

  async ensureBaseStructure() {
    const memoryRoot = this.getMemoryRoot();

    await mkdir(memoryRoot, { recursive: true });

    for (const directory of DIRECTORIES) {
      await mkdir(join(this.rootPath, directory), { recursive: true });
    }

    for (const [relativePath, content] of Object.entries(BASE_FILES)) {
      await this.writeIfMissing(join(memoryRoot, relativePath), content);
    }
  }

  async appendWorkLog(line: string) {
    await this.ensureBaseStructure();

    const workLogPath = join(this.getMemoryRoot(), "work-log", "current.md");
    await appendFile(workLogPath, `${line}\n`, UTF8);
  }

  private async writeIfMissing(filePath: string, content: string) {
    try {
      await access(filePath);
    } catch {
      await writeFile(filePath, content, UTF8);
    }
  }

  private getMemoryRoot() {
    return join(this.rootPath, "WIN_MEMORY");
  }
}
