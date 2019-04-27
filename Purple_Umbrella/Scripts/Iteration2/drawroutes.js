//const TOKEN = 'pk.eyJ1Ijoia2VvbnlhbWF0byIsImEiOiJjamw4cXR0MjcxZ24yM2txa2VhazJ2MmY5In0.b3cxVs4DdITNSJYZGzt9pA';
//mapboxgl.accessToken = TOKEN;

// Use the coordinates drew to make the Map Matching API request
function updateRoute(map,draw) {
    // Set the profile
    var profile = "walking";
    // Get the coordinates that were drawn on the map
    var data = draw;//.getAll();
    var lastFeature = data.features.length - 1;
    var coords = data.features[lastFeature].geometry.coordinates;
    // Format the coordinates
    var newCoords = coords.join(';');
    // Set the radius for each coordinate pair to 25 meters
    var radius = [];
    coords.forEach(element => {
        radius.push(25);
    });
    getMatch(newCoords, radius, profile, map);
}

// Make a Map Matching request
function getMatch(coordinates, radius, profile, map) {
    // Separate the radiuses with semicolons
    var radiuses = radius.join(';');
    // Create the query
    var query = 'https://api.mapbox.com/matching/v5/mapbox/' + profile + '/' + coordinates + '?geometries=geojson&radiuses=' + radiuses + '&steps=true&access_token=' + mapboxgl.accessToken;

    $.ajax({
        method: 'GET',
        url: query
    }).done(function (data) {
        // Get the coordinates from the response
        var coords = data.matchings[0].geometry;
        addRoute(coords, map);
        // Code from the next step will go here
    });
}

// Draw the Map Matching route as a new layer on the map
function addRoute(coords, map) {
    // If a route is already loaded, remove it
    if (map.getSource('route')) {
        map.removeLayer('route');
        map.removeSource('route');
    } else { // Add a new layer to the map
        map.addLayer({
            "id": "route",
            "type": "line",
            "source": {
                "type": "geojson",
                "data": {
                    "type": "Feature",
                    "properties": {},
                    "geometry": coords
                }
            },
            "layout": {
                "line-join": "round",
                "line-cap": "round"
            },
            "paint": {
                "line-color": "#03AA46",
                "line-width": 8,
                "line-opacity": 0.8
            }
        });
    };
}

// If the user clicks the delete draw button, remove the layer if it exists
function removeRoute(map) {
    if (map.getSource('route')) {
        map.removeLayer('route');
        map.removeSource('route');
    } else {
        return;
    }
}