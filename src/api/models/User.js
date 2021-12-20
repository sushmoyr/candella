const {Schema, model} = require('mongoose');
const {ModelNames, Genders, Limits, Defaults} = require("../helpers/Constants");

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: Limits.MIN_PASSWORD_LENGTH,
        max: Limits.MAX_PASSWORD_LENGTH
    },
    phone: {
        type: String
    },
    profileImage: {
        type: String,
        default: Defaults.DEFAULT_PROFILE_IMAGE_URL
    },
    coverImage: {
        type: String,
        default: Defaults.DEFAULT_COVER_IMAGE_URL
    },
    address: {
        type: String
    },
    pen_name: {
        type: String
    },
    bio: {
        type: String,
        max: Limits.MAX_BIO_LENGTH
    },
    gender: {
        type: String,
        default: Genders.NOT_SPECIFIED
    },
    following: {
        type: [Schema.Types.ObjectId],
        default: [],
        ref: ModelNames.USER
    },
    followers: {
        type: [Schema.Types.ObjectId],
        default: [],
        ref: ModelNames.USER
    },
    birthdate: {
        type: String
    },
    savedPosts: {
        type: [Schema.Types.ObjectId],
        default: [],
        ref: ModelNames.CONTENT
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


module.exports = model(ModelNames.USER, userSchema);