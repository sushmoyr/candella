const User = require('../../models/data/user');
const Error = require('../../models/utils/error');
const Success = require('../../models/utils/success');
const {pagination} = require("../../utils/helpers");
const {getMixed} = require("../content/post_controller");
const {normalizeMix} = require("../../utils/helpers");

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
        const user = await getUser(req.user.id, (req.query['populate'] === '1'));
        res.status(200).json(user);
    } catch (e) {
        res.status(500)
            .json(new Error(500, `Error: ${e}`));
    }
}

//get user data from id
exports.getUserById = async (req, res) => {
    try {
        const user = await getUser(req.params.id);
        res.status(200).json(user);
    } catch (e) {
        res.status(500)
            .json(new Error(500, `Error: ${e}`));
    }
}

const getUser = async (id, populate = false) => {
    try {
        const population = (populate)
            ? [
                {
                    path: 'following',
                    select: '_id name profileImage'
                },
                {
                    path: 'followers',
                    select: '_id name profileImage'
                }
            ]
            : []
        return await User.findById(id).select('-password').populate(population);
    } catch (e) {
        throw e;
    }
}

//get list of users
exports.getAllUsers = async (req, res) => {
    //pagination
    const {skip, limit, sortBy, order} = pagination(req);

    try {
        const data = await User.find().select('-password').skip(skip).limit(limit).sort([[sortBy, order]]);
        res.status(200).json(data);
    } catch (e) {
        res.status(500)
            .json(new Error(500, "There was an error"));
    }
}

//Follow user
exports.followUser = async (req, res) => {
    try {
        if (req.user.id === req.params.id) {
            return res.status(401).json(new Error(401, "You can't follow yourself"));
        }

        const self = await getUser(req.user.id);
        const other = await getUser(req.params.id);

        if (!other.followers)
            other.followers = [];

        if (!self.follwers)
            self.follwers = [];


        if (other.followers && other.followers.includes(self._id)) {
            return res.status(401).json(new Error(401, "You are already following this user!!!"));
        }

        if (self.following && self.following.includes(self._id)) {
            return res.status(401).json(new Error(401, "You are already following this user!!!"));
        }


        other.followers.push(self._id);
        self.following.push(other._id);

        await Promise.all([
            other.save().then(data => {
                console.log(JSON.stringify(data, null, 4))
            }),
            self.save().then(data => {
                console.log(JSON.stringify(data, null, 4))
            })
        ]);

        return res.status(201).json(new Success(201, "Successfully Followed"));
    } catch (e) {
        return res.status(500).json(new Error(500, `Error: ${e}`));
    }
}

//Unfollow user
exports.unfollowUser = async (req, res) => {
    try {
        if (req.user.id === req.params.id) {
            return res.status(401).json(new Error(401, "You can't unfollow yourself"));
        }

        let self = await getUser(req.user.id);
        let other = await getUser(req.params.id);

        if (!other.followers.includes(self._id)) {
            return res.status(401).json(new Error(401, "You are not following this user!!!"));
        }

        other.followers.pull({_id: self._id});
        self.following.pull({_id: other._id});

        await Promise.all([
            other.save(),
            self.save()
        ]);

        return res.status(201).json(new Success(201, "Successfully Unfollowed"));

    } catch (e) {
        return res.status(500).json(new Error(500, `Error: ${e}`));
    }
}

//save/bookmark
exports.savePost = async (req, res) => {
    try {
        await User.findByIdAndUpdate(
            req.user.id,
            {
                $addToSet: {
                    savedPosts: req.params.id
                }
            },
            {new: true}
        ).exec().then(data => {
            return res.status(200).json(new Success(200, "Post saved successfully.", data.savedPosts));
        }).catch(e => {
            return res.status(500).json(new Error(500, `Error: ${e}`));
        })
    } catch (e) {
        console.log(e)
    }
}

exports.getSavedPosts = async (req, res) => {
    try {
        const {savedPosts} = await User.findById(req.user.id);
        let result = await getMixed(req, savedPosts);

        if (result instanceof Error)
            return res.status(result.code).json(result);

        if (req.query['excludes']) {
            console.log('excludes = ' + req.query['excludes']);
            result = normalizeMix(req.query['excludes'], result);
        }

        res.status(200).json(result);
    } catch (e) {
        return res.status(500).json(new Error(500, `Error: ${e}`));
    }
}