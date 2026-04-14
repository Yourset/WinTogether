# Win Together Subagent + Playwright Workflow

Date: 2026-04-15
Branch: `feature/v1-foundation`
Status: Active execution workflow

## 1. Current Goal

Win Together is no longer only optimizing for "a shell that opens".
The current goal is to establish a repeatable delivery loop where:

- feature work is pushed forward with subagents whenever tasks can be safely separated
- the lead agent reviews, integrates, and closes gaps instead of doing every step manually
- every meaningful feature pass is followed by automated user-experience testing
- the human reviewer only needs to step in for milestone acceptance, not every intermediate check

## 2. Standard Delivery Loop

All future implementation passes should follow this order unless a bug/debug situation requires a temporary deviation:

1. Refresh project memory and read the latest workflow/checkpoint files
2. Break the milestone into bounded tasks with clear ownership
3. Delegate implementation and/or verification tasks to subagents when practical
4. Integrate returned changes and resolve conflicts centrally
5. Run automated UX testing with Playwright
6. Capture screenshots and note failures or friction points
7. Apply fixes and re-run tests
8. Update `WIN_MEMORY` and checkpoint records
9. Commit and push the current stable checkpoint
10. Hand the build to the user for final acceptance

## 3. Playwright Testing Role

Playwright is not only a smoke-test tool for buttons and routes.
It is the standard UX regression layer for Win Together.

Playwright runs should aim to simulate real usage such as:

- a first-time user opening the product and understanding how to start
- entering a real mission goal and waiting for system feedback
- observing Team Room state changes while AI/CLI work is in progress
- seeing useful loading, success, and failure feedback instead of silent stalls

## 4. AI/CLI Test Discipline

Any Playwright coverage that touches AI or CLI behavior must:

- use longer timeouts than normal UI-only tests
- explicitly wait for visible state transitions
- capture screenshots at important intermediate states
- preserve enough output so failures can be diagnosed after the run

The purpose is not just "did the page render" but "does the product still feel usable while real work is happening".

## 5. Test Cleanup Rule

Before any manual run, Playwright run, or Electron validation pass:

- close stale Win Together windows
- close leftover Electron processes
- close stale browser/test windows created by previous runs

This cleanup rule exists to prevent stacked windows, stale preload state, and false positives from old sessions.

## 6. Subagent Responsibilities

The intended operating model is:

- implementation subagents: build bounded features or fixes
- testing subagents: run Playwright workflows, capture evidence, and report UX failures
- lead agent: assign work, review outcomes, integrate changes, update memory, and decide when a checkpoint is ready

Subagents should receive enough context to work independently, but the lead agent remains responsible for consistency and final quality.

## 7. Evidence and Memory

Every milestone should leave behind:

- updated work-log entries
- updated tester-facing checkpoint notes
- saved screenshots or explicit notes when screenshots were not needed
- a pushed commit representing the current stable checkpoint

This workflow is meant to reduce context loss and make long-running product iteration survivable even when session context gets compressed.

## 8. Immediate Next Use

This workflow should guide the next implementation phase where Win Together gains:

- browser-first development support where appropriate
- Playwright as a standard project testing path
- stronger automated UX regression after each feature pass
- clearer coordination between subagent implementation and subagent verification
