const {Schema, model} = require('mongoose');
const {ModelNames} = require("../helpers");

const genreSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    categoryName: {
        type: String,
        required: true
    }
});

module.exports = model(ModelNames.GENRE, genreSchema);