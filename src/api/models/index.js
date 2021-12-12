//Helper Models
const Error = require('./Error');
const Success = require('./Success');
const Reason = require('./Reason');
const DocumentSnapshot = require('./DocumentSnapshot');
//DB Models
const User = require('./User');
const Category = require('./Category');
const Genre = require('./Genre');
const Content = require('./Content');
const Notification = require('./Notification');
const Rating = require('./Rating');
const Review = require('./Review');
const Chapter = require('./Chapter');
const Thought = require('./Thoughts');
const {ModelNames} = require("../helpers");

const SelectModel = (modelName) => {
    if (modelName === ModelNames.CHAPTER) {
        return Chapter
    } else if (modelName === ModelNames.THOUGHT) {
        return Thought
    } else if (modelName === ModelNames.RATING) {
        return Rating
    } else if (modelName === ModelNames.REVIEW) {
        return Review
    }
}

module.exports = {
    SelectModel,
    Error, Success, Reason, DocumentSnapshot,
    User, Category, Genre, Content, Notification, Rating, Review, Chapter, Thought
}