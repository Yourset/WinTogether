export class WorkspaceManager {
  constructor(private readonly rootPath: string) {}

  getRootPath() {
    return this.rootPath;
  }

  normalizeWorkspacePath(workspacePath: string) {
    const normalized = workspacePath.trim();
    if (!normalized) {
      throw new Error("workspacePath is required");
    }

    return normalized;
  }
}
