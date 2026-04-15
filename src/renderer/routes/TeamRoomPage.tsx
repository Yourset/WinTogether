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
  const activeTeam = useAppStore((state) => state.activeTeam);
  const language = useAppStore((state) => state.language);
  const setActiveMissionId = useAppStore((state) => state.setActiveMissionId);
  const timelineItems = useAppStore((state) => state.timelineItems);
  const strings = getStrings(language);

  useEffect(() => {
    setActiveMissionId(missionId ?? null);
  }, [missionId, setActiveMissionId]);

  const currentMissionId = activeMissionId ?? missionId ?? null;
  const team = currentMissionId && activeMissionId === currentMissionId ? activeTeam : null;

  return (
    <section data-testid="team-room-page" className="page-stack page-stack--team-room">
      <div className="page-hero">
        <h1 className="page-title">{strings.teamRoomTitle}</h1>
        <p className="page-lead">
          {strings.missionIdLabel}: {currentMissionId ?? strings.missionIdUnassigned}
        </p>
      </div>

      <div className="team-room-grid">
        <RosterPanel team={team} />
        <div className="team-room-grid__middle">
          <MessageTimeline items={timelineItems} />
          <MissionComposer />
        </div>
        <ContextPanel missionId={currentMissionId} focus={strings.contextFocusValue} />
      </div>
    </section>
  );
}
