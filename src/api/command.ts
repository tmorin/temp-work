import { MessageHeaders } from "./message";
import { Action, ExecuteActionOptions } from "./action";
import { Result, EmptyResult } from "./result";
import { Event } from "./event";
import { Disposable, Removable } from "./common";
import { Emitter, Observable } from "./observable";

export type CommandKind = "command";

export interface Command<B = any, H extends MessageHeaders = MessageHeaders>
  extends Action<B, H> {
  kind: CommandKind;
}

export type CommandResult<R extends Result = Result> = R | EmptyResult;

export type CommandHandlerOutputSync<
  R extends Result,
  Es extends Array<Event> = []
> = void | { result?: R; events?: Es };

export type CommandHandlerOutputAsync<
  R extends Result,
  Es extends Array<Event> = []
> = Promise<CommandHandlerOutputSync<R, Es>>;

export type CommandHandlerOutput<
  R extends Result = Result,
  Es extends Array<Event> = []
> = CommandHandlerOutputSync<R, Es> | CommandHandlerOutputAsync<R, Es>;

export interface CommandHandler<
  C extends Command = Command,
  R extends Result = Result,
  Es extends Array<Event> = []
> {
  (command: C): CommandHandlerOutput<R, Es>;
}

export interface CommandBus extends Disposable {
  execute<R extends Result = Result, C extends Command = Command>(
    command: C,
    options?: Partial<ExecuteActionOptions>
  ): Promise<R | EmptyResult>;

  executeAndForget<C extends Command = Command>(command: C): void;

  handle<
    C extends Command = Command,
    R extends Result = Result,
    Es extends Array<Event> = []
  >(
    commandType: string,
    handler: CommandHandler<C, R, Es>
  ): Removable;
}

export type CommandBusNotificationMap = {
  command_handler_failed: {
    bus: CommandBus;
    command: Command;
    error: Error;
  };
  command_handler_not_found: {
    bus: CommandBus;
    command: Command;
    error: Error;
  };
  disposed: {
    bus: CommandBus;
  };
};

export interface ObservableCommandBus extends Observable {
  on<K extends keyof CommandBusNotificationMap>(
    type: K,
    listener: (event: CommandBusNotificationMap[K]) => any
  ): this;
  off<K extends keyof CommandBusNotificationMap>(
    type?: K,
    listener?: (event: CommandBusNotificationMap[K]) => any
  ): this;
}

export interface EmitterCommandyBus extends Emitter {
  emit<K extends keyof CommandBusNotificationMap>(
    type: K,
    event: CommandBusNotificationMap[K]
  ): void;
}
