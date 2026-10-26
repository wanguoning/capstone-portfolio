// utils/generateToken.js
// Reusable helper that signs a JWT containing the user id.

const jwt = require('jsonwebtoken');

// Load secret securely from environment variables
const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (userId) => {
  // Payload contains the user ID
  const payload = { id: userId };
  // Token expires in 30 days
  const options = { expiresIn: '30d' };
  // Signs the token using the secret
  return jwt.sign(payload, JWT_SECRET, options);
};

module.exports = generateToken;
