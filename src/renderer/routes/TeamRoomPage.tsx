import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { ContextPanel } from "../components/team-room/ContextPanel";
import { MessageTimeline } from "../components/team-room/MessageTimeline";
import { MissionComposer } from "../components/team-room/MissionComposer";
import { RosterPanel } from "../components/team-room/RosterPanel";
import { getStrings } from "../i18n";
import { useAppStore } from "../store/appStore";

export function TeamRoomPage() {
  const { missionId } = useParams();
  const activeMissionId = useAppStore((state) => state.activeMissionId);
  const language = useAppStore((state) => state.language);
  const setActiveMissionId = useAppStore((state) => state.setActiveMissionId);
  const timelineItems = useAppStore((state) => state.timelineItems);
  const strings = getStrings(language);

  useEffect(() => {
    setActiveMissionId(missionId ?? null);
  }, [missionId, setActiveMissionId]);

  const agents = ["Captain", "Researcher", "Builder"];
  const currentMissionId = activeMissionId ?? missionId ?? null;

  return (
    <section style={{ display: "grid", gap: "1.2rem" }}>
      <div>
        <h1 style={{ margin: 0 }}>{strings.teamRoomTitle}</h1>
        <p style={{ marginTop: "0.4rem", color: "#8da2bd" }}>
          {strings.missionIdLabel}：{currentMissionId ?? strings.missionIdUnassigned}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "minmax(14rem, 17rem) minmax(0, 1fr) minmax(16rem, 20rem)",
          alignItems: "start"
        }}
      >
        <RosterPanel agents={agents} />
        <div style={{ display: "grid", gap: "1rem" }}>
          <MessageTimeline items={timelineItems} />
          <MissionComposer />
        </div>
        <ContextPanel missionId={currentMissionId} focus={strings.contextFocusValue} />
      </div>
    </section>
  );
}
