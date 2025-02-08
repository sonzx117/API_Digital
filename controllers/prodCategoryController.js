const Category = require('../models/productCategory');
const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const cate_data = require('../data/cate_brand');
require('dotenv').config();
//Create Category
const createCategory = asyncHandler(async (req, res) => {
    const { title, brand } = req.body;
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Missing inputs'
        });
    }
    const slug = slugify(req.body.title);
    const category = await Category.findOne({ slug })
    if (category) {
        return res.status(400).json({
            success: false,
            message: 'Category already exists'
        });
    }
    else {
        const newCategory = await Category.create({ title, slug, brand });
        return res.status(200).json({
            success: newCategory ? true : false,
            message: newCategory ? newCategory : 'Something went wrong',
        })
    }
})
//get AllCategory
const getCategories = asyncHandler(async (req, res) => {
    try {
        const categories = await Category.find();
        return res.status(200).json({
            success: true,
            message: categories,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Something went wrong',
        });
    }
})
//update Category
const updateCategory = asyncHandler(async (req, res) => {
    const { cid } = req.params;
    const category = await Category.findById(cid);
    if (!category) {
        return res.status(400).json({
            success: false,
            message: 'Category not found'
        });
    }
    else {
        if (req.body && req.body.title) { 
            req.body.slug = slugify(req.body.title);
        }
        const updatedCategory = await Category.findByIdAndUpdate(cid, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });
        return res.status(200).json({
            success: true,
            message: updatedCategory ? updatedCategory : 'Something went wrong',
        });
    }
})
//Detele Category
const deleteCategory = asyncHandler(async (req, res) => {
    const { cid } = req.params;
    const category = await Category.findByIdAndDelete(cid);
    if(!category){
        return res.status(400).json({
            success: false,
            message: 'Category not found'
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Category deleted successfully'
    });
})
 
const fn = async (cateProd) => {
    await Category.create({
        title: cateProd?.cate,
        slug: slugify(cateProd?.cate),
        brand: cateProd?.brand,
    });
}


const insertCategory = asyncHandler(async (req, res) => { 
    const promises = [];
    for (let cateProd of cate_data) {
        promises.push(fn(cateProd));
    }
    await Promise.all(promises);
    return res.json({ message: 'Insert data successfully' });

})

module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
    insertCategory
}