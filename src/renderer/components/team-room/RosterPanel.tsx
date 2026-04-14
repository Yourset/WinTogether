type RosterPanelProps = {
  agents: string[];
};

export function RosterPanel({ agents }: RosterPanelProps) {
  return (
    <section aria-labelledby="team-room-agents">
      <h2 id="team-room-agents">Agents</h2>
      <ul>
        {agents.map((agent) => (
          <li key={agent}>{agent}</li>
        ))}
      </ul>
    </section>
  );
}
