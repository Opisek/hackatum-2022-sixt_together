const jwt = require('jsonwebtoken');

module.exports = class Auth {
    constructor(secret) {
        this._events = {};
        this._secret = secret;
        this._count = 0;
    }

    listen(name, callback) { this._events[name] = callback; }

    _emit(name, data) {
        if (name in this._events) return new Promise((res) => this._events[name](data, res));
        return null;
    }

    generateToken() {
        return jwt.sign({ id: this._count++, timestamp: Date.now() }, this._secret);
    }

    verifyToken(data) {
        try {
            return jwt.verify(data, this._secret).id;
        } catch(e) {
            return null;
        }
    }

    handle(data, response, callback) {
        const id = auth.verifyToken(data.token);
        if (id == null) {
            response({ status: "error", message: "Must provide a valid token" });
            return;
        }
        callback(id, data, response);
    }
};