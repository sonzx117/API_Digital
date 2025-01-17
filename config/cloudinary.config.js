const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'shopdientu',
        allowed_formats: ['jpeg', 'png', 'jpg']
    },
    filename: function(req, file, cb) {
        cb(undefined, file.originalname)
    }
})

const uploadCloud = multer({ storage });

module.exports = uploadCloud;