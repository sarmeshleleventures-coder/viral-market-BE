import { query } from "../config/db.js";

// List with optional search + pagination
export const listProducts = async ({ search, limit = 20, offset = 0 }) => {
  const params = [];
  let where = "";
  if (search) {
    params.push(`%${search}%`);
    where = `WHERE name ILIKE $${params.length}`;
  }
  params.push(limit, offset);
  const result = await query(
    `SELECT * FROM products ${where}
     ORDER BY created_at DESC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );
  return result.rows;
};

export const getProductById = async (id) => {
  const result = await query(`SELECT * FROM products WHERE id = $1`, [id]);
  return result.rows[0] || null;
};

export const createProduct = async ({ name, description, price, stock, image_url }) => {
  const result = await query(
    `INSERT INTO products (name, description, price, stock, image_url)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [name, description ?? null, price, stock ?? 0, image_url ?? null]
  );
  return result.rows[0];
};

// Partial update — only provided fields change (COALESCE keeps the old value).
export const updateProduct = async (id, fields) => {
  const result = await query(
    `UPDATE products SET
       name = COALESCE($2, name),
       description = COALESCE($3, description),
       price = COALESCE($4, price),
       stock = COALESCE($5, stock),
       image_url = COALESCE($6, image_url),
       updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [
      id,
      fields.name ?? null,
      fields.description ?? null,
      fields.price ?? null,
      fields.stock ?? null,
      fields.image_url ?? null,
    ]
  );
  return result.rows[0] || null;
};

export const deleteProduct = async (id) => {
  const result = await query(`DELETE FROM products WHERE id = $1 RETURNING id`, [id]);
  return result.rows[0] || null;
};
