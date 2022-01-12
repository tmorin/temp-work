import { Action, ExecuteActionOptions } from "./action";
import { Removable } from "./common";
import { MessageHeaders } from "./message";
import { Emitter, Observable } from "./observable";
import { Result, EmptyResult } from "./result";

export type QueryKind = "query";

export interface Query<B = any, H extends MessageHeaders = MessageHeaders>
  extends Action<B, H> {
  kind: QueryKind;
}

export type QueryResult<R extends Result = Result> = R | EmptyResult;

export type QueryOutput<R extends Result = Result> =
  | QueryResult<R>
  | Promise<QueryResult<R>>;

export interface QueryHandler<
  Q extends Query = Query,
  R extends Result = Result
> {
  (query: Q): QueryOutput<R>;
}

export interface QueryBus {
  execute<R extends Result = Result, Q extends Query = Query>(
    query: Q,
    options?: Partial<ExecuteActionOptions>
  ): Promise<QueryResult<R>>;

  handle<C extends Query = Query, R extends Result = Result>(
    queryType: string,
    handler: QueryHandler<C, R>
  ): Removable;
}

export type QueryBusNotificationMap = {
  query_handler_failed: {
    bus: QueryBus;
    query: Query;
    error: Error;
  };
  query_handler_not_found: {
    bus: QueryBus;
    query: Query;
    error: Error;
  };
  disposed: {
    bus: QueryBus;
  };
};

export interface ObservableQueryBus extends Observable {
  on<K extends keyof QueryBusNotificationMap>(
    type: K,
    listener: (event: QueryBusNotificationMap[K]) => any
  ): this;
  off<K extends keyof QueryBusNotificationMap>(
    type?: K,
    listener?: (event: QueryBusNotificationMap[K]) => any
  ): this;
}

export interface EmitterQueryBus extends Emitter {
  emit<K extends keyof QueryBusNotificationMap>(
    type: K,
    event: QueryBusNotificationMap[K]
  ): void;
}
