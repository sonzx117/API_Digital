const mongose = require('mongoose');

const blogSchema = new mongose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    numberViews: {
        type: Number,
        default: 0
    },
    likes: [
        {
            type: mongose.Types.ObjectId,
            ref: 'User'
        }
    ],
    dislikes: [
        {
            type: mongose.Types.ObjectId,
            ref: 'User'
        }
    ],
    images: {
        type: String,
        default: "https://c0.wallpaperflare.com/preview/639/306/330/aerial-background-blog-cafe.jpg",
    },
    author: {
        type: String,
        default: 'Admin'
    }
},
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);
module.exports = mongose.model('Blog', blogSchema);