const {Schema, model} = require('mongoose');

const categorySchema = new Schema({
    categoryName: {
        type: String,
    },
    divisionName: {
        type: String,
    }
});

module.exports = model('Categories', categorySchema);