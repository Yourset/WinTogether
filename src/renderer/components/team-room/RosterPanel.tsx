import type { MissionTeamRecord } from "../../../shared/contracts/team";
import { getStrings } from "../../i18n";
import { useAppStore } from "../../store/appStore";

type RosterPanelProps = {
  team: MissionTeamRecord | null;
};

export function RosterPanel({ team }: RosterPanelProps) {
  const language = useAppStore((state) => state.language);
  const strings = getStrings(language);

  return (
    <section aria-labelledby="team-room-agents" className="roster-panel" data-testid="roster-panel">
      <h2 id="team-room-agents" style={{ marginTop: 0 }}>
        {strings.rosterTitle}
      </h2>

      {team ? (
        <ul className="roster-list">
          {team.members.map((member) => (
            <li key={member.templateMemberId} className="roster-list__item" data-testid={`roster-member-${member.templateMemberId}`}>
              <div style={{ fontWeight: 600 }}>{member.displayName}</div>
              <div className="roster-list__meta">{member.primary ? strings.rosterLead : strings.rosterMember}</div>
              <p style={{ margin: "0.45rem 0 0", color: "var(--text-muted)", lineHeight: 1.55 }}>{member.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p data-testid="roster-empty-state" style={{ margin: 0, color: "var(--text-muted)", lineHeight: 1.7 }}>
          {strings.rosterEmptyState}
        </p>
      )}
    </section>
  );
}
