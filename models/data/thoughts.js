const {Schema} = require('mongoose');

const thoughtSchema = new Schema({
    by: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    value: {
        type: String,
        maxlength: 200
    }
}, {timestamps: true});

module.exports = thoughtSchema