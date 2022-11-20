module.exports = class WebServer {
    listen(name, callback) { this._events[name] = callback; }

    _emit(name, data) {
        console.log(name);
        //console.log(JSON.stringify(data));
        if (name in this._events) return new Promise((res) => this._events[name](data, res));
        return null;
    }
    
    constructor(port) {
        this._events = {};

        const http = require("http");
        const express = require("express");
        const server = express();
        const bodyparser = require("body-parser");
        const cors = require("cors");
        server.use(cors());
        server.use(express.json());
        server.use(bodyparser.json());

        server.post("/rider/registerRequest", async (req, res) => sendJson(res, await this._emit("riderRegisterRequest", req.body)));
        server.post("/rider/cancelRequest", async (req, res) => sendJson(res, await this._emit("riderRegisterRequest", req.body)));
        server.post("/rider/fetchAssignment", async (req, res) => sendJson(res, await this._emit("riderFetchAssignment", req.body)));

        server.post("/driver/registerRequest", async (req, res) => sendJson(res, await this._emit("driverRegisterRequest", req.body)));
        server.post("/driver/fetchRider", async (req, res) => sendJson(res, await this._emit("driverFetchRider", req.body)));
        server.post("/driver/acceptRider", async (req, res) => sendJson(res, await this._emit("driverAcceptRider", req.body)));
        server.post("/driver/declineRider", async (req, res) => sendJson(res, await this._emit("driverDeclineRider", req.body)));

        server.get("/authenticate", async (req, res) => sendJson(res, await this._emit("authenticate", req.body)));

        server.listen(port);
        console.log("Webserver listening on " + port);
    }
}

function sendJson(res, json) {
    res.set("Content-Type", "application/json"),
    res.json(json);
}