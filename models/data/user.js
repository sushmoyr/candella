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
    profileImage: {
        type: String,
    },
    coverImage: {
        type: String
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
        type: [Schema.Types.ObjectId],
        default: [],
        ref: "User"
    },
        followers: {
            type: [Schema.Types.ObjectId],
            default: [],
            ref: "User"
        },
        birthdate: {
            type: Date
        },
    },
    {
        timestamps: true,
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    });

userSchema.virtual('totalFollowers').get(function () {
    const followers = this.followers;
    return (followers) ? followers.length : 0;
});

userSchema.virtual('totalFollowing').get(function () {
    const following = this.following;
    return (following) ? following.length : 0;
});


module.exports = model('User', userSchema);