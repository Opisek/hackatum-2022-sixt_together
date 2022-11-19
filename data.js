module.exports = class Data {
    listen(name, callback) { this._events[name] = callback; }

    _emit(name, data) {
        if (name in this._events) return new Promise((res) => this._events[name](data, res));
        return null;
    }

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

    async registerRider(id, begin, end) {
        this._riders[id] = {
            begin: begin,
            end: end,
            assigned: null
        };
        let routesDone = 0;
        let routesNeeded = drivers.length;
        let routes = [];
        for (let driverId of Object.keys(this._drivers)) {
            routes.push(null);
            const driver = this._drivers[driverId];
            this._emit(findRoute, [driver.begin, begin, end, driver.end], result => {
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
        })
        // find a suitable driver for the rider here or send a sixt employee
    }

    getRiderAssignment(id) {
        if (!(id in this._riders) || this._riders[id].assigned == null) return null;
        return this._drivers[this._riders[id].assigned].route;
    }
}