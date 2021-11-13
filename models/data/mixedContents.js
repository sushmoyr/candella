const {Schema, model} = require('mongoose');

const mixedContents = new Schema({
    content:{
        type: Schema.Types.ObjectId
    }
})

module.exports = model('mixedContents', );