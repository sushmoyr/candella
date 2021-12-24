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
    const shouldPopulate = QueryHelper.shouldPopulate(req);

    const {code, result} = await getUser(id, shouldPopulate);

    return res.status(code).json(result)
};

const getUserById = async (req, res) => {
    const id = req.params.id;
    const shouldPopulate = QueryHelper.shouldPopulate(req);

    const {code, result} = await getUser(id, shouldPopulate);

    return res.status(code).json(result)
};

const getUser = async (id, shouldPopulate) => {
    const snapshot = await UserService.getById(id, shouldPopulate);

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
    const by = req.user.id;
    const to = req.params.id;

    const snapshot = await UserService.followUser(by, to);

    console.log('follow ', snapshot);

    let response;
    if (snapshot.hasData) {
        response = new Success({
            code: snapshot.code,
            message: "Successfully Followed."
        });
    } else {
        response = new Error({
            code: snapshot.code,
            message: snapshot.error
        });
    }

    res.status(response.code).json(response)
};

const unfollowUser = async (req, res) => {
    const by = req.user.id;
    const to = req.params.id;

    const snapshot = await UserService.unfollowUser(by, to);

    let response;
    if (snapshot.hasData) {
        response = new Success({
            code: snapshot.code,
            message: "Successfully Unfollowed."
        });
    } else {
        response = new Error({
            code: snapshot.code,
            message: snapshot.error
        });
    }

    res.status(response.code).json(response)
};

const savePost = async (req, res) => {
    const snapshot = await UserService.saveContent(req.user.id, req.params.id);

    res.status(snapshot.code).json(snapshot)
};

const getSavedPosts = async (req, res) => {
    const snapshot = await UserService.getSavedPosts(req.user.id);

    let response;
    if (snapshot.hasData) {
        response = snapshot.data
    } else {
        response = new Error({
            code: snapshot.code,
            message: snapshot.error
        });
    }

    res.status(snapshot.code).json(response);
};


module.exports = {
    updateUser, getCurrentUser, getUserById, getAllUsers, followUser, unfollowUser, savePost, getSavedPosts
}