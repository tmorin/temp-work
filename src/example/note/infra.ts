import { EitherAsync, Maybe, Right } from "purify-ts";
import * as uuid from "uuid";
import { Note, NoteFactory, NoteRepository } from "./model";

export class SimpleNoteFactory implements NoteFactory {
  createFromScratch(data: {
    title: string;
    content: string;
  }): EitherAsync<Error, Note> {
    return EitherAsync.liftEither(
      Right({
        id: uuid.v4(),
        title: data.title,
        content: data.content
      })
    );
  }
}

export class InMemoryNoteRepository implements NoteRepository {
  constructor(readonly map = new Map<string, Note>()) {}

  get(id: string): EitherAsync<Error, Note> {
    return EitherAsync.liftEither(
      Maybe.fromNullable(this.map.get(id)).toEither<Error>(
        new Error(`unable to find the note ${id}`)
      )
    );
  }

  persist(note: Note): EitherAsync<Error, Note> {
    this.map.set(note.id, note);
    return this.get(note.id);
  }

  delete(id: string): EitherAsync<Error, string> {
    return this.get(id)
      .ifRight((note) => this.map.delete(note.id))
      .map((note) => note.id);
  }
}
