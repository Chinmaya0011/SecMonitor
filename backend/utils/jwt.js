const jwt = require("jsonwebtoken");

// 🔐 Generate Token
const signToken = (payload, expiresIn = "7d") => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
  });
};

// 🔍 Verify Token
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { signToken, verifyToken };