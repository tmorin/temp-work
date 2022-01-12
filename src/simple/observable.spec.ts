import { ObservedEventListener } from "../api";
import { ObservedEventEmitter } from "./observable";

describe("ObservedEventEmitter", function () {
  let emitter: ObservedEventEmitter;
  let listeners: Map<string, Set<ObservedEventListener>>;
  beforeEach(() => {
    listeners = new Map([["event_0", new Set([() => {}])]]);
    emitter = new ObservedEventEmitter(listeners);
  });
  afterEach(() => {
    emitter.off();
    listeners.clear();
  });

  it("should emit event", function (done) {
    emitter.on("event_a", (event) => {
      expect(event).toBe("hello");
      done();
    });
    emitter.emit("event_a", "hello");
  });

  it("should remove all listeners", function () {
    emitter.on("event_a", () => {});
    expect(listeners.size).toBe(2);
    emitter.off();
    expect(listeners.size).toBe(0);
  });

  it("should remove all listeners for a given a type", function () {
    emitter.on("event_a", () => {});
    expect(listeners.get("event_a")?.size).toBe(1);
    emitter.off("event_a");
    expect(listeners.has("event_a")).toBeFalsy();
  });

  it("should remove all listeners for a given a listener", function () {
    const listener = () => {};
    emitter.on("event_a", listener);
    expect(listeners.get("event_a")?.size).toBe(1);
    emitter.off("event_a", listener);
    expect(listeners.get("event_a")?.size).toBe(0);
  });
});
