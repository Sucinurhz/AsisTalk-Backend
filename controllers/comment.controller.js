const db = require('../config/db');

// =======================
// CREATE COMMENT
// =======================
exports.createComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { post_id, comment } = req.body;

    const [result] = await db.query(
      'INSERT INTO comments (post_id, user_id, comment) VALUES (?,?,?)',
      [post_id, userId, comment]
    );

    // Ambil comment + username
    const [rows] = await db.query(`
      SELECT 
        c.id,
        c.comment,
        c.created_at,
        u.username
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `, [result.insertId]);

    res.status(201).json({
      success: true,
      comment: rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// =======================
// UPDATE COMMENT
// =======================
exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { comment } = req.body;

    await db.query(
      'UPDATE comments SET comment=?, updated_at=NOW() WHERE id=? AND user_id=?',
      [comment, id, userId]
    );

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// =======================
// DELETE COMMENT
// =======================
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await db.query(
      'DELETE FROM comments WHERE id=? AND user_id=?',
      [id, userId]
    );

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// =======================
// GET COMMENTS BY POST
// =======================
exports.getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const [rows] = await db.query(`
      SELECT 
        c.id,
        c.comment,
        c.created_at,
        u.username,
        u.profile_image
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC
    `, [postId]);

    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil komentar' });
  }
};