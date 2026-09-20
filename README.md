# Phase 5 — Task 7: Full-Featured Notes API

**Authors:** Lukash Napit & Ashok Yadav

A paginated, filterable, validated Notes REST API with centralized error
handling, structured logging, and a complete test suite.

## Endpoints

| Method | Path          | Description                          |
|--------|---------------|--------------------------------------|
| GET    | /health       | Health check                         |
| GET    | /notes        | List notes (paginated + filtered)    |
| GET    | /notes/:id    | Get one note                         |
| POST   | /notes        | Create a note                        |
| PUT    | /notes/:id    | Update a note                        |
| DELETE | /notes/:id    | Delete a note                        |
| GET    | /debug/boom   | Deliberate 500 (dev only)            |

### Query parameters — `GET /notes`

| Param      | Type    | Default | Rules                       |
|------------|---------|---------|-----------------------------|
| `page`     | integer | 1       | must be ≥ 1                 |
| `limit`    | integer | 10      | must be 1–100               |
| `archived` | boolean | —       | `"true"` or `"false"`       |
| `search`   | string  | —       | case-insensitive, non-empty |

### Success response shape

```json
{
  "data": [ { "id": 1, "title": "...", "content": "...", "archived": false, "createdAt": "..." } ],
  "pagination": { "page": 1, "limit": 10, "total": 12, "totalPages": 2 }
}
```

### Error envelope (all failure modes)

```json
{
  "error": {
    "message": "…",
    "code": "…",
    "details": [ { "field": "title", "message": "…" } ]
  }
}
```

`details` is present only for validation-style errors.

## Getting started

```bash
npm install
npm start          # http://localhost:3000
npm test           # runs the test suite
```

## Tests

| File                          | Coverage                                  |
|-------------------------------|-------------------------------------------|
| notes.crud.test.js            | Happy path create/read/update             |
| notes.pagination.test.js      | First/last/beyond page, invalid params    |
| notes.filtering.test.js       | Single filter, combined, filter+page      |
| notes.errors.test.js          | 400/404/500 cases + consistent envelope   |

## Postman collection

Import `postman/phase5-notes-api.postman_collection.json` into Postman or
Insomnia. Set the `baseUrl` variable if needed (default `http://localhost:3000`).

## Manual verification

```bash
# Pagination boundaries
curl 'http://localhost:3000/notes?page=1&limit=10'
curl 'http://localhost:3000/notes?page=2&limit=10'
curl 'http://localhost:3000/notes?page=99&limit=10'

# Filtering + pagination
curl 'http://localhost:3000/notes?archived=true&page=1&limit=2'

# Error cases
curl -i 'http://localhost:3000/notes?page=-1'
curl -i 'http://localhost:3000/notes?limit=abc'
curl -i 'http://localhost:3000/notes/9999'
curl -i -X POST 'http://localhost:3000/notes' -H 'Content-Type: application/json' -d '{}'
curl -i 'http://localhost:3000/debug/boom'
```