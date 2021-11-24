const Error = require("../models/utils/error");
const Success = require("../models/utils/success");
const {Divisions} = require("./Constants");
const pagination = (req) => {
    const pageNo = (req.query['page']) ? req.query['page'] : 1;
    const sortBy = (req.query['sort_by']) ? req.query['sort_by'] : 'createdAt';
    const order = (req.query['order']) ? req.query['order'] : 'asc';
    const limit = process.env.page_limit * 1;
    const skip = (pageNo - 1) * limit;
    return {skip, limit, pageNo, sortBy, order};
}

const normalizePosts = (excludes, posts) => {
    const fields = excludes.split('_');
    const normalized = [];

    console.log(fields);
    posts.forEach((post) => {
        normalized.push(excludeFields(excludes, post));
    })
    return normalized;
}

const normalizeMix = (excludes, posts) => {
    const fields = excludes.split('_');
    const normalized = [];

    posts.forEach((post) => {
        normalized.push(excludeFieldsFromMix(excludes, post));
    })
    return normalized;

}

const excludeFields = (excludes, post) => {
    return exclude(excludes, post);
}

const excludeFieldsFromMix = (excludes, post) => {
    const data = post.data;
    return exclude(excludes, data);
}

const exclude = (excludes, post) => {
    const obj = {};
    const {_doc} = post;
    //console.log(post.totalRating);
    const keys = Object.keys(_doc);
    keys.forEach(s => {
        console.log(s);
        if (!excludes.includes(s)) {
            obj[s] = _doc[s];
        }
    });
    obj['totalRating'] = post.totalRating;
    obj['thoughtsCount'] = post.thoughtsCount;
    if(post.chapterCount !== undefined)
        obj['chapterCount'] = post.chapterCount;
    console.log(obj);
    return obj;

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

const validateComic = post => {
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

const getModelFromDivision = division => {
    if (division === Divisions.literature) {
        return require('../models/data/literature');
    } else if (division === Divisions.journal) {
        return require('../models/data/literature');
    } else if (division === Divisions.comic) {
        return require('../models/data/literature');
    } else if (division === Divisions.comic) {
        return require('../models/data/literature');
    } else {
        return null;
    }
}

const sendSuccessResponse = (res, body = {}, message = "Success") => {
    res.status(200).json(new Success(200, message, body));
}

const sendErrorResponse = (res, code, message) => {
    res.status(code).json(new Error(code, message));
}

const sortArrayByKey = (array, sortBy, order) => {
    return array.sort((a, b) => {
        const value1 = a[sortBy];
        const value2 = b[sortBy];
        console.log(value1, value2);
        if (value1 > value2)
            return (order === 'desc') ? -1 : 1;
        if (value1 < value2)
            return (order === 'desc') ? 1 : -1;
        return 0;
    });
}

module.exports = {
    pagination,
    normalizePosts: normalizePosts,
    validateLitData,
    validateJournal,
    excludeFields,
    validateComic,
    excludeFieldsFromMix,
    normalizeMix,
    getModelFromDivision,
    sendSuccessResponse,
    sendErrorResponse,
    sortArrayByKey
}