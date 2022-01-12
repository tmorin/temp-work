import { EventBus, ObservableEventBus } from "./event";
import { CommandBus, ObservableCommandBus } from "./command";
import { ObservableQueryBus, QueryBus } from "./query";
import { Disposable } from "./common";

export type ObservableGateway = ObservableEventBus &
  ObservableCommandBus &
  ObservableQueryBus;

export interface Gateway<
  E extends EventBus = EventBus,
  C extends CommandBus = CommandBus,
  Q extends QueryBus = QueryBus,
  O extends ObservableGateway = ObservableGateway
> extends Disposable {
  readonly events: E;
  readonly commands: C;
  readonly queries: Q;
  readonly observe: O;
}
