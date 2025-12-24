const express = require("express");
const router = express.Router();

const materialController = require("../controllers/material.controller");
const authMiddleware = require("../middleware/auth.middleware");
const uploadMaterial = require("../middleware/uploadMaterial.middleware");
const deleteMaterialMiddleware = require("../middleware/deleteMaterial.middleware");
const editMaterialMiddleware = require("../middleware/editMaterial.middleware");

// UPLOAD MATERI
router.post(
  "/",
  authMiddleware,
  uploadMaterial.single("file"),
  materialController.uploadMaterial
);

router.get("/", materialController.getAllMaterials);
router.get('/:id', authMiddleware, materialController.getMaterialById);
router.get("/download/:id", materialController.downloadMaterial);

router.put("/:id", authMiddleware, editMaterialMiddleware, uploadMaterial.single("file"), materialController.updateMaterial);

router.delete(
    "/:id", 
    authMiddleware,            // 1. Cek apakah sudah login
    deleteMaterialMiddleware,  // 2. Cek apakah dia pemiliknya
    materialController.deleteMaterial // 3. Eksekusi hapus
);

module.exports = router;