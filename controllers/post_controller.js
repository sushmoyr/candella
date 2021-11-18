const Error = require('../models/utils/error');
const Success = require('../models/utils/success');
const Literature = require('../models/data/literature');
const Journal = require('../models/data/journal');
const MixedContents = require('../models/data/mixedContents');
const {Divisions} = require('../utils/Constants');
//get all mixed
exports.readMix = async (req, res) => {
    let result;
    try {
        result = await getMixed(req);
        res.status(200).json(result);
    } catch (e) {
        res.status(500).json(e);
    }
    /*await getMixed(req).then(data => {
        normalizeMix(req, data);
        res.status(200).json(data);
    }).catch(e => {
        res.status(500).json(e);
    });*/
}

exports.readDiv = async (req, res) => {
    const division = req.params.division;
    const {sortBy, order, limit, skip} = pagination(req);
    let result;
    try {
        if (division === Divisions.literature) {
            result = await getLiteratures(req);
            //result = normalizePost(req, result);
            //result = normalizePost(req, result);
        } else if (division === Divisions.journal) {
            result = await Journal.find().sort([[sortBy, order]]).skip(skip).limit(limit);
        }
        //console.log(result);
        res.status(200).json(result);
    } catch (e) {
        console.log(e);
        res.send(e);
    }
}

const normalizePost = (req, posts) =>{
    const excludes = req.query['excludes'];
    const fields = excludes.split('_');
    //excludes.push('_id');
    let obj = {};
    const normalized = [];

    console.log(fields);
    posts.forEach((post) => {
        const {_doc} = post;
        console.log(post.totalRating);
        const keys = Object.keys(_doc);
        keys.forEach(s => {
            console.log(s);
            if(!excludes.includes(s)){
                obj[s] = _doc[s];
            }
        });
        if(post.totalRating)
            obj['totalRating'] = post.totalRating;
        if(post.thoughtsCount)
            obj['thoughtsCount'] = post.thoughtsCount;
        if(post.chapterCount)
            obj['chapterCount'] = post.chapterCount;
        console.log(obj);
        normalized.push(obj);
    })
    return normalized;
    /*const excludes = req.query['excludes'];
    const fields = excludes.split('_');
    console.log(fields);
    const normalizePosts = [];
    posts.forEach((post) => {
        let {_doc} = post;
        fields.forEach(field => {
            delete _doc[field];
        });
        normalizePosts.push(_doc);
    });*/

    //return normalizePosts;
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
        console.log('Deleted: ' );

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


const pagination = (req) => {
    const pageNo = (req.query['page']) ? req.query['page'] : 1;
    const sortBy = (req.query['sort_by']) ? req.query['sort_by'] : 'createdAt';
    const order = (req.query['order']) ? req.query['order'] : 'asc';
    const limit = process.env.page_limit * 1;
    const skip = (pageNo - 1) * limit;
    return {skip, limit, pageNo, sortBy, order};
}


//Creates a mew content object. Method: Post
exports.create = async (req, res) => {
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
    }

}

const uploadLiterature = async (id, post) => {
    ///console.log({id, ...post});
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
            .populate([{
                path: 'author',
                select: "_id name email pen_name"
            }, {
                path: 'genre',
                select: "-_id -__v"
            }, {
                path: 'thoughts.by',
                select: "name _id"
            }, {
                path: 'ratings.by',
                select: "name _id"
            }
            ]);
    } catch (e) {
        console.log('lit ' + e);
        return e;
    }
}

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
}

const validateLitData = post => {
    const {title, division, category, genre} = post;

    let message;
    let error;
    const fields = [];
    if (!title) {
        fields.push('title');
    }
    if (!division) {
        fields.push('division');
    }
    if (!category) {
        fields.push('category');
    }
    if (!genre) {
        fields.push('genre');
    }
    if (fields.length > 0) {
        message = fields[0];
        for (let i = 1; i < fields.length; i++) {
            message += `, ${fields[i]}`;
        }
        message += ' not found.'
        return new Error(404, message);
    }
    return new Success(200);

};

const validateJournal = post => {
    const {title, genre} = post;

    let message;
    const fields = [];
    if (!title) {
        fields.push('title');
    }
    if (!genre) {
        fields.push('genre');
    }
    if (fields.length > 0) {
        message = fields[0];
        for (let i = 1; i < fields.length; i++) {
            message += `, ${fields[i]}`;
        }
        message += ' not found.'
        return new Error(404, message);
    }
    return new Success(200);
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
