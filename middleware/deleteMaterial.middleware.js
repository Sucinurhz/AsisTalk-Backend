const db = require("../config/db");

const deleteMaterialMiddleware = async (req, res, next) => {
    try {
        const materialId = req.params.id;
        const userId = req.user.id; // Diambil dari authMiddleware sebelumnya

        // Cari materi di database
        const [rows] = await db.query(
            "SELECT user_id FROM materials WHERE id = ?",
            [materialId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Materi tidak ditemukan"
            });
        }

        // Cek apakah user_id di materi sama dengan user_id yang login
        if (rows[0].user_id !== userId) {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak! Anda bukan pemilik materi ini."
            });
        }

        // Jika lolos, lanjut ke controller
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server saat validasi penghapusan"
        });
    }
};

module.exports = deleteMaterialMiddleware;