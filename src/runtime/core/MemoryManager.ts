import { access, appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const UTF8 = "utf8";

const TEMPLATE_ROOT = fileURLToPath(new URL("../../../WIN_MEMORY/", import.meta.url));

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
  "missions/INDEX.md",
  "workspaces/INDEX.md",
  "knowledge/INDEX.md",
  "work-log/current.md"
];

export class MemoryManager {
  constructor(private readonly rootPath: string) {}

  async ensureBaseStructure() {
    await mkdir(this.getMemoryRoot(), { recursive: true });

    for (const relativePath of TEMPLATE_FILES) {
      const targetPath = join(this.getMemoryRoot(), relativePath);
      await mkdir(join(this.getMemoryRoot(), dirname(relativePath)), { recursive: true });
      await this.writeIfMissing(targetPath, await this.readTemplate(relativePath));
    }
  }

  async appendWorkLog(line: string) {
    await this.ensureBaseStructure();

    const workLogPath = join(this.getMemoryRoot(), "work-log", "current.md");
    const entry = this.formatWorkLogEntry(line);
    await appendFile(workLogPath, `${entry}\n`, UTF8);
  }

  private async writeIfMissing(filePath: string, content: string) {
    try {
      await access(filePath);
    } catch {
      await writeFile(filePath, content, UTF8);
    }
  }

  private async readTemplate(relativePath: string) {
    return readFile(join(TEMPLATE_ROOT, relativePath), UTF8);
  }

  private formatWorkLogEntry(line: string) {
    const normalized = line.trim();
    if (!normalized) {
      throw new Error("Work log entries must not be empty");
    }

    return `- ${normalized}`;
  }

  private getMemoryRoot() {
    return join(this.rootPath, "WIN_MEMORY");
  }
}
