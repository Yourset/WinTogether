# Win Together v1 Design

Date: 2026-04-14
Status: Approved design baseline

## 1. Product Summary

Win Together is a desktop AI team workspace for software development. The product is built around a `Team Room` where a user gives a goal to a `Captain` agent, and the Captain dynamically organizes specialist agents to complete the work.

The primary value is not model novelty. The primary value is orchestration, visibility, continuity, and usability:

- The user can watch the team work in real time.
- The user can understand why work is being split and what each agent is doing.
- The user can intervene naturally through conversation.
- The system remembers important context across missions and workspaces.

Win Together v1 is `Codex-first`. Internally, the product should keep a hybrid runtime architecture, but all real execution in v1 is routed through `Codex CLI`.

## 2. Product Goals

### 2.1 Core goals

- Make AI team collaboration feel understandable, visible, and trustworthy.
- Let a user hand a real software goal to an AI team instead of manually driving every step.
- Preserve the full working narrative through a chat-first interface.
- Keep enough structured context around the chat so the user can quickly understand the current state.
- Build a stable memory foundation that supports both Win Together development and future in-product team memory.

### 2.2 Non-goals for v1

- Building a general-purpose model platform first.
- Replacing coding agents like Codex CLI with a custom coding runtime.
- Building a heavy project-management system with kanban-first interaction.
- Shipping a full cloud account system or complex multi-user collaboration in v1.
- Building an advanced vector-memory system before a stable document-based memory model exists.

## 3. Target User Experience

The user should feel like they entered an AI team operations room, not a settings-heavy agent builder.

The default flow is:

1. The user opens Win Together and selects a local workspace.
2. The user enters a Team Room.
3. The user tells the Captain what they want.
4. The Captain interprets the request, proposes an initial plan, and starts organizing the team.
5. Specialist agents are created dynamically when needed.
6. The user watches the work unfold through a chat-first timeline.
7. The user can interrupt, redirect, request summaries, or ask the team to continue.
8. The system records important decisions and context into persistent memory.

The product should feel high-autonomy by default, while still keeping the user informed and able to intervene.

## 4. Core Interaction Model

### 4.1 Team-first

The product is centered on a `Team Room`, not a task board and not a model picker.

The user does not begin by assembling a team manually. The user begins by stating the goal. Team composition emerges from the Captain's planning and orchestration.

### 4.2 Chat-first

The main screen is a conversation stream. This is the primary product surface because the user needs enough context to understand what the AI team is actually doing.

Pure status indicators are not enough. The user must be able to see:

- why the Captain split work a certain way
- what each specialist is currently doing
- how agents hand work to each other
- why a path was accepted or rejected
- where the current block is

### 4.3 Status as support, not replacement

The product may include structured side panels and compact status indicators, but those exist to support the chat stream, not replace it.

Any status representation should be traceable back to the relevant conversational and execution context.

## 5. UI Surface for v1

Win Together v1 should ship with four primary pages.

### 5.1 Home / Team Launcher

Purpose:

- show recent Team Rooms
- start a new session
- attach or choose a local workspace
- reopen an earlier mission

### 5.2 Team Room

This is the main page and the center of the product.

Suggested layout:

- center: unified message timeline
- left: team roster and current active agents
- right: lightweight context and status panel
- bottom: mission input and control actions

### 5.3 Mission History

Purpose:

- browse past missions
- review final summaries
- inspect key decisions
- revisit related outputs and artifacts

This page is for historical continuity, not full project management.

### 5.4 Memory / Context Viewer

Purpose:

- inspect what the system remembers
- review mission, workspace, and team context
- verify memory quality
- support trust and debugging

The first version may be read-first with only limited editing.

## 6. Team Room Message Model

The Team Room should present a single readable timeline that merges collaboration and execution into one narrative stream.

### 6.1 Message types

The stream should support at least these message types:

- `User Message`: user goals, corrections, constraints, follow-ups
- `Captain Update`: plans, decisions, summaries, escalations, phase changes
- `Worker Update`: specialist progress, results, handoffs, blockers
- `Execution Event`: commands, file changes, tests, task transitions
- `Memory Event`: important information written into memory
- `System Alert`: failures, environment problems, pauses, wait states

### 6.2 Readability rules

Messages should be written as understandable collaboration records, not raw logs.

Each important message should make clear:

- what is happening
- why it matters
- which subtask or phase it belongs to
- what output or artifact it references
- whether it needs user attention

### 6.3 Role voice separation

- `Captain` messages should feel like planning, delegation, evaluation, and synthesis.
- `Worker` messages should feel factual, task-scoped, and operational.

This distinction helps the user quickly understand the hierarchy and flow of work.

## 7. Agent Model

### 7.1 Core principle

The user should not manually configure the full team before work begins. The user talks to the Captain first. The Captain decides how to form the team based on the goal.

### 7.2 Built-in role templates

Win Together v1 should include a built-in template library for specialist agents. These are templates, not mandatory pre-created members.

Recommended baseline templates:

- `Captain`
- `Researcher`
- `Builder`
- `Reviewer`
- `Tester`

### 7.3 Dynamic team formation

The Captain is responsible for:

- deciding whether more agents are needed
- choosing the relevant specialist templates
- spawning agents when useful
- adding agents later if scope expands or execution changes
- integrating specialist output into a coherent direction for the user

This should make the team feel alive and adaptive rather than statically configured.

## 8. Orchestration Rules for v1

### 8.1 High-autonomy default

Win Together v1 should optimize for autonomous forward progress.

Default behavior:

- the Captain interprets the mission
- the Captain creates an initial plan
- the Captain delegates selectively
- the Captain continues the workflow without asking for approval at every step
- the Captain escalates only at meaningful uncertainty or risk points

### 8.2 Delegation discipline

The Captain should avoid chaotic over-spawning.

Recommended v1 rules:

- do not spawn specialists unless they create clear value
- keep simultaneous active specialists small by default
- assign each specialist a clear scope
- require all specialist output to flow back through the Captain

The goal is a readable team, not a noisy swarm.

### 8.3 User controls

Even in high-autonomy mode, the user should be able to:

- interrupt the current direction
- add constraints
- request a re-plan
- request a summary
- pause a specialist
- ask the team to stop and explain the current state
- ask for important context to be written into memory

## 9. Runtime Architecture

### 9.1 Architecture strategy

Win Together should use a hybrid architecture internally, but all execution in v1 should go through `Codex CLI`.

This means:

- runtime interfaces remain provider-agnostic
- real execution remains CLI-first
- the system does not attempt to replace specialized coding agents

### 9.2 Guiding principle

Win Together should not compete with `Codex CLI`, `Claude Code`, or similar tools on raw coding execution quality.

Instead, Win Together should provide:

- orchestration
- coordination
- context routing
- visibility
- memory
- human intervention surfaces

### 9.3 Suggested architecture layers

```text
Electron App
  Renderer
    Team Room
    Mission History
    Memory Viewer
    Workspace Launcher

  Main Process
    IPC
    Window management
    Filesystem access
    process management
    local credential/session handling

  Local Runtime Core
    Mission Orchestrator
    Agent Runtime Adapter
      CodexCliAdapter
    Event Bus
    Memory Manager
    Workspace Manager
    Transcript / Artifact Store
```

### 9.4 Key runtime modules

`Mission Orchestrator`

- owns mission lifecycle
- decides when the Captain acts
- decides when specialists are created
- tracks current phase and task ownership
- coordinates summaries and memory writes

`Agent Runtime Adapter`

- defines the internal agent interface
- normalizes execution outputs into product events
- enables future providers without changing the full UI model

`CodexCliAdapter`

- the only production execution backend in v1
- launches and supervises Codex CLI tasks
- emits normalized events to the product

`Event Bus`

- the backbone of the Team Room
- allows chat, status, execution, and memory updates to appear in one unified stream

`Memory Manager`

- reads and writes document-based memory
- exposes memory lookups to orchestrator and agents
- records traceable memory events for the UI

`Workspace Manager`

- manages local project attachment
- tracks directory, commands, constraints, and artifacts
- ensures missions remain grounded in a real workspace

## 10. Codex-first Execution Policy

Win Together v1 should treat `Codex CLI` as the execution authority for development work.

This policy exists for three reasons:

1. Codex CLI already contains a stronger coding workflow than a fresh custom implementation.
2. The product should focus on team coordination rather than rebuilding a coding agent from scratch.
3. The current user already has strong Codex access value and wants to maximize it.

The product may later support additional execution backends, but v1 should optimize around Codex-first reliability and experience.

## 11. Memory System v1

### 11.1 Memory philosophy

Memory v1 should be document-based, stable, explicit, and inspectable.

The system should avoid black-box memory behavior in v1. The user and the developers should be able to understand:

- what was remembered
- why it was remembered
- where it was stored
- when it may be used again

### 11.2 Memory directory

Recommended canonical root:

```text
WIN_MEMORY/
  README.md
  INDEX.md
  memory-policy.md

  user/
    user-preferences.md

  teams/
    INDEX.md
    default-team.md
    roles/
      captain.md
      researcher.md
      builder.md
      reviewer.md
      tester.md

  missions/
    INDEX.md
    active/
      <mission-id>/
        mission.md
        decisions.md
        handoffs.md
        artifacts.md
        summary.md
    archive/

  workspaces/
    INDEX.md
    <workspace-id>/
      workspace-profile.md
      commands.md
      constraints.md
      known-issues.md

  knowledge/
    INDEX.md
    product/
    engineering/
    orchestration/
    ux/

  work-log/
    current.md
    archive/

  snapshots/
    INDEX.md
```

### 11.3 Memory layers

The system should explicitly support five memory layers:

- `User Memory`
- `Team Memory`
- `Mission Memory`
- `Workspace Memory`
- `Episode / Knowledge Memory`

These do not need separate storage engines in v1. They can be implemented through the directory and document model above.

### 11.4 Write policy

v1 should use controlled writing rules.

- `User Memory`: update only when the user clearly expresses a preference
- `Team Memory`: update when team structure or team operating conventions are confirmed
- `Mission Memory`: update at mission creation, major decisions, stage transitions, and completion
- `Workspace Memory`: update when real project constraints or commands are confirmed
- `Knowledge`: write only when an insight is reusable across missions or workspaces
- `Work Log`: record operational summaries continuously, but keep them concise

The Captain should be the main memory writer. Specialists may suggest memory-worthy information, but they should not freely mutate long-term memory in v1.

### 11.5 Read policy

Memory access should be rule-based before it becomes retrieval-heavy.

Suggested Captain read order for a new mission:

1. `user/user-preferences.md`
2. active team definition
3. team role definitions
4. related workspace profile
5. relevant recent mission summaries
6. matching knowledge entries
7. recent work log

Specialists should read narrower memory slices based on role.

### 11.6 Chat-memory relationship

Chat history is not the same thing as memory.

The Team Room shows the process. Memory stores distilled reusable context.

v1 should support traceability between the two:

- important messages can be marked as written into memory
- memory-backed reasoning can be surfaced in the Team Room
- users can inspect where remembered context came from

## 12. MVP Scope

### 12.1 Must-have v1 capabilities

- attach a local workspace
- create and reopen Team Rooms
- chat-first mission flow
- Captain-first interaction
- dynamic specialist creation by the Captain
- Codex CLI based execution
- unified event stream in Team Room
- lightweight status/context support panel
- document-based memory writes and reads
- mission continuation
- user interruption and redirection

### 12.2 Explicit v1 exclusions

- advanced multi-provider switching
- full OAuth-first account system
- heavy workflow builder UI
- complex kanban or gantt project surfaces
- autonomous black-box vector memory
- plugin marketplace depth
- full multi-user cloud collaboration

## 13. Future Expansion Paths

This design intentionally keeps room for:

- additional CLI adapters such as Claude Code
- additional model/provider adapters
- richer memory retrieval
- shared team templates
- stronger approval workflows
- cloud sync and collaboration

These should be added only after the v1 core loop is proven.

## 14. Acceptance Criteria for the Design

The design is successful if Win Together v1 can support this baseline scenario:

1. A user attaches a local workspace.
2. The user opens a Team Room and gives a real development goal.
3. The Captain creates an initial plan.
4. The Captain dynamically recruits specialists as needed.
5. Specialists execute work through Codex CLI.
6. The user can observe the process in a readable unified timeline.
7. The user can interrupt and redirect at any point.
8. The system records important context into memory.
9. The user can later return and continue the mission with retained context.

## 15. Design Decision Summary

- Team-first over task-board-first
- chat-first over card-first
- high-autonomy over approval-heavy operation
- Captain-led dynamic team formation over manual pre-configuration
- hybrid internal architecture with CLI-first v1 execution
- Codex-first over custom coding runtime
- document-based memory over opaque memory automation
- lightweight status support over heavy project management UI
