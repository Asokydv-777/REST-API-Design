const store = require("../data/notes.store");

function listNotes({ page, limit, archived, search }) {
  let results = store.getAll();

  // Filter 1: archived (boolean flag)
  if (archived !== undefined) {
    results = results.filter((n) => n.archived === archived);
  }

  // Filter 2: search (text match on title OR content, case-insensitive)
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q),
    );
  }

  // Pagination reflects the FILTERED result set
  const total = results.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const data = results.slice(start, start + limit);

  return { data, meta: { page, limit, total, totalPages } };
}

module.exports = {
  listNotes,
  getNote: (id) => store.getById(id),
  createNote: (data) => store.create(data),
  updateNote: (id, data) => store.update(id, data),
  deleteNote: (id) => store.remove(id),
};
