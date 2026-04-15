import type { AgentRole } from "./agent";

export interface TeamTemplateMember {
  id: string;
  role: AgentRole;
  displayName: string;
  description: string;
  primary: boolean;
}

export interface TeamTemplate {
  id: string;
  name: string;
  summary: string;
  allowsDynamicExpansion: boolean;
  members: TeamTemplateMember[];
}

export type TeamTemplateOrigin = "built-in" | "generated";

export interface TeamTemplateCatalogEntry {
  id: string;
  name: string;
  summary: string;
  origin: TeamTemplateOrigin;
  relativePath: string;
  default: boolean;
}

export class TeamTemplateValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TeamTemplateValidationError";
  }
}

const VALID_TEAM_ROLES: ReadonlySet<AgentRole> = new Set([
  "captain",
  "researcher",
  "builder",
  "reviewer",
  "tester"
]);

export function parseTeamTemplateJson(
  rawTemplate: string,
  sourceDescription = "team template"
): TeamTemplate {
  let parsedTemplate: unknown;

  try {
    parsedTemplate = JSON.parse(rawTemplate);
  } catch (error) {
    throw new TeamTemplateValidationError(
      `${sourceDescription}: invalid JSON (${readErrorMessage(error)})`
    );
  }

  return validateTeamTemplate(parsedTemplate, sourceDescription);
}

export function validateTeamTemplate(
  candidate: unknown,
  sourceDescription = "team template"
): TeamTemplate {
  if (!isRecord(candidate)) {
    throw new TeamTemplateValidationError(`${sourceDescription}: expected an object`);
  }

  const templateId = readRequiredString(candidate.id, `${sourceDescription}.id`);
  const templateName = readRequiredString(candidate.name, `${sourceDescription}.name`);
  const templateSummary = readRequiredString(candidate.summary, `${sourceDescription}.summary`);
  const allowsDynamicExpansion = readRequiredBoolean(
    candidate.allowsDynamicExpansion,
    `${sourceDescription}.allowsDynamicExpansion`
  );

  if (!Array.isArray(candidate.members)) {
    throw new TeamTemplateValidationError(`${sourceDescription}.members must be an array`);
  }

  if (candidate.members.length === 0) {
    throw new TeamTemplateValidationError(
      `${sourceDescription}.members must contain at least one member`
    );
  }

  const seenMemberIds = new Set<string>();
  let primaryMemberCount = 0;

  const members = candidate.members.map((member, index) => {
    const memberSourceDescription = `${sourceDescription}.members[${index}]`;

    if (!isRecord(member)) {
      throw new TeamTemplateValidationError(
        `${memberSourceDescription} must be an object`
      );
    }

    const memberId = readRequiredString(member.id, `${memberSourceDescription}.id`);
    const role = readTeamRole(member.role, `${memberSourceDescription}.role`);
    const displayName = readRequiredString(
      member.displayName,
      `${memberSourceDescription}.displayName`
    );
    const description = readRequiredString(
      member.description,
      `${memberSourceDescription}.description`
    );
    const primary = readRequiredBoolean(member.primary, `${memberSourceDescription}.primary`);

    if (seenMemberIds.has(memberId)) {
      throw new TeamTemplateValidationError(
        `${memberSourceDescription}.id must be unique; "${memberId}" is duplicated`
      );
    }

    seenMemberIds.add(memberId);

    if (primary) {
      primaryMemberCount += 1;

      if (role !== "captain") {
        throw new TeamTemplateValidationError(
          `${memberSourceDescription}.primary can only be true for the captain role`
        );
      }
    }

    return {
      id: memberId,
      role,
      displayName,
      description,
      primary
    };
  });

  if (primaryMemberCount !== 1) {
    throw new TeamTemplateValidationError(
      `${sourceDescription}.members must define exactly one primary member; found ${primaryMemberCount}`
    );
  }

  return {
    id: templateId,
    name: templateName,
    summary: templateSummary,
    allowsDynamicExpansion,
    members
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readRequiredString(value: unknown, sourceDescription: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TeamTemplateValidationError(`${sourceDescription} must be a non-empty string`);
  }

  return value.trim();
}

function readRequiredBoolean(value: unknown, sourceDescription: string): boolean {
  if (typeof value !== "boolean") {
    throw new TeamTemplateValidationError(`${sourceDescription} must be a boolean`);
  }

  return value;
}

function readTeamRole(value: unknown, sourceDescription: string): AgentRole {
  if (typeof value !== "string") {
    throw new TeamTemplateValidationError(`${sourceDescription} must be a string`);
  }

  const normalizedRole = value.trim();

  if (!VALID_TEAM_ROLES.has(normalizedRole as AgentRole)) {
    throw new TeamTemplateValidationError(
      `${sourceDescription} must be one of ${Array.from(VALID_TEAM_ROLES).join(", ")}`
    );
  }

  return normalizedRole as AgentRole;
}

function readErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}
