module.exports = class Routes {
    constructor(key) {
        this._key = key;
        this._unirest = require('unirest');
    }

    /*async getRoute(points) {
        const page = `https://api.openrouteservice.org/v2/directions/driving-car?${stringifyParameters(
            {
                api_key: this._key,
                start: `${points[0].longitude},${points[0].latitude}`,
                end: `${points[1].longitude},${points[1].latitude}`,
            }
        )}`;
        console.log(page);
        return new Promise((res) => {
            this._unirest.get(page).then(result => res(result.body));
        })
    }*/

    async getRoute(points) {
        let pointsArray = [];
        for (let point of points) if (point != undefined) pointsArray.push([point.longitude, point.latitude]);
        let result = await new Promise(res => {
            this._unirest
            .post(`https://api.openrouteservice.org/v2/directions/driving-car/json`)
            .headers({"Authorization": this._key, "Content-Type": "application/json"})
            .send({coordinates: pointsArray})
            .then(result => res(result.body));
        });
        return result;
    }
}

function stringifyParameters(parameters) {
    let parametersArray = [];
    for (let key of Object.keys(parameters)) parametersArray.push(`${key}=${encodeURIComponent(parameters[key])}`);
    return parametersArray.join('&');
}