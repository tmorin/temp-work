import { Event, EventListener, MessageBuilder } from "../api";
import { SimpleEventBus } from "./event";
import { ObservedEventEmitter } from "./observable";

function createEventA(body: string): Event<string> {
  return MessageBuilder.event<string>("EventA").body(body).build();
}

describe("SimpleEventBus", function () {
  let emitter: ObservedEventEmitter;
  let listeners: Map<string, Set<EventListener<any>>>;
  let bus: SimpleEventBus;
  beforeEach(async function () {
    emitter = new ObservedEventEmitter();
    listeners = new Map();
    bus = new SimpleEventBus(emitter, listeners);
  });
  afterEach(async function () {
    emitter.off();
    await bus?.dispose();
  });

  it("should publish event", function (done) {
    bus.subscribe("EventA", (event) => {
      expect(event).toHaveProperty("body", "hello");
      done();
    });
    const eventA = createEventA("hello");
    bus.publish(eventA);
  });

  it("should listen to once", function (done) {
    bus.subscribe(
      "EventA",
      () =>
        setTimeout(() => {
          expect(listeners.size).toBe(1);
          expect(listeners.get("EventA")?.size).toBe(0);
          done();
        }, 0),
      { once: true }
    );
    const eventA = createEventA("hello");
    bus.publish(eventA);
  });

  it("should remove listener", function () {
    const remover = bus.subscribe("EventA", () => {});
    expect(listeners.size).toBe(1);
    expect(listeners.get("EventA")?.size).toBe(1);
    remover.remove();
    expect(listeners.size).toBe(1);
    expect(listeners.get("EventA")?.size).toBe(0);
  });

  it("should notify on failed sync listener", function (done) {
    const eventA = createEventA("hello");
    const errorA = new Error("an error");
    bus.subscribe("EventA", () => {
      throw errorA;
    });
    bus.observe.on("event_listener_failed", ({ bus, event, error }) => {
      expect(bus).toBe(bus);
      expect(event).toBe(eventA);
      expect(error).toBe(error);
      done();
    });
    bus.publish(eventA);
  });

  it("should notify on failed async listener", function (done) {
    const eventA = createEventA("hello");
    const errorA = new Error("an error");
    bus.subscribe("EventA", () => Promise.reject(errorA));
    bus.observe.on("event_listener_failed", ({ bus, event, error }) => {
      expect(bus).toBe(bus);
      expect(event).toBe(eventA);
      expect(error).toBe(error);
      done();
    });
    bus.publish(eventA);
  });
});
