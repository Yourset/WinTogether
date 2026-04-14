import { Link } from "react-router-dom";

import { getStrings } from "../i18n";
import { useAppStore } from "../store/appStore";

export function HomePage() {
  const activeMissionId = useAppStore((state) => state.activeMissionId);
  const language = useAppStore((state) => state.language);
  const strings = getStrings(language);
  const teamRoomHref = activeMissionId ? `/team/${activeMissionId}` : "/team/draft";

  return (
    <section style={{ display: "grid", gap: "1rem", maxWidth: 720 }}>
      <h1>Win Together</h1>
      <p>{strings.homeIntro}</p>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <Link to="/team/draft">{strings.homeStartNew}</Link>
        <Link to={teamRoomHref}>{strings.homeEnterRoom}</Link>
        <Link to={teamRoomHref}>{strings.homeResumeLast}</Link>
      </div>

      <p>{strings.homeHint}</p>
    </section>
  );
}
