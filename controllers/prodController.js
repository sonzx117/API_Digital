const Product = require('../models/product');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
require('dotenv').config();
const createProduct = asyncHandler(async (req, res) => {
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
    const product = await Product.findOne({ title: title });
    if(product) {
        return res.status(400).json({
            success: false,
            message: 'Product already exists'
        });
    }
    else {
        const newProduct = await Product.create(req.body);
        return res.status(200).json({
            success: newProduct ? true : false,
            message: newProduct ? newProduct : 'Something went wrong',
        })
    }
})
//Get Product by ID
const getProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    const product = await Product.findById(pid);
    if (!product) {
        return res.status(400).json({
            success: false,
            message: 'Product not found'
        });
    }
    else {
        return res.status(200).json({
            success: true,
            message: product
        });
    }
})
//get All
const getProducts = asyncHandler(async (req, res) => {
    try {
        const queries = { ...req.query };
        //Tach cac truong hop dac biet ra khoi query
        const fields = ['sort', 'select', 'page', 'limit'];
        fields.forEach(el => delete queries[el]);
       
        //Tao query string
        let queryString = JSON.stringify(queries);
        queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, matchEl => `$${matchEl}`);
        const fotmatQuery = JSON.parse(queryString);


        //Filter loc theo title
        if (queries?.title) {
            fotmatQuery.title = { $regex: queries.title, $options: 'i' };
        }
        let queryComand = Product.find(fotmatQuery);
        //Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            queryComand = queryComand.sort(sortBy);
        }
        //Field limits
        if (req.query.fields) {
            const fields = req.query.select.split(',').join(' ');
            queryComand = queryComand.select(fields);
        }
        //Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || process.env.LIMIT_PRODUCT;
        const skip = (page - 1) * limit;
        queryComand = queryComand.skip(skip).limit(limit);
        //Execute query
        const products = await queryComand.exec();
        const totalProduct = await Product.find(fotmatQuery).countDocuments();
        return res.status(200).json({
            success: products ? true : false,
            products: products ? products : 'Something went wrong',
            totalProduct,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})
//Update Product
const updateProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    if (!pid || Object.keys(req.body).length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Missing input'
        })
    }
    if (req.body && req.body.title) { 
        req.body.slug = slugify(req.body.title);
    }
    const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, { new: true });
    return res.status(200).json({
        success: updatedProduct ? true : false,
        message: updatedProduct ? updatedProduct : 'Something went wrong'
    })
})
//Delete Product
const deleteProduct = asyncHandler(async (req, res) => { 
    const { pid } = req.params;
    if (!pid) {
        return res.status(400).json({
            success: false,
            message: 'Missing input'
        });
    }
    const product = await Product.findByIdAndDelete(pid);
    return res.status(200).json({
        success: product ? true : false,
        message: product ? 'Product deleted successfully' : 'Product not found'
    })
})
//Rating Product
const ratingProd = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, comment, pid } = req.body;
    if (!star || !pid) {
        return res.status(400).json({
            success: false,
            message: 'Missing input'
        })
    }
    const ratingProduct = await Product.findById(pid);
    if (!ratingProduct) {
        return res.status(400).json({
            success: false,
            message: 'Product not found'
        })
    }
    //
    const alreadyRated = ratingProduct?.ratings?.find(r => r.postedBy.toString() === _id.toString());
    if (alreadyRated) {
        //update rating
        const ratingIndex = ratingProduct.ratings.findIndex(r => r.postedBy.toString() === _id.toString());
        console.log(ratingIndex)
        ratingProduct.ratings[ratingIndex].star = star;
        ratingProduct.ratings[ratingIndex].comment = comment;
        await ratingProduct.save();
    }
    else {
        //add rating
        ratingProduct.ratings.push({
            star,
            comment,
            postedBy: _id
        });
        await ratingProduct.save();
    }
    //Update total rating
    const totalRating = ratingProduct.ratings.reduce((sum, item) => {
        return !isNaN(item.star) ? sum + item.star : sum;
    }, 0);

    const totalRatings = ratingProduct.ratings.length;
    const total = totalRatings > 0 ? totalRating / totalRatings : 0; // Đảm bảo không chia cho 0

    // Cập nhật totalRatings (trung bình đánh giá) vào sản phẩm
    await Product.findByIdAndUpdate(pid, { totalRatings: total }, { new: true });
    console.log(total)
    return res.status(200).json({
        status: true,
        message: 'Rating success'
    })

})

const uploadImageProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
  if (!req.files) throw new Error("Missing inputs");
  const response = await Product.findByIdAndUpdate(
    pid,
    {
      $push: { images: { $each: req.files.map((el) => el.path) } },
    },
    { new: true }
  );
  return res.status(response ? 200 : 400).json({
    success: response ? true : false,
    rs: response ? response : "Cannot upload images",
  });
})

module.exports = {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    ratingProd,
    uploadImageProduct
}