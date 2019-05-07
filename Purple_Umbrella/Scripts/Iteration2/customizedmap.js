//NewValue = (((OldValue - OldMin) * (NewMax - NewMin)) / (OldMax - OldMin)) + NewMin
function newIndex(oldList, oldMin, oldMax) {
    var newList = [];
    for (x = 0; x < oldList.length; x++) {
        var oldIndex = oldList[x].index;
        var newIndex = (((oldIndex - oldMin) * (4.8 - 0.2)) / (oldMax - oldMin)) + 0.2;
        var roadSegment = {
            'id': oldList[x].id,
            'name': oldList[x].name,
            'coordinate_1': oldList[x].coordinate_1,
            'coordinate_2': oldList[x].coordinate_2,
            'index': roundtToDecimal(newIndex)
        };
        newList.push(roadSegment);
    }
    return newList;
}

function getSettings() {
    var cam = $("#cam").prop("checked") ?  1 : 10;
    var light = $("#light").prop("checked") ? 0.7 : 10;
    var store = $("#store").prop("checked") ? 0.7 : 5;
    var pede = $("#pede").prop("checked") ? 1 : 10;
    var bar = $("#bar").prop("checked") ?  1 : 0.1;
    //Math.floor(Math.random() * 10) + 5
    getData(function (data) {
        var roadSegments = [];
        var oldMin = 100;
        var oldMax = -100;
        for (i = 0; i < data.length; i++) {
            var id = parseInt(data[i].Id);
            var name = data[i].Name;
            var point1_x = parseFloat(data[i].Point1_X);
            var point1_y = parseFloat(data[i].Point1_Y);
            var point2_x = parseFloat(data[i].Point2_X);
            var point2_y = parseFloat(data[i].Point2_Y);
            var coordinate_1 = [point1_x, point1_y];
            var coordinate_2 = [point2_x, point2_y];
            var bar_Index = parseFloat(data[i].Bar_Index);
            var cafe_Index = parseFloat(data[i].Cafe_Index);
            var camera_Index = parseFloat(data[i].Camera_Index);
            var light_Index = parseFloat(data[i].Light_Index);
            var index = cam * camera_Index + light * light_Index + store * cafe_Index + bar * bar_Index;
            if (index <= oldMin) {
                oldMin = index;
            }
            if (index >= oldMax) {
                oldMax = index;
            }
            var roadSegment = {
                'id': id,
                'name': name,
                'coordinate_1': coordinate_1,
                'coordinate_2': coordinate_2,
                'index': roundtToDecimal(index)
            };
            roadSegments.push(roadSegment);
        }
        var newRoadSegments = newIndex(roadSegments, oldMin, oldMax);
        var road_data = [];
        for (i = 0; i < newRoadSegments.length; i++) {
            var feature = {
                'type': 'Feature',
                'properties': {
                    'index': newRoadSegments[i].index,
                    'name': newRoadSegments[i].name,
                    'color': '#F7455D' // red
                },
                'geometry': {
                    'type': 'LineString',
                    'coordinates': [newRoadSegments[i].coordinate_1, newRoadSegments[i].coordinate_2]
                },
                'id': newRoadSegments[i].id
            };
            road_data.push(feature);
        }

        mapboxgl.accessToken = TOKEN;
        var bounds = [
            [144.930764, -37.824244], // Southwest coordinates
            [144.982105, -37.807000]  // Northeast coordinates
        ];
        var map = new mapboxgl.Map({
            container: 'safetymap',
            style: 'mapbox://styles/mapbox/dark-v10',
            zoom: 14,
            pitch: 45,
            center: [144.958429, -37.815858],
            //maxBounds: bounds
        });

        map.addControl(new mapboxgl.FullscreenControl({ container: document.querySelector('map') }));
        map.addControl(new mapboxgl.NavigationControl());
        var directions = new MapboxDirections({
            accessToken: mapboxgl.accessToken,
            profile: "mapbox/walking",
            alternatives: true,
            unit: "metric",
            interactive: false,
            controls: {
                profileSwitcher: false
            },
            placeholderOrigin: "Enter a starting place",
            placeholderDestination: "Enter destination"
        });
        map.addControl(directions, 'top-left');
        //getCurrentLocation(function (result) {
        //    directions.setOrigin(result);
        //});

        var geolocate = new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true,
                timeout: 6000,
                maximumAge: 0
            },
            trackUserLocation: true
        });
        map.addControl(geolocate);

        //check user's current location whether in our service site
        (function () {
            var proxied = geolocate._updateCamera;
            geolocate._updateCamera = function () {
                // get geolocation
                var location = new mapboxgl.LngLat(arguments[0].coords.longitude, arguments[0].coords.latitude);

                let bounds = map.getMaxBounds();

                if (bounds) {
                    // if geolocation is within maxBounds
                    if (location.longitude >= bounds.getWest() && location.longitude <= bounds.getEast() &&
                        location.latitude >= bounds.getSouth && location.latitude <= bounds.getNorth) {
                        return proxied.apply(this, arguments);
                    } else {
                        alert('Your current location is out of our service site.');
                        return null;
                    }
                }
                return proxied.apply(this, arguments);
            };
        })();

        map.addControl(draw);
        //trackUser(map);

        // filters for classifying safety level into five categories based on score
        var score1 = ["<", ["get", "score"], 2];
        var score2 = ["all", [">=", ["get", "score"], 2], ["<", ["get", "score"], 4]];
        var score3 = ["all", [">=", ["get", "score"], 4], ["<", ["get", "score"], 6]];
        var score4 = ["all", [">=", ["get", "score"], 6], ["<", ["get", "score"], 8]];
        var score5 = [">=", ["get", "score"], 8];

        // colors to use for the categories
        var colors = ['#EAE6F4', '#D7CCE9', '#B9A6DB', '#B098D4', '#A17DD0'];
        var road_id = null;

        map.on('load', function () {
            var layers = map.getStyle().layers;
            // Find the index of the first symbol layer in the map style
            var firstSymbolId;
            var labelLayerId;
            for (var i = 0; i < layers.length; i++) {
                if (layers[i].type === 'symbol') {
                    firstSymbolId = layers[i].id;
                    if (layers[i].layout['text-field']) {
                        labelLayerId = layers[i].id;
                    }
                    break;
                }
            }
            // add a clustered GeoJSON source for a sample set of earthquakes
            map.addSource("road_segments", {
                "type": "geojson",
                'data': {
                    'type': 'FeatureCollection',
                    'features': road_data
                }
            });
            // circle and symbol layers for rendering individual safety points (unclustered points)
            map.addLayer({
                "id": "lines",
                "type": "line",
                "source": "road_segments",
                'paint': {
                    'line-width':
                    {
                        'base': 15,
                        'stops': [[12, 5], [22, 300]]
                    },
                    // Use a get expression (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-get)
                    // to set the line-color to a feature property value.
                    //'line-color': ['get', 'color']
                    'line-color':
                    {
                        'property': 'index',
                        'stops': [
                            [1.0, "#FF3333"],//"#EAE6F4"],
                            [2.0, "#FF9999"],//"#D7CCE9"],
                            [3.0, "#FFFF66"],//"#B9A6DB"],
                            [4.0, "#98FB98"],//'#B098D4'],
                            [5.0, "#32CD32"]//'#A17DD0']
                        ]
                    }
                }
            }, firstSymbolId);

            map.on('click', 'lines', function (e) {
                var id = parseInt(e.features[0].id);
                var index = e.features[0].properties.index;
                getFeedbackFromDb(id, function (data) {
                    var description = "<div id='feedback_css'><h4 style='font-size: 16px;'>Safety Index: " + index + "</h4>"
                        + "<h4>How users feel:</h4>"
                        + "<div class='row' style='margin-left:0px;'>"
                        + "<img style='width: 18px;height: 18px;' src='../Content/Iteration2/css/img/unhappy.png'>"
                        + "<p style='font-size:18px;display:inline-block;padding-top:5px;'> Unsafe: " + data.Negative + "</p>"
                        + "</div>"
                        + "<div class='row' style='margin-left:0px;'>"
                        + "<img style='width: 18px;height: 18px;' src='../Content/Iteration2/css/img/netural.png'><p style='font-size:18px;display:inline-block;padding-top:5px;'>Netural: " + data.Neutral + "</p>"
                        + "</div>"
                        + "<div class='row' style='margin-left:0px;'>"
                        + "<img style='width: 18px;height: 18px;' src='../Content/Iteration2/css/img/happy.png'><p style='font-size:18px;display:inline-block;padding-top:5px;'>Safe: " + data.Positive + "</p>"
                        + "</div>"
                        + "<div id='feedback'><button onclick='giveFeedback(" + id + ")'>Give my feedback</button></div></div>";
                    new mapboxgl.Popup()
                        .setLngLat(e.lngLat)
                        .setHTML(description)
                        .addTo(map);
                });

            });

            // Change the cursor to a pointer when the mouse is over the states layer.
            map.on('mouseenter', 'lines', function () {
                map.getCanvas().style.cursor = 'pointer';
            });

            // Change it back to a pointer when it leaves.
            map.on('mouseleave', 'lines', function () {
                map.getCanvas().style.cursor = '';
            });

            //Display popup when user touch a line
            var popup = new mapboxgl.Popup({
                closeButton: true
            });
            map.on("touchstart", "lines", function (e) {
                var id = parseInt(e.features[0].id);
                var index = e.features[0].properties.index;
                getFeedbackFromDb(id, function (data) {
                    var description = "<div id='feedback_css'>"
                        + "<h4 style='font-size: 16px;'>Safety Index: " + index + "</h4>"
                        + "<h4>How users feel:</h4>"
                        + "<div class='row' style='margin-left:0px;'>"
                        + "<img style='width: 18px;height: 18px;' src='../Content/Iteration2/css/img/unhappy.png'>"
                        + "<p style='font-size:18px;display:inline-block;padding-top:5px;'> Unsafe: " + data.Negative + "</p>"
                        + "</div>"
                        + "<div class='row' style='margin-left:0px;'>"
                        + "<img style='width: 18px;height: 18px;' src='../Content/Iteration2/css/img/netural.png'><p style='font-size:18px;display:inline-block;padding-top:5px;'>Netural: " + data.Neutral + "</p>"
                        + "</div>"
                        + "<div class='row' style='margin-left:0px;'>"
                        + "<img style='width: 18px;height: 18px;' src='../Content/Iteration2/css/img/happy.png'><p style='font-size:18px;display:inline-block;padding-top:5px;'>Safe: " + data.Positive + "</p>"
                        + "</div>"
                        + "<div id='feedback'>"
                        + "<button onclick='giveFeedback(" + id + ")'>Give my feedback</button>"
                        + "</div>"
                        + "</div>";
                    popup.setLngLat(e.lngLat)
                        .setHTML(description)
                        .addTo(map);
                });

            });
        });
        map.on('draw.create', updateRoute);
        map.on('draw.update', updateRoute);
        map.on('draw.delete', removeRoute);

        // Use the coordinates drew to make the Map Matching API request
        function updateRoute() {
            // Set the profile
            var profile = "walking";
            // Get the coordinates that were drawn on the map
            var data = draw.getAll();
            var lastFeature = data.features.length - 1;
            var coords = data.features[lastFeature].geometry.coordinates;
            // Format the coordinates
            var newCoords = coords.join(';');
            // Set the radius for each coordinate pair to 25 meters
            var radius = [];
            coords.forEach(element => {
                radius.push(25);
            });
            getMatch(newCoords, radius, profile);
        }

        // Make a Map Matching request
        function getMatch(coordinates, radius, profile) {
            // Separate the radiuses with semicolons
            var radiuses = radius.join(';')
            // Create the query
            var query = 'https://api.mapbox.com/matching/v5/mapbox/' + profile + '/' + coordinates + '?geometries=geojson&radiuses=' + radiuses + '&steps=true&access_token=' + mapboxgl.accessToken;

            $.ajax({
                method: 'GET',
                url: query
            }).done(function (data) {
                // Get the coordinates from the response
                var coords = data.matchings[0].geometry;
                addRoute(coords);
                // Code from the next step will go here
            });
        }

        // Draw the Map Matching route as a new layer on the map
        function addRoute(coords) {
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
        function removeRoute() {
            if (map.getSource('route')) {
                map.removeLayer('route');
                map.removeSource('route');
            } else {
                return;
            }
        }
    });
}


function roundtToDecimal(num) {
    return Math.round(num * 100) / 100;
}

function getData(callback) {
    $.get("/Road_Segments/ReturnAllRoadSegments", function (data) {
        callback(data);
    });
}

function getFeedbackFromDb(id, callback) {
    $.ajax({
        type: "Get",
        url: "/Feedbacks/ReturnFeedback",
        data: { id: id }, // passing the parameter 
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            callback(data);
        }
    });
}

function giveFeedback(id) {
    document.getElementById("feedback").innerHTML = "<form id='feedback_form'>"
        + "<input type='radio' name='Feedback' value=1>Not safe<br>"
        + "<input type='radio' name='Feedback' value=2>Neutral<br>"
        + "<input type='radio' name='Feedback' value=3>Safe<br>"
        + "<input type='button' value='Submit' onclick='pushFeedbackToBackEnd(" + id + ")'>"
        + "</form> ";
}

function pushFeedbackToBackEnd(id) {
    var choice = parseInt($("input[name='Feedback']:checked").val());
    $.ajax({
        type: "Post",
        url: "/Feedbacks/UpdateTable",
        data: JSON.stringify({ "id": id, "choice": choice }), // passing the parameter 
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            alert(data);
        }
    });
}

//function getCurrentLocation(callback) {
//    var options = {
//        enableHighAccuracy: true,
//        timeout: 5000,
//        maximumAge: 0
//    };

//    function success(pos) {
//        var lat = pos.coords.latitude;
//        var lng = pos.coords.longitude;
//        var latlng = new google.maps.LatLng(lat, lng);
//        var geocoder = new google.maps.Geocoder();
//        geocoder.geocode({ 'latLng': latlng }, function (results) {
//            console.log(results);
//            var address = results[0].formatted_address;
//            callback(address);
//        });
//        //"mapboxgl-ctrl-geocoder"
//        //alert(address);
//    }

//    function error(err) {
//        console.warn(`ERROR(${err.code}): ${err.message}`);
//    }

//    navigator.geolocation.getCurrentPosition(success, error, options);
//}


var draw = new MapboxDraw({
    // Instead of showing all the draw tools, show only the line string and delete tools
    displayControlsDefault: false,
    controls: {
        line_string: true,
        trash: true
    },
    styles: [
        // Set the line style for the user-input coordinates
        {
            "id": "gl-draw-line",
            "type": "line",
            "filter": ["all", ["==", "$type", "LineString"],
                ["!=", "mode", "static"]
            ],
            "layout": {
                "line-cap": "round",
                "line-join": "round"
            },
            "paint": {
                "line-color": "#438EE4",
                "line-dasharray": [0.2, 2],
                "line-width": 4,
                "line-opacity": 0.7
            }
        },
        // Style the vertex point halos
        {
            "id": "gl-draw-polygon-and-line-vertex-halo-active",
            "type": "circle",
            "filter": ["all", ["==", "meta", "vertex"],
                ["==", "$type", "Point"],
                ["!=", "mode", "static"]
            ],
            "paint": {
                "circle-radius": 12,
                "circle-color": "#FFF"
            }
        },
        // Style the vertex points
        {
            "id": "gl-draw-polygon-and-line-vertex-active",
            "type": "circle",
            "filter": ["all", ["==", "meta", "vertex"],
                ["==", "$type", "Point"],
                ["!=", "mode", "static"]
            ],
            "paint": {
                "circle-radius": 8,
                "circle-color": "#438EE4"
            }
        }
    ]
});