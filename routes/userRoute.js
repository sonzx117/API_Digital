
const express = require('express');
const ctrls = require('../controllers/userController');
const {verifyAccessToken, isAdmin} = require('../middleware/verifyToken');
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
router.get('/', [verifyAccessToken, isAdmin], ctrls.getUsers)
router.delete('/', [verifyAccessToken, isAdmin], ctrls.deleteUser)
router.put('/current', [verifyAccessToken], ctrls.updateUser)
router.put('/address', [verifyAccessToken], ctrls.updateAddress)
router.put('/cart', [verifyAccessToken], ctrls.updateCart)
router.put('/:uid', [verifyAccessToken, isAdmin], ctrls.updateUserbyAdmin)



module.exports = router;