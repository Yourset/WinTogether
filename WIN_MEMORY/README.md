# WIN_MEMORY

This directory is the document-based memory store for the WinTogether runtime.

It is organized so code can write structured notes without needing a database:

- `INDEX.md` links the main memory areas.
- `memory-policy.md` defines what may be written and how.
- `user/` stores user preferences and long-lived context.
- `teams/` stores team definitions and roles.
- `missions/` stores mission records and status notes.
- `workspaces/` stores workspace-scoped context.
- `knowledge/` stores durable reference knowledge.
- `work-log/` stores the current running log of work.

Use markdown files for simple, reviewable state. Keep entries small, factual, and easy to append.
