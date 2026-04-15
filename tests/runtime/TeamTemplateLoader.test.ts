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
});
