import {
  Command,
  CommandBus,
  CommandHandler,
  Disposable,
  EmitterCommandyBus,
  EventBus,
  ExecuteActionOptions,
  ObservableCommandBus,
  Removable,
  Result,
  Event,
  EmptyResult,
  MessageBuilder,
  CommandResult,
  CommandHandlerOutputSync
} from "../api";
import { waitForReturn } from "./common";

export class SimpleCommandBus implements CommandBus, Disposable {
  get observe(): ObservableCommandBus {
    return this.emitter;
  }

  constructor(
    private readonly eventBus: EventBus,
    private readonly emitter: EmitterCommandyBus,
    private readonly handlers = new Map<string, CommandHandler<any, any, any>>()
  ) {}

  private resolveHandler(command: Command) {
    let handler = this.handlers.get(command.headers.messageType);
    if (handler) {
      return handler;
    }
    const error = new Error(
      `handler not found for ${command.headers.messageType}`
    );
    this.emitter.emit("command_handler_not_found", {
      bus: this,
      command,
      error
    });
    throw error;
  }

  private processHandlerOutput<R extends Result>(
    output: CommandHandlerOutputSync<R>
  ): CommandResult<R> | void {
    if (output) {
      output.events?.forEach((event) => this.eventBus.publish(event));
      return output.result;
    }
  }

  async execute<R extends Result = Result, C extends Command = Command>(
    command: C,
    options?: Partial<ExecuteActionOptions>
  ): Promise<R | EmptyResult> {
    let handler = this.resolveHandler(command);

    const opts: ExecuteActionOptions = {
      timeout: 500,
      ...options
    };

    let result = await waitForReturn(
      async () => await handler(command),
      opts.timeout
    )
      .then((output) => this.processHandlerOutput(output))
      .catch((error: any) => {
        this.emitter.emit("command_handler_failed", {
          bus: this,
          command,
          error
        });
        throw error;
      });

    if (result && result.kind === "error") {
      throw result.body;
    }

    return result || MessageBuilder.result(command).type("empty").build();
  }

  executeAndForget<C extends Command = Command>(command: C): void {
    let handler = this.resolveHandler(command);
    Promise.resolve((async () => handler(command))())
      .then((output) => this.processHandlerOutput(output))
      .catch((error) => {
        this.emitter.emit("command_handler_failed", {
          bus: this,
          command,
          error
        });
      });
  }

  handle<
    C extends Command = Command,
    R extends Result = Result,
    Es extends Array<Event> = []
  >(commandType: string, handler: CommandHandler<C, R, Es>): Removable {
    if (this.handlers.has(commandType)) {
      throw new Error(`the command type ${commandType} is already handled`);
    }
    this.handlers.set(commandType, handler);
    return {
      remove: () => {
        this.handlers.delete(commandType);
      }
    };
  }

  async dispose(): Promise<void> {
    this.handlers.clear();
    this.emitter.emit("disposed", { bus: this });
  }
}
