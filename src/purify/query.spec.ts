import { EitherAsync, Just, Maybe, Nothing } from "purify-ts";
import { Query, QueryHandler, MessageBuilder } from "../api";
import { SimpleQueryBus, ObservedEventEmitter } from "../simple";
import { PurifyQueryBus } from "./query";

function createQueryA(body: string): Query<string> {
  return MessageBuilder.query<string>("QueryA").body(body).build();
}

describe("PurifyQueryBus", function () {
  let emitter: ObservedEventEmitter;
  let handlers: Map<string, QueryHandler<any>>;
  let queryBus: SimpleQueryBus;
  let purifyQueryBus: PurifyQueryBus;
  beforeEach(async function () {
    emitter = new ObservedEventEmitter();
    handlers = new Map();
    queryBus = new SimpleQueryBus(emitter, handlers);
    purifyQueryBus = new PurifyQueryBus(queryBus);
  });
  afterEach(async function () {
    emitter.off();
    await queryBus?.dispose();
  });

  it("should return a result", async function () {
    const queryA = createQueryA("hello");
    purifyQueryBus.handle("QueryA", (query) => {
      return EitherAsync<Error, Maybe<string>>(() => {
        return Promise.resolve(Maybe.fromNullable(query.body));
      });
    });
    const result = await purifyQueryBus.execute<string>(queryA);
    expect(result.isLeft()).toBeFalsy();
    expect(result.isRight()).toBeTruthy();
    const value = result.orDefault(Just("a value"));
    expect(value.extract()).toBe("hello");
  });

  it("should return an empty result", async function () {
    const queryA = createQueryA("hello");
    purifyQueryBus.handle("QueryA", (query) => {
      return EitherAsync<Error, Maybe<string>>(() => {
        return Promise.resolve(Nothing);
      });
    });
    const result = await purifyQueryBus.execute<string>(queryA);
    expect(result.isLeft()).toBeFalsy();
    expect(result.isRight()).toBeTruthy();
    const value = result.orDefault(Just("a value"));
    expect(value.isNothing()).toBeTruthy();
  });

  it("should handle a failure", async function () {
    const queryA = createQueryA("hello");
    purifyQueryBus.handle("QueryA", (query) => {
      return EitherAsync<Error, Maybe<string>>(() => {
        return Promise.reject(new Error("an error"));
      });
    });
    const result = await purifyQueryBus.execute<string>(queryA);
    expect(result.isLeft()).toBeTruthy();
    expect(result.isRight()).toBeFalsy();
    const error = result.swap().orDefault(new Error());
    expect(error.message).toBe("an error");
  });
});
