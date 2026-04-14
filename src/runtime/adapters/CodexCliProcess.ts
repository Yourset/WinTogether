import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";

export function spawnCodexProcess(args: string[], cwd: string): ChildProcessWithoutNullStreams {
  return spawn("codex", args, {
    cwd,
    ...(process.platform === "win32" ? { shell: true } : {}),
    stdio: "pipe"
  });
}

export interface CodexCommandResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

export function runCodexCommand(args: string[], cwd: string): Promise<CodexCommandResult> {
  return new Promise((resolve, reject) => {
    const child = spawnCodexProcess(args, cwd);
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.once("error", (error) => {
      reject(error);
    });

    child.once("close", (code) => {
      resolve({
        exitCode: code ?? 1,
        stdout: stdout.trim(),
        stderr: stderr.trim()
      });
    });
  });
}
