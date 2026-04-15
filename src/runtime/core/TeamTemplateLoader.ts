import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { TeamTemplate } from "../../shared/contracts/teamTemplate";
import { parseTeamTemplateJson } from "../../shared/contracts/teamTemplate";
import { resolveTemplateRoot } from "./MemoryManager";

const MODULE_URL = import.meta.url;
const TEMPLATE_FILE = join("teams", "templates", "default-software-team.json");

export async function loadDefaultTeamTemplate(moduleUrl: string = MODULE_URL): Promise<TeamTemplate> {
  const templateRoot = await resolveTeamTemplateRoot(moduleUrl);
  const templatePath = join(templateRoot, TEMPLATE_FILE);
  const rawTemplate = await readTemplateFile(templatePath);

  return parseTeamTemplateJson(rawTemplate, `default team template at ${templatePath}`);
}

async function resolveTeamTemplateRoot(moduleUrl: string = MODULE_URL) {
  return resolveTemplateRoot(moduleUrl);
}

async function readTemplateFile(templatePath: string): Promise<string> {
  try {
    return await readFile(templatePath, "utf8");
  } catch (error) {
    throw new Error(`Unable to read default team template at ${templatePath}: ${readErrorMessage(error)}`);
  }
}

function readErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}
