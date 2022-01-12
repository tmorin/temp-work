import { Either, EitherAsync, Maybe, Right } from "purify-ts";
import { PurifyCommandOutputAsync } from "../../purify";
import {
  CreateNote,
  createNoteCreated,
  createNoteDeleted,
  createNoteUpdated,
  DeleteNote,
  NoteCreated,
  NoteDeleted,
  NoteUpdated,
  UpdateNote
} from "./messages";
import { NoteView } from "./views";

export type Note = {
  readonly id: string;
  readonly title: string;
  readonly content: string;
};

export function applyNoteCreated(
  note: Note,
  event: NoteCreated
): Either<Error, Note> {
  return Right({ ...note });
}

export function applyNoteUpdated(
  note: Note,
  event: NoteUpdated
): Either<Error, Note> {
  return Right({
    ...note,
    title: event.body.title,
    content: event.body.content
  });
}

export function applyNoteDeleted(
  note: Note,
  event: NoteDeleted
): Either<Error, Note> {
  return Right({ ...note });
}

function createNoteView(note: Note): NoteView {
  return {
    id: note.id,
    title: note.title,
    content: note.content
  };
}

export interface NoteFactory {
  createFromScratch(data: {
    title: string;
    content: string;
  }): EitherAsync<Error, Note>;
}

export interface NoteRepository {
  get(id: string): EitherAsync<Error, Note>;
  persist(note: Note): EitherAsync<Error, Note>;
  delete(id: string): EitherAsync<Error, string>;
}

export class CreateNoteHandler {
  constructor(
    readonly noteFactory: NoteFactory,
    readonly noteRepository: NoteRepository
  ) {}
  handle(
    command: CreateNote
  ): PurifyCommandOutputAsync<NoteView, NoteCreated[]> {
    return this.noteFactory
      .createFromScratch(command.body)
      .map((note) => ({
        note,
        noteCreated: createNoteCreated(note)
      }))
      .chain(({ note, noteCreated }) =>
        EitherAsync.liftEither(applyNoteCreated(note, noteCreated)).map(
          (note) => ({
            note,
            noteCreated
          })
        )
      )
      .chain(({ note, noteCreated }) =>
        this.noteRepository.persist(note).map((note) => ({
          note,
          noteCreated
        }))
      )
      .map(({ note, noteCreated }) => ({
        result: Maybe.fromNullable(createNoteView(note)),
        events: Maybe.of([noteCreated])
      }));
  }
}

export class UpdateNoteHandler {
  constructor(readonly noteRepository: NoteRepository) {}
  handle(
    command: UpdateNote
  ): PurifyCommandOutputAsync<NoteView, Array<NoteUpdated>> {
    return this.noteRepository
      .get(command.body.id)
      .map((note) => ({
        note,
        noteUpdated: createNoteUpdated({
          id: note.id,
          title: command.body.title,
          content: command.body.content
        })
      }))
      .chain(({ note, noteUpdated }) =>
        EitherAsync.liftEither(applyNoteUpdated(note, noteUpdated)).map(
          (note) => ({
            note,
            noteUpdated
          })
        )
      )
      .chain(({ note, noteUpdated }) =>
        this.noteRepository.persist(note).map((note) => ({
          note,
          noteUpdated
        }))
      )
      .map(({ note, noteUpdated }) => ({
        result: Maybe.fromNullable(createNoteView(note)),
        events: Maybe.of([noteUpdated])
      }));
  }
}

export class DeleteNoteHandler {
  constructor(readonly noteRepository: NoteRepository) {}
  handle(
    command: DeleteNote
  ): PurifyCommandOutputAsync<string, Array<NoteDeleted>> {
    return this.noteRepository
      .get(command.body.id)
      .map((note) => ({
        note,
        noteDeleted: createNoteDeleted({
          id: note.id
        })
      }))
      .chain(({ note, noteDeleted }) =>
        EitherAsync.liftEither(applyNoteDeleted(note, noteDeleted)).map(
          (note) => ({
            note,
            noteDeleted
          })
        )
      )
      .chain(({ note, noteDeleted }) =>
        this.noteRepository.delete(note.id).map((id) => ({
          id,
          noteDeleted
        }))
      )
      .map(({ id, noteDeleted }) => ({
        result: Maybe.fromNullable(id),
        events: Maybe.of([noteDeleted])
      }));
  }
}
