import { Query, Command, Event, Result, Action, MessageBuilder } from "../api";
import { SimpleCommandBus } from "./command";
import { SimpleEventBus } from "./event";
import { SimpleQueryBus } from "./query";
import { ObservedEventEmitter } from "./observable";
import { SimpleGateway } from "./gateway";

function createCommandA(body: string): Command<string> {
  return MessageBuilder.command<string>("CommandA").body(body).build();
}

function createQueryA(body: string): Query<string> {
  return MessageBuilder.query<string>("QueryA").body(body).build();
}

function createResultA(action: Action, body: string): Result<string> {
  return MessageBuilder.result<string>(action).body(body).build();
}

function createEventA(body: string): Event<string> {
  return MessageBuilder.event<string>("EventA").body(body).build();
}

describe("SimpleObservableGateway", function () {
  let emitter: ObservedEventEmitter;
  let eventBus: SimpleEventBus;
  let commandBus: SimpleCommandBus;
  let queryBus: SimpleQueryBus;
  let gateway: SimpleGateway;
  beforeEach(async function () {
    emitter = new ObservedEventEmitter();
    eventBus = new SimpleEventBus(emitter);
    commandBus = new SimpleCommandBus(eventBus, emitter);
    queryBus = new SimpleQueryBus(emitter);
    gateway = new SimpleGateway(eventBus, commandBus, queryBus);
  });
  afterEach(async function () {
    await gateway?.dispose();
  });

  it("should execute command", async function () {
    const commandA = createCommandA("hello");
    commandBus.handle("CommandA", (command) => ({
      result: createResultA(command, command.body)
    }));
    const resultA = await commandBus.execute<Result<string>>(commandA);
    expect(resultA).toHaveProperty("body", "hello");
  });

  it("should execute query", async function () {
    const queryA = createQueryA("hello");
    queryBus.handle("QueryA", (query) => createResultA(query, query.body));
    const resultA = await queryBus.execute<Result<string>>(queryA);
    expect(resultA).toHaveProperty("body", "hello");
  });

  it("should execute subscribe to event", function (done) {
    const eventA = createEventA("hello");
    eventBus.subscribe("EventA", () => done());
    eventBus.publish(eventA);
  });
});
