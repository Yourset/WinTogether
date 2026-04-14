import { useState } from "react";

import { MissionComposer } from "../components/team-room/MissionComposer";
import { getStrings } from "../i18n";
import { useAppStore } from "../store/appStore";

export function HomePage() {
  const language = useAppStore((state) => state.language);
  const runtimeStatus = useAppStore((state) => state.runtimeStatus);
  const codexSmokeTestResult = useAppStore((state) => state.codexSmokeTestResult);
  const isCodexSmokeTestRunning = useAppStore((state) => state.isCodexSmokeTestRunning);
  const setCodexSmokeTestResult = useAppStore((state) => state.setCodexSmokeTestResult);
  const setCodexSmokeTestRunning = useAppStore((state) => state.setCodexSmokeTestRunning);
  const [smokeTestError, setSmokeTestError] = useState<string | null>(null);
  const strings = getStrings(language);

  const handleSmokeTest = async () => {
    const api = window.winTogether;

    if (!api?.runCodexSmokeTest) {
      setSmokeTestError(strings.bridgeUnavailable);
      return;
    }

    setCodexSmokeTestRunning(true);
    setCodexSmokeTestResult(null);
    setSmokeTestError(null);

    try {
      const result = await api.runCodexSmokeTest(
        'Reply with one short sentence that confirms Codex CLI can answer requests inside Win Together.'
      );
      setCodexSmokeTestResult(result);
    } catch (error) {
      setSmokeTestError(error instanceof Error ? error.message : strings.startMissionFallbackError);
    } finally {
      setCodexSmokeTestRunning(false);
    }
  };

  return (
    <section className="page-stack page-stack--home">
      <div className="page-hero">
        <h1 className="page-title">{strings.homeTitle}</h1>
        <p className="page-lead">{strings.homeIntro}</p>
      </div>

      <MissionComposer hideTitle submitLabel={strings.homeSubmit} surface="home" />

      <section className="surface-card surface-card--compact">
        <div className="surface-card__header">
          <h2 className="surface-card__title">{strings.homeEnvironmentTitle}</h2>
          <p className="surface-card__body">
            {runtimeStatus?.codexCli.status === "ready"
              ? strings.homeCodexReady(runtimeStatus.codexCli.message)
              : strings.homeCodexUnavailable(runtimeStatus?.codexCli.message ?? strings.runtimeUnavailable)}
          </p>
        </div>

        <div
          className={`status-inline ${isCodexSmokeTestRunning ? "status-inline--pending" : ""}`}
          role="status"
          aria-live="polite"
        >
          {isCodexSmokeTestRunning
            ? strings.homeSmokeTestRunning
            : codexSmokeTestResult
              ? codexSmokeTestResult.status === "success"
                ? strings.homeSmokeTestSuccess(codexSmokeTestResult.message)
                : strings.homeSmokeTestFailed(codexSmokeTestResult.message)
              : strings.homeSmokeTestIdle}
        </div>

        {codexSmokeTestResult?.rawOutput ? (
          <div className="surface-card surface-card--inset">
            <div className="surface-card__meta">{strings.homeSmokeTestRawOutput}</div>
            <pre className="surface-card__pre">{codexSmokeTestResult.rawOutput}</pre>
          </div>
        ) : null}

        {smokeTestError ? (
          <p role="alert" className="alert-error">
            {smokeTestError}
          </p>
        ) : null}

        <div className="surface-card__actions">
          <button type="button" className="button-secondary" onClick={() => void handleSmokeTest()} disabled={isCodexSmokeTestRunning}>
            {strings.homeSmokeTestLabel}
          </button>
        </div>
      </section>

      <p className="page-note">{strings.homeHint}</p>
    </section>
  );
}
