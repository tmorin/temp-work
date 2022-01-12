import { Removable } from "./common";
import { Message, MessageHeaders } from "./message";
import { Emitter, Observable } from "./observable";

export type EventKind = "event";

export interface Event<B = any, H extends MessageHeaders = MessageHeaders>
  extends Message<B, H> {
  kind: EventKind;
}

export interface EventListener<E extends Event = Event> {
  (event: E): any;
}

export interface SubscribeOptions {
  once: boolean;
}

export interface EventBus {
  /**
   * Publish events on the bus.
   * @param events the events
   */
  publish<E extends Event = Event>(...events: Array<E>): void;

  /**
   * Subscribe to an event.
   * @param eventType the type of the event
   * @param listener the listener
   */
  subscribe<E extends Event = Event>(
    eventType: string,
    listener: EventListener<E>,
    options?: Partial<SubscribeOptions>
  ): Removable;
}

export type EventBusNotificationMap = {
  event_listener_failed: {
    bus: EventBus;
    event: Event;
    error: Error;
  };
  disposed: {
    bus: EventBus;
  };
};

export interface ObservableEventBus extends Observable {
  on<K extends keyof EventBusNotificationMap>(
    type: K,
    listener: (event: EventBusNotificationMap[K]) => any
  ): this;
  off<K extends keyof EventBusNotificationMap>(
    type?: K,
    listener?: (event: EventBusNotificationMap[K]) => any
  ): this;
}

export interface EmitterEventBus extends Emitter {
  emit<K extends keyof EventBusNotificationMap>(
    type: K,
    event: EventBusNotificationMap[K]
  ): void;
}
