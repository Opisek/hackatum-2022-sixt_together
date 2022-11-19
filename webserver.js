require("dotenv").config();

module.exports = class WebServer {
    listen(name, callback) { this._events[name] = callback; }

    _emit(name, data) {
        if (name in this._events) return new Promise((res) => this._events[name](data, res));
        return null;
    }
    
    constructor(port) {
        this._events = {};

        const express = require("express");
        const server = express();
        const bodyparser = require("body-parser");
        server.use(express.json());
        server.use(bodyparser.json());

        server.get("/rider/registerRequest", async (req, res) => res.json(await this._emit("riderRegisterRequest", req.body)));

        server.get("/driver/registerRequest", async (req, res) => res.json(await this._emit("driverRegisterRequest", req.body)));

        server.get("/authenticate", async (req, res) => res.json(await this._emit("authenticate", req.body)));

        server.listen(port);
        console.log("listening on " + port);
    }
}