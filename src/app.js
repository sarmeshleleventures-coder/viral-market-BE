import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import { config } from "./config/env.js";
import { query } from "./config/db.js";
import { swaggerSpec } from "./config/swagger.js";
import routes from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/error.js";

const app = express();

// Security & core middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (config.nodeEnv !== "test") {
  app.use(morgan(config.nodeEnv === "production" ? "combined" : "dev"));
}

// Root
app.get("/", (req, res) => {
  res.json({ service: "viral-market-be", status: "running" });
});

// Health check (includes live database ping)
app.get("/health", async (req, res) => {
  let db = "not_configured";
  if (config.databaseUrl) {
    try {
      const result = await query("SELECT NOW() AS now");
      db = "connected";
      return res.json({
        status: "ok",
        db,
        dbTime: result.rows[0].now,
        uptime: process.uptime(),
      });
    } catch (err) {
      db = "error";
      return res.status(503).json({ status: "degraded", db, error: err.message });
    }
  }
  res.json({ status: "ok", db, uptime: process.uptime() });
});

// Swagger API docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API routes
app.use("/api", routes);

// 404 + error handling (must be last)
app.use(notFound);
app.use(errorHandler);

export default app;
