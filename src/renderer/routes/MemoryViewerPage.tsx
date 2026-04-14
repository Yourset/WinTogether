import { useEffect, useState } from "react";

import { getStrings } from "../i18n";
import { useAppStore, type MemoryOverview } from "../store/appStore";

export function MemoryViewerPage() {
  const language = useAppStore((state) => state.language);
  const strings = getStrings(language);
  const [memoryOverview, setMemoryOverview] = useState<MemoryOverview | null>(null);

  useEffect(() => {
    let cancelled = false;

    void window.winTogether?.getMemoryOverview?.().then((overview: MemoryOverview | undefined) => {
      if (!cancelled) {
        setMemoryOverview(overview ?? null);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section data-testid="memory-viewer-page" style={{ display: "grid", gap: "0.8rem" }}>
      <h1 style={{ margin: 0 }}>{strings.memoryTitle}</h1>
      <p style={{ margin: 0, color: "#94a3b8", lineHeight: 1.7 }}>{strings.memoryIntro}</p>
      {memoryOverview ? (
        <div style={{ display: "grid", gap: "1rem" }}>
          <article
            data-testid="memory-viewer-index-card"
            style={{
              borderRadius: "18px",
              border: "1px solid rgba(148, 163, 184, 0.14)",
              background: "rgba(255, 255, 255, 0.03)",
              padding: "1rem"
            }}
          >
            <h2 style={{ marginTop: 0 }}>{strings.memoryIndexSection}</h2>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{memoryOverview.indexContent}</pre>
          </article>
          <article
            data-testid="memory-viewer-work-log-card"
            style={{
              borderRadius: "18px",
              border: "1px solid rgba(148, 163, 184, 0.14)",
              background: "rgba(255, 255, 255, 0.03)",
              padding: "1rem"
            }}
          >
            <h2 style={{ marginTop: 0 }}>{strings.memoryWorkLogSection}</h2>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{memoryOverview.workLogContent}</pre>
          </article>
        </div>
      ) : (
        <p data-testid="memory-viewer-loading" style={{ margin: 0, color: "#94a3b8", lineHeight: 1.7 }}>
          {strings.memoryLoading}
        </p>
      )}
    </section>
  );
}
