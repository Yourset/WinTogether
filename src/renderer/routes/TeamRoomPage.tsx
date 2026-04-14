import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { ContextPanel } from "../components/team-room/ContextPanel";
import { MessageTimeline } from "../components/team-room/MessageTimeline";
import { MissionComposer } from "../components/team-room/MissionComposer";
import { RosterPanel } from "../components/team-room/RosterPanel";
import { useAppStore } from "../store/appStore";

export function TeamRoomPage() {
  const { missionId } = useParams();
  const setActiveMissionId = useAppStore((state) => state.setActiveMissionId);

  useEffect(() => {
    setActiveMissionId(missionId ?? null);
  }, [missionId, setActiveMissionId]);

  const timelineItems = [
    {
      id: "mission-brief",
      actor: "Captain",
      time: "Just now",
      message: "Mission brief received and queued for the team.",
    },
    {
      id: "status-check",
      actor: "Navigator",
      time: "1 min ago",
      message: "All agents are standing by for the next objective.",
    },
  ];

  const agents = ["Captain", "Navigator", "Analyst"];

  return (
    <section>
      <h1>Team Room</h1>
      <p>Mission ID: {missionId ?? "Unassigned"}</p>
      <div
        style={{
          display: "grid",
          gap: "1.5rem",
          gridTemplateColumns: "minmax(14rem, 18rem) minmax(0, 1fr) minmax(16rem, 20rem)",
          alignItems: "start",
        }}
      >
        <RosterPanel agents={agents} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <MessageTimeline items={timelineItems} />
          <MissionComposer />
        </div>
        <ContextPanel missionId={missionId ?? null} focus="Align on the next mission step." />
      </div>
    </section>
  );
}
