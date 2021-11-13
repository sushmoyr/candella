const authRoutes = require('./auth_routes');
const userRoutes = require('./user_routes');
const utilsRoutes = require('./utils_routes');
const routes = {
    authRoutes,
    userRoutes,
    utilsRoutes
}

module.exports = routes;