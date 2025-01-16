const Blog = require('../models/blog');
const asyncHandler = require('express-async-handler');
require('dotenv').config();

//CRUD Blog
const createBlog = asyncHandler(async (req, res) => { 
    const { title, description, category } = req.body;
    if (!title || !description || !category) {
        return res.status(400).json({
            success: false,
            message: 'Missing input'
        })
    }
    const blog = await Blog.findOne({ title });
    if (blog) {
        return res.status(400).json({
            success: false,
            message: 'Blog already exits'
        })
    }
    const newBlog = await Blog.create({title, description, category});
    return res.status(200).json({
        success: newBlog ? true : false,
        message: newBlog ? newBlog : 'Something went wrong',
    })
});

const getBlogs = asyncHandler(async (req, res) => { 
    const blogs = await Blog.find();
    return res.status(200).json({
        success: blogs ? true : false,
        message: blogs ? blogs : 'Something went wrong',
    })
})

const updateBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Missing input'
        });
    }
    const upBlog = await Blog.findByIdAndUpdate(bid, req.body, { new: true });
    return res.status(upBlog ? 200 : 400 ).json({
        success: upBlog ? true : false,
        message: upBlog ? upBlog : 'Something went wrong',
    })
})
const deleteBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const deleteBlog = await Blog.findByIdAndDelete(bid);
    return res.json({
        success: deleteBlog ? true : false,
        message: deleteBlog ? 'Blog deleted successfully' : 'Something went wrong',
    })
})
//Like, Dislike Blog
//Kiem tra xem user da like hay chua neu chua thi like, neu roi thi xoa like
const likeBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const { _id } = req.user;
    const blog = await Blog.findById(bid);
    const alreadyDislike = blog?.dislikes?.find(el => el.toString() === _id);
    if(alreadyDislike){
        await Blog.findByIdAndUpdate(bid, { $pull: { dislikes: _id } }, { new: true });
    }
    const isLiked = blog.likes.find(like => like.toString() === _id);
    if (isLiked) {
        const response = await Blog.findByIdAndUpdate(bid, { $pull: { likes: _id } }, { new: true });
        return res.json({
            success: response ? true : false,
            message: response ? response : 'Something went wrong',
        })
    } else {
        const response = await Blog.findByIdAndUpdate(bid, { $push: { likes: _id } }, { new: true });
        return res.json({
            success: response ? true : false,
            message: response ? response : 'Something went wrong',
        })
    }
})
//Kiem tra xem user da dislike hay chua neu chua thi dislike, neu roi thi xoa dislike
const dislikeBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const { _id } = req.user;
    const blog = await Blog.findById(bid);
    const alreadyLike = blog?.likes?.find(el => el.toString() === _id);
    if(alreadyLike){
        await Blog.findByIdAndUpdate(bid, { $pull: { likes: _id } }, { new: true });
    }
    const isDisliked = blog.dislikes.find(el => el.toString() === _id);
    if (isDisliked) {
        const response = await Blog.findByIdAndUpdate(bid, { $pull: { dislikes: _id } }, { new: true });
        return res.json({
            success: response ? true : false,
            message: response ? response : 'Something went wrong',
        })
    } else {
        const response = await Blog.findByIdAndUpdate(bid, { $push: { dislikes: _id } }, { new: true });
        return res.json({
            success: response ? true : false,
            message: response ? response : 'Something went wrong',
        })
    }
})
const getdeltaiBlog = asyncHandler(async (req, res) => { 
    const { bid } = req.params;
    const blog = await Blog.findByIdAndUpdate(bid, { $inc: { numberViews: 1 } }, { new: true })
        .populate('likes', 'firstname lastname')
        .populate('dislikes', 'firstname lastname');
    return res.json({
        success: blog ? true : false,
        message: blog ? blog : 'Something went wrong',
    })
})
module.exports = {
    createBlog,
    getBlogs,
    updateBlog,
    deleteBlog,
    likeBlog,
    dislikeBlog,
    getdeltaiBlog

}