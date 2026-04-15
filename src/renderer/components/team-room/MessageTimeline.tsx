import { getStrings } from "../../i18n";
import { useAppStore } from "../../store/appStore";

type TimelineItem = {
  id: string;
  actor: string;
  message: string;
  time: string;
};

type MessageTimelineProps = {
  items: TimelineItem[];
};

export function MessageTimeline({ items }: MessageTimelineProps) {
  const language = useAppStore((state) => state.language);
  const strings = getStrings(language);

  return (
    <section aria-labelledby="team-room-timeline" className="timeline-panel" data-testid="timeline-panel">
      <h2 id="team-room-timeline" style={{ marginTop: 0 }}>
        {strings.timelineTitle}
      </h2>
      <ul className="timeline-list" data-testid="timeline-list">
        {items.map((item) => (
          <li
            key={item.id}
            className={`timeline-entry ${item.actor === strings.systemActor ? "timeline-entry--system" : ""}`}
            data-testid={`timeline-entry-${item.id}`}
          >
            <div className="timeline-entry__header">
              <strong className="timeline-entry__actor">
                <span className={`timeline-entry__dot ${item.actor === strings.systemActor ? "" : "timeline-entry__dot--agent"}`} />
                {item.actor}
              </strong>
              <span className="timeline-entry__time">{item.time}</span>
            </div>
            <p className="timeline-entry__message">{item.message}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
