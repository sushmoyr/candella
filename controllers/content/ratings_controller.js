const {getSingleMix} = require("./post_controller");
const {
    getModelFromDivision,
    sendSuccessResponse,
    sendErrorResponse,
    pagination,
    sortArrayByKey,
    excludeFields
} = require("../../utils/helpers");

const addRating = async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;
    const {division, dataId} = await getSingleMix(postId, false);
    console.log({division, dataId})
    const filter = {
        _id: dataId,
    }
    const rating = {
        by: userId,
        value: req.body.value
    }
    const model = getModelFromDivision(division);

    if (model === null)
        return sendErrorResponse(res, 404, "Division not found");

    await model.findOneAndUpdate(filter, {$push: {ratings: rating}}, {new: true}).exec().then(data => {
        console.log(data);
        return sendSuccessResponse(res, data.ratings[data.ratings.length - 1], "Rating Added");
    }).catch(err => {
        return sendErrorResponse(res, 404, `post not found. ${err}`);
    })


};

const getRatings = async (req, res) => {
    const postId = req.params.id;
    const {division, dataId} = await getSingleMix(postId, false);
    const filter = {
        _id: dataId,
    };
    const {skip, limit, sortBy, order} = pagination(req);
    const options = {
        ratings: {$slice: [skip, limit]}
    }

    const model = getModelFromDivision(division);

    if (model === null)
        return sendErrorResponse(res, 404, "Division not found");

    await model.findOne(filter, options)
        .exec().then(data => {
            const {ratings} = data._doc;
            let result = sortArrayByKey(ratings, sortBy, order);
            result = exclude(result, req.query['excludes']);
            return sendSuccessResponse(res, result);
        }).catch(e => {
            return sendErrorResponse(res, 404, `Error. ${e}`);
        })
};

const exclude = (data, excludes) => {
    if (excludes) {
        const fields = excludes.split('_');
        const newData = [];
        for (const d of data) {
            const keys = Object.keys(d['_doc']);
            const obj = {};
            for (const key of keys) {
                if (!fields.includes(key)) {
                    obj[key] = d[key];
                }
            }
            newData.push(obj);
        }
        return newData;
    } else {
        return data;
    }

}


const updateRating = async (req, res) => {
    const {id, ratingId} = req.params;
    const {division, dataId} = await getSingleMix(id, false);
    const filter = {
        _id: dataId,
        ratings: {
            $elemMatch: {
                _id: {
                    $eq: ratingId
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
                $set: {'ratings.$.value': req.body.value}
            },
            {new: true}
        );
        sendSuccessResponse(res, data.ratings);
    } catch (e) {
        sendErrorResponse(res, 404, `Error ${e}`);
    }
};

const deleteRating = async (req, res) => {
    const {id, ratingId} = req.params;
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
                    ratings: {
                        _id: ratingId
                    }
                }
            },
            {new: true}
        );
        sendSuccessResponse(res, data.ratings);
    } catch (e) {
        sendErrorResponse(res, 404, `Error ${e}`);
    }
};

module.exports = {
    addRating,
    getRatings,
    updateRating,
    deleteRating
}