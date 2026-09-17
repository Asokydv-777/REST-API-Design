function requestLogger(req, res, next) {
  const start = Date.now();
  res.on("finish", () => {
    console.log(
      JSON.stringify({
        level: "info",
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        durationMs: Date.now() - start,
        timestamp: new Date().toISOString(),
      }),
    );
  });
  next();
}

module.exports = requestLogger;
