const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    pen_name: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: '',
        max: 100
    },
    gender: {
        type: String,
        default: 'Not Specified'
    },
    following: {
        type: [Schema.Types.ObjectId]
    },
    followers: {
        type: [Schema.Types.ObjectId]
    },
    birthdate: {
        type: Date
    },
}, {timestamps: true});

module.exports = model('User', userSchema);