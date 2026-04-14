import path from "node:path";

export class WorkspacePickerService {
  constructor(private readonly defaultWorkspacePath: string = process.cwd()) {}

  getDefaultWorkspacePath() {
    return this.defaultWorkspacePath;
  }

  resolveWorkspacePath(workspacePath?: string) {
    const candidate = workspacePath?.trim();
    if (!candidate) {
      return this.defaultWorkspacePath;
    }

    return path.resolve(this.defaultWorkspacePath, candidate);
  }
}
