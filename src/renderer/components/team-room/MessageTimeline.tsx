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
    <section aria-labelledby="team-room-timeline">
      <h2 id="team-room-timeline">{strings.timelineTitle}</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <strong>{item.actor}</strong>
            <span> · {item.time}</span>
            <p>{item.message}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
