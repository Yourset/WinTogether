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
  const waitingMessage =
    language === "en"
      ? "Captain is waiting for Codex CLI to answer. Please hold on..."
      : "Captain 正在等待 Codex CLI 回应，请稍候...";
  const api = window.winTogether;

  useEffect(() => {
    let isMounted = true;

    if (!api?.getDefaultWorkspacePath || !api?.startMission) {
      setWorkspacePath("");
      setWorkspaceSource("missing");
      setCurrentWorkspacePath(null);
      setErrorMessage(strings.bridgeUnavailable);
      return () => {
        isMounted = false;
      };
    }

    void api
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
  }, [api, setCurrentWorkspacePath, strings.bridgeUnavailable, strings.startMissionFallbackError]);

  const handleSubmit = async () => {
    const nextGoal = goal.trim();
    const nextWorkspacePath = workspacePath.trim();

    if (!api?.startMission) {
      setErrorMessage(strings.bridgeUnavailable);
      return;
    }

    if (!nextGoal || !nextWorkspacePath || isStartingMission) {
      return;
    }

    setIsStartingMission(true);
    setErrorMessage(null);

    try {
      const result = await api.startMission({
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
          maxWidth: "100%"
        }
      : undefined;

  return (
    <section aria-busy={isStartingMission} aria-labelledby="team-room-composer" style={panelStyle} className="composer-panel">
      {hideTitle ? null : <h2 id="team-room-composer">{strings.composerTitle}</h2>}
      <div className="composer-panel__field">
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
          className="composer-panel__input"
        />
        <p className="composer-panel__hint">{workspaceStatusMessage}</p>
      </div>
      <textarea
        placeholder={strings.goalPlaceholder}
        rows={surface === "home" ? 8 : 5}
        value={goal}
        onChange={(event) => {
          setGoal(event.target.value);
          setErrorMessage(null);
        }}
        className="composer-panel__textarea"
        style={{ marginTop: "1rem" }}
      />
      {errorMessage ? (
        <p role="alert" className="alert-error">
          {errorMessage}
        </p>
      ) : null}
      {isStartingMission ? (
        <p role="status" aria-live="polite" className="composer-panel__status composer-panel__status--pending">
          {waitingMessage}
        </p>
      ) : null}
      <div className="composer-panel__actions">
        <button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={isStartingMission || workspaceSource === "loading" || !workspacePath.trim()}
          className="button-primary"
          style={{ opacity: isStartingMission || workspaceSource === "loading" || !workspacePath.trim() ? 0.65 : 1 }}
        >
          {submitLabel ?? strings.send}
        </button>
      </div>
    </section>
  );
}
