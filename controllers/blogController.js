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
    return res.status(200).json({
        success: upBlog ? true : false,
        message: upBlog ? upBlog : 'Something went wrong',
    })
})
const deleteBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const deleteBlog = await Blog.findByIdAndDelete(bid);
    return res.status(200).json({
        success: deleteBlog ? true : false,
        message: deleteBlog ? 'Blog deleted successfully' : 'Something went wrong',
    })
})

module.exports = {
    createBlog,
    getBlogs,
    updateBlog,
    deleteBlog
}