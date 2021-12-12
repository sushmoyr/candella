const {Schema, model} = require('mongoose');
const {ModelNames} = require("../helpers");

const chapterSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: ModelNames.USER
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: ModelNames.CATEGORY
    },
    chapterName: {
        type: String
    },
    contentId: {
        type: Schema.Types.ObjectId,
        ref: ModelNames.CONTENT
    },
    body: {
        type: Schema.Types.Mixed
    }
}, {timestamps: true});

module.exports = model(ModelNames.CHAPTER, chapterSchema);