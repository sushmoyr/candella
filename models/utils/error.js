class Error {
    code;
    message;
    constructor(code, message) {
        this.code = code;
        this.message = message;
    }
}

module.exports = Error;