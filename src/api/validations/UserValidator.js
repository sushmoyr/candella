

const {Patterns, Genders} = require("../helpers");
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

exports.validateUserData = (data) => {
    let isValid = true;
    const errors = [];

    if (data.name && !Patterns.name.test(data.name)) {
        errors.push(new Reason('name', 'Invalid Name'));
        isValid = false;
    }

    if (data.email && !Patterns.email.test(data.email)) {
        errors.push(new Reason('email', 'Email isn\'t supported'));
        isValid = false
    }

    if (data.bio && data.bio.length > Limits.MAX_BIO_LENGTH) {
        isValid = false;
        errors.push(new Reason('bio', `Bio must be within ${Limits.MAX_BIO_LENGTH} characters.`));
    }

    if (data.gender && !Object.values(Genders).includes(data.gender)) {
        errors.push(new Reason('gender', 'Gender isn\'t supported'));
        isValid = false
    }

    return {isValid, errors};
}

exports.validateAuthInfo = info => {
    const {email, oldPassword, newPassword} = info;
    let isValid = false;
    const errors = [];

    const {err, validPass} = validatePassword(newPassword);
    if (validPass){
        isValid = true;
        if (email && !Patterns.email.test(email)) {
            errors.push(new Reason('email', 'Email isn\'t supported'));
            isValid = false
        }
    } else {
        errors.push(...err);
    }

    return {isValid, errors};
}

exports.isValidEmail = email => {
    return Patterns.email.test(email);
}

exports.isValidPassword = password => {
    return validatePassword(password);
}