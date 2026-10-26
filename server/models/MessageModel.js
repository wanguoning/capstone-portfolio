// models/MessageModel.js
// Contact form message submitted from the public portfolio page.

const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', MessageSchema);
