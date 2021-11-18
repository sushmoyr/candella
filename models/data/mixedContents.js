const {Schema, model} = require('mongoose');

const mixedContents = new Schema({
    content:{
        type: {
            division: String,
            data: {type: Schema.Types.ObjectId, refPath: 'content.division'}
        }
    }
})

module.exports = model('mixedContents', mixedContents);