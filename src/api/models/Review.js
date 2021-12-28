const {Schema, model} = require('mongoose');
const {ModelNames} = require("../helpers");

const reviewSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: ModelNames.USER
    },
    contentId: {
        type: Schema.Types.ObjectId,
        ref: ModelNames.CONTENT
    },
    text: {
        type: String,
        max: 100
    },
}, {timestamps: true});

module.exports = model(ModelNames.REVIEW, reviewSchema);