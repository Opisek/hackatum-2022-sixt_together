module.exports = class Data {
    listen(name, callback) { this._events[name] = callback; }

    _emit(name, data) {
        if (name in this._events) return new Promise((res) => this._events[name](data, res));
        return null;
    }

    constructor() {
        this._events = {};
        this._drivers = {};
        this._riders = {};
    }

    registerDriver(id, begin, end, route) {
        this._drivers[id] = {
            begin: begin,
            end: end,
            route: route,
            occupied: false,
            position: begin,
            socket: null
        };
    }

    async registerRider(riderId, begin, end) {
        if (riderId in this._riders) return;

        this._riders[riderId] = {
            begin: begin,
            end: end,
            assigned: null
        };

        for (const driverId of Object.keys(this._drivers)) this._proposeRider(riderId, driverId);
    }

    async _proposeRider(riderId, driverId) {
        console.log("trying to match rider " + riderId + " with driver " + driverId);
        const rider = this._riders[riderId];
        const driver = this._drivers[driverId];
        const alternativeRoute = await new Promise(res => this._emit("getRoute", [driver.begin, rider.begin, rider.end, driver.end], result => res(result)));

        /*this._emit("queryDriver", {
            driver: driverId,
            rider: riderId
        });*/
    }

    async cancelRider(riderId, begin, end) {
        delete this._riders[riderId];
    }

    acceptRider(driverId, riderId) {
        if (!(riderId in this._riders) || this._riders[riderId].assigned != null) return false;
        this._riders[riderId].assigned = driverId;
        return true;
    }

    cancelRider(driverId, riderId) {

    }

    getRiderAssignment(id) {
        if (!(id in this._riders) || this._riders[id].assigned == null) return null;
        return this._drivers[this._riders[id].assigned].route;
    }
}