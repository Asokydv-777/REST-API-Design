const express = require("express");
const requestLogger = require("./middleware/logger");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");
const notesRoutes = require("./routes/notes.routes");

function createApp() {
  const app = express();

  app.use(express.json());
  app.use(requestLogger);

  app.get("/health", (req, res) => res.json({ status: "ok" }));

  // Debug route — simulate an unexpected server error (500) to prove no stack leaks.
  // Guarded so it isn't mounted in production.
  if (process.env.NODE_ENV !== "production") {
    app.get("/debug/boom", (req, res, next) => {
      // Deliberately throws a plain Error (NOT an AppError) so the
      // error handler takes the non-operational branch.
      throw new Error("Simulated database failure at db.query(line 42)");
    });
  }

  app.use("/notes", notesRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
