import { Emitter, Observable, ObservedEventListener } from "../api";

export class ObservedEventEmitter implements Observable, Emitter {
  constructor(
    private readonly listeners = new Map<string, Set<ObservedEventListener>>()
  ) {}

  emit(type: string, event: any): void {
    this.listeners.get(type)?.forEach((listener) => {
      Promise.resolve((async () => listener(event))()).catch((error) =>
        console.warn("an observed event listener failed", error)
      );
    });
  }

  on(type: string, listener: ObservedEventListener): this {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)?.add(listener);
    return this;
  }

  off(type?: string, listener?: ObservedEventListener): this {
    if (type && listener) {
      this.listeners.get(type)?.delete(listener);
    } else if (type) {
      this.listeners.delete(type);
    } else {
      this.listeners.clear();
    }
    return this;
  }
}
