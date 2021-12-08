const {Schema, model} = require('mongoose');

const docSchema = new Schema({
    endpoint: {
        type: String
    },
    method: {
        type: String
    },
    description: {
        type: String
    },
    request: {
        type: Schema.Types.Mixed
    },
    params: Schema.Types.Mixed,
    query: Schema.Types.Mixed,
    headers: Schema.Types.Mixed,
    response: Schema.Types.Mixed,
    error: Schema.Types.Mixed
})

module.exports = model('documentation', docSchema);