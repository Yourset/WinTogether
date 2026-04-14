import { getStrings } from "../../i18n";
import { useAppStore } from "../../store/appStore";

type ContextPanelProps = {
  missionId: string | null;
  focus: string;
};

export function ContextPanel({ missionId, focus }: ContextPanelProps) {
  const language = useAppStore((state) => state.language);
  const strings = getStrings(language);

  return (
    <section
      aria-labelledby="team-room-context"
      style={{
        borderRadius: "20px",
        border: "1px solid rgba(148, 163, 184, 0.14)",
        background: "rgba(15, 23, 42, 0.7)",
        padding: "1rem"
      }}
    >
      <h2 id="team-room-context" style={{ marginTop: 0 }}>
        {strings.contextTitle}
      </h2>
      <dl style={{ margin: 0, display: "grid", gap: "1rem" }}>
        <div>
          <dt style={{ color: "#8da2bd", marginBottom: "0.35rem" }}>{strings.contextMission}</dt>
          <dd style={{ margin: 0 }}>{missionId ?? strings.missionIdUnassigned}</dd>
        </div>
        <div>
          <dt style={{ color: "#8da2bd", marginBottom: "0.35rem" }}>{strings.contextFocus}</dt>
          <dd style={{ margin: 0, lineHeight: 1.7 }}>{focus}</dd>
        </div>
      </dl>
    </section>
  );
}
