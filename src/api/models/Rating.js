const {Schema, model} = require('mongoose');
const {ModelNames} = require("../helpers");

const ratingSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: ModelNames.USER
    },
    chapterId: {
        type: Schema.Types.ObjectId,
        ref: ModelNames.CONTENT
    },
    value: {
        type: Schema.Types.Number,
        default: 0,
        min: 0,
        max: 5
    }
}, {timestamps: true});

module.exports = model(ModelNames.RATING, ratingSchema);