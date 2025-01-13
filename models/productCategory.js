const mongoose = require('mongoose');

const prodCategory = new mongoose.Schema(
    {
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
        },
        brand: {
            type: Array,
            required: true,
        }
    },
    {
        timestamps: true,
    }
)
module.exports = mongoose.model('Category', prodCategory);