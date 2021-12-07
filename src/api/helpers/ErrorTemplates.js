const {Error} = require('../models');
const {StatusCodes} = require('../helpers');

const ErrorTemplates = {
    notImplemented: () => {
        return new Error({
            code: StatusCodes.NOT_IMPLEMENTED,
            message: 'Not Yet Implemented..!'
        });
    }
}

module.exports = ErrorTemplates;