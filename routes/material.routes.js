const express = require("express");
const router = express.Router();

const materialController = require("../controllers/material.controller");
const authMiddleware = require("../middleware/auth.middleware");
const uploadMaterial = require("../middleware/uploadMaterial.middleware");

// UPLOAD MATERI
router.post(
  "/",
  authMiddleware,
  uploadMaterial.single("file"),
  materialController.uploadMaterial
);

module.exports = router;