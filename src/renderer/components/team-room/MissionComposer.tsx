import { useEffect, useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getStrings } from "../../i18n";
import { useAppStore } from "../../store/appStore";

type MissionComposerProps = {
  hideTitle?: boolean;
  submitLabel?: string;
  surface?: "home" | "team";
};

function getErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallbackMessage;
}

export function MissionComposer({
  hideTitle = false,
  submitLabel,
  surface = "team"
}: MissionComposerProps) {
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
  const setCurrentWorkspacePath = useAppStore((state) => state.setCurrentWorkspacePath);
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
        setCurrentWorkspacePath(nextWorkspacePath || null);
      })
      .catch((error: unknown) => {
        if (!isMounted || hasManualWorkspaceEdit.current) {
          return;
        }

        setWorkspacePath("");
        setWorkspaceSource("missing");
        setCurrentWorkspacePath(null);
        setErrorMessage(getErrorMessage(error, strings.startMissionFallbackError));
      });

    return () => {
      isMounted = false;
    };
  }, [setCurrentWorkspacePath, strings.startMissionFallbackError]);

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

  const panelStyle =
    surface === "home"
      ? {
          border: "1px solid rgba(148, 163, 184, 0.18)",
          borderRadius: "20px",
          padding: "1.1rem",
          background: "rgba(15, 23, 42, 0.7)"
        }
      : undefined;

  return (
    <section aria-labelledby="team-room-composer" style={panelStyle}>
      {hideTitle ? null : <h2 id="team-room-composer">{strings.composerTitle}</h2>}
      <div style={{ display: "grid", gap: "0.5rem" }}>
        <label htmlFor={workspaceInputId}>{strings.workspaceLabel}</label>
        <input
          id={workspaceInputId}
          type="text"
          value={workspacePath}
          placeholder={strings.workspacePlaceholder}
          onChange={(event) => {
            const nextWorkspacePath = event.target.value;
            hasManualWorkspaceEdit.current = true;
            setWorkspacePath(nextWorkspacePath);
            setWorkspaceSource("manual");
            setCurrentWorkspacePath(nextWorkspacePath || null);
            setErrorMessage(null);
          }}
          style={{
            borderRadius: "12px",
            border: "1px solid rgba(148, 163, 184, 0.2)",
            background: "rgba(15, 23, 42, 0.92)",
            color: "#e2e8f0",
            padding: "0.8rem 0.9rem"
          }}
        />
        <p style={{ margin: 0, color: "#94a3b8", lineHeight: 1.6 }}>{workspaceStatusMessage}</p>
      </div>
      <textarea
        placeholder={strings.goalPlaceholder}
        rows={surface === "home" ? 8 : 5}
        value={goal}
        onChange={(event) => {
          setGoal(event.target.value);
          setErrorMessage(null);
        }}
        style={{
          width: "100%",
          marginTop: "1rem",
          borderRadius: "16px",
          border: "1px solid rgba(148, 163, 184, 0.2)",
          background: "rgba(15, 23, 42, 0.92)",
          color: "#e2e8f0",
          padding: "1rem",
          resize: "vertical",
          lineHeight: 1.6
        }}
      />
      {errorMessage ? (
        <p role="alert" style={{ color: "#fca5a5", marginBottom: 0 }}>
          {errorMessage}
        </p>
      ) : null}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
        <button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={isStartingMission || workspaceSource === "loading" || !workspacePath.trim()}
          style={{
            border: "none",
            borderRadius: "12px",
            padding: "0.8rem 1.2rem",
            background: "linear-gradient(135deg, #73e0a9, #5dc58f)",
            color: "#062113",
            fontWeight: 700,
            cursor: isStartingMission ? "wait" : "pointer",
            opacity: isStartingMission || workspaceSource === "loading" || !workspacePath.trim() ? 0.65 : 1
          }}
        >
          {submitLabel ?? strings.send}
        </button>
      </div>
    </section>
  );
}
