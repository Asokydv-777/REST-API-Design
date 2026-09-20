# Reflection — Task 7 Full-Featured Notes API

## A pagination/filtering decision I'm proud of

When we designed the list endpoint, the tempting shortcut was to paginate the
full dataset first and then filter each page's contents. That "works" on the
happy path, but produces wrong metadata — `total` describes the whole store
instead of what the client is actually paginating through, and some items
vanish between pages whenever a filter is applied. Instead, we structured
`notes.service.js` so filtering runs **before** slicing: `results` starts as
the full store, is narrowed by `archived` and `search`, and only then are
`total`, `totalPages`, and the `slice(start, start + limit)` computed. This
makes filtering and pagination compose cleanly — `total` always describes the
filtered set, and a page beyond the data returns `{ data: [], pagination: { … } }`
instead of an error. We wrote a dedicated test (`pagination metadata reflects
FILTERED set, not full set`) because this is the single most common bug called
out in the assignment, and it's invisible unless you deliberately test it.

## Where centralized error handling prevented an inconsistency

Before the refactor, every route returned its own error shape. `GET /notes/:id`
sent plain text `"Invalid id"` on bad input and `"Not found"` on a missing note.
`DELETE /notes/:id` always returned `{ ok: true }` even when nothing was
deleted. Unknown routes fell through to Express's default HTML page. Moving all
failure paths through one `errorHandler` middleware forced every error — 400,
404, and 500 — through the same envelope: `{ error: { message, code, details? } }`.
The specific case that showed the value was the deliberate 500 handler: without
a centralized handler, a thrown exception would leak a raw stack trace with
internal file paths to the client. With the centralized handler, operational
errors (validation, not-found) return `details` where relevant, and non-operational
errors log their stack **server-side** but never send it back. Every client
now parses errors the same way regardless of which endpoint failed.