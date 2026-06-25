import { query } from "../config/db.js";

export const createUser = async ({ name, email, password }) => {
  const result = await query(
    `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, created_at`,
    [name, email, password]
  );
  return result.rows[0];
};

// Includes password hash — for login verification only.
export const findUserByEmail = async (email) => {
  const result = await query(`SELECT * FROM users WHERE email = $1`, [email]);
  return result.rows[0] || null;
};

export const findUserById = async (id) => {
  const result = await query(
    `SELECT id, name, email, created_at FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
};
