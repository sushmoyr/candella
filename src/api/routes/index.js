const authRoutes = require('./AuthRoutes');
const typesRoutes = require('./TypesRoutes');
const userRoutes = require('./UserRoutes');

const buildRoutes = (app) => {
    app.use('/api/v2', authRoutes);
    app.use('/api/v2/types', typesRoutes);
    app.use('/api/v2/u', userRoutes);
}


module.exports = {buildRoutes};
