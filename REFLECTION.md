# Reflection — A5 REST API Design


## A pagination/filtering decision I'm proud of

When we built the list endpoint, the tempting shortcut was to paginate the
full store first and then filter the page's contents — which "works" visually
but produces wrong metadata (total reflects the whole dataset) and drops items
whenever a filter is applied. Instead, we structured `notes.service.js` so
filtering runs **before** slicing: `results` starts as the full store, is
narrowed by `archived` and `search`, and only then are `total`, `totalPages`,
and the `slice(start, start + limit)` computed. This makes filtering and
pagination compose cleanly — `total` always describes what the client is
actually paginating through, and the empty-page case (`page=99`) still returns
`{ data: [], meta: { … } }` instead of a 404 or a crash. We wrote a specific
test (`pagination metadata reflects FILTERED set, not full set`) because this
is the single most common bug called out in the assignment brief, and it's the
kind of mistake that's invisible on the happy path.

## Where centralized error handling prevented an inconsistency

Early on, every route returned its own error shape. `GET /notes/:id` sent
plain text `"Invalid id"` on bad input and `"Not found"` on a missing note,
`DELETE /notes/:id` always returned `{ ok: true }` even when nothing was
deleted, and unknown routes fell through to Express's default HTML page. During
the refactor we moved all failure paths through one `errorHandler` middleware,
and validation errors carry a `details` array, not-found errors carry a
`NoteNotFound` code, and unexpected errors never leak a stack trace. The
specific moment that showed the value was adding the `DELETE` route's 404: the
old behavior silently reported success, and any client relying on the response
would have believed the delete worked. With the centralized handler, the route
just throws `new AppError('Note not found', 404, 'NoteNotFound')` and gets back
exactly the same envelope every other endpoint uses — same shape, same client
parsing, no drift. That's the part of the refactor we'd most defend in review:
not the number of routes converted, but that every failure mode is forced
through one place.