import { resolve } from "node:path";

export class WorkspaceManager {
  constructor(private readonly rootPath: string) {}

  getRootPath() {
    return this.rootPath;
  }

  normalizeWorkspacePath(workspacePath: string) {
    const trimmed = workspacePath.trim();
    if (!trimmed) {
      throw new Error("workspacePath is required");
    }

    return resolve(trimmed);
  }
}
