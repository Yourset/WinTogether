import { NavLink, Outlet } from "react-router-dom";

import { getStrings } from "../../i18n";
import { useAppStore } from "../../store/appStore";

const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
  display: "block",
  borderRadius: "14px",
  padding: "0.85rem 1rem",
  color: isActive ? "#08131f" : "#d8e2ef",
  textDecoration: "none",
  fontWeight: 600,
  background: isActive ? "linear-gradient(135deg, #73e0a9, #7cc8ff)" : "rgba(255, 255, 255, 0.03)",
  border: isActive ? "none" : "1px solid rgba(148, 163, 184, 0.12)"
});

function SidebarMissionLink({
  missionId,
  title
}: {
  missionId: string;
  title: string;
}) {
  return (
    <NavLink
      to={`/team/${missionId}`}
      style={({ isActive }) => ({
        display: "block",
        padding: "0.75rem 0.85rem",
        borderRadius: "12px",
        background: isActive ? "rgba(124, 200, 255, 0.16)" : "rgba(255, 255, 255, 0.02)",
        color: "#dbe7f5",
        textDecoration: "none",
        border: "1px solid rgba(148, 163, 184, 0.12)"
      })}
    >
      <div style={{ fontWeight: 600 }}>{title}</div>
      <div style={{ fontSize: "0.8rem", color: "#8da2bd", marginTop: "0.25rem" }}>{missionId}</div>
    </NavLink>
  );
}

export function AppShell() {
  const activeMissionId = useAppStore((state) => state.activeMissionId);
  const recentMissions = useAppStore((state) => state.recentMissions);
  const currentWorkspacePath = useAppStore((state) => state.currentWorkspacePath);
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const strings = getStrings(language);
  const teamRoomHref = activeMissionId ? `/team/${activeMissionId}` : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(124, 200, 255, 0.18), transparent 30%), linear-gradient(180deg, #09111f 0%, #050913 100%)",
        color: "#e2e8f0"
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "300px minmax(0, 1fr)",
          minHeight: "100vh"
        }}
      >
        <aside
          style={{
            borderRight: "1px solid rgba(148, 163, 184, 0.14)",
            background: "rgba(8, 15, 27, 0.86)",
            padding: "1.25rem 1rem",
            display: "grid",
            gridTemplateRows: "auto auto auto 1fr auto",
            gap: "1rem"
          }}
        >
          <div>
            <strong style={{ fontSize: "1.05rem" }}>Win Together</strong>
            <div style={{ fontSize: "0.9rem", color: "#8da2bd", marginTop: "0.35rem" }}>{strings.shellTagline}</div>
          </div>

          <nav style={{ display: "grid", gap: "0.65rem" }}>
            <NavLink to="/" style={navLinkStyle} end>
              {strings.navHome}
            </NavLink>
            {teamRoomHref ? (
              <NavLink to={teamRoomHref} style={navLinkStyle}>
                {strings.navTeamRoom}
              </NavLink>
            ) : (
              <span
                aria-disabled="true"
                title={strings.navTeamRoomHint}
                style={{
                  display: "block",
                  borderRadius: "14px",
                  padding: "0.85rem 1rem",
                  color: "#64748b",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(148, 163, 184, 0.12)",
                  cursor: "not-allowed",
                  fontWeight: 600
                }}
              >
                {strings.navTeamRoom}
              </span>
            )}
            <NavLink to="/history" style={navLinkStyle}>
              {strings.navHistory}
            </NavLink>
            <NavLink to="/memory" style={navLinkStyle}>
              {strings.navMemory}
            </NavLink>
          </nav>

          <section
            style={{
              borderRadius: "18px",
              padding: "1rem",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(148, 163, 184, 0.1)"
            }}
          >
            <div style={{ fontSize: "0.85rem", color: "#8da2bd", marginBottom: "0.6rem" }}>{strings.sidebarWorkspace}</div>
            <div style={{ lineHeight: 1.6, wordBreak: "break-all" }}>{currentWorkspacePath ?? strings.sidebarWorkspaceEmpty}</div>
          </section>

          <section
            style={{
              borderRadius: "18px",
              padding: "1rem",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(148, 163, 184, 0.1)",
              display: "grid",
              gap: "0.75rem",
              alignContent: "start"
            }}
          >
            <div style={{ fontSize: "0.85rem", color: "#8da2bd" }}>{strings.sidebarRecentMissions}</div>
            <div style={{ display: "grid", gap: "0.6rem" }}>
              {recentMissions.length > 0 ? (
                recentMissions.map((mission) => (
                  <SidebarMissionLink key={mission.id} missionId={mission.id} title={mission.title} />
                ))
              ) : (
                <p style={{ margin: 0, color: "#8da2bd", lineHeight: 1.6 }}>{strings.sidebarNoRecentMissions}</p>
              )}
            </div>
          </section>

          <section
            style={{
              borderRadius: "18px",
              padding: "1rem",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(148, 163, 184, 0.1)"
            }}
          >
            <div style={{ fontSize: "0.85rem", color: "#8da2bd", marginBottom: "0.6rem" }}>{strings.sidebarLanguage}</div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                type="button"
                onClick={() => setLanguage("zh-CN")}
                disabled={language === "zh-CN"}
                style={{
                  borderRadius: "10px",
                  border: "1px solid rgba(148, 163, 184, 0.16)",
                  background: language === "zh-CN" ? "#e2e8f0" : "rgba(255, 255, 255, 0.04)",
                  color: language === "zh-CN" ? "#09111f" : "#e2e8f0",
                  padding: "0.45rem 0.75rem"
                }}
              >
                中文
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                disabled={language === "en"}
                style={{
                  borderRadius: "10px",
                  border: "1px solid rgba(148, 163, 184, 0.16)",
                  background: language === "en" ? "#e2e8f0" : "rgba(255, 255, 255, 0.04)",
                  color: language === "en" ? "#09111f" : "#e2e8f0",
                  padding: "0.45rem 0.75rem"
                }}
              >
                EN
              </button>
            </div>
          </section>
        </aside>

        <main style={{ padding: "2rem 2.25rem" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
