document.getElementById('fareForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const startLocation = document.getElementById('start').value;
    const endLocation = document.getElementById('end').value;

    calculateDistance(startLocation, endLocation);
});

async function calculateDistance(start, end) {
    try {
        const startCoords = await getCoordinates(start);
        const endCoords = await getCoordinates(end);

        if (startCoords && endCoords) {
            const distance = await getDistance(startCoords, endCoords);
            const fare = calculateFare(distance);
            document.getElementById('result').innerHTML = `Distance: ${distance.toFixed(2)} km<br>Fare: $${fare.toFixed(2)}`;
        } else {
            document.getElementById('result').innerHTML = 'Unable to calculate distance. Please check the locations and try again.';
        }
    } catch (error) {
        document.getElementById('result').innerHTML = 'An error occurred. Please try again.';
    }
}

async function getCoordinates(location) {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
    const data = await response.json();
    if (data && data.length > 0) {
        return { lat: data[0].lat, lon: data[0].lon };
    }
    return null;
}

async function getDistance(start, end) {
    const response = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf624863596078e2a74e74bdf8793399f80761&start=${start.lon},${start.lat}&end=${end.lon},${end.lat}`);
    const data = await response.json();
    if (data && data.features && data.features.length > 0) {
        const distanceMeters = data.features[0].properties.segments[0].distance;
        return distanceMeters / 1000; // convert to kilometers
    }
    return 0;
}

function calculateFare(distance) {
    const baseFare = 3.0; // base fare in dollars
    const perKmRate = 1.5; // rate per kilometer in dollars
    return baseFare + (distance * perKmRate);
}
