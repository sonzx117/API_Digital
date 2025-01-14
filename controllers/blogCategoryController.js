const blogCategory = require('../models/blogCategory');
const asyncHandler = require('express-async-handler');
require('dotenv').config();
const slugify = require('slugify');
const { use } = require('../routes/blogRoute');

//CRUD BlogCategory
const createBlogCategory = asyncHandler(async (req, res) => { 
    const { title } = req.body;

    if (Object.keys(req.body).length ===0) {
            return res.status(400).json({
                success: false,
                message: 'Missing inputs'
            });
    }
    if(req.body && req.body.title) {
        req.body.slug = slugify(req.body.title);
    }
    const blogCate = await blogCategory.findOne({ title: title });
    if(blogCate) {
        return res.status(400).json({
            success: false,
            message: 'Blog Category already exists'
        });
    }
    else {
        const newBlogCate = await blogCategory.create(req.body);
        return res.status(200).json({
            success: newBlogCate ? true : false,
            message: newBlogCate ? newBlogCate : 'Something went wrong',
        })
    }
})
const getBlogCategories = asyncHandler(async (req, res) => { 
    const blogCates = await blogCategory.find();
    return res.status(200).json({
        success: blogCates ? true : false,
        message: blogCates ? blogCates : 'Something went wrong',
    })
})
const updateBlogCategory = asyncHandler(async (req, res) => { 
    const { bcid } = req.params;
    const blogCate = await blogCategory.findById(bcid);
    if (!blogCate) {
        return res.status(400).json({
            success: false,
            message: 'Blog Category not found'
        })
    }
    else {
        if (Object.keys(req.body).length === 0) {
            throw new Error('Missing inputs');
        }
        if (req.body && req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updatedBlogCate = await blogCategory.findByIdAndUpdate(bcid, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });
        return res.status(200).json({
            success: updatedBlogCate ? true : false,
            message: updatedBlogCate ? updatedBlogCate : 'Something went wrong',
        })
        
    }
})
const deleteBlogCategory = asyncHandler(async (req, res) => { 
    const { bcid } = req.params;
    const blogCate = await blogCategory.findByIdAndDelete(bcid);
    return res.status(200).json({
        success: blogCate ? true : false,
        message: blogCate ? 'Blog Category deleted successfully' : 'Something went wrong',
    })
})
module.exports = {
    createBlogCategory,
    getBlogCategories,
    updateBlogCategory,
    deleteBlogCategory
}