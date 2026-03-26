const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const routes = require("./routes");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");
const { clientUrl } = require("./config/env");

const app = express();

const allowedOrigins = [
  clientUrl,
  "http://localhost:3000",
  "http://localhost:3002",
  "http://localhost:3001",
];

app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server or same-origin requests without Origin header.
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS: Origin not allowed"));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
