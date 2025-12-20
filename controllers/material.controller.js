const db = require("../config/db");

exports.uploadMaterial = async (req, res) => {
  try {
    const { subject, topic, description } = req.body;
    const file = req.file;

    if (!subject || !topic || !file) {
      return res.status(400).json({
        success: false,
        message: "Subject, topic, dan file wajib diisi"
      });
    }

    await db.query(
      `INSERT INTO asis_materials
      (user_id, subject, topic, description, file_type, file_name, file_path)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        subject,
        topic,
        description || null,
        file.mimetype,
        file.originalname,
        file.path
      ]
    );

    res.status(201).json({
      success: true,
      message: "Materi berhasil diupload"
    });

  } catch (error) {
    console.error("UPLOAD MATERIAL ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Gagal upload materi"
    });
  }
};
