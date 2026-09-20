const AppError = require("../errors/AppError");

function notFoundHandler(req, res, next) {
  next(
    new AppError(
      `Route not found: ${req.method} ${req.originalUrl}`,
      404,
      "NotFound",
    ),
  );
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const code = err.code || "InternalError";

  console.error(
    JSON.stringify({
      level: "error",
      message: err.message,
      code,
      statusCode,
      method: req.method,
      path: req.originalUrl,
      stack: err.isOperational ? undefined : err.stack,
      timestamp: new Date().toISOString(),
    }),
  );

  const body = {
    error: {
      message: err.message || "Something went wrong",
      code,
    },
  };

  if (err.details) body.error.details = err.details;

  res.status(statusCode).json(body);
}

module.exports = { notFoundHandler, errorHandler };
