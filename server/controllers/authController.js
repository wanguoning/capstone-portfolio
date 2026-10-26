// controllers/authController.js
// User authentication controllers: registration and login.

const User = require('../models/UserModel');
const ErrorHandler = require('../utils/ErrorHandler');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
exports.registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Basic validation: all fields are required
    if (!username || !email || !password) {
      return next(new ErrorHandler('Please fill in all fields', 400));
    }

    // Make sure the email has not been used before
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler('Email is already registered', 400));
    }

    // The password is hashed automatically by the pre-save hook in the model
    const user = await User.create({ username, email, password });

    res.status(201).json({
      success: true,
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login an existing user and issue a JWT
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Find user, forcing Mongoose to include the password hash
    // (the field has select: false in the schema)
    const user = await User.findOne({ email }).select('+password');

    // 2. Check if user exists AND if the password matches the hash
    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        success: true,
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      // 3. Reject with a generic 401 Unauthorized error
      return next(new ErrorHandler('Invalid email or password', 401));
    }
  } catch (error) {
    next(error);
  }
};
