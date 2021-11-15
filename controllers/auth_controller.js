const User = require('../models/data/user');
const Error = require('../models/utils/error');
const Success = require('../models/utils/success');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {blockToken} = require("../utils/token_manager");


exports.register = async (req, res) => {
    //TODO: validate data
    let {name, email, password} = req.body;
    if (name && email && password){
        password = await hashPassword(password);
        await User.create({
            name: name,
            email: email,
            password: password
        }).then((data) => {
            res.status(201).json(new Success(201, 'Account Created Successfully'));
        })
            .catch(err => {
                const kp = err["keyPattern"];
                if (kp && kp['email'] === 1)
                    res.status(404).json(new Error(404, "Email already exists!!"));
                else
                    res.status(500).json(new Error(500, "There was an error"));
            })
    }
    else {
        let message = "Field(s) ";
        if(!name)
            message+='name, ';
        if(!email)
            message+='email, ';
        if(!password)
            message+='password, ';
        message+='is missing';

        res.status(404).json(new Error(404, message));
    }


};
exports.login = async (req, res) => {

    const password = req.body.password;
    //checking if email exists
    const user = await User.findOne({email: req.body.email});
    if (!user) {
        return res.status(400).json({code: 400, message: "email not found"});
    }
    const validPass = await bcrypt.compare(password, user.password);
    if (validPass) {

        //create and assign token
        const token = jwt.sign({id: user._id}, process.env.JWT_KEY, {expiresIn: 60});

        return res.header('auth-token', token)
            .status(200).json(new Success(200, "Logged In Successfully", token));
    }
    return res.status(400).json({code: 400, message: "password didn't match"});
}

exports.logout = (req, res) => {
    blockToken(req.headers.token);
    res.status(200).send("Logged out...!");
}

exports.loginUser = async (email, password) => {
    //checking if email exists
    const user = await User.findOne({email: email});
    if (!user) {
        //callback(new Error(404, "email not found"));
        return new Error(404, "email not found");
    }
    const validPass = await bcrypt.compare(password, user.password);
    if (validPass) {

        //create and assign token
        const token = jwt.sign({id: user._id}, process.env.JWT_KEY, {expiresIn: 60});
        //callback();
        return new Success(200, "Logged In Successfully", token)
    }
    //callback(new Error(400,"password didn't match"));
    return new Error(400,"password didn't match");
}

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}
exports.hashPassword = hashPassword;


