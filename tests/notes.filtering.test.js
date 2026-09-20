const request = require("supertest");
const createApp = require("../src/app");
const store = require("../src/data/notes.store");

const app = createApp();

beforeEach(() => store.reset());

test("filter archived=true returns only archived", async () => {
  const res = await request(app).get("/notes?archived=true");
  expect(res.status).toBe(200);
  expect(res.body.data.every((n) => n.archived === true)).toBe(true);
  expect(res.body.pagination.total).toBe(3);
});

test("filter archived=false returns only non-archived", async () => {
  const res = await request(app).get("/notes?archived=false");
  expect(res.body.pagination.total).toBe(9);
});

test("search matches title or content, case-insensitive", async () => {
  const res = await request(app).get("/notes?search=project");
  expect(res.status).toBe(200);
  expect(res.body.data.length).toBeGreaterThan(0);
  res.body.data.forEach((n) => {
    const hay = (n.title + " " + n.content).toLowerCase();
    expect(hay).toContain("project");
  });
});

test("search returns empty array when no match", async () => {
  const res = await request(app).get("/notes?search=zzzznomatch");
  expect(res.status).toBe(200);
  expect(res.body.data).toEqual([]);
  expect(res.body.pagination.total).toBe(0);
});

test("search + archived combined", async () => {
  const res = await request(app).get("/notes?archived=true&search=trip");
  expect(res.body.data.every((n) => n.archived === true)).toBe(true);
  expect(res.body.pagination.total).toBe(1);
});

test("pagination metadata reflects FILTERED set, not full set", async () => {
  const res = await request(app).get("/notes?archived=true&limit=2");
  expect(res.body.pagination.total).toBe(3);
  expect(res.body.pagination.totalPages).toBe(2);
  expect(res.body.data).toHaveLength(2);
});

test("filtering + pagination second page", async () => {
  const res = await request(app).get("/notes?archived=true&page=2&limit=2");
  expect(res.body.data).toHaveLength(1);
  expect(res.body.pagination.page).toBe(2);
});
