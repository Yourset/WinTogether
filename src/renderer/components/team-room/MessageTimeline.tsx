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
    <section
      aria-labelledby="team-room-timeline"
      style={{
        borderRadius: "20px",
        border: "1px solid rgba(148, 163, 184, 0.14)",
        background: "rgba(15, 23, 42, 0.7)",
        padding: "1rem"
      }}
    >
      <h2 id="team-room-timeline" style={{ marginTop: 0 }}>
        {strings.timelineTitle}
      </h2>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.8rem" }}>
        {items.map((item) => (
          <li
            key={item.id}
            style={{
              borderRadius: "16px",
              border: "1px solid rgba(148, 163, 184, 0.12)",
              background: item.actor === strings.systemActor ? "rgba(124, 200, 255, 0.08)" : "rgba(255, 255, 255, 0.03)",
              padding: "0.9rem 1rem",
              display: "grid",
              gap: "0.55rem"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "baseline" }}>
              <strong
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem"
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "0.6rem",
                    height: "0.6rem",
                    borderRadius: "999px",
                    background: item.actor === strings.systemActor ? "#7cc8ff" : "#73e0a9"
                  }}
                />
                {item.actor}
              </strong>
              <span style={{ color: "#8da2bd", fontSize: "0.85rem" }}>{item.time}</span>
            </div>
            <p style={{ margin: 0, lineHeight: 1.7, color: "#d7e3f3" }}>{item.message}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
