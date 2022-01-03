const jwt = require('jsonwebtoken');
const {Error} = require("../models");
const {StatusCodes} = require("../helpers");

const verifyToken = async (req, res, next) => {
    const token = req.headers['token'];

    if (token) {
        jwt.verify(token, process.env.JWT_KEY, {}, (err, user) => {
            if (err) {
                console.log('invalid token');
                return res.status(StatusCodes.UNAUTHORIZED).json(new Error({
                    code: StatusCodes.UNAUTHORIZED,
                    message: "Invalid token. Login to get a new token"
                }));
            }
            //console.log("user is ", user);
            req.user = user;
            next();
        });

    } else {
        return res.status(StatusCodes.UNAUTHORIZED).json(new Error({
            code: StatusCodes.UNAUTHORIZED,
            message: "Not Authenticated..!"
        }));
    }
}

module.exports = verifyToken;