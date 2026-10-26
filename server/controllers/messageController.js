// controllers/messageController.js
// Contact form controller: saves a public message submitted from the portfolio.

const Message = require('../models/MessageModel');
const ErrorHandler = require('../utils/ErrorHandler');

// @desc    Save a contact form message
// @route   POST /api/contact
// @access  Public
exports.createMessage = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    // Basic validation: all fields are required
    if (!name || !email || !message) {
      return next(new ErrorHandler('Please fill in all fields', 400));
    }

    const saved = await Message.create({ name, email, message });

    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    next(error);
  }
};
