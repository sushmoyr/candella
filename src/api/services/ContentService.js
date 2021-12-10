const {Content, DocumentSnapshot} = require("../models");
const {StatusCodes} = require("../helpers");
const createContent = async (content) => {
    try {
        const newContent = await Content.create({...content})
        console.log({newContent});
        return new DocumentSnapshot({
            code: StatusCodes.CREATED,
            data: newContent,
        })

    } catch (e) {
        return new DocumentSnapshot({
            code: StatusCodes.BAD_REQUEST,
            error: e.toString()
        });
    }
}

const contentPopulationConfig = [
    {
        path: 'genre',
        select: '_id, name'
    },
    {
        path: 'category',
        select: '_id, name'
    },
    {
        path: 'author',
        select: '_id email name pen_name profileImage coverImage'
    }/*, TODO register chapter Schema
    {
        path: 'chapters',
        select: '_id, name'
    }*/
]

const getSingleContent = async (filter, populate = contentPopulationConfig) => {
    try {
        const data = await Content.findOne(filter).populate(populate);
        if (data)
            return createSnapshot(data);
        else
            return createErrorSnapshot(StatusCodes.NOT_FOUND, 'Content Not Found');
    } catch (e) {
        return createErrorSnapshot(StatusCodes.BAD_REQUEST, e);
    }
}

const getAllContents = async (filter = null, option = null) => {
    const select = '-__v';
    console.log(option)
    try {
        const data = await Content.find(filter, select, option)
            .sort([[option.sortBy, option.order]])
            .populate(contentPopulationConfig);
        console.log(data);
        if (data)
            return createSnapshot(data);
        else
            return createErrorSnapshot(StatusCodes.NOT_FOUND, 'No Content Found');

    } catch (e) {
        return createErrorSnapshot(StatusCodes.BAD_REQUEST, e);
    }
}

const updateContent = async (postId, userId, updateData) => {
    try {
        const data = await Content.findOneAndUpdate({
            _id: postId, author: userId
        }, {$set: updateData}, {new: true});

        if (data)
            return createSnapshot(data);
        else
            return createErrorSnapshot(StatusCodes.UNAUTHORIZED, 'You don\' have permission to edit this content');
    } catch (e) {
        return createErrorSnapshot(StatusCodes.BAD_REQUEST, e)
    }
}

const deleteContent = async (postId, userId) => {
    try {
        const data = await Content.findOneAndDelete({
            _id: postId, author: userId
        });
        console.log(data)
        if (data)
            return createSnapshot(data);
        else
            return createErrorSnapshot(StatusCodes.UNAUTHORIZED, 'You don\' have permission to delete this content');
    } catch (e) {
        return createErrorSnapshot(StatusCodes.BAD_REQUEST, e)
    }
}

const createSnapshot = data => {
    return new DocumentSnapshot({
        code: StatusCodes.CREATED,
        data: data,
    })
}

const createErrorSnapshot = (code, error) => {
    return new DocumentSnapshot({
        code: code,
        error: error.toString()
    });
}

module.exports = {
    createContent, getSingleContent, getAllContents, updateContent, deleteContent
}