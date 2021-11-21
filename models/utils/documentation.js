const {Schema, model} = require('mongoose');
const {Divisions} = require("../../utils/Constants");

const docSchema = new Schema({
    endpoint: {
        type: String
    },
    description: {
        type: String
    },
    request: {
        type: Schema.Types.Mixed
    },
    params: [
        {
            name: String,
            desc: String
        }
    ],
    query: [
        {
            name: String,
            desc: String
        }
    ],
    headers: [
        {
            name: String,
            desc: String
        }
    ],
    response: {
        type: Schema.Types.Mixed
    }
})

module.exports = model('docs', docSchema);