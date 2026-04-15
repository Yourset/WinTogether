# Win Together Team Template System Design

Date: 2026-04-15
Status: Proposed design

## 1. Design Summary

Win Together should move team composition out of hardcoded runtime logic and into template files.

The product should support three layers:

1. built-in reusable team templates
2. user-created or AI-generated templates saved alongside built-ins
3. optional mission-level overrides applied at runtime

The default user flow should remain lightweight:

- the user opens Win Together
- the user gives a goal
- Win Together uses a default team template unless the user explicitly switches
- Captain still orchestrates the mission, but the available roles and default behavior come from the template

This keeps the v1 entry flow simple while making the team system extensible.

## 2. Goals

### 2.1 Primary goals

- stop hardcoding team composition in runtime code
- make team setup inspectable, editable, and reusable
- let AI generate new templates later without changing the runtime model
- preserve the current lightweight first-use flow
- support future domain-specific teams such as frontend, game-dev, or review-heavy teams

### 2.2 Non-goals for the first version

- a full visual template editor
- multi-user template sharing or cloud sync
- arbitrary scripting inside templates
- automatic AI template generation UI in the first implementation pass

## 3. Recommended User Model

The system should use a hidden default template first, not force template selection at mission start.

This matches the current product direction:

- first-use stays simple
- advanced customization is available when needed
- future AI-generated templates can become selectable without rewriting the launch flow

The effective model is:

- `default template` for normal mission start
- `template library` for manual switching and future expansion
- `generated templates` saved into the same library
- `mission overrides` for one-off adjustments

## 4. Template Storage Model

Templates should live in a dedicated directory under project memory/config assets.

Recommended structure:

```text
WIN_MEMORY/
  teams/
    INDEX.md
    templates/
      default-software-team.json
      frontend-team.json
      game-dev-team.json
      generated/
        <template-id>.json
```

This keeps templates close to the existing memory system and makes them easy to inspect, version, and later generate with AI.

## 5. Template File Shape

The first version should use structured JSON.

Recommended shape:

```json
{
  "id": "default-software-team",
  "name": "Default Software Team",
  "description": "Captain-led general software development team.",
  "version": 1,
  "captain": {
    "name": "Captain",
    "role": "captain",
    "status": "planning",
    "prompt": "Lead the mission, recruit specialists, summarize progress."
  },
  "workers": [
    {
      "id": "researcher",
      "name": "Researcher",
      "role": "researcher",
      "defaultStatus": "running",
      "prompt": "Inspect codebase, compare options, identify risks."
    },
    {
      "id": "builder",
      "name": "Builder",
      "role": "builder",
      "defaultStatus": "idle",
      "prompt": "Implement approved changes and report outcomes."
    }
  ],
  "runtime": {
    "allowDynamicExpansion": true,
    "defaultActiveWorkers": ["researcher", "builder"]
  }
}
```

The first version should keep this schema intentionally narrow:

- template identity
- Captain definition
- worker definitions
- lightweight runtime policy
- prompt fragments per role

This is enough for the next implementation pass without over-engineering.

## 6. Runtime Resolution Rules

The runtime should no longer decide team members from code constants alone.
Instead, mission start should follow this order:

1. load the default template
2. optionally apply a user-selected template if one exists
3. optionally apply a mission-level override object
4. materialize Captain and worker records from the resolved template
5. publish spawned-agent events from that resolved team definition

This keeps the runtime deterministic and traceable.

## 7. Captain and Template Relationship

Captain remains the orchestration authority, but templates define the starting team contract.

That means:

- templates define which roles exist initially
- templates define default names, statuses, and prompts
- Captain still decides how to use those specialists
- if dynamic expansion is allowed, Captain may later add more compatible specialists during runtime

So templates define the initial team shape, while Captain defines the live orchestration.

## 8. AI-Generated Templates

AI-generated templates should be treated as a future extension of the same system, not a separate feature model.

The intended long-term loop is:

1. user describes the type of team they want
2. Win Together calls a model such as Codex to generate a structured template
3. the generated file is validated against the team-template schema
4. the template is saved into `WIN_MEMORY/teams/templates/generated/`
5. the template becomes selectable like any other template

This is why the first version should invest in file-based templates first.

If the file format is stable, AI generation becomes a natural next step instead of a separate architecture problem.

## 9. Product Integration for v1

The first implementation should add templates with minimal UI impact.

Recommended v1 integration:

- keep a default template active by default
- do not force template selection before mission start
- load the default template automatically for every mission
- expose template choice later as an optional control in the home screen or settings

This avoids making the current launch flow heavier while still moving the team system onto the correct architecture.

## 10. Testing Impact

The first implementation should add coverage for:

- template file loading
- invalid template handling
- runtime materialization from template data
- Team Room roster rendering from template-derived agents
- first-use path continuing to work with the default template

Browser bridge fixtures should also be updated to mirror template-driven team data so browser and Electron test surfaces stay conceptually aligned.

## 11. Acceptance Criteria

This design is successful if the next implementation can do the following:

1. load a default team template from disk
2. build Captain and worker records from that template
3. show those members in Team Room instead of hardcoded role lists
4. keep mission start working without forcing extra user steps
5. leave a clear path for later AI-generated templates

## 12. Decision Summary

- use file-based templates instead of hardcoded team definitions
- start with JSON templates
- keep a hidden default template for the normal first-use flow
- allow future AI-generated templates to save into the same library
- let Captain orchestrate from the template instead of replacing Captain with template logic
