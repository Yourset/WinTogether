import { NavLink } from "react-router-dom";

import { getStrings } from "../i18n";
import { useAppStore } from "../store/appStore";

export function MissionHistoryPage() {
  const language = useAppStore((state) => state.language);
  const recentMissions = useAppStore((state) => state.recentMissions);
  const strings = getStrings(language);

  return (
    <section style={{ display: "grid", gap: "1rem" }}>
      <div style={{ display: "grid", gap: "0.8rem" }}>
        <h1 style={{ margin: 0 }}>{strings.historyTitle}</h1>
        <p style={{ margin: 0, color: "#94a3b8", lineHeight: 1.7 }}>{strings.historyIntro}</p>
      </div>

      <div style={{ display: "grid", gap: "0.85rem" }}>
        {recentMissions.length > 0 ? (
          recentMissions.map((mission) => (
            <article
              key={mission.id}
              style={{
                borderRadius: "18px",
                border: "1px solid rgba(148, 163, 184, 0.14)",
                background: "rgba(255, 255, 255, 0.03)",
                padding: "1rem",
                display: "grid",
                gap: "0.45rem"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start" }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: "1.05rem" }}>{mission.title}</h2>
                  <p style={{ margin: "0.35rem 0 0", color: "#94a3b8", lineHeight: 1.6 }}>{mission.goal}</p>
                </div>
                <NavLink
                  to={`/team/${mission.id}`}
                  style={{
                    color: "#7cc8ff",
                    textDecoration: "none",
                    fontWeight: 600,
                    whiteSpace: "nowrap"
                  }}
                >
                  {strings.historyOpenRoom}
                </NavLink>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", color: "#cbd5e1", fontSize: "0.92rem" }}>
                <span>{mission.status}</span>
                <span>{mission.createdAt}</span>
              </div>
              {mission.summary ? <p style={{ margin: 0, color: "#dbe7f5", lineHeight: 1.6 }}>{mission.summary}</p> : null}
            </article>
          ))
        ) : (
          <p style={{ margin: 0, color: "#94a3b8", lineHeight: 1.7 }}>{strings.sidebarNoRecentMissions}</p>
        )}
      </div>
    </section>
  );
}
