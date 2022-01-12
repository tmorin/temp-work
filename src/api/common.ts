export interface Removable {
  remove(): void;
}

export interface Disposable {
  /**
   * Release all statefull resources.
   */
  dispose(): Promise<void>;
}
