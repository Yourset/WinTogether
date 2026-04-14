import { MissionComposer } from "../components/team-room/MissionComposer";
import { getStrings } from "../i18n";
import { useAppStore } from "../store/appStore";

export function HomePage() {
  const language = useAppStore((state) => state.language);
  const strings = getStrings(language);

  return (
    <section
      style={{
        minHeight: "100%",
        display: "grid",
        alignItems: "center"
      }}
    >
      <div
        style={{
          maxWidth: 860,
          margin: "0 auto",
          width: "100%",
          display: "grid",
          gap: "1.25rem"
        }}
      >
        <div style={{ display: "grid", gap: "0.75rem" }}>
          <h1 style={{ margin: 0, fontSize: "2rem" }}>{strings.homeTitle}</h1>
          <p style={{ margin: 0, color: "#94a3b8", lineHeight: 1.7 }}>{strings.homeIntro}</p>
        </div>

        <MissionComposer hideTitle submitLabel={strings.homeSubmit} surface="home" />

        <p style={{ margin: 0, color: "#94a3b8", lineHeight: 1.7 }}>{strings.homeHint}</p>
      </div>
    </section>
  );
}
