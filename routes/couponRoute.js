const express = require('express');
const ctrls = require('../controllers/couponController');
const {verifyAccessToken, isAdmin} = require('../middleware/verifyToken');
const router = express.Router();
//CRUD Blog

router.post('/', [verifyAccessToken, isAdmin], ctrls.createNewCoupon);
router.get('/', ctrls.getCoupon);
router.put('/:cid', [verifyAccessToken, isAdmin], ctrls.updateCoupon);
router.delete('/:cid', [verifyAccessToken, isAdmin], ctrls.deleteCoupon);
module.exports = router;