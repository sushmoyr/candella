//Helper Models
const Error = require('./Error');
const Success = require('./Success');
const Reason = require('./Reason');
//DB Models
const User = require('./User');
const Category = require('./Category');
const Genre = require('./Genre');
const DocumentSnapshot = require('./DocumentSnapshot');

module.exports = {
    Error, Success, Reason, DocumentSnapshot,
    User, Category, Genre
}