const {Error} = require('../models');
const {StatusCodes} = require('../helpers');

const ErrorTemplates = {
    notImplemented: function () {
        return new Error({
            code: 500,
            message: 'Not Yet Implemented..!'
        });
    }
}

module.exports = ErrorTemplates;