const routes = require('./routes');

const initWeb = (app) => {
    configViewEngine(app);
    initRoutes(app);
}

const configViewEngine = (app) => {
    app.set('view engine', 'ejs');
    app.set('views', 'views');
}

const initRoutes = (app) => {
    app.use(routes);
}

module.exports = initWeb;
