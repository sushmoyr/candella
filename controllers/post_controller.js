const Error = require('../models/utils/error');
const Success = require('../models/utils/success');
const Literature = require('../models/data/literature');
const Journal = require('../models/data/journal');
const Comic = require('../models/data/comics');
const Photography = require('../models/data/photography');
const MixedContents = require('../models/data/mixedContents');
const {Divisions} = require('../utils/Constants');
const {pagination, normalizePost, validateLitData, validateJournal, excludeFields, validateComic} = require("../utils/helpers");
//get all mixed
const readMix = async (req, res) => {
    let result;
    try {
        result = await getMixed(req);
        res.status(200).json(result);
    } catch (e) {
        res.status(500).json(e);
    }
}

const readDiv = async (req, res) => {
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
            result = normalizePost(req.query['excludes'], result);
        }
        res.status(200).json(result);
    } catch (e) {
        console.log(e);
        res.status(500).json(new Error(500, e));
    }
}

const normalizeMix = (req, mixes) => {
    const excludes = req.query['excludes'];
    const fields = excludes.split('_');
    console.log(fields);
    const normalizedMix = [];
    mixes.forEach((mix) => {
        const {_doc} = mix;
        let {...doc} = _doc;
        let data = doc.content.data;
        console.log(data);

        data['thoughts'] = undefined;
        console.log('Deleted: ');

        console.log(data)


        normalizedMix.push(_doc);
    })
    //console.log(JSON.stringify(normalizedMix));
    return normalizedMix;

}

const getMixed = async (req) => {
    const {skip, limit, sortBy, order} = pagination(req);
    try {
        return await MixedContents.find()
            .select('-_id -__v')
            .skip(skip).limit(limit)
            .sort([[sortBy, order]])
            .populate({
                path: 'content.data',
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
        console.log('remixed' + e);
        return e;
    }
}

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

const readByDivId = async (req, res) => {
    //TODO search post from division collections
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

const readMixById = async (req, res) => {
    //TODO search post from mix collection
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
        console.log(e);
        res.status(500)
            .json(new Error(500, e));
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


const mix = async (post) => {
    const {_id, division} = post;
    await MixedContents.create({
        content: {
            division: division,
            data: _id
        }
    });
};

module.exports = {
    readDiv,
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
    getSingleLiterature
}