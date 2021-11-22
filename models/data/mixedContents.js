const {Schema, model} = require('mongoose');

const mixedContents = new Schema({
    division: String,
    dataId: String,
    data: {type: Schema.Types.ObjectId, refPath: 'division'}
})

module.exports = model('mixedContents', mixedContents);