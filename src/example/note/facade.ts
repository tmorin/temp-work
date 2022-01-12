import { EitherAsync, Maybe } from "purify-ts";
import { PurifyGateway } from "../../purify";
import { NoteView } from "./views";
import {
  createCreateNote,
  createDeleteNote,
  createUpdateNote
} from "./messages";

export class NoteFacade {
  constructor(private readonly gateway: PurifyGateway) {}

  create(data: {
    content: string;
    title: string;
  }): EitherAsync<Error, Maybe<NoteView>> {
    return this.gateway.commands.execute<NoteView>(createCreateNote(data));
  }

  update(data: {
    id: string;
    content: string;
    title: string;
  }): EitherAsync<Error, Maybe<NoteView>> {
    return this.gateway.commands.execute<NoteView>(createUpdateNote(data));
  }

  delete(data: { id: string }): EitherAsync<Error, Maybe<NoteView>> {
    return this.gateway.commands.execute<NoteView>(createDeleteNote(data));
  }
}
