const mongoose = require('mongoose');

const blogCategory = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    slug: {
        type: String,
        required: true,
        lowercase: true,
    }
},
    {
        timestamps: true,
    }
)
module.exports = mongoose.model('BlogCategory', blogCategory);