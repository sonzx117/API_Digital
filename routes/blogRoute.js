const express = require('express');
const ctrls = require('../controllers/blogController');
const {verifyAccessToken, isAdmin} = require('../middleware/verifyToken');
const router = express.Router();
//CRUD Blog

router.post('/', [verifyAccessToken, isAdmin], ctrls.createBlog);
router.get('/', ctrls.getBlogs)
router.get('/one/:bid', ctrls.getdeltaiBlog);
router.put('/:bid', [verifyAccessToken, isAdmin], ctrls.updateBlog);
router.delete('/:bid', [verifyAccessToken, isAdmin], ctrls.deleteBlog);
router.put('/like/:bid', verifyAccessToken, ctrls.likeBlog);
router.put('/dislike/:bid', verifyAccessToken, ctrls.dislikeBlog);

module.exports = router;