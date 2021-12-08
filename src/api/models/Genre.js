const {Schema, model} = require('mongoose');
const {ModelNames} = require("../helpers");

const genreSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: ModelNames.CATEGORY,
        required: true
    }
});

module.exports = model(ModelNames.GENRE, genreSchema);