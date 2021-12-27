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
        const token = jwt.sign({id: user._id}, process.env.JWT_KEY, {expiresIn: '30d'});

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

const updateAuthInfo = async (req, res) => {
    const info = req.body;
    const id = req.user.id;

    const {email, password, newPassword} = info;

    let updateData = {};

    try{
        //find the user by id
        const user = await User.findById(id);
        const shouldUpdate = await bcrypt.compare(password, user.password);
        if (!shouldUpdate)
            return res.status(StatusCodes.UNAUTHORIZED).send(new Error({
                code: StatusCodes.UNAUTHORIZED,
                message: 'Invalid Password'
            }));
        //validate and add new email to update data if it is sent
        if (email){
            const isValidEmail = UserValidator.isValidEmail(email);
            if (isValidEmail)
                updateData['email'] = email;
            else {
                return res.status(StatusCodes.NOT_ACCEPTABLE).json(new Error({
                    code: StatusCodes.NOT_ACCEPTABLE,
                    message: 'Invalid Email Format'
                }))
            }
        }

        //check if password change is requested
        if (newPassword){
            const {err, validPass} = UserValidator.isValidPassword(newPassword);
            if (!validPass)
                return res.status(StatusCodes.NOT_ACCEPTABLE).json(new Error({
                    code: StatusCodes.NOT_ACCEPTABLE,
                    message: "Invalid Password",
                    reasons: err,
                }))
            updateData['password'] = await hashPassword(newPassword);
        }
        //update user and return result
        const snapshot = await UserService.updateById(id, updateData);

        if (snapshot.hasError){
            return res.status(snapshot.code).json(new Error({
                code: snapshot.code,
                message: snapshot.message
            }))
        }

        return res.status(StatusCodes.ACCEPTED).json(new Success({
            code: StatusCodes.ACCEPTED,
            message: 'Successfully Updated Login Info',
            body: snapshot.data
        }));

    } catch (e) {
        return new Error({
            code: StatusCodes.BAD_REQUEST,
            message: `Error: ${e}`
        });
    }

}

const reset = async (req, res) => {
    //TODO Implement
    res.status(StatusCodes.NOT_IMPLEMENTED)
        .json(ErrorTemplates.notImplemented());
}

module.exports = {
    login, register, reset, updateAuthInfo
}