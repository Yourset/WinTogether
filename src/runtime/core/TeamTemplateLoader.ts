import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join, resolve } from "node:path";
import type { TeamTemplate } from "../../shared/contracts/teamTemplate";

const MODULE_URL = import.meta.url;
const TEMPLATE_FILE = join("teams", "templates", "default-software-team.json");

export async function loadDefaultTeamTemplate(moduleUrl: string = MODULE_URL): Promise<TeamTemplate> {
  const templateRoot = await resolveTeamTemplateRoot(moduleUrl);
  const rawTemplate = await readFile(join(templateRoot, TEMPLATE_FILE), "utf8");
  return JSON.parse(rawTemplate) as TeamTemplate;
}

async function resolveTeamTemplateRoot(moduleUrl: string = MODULE_URL) {
  const candidateRoots = [
    fileURLToPath(new URL("../../../WIN_MEMORY/", moduleUrl)),
    fileURLToPath(new URL("../WIN_MEMORY/", moduleUrl))
  ];

  for (const candidateRoot of candidateRoots) {
    try {
      await access(join(candidateRoot, TEMPLATE_FILE));
      return resolve(candidateRoot);
    } catch {
      // Try the next layout.
    }
  }

  throw new Error(`Unable to locate the default team template from ${moduleUrl}`);
}
