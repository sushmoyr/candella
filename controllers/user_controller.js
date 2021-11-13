const User = require('../models/data/user');
const Error = require('../models/utils/error');

//update user data
exports.updateUser = async (req, res) => {
    await User.findByIdAndUpdate(req.user.id, {
        $set: req.body
    }, {new: true}).then(user => {
        const {_doc} = user;
        const {password, ...other} = _doc;
        res.status(200).json(other);
    }).catch(e => {
        res.status(500)
            .json(new Error(500, "There was an error"));
    });
}

//get user data from token
exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const {_doc} = user;
        const {password, ...other} = _doc;
        res.status(200).json(other);
    } catch (e) {
        res.status(500)
            .json(new Error(500, "There was an error"));
    }
}

//get user data from id
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const {_doc} = user;
        const {password, ...other} = _doc;
        res.status(200).json(other);
    } catch (e) {
        res.status(500)
            .json(new Error(500, "There was an error"));
    }
}

//get list of users
exports.getAllUsers = async (req, res) => {
    const pageNo = (req.query['page']) ? req.query['page'] : 1;
    const sortBy = (req.query['sort_by']) ? req.query['sort_by'] : 'createdAt';
    const order = (req.query['order']) ? req.query['order'] : 'asc';

    //pagination
    const {skip, limit} = sortPage(pageNo);

    try {
        const data = await User.find().select('-password').skip(skip).limit(limit).sort([[sortBy, order]]);
        res.status(200).json(data);
    } catch (e){
        res.status(500)
            .json(new Error(500, "There was an error"));
    }
}

const sortPage = pageNo => {
    const limit = process.env.page_limit * 1;
    const skip = (pageNo - 1) * limit;
    return {skip, limit};
}