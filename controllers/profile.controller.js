const db = require('../config/db')

// GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id

    const [user] = await db.query(
      "SELECT id, full_name, username, email, phone, birth_date, gender, profile_image FROM users WHERE id = ?",
      [userId]
    )

    if (!user.length) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({
      success: true,
      user: user[0]
    })

  } catch (error) {
    res.status(500).json({ message: "Server error" })
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
