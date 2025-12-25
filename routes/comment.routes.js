const express = require('express');
const router = express.Router();

const auth = require('../middleware/asishub.middleware');
const db = require('../config/db');

const {
  createComment,
  updateComment,
  deleteComment
} = require('../controllers/comment.controller');

// CREATE COMMENT
router.post('/', auth, createComment);

// UPDATE COMMENT
router.put('/:id', auth, updateComment);

// DELETE COMMENT
router.delete('/:id', auth, deleteComment);

// GET COMMENTS BY POST
router.get('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;

    const [rows] = await db.query(`
      SELECT 
        c.id,
        c.comment,
        c.created_at,
        u.username
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC
    `, [postId]);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil komentar' });
  }
});

module.exports = router;
