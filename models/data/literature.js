const {Schema, model} = require('mongoose');
const {textChapter} = require('./chapter');
const rating = require('./rating');
const thoughts = require('./thoughts');
const {Divisions} = require('../../utils/Constants');

const literatureSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    alternateNames: {
        type: [String]
    },
    description: {
        type: String,
        max: 200
    },
    coverImage: {
        type: String
    },
    division: {
        type: String,
        required: true,
        default: Divisions.literature
    },
    category: {
        type: String,
        required: true
    },
    genre: {
        type: [Schema.Types.ObjectId],
        required: true,
        ref: "genre"
    },
    lang: {
        type: String,
        default: 'bn'
    },
    chapters: {
        type: [textChapter]
    },
    ratings: {
        type: [rating]
    },
    thoughts: {
        type: [thoughts],
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

literatureSchema.virtual('thoughtsCount').get(function (){
    const thoughts = this.thoughts;
    return (thoughts)?thoughts.length:0;
});


literatureSchema.virtual('chapterCount').get(function (){
    const chapters = this.chapters;
    return (chapters)?chapters.length:0;
});


literatureSchema.virtual('totalRating').get(function (){
    const ratings = this.ratings;
    const n = ratings.length;
    let sum = 0;
    for (const rating of ratings) {
        sum += rating.value;
    }
    const rating = sum / n;
    return isNaN(rating)?0:rating;
});


module.exports = model(Divisions.literature, literatureSchema);