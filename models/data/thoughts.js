const {Schema} = require('mongoose');

const thoughtSchema = new Schema({
    by: {
        type: Schema.Types.ObjectId
    },
    value: {
        type: Schema.Types.String,
        maxlength: 200
    }
}, {timestamps: true});

module.exports = thoughtSchema