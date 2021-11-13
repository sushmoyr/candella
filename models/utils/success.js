class Success{
    code;
    message;
    body;

    constructor(code, message, body) {
        this.code = code;
        this.message = message;
        this.body = body;
    }
}

module.exports = Success;