import { getStrings } from "../../i18n";
import { useAppStore } from "../../store/appStore";

type RosterPanelProps = {
  agents: string[];
};

export function RosterPanel({ agents }: RosterPanelProps) {
  const language = useAppStore((state) => state.language);
  const strings = getStrings(language);

  return (
    <section
      aria-labelledby="team-room-agents"
      style={{
        borderRadius: "20px",
        border: "1px solid rgba(148, 163, 184, 0.14)",
        background: "rgba(15, 23, 42, 0.7)",
        padding: "1rem"
      }}
    >
      <h2 id="team-room-agents" style={{ marginTop: 0 }}>
        {strings.rosterTitle}
      </h2>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.75rem" }}>
        {agents.map((agent, index) => (
          <li
            key={agent}
            style={{
              borderRadius: "14px",
              border: "1px solid rgba(148, 163, 184, 0.12)",
              background: "rgba(255, 255, 255, 0.03)",
              padding: "0.8rem 0.9rem"
            }}
          >
            <div style={{ fontWeight: 600 }}>{agent}</div>
            <div style={{ color: "#8da2bd", fontSize: "0.85rem", marginTop: "0.25rem" }}>
              {index === 0 ? "Lead" : "Active"}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
