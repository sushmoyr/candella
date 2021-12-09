const {Success, Error} = require("./index");

class DocumentSnapshot {
    constructor({code = 404, data = null, error = null}) {
        this._code = code;
        this._data = data;
        this._error = error;

        if (data) {
            this._hasData = true;
        }

        if (error)
            this._hasError = true;

    }

    _hasData = false;

    get hasData() {
        return this._hasData;
    }

    _hasError = false;

    get hasError() {
        return this._hasError;
    }

    get code() {
        return this._code;
    }

    set code(value) {
        this._code = value;
    }

    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
    }

    get error() {
        return this._error;
    }

    set error(value) {
        this._error = value;
    }

}

module.exports = DocumentSnapshot