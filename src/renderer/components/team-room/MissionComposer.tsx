import { useEffect, useId, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppStore } from "../../store/appStore";

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "Mission start failed. Check the workspace path and try again.";
}

export function MissionComposer() {
  const navigate = useNavigate();
  const workspaceInputId = useId();
  const [goal, setGoal] = useState("");
  const [workspacePath, setWorkspacePath] = useState("");
  const [workspaceSource, setWorkspaceSource] = useState<"loading" | "default" | "manual" | "missing">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isStartingMission, setIsStartingMission] = useState(false);
  const recordMissionStarted = useAppStore((state) => state.recordMissionStarted);

  useEffect(() => {
    let isMounted = true;

    void window.winTogether
      .getDefaultWorkspacePath()
      .then((defaultWorkspacePath) => {
        if (!isMounted) {
          return;
        }

        const nextWorkspacePath = defaultWorkspacePath.trim();
        setWorkspacePath(nextWorkspacePath);
        setWorkspaceSource(nextWorkspacePath ? "default" : "missing");
      })
      .catch((error: unknown) => {
        if (!isMounted) {
          return;
        }

        setWorkspacePath("");
        setWorkspaceSource("missing");
        setErrorMessage(`Default workspace unavailable: ${getErrorMessage(error)}`);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async () => {
    const nextGoal = goal.trim();
    const nextWorkspacePath = workspacePath.trim();

    if (!nextGoal || !nextWorkspacePath || isStartingMission) {
      return;
    }

    setIsStartingMission(true);
    setErrorMessage(null);

    try {
      const result = await window.winTogether.startMission({
        goal: nextGoal,
        workspacePath: nextWorkspacePath
      });

      recordMissionStarted(result);
      setGoal("");
      navigate(`/team/${result.mission.id}`);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsStartingMission(false);
    }
  };

  const workspaceStatusMessage =
    workspaceSource === "loading"
      ? "Loading the app default workspace..."
      : workspaceSource === "default"
        ? "Using the default workspace provided by the app: edit it here if you want to override it for this mission."
        : workspaceSource === "manual"
          ? "Using a workspace path you entered for this mission."
          : "No default workspace is available. Enter a workspace path before starting the mission.";

  return (
    <section aria-labelledby="team-room-composer">
      <h2 id="team-room-composer">Mission Composer</h2>
      <div>
        <label htmlFor={workspaceInputId}>Workspace path</label>
        <input
          id={workspaceInputId}
          type="text"
          value={workspacePath}
          placeholder="Enter a workspace path"
          onChange={(event) => {
            setWorkspacePath(event.target.value);
            setWorkspaceSource("manual");
            setErrorMessage(null);
          }}
        />
        <p>{workspaceStatusMessage}</p>
      </div>
      <textarea
        placeholder="Tell Captain the goal..."
        rows={5}
        value={goal}
        onChange={(event) => {
          setGoal(event.target.value);
          setErrorMessage(null);
        }}
      />
      {errorMessage ? <p role="alert">{errorMessage}</p> : null}
      <button
        type="button"
        onClick={() => void handleSubmit()}
        disabled={isStartingMission || workspaceSource === "loading" || !workspacePath.trim()}
      >
        Send
      </button>
    </section>
  );
}
