import { useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";

import { getStrings } from "../../i18n";
import { useAppStore } from "../../store/appStore";

function navLinkClassName({ isActive }: { isActive: boolean }) {
  return `app-shell__nav-link${isActive ? " is-active" : ""}`;
}

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
      data-testid={`sidebar-mission-link-${missionId}`}
      className={({ isActive }) => `app-shell__mission-link${isActive ? " is-active" : ""}`}
    >
      <div className="app-shell__mission-title">{title}</div>
      <div className="app-shell__mission-id">{missionId}</div>
    </NavLink>
  );
}

export function AppShell() {
  const activeMissionId = useAppStore((state) => state.activeMissionId);
  const recentMissions = useAppStore((state) => state.recentMissions);
  const runtimeStatus = useAppStore((state) => state.runtimeStatus);
  const currentWorkspacePath = useAppStore((state) => state.currentWorkspacePath);
  const language = useAppStore((state) => state.language);
  const setRecentMissions = useAppStore((state) => state.setRecentMissions);
  const setRuntimeStatus = useAppStore((state) => state.setRuntimeStatus);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const strings = getStrings(language);
  const teamRoomHref = activeMissionId ? `/team/${activeMissionId}` : null;

  useEffect(() => {
    const api = window.winTogether;
    if (!api?.getRecentMissions) {
      return;
    }

    let cancelled = false;

    void api.getRecentMissions().then((missions) => {
      if (!cancelled) {
        setRecentMissions(missions);
      }
    });

    void api.getRuntimeStatus?.().then((nextRuntimeStatus) => {
      if (!cancelled) {
        setRuntimeStatus(nextRuntimeStatus ?? null);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [setRecentMissions, setRuntimeStatus]);

  return (
    <div className="app-shell" data-theme="light">
      <div className="app-shell__grid">
        <aside className="app-shell__sidebar">
          <div className="app-shell__brand" data-testid="app-shell-brand">
            <strong className="app-shell__brand-title">Win Together</strong>
            <div className="app-shell__brand-subtitle">{strings.shellTagline}</div>
          </div>

          <nav className="app-shell__nav" data-testid="app-shell-nav">
            <NavLink to="/" data-testid="nav-home" className={navLinkClassName} end>
              {strings.navHome}
            </NavLink>
            {teamRoomHref ? (
              <NavLink to={teamRoomHref} data-testid="nav-team-room" className={navLinkClassName}>
                {strings.navTeamRoom}
              </NavLink>
            ) : (
              <span
                aria-disabled="true"
                title={strings.navTeamRoomHint}
                data-testid="nav-team-room-disabled"
                className="app-shell__nav-link app-shell__nav-link--disabled"
              >
                {strings.navTeamRoom}
              </span>
            )}
            <NavLink to="/history" data-testid="nav-history" className={navLinkClassName}>
              {strings.navHistory}
            </NavLink>
            <NavLink to="/memory" data-testid="nav-memory" className={navLinkClassName}>
              {strings.navMemory}
            </NavLink>
          </nav>

          <section className="app-shell__panel" data-testid="app-shell-workspace-panel">
            <div className="app-shell__section-label">{strings.sidebarWorkspace}</div>
            <div className="app-shell__workspace">{currentWorkspacePath ?? strings.sidebarWorkspaceEmpty}</div>
          </section>

          <section className="app-shell__panel app-shell__panel--stack" data-testid="app-shell-recent-missions-panel">
            <div className="app-shell__section-label">{strings.sidebarRecentMissions}</div>
            <div className="app-shell__stack">
              {recentMissions.length > 0 ? (
                recentMissions.map((mission) => <SidebarMissionLink key={mission.id} missionId={mission.id} title={mission.title} />)
              ) : (
                <p className="app-shell__empty-state">{strings.sidebarNoRecentMissions}</p>
              )}
            </div>
          </section>

          <section className="app-shell__panel app-shell__runtime" data-testid="app-shell-runtime-panel">
            <div className="app-shell__section-label">{strings.sidebarCodexCli}</div>
            <div className="app-shell__runtime-status">
              {runtimeStatus
                ? runtimeStatus.codexCli.status === "ready"
                  ? strings.runtimeReady
                  : strings.runtimeUnavailable
                : "..."}
            </div>
            <div className="app-shell__runtime-message">{runtimeStatus?.codexCli.message ?? strings.workspaceLoading}</div>
          </section>

          <section className="app-shell__panel" data-testid="app-shell-language-panel">
            <div className="app-shell__section-label">{strings.sidebarLanguage}</div>
            <div className="app-shell__language-switcher">
              <button
                type="button"
                onClick={() => setLanguage("zh-CN")}
                disabled={language === "zh-CN"}
                className={`app-shell__language-button${language === "zh-CN" ? " is-active" : ""}`}
              >
                中文
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                disabled={language === "en"}
                className={`app-shell__language-button${language === "en" ? " is-active" : ""}`}
              >
                EN
              </button>
            </div>
          </section>
        </aside>

        <main className="app-shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
