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
            position: begin
        };
    }

    async registerRider(riderId, begin, end) {
        if (riderId in this._riders) return;

        this._riders[riderId] = {
            begin: begin,
            end: end,
            assigned: null
        };
        let routesDone = 0;
        let routesNeeded = this._drivers.length;
        let routes = [];
        for (const [driverId, driver] of Object.entries(this._drivers)) {
            console.log("trying " + driverId);
            routes.push(null);
            this._emit("getRoute", [driver.begin, begin, end, driver.end], result => {
                console.log("rider route");
                routes[driverId] = result;
                routesDone++;
            });
        }
        await new Promise(res => {
            let interval = setInterval(() => {
                if (routesDone == routesNeeded) {
                    clearInterval(interval);
                    res();
                }
            }, 100);
        });

        let viableRoutes = [];
        for (const [driverId, route] of Objeck.entries(routes)) {
            this._emit("queryDriver", {
                driver: driverId,
                rider: riderId
            });
        }
        // find a suitable driver for the rider here or send a sixt employee
    }

    async cancelRider(riderId, begin, end) {
        delete this._riders[riderId];
    }

    getRiderAssignment(id) {
        if (!(id in this._riders) || this._riders[id].assigned == null) return null;
        return this._drivers[this._riders[id].assigned].route;
    }
}