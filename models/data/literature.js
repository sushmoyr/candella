const {Schema, model} = require('mongoose');
const {textChapter} = require('chapter');
const rating = require('rating');
const thoughts = require('thoughts');
const category = require('category');

const literatureSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId
    },
    title: {
        type: String,
        required: true
    },
    alternateNames: {
        type: [String]
    },
    description: {
        type: String
    },
    coverImage: {
        type: String
    },
    division: {
        type: String,
        default: "Literature"
    },
    category: {
        type: category
    },
    genre: {
       type: Schema.Types.ObjectId
    },
    lang: {
        type: String,
    },
    chapters: {
        type: [textChapter]
    },
    ratings: {
        type: [rating]
    },
    thoughts: {
        type: [thoughts]
    },
    tags: {
        type: [String]
    }
}, {timestamps: true});

module.exports = model('Literature', literatureSchema);