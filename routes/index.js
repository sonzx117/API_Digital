const userRoutes = require('./userRoute');
const productRoutes = require('./prodRoute');
const productCategoryRoutes = require('./productCateRoute');
const blogRoutes = require('./blogRoute');
const blogCategoryRoutes = require('./blogCateRoute');
const brandRoutes = require('./brandRoute');
const couponRoutes = require('./couponRoute');
const orderRoutes = require('./orderRoute');
const { notFound, errorHandler } = require('../middleware/errHandller');


const initRoutes = (app) => {
    app.use('/api/user', userRoutes);

    app.use('/api/product', productRoutes);
    app.use('/api/prodcategory', productCategoryRoutes);
    app.use('/api/blog', blogRoutes);
    app.use('/api/blogcategory', blogCategoryRoutes);
    app.use('/api/brand', brandRoutes);
    app.use('/api/coupon', couponRoutes);
    app.use('/api/order', orderRoutes);


    app.use(notFound);
    app.use(errorHandler);
}

module.exports = initRoutes;