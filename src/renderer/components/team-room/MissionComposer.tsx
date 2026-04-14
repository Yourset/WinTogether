export function MissionComposer() {
  return (
    <section aria-labelledby="team-room-composer">
      <h2 id="team-room-composer">Mission Composer</h2>
      <textarea placeholder="告诉 Captain 你的目标..." rows={5} />
      <button type="button">Send</button>
    </section>
  );
}
