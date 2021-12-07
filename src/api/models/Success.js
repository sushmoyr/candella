const {StatusPhrase, StatusCodes} = require("../helpers/Constants");

class Success {
    /*code = StatusCodes.OK;
    phrase = StatusPhrase[StatusCodes.OK]
    message = 'Request Successful';
    body = null;*/

    constructor(
        {
            code = StatusCodes.OK,
            message = 'Request Successful',
            body = null
        }) {
        this.code = code;
        this.phrase = StatusPhrase[code];
        this.message = message;
        this.body = body;
    }

    static default() {
        return new Success({});
    }
}

module.exports = Success;

