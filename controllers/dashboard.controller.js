const db = require('../config/db');

exports.getDashboard = async (req, res) => {
  const [[user]] = await db.query(
    'SELECT full_name, profile_image FROM users WHERE id=?',
    [req.user.id]
  );

  const [posts] = await db.query(
    'SELECT content FROM posts ORDER BY created_at DESC LIMIT 3'
  );

  res.json({ user, posts });
};
