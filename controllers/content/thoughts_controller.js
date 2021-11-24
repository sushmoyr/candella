const {getSingleMix} = require("./post_controller");
const {
    getModelFromDivision,
    sendErrorResponse,
    sendSuccessResponse,
    pagination,
    sortArrayByKey
} = require("../../utils/helpers");

//TODO: Check endpoint
const addThought = async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;
    const {division, dataId} = await getSingleMix(postId, false);
    const filter = {
        _id: dataId,
        author: userId
    }
    const thoughts = {
        by: userId,
        value: req.body.value
    }
    const model = getModelFromDivision(division);

    if (model === null)
        return sendErrorResponse(res, 404, "Division not found");

    await model.findOneAndUpdate(filter, {$push: {thoughts: thoughts}}, {new: true}).exec().then(data => {
        return sendSuccessResponse(res, data.thoughts[data.thoughts.length - 1], "Rating Added");
    }).catch(err => {
        return sendErrorResponse(res, 404, `post not found. ${err}`);
    })
};


//TODO: Check endpoint

const getAllThought = async (req, res) => {
    const postId = req.params.id;
    const {division, dataId} = await getSingleMix(postId, false);
    const {skip, limit, sortBy, order} = pagination(req);
    const filter = {
        _id: dataId,
    }

    const options = {
        thoughts: {$slice: [skip, limit]}
    }

    const model = getModelFromDivision(division);

    if (model === null)
        return sendErrorResponse(res, 404, "Division not found");

    await model.findOne(filter)
        .exec().then(data => {
            const result = sortArrayByKey(data.thoughts, sortBy, order);
            return sendSuccessResponse(res, result);
        }).catch(e => {
            return sendErrorResponse(res, 404, "Not found");
        })
};

//TODO: Check endpoint

const getThought = async (req, res) => {
    const {id, thoughtId} = req.params;
    const {division, dataId} = await getSingleMix(id, false);

    const filter = {
        _id: dataId
    }

    const model = getModelFromDivision(division);

    if (model === null)
        return sendErrorResponse(res, 404, "Division Not Found");

    await model.findOne(filter)
        .exec()
        .then(data => {
            for (const thought of data.thoughts) {
                if (thought._id === thoughtId)
                    return sendSuccessResponse(res, thought);
            }
            return sendErrorResponse(res, 404, "No thought found of this ID");
        }).catch(e => {
            return sendErrorResponse(res, 404, "Not Found. " + e);
        });

};


//TODO: Check endpoint

const updateThought = async (req, res) => {
    const {id, thoughtId} = req.params;
    const {division, dataId} = await getSingleMix(id, false);
    const filter = {
        _id: dataId,
        thoughts: {
            $elemMatch: {
                _id: {
                    $eq: thoughtId
                }
            }
        }
    }

    const model = getModelFromDivision(division);

    if (model === null)
        return sendErrorResponse(res, 404, "Division not found");

    try {
        const data = await model.findOneAndUpdate(
            filter,
            {
                $set: {'thoughts.$.value': req.body.value}
            },
            {new: true}
        );
        sendSuccessResponse(res, data.thoughts);
    } catch (e) {
        sendErrorResponse(res, 404, `Not Found ${e}`);
    }
};


//TODO: Check endpoint

const deleteThought = async (req, res) => {
    const {id, thoughtId} = req.params;
    const {division, dataId} = await getSingleMix(id, false);
    const filter = {
        _id: dataId,
    }

    const model = getModelFromDivision(division);

    if (model === null)
        return sendErrorResponse(res, 404, "Division not found");

    try {
        const data = await model.findOneAndUpdate(
            filter,
            {
                $pull: {
                    thoughts: {
                        _id: thoughtId
                    }
                }
            },
            {new: true}
        );
        sendSuccessResponse(res, data.thoughts);
    } catch (e) {
        sendErrorResponse(res, 404, `Error ${e}`);
    }
};

module.exports = {
    addThought,
    getAllThought,
    getThought,
    updateThought,
    deleteThought
}