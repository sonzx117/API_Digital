const express = require('express');
const ctrls = require('../controllers/prodController');
const {verifyAccessToken, isAdmin} = require('../middleware/verifyToken');
const router = express.Router();

const uploader = require('../config/cloudinary.config');

// Controller functions (you need to create these in a separate file)

// Routes
//CRUD Product
router.post('/', [verifyAccessToken, isAdmin], ctrls.createProduct);
router.post('/uploadimage/:pid', [verifyAccessToken, isAdmin],uploader.array('images', 10), ctrls.uploadImageProduct);
router.get('/:pid', ctrls.getProduct);
router.get('/', ctrls.getProducts);

router.put('/ratings', [verifyAccessToken], ctrls.ratingProd);

router.put('/:pid', [verifyAccessToken, isAdmin], ctrls.updateProduct);
router.delete('/:pid', [verifyAccessToken, isAdmin], ctrls.deleteProduct);


module.exports = router;