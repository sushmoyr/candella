//global module imports
const express = require('express');
const bodyParser = require('body-parser')
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookie_parser = require('cookie-parser');
//local modules import
const routes = require('./routes/routes');
const {base_user} = require('./utils/Constants');
const {verifyToken} = require("./utils/token_manager");
const userViewRoute = require('./view_routes/user_route')
const path = require("path");
//configs and vars
const app = express();
dotenv.config();
app.set('view engine', 'ejs');
app.set('views', 'views');

//DB connection
mongoose.connect(process.env.DB_URL)
    .then(r => console.log('Database Connected'))
    .catch(err => console.log(err));


//middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookie_parser('1234'));

//route middlewares
app.use('/api/v1/u', routes.authRoutes);
app.use('/api/v1/u', routes.userRoutes);
app.use('/api/v1/utils', routes.utilsRoutes);


//view routes
app.use(userViewRoute);


app.listen(process.env.PORT, () => {
    console.log("Server is running");
})