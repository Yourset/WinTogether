import { useEffect, useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getStrings } from "../../i18n";
import { useAppStore } from "../../store/appStore";

function getErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallbackMessage;
}

export function MissionComposer() {
  const navigate = useNavigate();
  const workspaceInputId = useId();
  const hasManualWorkspaceEdit = useRef(false);
  const [goal, setGoal] = useState("");
  const [workspacePath, setWorkspacePath] = useState("");
  const [workspaceSource, setWorkspaceSource] = useState<"loading" | "default" | "manual" | "missing">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isStartingMission, setIsStartingMission] = useState(false);
  const language = useAppStore((state) => state.language);
  const recordMissionStarted = useAppStore((state) => state.recordMissionStarted);
  const strings = getStrings(language);

  useEffect(() => {
    let isMounted = true;

    void window.winTogether
      .getDefaultWorkspacePath()
      .then((defaultWorkspacePath) => {
        if (!isMounted || hasManualWorkspaceEdit.current) {
          return;
        }

        const nextWorkspacePath = defaultWorkspacePath.trim();
        setWorkspacePath(nextWorkspacePath);
        setWorkspaceSource(nextWorkspacePath ? "default" : "missing");
      })
      .catch((error: unknown) => {
        if (!isMounted || hasManualWorkspaceEdit.current) {
          return;
        }

        setWorkspacePath("");
        setWorkspaceSource("missing");
        setErrorMessage(getErrorMessage(error, strings.startMissionFallbackError));
      });

    return () => {
      isMounted = false;
    };
  }, [strings.startMissionFallbackError]);

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
      setErrorMessage(getErrorMessage(error, strings.startMissionFallbackError));
    } finally {
      setIsStartingMission(false);
    }
  };

  const workspaceStatusMessage =
    workspaceSource === "loading"
      ? strings.workspaceLoading
      : workspaceSource === "default"
        ? strings.workspaceDefault
        : workspaceSource === "manual"
          ? strings.workspaceManual
          : strings.workspaceMissing;

  return (
    <section aria-labelledby="team-room-composer">
      <h2 id="team-room-composer">{strings.composerTitle}</h2>
      <div>
        <label htmlFor={workspaceInputId}>{strings.workspaceLabel}</label>
        <input
          id={workspaceInputId}
          type="text"
          value={workspacePath}
          placeholder={strings.workspacePlaceholder}
          onChange={(event) => {
            hasManualWorkspaceEdit.current = true;
            setWorkspacePath(event.target.value);
            setWorkspaceSource("manual");
            setErrorMessage(null);
          }}
        />
        <p>{workspaceStatusMessage}</p>
      </div>
      <textarea
        placeholder={strings.goalPlaceholder}
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
        {strings.send}
      </button>
    </section>
  );
}
