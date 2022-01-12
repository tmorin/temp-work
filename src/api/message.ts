export type MessageKind = "command" | "query" | "result" | "event";
export type MessageId = string;
export type MessageType = string;

export type MessageHeaderValue = string | number | Array<string | number>;

export type MessageHeaders = {
  messageType: MessageType;
  messageId: MessageId;
  [key: string]: MessageHeaderValue;
};

export interface Message<B = any, H extends MessageHeaders = MessageHeaders> {
  kind: MessageKind;
  headers: H;
  body: B;
}
