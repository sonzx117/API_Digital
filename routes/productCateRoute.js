const express = require('express');
const ctrls = require('../controllers/prodCategoryController');
const { verifyAccessToken, isAdmin } = require('../middleware/verifyToken');
const router = express.Router();

// Controller functions (you need to create these in a separate file)
//CRUD Product Category
router.post('/', [verifyAccessToken, isAdmin], ctrls.createCategory);
router.post('/insert', ctrls.insertCategory);
router.get('/', ctrls.getCategories);
router.put('/:cid', [verifyAccessToken, isAdmin], ctrls.updateCategory);
router.delete('/:cid', [verifyAccessToken, isAdmin], ctrls.deleteCategory);


module.exports = router;