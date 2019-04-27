const TOKEN = 'pk.eyJ1Ijoia2VvbnlhbWF0byIsImEiOiJjamw4cXR0MjcxZ24yM2txa2VhazJ2MmY5In0.b3cxVs4DdITNSJYZGzt9pA';

//var input = document.getElementById("myRange").value;
//function test(callback) {
//    $.getJSON('notebook-json-data.php', function (data) {
//        callback(data);
//    });
//}

//test(function (data) {
//    console.log(data);
//});

//$.get is asynchronous

function roundtToDecimal(num) {
    return Math.round(num * 100) / 100;
}

function getData(callback) {
    $.get("/SafetyPoints/ReturnAllSafetyPoints", function (data) {
        callback(data);
    });
}

$(document).ready(getData(function (data) {
    var locations = [];
    for (i = 0; i < data.length; i++) {
        var longitude = parseFloat(data[i].X);
        var latitude = parseFloat(data[i].Y);
        var bar_score = parseFloat(data[i].Bar_score);
        var cam_score = parseFloat(data[i].Cam_score);
        var cafe_score = parseFloat(data[i].Cafe_score);
        var light_score = parseFloat(data[i].Light_score);
        var street_address = data[i].Street_address;
        var score = Math.abs(cam_score + light_score + cafe_score - bar_score) / 3;
        var point = {
            'latitude': latitude,
            'longitude': longitude,
            'score': roundtToDecimal(score),
            'street_address': street_address
        };
        locations.push(point);
    }
    var point_data = [];
    for (i = 0; i < locations.length; i++) {
        var feature = {
            'type': 'Feature',
            'properties': {
                'score': locations[i].score,
                'street_address': locations[i].street_address
            },
            'geometry': {
                'type': 'Point',
                'coordinates': [locations[i].longitude, locations[i].latitude]
            },
            'id': i
        };
        point_data.push(feature);
    }

    mapboxgl.accessToken = TOKEN;
    var bounds = [
        [144.894814, -37.849045], // Southwest coordinates
        [145.011489, -37.770892]  // Northeast coordinates
    ];
    var map = new mapboxgl.Map({
        container: 'safetymap',
        style: 'mapbox://styles/mapbox/dark-v10',
        zoom: 6,
        center: [144.9630189, -37.81073331],
        //maxBounds: bounds
    });

    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(new mapboxgl.FullscreenControl());

    // filters for classifying safety level into five categories based on score
    var score1 = ["<", ["get", "score"], 2];
    var score2 = ["all", [">=", ["get", "score"], 2], ["<", ["get", "score"], 4]];
    var score3 = ["all", [">=", ["get", "score"], 4], ["<", ["get", "score"], 6]];
    var score4 = ["all", [">=", ["get", "score"], 6], ["<", ["get", "score"], 8]];
    var score5 = [">=", ["get", "score"], 8];

    // colors to use for the categories
    var colors = ['#EAE6F4', '#D7CCE9', '#B9A6DB', '#B098D4', '#A17DD0'];
    var point_id = null;
    map.on('load', function () {
        // add a clustered GeoJSON source for a sample set of earthquakes
        map.addSource("safety_points", {
            "type": "geojson",
            'data': {
                'type': 'FeatureCollection',
                'features': point_data
            },
            "cluster": true,
            "clusterRadius": 80,
            "clusterProperties": { // keep separate counts for each safety level category in a cluster
                "score1": ["+", ["case", score1, 1, 0]],
                "score2": ["+", ["case", score2, 1, 0]],
                "score3": ["+", ["case", score3, 1, 0]],
                "score4": ["+", ["case", score4, 1, 0]],
                "score5": ["+", ["case", score5, 1, 0]]
            }

        });
        // circle and symbol layers for rendering individual safety points (unclustered points)
        map.addLayer({
            "id": "points",
            "type": "circle",
            "source": "safety_points",
            "filter": ["!=", "cluster", true],
            "paint": {
                "circle-color": ["case",
                    score1, colors[0],
                    score2, colors[1],
                    score3, colors[2],
                    score4, colors[3], colors[4]],
                "circle-opacity": ["case",
                    ["boolean", ["feature-state", "hover"], false],
                    2,
                    0.7],
                "circle-radius": 16
            }
        });
        map.addLayer({
            "id": "points_label",
            "type": "symbol",
            "source": "safety_points",
            "filter": ["!=", "cluster", true],
            "layout": {
                "text-field": ["number-format", ["get", "score"], { "min-fraction-digits": 1, "max-fraction-digits": 1 }],
                "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                "text-size": 12
            },
            "paint": {
                "text-color": ["case", ["<", ["get", "score"], 3], "black", "white"]
            }
        });

        // objects for caching and keeping track of HTML marker objects (for performance)
        var markers = {};
        var markersOnScreen = {};

        function updateMarkers() {
            var newMarkers = {};
            var features = map.querySourceFeatures('safety_points');

            // for every cluster on the screen, create an HTML marker for it (if we didn't yet),
            // and add it to the map if it's not there already
            for (var i = 0; i < features.length; i++) {
                var coords = features[i].geometry.coordinates;
                var props = features[i].properties;
                if (!props.cluster) continue;
                var id = props.cluster_id;

                var marker = markers[id];
                if (!marker) {
                    var el = createDonutChart(props);
                    marker = markers[id] = new mapboxgl.Marker({ element: el }).setLngLat(coords);
                }
                newMarkers[id] = marker;

                if (!markersOnScreen[id])
                    marker.addTo(map);
            }
            // for every marker we've added previously, remove those that are no longer visible
            for (id in markersOnScreen) {
                if (!newMarkers[id])
                    markersOnScreen[id].remove();
            }
            markersOnScreen = newMarkers;
        }

        // after the GeoJSON data is loaded, update markers on the screen and do so on every map move/moveend
        map.on('data', function (e) {
            if (e.sourceId !== 'safety_points' || !e.isSourceLoaded) return;

            map.on('move', updateMarkers);
            map.on('moveend', updateMarkers);
            updateMarkers();
        });

        map.on("mousemove", "points", function (e) {
            var street_address = e.features[0].properties.street_address;
            var score = e.features[0].properties.score;
            
            if (e.features.length > 0) {
                if (point_id) {
                    map.setFeatureState({ source: 'safety_points', id: point_id }, { hover: false });
                    document.getElementById('point_detail').innerHTML = '<h1>Point Detail</h1><h4>' + 'Safety score: ' + score + '</h4>' + '<h4>Street address: ' + street_address + '</h4>';
                }
                point_id = e.features[0].id;
                map.setFeatureState({ source: 'safety_points', id: point_id }, { hover: true });
            }

        });

        // When the mouse leaves the state-fill layer, update the feature state of the
        // previously hovered feature.
        map.on("mouseleave", "points", function () {
            if (point_id) {
                map.setFeatureState({ source: 'safety_points', id: point_id }, { hover: false });
                document.getElementById('point_detail').innerHTML = '<h1>Point Detail</h1><h2>Hover over a point</h2><h2 style="font-size:12px;>The number in a cluster means how many points that area covers, drill down to see the safety score of each point.</h2>';
            }
            id: point_id = null;
        });

    });

    // code for creating an SVG donut chart from feature properties
    function createDonutChart(props) {
        var offsets = [];
        var counts = [props.score1, props.score2, props.score3, props.score4, props.score5];
        var total = 0;
        for (var i = 0; i < counts.length; i++) {
            offsets.push(total);
            total += counts[i];

        }
        var fontSize = total >= 1000 ? 22 : total >= 100 ? 20 : total >= 10 ? 18 : 16;
        var r = total >= 1000 ? 50 : total >= 100 ? 32 : total >= 10 ? 24 : 18;
        var r0 = Math.round(r * 0.6);
        var w = r * 2;

        var html = '<svg width="' + w + '" height="' + w + '" viewbox="0 0 ' + w + ' ' + w +
            '" text-anchor="middle" style="font: ' + fontSize + 'px sans-serif">';

        for (i = 0; i < counts.length; i++) {
            html += donutSegment(offsets[i] / total, (offsets[i] + counts[i]) / total, r, r0, colors[i]);
        }
        html += '<circle cx="' + r + '" cy="' + r + '" r="' + r0 +
            '" fill="white" /><text dominant-baseline="central" transform="translate(' +
            r + ', ' + r + ')">' + total.toLocaleString() + '</text></svg>';

        var el = document.createElement('div');
        el.innerHTML = html;
        return el.firstChild;
    }

    function donutSegment(start, end, r, r0, color) {
        if (end - start === 1) end -= 0.00001;
        var a0 = 2 * Math.PI * (start - 0.25);
        var a1 = 2 * Math.PI * (end - 0.25);
        var x0 = Math.cos(a0), y0 = Math.sin(a0);
        var x1 = Math.cos(a1), y1 = Math.sin(a1);
        var largeArc = end - start > 0.5 ? 1 : 0;

        return ['<path d="M', r + r0 * x0, r + r0 * y0, 'L', r + r * x0, r + r * y0,
            'A', r, r, 0, largeArc, 1, r + r * x1, r + r * y1,
            'L', r + r0 * x1, r + r0 * y1, 'A',
            r0, r0, 0, largeArc, 0, r + r0 * x0, r + r0 * y0,
            '" fill="' + color + '" />'].join(' ');
    }
}));

//$(document).ready(getData(function (data) {
//    var locations = [];
//    for (i = 0; i < data.length; i++) {
//        var longitude = parseFloat(data[i].X);
//        var latitude = parseFloat(data[i].Y);
//        var bar_score = parseFloat(data[i].Bar_score);
//        var cam_score = parseFloat(data[i].Cam_score);
//        var cafe_score = parseFloat(data[i].Cafe_score);
//        var light_score = parseFloat(data[i].Light_score);
//        var street_address = data[i].Street_address;
//        var score = (cam_score + light_score + cafe_score - bar_score) / 4;
//        var point = {
//            'latitude': latitude,
//            'longitude': longitude,
//            'score': roundtToDecimal(score),
//            'street_address': street_address
//        };
//        locations.push(point);
//    }
//    var point_data = [];
//    for (i = 0; i < locations.length; i++) {
//        var feature = {
//            'type': 'Feature',
//            'properties': {
//                'score': locations[i].score,
//                'street_address': locations[i].street_address
//            },
//            'geometry': {
//                'type': 'Point',
//                'coordinates': [locations[i].longitude, locations[i].latitude]
//            },
//            'id': i
//        };
//        point_data.push(feature);
//    }

//    mapboxgl.accessToken = TOKEN;
//    var bounds = [
//        [144.894814, -37.849045], // Southwest coordinates
//        [145.011489, -37.770892]  // Northeast coordinates
//    ];
//    var map = new mapboxgl.Map({
//        container: 'safetymap',
//        style: 'mapbox://styles/mapbox/dark-v10',
//        zoom: 6,
//        center: [144.9630189, -37.81073331],
//        maxBounds: bounds
//    });

//    var point_id = null;
//    map.on('load', function () {
//        map.addSource("safety_point", {
//            "type": "geojson",
//            'data': {
//                'type': 'FeatureCollection',
//                'features': point_data
//            }
//        });
//        // Add a layer showing the points.
//        map.addLayer({
//            'id': 'points',
//            'type': 'circle',
//            'source': "safety_point",
//            'paint': {
//                // make circles larger as the user zooms from z12 to z22
//                'circle-radius': {
//                    'base': 1.75,
//                    'stops': [[12, 7], [22, 180]]
//                },
//                'circle-color':
//                {
//                    'property': 'score',
//                    'stops': [
//                        [2.0, "#EAE6F4"],
//                        [4.0, "#D7CCE9"],
//                        [6.0, "#B9A6DB"],
//                        [8.0, '#B098D4'],
//                        [10.0, '#A17DD0']
//                    ]
//                },
//                'circle-opacity': ["case",
//                    ["boolean", ["feature-state", "hover"], false],
//                    2,
//                    0.7
//                ]
//            }
//        });
//        //map.addControl(new MapboxGeocoder({
//        //    accessToken: mapboxgl.accessToken
//        //}));;
//        map.addControl(new mapboxgl.NavigationControl());
        
//        map.on("mousemove", "points", function (e) {
//            var description = '<h1 id="firstHeading" class="firstHeading">' + e.features[0].properties.score + '</h1>' + '<p>' + e.features[0].properties.street_address + '</p>';
//            if (e.features.length > 0) {
//                if (point_id) {
//                    //map.setPaintProperty(, id: point_id }, { hover: false });
//                    map.setFeatureState({ source: 'safety_point', id: point_id }, { hover: false });
//                    document.getElementById('point_detail').innerHTML = description;
//                }
//                point_id = e.features[0].id;
//                map.setFeatureState({ source: 'safety_point', id: point_id }, { hover: true });
//            }
            
//        });

//        // When the mouse leaves the state-fill layer, update the feature state of the
//        // previously hovered feature.
//        map.on("mouseleave", "points", function () {
//            if (point_id) {
//                map.setFeatureState({ source: 'safety_point', id: point_id }, { hover: false });
//            }
//            id: point_id = null;
//        });
//        // When a click event occurs on a feature in the places layer, open a popup at the
//        // location of the feature, with description HTML from its properties.
//        map.on("click", "points", function (e) {
//            var coordinates = e.features[0].geometry.coordinates.slice();
//            var description = '<h1 id="firstHeading" class="firstHeading">' + e.features[0].properties.score + '</h1>' + '<p>' + e.features[0].properties.street_address + '</p>';
//            // Ensure that if the map is zoomed out such that multiple
//            // copies of the feature are visible, the popup appears
//            // over the copy being pointed to.
//            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
//                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
//            }
//            new mapboxgl.Popup()
//                .setLngLat(coordinates)
//                .setHTML(description)
//                .addTo(map);
//        });
//        // Change the cursor to a pointer when the mouse is over the places layer.
//        map.on('mouseenter', 'points', function () {
//            map.getCanvas().style.cursor = 'pointer';
//        });
//        // Change it back to a pointer when it leaves.
//        map.on('mouseleave', 'points', function () {
//            map.getCanvas().style.cursor = '';
//        });

//    });
//}));

function getPreference() {
    var cam_coef = document.getElementById("cam_input").value;
    var light_coef = document.getElementById("light_input").value;
    var cafe_coef = document.getElementById("light_input").value;
    var bar_coef = document.getElementById("bar_input").value;
    getData(function (data) {
        var locations = [];
        for (i = 0; i < data.length; i++) {
            var longitude = parseFloat(data[i].X);
            var latitude = parseFloat(data[i].Y);
            var bar_score = parseFloat(data[i].Bar_score);
            var cam_score = parseFloat(data[i].Cam_score);
            var cafe_score = parseFloat(data[i].Cafe_score);
            var light_score = parseFloat(data[i].Light_score);
            var street_address = data[i].Street_address;
            var score = Math.abs(cam_score * cam_coef + light_score * light_coef + cafe_score * cafe_coef - bar_score * bar_coef)/3;
            var point = {
                'latitude': latitude,
                'longitude': longitude,
                'score': roundtToDecimal(score),
                'street_address': street_address
            };
            locations.push(point);
        }
        var point_data = [];
        for (i = 0; i < locations.length; i++) {
            var feature = {
                'type': 'Feature',
                'properties': {
                    'score': locations[i].score,
                    'street_address': locations[i].street_address
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [locations[i].longitude, locations[i].latitude]
                },
                'id': i
            };
            point_data.push(feature);
        }

        mapboxgl.accessToken = TOKEN;
        var bounds = [
            [144.894814, -37.849045], // Southwest coordinates
            [145.011489, -37.770892]  // Northeast coordinates
        ];
        var map = new mapboxgl.Map({
            container: 'safetymap',
            style: 'mapbox://styles/mapbox/dark-v10',
            zoom: 4,
            center: [144.9630189, -37.81073331],
            maxBounds: bounds
        });
        //Create source
        map.addControl(new mapboxgl.NavigationControl());
        map.addControl(new mapboxgl.FullscreenControl());

        // filters for classifying safety level into five categories based on score
        var score1 = ["<", ["get", "score"], 2];
        var score2 = ["all", [">=", ["get", "score"], 2], ["<", ["get", "score"], 4]];
        var score3 = ["all", [">=", ["get", "score"], 4], ["<", ["get", "score"], 6]];
        var score4 = ["all", [">=", ["get", "score"], 6], ["<", ["get", "score"], 8]];
        var score5 = [">=", ["get", "score"], 8];

        // colors to use for the categories
        //var colors = ['#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c'];
        var colors = ['#EAE6F4', '#D7CCE9', '#B9A6DB', '#B098D4', '#A17DD0'];
        var point_id = null;
        map.on('load', function () {
            // add a clustered GeoJSON source for a sample set of earthquakes
            map.addSource("safety_points", {
                "type": "geojson",
                'data': {
                    'type': 'FeatureCollection',
                    'features': point_data
                },
                "cluster": true,
                "clusterRadius": 80,
                "clusterProperties": { // keep separate counts for each magnitude category in a cluster
                    "score1": ["+", ["case", score1, 1, 0]],
                    "score2": ["+", ["case", score2, 1, 0]],
                    "score3": ["+", ["case", score3, 1, 0]],
                    "score4": ["+", ["case", score4, 1, 0]],
                    "score5": ["+", ["case", score5, 1, 0]]
                }
            });
            // circle and symbol layers for rendering individual earthquakes (unclustered points)
            map.addLayer({
                "id": "points",
                "type": "circle",
                "source": "safety_points",
                "filter": ["!=", "cluster", true],
                "paint": {
                    "circle-color": ["case",
                        score1, colors[0],
                        score2, colors[1],
                        score3, colors[2],
                        score4, colors[3],colors[4]],
                    "circle-opacity": ["case",
                        ["boolean", ["feature-state", "hover"], false],
                        2,
                        0.7],
                    "circle-radius": 16
                }
            });
            map.addLayer({
                "id": "points_label",
                "type": "symbol",
                "source": "safety_points",
                "filter": ["!=", "cluster", true],
                "layout": {
                    "text-field": ["number-format", ["get", "score"], { "min-fraction-digits": 1, "max-fraction-digits": 1 }],
                    "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                    "text-size": 12
                },
                "paint": {
                    "text-color": ["case", ["<", ["get", "score"], 3], "black", "white"]
                }
            });

            // objects for caching and keeping track of HTML marker objects (for performance)
            var markers = {};
            var markersOnScreen = {};

            function updateMarkers() {
                var newMarkers = {};
                var features = map.querySourceFeatures('safety_points');

                // for every cluster on the screen, create an HTML marker for it (if we didn't yet),
                // and add it to the map if it's not there already
                for (var i = 0; i < features.length; i++) {
                    var coords = features[i].geometry.coordinates;
                    var props = features[i].properties;
                    if (!props.cluster) continue;
                    var id = props.cluster_id;

                    var marker = markers[id];
                    if (!marker) {
                        var el = createDonutChart(props);
                        marker = markers[id] = new mapboxgl.Marker({ element: el }).setLngLat(coords);
                    }
                    newMarkers[id] = marker;

                    if (!markersOnScreen[id])
                        marker.addTo(map);
                }
                // for every marker we've added previously, remove those that are no longer visible
                for (id in markersOnScreen) {
                    if (!newMarkers[id])
                        markersOnScreen[id].remove();
                }
                markersOnScreen = newMarkers;
            }

            // after the GeoJSON data is loaded, update markers on the screen and do so on every map move/moveend
            map.on('data', function (e) {
                if (e.sourceId !== 'safety_points' || !e.isSourceLoaded) return;

                map.on('move', updateMarkers);
                map.on('moveend', updateMarkers);
                updateMarkers();
            });

            map.on("mousemove", "points", function (e) {
                var street_address = e.features[0].properties.street_address;
                var score = e.features[0].properties.score;
                if (e.features.length > 0) {
                    if (point_id) {
                        map.setFeatureState({ source: 'safety_points', id: point_id }, { hover: false });
                        document.getElementById('point_detail').innerHTML = '<h1>Point Detail</h1><h4>' + 'Safety score: ' + score + '</h4>' + '<h4>Street address: ' + street_address + '</h4>';
                    }
                    point_id = e.features[0].id;
                    map.setFeatureState({ source: 'safety_points', id: point_id }, { hover: true });
                }

            });

            // When the mouse leaves the state-fill layer, update the feature state of the
            // previously hovered feature.
            map.on("mouseleave", "points", function () {
                if (point_id) {
                    map.setFeatureState({ source: 'safety_points', id: point_id }, { hover: false });
                    document.getElementById('point_detail').innerHTML = '<h1>Point Detail</h1><h2>Hover over a point</h2><h2 style="font-size:12px;>The number in a cluster means how many points that area covers, drill down to see the safety score of each point.</h2>';
                }
                id: point_id = null;
            });
        });

        // code for creating an SVG donut chart from feature properties
        function createDonutChart(props) {
            var offsets = [];
            var counts = [props.score1, props.score2, props.score3, props.score4, props.score5];
            var total = 0;
            for (var i = 0; i < counts.length; i++) {
                offsets.push(total);
                total += counts[i];
            }
            var fontSize = total >= 1000 ? 22 : total >= 100 ? 20 : total >= 10 ? 18 : 16;
            var r = total >= 1000 ? 50 : total >= 100 ? 32 : total >= 10 ? 24 : 18;
            var r0 = Math.round(r * 0.6);
            var w = r * 2;

            var html = '<svg width="' + w + '" height="' + w + '" viewbox="0 0 ' + w + ' ' + w +
                '" text-anchor="middle" style="font: ' + fontSize + 'px sans-serif">';

            for (i = 0; i < counts.length; i++) {
                html += donutSegment(offsets[i] / total, (offsets[i] + counts[i]) / total, r, r0, colors[i]);
            }
            html += '<circle cx="' + r + '" cy="' + r + '" r="' + r0 +
                '" fill="white" /><text dominant-baseline="central" transform="translate(' +
                r + ', ' + r + ')">' + total.toLocaleString() + '</text></svg>';

            var el = document.createElement('div');
            el.innerHTML = html;
            return el.firstChild;
        }

        function donutSegment(start, end, r, r0, color) {
            if (end - start === 1) end -= 0.00001;
            var a0 = 2 * Math.PI * (start - 0.25);
            var a1 = 2 * Math.PI * (end - 0.25);
            var x0 = Math.cos(a0), y0 = Math.sin(a0);
            var x1 = Math.cos(a1), y1 = Math.sin(a1);
            var largeArc = end - start > 0.5 ? 1 : 0;

            return ['<path d="M', r + r0 * x0, r + r0 * y0, 'L', r + r * x0, r + r * y0,
                'A', r, r, 0, largeArc, 1, r + r * x1, r + r * y1,
                'L', r + r0 * x1, r + r0 * y1, 'A',
                r0, r0, 0, largeArc, 0, r + r0 * x0, r + r0 * y0,
                '" fill="' + color + '" />'].join(' ');
        }

        });

}

//function getPreference() {
//    var cam_coef = document.getElementById("cam_input").value;
//    var light_coef = document.getElementById("light_input").value;
//    var cafe_coef = document.getElementById("light_input").value;
//    var bar_coef = document.getElementById("bar_input").value;
//    getData(function (data) {
//        var locations = [];
//        for (i = 0; i < data.length; i++) {
//            var longitude = parseFloat(data[i].X);
//            var latitude = parseFloat(data[i].Y);
//            var bar_score = parseFloat(data[i].Bar_score);
//            var cam_score = parseFloat(data[i].Cam_score);
//            var cafe_score = parseFloat(data[i].Cafe_score);
//            var light_score = parseFloat(data[i].Light_score);
//            var street_address = data[i].Street_address;
//            var score = (cam_score*cam_coef + light_score*light_coef + cafe_score*cafe_coef - bar_score*bar_coef);
//            var point = {
//                'latitude': latitude,
//                'longitude': longitude,
//                'score': roundtToDecimal(score),
//                'street_address': street_address
//            };
//            locations.push(point);
//        }
//        var point_data = [];
//        for (i = 0; i < locations.length; i++) {
//            var feature = {
//                'type': 'Feature',
//                'properties': {
//                    'score': locations[i].score,
//                    'street_address': locations[i].street_address
//                },
//                'geometry': {
//                    'type': 'Point',
//                    'coordinates': [locations[i].longitude, locations[i].latitude]
//                },
//                'id': i
//            };
//            point_data.push(feature);
//        }

//        mapboxgl.accessToken = TOKEN;
//        var bounds = [
//            [144.894814, -37.849045], // Southwest coordinates
//            [145.011489, -37.770892]  // Northeast coordinates
//        ];
//        var map = new mapboxgl.Map({
//            container: 'safetymap',
//            style: 'mapbox://styles/mapbox/dark-v10',
//            zoom: 6,
//            center: [144.9630189, -37.81073331],
//            maxBounds: bounds
//        });
//        //Create source
//        map.addSource("safety_point", {
//            "type": "geojson",
//            'data': {
//                'type': 'FeatureCollection',
//                'features': point_data
//            }
//        });

//        map.on('load', function () {
//            // Add a layer showing the points.
//            map.addLayer({
//                'id': 'points',
//                'type': 'circle',
//                'source': "safety_point",
//                'paint': {
//                    // make circles larger as the user zooms from z12 to z22
//                    'circle-radius': {
//                        'base': 1.75,
//                        'stops': [[12, 7], [22, 180]]
//                    },
//                    'circle-color': {
//                        'property': 'score',
//                        'stops': [
//                            [2.0, "#EAE6F4"],
//                            [4.0, "#D7CCE9"],
//                            [6.0, "#B9A6DB"],
//                            [8.0, '#B098D4'],
//                            [10.0,'#A17DD0']
//                        ]
//                    },
//                    'circle-opacity': 0.7
//                }
//            });
//            //map.addControl(new MapboxGeocoder({
//            //    accessToken: mapboxgl.accessToken
//            //}));;
//            map.addControl(new mapboxgl.NavigationControl());
//            // When a click event occurs on a feature in the places layer, open a popup at the
//            // location of the feature, with description HTML from its properties.
//            map.on('mousemove', function (e) {
//                var features = map.queryRenderedFeatures(e.point);
//                document.getElementById('features').innerHTML = JSON.stringify(features, null, 2);
//            });
//            map.on("click", "points", function (e) {
//                var coordinates = e.features[0].geometry.coordinates.slice();
//                var description = '<h1 id="firstHeading" class="firstHeading">' + e.features[0].properties.score + '</h1>' + '<p>' + e.features[0].properties.street_address + '</p>';
//                // Ensure that if the map is zoomed out such that multiple
//                // copies of the feature are visible, the popup appears
//                // over the copy being pointed to.
//                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
//                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
//                }
//                new mapboxgl.Popup()
//                    .setLngLat(coordinates)
//                    .setHTML(description)
//                    .addTo(map);
//            });
//            // Change the cursor to a pointer when the mouse is over the places layer.
//            map.on('mouseenter', 'points', function () {
//                map.getCanvas().style.cursor = 'pointer';
//            });
//            // Change it back to a pointer when it leaves.
//            map.on('mouseleave', 'points', function () {
//                map.getCanvas().style.cursor = '';
//            });

//        });
//    });
    
//}

/*var locations = [];
$('.coordinates').each(function () {
    var latitude = $('.latitude', this).text().trim();
    var longitude = $('.longitude', this).text().trim();
    //var score = parseFloat($('.cam_score', this).text().trim())
        //+ parseFloat($('.cafe_score', this).text().trim()) * ;
    var point = {
        'latitude': latitude,
        'longitude': longitude,
        'description': score
    };
    locations.push(point);
});*/
/*var data = [];
for (i = 0; i < locations.length; i++) {
    var feature = {
        'type': 'Feature',
        'properties': {
            'description': parseFloat(locations[i].description)
        },
        'geometry': {
            'type': 'Point',
            'coordinates': [locations[i].longitude, locations[i].latitude]
        }
    };
    data.push(feature);
}

mapboxgl.accessToken = TOKEN;
var bounds = [
    [144.894814, -37.849045], // Southwest coordinates
    [145.011489, -37.770892]  // Northeast coordinates
];
var map = new mapboxgl.Map({
    container: 'safetymap',
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 6,
    center: [144.9630189, -37.81073331],
    maxBounds: bounds
});

/*map.on('load', function () {
    // Add a layer showing the points.
    map.addLayer({
        'id': 'points',
        'type': 'circle',
        'source': {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': data
            }
        },
        'paint': {
            // make circles larger as the user zooms from z12 to z22
            'circle-radius': {
                'base': 1.75,
                'stops': [[12, 7], [22, 180]]
            },
            'circle-color': {
                'property': 'description',
                'stops': [
                    [2.0, '#e6ffe6'],
                    [3.0, '#ccffcc'],
                    [4.0, '#b3ffb3'],
                    [5.0, "#99ff99"],
                    [6.0, "#80ff80"],
                    [7.0, "#66ff66"],
                    [8.0, "#4dff4d"],
                    [9.0, "#33ff33"],
                    [10.0, "#1aff1a"]
                ]
            },
            'circle-opacity': 0.7
        }
    });
    //map.addControl(new MapboxGeocoder({
    //    accessToken: mapboxgl.accessToken
    //}));;
    map.addControl(new mapboxgl.NavigationControl());
    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    map.on("click", "points", function (e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = e.features[0].properties.description;
        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
    });
    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'points', function () {
        map.getCanvas().style.cursor = 'pointer';
    });
    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'points', function () {
        map.getCanvas().style.cursor = '';
    });

});*/

