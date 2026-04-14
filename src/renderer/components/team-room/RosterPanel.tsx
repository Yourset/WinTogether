import { getStrings } from "../../i18n";
import { useAppStore } from "../../store/appStore";

type RosterPanelProps = {
  agents: string[];
};

export function RosterPanel({ agents }: RosterPanelProps) {
  const language = useAppStore((state) => state.language);
  const strings = getStrings(language);

  return (
    <section aria-labelledby="team-room-agents">
      <h2 id="team-room-agents">{strings.rosterTitle}</h2>
      <ul>
        {agents.map((agent) => (
          <li key={agent}>{agent}</li>
        ))}
      </ul>
    </section>
  );
}
