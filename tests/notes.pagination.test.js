const request = require("supertest");
const createApp = require("../src/app");
const store = require("../src/data/notes.store");

const app = createApp();

beforeEach(() => store.reset());

test("first page returns default limit=10", async () => {
  const res = await request(app).get("/notes");
  expect(res.status).toBe(200);
  expect(res.body.data).toHaveLength(10);
  expect(res.body.pagination).toEqual({
    page: 1,
    limit: 10,
    total: 12,
    totalPages: 2,
  });
});

test("last page returns remaining items", async () => {
  const res = await request(app).get("/notes?page=2&limit=10");
  expect(res.status).toBe(200);
  expect(res.body.data).toHaveLength(2);
  expect(res.body.pagination.totalPages).toBe(2);
});

test("page beyond available data returns empty data array, not error", async () => {
  const res = await request(app).get("/notes?page=99&limit=10");
  expect(res.status).toBe(200);
  expect(res.body.data).toEqual([]);
  expect(res.body.pagination.page).toBe(99);
  expect(res.body.pagination.total).toBe(12);
});

test("custom limit changes page size", async () => {
  const res = await request(app).get("/notes?page=1&limit=3");
  expect(res.status).toBe(200);
  expect(res.body.data).toHaveLength(3);
  expect(res.body.pagination.totalPages).toBe(4);
});

test("limit=1 boundary works", async () => {
  const res = await request(app).get("/notes?page=1&limit=1");
  expect(res.status).toBe(200);
  expect(res.body.data).toHaveLength(1);
  expect(res.body.pagination.totalPages).toBe(12);
});

test("invalid page (negative) returns 400", async () => {
  const res = await request(app).get("/notes?page=-1");
  expect(res.status).toBe(400);
  expect(res.body.error.code).toBe("ValidationError");
});

test("invalid limit (non-numeric) returns 400", async () => {
  const res = await request(app).get("/notes?limit=abc");
  expect(res.status).toBe(400);
  expect(res.body.error.code).toBe("ValidationError");
});

test("invalid limit (too high) returns 400", async () => {
  const res = await request(app).get("/notes?limit=1000");
  expect(res.status).toBe(400);
  expect(res.body.error.code).toBe("ValidationError");
});
