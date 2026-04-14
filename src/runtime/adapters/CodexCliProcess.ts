import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";

export function spawnCodexProcess(args: string[], cwd: string): ChildProcessWithoutNullStreams {
  return spawn("codex", args, {
    cwd,
    stdio: "pipe"
  });
}
