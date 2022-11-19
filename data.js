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
            assigned: null
        };
        // find a suitable driver for the rider here or send a sixt employee
    }

    getRiderAssignment(id) {
        if (!(id in this._riders) || this._riders[id].assigned == null) return null;
        return this._drivers[this._riders[id].assigned].route;
    }
}