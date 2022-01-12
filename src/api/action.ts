import { Message, MessageHeaders } from "./message";

export type ActionKind = "command" | "query";

export interface Action<B = any, H extends MessageHeaders = MessageHeaders>
  extends Message<B, H> {
  kind: ActionKind;
}

export interface Handler {
  remove(): void;
}

export type ExecuteActionOptions = {
  timeout: number;
};
