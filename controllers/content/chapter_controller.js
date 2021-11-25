const {getSingleMix} = require("./post_controller");
const {
    getModelFromDivision,
    sendErrorResponse,
    sendSuccessResponse,
    pagination,
    sortArrayByKey
} = require("../../utils/helpers");

//TODO: Check endpoint
const addChapter = async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;
    const {division, dataId} = await getSingleMix(postId, false);

    const filter = {
        _id: dataId,
        author: userId
    }
    const {name, content} = req.body;
    const chapter = {
        name: name,
        content: content
    }
    const model = getModelFromDivision(division);

    if (model === null)
        return sendErrorResponse(res, 404, "Division not found");

    await model.findOneAndUpdate(filter, {$push: {chapters: chapter}}, {new: true}).exec().then(data => {
        return sendSuccessResponse(res, data.chapters[data.chapters.length - 1], "Chapter Added");
    }).catch(err => {
        return sendErrorResponse(res, 404, `post not found. ${err}`);
    })
};


//TODO: Check endpoint

const getAllChapters = async (req, res) => {
    const postId = req.params.id;
    const {division, dataId} = await getSingleMix(postId, false);
    const {skip, limit, sortBy, order} = pagination(req);
    const filter = {
        _id: dataId,
    }

    const options = {
        chapters: {$slice: [skip, limit]}
    }

    const model = getModelFromDivision(division);

    if (model === null)
        return sendErrorResponse(res, 404, "Division not found");

    await model.findOne(filter)
        .exec()
        .then(data => {
            let result = sortArrayByKey(data.chapters, sortBy, order);
            result = exclude(result, req.query['excludes']);
            return sendSuccessResponse(res, result);
        }).catch(e => {
            return sendErrorResponse(res, 404, "Not found");
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


//TODO: Check endpoint

const getChapter = async (req, res) => {
    const {id, chapterId} = req.params;
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
            for (const chapter of data.chapters) {
                if (chapter._id === chapterId)
                    return sendSuccessResponse(res, chapter);
            }
            return sendErrorResponse(res, 404, "No chapter found of this ID");
        }).catch(e => {
            return sendErrorResponse(res, 404, "Not Found. " + e);
        });
};


//TODO: Check endpoint

const updateChapter = async (req, res) => {
    const {id, chapterId} = req.params;
    const {division, dataId} = await getSingleMix(id, false);
    const {name, content} = req.body;
    const filter = {
        _id: dataId,
        chapters: {
            $elemMatch: {
                _id: {
                    $eq: chapterId
                }
            }
        }
    }

    let update = {};

    if (name !== null)
        update['chapters.$.name'] = name;
    if (content !== null)
        update['chapters.$.content'] = content;


    const model = getModelFromDivision(division);

    if (model === null)
        return sendErrorResponse(res, 404, "Division not found");

    try {
        const data = await model.findOneAndUpdate(
            filter,
            {
                $set: update
            },
            {new: true}
        );
        sendSuccessResponse(res, data.chapters);
    } catch (e) {
        sendErrorResponse(res, 404, `Not Found ${e}`);
    }
};


//TODO: Check endpoint

const deleteChapter = async (req, res) => {
    const {id, chapterId} = req.params;
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
                    chapters: {
                        _id: chapterId
                    }
                }
            },
            {new: true}
        );
        sendSuccessResponse(res, data.chapters);
    } catch (e) {
        sendErrorResponse(res, 404, `Not Found ${e}`);
    }
};

module.exports = {
    addChapter,
    getAllChapters,
    getChapter,
    updateChapter,
    deleteChapter
}