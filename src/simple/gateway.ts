import {
  Gateway,
  CommandBusNotificationMap,
  ObservableGateway,
  QueryBusNotificationMap,
  EventBusNotificationMap,
  Observable
} from "../api";
import { SimpleEventBus } from "./event";
import { SimpleCommandBus } from "./command";
import { SimpleQueryBus } from "./query";

export type GatewayNotiificationMap = EventBusNotificationMap &
  CommandBusNotificationMap &
  QueryBusNotificationMap;

class SimpleObservableGateway implements ObservableGateway {
  constructor(
    private readonly events: Observable,
    private readonly commands: Observable,
    private readonly queries: Observable
  ) {}

  on<K extends keyof GatewayNotiificationMap>(
    type: K,
    listener: (event: GatewayNotiificationMap[K]) => any
  ) {
    this.events.on(type, listener);
    this.commands.on(type, listener);
    this.queries.on(type, listener);
    return this;
  }

  off<K extends keyof GatewayNotiificationMap>(
    type?: K,
    listener?: (event: GatewayNotiificationMap[K]) => any
  ) {
    this.events.off(type, listener);
    this.commands.off(type, listener);
    this.queries.off(type, listener);
    return this;
  }
}

export class SimpleGateway implements Gateway {
  constructor(
    readonly events: SimpleEventBus,
    readonly commands: SimpleCommandBus,
    readonly queries: SimpleQueryBus,
    readonly observe = new SimpleObservableGateway(
      events.observe,
      commands.observe,
      queries.observe
    )
  ) {}

  async dispose() {
    await this.events.dispose();
    await this.commands.dispose();
    await this.queries.dispose();
    this.observe.off();
  }
}
