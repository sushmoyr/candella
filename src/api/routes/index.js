const authRoutes = require('./AuthRoutes');
const typesRoutes = require('./TypesRoutes');

const buildRoutes = (app) => {
    app.use('/api/v2', authRoutes);
    app.use('/api/v2/types', typesRoutes)
}


module.exports = {buildRoutes};
