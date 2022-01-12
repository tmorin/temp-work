import { Message, MessageHeaders } from "./message";

export type ResultKind = "result";

export type ResultHeaders = MessageHeaders & {
  originalMessageId: string;
};

export interface Result<B = any, H extends ResultHeaders = ResultHeaders>
  extends Message<B, H> {
  kind: ResultKind;
}

export interface EmptyResult<
  B = undefined,
  H extends ResultHeaders = ResultHeaders
> extends Result<B, H> {}
