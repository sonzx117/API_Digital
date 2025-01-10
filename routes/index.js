const userRoutes = require('./userRoute');
const productRoutes = require('./prodRoute');
const { notFound, errorHandler } = require('../middleware/errHandller');

const initRoutes = (app) => {
    app.use('/api/user', userRoutes);

    app.use('/api/product', productRoutes);


    app.use(notFound);
    app.use(errorHandler);
}

module.exports = initRoutes;