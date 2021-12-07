const authRoutes = require('./AuthRoutes')

const buildRoutes = (app) => {
    app.use('/api/v2', authRoutes)
}


module.exports = {buildRoutes};
