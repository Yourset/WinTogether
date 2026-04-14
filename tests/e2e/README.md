# Playwright Browser-First Testing

This folder holds the browser-first user-journey checks for Win Together.

## Development

- Run the renderer in browser mode with `npm run dev:web`
- Open `http://127.0.0.1:5173`
- The renderer will install a lightweight browser bridge when Electron preload is not present

## End-to-End Tests

- Run the browser journey tests with `npm run test:e2e`
- Run them in a visible browser with `npm run test:e2e:headed`
- Run the Electron smoke test with `npm run test:e2e:electron`

## What These Tests Cover

- First-load home page experience
- Browser-mode mission start flow
- Codex CLI smoke-test entry point
- Team Room handoff after a mission starts
- Mission History and Memory Center navigation with real browser bridge data
- Long-wait behavior for AI/CLI-style interactions
- Real Electron shell smoke coverage for preload, IPC, and main workbench launch

## Notes

- Playwright captures screenshots and traces on failure
- Before manual or automated runs, close stale Win Together / Electron windows so old sessions do not affect the next run
- The Electron smoke test builds the app first and then launches the real desktop shell through Playwright's Electron integration
