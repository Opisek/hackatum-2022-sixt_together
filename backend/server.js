require("dotenv").config();

const webServer = new (require("./webserver"))(process.env.WEB_PORT);
const auth = new (require("./auth"))(process.env.JWT_SECRET);
const routes = new (require("./routes"))(process.env.ORS_KEY);
const dataManager = new (require("./data"))(process.env.ORS_KEY);

(async () => {
    console.log("Server started");

    // shared
    webServer.listen("authenticate", (data, callback) => callback(auth.generateToken()));
    webServer.listen("checkToken", (data, callback) => callback(auth.verifyToken(data.token)));

    // driver
    webServer.listen("driverRegisterRequest", (data, callback) => auth.handle(data, callback, async (id, data, callback) => {
        const route = await routes.getRoute([data.begin, data.end])
        dataManager.registerDriver(id, data.begin, data.end, route);
        callback({ status: "ok", route: route});
    }));
    webServer.listen("driverAcceptRider", (data, callback) => auth.handle(data, callback, async (id, data, callback) => {
        if (dataManager.acceptRider(id, data.rider)) callback({ status: "ok" });
        else callback({ status: "expired" });
    }));
    webServer.listen("driverDeclineRider", (data, callback) => auth.handle(data, callback, async (id, data, callback) => {
        dataManager.declineRider(id, data.rider)
        callback({ status: "ok" });
    }));
    
    // rider
    webServer.listen("riderRegisterRequest", (data, callback) => auth.handle(data, callback, async (id, data, callback) => {
        dataManager.registerRider(id, data.begin, data.end);
        callback({ status: "ok" });
    }));
    webServer.listen("riderCancelRequest", (data, callback) => auth.handle(data, callback, async (id, data, callback) => {
        dataManager.cancelRider(id);
        callback({ status: "ok" });
    }));
    webServer.listen("riderFetchAssignment", (data, callback) => auth.handle(data, callback, async (id, data, callback) => {
        callback({ status: "ok", route: dataManager.getRiderAssignment(id)});
    }));
    
    // driver + rider
    dataManager.listen("getRoute", async (data, callback) => callback(await routes.getRoute(data)));
    webServer.listen("driverFetchRider", async (data, callback) => auth.handle(data, callback, async (id, data, callback) => callback(dataManager.fetchRiderSuggestion(id, data, callback))));
    /*dataManager.listen("queryDriver", async data => {
        console.log("query:");
        console.log(data);
        webServer.message(data.driverId, {
            riderId: data.riderId,
            route: route
        })
    });*/

    /*console.log("test");
    console.log(JSON.stringify(await routes.getRoute([
        {
            longitude: 8.681495,
            latitude: 49.41461
        },
        {
            longitude: 8.687872,
            latitude: 49.420318
        }
    ])));*/
})();