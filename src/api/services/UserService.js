const {Success, Error, DocumentSnapshot} = require("../models");
const User = require('../models/User');
const {StatusCodes, Notification_Types} = require("../helpers");
const {dispatchNotification} = require("./NotificationService");


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

const getById = async (id, shouldPopulate) => {
    const filter = {_id: id};

    try {
        const user = await findUser(filter, '-password -__v', 1);
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
        const users = await User.find(filter, select, option)
            .sort([[option.sortBy, option.order]]);
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

const followUser = async (by, to) => {
    let snapshot, self, other;

    await Promise.all([
        addToSet(by, {following: to}),
        addToSet(to, {followers: by}),
    ]).then(data => {
        self = data[0];
        other = data[1];

        if (self.hasData && other.hasData) {

            snapshot = new DocumentSnapshot({
                code: StatusCodes.OK,
                data: {
                    followedBy: by,
                    followed: to
                }
            });
        } else {
            let err = '';
            if (self.hasError)
                err += self.error
            if (other.hasError)
                err += other.error

            const error = new DocumentSnapshot({
                code: StatusCodes.BAD_REQUEST,
                error: err
            })

            console.log({error});
            snapshot = error;
        }
    });
    notifyFollower(self.data, other.data).then(r => {
    });

    return snapshot;
}

const unfollowUser = async (by, to) => {
    await Promise.all([
        removeFromSet(by, {following: to}),
        removeFromSet(to, {followers: by}),
    ])
}

const addToSet = async (id, update) => {
    try {
        const updated = await User.findByIdAndUpdate(
            id,
            {
                $addToSet: update
            },
            {new: true});

        if (updated)
            return new DocumentSnapshot({
                code: StatusCodes.OK,
                data: updated
            });
        else {
            return new DocumentSnapshot({
                code: StatusCodes.BAD_REQUEST,
                error: "An error has occurred"
            });
        }
    } catch (e) {

        return new DocumentSnapshot({
            code: StatusCodes.BAD_REQUEST,
            error: e
        });
    }
}

const removeFromSet = async (id, update) => {
    try {
        const removed = await User.findByIdAndUpdate(
            id,
            {
                $pull: update
            },
            {new: true}
        );

        console.log({removed})

        if (removed)
            return new DocumentSnapshot({
                code: StatusCodes.OK,
                data: removed
            });
        else {
            return new DocumentSnapshot({
                code: StatusCodes.BAD_REQUEST,
                error: "An error has occurred"
            });
        }
    } catch (e) {
        console.log('error unfollow ', e);

        return new DocumentSnapshot({
            code: StatusCodes.BAD_REQUEST,
            error: e
        });
    }
}

const findUser = async (filter, select, shouldPopulate) => {

    let populateOption = '';
    if (shouldPopulate) {
        populateOption = [
            {
                path: 'following',
                select: '_id name profileImage pen_name'
            },
            {
                path: 'followers',
                select: '_id name profileImage pen_name'
            }
        ]
    }

    return User.findOne(filter, select);
}

const saveContent = async (id, contentId) => {
    try {
        const added = await addToSet(id, {savedPosts: contentId});
        if (added) {
            return new Success({
                code: StatusCodes.OK,
                message: "Successfully Saved..!",
                body: added
            })
        } else {
            return new Error({
                code: StatusCodes.BAD_REQUEST,
                message: "There was an error"
            });
        }
    } catch (e) {
        return new Error({
            code: StatusCodes.BAD_REQUEST,
            message: "There was an error. " + e
        });
    }
}

const getSavedPosts = async (id, select = null, option, shouldPopulate = true) => {
    let populateOption = '';
    if (shouldPopulate) {
        populateOption = [
            {
                path: 'savedPosts',
            }
        ]
    }

    try {
        //TODO: Saved Post selection option and pagination
        const data = await findUser({_id: id}, "savedPosts.").populate(populateOption);
        return new DocumentSnapshot({
            code: 200,
            data: data['savedPosts']
        })
    } catch (e) {
        return new DocumentSnapshot({
            code: StatusCodes.BAD_REQUEST,
            error: e
        });
    }
}

const notifyFollower = async (by, to) => {
    await dispatchNotification({
        owner: to._id,
        message: `${by.name} has started following you.`,
        type: Notification_Types.FOLLOWED_BY,
        action: {
            followerId: by._id
        }
    })
    console.log('Notified')
}

module.exports = {
    findUser,
    createUser,
    updateById,
    getById,
    getAll,
    followUser,
    unfollowUser,
    saveContent,
    getSavedPosts
}