const {Schema, model} = require('mongoose');
const {comicChapter} = require("./chapter");
const rating = require("./rating");
const thoughts = require("./thoughts");

const photoSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId
    },
    title: {
        type: String,
    },
    caption: {
        type: String
    },
    image: {
        type: String
    },
    division: {
        type: String,
        default: "Photography"
    },
    genre: {
        type: Schema.Types.ObjectId,
        required: true
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
});

photoSchema.virtual('thoughtsCount').get(function (){
    return this.thoughts.length;
});

photoSchema.virtual('totalRating').get(function (){
    const ratings = this.ratings;
    const n = ratings.length;
    let sum = 0;
    for (const rating of ratings) {
        sum += rating.value;
    }
    const rating = sum / n;
    return isNaN(rating)?0:rating;
});

module.exports = model('Photography', photoSchema);