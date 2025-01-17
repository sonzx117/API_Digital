const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    product: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        count: Number,
        color: String
    }],
    status: {
        type: String,
        default: 'Processing',
        enum: ['Processing', 'Successed', 'Cancelled']
    },
    paymentIntent: {},
    orderBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }

})
module.exports = mongoose.model('Order', orderSchema)