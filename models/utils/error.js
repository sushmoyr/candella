class Error {
    code;
    message;

    constructor(code, message) {
        this.code = code;
        this.message = message;
    }

    static default() {
        return new Error()
    }
}


module.exports = Error;