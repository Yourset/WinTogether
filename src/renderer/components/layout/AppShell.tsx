import { NavLink, Outlet } from "react-router-dom";

import { getStrings } from "../../i18n";
import { useAppStore } from "../../store/appStore";

const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
  color: isActive ? "#f8fafc" : "#cbd5e1",
  textDecoration: "none",
  fontWeight: isActive ? 600 : 400
});

export function AppShell() {
  const activeMissionId = useAppStore((state) => state.activeMissionId);
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const strings = getStrings(language);
  const teamRoomHref = activeMissionId ? `/team/${activeMissionId}` : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "#e2e8f0"
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          padding: "1rem 1.5rem",
          borderBottom: "1px solid rgba(148, 163, 184, 0.2)"
        }}
      >
        <div>
          <strong>Win Together</strong>
          <div style={{ fontSize: "0.875rem", color: "#94a3b8" }}>{strings.shellTagline}</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <nav style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
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
                  color: "#64748b",
                  cursor: "not-allowed",
                  textDecoration: "none"
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

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button type="button" onClick={() => setLanguage("zh-CN")} disabled={language === "zh-CN"}>
              中文
            </button>
            <button type="button" onClick={() => setLanguage("en")} disabled={language === "en"}>
              EN
            </button>
          </div>
        </div>
      </header>

      <main style={{ padding: "1.5rem" }}>
        <Outlet />
      </main>
    </div>
  );
}
