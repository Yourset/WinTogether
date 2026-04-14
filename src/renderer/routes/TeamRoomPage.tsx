import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useAppStore } from "../store/appStore";

export function TeamRoomPage() {
  const { missionId } = useParams();
  const setActiveMissionId = useAppStore((state) => state.setActiveMissionId);

  useEffect(() => {
    setActiveMissionId(missionId ?? null);
  }, [missionId, setActiveMissionId]);

  return (
    <section>
      <h1>Team Room</h1>
      <p>Mission ID: {missionId ?? "Unassigned"}</p>
      <p>This is the shared workspace for the mission.</p>
    </section>
  );
}
