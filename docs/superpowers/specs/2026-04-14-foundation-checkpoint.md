# Win Together Foundation Checkpoint

Date: 2026-04-14
Branch: `feature/v1-foundation`
Status: First manual-testable foundation build

## 1. Current Product State

The current branch has reached the first manual-testable checkpoint for Win Together.

Implemented foundation pieces:

- Electron + React desktop shell
- Shared typed event contracts and `EventBus`
- `WIN_MEMORY` document-based memory foundation
- Runtime core with `MissionOrchestrator`
- `Codex CLI` adapter skeleton
- Renderer routes for Home / Team Room / History / Memory
- Chat-first Team Room three-column skeleton
- Main process IPC for `runtime:start-mission`
- Preload API exposed as `window.winTogether`
- First mission-start loop from renderer to runtime
- One-click Windows development launcher: `start-dev.bat`

## 2. What Works Now

The current build supports this development loop:

1. Launch the app in development mode.
2. Open the Team Room.
3. Enter a mission goal.
4. Send the goal through the renderer.
5. Forward the request to the main process through IPC.
6. Start a mission in the runtime.
7. Show mission/captain-related updates in the Team Room.
8. Append a work-log entry through the runtime service path.

This is still a foundation build, not a polished user-facing version.

## 3. Important Constraints

- The current UI is still mostly English.
- The first-use guidance is still weak.
- The Team Room is structurally present, but not yet a rich AI collaboration feed.
- `Codex CLI` is wired only as a skeleton adapter, not yet as a full live multi-agent execution backend.
- There is not yet a packaged `.exe`; current testing uses development mode.

## 4. Latest User Feedback

The latest manual feedback from the user is:

- Default UI should be Chinese, not English.
- English can remain as an optional switch.
- The home / entry experience should be strongly guided.
- The user does not know where to click when seeing copy like “choose a mission to start collaborating”.

## 5. Next Priority

Before expanding deeper execution features, the next UX priority should be:

1. Switch the UI baseline to Chinese-first
2. Add a visible Chinese/English language toggle
3. Replace abstract entry copy with strong guided actions
4. Make the first click obvious on the home screen

Recommended first guided actions:

- `开始一个新任务`
- `进入 Team Room`
- `继续上一次任务`

## 6. Why This Checkpoint Matters

This checkpoint preserves the current development baseline so later work can safely continue from a stable point without losing:

- architectural decisions
- runtime wiring assumptions
- memory system expectations
- current UX shortcomings and priorities

This document should be updated whenever a major manual-test milestone or product-direction correction happens.
