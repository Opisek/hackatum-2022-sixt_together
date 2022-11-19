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
        console.log("registered driver " + id);
        this._drivers[id] = {
            begin: begin,
            end: end,
            route: route,
            occupied: false,
            position: begin,
            socket: null,
            suggestion: null
        };

        for (const riderId of Object.keys(this._riders)) if (this._riders[riderId].assigned == null) this._proposeRider(riderId, id);
    }

    async registerRider(riderId, begin, end) {
        console.log("registered rider " + riderId);
        if (riderId in this._riders) return;

        this._riders[riderId] = {
            begin: begin,
            end: end,
            assigned: null
        };

        for (const driverId of Object.keys(this._drivers)) this._proposeRider(riderId, driverId);
    }

    async _proposeRider(riderId, driverId) {
        const rider = this._riders[riderId];
        const driver = this._drivers[driverId];
        const currentRoute = driver.route;
        const alternativeRoute = await this._emit("getRoute", [driver.begin, rider.begin, rider.end, driver.end]);

        this._drivers[driverId].suggestion = {
            id: riderId,
            route: alternativeRoute
        }
        /*this._emit("queryDriver", {
            driver: driverId,
            rider: riderId,
            route: alternativeRoute
        });*/
    }

    async cancelRider(riderId) {
        delete this._riders[riderId];
    }

    acceptRider(driverId, riderId) {
        if (!(riderId in this._riders) || this._riders[riderId].assigned != null) return false;
        this._riders[riderId].assigned = driverId;
        console.log("assigned rider " + riderId + " to driver " + driverId);
        return true;
    }

    cancelRider(driverId, riderId) {

    }

    getRiderAssignment(id) {
        console.log("checking assignment " + id);
        if (!(id in this._riders) || this._riders[id].assigned == null) return null;
        return this._drivers[this._riders[id].assigned].route;
    }

    fetchRiderSuggestion(id, data, callback) {
        if (!(id in this._drivers) || this._drivers[id].suggestion == null) callback({
            status: "ok",
            rider: null,
            route: null
        });
        else callback({
            status: "ok",
            rider: this._drivers[id].suggestion.id,
            route: this._drivers[id].suggestion.route
        });
    }
}