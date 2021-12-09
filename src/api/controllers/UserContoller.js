const {UserService} = require('../services');
const {UserValidator} = require("../validations");
const {User, Success, Error, DocumentSnapshot} = require("../models");
const {StatusCodes, FieldEditor, QueryHelper} = require("../helpers");


const updateUser = async (req, res) => {
    const id = req.user.id;
    const data = req.body;
    let result;

    const {isValid, errors} = UserValidator.validateUserData(data);

    if (isValid) {
        const snapshot = await UserService.updateById(id, data);

        if (snapshot.hasData) {
            result = new Success({
                code: snapshot.code,
                body: snapshot.data
            });
        } else if (snapshot.hasError) {
            result = new Error({
                code: snapshot.code,
                message: snapshot.error
            });
        }

    } else {
        result = new Error({
            code: StatusCodes.NOT_ACCEPTABLE,
            message: 'Validation Failed..!',
            reasons: errors
        });
    }

    return res.status(result.code).json(result.body);
};

const getCurrentUser = async (req, res) => {
    const id = req.user.id;

    const {code, result} = await getUser(id);

    return res.status(code).json(result)
};

const getUserById = async (req, res) => {
    const id = req.params.id;

    const {code, result} = await getUser(id);

    return res.status(code).json(result)
};

const getUser = async (id) => {
    const snapshot = await UserService.getById(id);

    let result;
    if (snapshot.hasData)
        result = snapshot.data;
    else if (snapshot.hasError) {
        result = new Error({
            code: snapshot.code,
            message: snapshot.error
        })
    }

    return {code: snapshot.code, result: result};
}

const getAllUsers = async (req, res) => {
    const include = QueryHelper.includes(req);
    const options = QueryHelper.pagination(req);

    console.log({include, options})


    const users = await UserService.getAll(null, include, options);
    return res.status(200).json(users.data);
};

const followUser = async (req, res) => {

};

const unfollowUser = async (req, res) => {

};

const savePost = async (req, res) => {

};

const getSavedPosts = async (req, res) => {

};

module.exports = {
    updateUser, getCurrentUser, getUserById, getAllUsers, followUser, unfollowUser, savePost, getSavedPosts
}