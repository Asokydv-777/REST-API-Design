const AppError = require("../errors/AppError");
const service = require("../services/notes.service");
const {
  parsePagination,
  validateCreate,
  validateUpdate,
} = require("../validators/notes.validator");

function parseId(raw) {
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1) {
    throw new AppError("Invalid note id", 400, "InvalidId", [
      { field: "id", message: "id must be a positive integer" },
    ]);
  }
  return id;
}

function list(req, res) {
  const { page, limit, archived, search } = parsePagination(req.query);
  const result = service.listNotes({ page, limit, archived, search });
  res.json(result);
}

function getOne(req, res) {
  const id = parseId(req.params.id);
  const note = service.getNote(id);
  if (!note) throw new AppError("Note not found", 404, "NoteNotFound");
  res.json({ data: note });
}

function create(req, res) {
  const data = validateCreate(req.body);
  const note = service.createNote(data);
  res.status(201).json({ data: note });
}

function update(req, res) {
  const id = parseId(req.params.id);
  const data = validateUpdate(req.body);
  const note = service.updateNote(id, data);
  if (!note) throw new AppError("Note not found", 404, "NoteNotFound");
  res.json({ data: note });
}

function remove(req, res) {
  const id = parseId(req.params.id);
  const removed = service.deleteNote(id);
  if (!removed) throw new AppError("Note not found", 404, "NoteNotFound");
  res.status(204).send();
}

module.exports = { list, getOne, create, update, remove };
