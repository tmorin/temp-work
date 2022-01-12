import { InMemoryNoteRepository, SimpleNoteFactory } from "./infra";
describe("SimpleNoteFactory", function () {
  let simpleNoteFactory: SimpleNoteFactory;
  beforeEach(function () {
    simpleNoteFactory = new SimpleNoteFactory();
  });
  describe("#createFromScratch", function () {
    it("should create note", async function () {
      const result = await simpleNoteFactory.createFromScratch({
        title: "title test",
        content: "content test"
      });
      expect(result.isLeft()).toBeFalsy();
      expect(result.isRight()).toBeTruthy();
      const note = result.extract();
      expect(note).toHaveProperty("id");
      expect(note).toHaveProperty("title", "title test");
      expect(note).toHaveProperty("content", "content test");
    });
  });
});

describe("InMemoryNoteRepository", function () {
  let inMemoryNoteRepository: InMemoryNoteRepository;
  beforeEach(function () {
    inMemoryNoteRepository = new InMemoryNoteRepository();
  });
  describe("#get", function () {
    it("should get an existing note", async function () {
      inMemoryNoteRepository.map.set("0", {
        id: "0",
        title: "title test",
        content: "content test"
      });
      const result = await inMemoryNoteRepository.get("0");
      expect(result.isLeft()).toBeFalsy();
      expect(result.isRight()).toBeTruthy();
      const note = result.extract();
      expect(note).toHaveProperty("id");
      expect(note).toHaveProperty("title", "title test");
      expect(note).toHaveProperty("content", "content test");
    });
    it("should failed when not found", async function () {
      const result = await inMemoryNoteRepository.get("0");
      expect(result.isLeft()).toBeTruthy();
      expect(result.isRight()).toBeFalsy();
      const error = result.swap().extract();
      expect(error).toHaveProperty("message", "unable to find the note 0");
    });
  });
  describe("#persist", function () {
    it("should persit new note", async function () {
      const result = await inMemoryNoteRepository.persist({
        id: "0",
        title: "title test",
        content: "content test"
      });
      expect(inMemoryNoteRepository.map.has("0")).toBeTruthy();
      expect(result.isLeft()).toBeFalsy();
      expect(result.isRight()).toBeTruthy();
      const note = result.extract();
      expect(note).toHaveProperty("id");
      expect(note).toHaveProperty("title", "title test");
      expect(note).toHaveProperty("content", "content test");
    });
    it("should persit existing note", async function () {
      inMemoryNoteRepository.map.set("0", {
        id: "0",
        title: "title test",
        content: "content test"
      });
      const result = await inMemoryNoteRepository.persist({
        id: "0",
        title: "title test bis",
        content: "content test bis"
      });
      expect(inMemoryNoteRepository.map.has("0")).toBeTruthy();
      expect(result.isLeft()).toBeFalsy();
      expect(result.isRight()).toBeTruthy();
      const note = result.extract();
      expect(note).toHaveProperty("id");
      expect(note).toHaveProperty("title", "title test bis");
      expect(note).toHaveProperty("content", "content test bis");
      const persistedNote = inMemoryNoteRepository.map.get("0");
      expect(persistedNote).toHaveProperty("id");
      expect(persistedNote).toHaveProperty("title", "title test bis");
      expect(persistedNote).toHaveProperty("content", "content test bis");
    });
  });
  describe("#delete", function () {
    it("should delete an existing note", async function () {
      inMemoryNoteRepository.map.set("0", {
        id: "0",
        title: "title test",
        content: "content test"
      });
      const result = await inMemoryNoteRepository.delete("0");
      expect(inMemoryNoteRepository.map.has("0")).toBeFalsy();
      expect(result.isLeft()).toBeFalsy();
      expect(result.isRight()).toBeTruthy();
      const id = result.extract();
      expect(id).toHaveProperty("0");
    });
  });
});
