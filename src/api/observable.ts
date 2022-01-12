/**
 * Listener of Bus's events.
 */
export interface ObservedEventListener {
  (event: any): any;
}

export interface Observable {
  /**
   * Add a listener to an internal event.
   * @param type the type of the event
   * @param listener the listener
   */
  on(type: string, listener: ObservedEventListener): this;
  /**
   * Remove a listener to an internal event.
   *
   *  However:
   * - When `type` and `listener` are undefined then all listeners are removed.
   * - When `listener` is undefined then all listeners of the given `type` are removed.
   *
   * @param type the type of the event
   * @param listener the listener
   */
  off(type?: string, listener?: ObservedEventListener): this;
}

export interface Emitter extends Observable {
  /**
   * Emit an event.
   * @param type the type of the event
   * @param event the event
   */
  emit(type: string, event: any): void;
}
