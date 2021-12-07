//Global module imports
const express = require('express');
const bodyParser = require('body-parser')
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookie_parser = require('cookie-parser');
const cors = require('cors');
//Local Module's Imports
const Routes = require('./api/routes/index');
const {StatusCodes} = require("./api/helpers/Constants");
//configs
const app = express();
dotenv.config();

const corsOptions = {
    origin: "https://localhost:8080"
}
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

Routes.buildRoutes(app)


//DB connection
mongoose.connect(process.env.DB_URL)
    .then(r => console.log('Database Connected'))
    .catch(err => console.log(err));


app.listen(process.env.PORT, () => {
    console.log("Server is running at ", Date());
})