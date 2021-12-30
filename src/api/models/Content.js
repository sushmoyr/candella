const {Schema, model} = require('mongoose');
const {ModelNames, Limits, Defaults} = require("../helpers");

const contentSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: ModelNames.USER
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
        max: Limits.MAX_CONTENT_DESCRIPTION_LENGTH
    },
    coverImage: {
        type: String,
        default: Defaults.DEFAULT_CONTENT_COVER
    },
    category: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: ModelNames.CATEGORY
    },
    genre: {
        type: [Schema.Types.ObjectId],
        required: true,
        ref: ModelNames.GENRE
    },
    chapters: {
        type: [Schema.Types.ObjectId],
        ref: ModelNames.CHAPTER
    },
    reviews: {
        type: [Schema.Types.ObjectId],
        ref: ModelNames.REVIEW
    },
    tags: {
        type: [String],
    },
    views: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

//add totalReviews, totalChapters as virtuals
contentSchema.virtual('averageRating').get(function (){
    return 0;
});

contentSchema.virtual('totalReviews').get(function (){
    return this.reviews.length;
});

module.exports = model(ModelNames.CONTENT, contentSchema);
