const db = require("../config/db");

exports.findByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
  return rows;
};

exports.create = async (user) => {
  await db.query(
    `INSERT INTO users 
     (full_name, email, phone_number, password, role, status) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      user.full_name,
      user.email,
      user.phone_number,
      user.password,
      user.role,
      user.status,
    ]
  );
};

exports.findById = async (id) => {
  const [rows] = await db.query(
    `SELECT id, full_name, email, phone_number, profile_image_url
     FROM users WHERE id = ?`,
    [id]
  );
  return rows[0];
};

exports.updateProfile = async (id, data) => {
  await db.query(
    `UPDATE users SET 
      full_name = ?, 
      phone_number = ?, 
      profile_image_url = ?
     WHERE id = ?`,
    [data.full_name, data.phone_number, data.profile_image_url, id]
  );
};
