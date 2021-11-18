const {Schema} = require('mongoose');

exports.textChapter = new Schema({
    name: {
        type: String
    },
    content: {
        type: String
    }
}, {timestamps: true});

exports.comicChapter = new Schema({
    name: {
        type: String
    },
    contentImages: {
        type: [String]
    }
}, {timestamps: true});



