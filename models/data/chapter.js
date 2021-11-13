const {Schema} = require('mongoose');

const textChapter = new Schema({
    name: {
        type: String
    },
    content: {
        type: String
    }
}, {timestamps: true});

const comicChapter = new Schema({
    name: {
        type: String
    },
    contentImages: {
        type: [String]
    }
}, {timestamps: true});




module.exports = {textChapter, comicChapter}