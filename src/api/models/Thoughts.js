const {Schema, model} = require('mongoose');
const {ModelNames} = require("../helpers");

const thoughtSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: ModelNames.USER
    },
    contentId: {
        type: Schema.Types.ObjectId,
        ref: ModelNames.CONTENT
    },
    value: {
        type: String
    }
}, {timestamps: true});

module.exports = model(ModelNames.THOUGHT, thoughtSchema);