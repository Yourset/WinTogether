import { getStrings } from "../../i18n";
import { useAppStore } from "../../store/appStore";

type RosterPanelProps = {
  agents: string[];
};

export function RosterPanel({ agents }: RosterPanelProps) {
  const language = useAppStore((state) => state.language);
  const strings = getStrings(language);

  return (
    <section aria-labelledby="team-room-agents" className="roster-panel">
      <h2 id="team-room-agents" style={{ marginTop: 0 }}>
        {strings.rosterTitle}
      </h2>
      <ul className="roster-list">
        {agents.map((agent, index) => (
          <li key={agent} className="roster-list__item">
            <div style={{ fontWeight: 600 }}>{agent}</div>
            <div className="roster-list__meta">
              {index === 0 ? "Lead" : "Active"}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
