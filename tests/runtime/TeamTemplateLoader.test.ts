import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";
import { loadDefaultTeamTemplate } from "../../src/runtime/core/TeamTemplateLoader";

describe("TeamTemplateLoader", () => {
  it("loads the default software team template from WIN_MEMORY", async () => {
    const template = await loadDefaultTeamTemplate();

    expect(template.id).toBe("default-software-team");
    expect(template.name).toBe("Default Software Team");
    expect(template.members).toHaveLength(5);
    expect(template.members[0]).toMatchObject({
      id: "captain",
      role: "captain",
      displayName: "Captain",
      primary: true
    });
  });

  it("rejects invalid template structures with a clear error", async () => {
    const rootPath = await mkdtemp(join(tmpdir(), "team-template-loader-invalid-"));
    const memoryRoot = join(rootPath, "out", "WIN_MEMORY");
    const templateRoot = join(memoryRoot, "teams", "templates");

    await mkdir(memoryRoot, { recursive: true });
    await writeFile(join(memoryRoot, "INDEX.md"), "# Memory Index\n", "utf8");
    await mkdir(templateRoot, { recursive: true });
    await writeFile(
      join(templateRoot, "default-software-team.json"),
      JSON.stringify({
        id: "broken-team",
        name: "Broken Team",
        summary: "A team with no primary captain.",
        allowsDynamicExpansion: true,
        members: [
          {
            id: "captain",
            role: "captain",
            displayName: "Captain",
            description: "Owns direction, scope, and coordination.",
            primary: false
          }
        ]
      }),
      "utf8"
    );

    const moduleUrl = pathToFileURL(join(rootPath, "out", "main", "main.js")).toString();

    await expect(loadDefaultTeamTemplate(moduleUrl)).rejects.toThrow(
      "must define exactly one primary member"
    );
  });

  it("rejects malformed JSON with a clear error", async () => {
    const rootPath = await mkdtemp(join(tmpdir(), "team-template-loader-json-"));
    const memoryRoot = join(rootPath, "out", "WIN_MEMORY");
    const templateRoot = join(memoryRoot, "teams", "templates");

    await mkdir(memoryRoot, { recursive: true });
    await writeFile(join(memoryRoot, "INDEX.md"), "# Memory Index\n", "utf8");
    await mkdir(templateRoot, { recursive: true });
    await writeFile(join(templateRoot, "default-software-team.json"), "{ not valid json", "utf8");

    const moduleUrl = pathToFileURL(join(rootPath, "out", "main", "main.js")).toString();

    await expect(loadDefaultTeamTemplate(moduleUrl)).rejects.toThrow("invalid JSON");
  });
});
