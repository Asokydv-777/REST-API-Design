const request = require("supertest");
const createApp = require("../src/app");
const store = require("../src/data/notes.store");

const app = createApp();

beforeEach(() => store.reset());

test("404 for missing note returns consistent envelope", async () => {
  const res = await request(app).get("/notes/9999");
  expect(res.status).toBe(404);
  expect(res.body).toEqual({
    error: { message: "Note not found", code: "NoteNotFound" },
  });
});

test("400 validation on create with structured details", async () => {
  const res = await request(app).post("/notes").send({ title: "" });
  expect(res.status).toBe(400);
  expect(res.body.error.code).toBe("ValidationError");
  expect(Array.isArray(res.body.error.details)).toBe(true);
  expect(res.body.error.details.some((d) => d.field === "title")).toBe(true);
  expect(res.body.error.details.some((d) => d.field === "content")).toBe(true);
});

test("400 on invalid pagination params", async () => {
  const res = await request(app).get("/notes?page=0&limit=-5");
  expect(res.status).toBe(400);
  expect(res.body.error.code).toBe("ValidationError");
});

test("404 on unknown route", async () => {
  const res = await request(app).get("/does-not-exist");
  expect(res.status).toBe(404);
  expect(res.body.error.code).toBe("NotFound");
});

test("204 on successful delete, 404 on second delete", async () => {
  const first = await request(app).delete("/notes/1");
  expect(first.status).toBe(204);

  const second = await request(app).delete("/notes/1");
  expect(second.status).toBe(404);
  expect(second.body.error.code).toBe("NoteNotFound");
});
