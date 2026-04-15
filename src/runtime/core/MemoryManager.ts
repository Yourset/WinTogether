import { access, appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const UTF8 = "utf8";

const MODULE_URL = import.meta.url;

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

export class MemoryManager {
  constructor(private readonly rootPath: string) {}

  async ensureBaseStructure() {
    await mkdir(this.getMemoryRoot(), { recursive: true });
    const templateRoot = await resolveTemplateRoot(MODULE_URL);

    for (const relativePath of TEMPLATE_FILES) {
      const targetPath = join(this.getMemoryRoot(), relativePath);
      await mkdir(join(this.getMemoryRoot(), dirname(relativePath)), { recursive: true });
      await this.writeIfMissing(targetPath, await this.readTemplate(templateRoot, relativePath));
    }
  }

  async appendWorkLog(line: string) {
    const entry = this.formatWorkLogEntry(line);
    await this.ensureBaseStructure();

    const workLogPath = join(this.getMemoryRoot(), "work-log", "current.md");
    await appendFile(workLogPath, `${entry}\n`, UTF8);
  }

  async readOverview() {
    await this.ensureBaseStructure();

    return {
      indexContent: await readFile(join(this.getMemoryRoot(), "INDEX.md"), UTF8),
      workLogContent: await readFile(join(this.getMemoryRoot(), "work-log", "current.md"), UTF8)
    };
  }

  private async writeIfMissing(filePath: string, content: string) {
    try {
      await access(filePath);
    } catch {
      await writeFile(filePath, content, UTF8);
    }
  }

  private async readTemplate(templateRoot: string, relativePath: string) {
    return readFile(join(templateRoot, relativePath), UTF8);
  }

  private formatWorkLogEntry(line: string) {
    const normalized = line.trim();
    if (!normalized) {
      throw new Error("Work log entries must not be empty");
    }

    if (/\r|\n/.test(normalized)) {
      throw new Error("Work log entries must be a single line");
    }

    return `- ${normalized}`;
  }

  private getMemoryRoot() {
    return join(this.rootPath, "WIN_MEMORY");
  }
}

export async function resolveTemplateRoot(moduleUrl: string = MODULE_URL) {
  const candidateRoots = [
    fileURLToPath(new URL("../../../WIN_MEMORY/", moduleUrl)),
    fileURLToPath(new URL("../WIN_MEMORY/", moduleUrl))
  ];

  for (const candidateRoot of candidateRoots) {
    try {
      await access(join(candidateRoot, "INDEX.md"));
      return resolve(candidateRoot);
    } catch {
      // Try the next layout.
    }
  }

  throw new Error(`Unable to locate WIN_MEMORY templates from ${moduleUrl}`);
}
