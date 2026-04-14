import { Navigate, Route, Routes } from "react-router-dom";

import { AppShell } from "./components/layout/AppShell";
import { HomePage } from "./routes/HomePage";
import { MemoryViewerPage } from "./routes/MemoryViewerPage";
import { MissionHistoryPage } from "./routes/MissionHistoryPage";
import { TeamRoomPage } from "./routes/TeamRoomPage";

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="team/:missionId" element={<TeamRoomPage />} />
        <Route path="history" element={<MissionHistoryPage />} />
        <Route path="memory" element={<MemoryViewerPage />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Route>
    </Routes>
  );
}
