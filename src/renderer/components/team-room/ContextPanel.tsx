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
    <section aria-labelledby="team-room-context" className="context-panel">
      <h2 id="team-room-context" style={{ marginTop: 0 }}>
        {strings.contextTitle}
      </h2>
      <dl>
        <div>
          <dt>{strings.contextMission}</dt>
          <dd>{missionId ?? strings.missionIdUnassigned}</dd>
        </div>
        <div>
          <dt>{strings.contextFocus}</dt>
          <dd>{focus}</dd>
        </div>
      </dl>
    </section>
  );
}
