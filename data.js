module.exports = class Data {
    constructor() {
        this._drivers = {};
        this._riders = {};
    }

    registerDriver(id, begin, end, route) {
        this._drivers[id] = {
            begin: begin,
            end: end,
            route: route,
            occupied: false,
            position: begin
        };
    }

    registerRider(id, begin, end) {
        this._riders[id] = {
            begin: begin,
            end: end,
        };
    }
}