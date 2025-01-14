const express = require('express');
const ctrls = require('../controllers/blogCategoryController');
const {verifyAccessToken, isAdmin} = require('../middleware/verifyToken');
const router = express.Router();
//CRUD Blog

router.post('/', [verifyAccessToken, isAdmin], ctrls.createBlogCategory);
router.get('/', ctrls.getBlogCategories);
router.put('/:bcid', [verifyAccessToken, isAdmin], ctrls.updateBlogCategory)
router.delete('/:bcid', [verifyAccessToken, isAdmin], ctrls.deleteBlogCategory)


module.exports = router;