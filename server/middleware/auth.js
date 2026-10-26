// middleware/auth.js
// protect middleware: verifies the JWT sent in the Authorization header and
// attaches the matching user document (without password) to req.user.

const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const ErrorHandler = require('../utils/ErrorHandler');

const protect = async (req, res, next) => {
  let token;

  // Read the token from "Authorization: Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ErrorHandler('Not authorized, no token provided', 401));
  }

  try {
    // Verify the signature and decode the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Load the user (password excluded) and attach it to the request
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return next(new ErrorHandler('Not authorized, user no longer exists', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorHandler('Not authorized, token invalid or expired', 401));
  }
};

module.exports = { protect };
