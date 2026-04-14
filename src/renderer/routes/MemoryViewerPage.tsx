import { getStrings } from "../i18n";
import { useAppStore } from "../store/appStore";

export function MemoryViewerPage() {
  const language = useAppStore((state) => state.language);
  const strings = getStrings(language);

  return (
    <section style={{ display: "grid", gap: "0.8rem" }}>
      <h1 style={{ margin: 0 }}>{strings.memoryTitle}</h1>
      <p style={{ margin: 0, color: "#94a3b8", lineHeight: 1.7 }}>{strings.memoryIntro}</p>
    </section>
  );
}
