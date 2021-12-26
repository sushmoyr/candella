const {Error, User, Success} = require("../models");
const {StatusCodes, hashPassword, ErrorTemplates} = require("../helpers");
const {UserValidator} = require("../validations");
const {UserService} = require('../services');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const register = async (req, res) => {
    const {name, email, password} = req.body;
    const {isValid, errors} = await UserValidator.validateSignUpInfo(name, email, password);

    if (!isValid) {
        const error = new Error({
            code: StatusCodes.NOT_ACCEPTABLE,
            message: 'Validation Failed..!',
            reasons: errors
        });

        return res.status(StatusCodes.NOT_ACCEPTABLE).json(error);
    }

    const hashedPassword = await hashPassword(password);

    await UserService.createUser(name, email, hashedPassword)
        .then(data => {
            const {name, email} = data;
            res.status(StatusCodes.CREATED)
                .json(new Success({
                    code: StatusCodes.CREATED,
                    message: 'Account Created Successfully',
                    body: {name, email}
                }))
        }).catch(err => {
            console.log(err)
            const error = Error.default();
            res.status(error.code).json(error);
        });
}


const login = async (req, res) => {
    const {email, password} = req.body
    const {isValid, errors} = UserValidator.validateLoginInfo(email, password);
    console.log({isValid, errors})
    if (!isValid) {
        const error = new Error({
            code: StatusCodes.NOT_ACCEPTABLE,
            message: 'Validation Failed..!',
            reasons: errors
        });

        return res.status(StatusCodes.NOT_ACCEPTABLE).json(error);
    }

    const user = await UserService.findUser({email: email});

    if (!user) {
        const error = new Error({
            code: StatusCodes.NOT_FOUND,
            message: 'Email doesn\'t exists'
        });

        return res.status(StatusCodes.NOT_FOUND).json(error);
    }

    const validPass = await bcrypt.compare(password, user.password);

    if (validPass) {
        //create and assign token
        const token = jwt.sign({id: user._id}, process.env.JWT_KEY, {expiresIn: '1d'});

        return res.header('token', token)
            .status(StatusCodes.OK)
            .json(new Success({
                code: StatusCodes.OK,
                message: "Logged in successfully",
                body: token
            }));
    }

    return res.status(StatusCodes.UNAUTHORIZED)
        .json(new Error({
            code: StatusCodes.UNAUTHORIZED,
            message: 'Password didn\'t match',
        }));
}


const reset = async (req, res) => {
    //TODO Implement
    res.status(StatusCodes.NOT_IMPLEMENTED)
        .json(ErrorTemplates.notImplemented());
}

module.exports = {
    login, register, reset
}