const db = require("../config/db");
const fs = require("fs").promises;
const path = require("path");

const BASE_URL = "http://10.0.2.2:3000"; 

// --- 1. UPLOAD MATERIAL ---
exports.uploadMaterial = async (req, res) => {
  try {
    const { subject, topic, description } = req.body;
    const file = req.file;

    if (!subject || !topic || !file) {
      return res.status(400).json({ success: false, message: "Subject, topic, dan file wajib diisi" });
    }

    // Tentukan tipe file otomatis
    const ext = path.extname(file.originalname).toLowerCase();
    let fileType = "OTHER";
    if (ext === ".pdf") fileType = "PDF";
    else if ([".mp4", ".mov", ".avi", ".mkv"].includes(ext)) fileType = "VIDEO";
    else if ([".jpg", ".jpeg", ".png", ".gif"].includes(ext)) fileType = "IMAGE";
    else if ([".doc", ".docx"].includes(ext)) fileType = "DOC";

    const relativeFilePath = `uploads/materials/${file.filename}`;
    
    const [result] = await db.query(
    `INSERT INTO materials (user_id, subject, topic, description, file_type, file_name, file_path)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [req.user.id, subject, topic, description || null, fileType, file.originalname, relativeFilePath]
    );


    res.status(201).json({
      success: true,
      message: "Materi berhasil diupload",
      data: {
        id: result.insertId,
        subject,
        topic,
        file_type: fileType,
        file_name: file.originalname,
        file_path: `${BASE_URL}/${relativeFilePath}`
      }
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    res.status(500).json({ success: false, message: "Gagal upload materi" });
  }
};

// Get semua materi
exports.getAllMaterials = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT m.*, u.full_name AS author_name, u.profile_image
      FROM materials m
      JOIN users u ON m.user_id = u.id
      ORDER BY m.created_at DESC
    `);

    const formattedData = rows.map(row => {
      const fixPath = (p) => {
        if (!p) return null;
        if (p.startsWith("http")) return p;
        return `${BASE_URL}/${p.replace(/\\/g, "/")}`;
      };

      return {
        ...row,
        file_path: fixPath(row.file_path),
        profile_image: fixPath(row.profile_image)
      };
    });

    res.status(200).json({ success: true, data: formattedData });
  } catch (error) {
    console.error("GET ALL ERROR:", error);
    res.status(500).json({ success: false, message: "Gagal mengambil data" });
  }
};

// --- 3. GET MATERIAL BY ID ---
exports.getMaterialById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query(`
            SELECT m.*, u.full_name AS author_name 
            FROM materials m 
            JOIN users u ON m.user_id = u.id 
            WHERE m.id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Materi tidak ditemukan" });
        }

        const material = {
            ...rows[0],
            file_path: rows[0].file_path ? `${BASE_URL}/${rows[0].file_path}` : null
        };

        res.status(200).json({ success: true, data: material });
    } catch (error) {
        console.error("GET BY ID ERROR:", error);
        res.status(500).json({ success: false, message: "Gagal mengambil detail" });
    }
};

// --- 4. UPDATE MATERIAL ---
exports.updateMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const { subject, topic, description } = req.body;
        const file = req.file;

        const [rows] = await db.query("SELECT file_path FROM materials WHERE id = ?", [id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Materi tidak ditemukan" });
        }

        let dbFilePath = rows[0].file_path;
        let fileType = null;
        let fileName = null;

       if (file) {
    if (dbFilePath) {
        try { await fs.unlink(path.resolve(dbFilePath)); } catch (err) { }
    }
    dbFilePath = file.path.replace(/\\/g, "/");

    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === ".pdf") fileType = "PDF";
    else if ([".mp4", ".mov", ".avi", ".mkv"].includes(ext)) fileType = "VIDEO";
    else if ([".jpg", ".jpeg", ".png", ".gif"].includes(ext)) fileType = "IMAGE";
    else if ([".doc", ".docx"].includes(ext)) fileType = "DOC";
    else fileType = "OTHER";

    fileName = file.originalname;
}


        await db.query(`
            UPDATE materials 
            SET subject = ?, topic = ?, description = ?, file_path = ?, 
                file_type = COALESCE(?, file_type), file_name = COALESCE(?, file_name)
            WHERE id = ?`,
            [subject, topic, description || null, dbFilePath, fileType, fileName, id]
        );

        res.status(200).json({ success: true, message: "Berhasil diperbarui" });
    } catch (error) {
        console.error("UPDATE ERROR:", error);
        res.status(500).json({ success: false, message: "Gagal update" });
    }
};

// --- 5. DELETE MATERIAL ---
exports.deleteMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query("SELECT file_path FROM materials WHERE id = ?", [id]);
        
        if (rows.length > 0 && rows[0].file_path) {
            try { await fs.unlink(path.resolve(rows[0].file_path)); } catch (err) { }
        }

        await db.query("DELETE FROM materials WHERE id = ?", [id]);
        res.status(200).json({ success: true, message: "Materi dihapus" });
    } catch (error) {
        console.error("DELETE ERROR:", error);
        res.status(500).json({ success: false, message: "Gagal hapus" });
    }    
};

exports.downloadMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query("SELECT file_path, file_name FROM materials WHERE id = ?", [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "File tidak ada" });
        }

        const filePath = path.resolve(rows[0].file_path);
        const fileName = rows[0].file_name;

        // Fungsi bawaan Express untuk mengirim file sebagai download
        res.download(filePath, fileName, (err) => {
            if (err) {
                console.error("Gagal download:", err);
                res.status(500).send("Gagal mengunduh file");
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};