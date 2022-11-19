module.exports = class Routes {
    constructor(key) {
        this._key = key;
        this._unirest = require('unirest');
    }

    async getRoute(points) {
        return new Promise((res) => {
            this._unirest.get(`https://api.openrouteservice.org/v2/directions/driving-car?${stringifyParameters(
                {
                    api_key: this._key,
                    start: `${points[0].longitude},${points[0].latitude}`,
                    end: `${points[1].longitude},${points[1].latitude}`,
                }
            )}`).then(result => res(result.body));
        })
    }
}

function stringifyParameters(parameters) {
    let parametersArray = [];
    for (let key of Object.keys(parameters)) parametersArray.push(`${key}=${encodeURIComponent(parameters[key])}`);
    return parametersArray.join('&');
}