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
const Notification = require('./Notification')

module.exports = {
    Error, Success, Reason, DocumentSnapshot,
    User, Category, Genre, Content, Notification
}