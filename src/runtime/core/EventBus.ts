import type { AppEvent, AppEventHandler, AppEventType } from "../../shared/contracts/events";

type AnyEventHandler = AppEventHandler<AppEventType>;

type PublishableEvent = AppEvent<AppEventType>;

export class EventBus {
  private readonly handlers = new Map<AppEventType, Set<AnyEventHandler>>();
  private readonly events: PublishableEvent[] = [];

  subscribe<TType extends AppEventType>(type: TType, handler: AppEventHandler<TType>) {
    const handlers = this.handlers.get(type) ?? new Set<AnyEventHandler>();
    handlers.add(handler as AnyEventHandler);
    this.handlers.set(type, handlers);

    return () => {
      handlers.delete(handler as AnyEventHandler);
      if (handlers.size === 0) {
        this.handlers.delete(type);
      }
    };
  }

  publish<TType extends AppEventType>(event: AppEvent<TType>) {
    this.events.push(event as PublishableEvent);
    const handlers = this.handlers.get(event.type);
    if (!handlers) {
      return;
    }

    for (const handler of [...handlers]) {
      try {
        handler(event as PublishableEvent);
      } catch (error) {
        this.handleHandlerError(error, event as PublishableEvent);
      }
    }
  }

  getEvents() {
    return [...this.events];
  }

  private handleHandlerError(error: unknown, event: PublishableEvent) {
    if (typeof console !== "undefined" && typeof console.error === "function") {
      console.error("EventBus listener failed", { error, event });
    }
  }
}
