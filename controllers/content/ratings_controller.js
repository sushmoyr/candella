const {getSingleMix} = require("./post_controller");
const Literature = require('../../models/data/literature');
const Success = require('../../models/utils/success');
const Error = require('../../models/utils/error');
const {getModelFromDivision, sendSuccessResponse, sendErrorResponse} = require("../../utils/helpers");

const addRating = async (req, res) => {
    /*TODO: to be implemented */
    const postId = req.params.id;
    const userId = req.user.id;
    const {division, dataId} = await getSingleMix(postId, false);
    const filter = {
        _id: dataId,
        author: userId
    }
    const rating = {
        by: userId,
        value: req.body.value
    }
    const model = getModelFromDivision(division);

    if (model === null)
        return sendErrorResponse(res, 404, "Division not found");

    await model.findOneAndUpdate(filter, {$push: {ratings: rating}}, {new: true}).exec().then(data => {
        return sendSuccessResponse(res, data.ratings[data.ratings.length - 1], "Rating Added");
    }).catch(err => {
        return sendErrorResponse(res, 404, `post not found. ${err}`);
    })


};
const getRatings = async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;
    const {division, dataId} = await getSingleMix(postId, false);
    const filter = {
        _id: dataId,
    }

    const model = getModelFromDivision(division);

    if (model === null)
        return sendErrorResponse(res, 404, "Division not found");

    await model.findOne(filter).exec().then(data => {
        return sendSuccessResponse(res, data.ratings);
    }).catch(e => {
        return sendErrorResponse(res, 404, "Not found");
    })
};
const updateRating = async (req, res) => {/*TODO: to be implemented */
};
const deleteRating = async (req, res) => {/*TODO: to be implemented */
};

module.exports = {
    addRating,
    getRatings,
    updateRating,
    deleteRating
}