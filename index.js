//global module imports
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
//local modules import
const routes = require('./routes/routes');
const {base_user} = require('./utils/Constants');
const {verifyToken} = require("./utils/token_manager");
const path = require("path");
//configs and vars
const app = express();
dotenv.config();

//DB connection
mongoose.connect(process.env.DB_URL)
    .then(r => console.log('Database Connected'))
    .catch(err => console.log(err));


//middlewares
app.use(express.json());

//route middlewares
app.use('/api/v1/u', routes.authRoutes);
app.use('/api/v1/u', routes.userRoutes);
app.use('/api/v1/utils', routes.utilsRoutes);


app.listen(8080, () => {
    console.log("Server is running");
})