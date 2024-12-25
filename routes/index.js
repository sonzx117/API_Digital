const userRoutes = require('./userRoute');
const { notFound, errorHandler } = require('../middleware/errHandller');

const initRoutes = (app) => {
    app.use('/api/users', userRoutes);


    app.use(notFound);
    app.use(errorHandler);
}

module.exports = initRoutes;