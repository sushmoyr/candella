const {Schema, model} = require('mongoose');

const genreSchema = new Schema({
    name: {
        type: String
    }
});

module.exports = model('genre', genreSchema);