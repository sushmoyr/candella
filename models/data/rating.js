const {Schema} = require('mongoose');

const ratingSchema = new Schema({
    by: {
        type: Schema.Types.ObjectId
    },
    value: {
        type: Schema.Types.Number,
        default: 0,
        min: 0,
        max: 5
    }
}, {timestamps: true});

module.exports = ratingSchema