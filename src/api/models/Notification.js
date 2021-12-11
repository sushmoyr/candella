const {Schema, model} = require('mongoose');
const {ModelNames} = require("../helpers");

const notification = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: ModelNames.USER
    },
    message: {
        type: String
    },
    type: {
        type: String,
    },
    data: {
        type: Schema.Types.Mixed
    }
})

module.exports = model(ModelNames.NOTIFICATION, notification);