type ContextPanelProps = {
  missionId: string | null;
  focus: string;
};

export function ContextPanel({ missionId, focus }: ContextPanelProps) {
  return (
    <section aria-labelledby="team-room-context">
      <h2 id="team-room-context">Context</h2>
      <dl>
        <div>
          <dt>Mission</dt>
          <dd>{missionId ?? "Unassigned"}</dd>
        </div>
        <div>
          <dt>Focus</dt>
          <dd>{focus}</dd>
        </div>
      </dl>
    </section>
  );
}
