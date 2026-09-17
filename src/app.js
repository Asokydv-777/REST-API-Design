const express = require("express");
const requestLogger = require("./middleware/logger");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");
const notesRoutes = require("./routes/notes.routes");

function createApp() {
  const app = express();

  app.use(express.json());
  app.use(requestLogger);

  app.get("/health", (req, res) => res.json({ status: "ok" }));

  app.use("/notes", notesRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
