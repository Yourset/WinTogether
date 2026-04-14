import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import type { MissionRecord } from "../../shared/contracts/mission";
import { nowIso } from "../utils/time";

const UTF8 = "utf8";

export interface TranscriptEntry {
  missionId: string;
  message: string;
  timestamp?: string;
  mission?: MissionRecord;
}

export interface RecentMissionRecord extends MissionRecord {
  summary?: string;
  lastUpdatedAt?: string;
}

interface MissionTranscriptFile {
  mission: RecentMissionRecord;
  entries: Array<{
    message: string;
    timestamp: string;
  }>;
}

export class TranscriptStore {
  constructor(private readonly rootPath: string) {}

  getRootPath() {
    return this.rootPath;
  }

  async appendEntry(entry: TranscriptEntry): Promise<void> {
    const filePath = this.getMissionFilePath(entry.missionId);
    await mkdir(this.getMissionDirectory(), { recursive: true });

    const timestamp = entry.timestamp ?? nowIso();
    const existing = await this.readMissionTranscript(entry.missionId);
    const mission = entry.mission ?? existing?.mission;

    if (!mission) {
      throw new Error(`Mission summary is required for ${entry.missionId}`);
    }

    const transcript: MissionTranscriptFile = {
      mission: {
        ...mission,
        summary: entry.message.trim(),
        lastUpdatedAt: timestamp
      },
      entries: [...(existing?.entries ?? []), { message: entry.message, timestamp }]
    };

    await writeFile(filePath, `${JSON.stringify(transcript, null, 2)}\n`, UTF8);
  }

  async readMissionSummary(missionId: string): Promise<RecentMissionRecord | null> {
    const transcript = await this.readMissionTranscript(missionId);
    return transcript?.mission ?? null;
  }

  async listRecentMissions(limit = 8): Promise<RecentMissionRecord[]> {
    try {
      const fileNames = await readdir(this.getMissionDirectory(), { withFileTypes: true });
      const missions = await Promise.all(
        fileNames
          .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
          .map(async (entry) => this.readMissionSummary(entry.name.replace(/\.json$/, "")))
      );

      return missions
        .filter((mission): mission is RecentMissionRecord => mission !== null)
        .sort((left, right) => this.getMissionSortValue(right) - this.getMissionSortValue(left))
        .slice(0, limit);
    } catch (error) {
      if (this.isMissingDirectoryError(error)) {
        return [];
      }

      throw error;
    }
  }

  private async readMissionTranscript(missionId: string): Promise<MissionTranscriptFile | null> {
    try {
      const raw = await readFile(this.getMissionFilePath(missionId), UTF8);
      const parsed = JSON.parse(raw) as MissionTranscriptFile;

      if (!parsed?.mission?.id) {
        return null;
      }

      return parsed;
    } catch (error) {
      if (this.isMissingFileError(error)) {
        return null;
      }

      throw error;
    }
  }

  private getMissionSortValue(mission: RecentMissionRecord) {
    return new Date(mission.lastUpdatedAt ?? mission.createdAt).getTime();
  }

  private getMissionDirectory() {
    return join(this.rootPath, "WIN_MEMORY", "missions");
  }

  private getMissionFilePath(missionId: string) {
    return join(this.getMissionDirectory(), `${missionId}.json`);
  }

  private isMissingDirectoryError(error: unknown) {
    return this.isFsError(error, "ENOENT");
  }

  private isMissingFileError(error: unknown) {
    return this.isFsError(error, "ENOENT");
  }

  private isFsError(error: unknown, code: string) {
    return typeof error === "object" && error !== null && "code" in error && (error as { code?: string }).code === code;
  }
}
