import path from "node:path";

export class WorkspacePickerService {
  constructor(private readonly fallbackWorkspacePath: string) {}

  getDefaultWorkspacePath() {
    return this.fallbackWorkspacePath;
  }

  resolveWorkspacePath(workspacePath?: string) {
    const candidate = workspacePath?.trim();
    if (!candidate) {
      return this.fallbackWorkspacePath;
    }

    return path.resolve(this.fallbackWorkspacePath, candidate);
  }
}
