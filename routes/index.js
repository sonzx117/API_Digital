const userRoutes = require('./userRoute');
const productRoutes = require('./prodRoute');
const productCategoryRoutes = require('./productCateRoute');
const blogRoutes = require('./blogRoute');
const blogCategoryRoutes = require('./blogCateRoute');
const { notFound, errorHandler } = require('../middleware/errHandller');

const initRoutes = (app) => {
    app.use('/api/user', userRoutes);

    app.use('/api/product', productRoutes);
    app.use('/api/prodcategory', productCategoryRoutes);
    app.use('/api/blog', blogRoutes);
    app.use('/api/blogcategory', blogCategoryRoutes);


    app.use(notFound);
    app.use(errorHandler);
}

module.exports = initRoutes;