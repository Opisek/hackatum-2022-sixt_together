const webServer = new (require("./webserver"))(process.env.WEB_PORT);
const auth = new (require("./auth"))(process.env.JWT_SECRET);
const routes = new (require("./routes"))(process.env.ORS_KEY);
const data = new (require("./data"))(process.env.ORS_KEY);

(async () => {
    console.log("Server started");

    webServer.listen("authenticate", (data, callback) => callback(auth.generateToken()));

    webServer.listen("riderRegisterRequest", (data, callback) => {
        const id = auth.verifyToken(data.token);
        if (id == null) {
            callback(error("Must provide a valid token"));
            return;
        }

        callback(success());
    });

    webServer.listen("driverRegisterRequest", async (data, callback) => {
        const id = auth.verifyToken(data.token);
        if (id == null) {
            callback(error("Must provide a valid token"));
            return;
        }

        const route = await routes.getRoute([data.begin, data.end]);
        data.registerDriver(id, data.begin, data.end, route);

        callback({
            status: "ok",
            route: route
        });
    });

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

function error(message) {
    return { status: "error", message: message };
}
function success(message = null) {
    if (message) return { status: "ok", message: message };
    else return { status: "ok" };
}