const Product = require('../models/product');
const data = require('../data/data.json');

const asyncHandler = require('express-async-handler');
require('dotenv').config();
const slugify = require('slugify');

//CRUD BlogCategory
const fn = async (product) => {
    const colorVariants = product?.variants?.find(el => el.label === 'Color')?.variants;
    await Product.create({
        title: product?.name,
        slug: slugify(product?.name),
        descriptions: product?.description,
        brand: product?.brand,
        price: Math.round(Number(product?.price?.match(/\d/g).join('')) / 100),
        category: product?.category[1],
        quantity: Math.round(Math.random() * 100),
        sold: Math.round(Math.random() * 100),
        images: product?.images,
        color: colorVariants?.length > 0 ? colorVariants[0] : 'Black',
    });
}


const insertProduct = asyncHandler(async (req, res) => { 
    const promises = [];
    for (let product of data) {
        promises.push(fn(product));
    }
    await Promise.all(promises);
    return res.json({ message: 'Insert data successfully' });

})
module.exports = {
    insertProduct
}