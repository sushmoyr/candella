const authRoutes = require('./AuthRoutes');
const typesRoutes = require('./TypesRoutes');
const userRoutes = require('./UserRoutes');
const notificationRoutes = require('./NotificationRoutes');
const contentRoutes = require('./ContentRoutes');
const fileRoutes = require('./FileRoutes');

const buildRoutes = (app) => {
    app.use('/api/v2', authRoutes);
    app.use('/api/v2/types', typesRoutes);
    app.use('/api/v2/u', userRoutes);
    app.use('/api/v2', notificationRoutes);
    app.use('/api/v2/c', contentRoutes);
    app.use('/api/v2/files', fileRoutes);
}


module.exports = {buildRoutes};
