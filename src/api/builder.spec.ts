import { MessageBuilder } from "./builder";

describe("MessageBuilder", function () {
  describe("message", function () {
    it("should create a message", function () {
      const command = MessageBuilder.get("command").build();
      expect(command).toHaveProperty("kind", "command");
      expect(command).toHaveProperty("headers");
      expect(command.headers).toHaveProperty("messageType", "command");
      expect(command.headers).toHaveProperty("messageId");
      expect(command).toHaveProperty("body", undefined);
    });
    it("should set a type", function () {
      const command = MessageBuilder.get("command").type("test").build();
      expect(command.headers).toHaveProperty("messageType", "test");
    });
    it("should set an identifier", function () {
      const command = MessageBuilder.get("command").identifier("test").build();
      expect(command.headers).toHaveProperty("messageId", "test");
    });
    it("should set a header entry", function () {
      const command = MessageBuilder.get("command")
        .headers({
          key: "test"
        })
        .build();
      expect(command.headers).toHaveProperty("key", "test");
    });
    it("should set a body", function () {
      const command = MessageBuilder.get("command").body("test").build();
      expect(command).toHaveProperty("body", "test");
    });
  });
  describe("command", function () {
    it("should create a command", function () {
      const message = MessageBuilder.command("command").build();
      expect(message).toHaveProperty("kind", "command");
    });
  });
  describe("event", function () {
    it("should create a event", function () {
      const message = MessageBuilder.event("eventA").build();
      expect(message).toHaveProperty("kind", "event");
    });
  });
  describe("result", function () {
    it("should create a result", function () {
      const query = MessageBuilder.query("eventA").build();
      const message = MessageBuilder.result(query).build();
      expect(message).toHaveProperty("kind", "result");
    });
  });
  describe("query", function () {
    it("should create a query", function () {
      const message = MessageBuilder.query("queryA").build();
      expect(message).toHaveProperty("kind", "query");
    });
  });
});
