import { query } from "../config/db.js";

// expiresAt is a JS Date
export const saveRefreshToken = async (userId, token, expiresAt) => {
  await query(
    `INSERT INTO refresh_tokens (user_id, token, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, token, expiresAt]
  );
};

export const findRefreshToken = async (token) => {
  const result = await query(
    `SELECT * FROM refresh_tokens WHERE token = $1`,
    [token]
  );
  return result.rows[0] || null;
};

export const deleteRefreshToken = async (token) => {
  await query(`DELETE FROM refresh_tokens WHERE token = $1`, [token]);
};

// Revoke every session for a user (e.g. "logout everywhere")
export const deleteUserRefreshTokens = async (userId) => {
  await query(`DELETE FROM refresh_tokens WHERE user_id = $1`, [userId]);
};
