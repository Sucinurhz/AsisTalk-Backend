require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ================== MIDDLEWARE ==================
app.use(cors());
app.use(express.json());

// Akses file statis 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ================== ROUTES ==================
app.get('/', (req, res) => {
  res.send('AsisTalk Backend berjalan');
});

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/profile', require('./routes/profile.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));
app.use('/api/materials', require('./routes/material.routes'));
app.use('/api/posts', require('./routes/post.routes'));
app.use('/api/comments', require('./routes/comment.routes'));

//asislearn
app.use("/api/materials", require("./routes/material.routes"));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ================== ERROR HANDLING ==================
// Menangani route yang tidak terdaftar
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint tidak ditemukan" });
});

// ================== SERVER ==================
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
process.on('uncaughtException', (err) => {
    console.error('ADA ERROR TIDAK TERDUGA:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('ADA JANJI (PROMISE) YANG GAGAL:', reason);
});