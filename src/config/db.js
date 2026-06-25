import pg from "pg";
import { config } from "./env.js";

const { Pool } = pg;

// Render's managed Postgres requires SSL. Locally we usually don't.
const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: config.databaseUrl?.includes("render.com")
    ? { rejectUnauthorized: false }
    : false,
});

pool.on("error", (err) => {
  console.error("Unexpected Postgres pool error", err);
});

// Verify connectivity at startup
export const connectDB = async () => {
  const client = await pool.connect();
  try {
    await client.query("SELECT 1");
    console.log("✅ Postgres connected");
  } finally {
    client.release();
  }
};

// Query helper: query(text, params)
export const query = (text, params) => pool.query(text, params);

export default pool;
