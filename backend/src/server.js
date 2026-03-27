const app = require("./app");
const { port, nodeEnv, requireDbOnStart } = require("./config/env");
const db = require("./models");


const startServer = async () => {


  let dbConnected = false;

  try {
    await db.sequelize.authenticate();
    dbConnected = true;
    console.log("Database connection established successfully.");
  } catch (err) {
    console.error("Failed to connect to database.");
    console.error("Check DB_HOST, DB_PORT, DB_USER, DB_PASSWORD and MySQL service status.");
    console.error(err?.name || "DatabaseError", err?.message || "Unknown database error");

    const shouldExit = requireDbOnStart || nodeEnv === "production";
    if (shouldExit) {
      process.exit(1);
    }

    console.warn("Starting API without database (development mode fallback).");
  }

  app.listen(port, () => {
    const dbLabel = dbConnected ? "db:connected" : "db:offline";
    console.log(`Server is running on http://localhost:${port} (${dbLabel})`);
  });
};

startServer();
