import { Action } from "./action";
import { Command } from "./command";
import { Event } from "./event";
import { Message, MessageHeaders, MessageKind } from "./message";
import { Query } from "./query";
import { Result, ResultHeaders } from "./result";

let counter = 0;
function getNewNbr() {
  return counter++;
}

export class MessageBuilder<
  B = any,
  H extends MessageHeaders = MessageHeaders,
  M extends Message<B, H> = Message<B, H>
> {
  static get<
    B = any,
    H extends MessageHeaders = MessageHeaders,
    M extends Message<B, H> = Message<B, H>
  >(kind: MessageKind) {
    return new MessageBuilder<B, H, M>(kind, kind);
  }

  static command<
    B = any,
    H extends MessageHeaders = MessageHeaders,
    M extends Command<B, H> = Command<B, H>
  >(type: string) {
    return new MessageBuilder<B, H, M>("command", type);
  }

  static query<
    B = any,
    H extends MessageHeaders = MessageHeaders,
    M extends Query<B, H> = Query<B, H>
  >(type: string) {
    return new MessageBuilder<B, H, M>("query", type);
  }

  static result<
    B = any,
    H extends ResultHeaders = ResultHeaders,
    M extends Result<B, H> = Result<B, H>
  >(action: Action, type?: string) {
    return new MessageBuilder<B, H, M>("result", type || "result").headers(<
      Partial<H>
    >{
      originalMessageId: action.headers.messageId
    });
  }

  static empty<
    B = undefined,
    H extends ResultHeaders = ResultHeaders,
    M extends Result<B, H> = Result<B, H>
  >(action: Action) {
    return this.result<B, H, M>(action, "empty");
  }

  static event<
    B = any,
    H extends MessageHeaders = MessageHeaders,
    M extends Event<B, H> = Event<B, H>
  >(type: string) {
    return new MessageBuilder<B, H, M>("event", type);
  }

  constructor(
    protected readonly _messageKind: MessageKind,
    protected _messageType: string = _messageKind,
    protected _messageId: string = `${_messageType}-${getNewNbr()}-${Date.now()}}`,
    protected _body?: B,
    protected _headers: Partial<H> = {}
  ) {}

  type(type: string) {
    this._messageType = type;
    return this;
  }

  identifier(identifier: string) {
    this._messageId = identifier;
    return this;
  }

  body(body: B) {
    this._body = body;
    return this;
  }

  headers(headers: Partial<H>) {
    this._headers = { ...this._headers, ...headers };
    return this;
  }

  build(): M {
    const kind = this._messageKind;
    const body = this._body;
    const headers = <MessageHeaders>{
      ...this._headers,
      messageType: this._messageType,
      messageId: this._messageId
    };
    return <M>{
      kind,
      headers,
      body
    };
  }
}
