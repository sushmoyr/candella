const {Patterns} = require("../helpers");
const {Reason} = require("../models");
const {Limits} = require("../helpers");
const {UserService} = require("../services");

exports.validateSignUpInfo = async (name, email, password) => {
    let errors = [];
    let isValid = true;

    if (!(name && Patterns.name.test(name))) {
        errors.push(new Reason('name', 'Invalid Name'))
        isValid = false;
    }

    if (!(email && Patterns.email.test(email))) {
        errors.push(new Reason('email', 'Email isn\'t supported'));
        isValid = false
    }

    const user = await UserService.findUser({email: email});

    if (user) {
        isValid = false;
        errors.push(new Reason('email', 'Email already Exists..!'));
    }

    const {validPass, err} = validatePassword(password);
    isValid = validPass;
    errors.push(...err);

    if (errors.length > 0)
        isValid = false;

    return {isValid, errors};

}

exports.validateLoginInfo = (email, password) => {
    let errors = [];
    let isValid = true;

    if (!(email && Patterns.email.test(email))) {
        errors.push(new Reason('email', 'Email isn\'t supported'));
        isValid = false
    }

    const {validPass, err} = validatePassword(password);
    isValid = validPass;
    errors.push(...err);

    return {isValid, errors};
}

const validatePassword = (password) => {
    const err = [];
    let validPass = true;
    if (password) {

        if (password.length < Limits.MIN_PASSWORD_LENGTH) {
            err.push(new Reason('password', `Password must be at least ${Limits.MIN_PASSWORD_LENGTH} characters. `));
        }
        if (password.length > Limits.MAX_PASSWORD_LENGTH) {
            err.push(new Reason('password', `Password must be at least ${Limits.MAX_PASSWORD_LENGTH} characters. `));
        }

        if (!Patterns.password.test(password)) {
            err.push(new Reason('password', 'Password must contain one alphabet and number'));
        }

        if (err.length > 0)
            validPass = false;

    } else {
        err.push(new Reason('password', 'password not set'));
        validPass = false;
    }

    return {err, validPass};
}