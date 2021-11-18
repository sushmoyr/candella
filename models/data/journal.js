const {Schema, model} = require('mongoose');
const rating = require("./rating");
const thoughts = require("./thoughts");

const journalSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    division: {
        type: String
    },
    content: {
        type: String
    },
    coverImage: {
        type: String
    },
    genre: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "genre"
    },
    lang: {
        type: String,
        default: 'bn'
    },
    ratings: {
        type: [rating]
    },
    thoughts: {
        type: [thoughts]
    },
    tags: {
        type: [String]
    },
    views: {
        type: Number
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

journalSchema.virtual('thoughtsCount').get(function (){
    return this.thoughts.length;
});

journalSchema.virtual('totalRating').get(function (){
    const ratings = this.ratings;
    const n = ratings.length;
    let sum = 0;
    for (const rating of ratings) {
        sum += rating.value;
    }
    const rating = sum / n;
    return isNaN(rating)?0:rating;
});

module.exports = model('journal', journalSchema);