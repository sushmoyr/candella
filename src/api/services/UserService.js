const {User, Success, Error, DocumentSnapshot} = require("../models");
const {StatusCodes} = require("../helpers");

const createUser = async (name, email, password) => {
    return User.create({
        name: name,
        email: email,
        password: password
    })
}

const updateById = async (id, data) => {
    let snapshot;
    try {
        const user = await User.findByIdAndUpdate(id, {
            $set: data
        }, {
            new: true
        });

        const {_doc} = user;
        const {password, ...other} = _doc;
        snapshot = new DocumentSnapshot({
            code: StatusCodes.OK,
            data: other
        })

        console.log(snapshot);
        /*Success({
            code: StatusCodes.CREATED,
            message: "Successfully updated user info.",
            body: other
        });*/

    } catch (e) {
        snapshot = new DocumentSnapshot({
            code: StatusCodes.BAD_REQUEST,
            error: e
        });
        /*Error({
            message: "There was an Error. " + e
        })*/
    }

    if (snapshot === null) {
        snapshot = new DocumentSnapshot({
            code: StatusCodes.NOT_FOUND,
            error: "Data Not Found"
        });
    }

    return snapshot;
}

const getById = async (id) => {
    const filter = {_id: id};

    try {
        const user = await findUser(filter, '-password -__v');
        return (user) ?
            new DocumentSnapshot({
                code: StatusCodes.OK,
                data: user,
            }) :
            new DocumentSnapshot({
                code: StatusCodes.NOT_FOUND,
                error: 'User Not found',
            });
    } catch (e) {
        return new DocumentSnapshot({
            error: e
        });
    }
}

const getAll = async (filter = null, select = null, option = null) => {
    try {
        const users = await User.find(filter, select, option);
        return new DocumentSnapshot({
            code: StatusCodes.OK,
            data: users
        });
    } catch (e) {
        return new DocumentSnapshot({
            error: e,
            code: StatusCodes.BAD_REQUEST
        })
    }
}

const findUser = async (filter, select) => {
    const user = await User.findOne(filter, select);
    console.log(user);
    return user;
}

module.exports = {
    findUser,
    createUser,
    updateById,
    getById,
    getAll
}