
const express = require('express');
const ctrls = require('../controllers/userController');

const router = express.Router();

// Controller functions (you need to create these in a separate file)

// Routes

router.post('/register', ctrls.registerUser);

module.exports = router;