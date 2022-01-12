import { Command, Event, MessageBuilder } from "../../api";

/** COMMANDS **/

export type CreateNoteBody = Readonly<{ title: string; content: string }>;
export type CreateNote = Command<CreateNoteBody>;
export function createCreateNote(body: CreateNoteBody): CreateNote {
  return MessageBuilder.command(createCreateNote.MESSAGE_TYPE)
    .body(body)
    .build();
}
createCreateNote.MESSAGE_TYPE = "CreateNote";

export type UpdateNoteBody = Readonly<{
  id: string;
  title: string;
  content: string;
}>;
export type UpdateNote = Command<UpdateNoteBody>;
export function createUpdateNote(body: UpdateNoteBody): UpdateNote {
  return MessageBuilder.command(createUpdateNote.MESSAGE_TYPE)
    .body(body)
    .build();
}
createUpdateNote.MESSAGE_TYPE = "UpdateNote";

export type DeleteNoteBody = Readonly<{ id: string }>;
export type DeleteNote = Command<DeleteNoteBody>;
export function createDeleteNote(body: DeleteNoteBody): DeleteNote {
  return MessageBuilder.command(createDeleteNote.MESSAGE_TYPE)
    .body(body)
    .build();
}
createDeleteNote.MESSAGE_TYPE = "DeleteNote";

/** QUERIES **/

/** EVENTS **/

export type NoteCreatedBody = Readonly<{
  id: string;
  title: string;
  content: string;
}>;
export type NoteCreated = Event<NoteCreatedBody>;
export function createNoteCreated(body: NoteCreatedBody): NoteCreated {
  return MessageBuilder.event(createNoteCreated.MESSAGE_TYPE)
    .body(body)
    .build();
}
createNoteCreated.MESSAGE_TYPE = "NoteCreated";

export type NoteUpdatedBody = Readonly<{
  id: string;
  title: string;
  content: string;
}>;
export type NoteUpdated = Event<NoteUpdatedBody>;
export function createNoteUpdated(body: NoteUpdatedBody): NoteUpdated {
  return MessageBuilder.event(createNoteUpdated.MESSAGE_TYPE)
    .body(body)
    .build();
}
createNoteUpdated.MESSAGE_TYPE = "NoteUpdated";

export type NoteDeletedBody = Readonly<{ id: string }>;
export type NoteDeleted = Event<NoteDeletedBody>;
export function createNoteDeleted(body: NoteDeletedBody): NoteDeleted {
  return MessageBuilder.event(createNoteDeleted.MESSAGE_TYPE)
    .body(body)
    .build();
}
createNoteDeleted.MESSAGE_TYPE = "NoteDeleted";
