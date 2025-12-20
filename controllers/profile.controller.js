const db = require('../config/db')

// GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const { id } = req.params

    const [rows] = await db.query(
      `SELECT 
        id,
        full_name,
        username,
        email,
        phone_number,
        birth_date,
        gender,
        profile_image
       FROM users
       WHERE id = ?`,
      [id]
    )

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params
    const { full_name, email, phone_number } = req.body

    await db.query(
      `UPDATE users 
       SET full_name=?, email=?, phone_number=? 
       WHERE id=?`,
      [full_name, email, phone_number, id]
    )

    res.json({ message: 'Profile updated' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
