const {User} = require("../models");

exports.createUser = async (name, email, password) => {
    return User.create({
        name: name,
        email: email,
        password: password
    })
}

exports.findUser = async (filter) => {
    const user = await User.findOne(filter);
    console.log(user);
    return user;
}