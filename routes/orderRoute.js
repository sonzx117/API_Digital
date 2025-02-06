const express = require('express');
const ctrls = require('../controllers/orderController');
const {verifyAccessToken, isAdmin} = require('../middleware/verifyToken');
const router = express.Router();

//CRUD Order

router.post('/', [verifyAccessToken], ctrls.createOrder);
router.put('/status/:orderId', [verifyAccessToken, isAdmin], ctrls.changeOrderStatus);
router.get('/', [verifyAccessToken], ctrls.getUserOrders);
router.get('/admin', [verifyAccessToken, isAdmin], ctrls.getAdminOrders);


module.exports = router;