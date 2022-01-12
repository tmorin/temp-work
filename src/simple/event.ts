import {
  Disposable,
  EmitterEventBus,
  Event,
  EventBus,
  EventListener,
  ObservableEventBus,
  Removable,
  SubscribeOptions
} from "../api";

export class SimpleEventBus implements EventBus, Disposable {
  get observe(): ObservableEventBus {
    return this.emitter;
  }

  constructor(
    private readonly emitter: EmitterEventBus,
    private readonly listeners = new Map<string, Set<EventListener<any>>>()
  ) {}

  publish<E extends Event = Event>(...events: Array<E>): void {
    events.forEach((event) =>
      this.listeners.get(event.headers.messageType)?.forEach((listener) =>
        Promise.resolve((async () => listener(event))()).catch((error) =>
          this.emitter.emit("event_listener_failed", {
            bus: this,
            event,
            error
          })
        )
      )
    );
  }

  subscribe<E extends Event = Event>(
    eventType: string,
    listener: EventListener<E>,
    options?: Partial<SubscribeOptions>
  ): Removable {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    const listenerWrapper = (event: E) => {
      if (options?.once) {
        this.listeners.get(eventType)?.delete(listenerWrapper);
      }
      return listener(event);
    };
    this.listeners.get(eventType)?.add(listenerWrapper);
    return {
      remove: () => {
        this.listeners.get(eventType)?.delete(listenerWrapper);
      }
    };
  }

  async dispose() {
    this.listeners.clear();
    this.emitter.emit("disposed", { bus: this });
  }
}
