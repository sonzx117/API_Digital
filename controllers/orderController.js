const Order = require('../models/order');
const User = require('../models/user');
const Coupon = require('../models/coupon');
const asyncHandler = require('express-async-handler');

//CRUD Order
const createOrder = asyncHandler(async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not authenticated"
            });
        }

        const { _id } = req.user;
        const { coupon } = req.body;

        // Kiểm tra user tồn tại trong database
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const userCart = await User.findById(_id)
            .select('cart')
            .populate({
                path: 'cart.product',
                select: 'title price',
            })
            .lean();
        if (!userCart?.cart || userCart.cart.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        // Xử lý products 
        const product = userCart.cart
        .filter(el => el.product) 
        .map(el => ({             
            product: el.product._id,
            count: el.quantity,
            color: el.color
        }));
        if (product.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid products in cart"
            });
        }
        // let total = userCart.cart.reduce((sum, item) => {
        //     if (!item.product) return sum;
        //     const productPrice = Number(item.product.price) || 0;
        //     const quantity = Number(item.quantity) || 0;

        //     return sum + (productPrice * quantity);
        // }, 0);
        let total = userCart?.cart?.reduce((sum, el) => Number(el.product.price) * Number(el.quantity) + Number(sum), 0);
        const dataOrder = { product, total, orderBy: _id };
        

        if (coupon && typeof coupon === "string" && coupon.trim() !== "") {
            const selectedCoupon = await Coupon.findById(coupon);
            if (!selectedCoupon) {
                return res.status(404).json({
                    success: false,
                    message: "Coupon not found"
                });
            }
            let discountTotal = total * (1 - +selectedCoupon?.discount / 100);
           
            total = Math.round(discountTotal);
            dataOrder.total = total;
            dataOrder.coupon = coupon;    
        }

        const response = await Order.create(dataOrder);

        return res.status(201).json({
            success: true,
            data: response,
        });

    } catch (error) {
        console.error("Error in createOrder:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
});
const changeOrderStatus = asyncHandler(async (req, res) => { 
    const { orderId } = req.params;
    const { status } = req.body;
    if (!status) throw new Error('Status is required');
    const response = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    return res.status(response ? 200 : 400).json({
        success: response ? true : false,
        data: response ? response : 'Something went wrong'
    })
})
const getUserOrders = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const response = await Order.find({ orderBy: _id });
    return res.status(response ? 200 : 400).json({
        success: response ? true : false,
        data: response ? response : 'Something went wrong'
    })
})
const getAdminOrders = asyncHandler(async (req, res) => {
    const response = await Order.find()
    return res.status(response ? 200 : 400).json({
        success: response ? true : false,
        data: response ? response : 'Something went wrong'
    })
 })

module.exports = {
    createOrder,
    changeOrderStatus,
    getUserOrders,
    getAdminOrders
}