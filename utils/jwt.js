const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;

exports.generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username
    },
    SECRET,
    { expiresIn: '7d' }
  );
};
