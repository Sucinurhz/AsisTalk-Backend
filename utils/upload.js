const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "profile_image") {
      cb(null, "uploads/profiles/"); 
    } else {
      cb(null, "uploads/posts/");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const fileFilter = (req, file, cb) => {
  // 🔥 BOLEH TANPA FILE
  if (!file) {
    return cb(null, true)
  }

  const allowedExt = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".mp4",
    ".webm",
    ".mov"
  ]

  const ext = path.extname(file.originalname).toLowerCase()

  const isImage = file.mimetype.startsWith("image/")
  const isVideo = file.mimetype.startsWith("video/")

  if ((isImage || isVideo) && allowedExt.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error("File harus berupa gambar atau video"), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB
  }
})

module.exports = upload
