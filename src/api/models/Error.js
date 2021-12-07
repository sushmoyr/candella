const {StatusCodes, StatusPhrase} = require("../helpers/Constants");

class Error {
    constructor(
        {
            code = StatusCodes.BAD_REQUEST,
            message = "An unknown error has occurred",
            reasons = []
        }) {
        this.code = code;
        this.phrase = StatusPhrase[code];
        this.message = message;
        this.reasons = reasons;
    }

    static default() {
        return new Error({})
    }

}

module.exports = Error;