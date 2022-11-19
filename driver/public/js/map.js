const socket = io();

var map = L.map('map').setView([48.248872, 11.653248], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var from = null;
var to = null;

var clickingFrom = true;
function onMapClick(e) {
    if (clickingFrom) {
        document.getElementById("inputFrom").value = e.latlng.lat + " " + e.latlng.lng;
        from = {
            latitude: e.latlng.lat,
            longitude: e.latlng.lng
        }
        clickingFrom = false;
    } else {
        document.getElementById("inputTo").value = e.latlng.lat + " " + e.latlng.lng;
        to = {
            latitude: e.latlng.lat,
            longitude: e.latlng.lng
        }
        clickingFrom = true;
    }
}

var token;
var currentRiderSuggestion = null;
var lookingForRider;
var oldRouteDuration;

autocompleteValues = {}

window.addEventListener("load", async () => {
    token = await new Promise(res => socket.emit("getToken", token => res(token)));

    const inputFrom = document.getElementById("inputFrom");
    const autocompleteFrom = document.getElementById("autocompleteFrom");
    const inputTo = document.getElementById("inputTo");
    const autocompleteTo = document.getElementById("autocompleteTo");
    const submitButton = document.getElementById("submitButton");
    const acceptButton = document.getElementById("acceptButton");
    const declineButton = document.getElementById("declineButton");

    inputFrom.addEventListener("input", () => {
        if (inputFrom.value.length < 3) return;
        socket.emit("autocomplete", inputFrom.value, result => {
            autocompleteFrom.innerHTML = "";
            let first = true;
            for (const suggestion of result) {
                const option = document.createElement("option");
                option.value = suggestion.name;
                autocompleteFrom.appendChild(option);
                autocompleteValues[suggestion.name] = {longitude: suggestion.longitude, latitude: suggestion.latitude};
                if (first) {
                    from = {
                        longitude: suggestion.longitude,
                        latitude: suggestion.latitude
                    }
                }
                first = false;
            }
        });
    })

    inputTo.addEventListener("input", () => {
        if (inputTo.value.length < 3) return;
        socket.emit("autocomplete", inputTo.value, result => {
            autocompleteTo.innerHTML = "";
            let first = true;
            for (const suggestion of result) {
                const option = document.createElement("option");
                option.value = suggestion.name;
                autocompleteTo.appendChild(option);
                if (first) {
                    to = {
                        longitude: suggestion.longitude,
                        latitude: suggestion.latitude
                    }
                }
                first = false;
            }
        });
    })

    submitButton.addEventListener("click", () => {
        document.getElementById("searchFooter").classList.remove("visible");

        socket.emit("submit", { token: token, begin: from, end: to }, result => {
            let myStyle = {
                "color": "#37c4ef",
                "weight": 7,
                "opacity": 0.65
            };
            
            oldRouteDuration = result.body.route.routes[0].summary.duration;

            L.geoJSON(renderLine(result.body.route.routes[0]), {style: myStyle}).addTo(map);

            clearInterval(currentRiderSuggestion);
            currentRiderSuggestion = setInterval(() => {
                socket.emit("fetchRider", { token: token }, result => {
                    if (result == null || !("body" in result) || !("route" in result.body) || result.body.route==null) return;
                    clearInterval(currentRiderSuggestion);
                    document.getElementById("riderFooter").classList.add("visible");

                    currentRiderSuggestion = result.body.rider;
                    
                    document.getElementById("pickupQuery").innerHTML += ` (${Math.floor((result.body.route.routes[0].summary.duration - oldRouteDuration) / 60)} minutes longer)`;

                    let myStyle = {
                        "color": "#ea5b06",
                        "weight": 7,
                        "opacity": 0.65
                    };
                    
                    L.geoJSON(renderLine(result.body.route.routes[0]), {style: myStyle}).addTo(map);
                })
            }, 5000);
        });
    })

    acceptButton.addEventListener("click", () => {
        document.getElementById("riderFooter").classList.remove("visible");
        socket.emit("acceptRider", {token: token, rider: currentRiderSuggestion});
    });

    declineButton.addEventListener("click", () => {
        document.getElementById("riderFooter").classList.remove("visible");
        socket.emit("declineRider", {token: token, rider: currentRiderSuggestion});
    });

    map.on('click', onMapClick);
})

function renderLine(route) {
    let newGeometry = [];
    for (let point of route.geometry) newGeometry.push([point[1], point[0]]);
    return {
        type: "Feature",
        properties: {
            name: "Your Route",
        },
        geometry: {
            type: "LineString",
            coordinates: newGeometry
        }
    };
}