# Phase 5 — A5 REST API Design

**Authors:** Lukash Napit & Ashok Yadav
**Repo:** phase5-rest-api-notes

A paginated, filterable, validated Notes REST API built with Express, with
centralized error handling, structured logging, and a complete test suite.

## Endpoints

| Method | Path            | Description                              |
|--------|-----------------|------------------------------------------|
| GET    | `/health`       | Health check                             |
| GET    | `/notes`        | List notes (paginated + filtered)        |
| GET    | `/notes/:id`    | Get one note                             |
| POST   | `/notes`        | Create a note                            |
| PUT    | `/notes/:id`    | Update a note                            |
| DELETE | `/notes/:id`    | Delete a note                            |

### Query parameters on `GET /notes`

| Param      | Type    | Default | Notes                                         |
|------------|---------|---------|-----------------------------------------------|
| `page`     | integer | 1       | Must be ≥ 1                                    |
| `limit`    | integer | 10      | Must be 1–100                                  |
| `archived` | boolean | —       | `"true"` or `"false"`                          |
| `search`   | string  | —       | Case-insensitive match on title or content    |

### Example success response

```json
{
  "data": [
    { "id": 1, "title": "Grocery list", "content": "Milk, eggs, bread", "archived": false, "createdAt": "..." }
  ],
  "meta": { "page": 1, "limit": 10, "total": 12, "totalPages": 2 }
}
```

### Error envelope (all failure modes)

```json
{
  "error": {
    "message": "…",
    "code": "…",
    "details": [ { "field": "title", "message": "…" } ]  // validation only
  }
}
```

## Getting started

```bash
npm install
npm start
# or
npm test
```

Server runs on `http://localhost:3000`.

## Tests

```
tests/notes.pagination.test.js   # first/last/beyond/limit edge cases + invalid params
tests/notes.filtering.test.js    # single filter, combined, filter+pagination
tests/notes.errors.test.js       # 400/404 cases + consistent envelope
tests/notes.crud.test.js         # happy path CRUD
```

All tests use `supertest` against the app instance, no live server needed.
Store is reset between tests via `store.reset()`.

## Postman collection

See `postman/phase5-notes-api.postman_collection.json`.
Import into Postman or Insomnia and set the `baseUrl` variable if needed.# REST-API-Design
# REST-API-Design
