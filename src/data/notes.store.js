let notes = [];
let nextId = 1;

function reset() {
  nextId = 1;
  notes = [
    {
      id: nextId++,
      title: "Grocery list",
      content: "Milk, eggs, bread",
      archived: false,
      createdAt: new Date("2025-01-01").toISOString(),
    },
    {
      id: nextId++,
      title: "Project ideas",
      content: "Build a REST API with pagination",
      archived: false,
      createdAt: new Date("2025-01-02").toISOString(),
    },
    {
      id: nextId++,
      title: "Old meeting notes",
      content: "Q4 kickoff summary",
      archived: true,
      createdAt: new Date("2025-01-03").toISOString(),
    },
    {
      id: nextId++,
      title: "Reading list",
      content: "Clean Code, The Pragmatic Programmer",
      archived: false,
      createdAt: new Date("2025-01-04").toISOString(),
    },
    {
      id: nextId++,
      title: "Recipes",
      content: "Pasta carbonara, chicken curry",
      archived: false,
      createdAt: new Date("2025-01-05").toISOString(),
    },
    {
      id: nextId++,
      title: "Trip plan",
      content: "Pokhara itinerary for March",
      archived: true,
      createdAt: new Date("2025-01-06").toISOString(),
    },
    {
      id: nextId++,
      title: "Workout log",
      content: "Mon: chest, Wed: back, Fri: legs",
      archived: false,
      createdAt: new Date("2025-01-07").toISOString(),
    },
    {
      id: nextId++,
      title: "Budget",
      content: "Monthly expenses tracking",
      archived: false,
      createdAt: new Date("2025-01-08").toISOString(),
    },
    {
      id: nextId++,
      title: "Book notes",
      content: "Key ideas from Atomic Habits",
      archived: false,
      createdAt: new Date("2025-01-09").toISOString(),
    },
    {
      id: nextId++,
      title: "Archived ideas",
      content: "Older brainstorming session",
      archived: true,
      createdAt: new Date("2025-01-10").toISOString(),
    },
    {
      id: nextId++,
      title: "Birthday plans",
      content: "Surprise party for Ashok",
      archived: false,
      createdAt: new Date("2025-01-11").toISOString(),
    },
    {
      id: nextId++,
      title: "Study schedule",
      content: "Backend chapters 1-5",
      archived: false,
      createdAt: new Date("2025-01-12").toISOString(),
    },
  ];
  nextId = notes.length + 1;
}

reset();

module.exports = {
  getAll: () => notes,
  getById: (id) => notes.find((n) => n.id === id),
  create: (data) => {
    const note = {
      id: nextId++,
      title: data.title,
      content: data.content,
      archived: data.archived ?? false,
      createdAt: new Date().toISOString(),
    };
    notes.push(note);
    return note;
  },
  update: (id, data) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return null;
    if (data.title !== undefined) note.title = data.title;
    if (data.content !== undefined) note.content = data.content;
    if (data.archived !== undefined) note.archived = data.archived;
    return note;
  },
  remove: (id) => {
    const index = notes.findIndex((n) => n.id === id);
    if (index === -1) return false;
    notes.splice(index, 1);
    return true;
  },
  reset,
};
