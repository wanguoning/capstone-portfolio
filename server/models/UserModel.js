// models/UserModel.js
// User schema for MongoDB: stores username, email and the hashed password.
// The password is excluded from normal queries and only fetched when needed
// during login.

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  // Critical: select: false keeps the hash out of regular find() results
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
});

// Hash the password with bcrypt before saving a new or updated user
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Custom method to compare the entered password with the stored hash
UserSchema.methods.matchPassword = async function (enteredPassword) {
  // 'this.password' is the stored hash (retrieved specially for login)
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
