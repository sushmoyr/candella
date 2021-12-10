const {Schema, model} = require('mongoose');
const {ModelNames} = require("../helpers");

const notification = new Schema({
    owner: {
        type: Schema.Types.ObjectId
    },
    message: {
        type: String
    },
    type: {
        type: String,
    },
    action: {
        type: Schema.Types.Mixed
    }
})

module.exports = model(ModelNames.NOTIFICATION, notification);