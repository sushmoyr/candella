const {Schema, model} = require('mongoose');
const {ModelNames} = require("../helpers");

const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

module.exports = model(ModelNames.CATEGORY, categorySchema);