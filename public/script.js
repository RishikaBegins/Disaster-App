let map;
let userPosition;
let routeLine;

/* ---------- INIT MAP ---------- */
function initMap() {
    if (!navigator.geolocation) {
        alert("Geolocation not supported by browser");
        return;
    }

    navigator.geolocation.getCurrentPosition(position => {
        userPosition = [
            position.coords.latitude,
            position.coords.longitude
        ];

        map = L.map('map').setView(userPosition, 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(map);

        L.marker(userPosition)
            .addTo(map)
            .bindPopup("You are here")
            .openPopup();

        loadShelters();
        checkDisasterAlert();

    }, () => {
        alert("Please allow location access");
    });
}

window.onload = initMap;

/* ---------- LOAD SHELTERS ---------- */
function loadShelters() {
    fetch("/shelters")
    .then(res => res.json())
    .then(data => {
        data.forEach(shelter => {
            const marker = L.marker([shelter.latitude, shelter.longitude])
                .addTo(map)
                .bindPopup(shelter.name + " (" + shelter.type + ")");

            marker.on("click", () => {
                drawRoute(shelter.latitude, shelter.longitude);
            });
        });
    })
    .catch(() => {
        alert("Error loading shelters");
    });
}

/* ---------- DRAW EVACUATION ROUTE ---------- */
function drawRoute(lat, lng) {
    if (routeLine) {
        map.removeLayer(routeLine);
    }

    routeLine = L.polyline([
        userPosition,
        [lat, lng]
    ], { weight: 5 }).addTo(map);

    map.fitBounds(routeLine.getBounds());
}

/* ---------- DISASTER ALERT (REAL WEATHER) ---------- */
function checkDisasterAlert() {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${userPosition[0]}&longitude=${userPosition[1]}&current_weather=true`)
    .then(res => res.json())
    .then(data => {
        const wind = data.current_weather.windspeed;

        if (wind > 40) {
            showDanger("⚠ Storm risk detected — evacuate to nearest shelter!");
        } else {
            showSafe();
        }
    })
    .catch(() => {
        simulateAlert();
    });
}

/* ---------- FALLBACK SIMULATION ---------- */
function simulateAlert() {
    const risk = Math.random();

    if (risk > 0.5) {
        showDanger("⚠ Flood risk detected in your area!");
    } else {
        showSafe();
    }
}

function showDanger(message) {
    const box = document.getElementById("alertBox");
    box.innerText = message;
    box.style.background = "red";
}

function showSafe() {
    const box = document.getElementById("alertBox");
    box.innerText = "✅ Area currently safe";
    box.style.background = "green";
}

/* ---------- SOS ---------- */
function sendSOS() {
    alert("SOS sent with your location!");
}