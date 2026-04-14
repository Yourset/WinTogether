# Win Together Foundation Checkpoint

Date: 2026-04-14
Branch: `feature/v1-foundation`
Status: Alpha usability checkpoint

## 1. Current Product State

The branch has moved beyond the first shell-only milestone and is now a clearer manual-test checkpoint for Win Together.

Implemented in the current build:

- Electron + React desktop shell with Chinese-first UI and optional English switch
- Light-theme desktop shell with a left-sidebar workbench layout
- Direct mission entry flow from the home screen
- Persisted recent mission summaries backed by `TranscriptStore`
- Visible `Codex CLI` health status in the sidebar using a real `codex --version` check
- Standalone `Codex CLI` smoke-test action on the home page with visible success/failure output
- Team Room timeline sourced from a structured mission event snapshot
- Mission start now appends a real first Codex CLI response into the Team Room timeline
- Browser-bridge-driven waiting states now keep the UI visibly alive during smoke tests and mission starts, and Playwright captures mid-wait screenshots for the first-user journey
- Browser-first Playwright regression now also covers left-sidebar navigation into Mission History and Memory Center, so tester-visible browser bridge data is exercised across multiple pages instead of only the home-to-Team-Room flow
- Browser bridge now supports explicit failure modes for tester-driven error states, including a mission-start failure path that keeps the UI pending first and then shows a visible error alert
- Playwright now includes an error-state regression for browser-bridge-driven mission-start failure so the app can prove it does not fail silently
- `WIN_MEMORY` document-based memory foundation with a visible Memory Viewer
- Mission History page showing stored recent mission summaries
- One-click Windows development launcher: `start-dev.bat`
- Low-value desktop menu removed to reduce shell noise

## 2. What Can Be Tested Now

This build supports the following tester-visible loop:

1. Launch the app in development mode with `start-dev.bat`
2. Confirm the app opens in the new light theme and no longer shows a distracting top-level desktop menu
3. Confirm the left sidebar shows navigation, recent missions, workspace, and `Codex CLI` status
4. Run the standalone `Codex CLI` smoke test from the home page and inspect the returned text
5. Start a mission from the home page
6. Verify the route switches into the real Team Room mission path
7. Verify the Team Room timeline shows the first real Codex CLI response in addition to mission/captain events
8. Open Mission History and confirm stored mission summaries are visible
9. Open Memory Center and confirm it shows the memory index and the current work log

## 3. Known Gaps

- `Codex CLI` now runs a first real smoke-test and single-response task call, but not yet a full live multi-agent execution backend
- Team Room is more realistic now, but still not a streaming multi-agent transcript system
- Memory Center currently shows the first real slice of memory (`INDEX.md` + current work log), not a full browsable memory explorer
- No packaged `.exe` yet; testing still uses development mode

## 4. Recommended Manual Test Path

For the next user testing pass, focus on:

1. Light theme readability and overall visual comfort
2. Home page `Codex CLI` smoke-test flow
3. Home page mission start flow
4. Team Room timeline readability, especially the real CLI response
5. Mission History persistence
6. Memory Center visibility of real `WIN_MEMORY` content

## 5. Why This Checkpoint Matters

This checkpoint preserves a stronger baseline than the earlier workbench-only milestone:

- the app launches reliably
- the first-use path is clearer
- the shell is visually closer to a real desktop app
- the CLI can now be exercised directly from the UI
- runtime data is visible in multiple pages
- memory is no longer hidden behind placeholder copy

## 6. Active Execution Workflow

From 2026-04-15 onward, this branch should be advanced using a stricter delivery loop:

- use subagents for bounded implementation and verification tasks whenever practical
- treat Playwright as the standard UX regression layer after feature passes
- allow longer waits and screenshot evidence for AI/CLI-driven flows
- close stale app/test windows before each automated or manual run
- keep `WIN_MEMORY` and checkpoint files updated so the branch can survive context compression

## 7. Browser-First Infrastructure

The current tester-facing browser baseline now includes:

- a Vite browser mode at `npm run dev:web`
- a renderer-side browser bridge that installs automatically when Electron preload is absent
- a Playwright e2e path that covers the first-user mission start journey and the Codex CLI smoke-test entry point
- a Playwright e2e path that covers the first-user mission start journey plus left-sidebar navigation into Mission History and Memory Center
- a Playwright waiting-state journey that verifies the UI stays visibly active while the browser bridge delays AI/CLI responses
- a Vitest exclusion rule so Playwright specs under `tests/e2e` do not get double-collected as unit tests
- a browser bridge error mode that can simulate mission-start or smoke-test failure without depending on the real CLI
- a Playwright error-state journey that verifies mission-start failure is surfaced to the user with a pending state first and a visible alert afterward

This document should be updated whenever Win Together reaches another tester-facing milestone.
