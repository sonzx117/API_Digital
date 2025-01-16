const express = require('express');
const ctrls = require('../controllers/brandController');
const {verifyAccessToken, isAdmin} = require('../middleware/verifyToken');
const router = express.Router();
//CRUD Blog

router.post('/', [verifyAccessToken, isAdmin], ctrls.createNewBrand);
router.get('/', ctrls.getBrand);
router.put('/:brid', [verifyAccessToken, isAdmin], ctrls.updateBrand)
router.delete('/:brid', [verifyAccessToken, isAdmin], ctrls.deleteBrand)


module.exports = router;