const webServer = new (require("./webserver"))(process.env.WEB_PORT);
const auth = new (require("./auth"))(process.env.JWT_SECRET);
const routes = new (require("./routes"))(process.env.ORS_KEY);
const data = new (require("./data"))(process.env.ORS_KEY);

(async () => {
    console.log("Server started");

    webServer.listen("authenticate", (data, callback) => callback(auth.generateToken()));

    webServer.listen("riderRegisterRequest", (data, callback) => auth.handle(data, callback, (id, data, callback) => {
        callback(success());
    }));
    webServer.listen("riderFetchAssignment", (data, callback) => auth.handle(data, callback, (id, data, callback) => {
        callback(success());
    }));

    webServer.listen("driverRegisterRequest", (data, callback) => auth.handle(data, callback, (id, data, callback) => {
        const route = await routes.getRoute([data.begin, data.end]);
        data.registerDriver(id, data.begin, data.end, route);

        callback({
            status: "ok",
            route: route
        });
    }));

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