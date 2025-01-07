
const express = require('express');
const ctrls = require('../controllers/userController');
const {verifyAccessToken} = require('../middleware/verifyToken');
const router = express.Router();

// Controller functions (you need to create these in a separate file)

// Routes

router.post('/register', ctrls.registerUser);
router.post('/login', ctrls.loginUser);
router.get('/current', verifyAccessToken, ctrls.getCurrentUser);
router.post('/refreshtoken', ctrls.refreshToken);
router.get('/logout', ctrls.logoutUser);
router.get('/forgotpassword', ctrls.forgotPassword);    
router.put('/resetpassword', ctrls.resetPassword);

//CRUD User

module.exports = router;