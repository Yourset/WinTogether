export interface TranscriptEntry {
  missionId: string;
  message: string;
  timestamp?: string;
}

export class TranscriptStore {
  constructor(private readonly rootPath: string) {}

  getRootPath() {
    return this.rootPath;
  }

  async appendEntry(_entry: TranscriptEntry) {
    return undefined;
  }
}
