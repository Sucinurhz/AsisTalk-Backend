require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ================== MIDDLEWARE ==================
app.use(cors());
app.use(express.json());

// akses file upload (foto profil, post image, dll)
app.use('/uploads', express.static('uploads'));

// ================== ROUTES ==================
app.get('/', (req, res) => {
  res.send('AsisTalk Backend berjalan');
});

// Auth
app.use('/api/auth', require('./routes/auth.routes'));

// Profile
app.use('/api/profile', require('./routes/profile.routes'));

// Dashboard
app.use('/api/dashboard', require('./routes/dashboard.routes'));

//asislearn
app.use("/api/materials", require("./routes/material.routes"));

app.use("/uploads", express.static("uploads"));

// (nanti)
// app.use('/api/posts', require('./routes/post.routes'));
// app.use('/api/materials', require('./routes/material.routes'));

// ================== SERVER ==================
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
