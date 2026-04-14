import type { AppEvent, AppEventType } from "../../shared/contracts/events";

type EventHandler = (event: AppEvent) => void;

export class EventBus {
  private readonly handlers = new Map<AppEventType, Set<EventHandler>>();

  subscribe(type: AppEventType, handler: EventHandler) {
    const handlers = this.handlers.get(type) ?? new Set<EventHandler>();
    handlers.add(handler);
    this.handlers.set(type, handlers);

    return () => {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.handlers.delete(type);
      }
    };
  }

  publish(event: AppEvent) {
    const handlers = this.handlers.get(event.type);
    if (!handlers) {
      return;
    }

    for (const handler of handlers) {
      handler(event);
    }
  }
}
