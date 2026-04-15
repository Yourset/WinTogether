import { readdir, readFile } from "node:fs/promises";
import { basename, join, relative, sep } from "node:path";
import type {
  TeamTemplate,
  TeamTemplateCatalogEntry,
  TeamTemplateOrigin
} from "../../shared/contracts/teamTemplate";
import { parseTeamTemplateJson } from "../../shared/contracts/teamTemplate";
import { resolveTemplateRoot } from "./MemoryManager";

const MODULE_URL = import.meta.url;
const TEMPLATE_DIRECTORY = join("teams", "templates");
const DEFAULT_TEMPLATE_ID = "default-software-team";

export class TeamTemplateRegistry {
  constructor(public readonly moduleUrl: string = MODULE_URL) {}

  async listAvailableTemplates(): Promise<TeamTemplateCatalogEntry[]> {
    const templateRoot = await resolveTemplateRoot(this.moduleUrl);
    const templateDirectory = join(templateRoot, TEMPLATE_DIRECTORY);
    const templatePaths = await this.collectTemplateFiles(templateDirectory);

    const templates = await Promise.all(
      templatePaths.map(async (templatePath) => this.readTemplateCatalogEntry(templateRoot, templatePath))
    );

    return templates.sort((left, right) => {
      if (left.default !== right.default) {
        return left.default ? -1 : 1;
      }

      return left.relativePath.localeCompare(right.relativePath, "en");
    });
  }

  async loadTemplate(templateId: string): Promise<TeamTemplate> {
    const templateRoot = await resolveTemplateRoot(this.moduleUrl);
    const templateDirectory = join(templateRoot, TEMPLATE_DIRECTORY);
    const templatePaths = await this.collectTemplateFiles(templateDirectory);

    const directMatch = templatePaths.find((templatePath) => {
      return basename(templatePath, ".json") === templateId;
    });

    if (directMatch) {
      return this.readTemplate(directMatch);
    }

    const availableTemplates = await this.listAvailableTemplates();
    const availableTemplateList = availableTemplates.length
      ? `Available templates: ${availableTemplates
          .map((template) => `${template.id} (${template.relativePath})`)
          .join(", ")}`
      : "No templates were found.";

    throw new Error(
      `Unable to locate team template "${templateId}" under ${templateDirectory}. ${availableTemplateList}`
    );
  }

  async loadDefaultTemplate(): Promise<TeamTemplate> {
    return this.loadTemplate(DEFAULT_TEMPLATE_ID);
  }

  private async readTemplateCatalogEntry(
    templateRoot: string,
    templatePath: string
  ): Promise<TeamTemplateCatalogEntry> {
    const template = await this.readTemplate(templatePath);

    return {
      id: template.id,
      name: template.name,
      summary: template.summary,
      origin: this.inferOrigin(templatePath),
      relativePath: this.toRelativePath(templateRoot, templatePath),
      default: template.id === DEFAULT_TEMPLATE_ID
    };
  }

  private async readTemplate(templatePath: string): Promise<TeamTemplate> {
    const rawTemplate = await this.readTemplateFile(templatePath);
    return parseTeamTemplateJson(rawTemplate, `team template at ${templatePath}`);
  }

  private async collectTemplateFiles(templateDirectory: string): Promise<string[]> {
    const entries = await this.readDirectory(templateDirectory);
    const templateFiles: string[] = [];

    for (const entry of entries) {
      const entryPath = join(templateDirectory, entry.name);

      if (entry.isDirectory()) {
        templateFiles.push(...(await this.collectTemplateFiles(entryPath)));
        continue;
      }

      if (entry.isFile() && entry.name.endsWith(".json")) {
        templateFiles.push(entryPath);
      }
    }

    return templateFiles.sort((left, right) => left.localeCompare(right, "en"));
  }

  private async readDirectory(directoryPath: string) {
    try {
      return await readdir(directoryPath, { withFileTypes: true });
    } catch (error) {
      if (isMissingDirectory(error)) {
        return [];
      }

      throw new Error(
        `Unable to read team template directory at ${directoryPath}: ${readErrorMessage(error)}`
      );
    }
  }

  private inferOrigin(templatePath: string): TeamTemplateOrigin {
    return templatePath.includes(`${sep}generated${sep}`) ? "generated" : "built-in";
  }

  private toRelativePath(templateRoot: string, templatePath: string): string {
    return relative(templateRoot, templatePath).replace(/\\/g, "/");
  }

  private async readTemplateFile(templatePath: string): Promise<string> {
    try {
      return await readFile(templatePath, "utf8");
    } catch (error) {
      throw new Error(`Unable to read team template at ${templatePath}: ${readErrorMessage(error)}`);
    }
  }
}

function isMissingDirectory(error: unknown): boolean {
  return error instanceof Error && "code" in error && (error as NodeJS.ErrnoException).code === "ENOENT";
}

function readErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}
