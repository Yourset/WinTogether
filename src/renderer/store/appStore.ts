import { create } from "zustand";

type AppState = {
  activeMissionId: string | null;
  setActiveMissionId: (missionId: string | null) => void;
};

export const useAppStore = create<AppState>()((set) => ({
  activeMissionId: null,
  setActiveMissionId: (missionId) => set({ activeMissionId: missionId }),
}));
