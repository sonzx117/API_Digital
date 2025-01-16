const Brand = require('../models/brand');
const asyncHandler = require('express-async-handler');
require('dotenv').config();
const slugify = require('slugify');

//CRUD BlogCategory
const createNewBrand = asyncHandler(async (req, res) => { 
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
    const brand = await Brand.findOne({ title: title });
    if(brand) {
        return res.status(400).json({
            success: false,
            message: 'Brand already exists'
        });
    }
    else {
        const newBrand = await Brand.create(req.body);
        return res.status(200).json({
            success: newBrand ? true : false,
            message: newBrand ? newBrand : 'Something went wrong',
        })
    }
})
const getBrand = asyncHandler(async (req, res) => { 
    const gBrand = await Brand.find();
    return res.status(200).json({
        success: gBrand ? true : false,
        message: gBrand ? gBrand : 'Something went wrong',
    })
})
const updateBrand = asyncHandler(async (req, res) => { 
    const { brid } = req.params;
    const brand = await Brand.findById(brid);
    if (!brand) {
        return res.status(400).json({
            success: false,
            message: 'Brand not found'
        })
    }
    else {
        if (Object.keys(req.body).length === 0) {
            throw new Error('Missing inputs');
        }
        if (req.body && req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updatedBrand = await Brand.findByIdAndUpdate(brid, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });
        return res.status(200).json({
            success: updatedBrand ? true : false,
            message: updatedBrand ? updatedBrand : 'Something went wrong',
        })
        
    }
})
const deleteBrand = asyncHandler(async (req, res) => { 
    const { brid } = req.params;
    const brand = await Brand.findByIdAndDelete(brid);
    return res.status(200).json({
        success: brand ? true : false,
        message: brand ? 'Brand deleted successfully' : 'Something went wrong',
    })
})
module.exports = {
    createNewBrand,
    getBrand,
    updateBrand,
    deleteBrand
}