import app from "./app.js";
import { config } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { runMigrations } from "./db/migrate.js";

const start = async () => {
  try {
    if (config.databaseUrl) {
      await connectDB();
      await runMigrations();
    } else {
      console.warn("⚠️  DATABASE_URL not set — starting without DB.");
    }

    // Bind to 0.0.0.0 so Render (and any host) can reach the server,
    // not just the IPv6 loopback.
    const server = app.listen(config.port, "0.0.0.0", () => {
      console.log(`🚀 Server running in ${config.nodeEnv} mode on port ${config.port}`);
    });

    // Graceful shutdown
    const shutdown = (signal) => {
      console.log(`\n${signal} received. Closing server...`);
      server.close(() => {
        console.log("Server closed.");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

start();
