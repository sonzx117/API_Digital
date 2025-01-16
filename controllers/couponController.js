const Coupon = require('../models/coupon');
const asyncHandler = require('express-async-handler');
require('dotenv').config();

//CRUD Coupon
const createNewCoupon = asyncHandler(async (req, res) => {
    const { code, discount, expiry } = req.body;
    if(!code || !discount || !expiry) {
        return res.status(400).json({
            success: false,
            message: 'Missing inputs'
        });
    }
    const coupon = await Coupon.findOne({code: code});
    if (coupon) {
        return res.status(400).json({
            success: false,
            message: 'Coupon already exists'
        });
    }
    else {
        const newCoupon = await Coupon.create({
            ...req.body,
            expiry: Date.now() + + expiry * 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({
            success: newCoupon ? true : false,
            message: newCoupon ? newCoupon : 'Something went wrong',
        })
    }
})
const getCoupon = asyncHandler(async (req, res) => {
    const gCoupon = await Coupon.find();
    return res.status(200).json({
        success: gCoupon ? true : false,
        message: gCoupon ? gCoupon : 'Something went wrong',
    })
})
const updateCoupon = asyncHandler(async (req, res) => {
    const { cid } = req.params;
    if (Object.keys(req.body).length === 0  || Object.values(req.body).some(value => value === null || value === ''))   {
        throw new Error('Missing inputs');
    }
    if (req.body.expiry) {
        req.body.expiry = Date.now() + +req.body.expiry * 24 * 60 * 60 * 1000;
    }
    const uCoupon = await Coupon.findByIdAndUpdate(cid, req.body, { new: true });
    return res.status(200).json({
        success: uCoupon ? true : false,
        message: uCoupon ? uCoupon : 'Something went wrong',
    })
})


const deleteCoupon = asyncHandler(async (req, res) => {
    const { cid } = req.params;
    const dCoupon = await Coupon.findByIdAndDelete(cid);
    return res.status(200).json({
        success: dCoupon ? true : false,
        message: dCoupon ? 'Coupon deleted successfully' : 'Something went wrong',
    })
}) 
module.exports = {
    createNewCoupon,
    getCoupon,
    updateCoupon,
    deleteCoupon
}