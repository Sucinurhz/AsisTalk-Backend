const jwt = require('jsonwebtoken');

exports.generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,        // ← WAJIB ADA
      username: user.username
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};
