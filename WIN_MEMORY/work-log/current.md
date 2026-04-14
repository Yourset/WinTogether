# Current Work Log

## Entries

- Initialized work log.
- 2026-04-14 foundation checkpoint: completed the Electron + React app shell, typed event contracts, document-based `WIN_MEMORY` foundation, runtime core, `Codex CLI` adapter skeleton, renderer routes, Team Room three-column layout, and the first IPC-to-runtime mission start loop.
- 2026-04-14 testing checkpoint: added a one-click Windows dev launcher `start-dev.bat` so the app can be opened for manual testing without typing commands, while keeping hot reload enabled.
- 2026-04-14 user feedback checkpoint: first manual review says the UI is too English-heavy and the entry flow is unclear. Next product priority is `default Chinese + optional English switch` and a stronger guided home entry that makes the first click obvious.
- 2026-04-14 localization checkpoint: the shell now defaults to Chinese, supports an English toggle, and the home page uses stronger guided entry actions so first-time testers can clearly start or resume a mission.
- 2026-04-14 workbench UI checkpoint: the shell now uses a left sidebar plus right content layout, the default page is a direct mission input screen instead of link-only entry points, and the sidebar reflects current workspace plus recent missions for faster retesting.
- 2026-04-14 white-screen fix checkpoint: the Electron window now disables sandbox for the preload bridge, the renderer no longer crashes when `window.winTogether` is unavailable, and development startup logs confirm the previous preload failure is gone.
- 2026-04-14 testing milestone checkpoint: the user has confirmed the app can now launch successfully and see the main workbench. Next planning focus is to turn the current shell into a more complete testable loop with real recent missions, CLI health checks, richer Team Room events, and visible memory/history content.
- 2026-04-14 execution checkpoint: the user asked to push through the full five-step next-phase delivery plan before the next test round, with subagent-driven execution and stronger file-based coordination records.
- 2026-04-14 task 1 checkpoint: recent missions now persist through `TranscriptStore`, the sidebar hydrates from real data on startup, the history page shows stored mission summaries, and the full test suite is green again after syncing the MemoryManager template assertion.
- 2026-04-14 task 2 checkpoint: runtime now performs a real `codex --version` health check, IPC/preload exposes that status, and the sidebar shows whether Codex CLI is ready together with the returned message.
- 2026-04-14 task 3 checkpoint: mission start now returns a structured event snapshot, EventBus keeps a readable event history, and Team Room maps mission/captain events into a more realistic collaboration timeline instead of hardcoding two local messages.
- 2026-04-14 task 4 checkpoint: Memory Viewer now reads real `WIN_MEMORY` content through runtime/preload and displays the memory index together with the current work log instead of a placeholder page.
- 2026-04-14 task 5 checkpoint: the testable workbench checkpoint is now documented, `start-dev.bat` tells the tester what to verify, and final verification passed with `npm run lint`, `npm test`, and `npm run build`.
- 2026-04-14 startup script fix checkpoint: `start-dev.bat` stopped opening because a previous localized edit corrupted several `echo` lines into single broken commands. The launcher was rewritten as a clean ASCII batch file and a short smoke run no longer shows command parsing errors.
