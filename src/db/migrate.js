import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { query } from "../config/db.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Runs schema.sql — safe to call repeatedly (uses CREATE TABLE IF NOT EXISTS).
export const runMigrations = async () => {
  const sql = await readFile(join(__dirname, "schema.sql"), "utf-8");
  await query(sql);
  console.log("✅ Migrations applied (users table ready)");
};
