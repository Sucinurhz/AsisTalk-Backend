const db = require('../config/db');

// =======================
// CREATE POST
// =======================
exports.createPost = async (req, res) => {
  try {
    console.log('USER:', req.user);
    console.log('BODY:', req.body);
    console.log('FILE:', req.file);

    const content = req.body?.content || null;
    const userId = req.user.id;

    let mediaPath = null;
    let mediaType = null;

    if (req.file) {
      mediaPath = `/uploads/posts/${req.file.filename}`;

      if (req.file.mimetype.startsWith('image')) {
        mediaType = 'image';
      } else if (req.file.mimetype.startsWith('video')) {
        mediaType = 'video';
      }
    }

    if (!content && !mediaPath) {
      return res.status(400).json({
        success: false,
        message: 'Post tidak boleh kosong'
      });
    }

    // 1. Lakukan Insert data
    const [result] = await db.query(
      `INSERT INTO posts (user_id, content, media, media_type)
       VALUES (?, ?, ?, ?)`,
      [userId, content, mediaPath, mediaType]
    );

    // 2. AMBIL DATA LENGKAP POSTINGAN YANG BARU SAJA DIBUAT
    // Kita butuh JOIN dengan tabel users agar mendapatkan 'username' dan 'profile_image'
    // yang dibutuhkan oleh data class Post di Android.
    const [rows] = await db.query(`
      SELECT 
        p.id, 
        p.content, 
        p.media, 
        p.media_type, 
        p.created_at,
        u.id AS user_id, 
        u.username, 
        u.profile_image
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `, [result.insertId]);

    // 3. Kirim respon dengan objek post lengkap
    res.status(201).json({
      success: true,
      message: 'Post berhasil dibuat',
      post: rows[0] // Ini sangat penting agar Android tidak crash
    });

  } catch (error) {
    console.error("ERROR CREATE POST:", error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// =======================
// UPDATE POST
// =======================
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Gunakan optional chaining (?.) atau default object {} untuk mencegah crash
    const content = req.body?.content || null; 

    const [post] = await db.query(
      'SELECT * FROM posts WHERE id=? AND user_id=?',
      [id, userId]
    );

    if (post.length === 0) {
      return res.status(403).json({ message: 'Akses ditolak atau post tidak ditemukan' });
    }

    // Jika ada file baru yang diupload saat edit
    let mediaPath = post[0].media;
    let mediaType = post[0].media_type;

    if (req.file) {
      mediaPath = `/uploads/posts/${req.file.filename}`;
      mediaType = req.file.mimetype.startsWith('image') ? 'image' : 'video';
    }

    // Update data ke database
    await db.query(
      'UPDATE posts SET content=?, media=?, media_type=?, updated_at=NOW() WHERE id=?',
      [content, mediaPath, mediaType, id]
    );

    // Ambil post terbaru untuk dikirim kembali ke Android
    const [rows] = await db.query(`
      SELECT 
        p.id, p.content, p.media, p.media_type, p.created_at, p.updated_at,
        u.id AS user_id, u.username, u.profile_image
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `, [id]);

    res.json({
      success: true,
      post: rows[0]
    });

  } catch (err) {
    console.error("ERROR UPDATE POST:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

// =======================
// DELETE POST
// =======================
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await db.query(
      'DELETE FROM posts WHERE id=? AND user_id=?',
      [id, userId]
    );

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// =======================
// GET POSTS
// =======================
exports.getPosts = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id, p.content, p.media, p.media_type, p.created_at, 
        u.id AS user_id, u.username, u.profile_image
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `); // Hapus koma setelah p.created_at agar tidak error syntax
    res.json(rows);
  } catch (err) {
    console.error("EROR GET POSTS:", err);
    res.status(500).json({ message: 'Gagal mengambil postingan' });
  }
};