const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
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
module.exports = mongoose.model('Brand', brandSchema);