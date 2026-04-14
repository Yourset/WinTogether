import { useState } from "react";

import { useAppStore } from "../../store/appStore";

export function MissionComposer() {
  const [goal, setGoal] = useState("");
  const [isStartingMission, setIsStartingMission] = useState(false);
  const recordMissionStarted = useAppStore((state) => state.recordMissionStarted);

  const handleSubmit = async () => {
    const nextGoal = goal.trim();
    if (!nextGoal || isStartingMission) {
      return;
    }

    setIsStartingMission(true);

    try {
      const workspacePath = await window.winTogether.getDefaultWorkspacePath();
      const result = await window.winTogether.startMission({
        goal: nextGoal,
        workspacePath
      });

      recordMissionStarted(result);
      setGoal("");
    } finally {
      setIsStartingMission(false);
    }
  };

  return (
    <section aria-labelledby="team-room-composer">
      <h2 id="team-room-composer">Mission Composer</h2>
      <textarea
        placeholder="Tell Captain the goal..."
        rows={5}
        value={goal}
        onChange={(event) => setGoal(event.target.value)}
      />
      <button type="button" onClick={() => void handleSubmit()} disabled={isStartingMission}>
        Send
      </button>
    </section>
  );
}
