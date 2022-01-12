import { InMemoryNoteRepository, SimpleNoteFactory } from "./infra";
import { createCreateNote, createUpdateNote } from "./messages";
import {
  CreateNoteHandler,
  DeleteNoteHandler,
  UpdateNoteHandler
} from "./model";

describe("CreateNoteHandler", function () {
  let inMemoryNoteRepository: InMemoryNoteRepository;
  let simpleNoteFactory: SimpleNoteFactory;
  let createNoteHandler: CreateNoteHandler;
  beforeEach(function () {
    inMemoryNoteRepository = new InMemoryNoteRepository();
    simpleNoteFactory = new SimpleNoteFactory();
    createNoteHandler = new CreateNoteHandler(
      simpleNoteFactory,
      inMemoryNoteRepository
    );
  });
  it("should create new note", async function () {
    const command = createCreateNote({
      title: "test",
      content: "test"
    });
    const result = await createNoteHandler.handle(command);
    expect(result.isLeft()).toBeFalsy();
    expect(result.isRight()).toBeTruthy();
  });
});

describe("UpdateNoteHandler", function () {
  let inMemoryNoteRepository: InMemoryNoteRepository;
  let updateNoteHandler: UpdateNoteHandler;
  beforeEach(function () {
    inMemoryNoteRepository = new InMemoryNoteRepository();
    updateNoteHandler = new UpdateNoteHandler(inMemoryNoteRepository);
  });
  it("should update an existing note", async function () {
    inMemoryNoteRepository.map.set("0", {
      id: "0",
      title: "test",
      content: "test"
    });
    const command = createUpdateNote({
      id: "0",
      title: "test bis",
      content: "test bis"
    });
    const result = await updateNoteHandler.handle(command);
    expect(result.isLeft()).toBeFalsy();
    expect(result.isRight()).toBeTruthy();
    const persistedNote = inMemoryNoteRepository.map.get(command.body.id);
    expect(persistedNote).toHaveProperty("id", "0");
    expect(persistedNote).toHaveProperty("title", "test bis");
    expect(persistedNote).toHaveProperty("content", "test bis");
  });
});

describe("DeleteNoteHandler", function () {
  let inMemoryNoteRepository: InMemoryNoteRepository;
  let deleteNoteHandler: DeleteNoteHandler;
  beforeEach(function () {
    inMemoryNoteRepository = new InMemoryNoteRepository();
    deleteNoteHandler = new DeleteNoteHandler(inMemoryNoteRepository);
  });
  it("should delete an existing note", async function () {
    inMemoryNoteRepository.map.set("0", {
      id: "0",
      title: "test",
      content: "test"
    });
    const command = createUpdateNote({
      id: "0",
      title: "test",
      content: "test"
    });
    const result = await deleteNoteHandler.handle(command);
    expect(result.isLeft()).toBeFalsy();
    expect(result.isRight()).toBeTruthy();
    expect(inMemoryNoteRepository.map.has("0")).toBeFalsy();
  });
});
