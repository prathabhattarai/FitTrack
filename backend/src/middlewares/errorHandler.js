const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Internal server error";

  // Body parser malformed JSON
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    statusCode = 400;
    message = "Invalid JSON request body.";
  }

  // Sequelize connectivity failures
  if (
    err?.name === "SequelizeConnectionRefusedError" ||
    err?.name === "SequelizeConnectionError" ||
    err?.name === "SequelizeHostNotFoundError"
  ) {
    statusCode = 503;
    message = "Database is not reachable. Please start MySQL and try again.";
  }

  // Wrong DB credentials
  if (err?.name === "SequelizeAccessDeniedError") {
    statusCode = 500;
    message = "Database credentials are invalid. Please verify DB_USER and DB_PASSWORD.";
  }

  // SQL/schema level issue
  if (err?.name === "SequelizeDatabaseError") {
    statusCode = 500;
    message = "Database query failed. Please verify migrations and schema.";
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

module.exports = errorHandler;
