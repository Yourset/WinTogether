import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";
import { TeamTemplateRegistry } from "../../src/runtime/core/TeamTemplateRegistry";

describe("TeamTemplateRegistry", () => {
  it("lists built-in and generated templates from the template directory", async () => {
    const rootPath = await mkdtemp(join(tmpdir(), "team-template-registry-"));
    const memoryRoot = join(rootPath, "out", "WIN_MEMORY");
    const templateRoot = join(memoryRoot, "teams", "templates");

    await mkdir(memoryRoot, { recursive: true });
    await writeFile(join(memoryRoot, "INDEX.md"), "# Memory Index\n", "utf8");
    await mkdir(join(templateRoot, "generated"), { recursive: true });

    await writeFile(
      join(templateRoot, "default-software-team.json"),
      JSON.stringify({
        id: "default-software-team",
        name: "Default Software Team",
        summary: "A small software delivery team with a Captain and four specialist roles.",
        allowsDynamicExpansion: true,
        members: [
          {
            id: "captain",
            role: "captain",
            displayName: "Captain",
            description: "Owns direction, scope, and coordination.",
            primary: true
          },
          {
            id: "researcher",
            role: "researcher",
            displayName: "Researcher",
            description: "Clarifies requirements and gathers context.",
            primary: false
          }
        ]
      }),
      "utf8"
    );

    await writeFile(
      join(templateRoot, "generated", "game-dev-team.json"),
      JSON.stringify({
        id: "game-dev-team",
        name: "Game Dev Team",
        summary: "A generated team template for game development tasks.",
        allowsDynamicExpansion: false,
        members: [
          {
            id: "captain",
            role: "captain",
            displayName: "Captain",
            description: "Keeps the game development effort coordinated.",
            primary: true
          },
          {
            id: "builder",
            role: "builder",
            displayName: "Builder",
            description: "Implements gameplay and systems changes.",
            primary: false
          }
        ]
      }),
      "utf8"
    );

    const moduleUrl = pathToFileURL(join(rootPath, "out", "main", "main.js")).toString();
    const registry = new TeamTemplateRegistry(moduleUrl);

    const templates = await registry.listAvailableTemplates();

    expect(templates).toHaveLength(2);
    expect(templates[0]).toMatchObject({
      id: "default-software-team",
      origin: "built-in",
      default: true,
      relativePath: "teams/templates/default-software-team.json"
    });
    expect(templates[1]).toMatchObject({
      id: "game-dev-team",
      origin: "generated",
      default: false,
      relativePath: "teams/templates/generated/game-dev-team.json"
    });
  });

  it("loads a template by id from the registry", async () => {
    const rootPath = await mkdtemp(join(tmpdir(), "team-template-registry-load-"));
    const memoryRoot = join(rootPath, "out", "WIN_MEMORY");
    const templateRoot = join(memoryRoot, "teams", "templates");

    await mkdir(memoryRoot, { recursive: true });
    await writeFile(join(memoryRoot, "INDEX.md"), "# Memory Index\n", "utf8");
    await mkdir(templateRoot, { recursive: true });
    await writeFile(
      join(templateRoot, "default-software-team.json"),
      JSON.stringify({
        id: "default-software-team",
        name: "Default Software Team",
        summary: "A small software delivery team with a Captain and four specialist roles.",
        allowsDynamicExpansion: true,
        members: [
          {
            id: "captain",
            role: "captain",
            displayName: "Captain",
            description: "Owns direction, scope, and coordination.",
            primary: true
          }
        ]
      }),
      "utf8"
    );

    const moduleUrl = pathToFileURL(join(rootPath, "out", "main", "main.js")).toString();
    const registry = new TeamTemplateRegistry(moduleUrl);
    const template = await registry.loadTemplate("default-software-team");

    expect(template).toMatchObject({
      id: "default-software-team",
      name: "Default Software Team",
      allowsDynamicExpansion: true
    });
  });
});
