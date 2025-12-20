const db = require('../config/db');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');

//register 
exports.register = async (req, res) => {
  try {
    const {
      full_name,
      username,
      email,
      phone_number,
      password,
      birth_date,
      gender
    } = req.body;

    // 1️⃣ Validasi field wajib
    if (
      !full_name ||
      !username ||
      !email ||
      !phone_number ||
      !password ||
      !birth_date ||
      !gender 
    ) {
      return res.status(400).json({
        success: false,
        message: 'Semua field wajib diisi'
      });
    }

    // 2️⃣ Foto profil wajib
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Foto profil wajib diupload'
      });
    }

    // 3️⃣ Cek user sudah ada
    const [check] = await db.query(
      'SELECT id FROM users WHERE username=? OR email=?',
      [username, email]
    );

    if (check.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Username atau Email sudah terdaftar'
      });
    }

    // 4️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5️⃣ Simpan path foto
    const profileImagePath = `/uploads/profiles/${req.file.filename}`;

    // 6️⃣ Insert ke database
    await db.query(
      `INSERT INTO users
      (full_name, username, email, phone_number, password, profile_image, birth_date, gender)
      VALUES (?,?,?,?,?,?,?,?)`,
      [
        full_name,
        username,
        email,
        phone_number,
        hashedPassword,
        profileImagePath,
        birth_date,
        gender
      ]
    );

    // 7️⃣ Response sukses
    res.status(201).json({
      success: true,
      message: 'Register berhasil'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// login
exports.login = async (req, res) => {
  const { username, password } = req.body;

  const [users] = await db.query(
    'SELECT * FROM users WHERE username=?',
    [username]
  );

  if (users.length === 0)
    return res.status(401).json({ message: 'User tidak ditemukan' });

  const user = users[0];
  const valid = await bcrypt.compare(password, user.password);

  if (!valid)
    return res.status(401).json({ message: 'Password salah' });

  const token = generateToken(user);

  res.json({
  success: true,
  token,
    user: {
      id: user.id,
      full_name: user.full_name,
      username: user.username,
      email: user.email,
      phone_number: user.phone_number,
      birth_date: user.birth_date,
      gender: user.gender,
      profile_image: user.profile_image
    }
});
};

// getProfile
exports.getProfile = async (req, res) => {
  try {
    const { id } = req.params

    const [rows] = await db.query(
      `
      SELECT 
        id,
        full_name AS fullName,
        username,
        email,
        phone_number AS phoneNumber,
        birth_date AS birthDate,
        gender,
        profile_image AS profileImage
      FROM users
      WHERE id = ?
      `,
      [id]
    )

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      user: rows[0]
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}
