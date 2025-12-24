const db = require("../config/db");

const editMaterialMiddleware = async (req, res, next) => {
    try {
        const materialId = req.params.id;
        const userId = req.user.id; // Diambil dari authMiddleware

        // Cek database
        const [rows] = await db.query(
            "SELECT user_id FROM materials WHERE id = ?",
            [materialId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Gagal Edit: Materi tidak ditemukan"
            });
        }

        // Pastikan hanya pemilik yang bisa masuk ke proses update
        if (rows[0].user_id !== userId) {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak! Anda tidak punya hak mengedit materi ini."
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Kesalahan sistem pada validator edit"
        });
    }
};

module.exports = editMaterialMiddleware;