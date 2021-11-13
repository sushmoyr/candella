const {Schema, model} = require('mongoose');
const {comicChapter} = require("chapter");
const rating = require("rating");
const thoughts = require("thoughts");

const comicSchema = new Schema({
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
        default: "Comic"
    },
    genre: {
        type: Schema.Types.ObjectId
    },
    lang: {
        type: String,
    },
    chapters: {
        type: [comicChapter]
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

module.exports = model('Comics', comicSchema);