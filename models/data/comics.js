const {Schema, model} = require('mongoose');
const {comicChapter} = require("./chapter");
const rating = require("./rating");
const thoughts = require("./thoughts");
const {Divisions} = require("../../utils/Constants");

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
        default: Divisions.comic
    },
    genre: {
        type: Schema.Types.ObjectId,
        required: true
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
comicSchema.virtual('thoughtsCount').get(function (){
    return this.thoughts.length;
});

comicSchema.virtual('totalRating').get(function (){
    const ratings = this.ratings;
    const n = ratings.length;
    let sum = 0;
    for (const rating of ratings) {
        sum += rating.value;
    }
    const rating = sum / n;
    return isNaN(rating)?0:rating;
});

comicSchema.virtual('chapterCount').get(function (){
    const chapters = this.chapters;
    return (chapters)?chapters.length:0;
});

module.exports = model(Divisions.comic, comicSchema);