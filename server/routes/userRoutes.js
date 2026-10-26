// routes/userRoutes.js
// Authentication routes: registration and login.

const router = require('express').Router();
const authController = require('../controllers/authController');

// Register a new user
router.post('/register', authController.registerUser);

// Login an existing user
router.post('/login', authController.loginUser);

module.exports = router;
