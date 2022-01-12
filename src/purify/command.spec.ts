import { EitherAsync, Just, Maybe } from "purify-ts";
import { Command, CommandHandler, MessageBuilder } from "../api";
import {
  SimpleCommandBus,
  SimpleEventBus,
  ObservedEventEmitter
} from "../simple";
import { createPurifyCommandOutput, PurifyCommandBus } from "./command";

function createCommandA(body: string): Command<string> {
  return MessageBuilder.command<string>("CommandA").body(body).build();
}

describe("PurifyCommandBus", function () {
  let emitter: ObservedEventEmitter;
  let handlers: Map<string, CommandHandler<any>>;
  let eventBus: SimpleEventBus;
  let commandBus: SimpleCommandBus;
  let purifyCommandBus: PurifyCommandBus;
  beforeEach(async function () {
    emitter = new ObservedEventEmitter();
    handlers = new Map();
    eventBus = new SimpleEventBus(emitter);
    commandBus = new SimpleCommandBus(eventBus, emitter, handlers);
    purifyCommandBus = new PurifyCommandBus(commandBus);
  });
  afterEach(async function () {
    emitter.off();
    await eventBus?.dispose();
    await commandBus?.dispose();
  });

  it("should return a result", async function () {
    const commandA = createCommandA("hello");
    purifyCommandBus.handle("CommandA", (command) => {
      return EitherAsync(() => {
        return Promise.resolve(
          createPurifyCommandOutput<string>({
            result: Maybe.fromNullable(command.body)
          })
        );
      });
    });
    const result = await purifyCommandBus.execute<string>(commandA);
    expect(result.isLeft()).toBeFalsy();
    expect(result.isRight()).toBeTruthy();
    const value = result.orDefault(Just("a value"));
    expect(value.extract()).toBe("hello");
  });

  it("should return an empty result", async function () {
    const commandA = createCommandA("hello");
    purifyCommandBus.handle("CommandA", (command) => {
      return EitherAsync(() => {
        return Promise.resolve(createPurifyCommandOutput<string>());
      });
    });
    const result = await purifyCommandBus.execute<string>(commandA);
    expect(result.isLeft()).toBeFalsy();
    expect(result.isRight()).toBeTruthy();
    const value = result.orDefault(Just("a value"));
    expect(value.isNothing()).toBeTruthy();
  });

  it("should handle a failure", async function () {
    const commandA = createCommandA("hello");
    purifyCommandBus.handle("CommandA", (command) => {
      return EitherAsync(() => {
        return Promise.reject(new Error("an error"));
      });
    });
    const result = await purifyCommandBus.execute<string>(commandA);
    expect(result.isLeft()).toBeTruthy();
    expect(result.isRight()).toBeFalsy();
    const error = result.swap().orDefault(new Error());
    expect(error.message).toBe("an error");
  });
});
