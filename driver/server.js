require("dotenv").config();

const express = require("express");
const server = express();
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const httpServer = http.createServer(server);
const unirest = require('unirest');
const polyline = require('@mapbox/polyline');

const serverPath = path.resolve(__dirname, "./");
const publicPath = path.join(serverPath + "/public");

server.set("views", path.join(publicPath + '/html'))
server.use(express.static(path.join(publicPath)));
server.set("view engine", "ejs");

server.get("/", (req, res) => {
    //if (authenticate(req, res)) return;

    res.render("index");
    res.end();
});

socketio(httpServer).on("connection", socket => {
    socket.on("autocomplete", async (data, callback) => {
        callback(await new Promise(res => {
            unirest
            .get(`https://api.openrouteservice.org/geocode/autocomplete?api_key=${process.env.ORS_KEY}&text=${data}&boundary.country=DE`)
            .then(result => {
                if (result.body.features == undefined) res([]);
                else res(result.body.features.map(element => {return {name: element.properties.name, latitude: element.geometry.coordinates[0], longitude: element.geometry.coordinates[1]};}))
            });
        }));
    });
    socket.on("submit", async (data, callback) => {
        callback(await new Promise(res => {
            unirest
            .post(`${process.env.SERVER}/driver/registerRequest`)
            .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
            .send(data)
            .then(result => {
                if (!("body" in result) || !("route" in result.body) || result.body.route == null) {
                    res(result);
                    return;
                } else {
                    for (let route of result.body.route.routes) route.geometry = polyline.decode(route.geometry);
                    res(result);
                }
            });
        }));
    });
    socket.on("getToken", async (callback) => {
        callback(await new Promise(res => {
            unirest
            .get(`${process.env.SERVER}/authenticate`)
            .then(result => callback(result.body));
        }));
    });
    socket.on("fetchRider", async (data, callback) => {
        unirest
        .post(`${process.env.SERVER}/driver/fetchRider`)
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
        .send(data)
        .then(result => {
            if (!("body" in result) || result.body.rider == null) callback(result);
            else {
                for (let route of result.body.route.routes) route.geometry = polyline.decode(route.geometry);
                callback(result);
            }
        });
    });
    socket.on("acceptRider", async (data, callback) => {
        unirest
        .post(`${process.env.SERVER}/driver/acceptRider`)
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
        .send(data)
        .then(result => {});
    });
    socket.on("declineRider", async (data, callback) => {
        unirest
        .post(`${process.env.SERVER}/driver/declineRider`)
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
        .send(data)
        .then(result => {});
    });
});

httpServer.listen(process.env.WEB_PORT);
console.log(process.env.WEB_PORT);