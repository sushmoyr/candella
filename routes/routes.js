const authRoutes = require('./auth_routes');
const userRoutes = require('./user_routes');
const utilsRoutes = require('./utils_routes');
const postRoutes = require('./post_route');
const routes = {
    authRoutes,
    userRoutes,
    utilsRoutes,
    postRoutes
}

module.exports = routes;