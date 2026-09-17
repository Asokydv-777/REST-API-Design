const request = require("supertest");
const createApp = require("../src/app");
const store = require("../src/data/notes.store");

const app = createApp();

beforeEach(() => store.reset());

test("create returns 201 with new note", async () => {
  const res = await request(app)
    .post("/notes")
    .send({ title: "New note", content: "Some content" });
  expect(res.status).toBe(201);
  expect(res.body.data).toMatchObject({
    title: "New note",
    content: "Some content",
    archived: false,
  });
  expect(res.body.data.id).toBeDefined();
});

test("update returns 200 with updated fields", async () => {
  const res = await request(app)
    .put("/notes/1")
    .send({ title: "Updated title" });
  expect(res.status).toBe(200);
  expect(res.body.data.title).toBe("Updated title");
});

test("get one returns 200 with note", async () => {
  const res = await request(app).get("/notes/1");
  expect(res.status).toBe(200);
  expect(res.body.data.id).toBe(1);
});
