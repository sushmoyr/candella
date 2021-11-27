const Error = require('../../models/utils/error');
const Success = require('../../models/utils/success');
const Literature = require('../../models/data/literature');
const Journal = require('../../models/data/journal');
const Comic = require('../../models/data/comics');
const Photography = require('../../models/data/photography');
const MixedContents = require('../../models/data/mixedContents');
const {Divisions} = require('../../utils/Constants');
const {
    pagination, normalizePosts, validateLitData, validateJournal, excludeFields, validateComic, excludeFieldsFromMix,
    normalizeMix
} = require("../../utils/helpers");


/**
 * Creates a mew content object. Method: Post
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const create = async (req, res) => {
    const division = req.body.division.toLowerCase();

    if (!division)
        return res.status(404).json(new Error(404, 'Division not found. Add a division'));

    if (division === Divisions.literature) {
        await uploadLiterature(req.user.id, req.body)
            .then((result) => {
                console.log(result);
                res.status(result.code).json(result);
            }).catch(err => {
                console.log(err);
                res.status(err.code).json(err);
            });
    } else if (division === Divisions.journal) {
        await uploadJournal(req.user.id, req.body)
            .then((result) => {
                console.log(result);
                res.status(result.code).json(result);
            }).catch(err => {
                console.log(err);
                res.status(err.code).json(err);
            });
    } else if (division === Divisions.comic) {
        await uploadComic(req.user.id, req.body)
            .then((result) => {
                console.log(result);
                res.status(result.code).json(result);
            }).catch(err => {
                console.log(err);
                res.status(err.code).json(err);
            });
    } else if (division === Divisions.photography) {
        await uploadPhotographyPost(req.user.id, req.body)
            .then((result) => {
                console.log(result);
                res.status(result.code).json(result);
            }).catch(err => {
                console.log(err);
                res.status(err.code).json(err);
            });
    }

}

/**
 * Reads a mew content object by division and id. Method: GET
 * @param req
 * @param res
 * @returns {Promise<*>}
 */

const readByDiv = async (req, res) => {
    const division = req.params.division;
    let result;
    try {
        if (division === Divisions.literature) {
            result = await getLiteratures(req);
        } else if (division === Divisions.journal) {
            result = await getJournals(req);
        } else if (division === Divisions.comic) {
            result = await getComics(req);
        } else if (division === Divisions.photography) {
            result = await getPhotographyPosts(req);
        } else {
            return res.status(401).json(new Error(401, 'No or Invalid Division set'));
        }
        //console.log(result);
        if (result instanceof Error)
            return res.status(result.code).json(result);

        if (req.query['excludes']) {
            console.log('excludes = ' + req.query['excludes']);
            result = normalizePosts(req.query['excludes'], result);
        }
        res.status(200).json(result);
    } catch (e) {
        console.log(e);
        res.status(500).json(new Error(500, e));
    }
}

const readByDivId = async (req, res) => {
    const {division, id} = req.params;
    let result;
    try {
        if (division === Divisions.literature) {
            result = await getSingleLiterature(id);
        } else if (division === Divisions.journal) {
            result = await getSingleJournal(id);
        } else if (division === Divisions.comic) {
            result = await getSingleComic(id);
        } else if (division === Divisions.comic) {
            result = await getSinglePhotographyPost(id);
        } else {
            return res.status(401).json(new Error(401, 'No or Invalid Division set'));
        }

        if (result instanceof Error)
            return res.status(result.code).json(result);

        if (req.query['excludes']) {
            console.log('excludes = ' + req.query['excludes']);
            result = excludeFields(req.query['excludes'], result);
        }

        res.status(200).json(result);
    } catch (e) {
        console.log(e);
        res.status(500).json(new Error(500, e));
    }
}


/**
 * Literature Block for literature type
 * post's crud operations
 */

const uploadLiterature = async (id, post) => {
    const validate = validateLitData(post);

    if (validate instanceof Error)
        return validate;

    try {
        const literature = new Literature({author: id, ...post});
        const newLiterature = await literature.save();
        console.log(newLiterature);
        await mix(newLiterature);
        return new Success(201, "Created Successfully", newLiterature);
    } catch (err) {
        return new Error(500, `${err}`);
    }
}

const getLiteratures = async (req) => {
    const {skip, limit, sortBy, order} = pagination(req);
    try {
        return await Literature.find()
            .select('-__v')
            .skip(skip).limit(limit)
            .sort([[sortBy, order]])
            .populate([
                {
                    path: 'author',
                    select: "_id name email pen_name"
                }, {
                    path: 'genre',
                    select: "-_id -__v"
                }
            ]);
    } catch (e) {
        console.log('lit ' + e);
        return e;
    }
}

const getSingleLiterature = async (id) => {
    try {
        return await Literature.findById(id)
            .populate([
                {
                    path: 'author',
                    select: "_id name email pen_name"
                },
                {
                    path: 'genre',
                    select: "-_id -__v"
                },
                {
                    path: 'thoughts.by',
                    select: "_id name profileImage"
                },
                {
                    path: 'ratings.by',
                    select: "_id name profileImage"
                },
            ]);
    } catch (e) {
        return new Error(500, e);
    }
}


/**
 * Journal Block for journal type
 * post's crud operations
 */

const uploadJournal = async (id, data) => {
    const validate = validateJournal(data);

    if (validate instanceof Error)
        return validate;

    try {
        const journal = new Journal({author: id, ...data});
        const newJournal = await journal.save();
        console.log(newJournal);
        await mix(newJournal);
        return new Success(201, "Created Successfully", newJournal);
    } catch (err) {
        return new Error(500, `${err}`);
    }
};

const getJournals = async (req) => {
    const {skip, limit, sortBy, order} = pagination(req);
    try {
        return await Journal.find()
            .select('-__v')
            .skip(skip).limit(limit)
            .sort([[sortBy, order]])
            .populate([
                {
                    path: 'author',
                    select: '_id name email pen_name'
                },
                {
                    path: 'genre',
                    select: 'name'
                }
            ])
    } catch (e) {
        console.log('journal ' + e);
        return new Error(500, e);
    }


};

const getSingleJournal = async (id) => {
    try {
        return await Journal.findById(id)
            .populate([
                {
                    path: 'author',
                    select: "_id name email pen_name"
                },
                {
                    path: 'genre',
                    select: "-_id -__v"
                },
                {
                    path: 'thoughts.by',
                    select: "_id name profileImage"
                },
                {
                    path: 'ratings.by',
                    select: "_id name profileImage"
                },
            ]);
    } catch (e) {
        console.log(e);
        res.status(500)
            .json(new Error(500, e));
    }
};

/**
 * Comic Block for comic type
 * post's crud operations
 */

const uploadComic = async (id, post) => {
    const validate = validateComic(post);

    if (validate instanceof Error)
        return validate;

    try {
        const comic = new Comic({author: id, ...post});
        const newComic = await comic.save();
        console.log(newComic);
        await mix(newComic);
        return new Success(201, "Created Successfully", newComic);
    } catch (err) {
        return new Error(500, `${err}`);
    }
};

const getComics = async (req) => {
    const {skip, limit, sortBy, order} = pagination(req);
    try {
        return await Comic.find()
            .select('-__v')
            .skip(skip).limit(limit)
            .sort([[sortBy, order]])
            .populate([
                {
                    path: 'author',
                    select: '_id name email pen_name'
                },
                {
                    path: 'genre',
                    select: 'name'
                }
            ])
    } catch (e) {
        console.log('comic ' + e);
        return new Error(500, e);
    }

};

const getSingleComic = async (id) => {
    try {
        return await Comic.findById(id)
            .populate([
                {
                    path: 'author',
                    select: "_id name email pen_name"
                },
                {
                    path: 'genre',
                    select: "-_id -__v"
                },
                {
                    path: 'thoughts.by',
                    select: "_id name profileImage"
                },
                {
                    path: 'ratings.by',
                    select: "_id name profileImage"
                },
            ]);
    } catch (e) {
        console.log(e);
        res.status(500)
            .json(new Error(500, e));
    }
}

/**
 * Photography Block for photography type
 * post's crud operations
 */

const uploadPhotographyPost = async (id, post) => {
    try {
        const photography = new Photography({author: id, ...post});
        const newPhotography = await photography.save();
        console.log(newPhotography);
        await mix(newPhotography);
        return new Success(201, "Created Successfully", newPhotography);
    } catch (err) {
        return new Error(500, `${err}`);
    }
};

const getPhotographyPosts = async (req) => {
    const {skip, limit, sortBy, order} = pagination(req);
    try {
        return await Photography.find()
            .select('-__v')
            .skip(skip).limit(limit)
            .sort([[sortBy, order]])
            .populate([
                {
                    path: 'author',
                    select: '_id name email pen_name'
                },
                {
                    path: 'genre',
                    select: 'name'
                }
            ])
    } catch (e) {
        console.log('comic ' + e);
        return new Error(500, e);
    }

};

const getSinglePhotographyPost = async (id) => {
    try {
        return await Photography.findById(id)
            .populate([
                {
                    path: 'author',
                    select: "_id name email pen_name"
                },
                {
                    path: 'genre',
                    select: "-_id -__v"
                },
                {
                    path: 'thoughts.by',
                    select: "_id name profileImage"
                },
                {
                    path: 'ratings.by',
                    select: "_id name profileImage"
                },
            ]);
    } catch (e) {
        console.log(e);
        res.status(500)
            .json(new Error(500, e));
    }
}

/**
 * Mix Post Block for all types
 * post's crud operations
 */

const mix = async (post) => {
    const {_id, division} = post;
    await MixedContents.create({
        division: division,
        dataId: _id,
        data: _id
    });
};

const readMixById = async (req, res) => {
    const id = req.params.id;
    let result = await getSingleMix(id);
    console.log(result);
    if (result instanceof Error)
        return res.status(result.code).json(result);

    if (req.query['excludes']) {
        console.log('excludes = ' + req.query['excludes']);
        result = excludeFieldsFromMix(req.query['excludes'], result);
    }

    res.status(200).json(result);

}

const readMix = async (req, res) => {
    let result;
    result = await getMixed(req);

    if (result instanceof Error)
        return res.status(result.code).json(result);

    if (req.query['excludes']) {
        console.log('excludes = ' + req.query['excludes']);
        result = normalizeMix(req.query['excludes'], result);
    }

    res.status(200).json(result);
}

const getSingleMix = async (id, populate = true) => {
    try {
        return (populate) ?
            await MixedContents.findOne({dataId: id}).populate('data') :
            await MixedContents.findOne({dataId: id});
    } catch (e) {
        return new Error(500, e);
    }
}

const getMixed = async (req, dataIds = []) => {
    const {skip, limit, sortBy, order} = pagination(req);

    const filter = (dataIds.length > 0)
        ? {dataId: {$in: dataIds}}
        : {};

    try {
        return await MixedContents.find(filter)
            .select('-_id -__v')
            .skip(skip).limit(limit)
            .sort([[sortBy, order]])
            .populate({
                path: 'data',
                select: "-__v",
                populate: [{
                    path: 'author',
                    select: "_id name email pen_name"
                }, {
                    path: 'genre',
                    select: "-_id -__v"
                }
                ],
            });
    } catch (e) {
        console.log('remixed: ' + e);
        return e;
    }
}

//UPDATE single post by id

const updateMixById = async (req, res) => {
    const id = req.params.id;
    const mix = await getSingleMix(id, false);
    //console.log(mix);
    const {dataId, division} = mix;
    console.log(dataId);
    const result = await updateByDivId(division, dataId, req.body, req.user.id);
    if (result instanceof Error)
        return res.status(result.code).json(result);

    return res.status(201).json(result);
}

//UPDATE single post by division and id

const updateByDivIdReq = async (req, res) => {
    const div = req.params.division;
    const id = req.params.id;
    const result = await updateByDivId(div, id, req.body, req.user.id);

    if (result instanceof Error)
        return res.status(result.code).json(result);

    return res.status(201).json(result);
}

const updateByDivId = async (div, id, data, userId) => {
    console.log(div, id);
    const {division, thoughts, ratings, chapters, ...body} = data;
    let result;
    const filter = {
        _id: id,
        author: userId
    };

    try {
        if (div === Divisions.literature) {
            result = await Literature.findOneAndUpdate(filter, body, {new: true});
        } else if (div === Divisions.journal) {
            result = await Journal.findOneAndUpdate(filter, body, {new: true});
        } else if (div === Divisions.comic) {
            result = await Comic.findOneAndUpdate(filter, body, {new: true});
        } else if (div === Divisions.photography) {
            result = await Photography.findOneAndUpdate(filter, body, {new: true});
        } else {
            result = new Error(404, "Invalid division. Check division");
        }
    } catch (e) {
        console.log(e)
        result = new Error(500, e);
    }

    if (result === null) {
        result = new Error(401, "Couldn't find the post. May be this was not posted by the user.")
    }

    console.log("result = ", result);
    return result;
}

//DELETE POST by id
const deleteById = async (req, res) => {
    const id = req.params.id;
    const mix = await getSingleMix(id, false);
    const {division} = mix;
    const result = await deletePost(division, id, req.user.id);

    if (result instanceof Error)
        return res.status(result.code).json(result);

    return res.status(200).json(result);
}
//DELETE POST by division and id
const deleteByDivId = async (req, res) => {
    const {division, id} = req.params;
    const result = await deletePost(division, id, req.user.id);
    if (result instanceof Error)
        return res.status(result.code).json(result);

    return res.status(200).json(result);
}

const deletePost = async (div, id, userId) => {
    let result;
    const filter = {
        _id: id,
        author: userId
    }
    try {
        if (div === Divisions.literature) {
            result = await Literature.findOneAndDelete(filter);
        } else if (div === Divisions.journal) {
            result = await Journal.findOneAndDelete(filter);
        } else if (div === Divisions.comic) {
            result = await Comic.findOneAndDelete(filter);
        } else if (div === Divisions.photography) {
            result = await Photography.findOneAndDelete(filter);
        } else {
            result = new Error(404, "Invalid division. Check division");
        }

        if (result === null) {
            result = new Error(404, "Couldn't find the post. May be this was not posted by the user.");
        }

        if (!(result instanceof Error)) {
            result = new Success(200, "Post deleted", result);
            await deleteMixByDataId(id);
        }
    } catch (e) {
        result = new Error(500, e);
    }

    return result;
}

const deleteMixByDataId = async (id) => {
    await MixedContents.findOneAndDelete({dataId: id});
}


module.exports = {
    readDiv: readByDiv,
    readMix,
    create,
    getMixed,
    readByDivId,
    readMixById,
    uploadLiterature,
    uploadPhotographyPost,
    uploadJournal,
    uploadComic,
    getLiteratures,
    getComics,
    getJournals,
    getPhotographyPosts,
    getSinglePhotographyPost,
    getSingleJournal,
    getSingleComic,
    getSingleLiterature,
    getSingleMix,
    updateByDivIdReq,
    updateMixById,
    deleteByDivId,
    deleteById,
}