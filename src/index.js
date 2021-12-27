//Global module imports
const express = require('express');
const bodyParser = require('body-parser')
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookie_parser = require('cookie-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');
//Local Module's Imports
const Routes = require('./api/routes/index');
const {StatusCodes} = require("./api/helpers/Constants");
const initWeb = require('./www/config');
const path = require("path");
//configs
const app = express();
dotenv.config();

const corsOptions = {
    origin: '*'
}
app.use(morgan('dev', {}));
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'res')));
global.__baseDir = path.join(__dirname, 'res');
app.use(fileUpload({}));

Routes.buildRoutes(app);

initWeb(app);

//DB connection
mongoose.connect(process.env.DB_URL)
    .then(r => console.log('Database Connected'))
    .catch(err => console.log(err));


app.listen(process.env.PORT, () => {
    console.log("Server is running at ", Date());
})