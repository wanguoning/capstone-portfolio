// routes/messageRoutes.js
// Contact form route: public message submission.

const router = require('express').Router();
const messageController = require('../controllers/messageController');

router.post('/', messageController.createMessage);

module.exports = router;
