# Win Together Foundation Checkpoint

Date: 2026-04-14
Branch: `feature/v1-foundation`
Status: Testable workbench checkpoint

## 1. Current Product State

The branch has moved beyond the first shell-only milestone and is now a clearer manual-test checkpoint for Win Together.

Implemented in the current build:

- Electron + React desktop shell with Chinese-first UI and optional English switch
- Left-sidebar workbench layout with Home / Team Room / History / Memory navigation
- Direct mission entry flow from the home screen
- Persisted recent mission summaries backed by `TranscriptStore`
- Visible `Codex CLI` health status in the sidebar using a real `codex --version` check
- Team Room timeline sourced from a structured mission event snapshot
- `WIN_MEMORY` document-based memory foundation with a visible Memory Viewer
- Mission History page showing stored recent mission summaries
- One-click Windows development launcher: `start-dev.bat`

## 2. What Can Be Tested Now

This build supports the following tester-visible loop:

1. Launch the app in development mode with `start-dev.bat`
2. Confirm the left sidebar shows navigation, recent missions, workspace, and `Codex CLI` status
3. Start a mission from the home page
4. Verify the route switches into the real Team Room mission path
5. Verify the Team Room timeline shows richer mission/captain events instead of a fixed two-line stub
6. Open Mission History and confirm stored mission summaries are visible
7. Open Memory Center and confirm it shows the memory index and the current work log

## 3. Known Gaps

- `Codex CLI` is health-checked and visible, but not yet running a full live multi-agent execution backend
- Team Room is more realistic now, but still not a streaming multi-agent transcript system
- Memory Center currently shows the first real slice of memory (`INDEX.md` + current work log), not a full browsable memory explorer
- No packaged `.exe` yet; testing still uses development mode

## 4. Recommended Manual Test Path

For the next user testing pass, focus on:

1. Home page mission start flow
2. Sidebar `Codex CLI` status visibility
3. Team Room timeline readability
4. Mission History persistence
5. Memory Center visibility of real `WIN_MEMORY` content

## 5. Why This Checkpoint Matters

This checkpoint preserves a much more useful baseline than the earlier shell milestone:

- the app launches reliably
- the first-use path is clearer
- runtime data is visible in multiple pages
- memory is no longer hidden behind placeholder copy

This document should be updated whenever Win Together reaches another tester-facing milestone.
