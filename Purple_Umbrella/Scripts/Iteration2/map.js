const TOKEN = 'pk.eyJ1Ijoia2VvbnlhbWF0byIsImEiOiJjamw4cXR0MjcxZ24yM2txa2VhazJ2MmY5In0.b3cxVs4DdITNSJYZGzt9pA';

function roundtToDecimal(num) {
    return Math.round(num * 100) / 100;
}

function getData(callback) {
    $.get("/Road_Segments/ReturnAllRoadSegments", function (data) {
        callback(data);
    });
}

$(document).ready(getData(function (data) {
    var roadSegments = [];
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
        var index = Math.abs(camera_Index + light_Index + cafe_Index - bar_Index);
        var roadSegment = {
            'id': id,
            'name': name,
            'coordinate_1': coordinate_1,
            'coordinate_2': coordinate_2,
            'index': roundtToDecimal(index)
        };
        roadSegments.push(roadSegment);
    }
    var road_data = [];
    for (i = 0; i < roadSegments.length; i++) {
        var feature = {
                'type': 'Feature',
                'properties': {
                    'index': roadSegments[i].index,
                    'name': roadSegments[i].name,
                    'color': '#F7455D' // red
                },
                'geometry': {
                    'type': 'LineString',
                    'coordinates': [roadSegments[i].coordinate_1,roadSegments[i].coordinate_2]
                },
                'id': roadSegments[i].id
            };
        road_data.push(feature);
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
        pitch: 45,
        bearing: -17.6,
        center: [144.9630189, -37.81073331],
        maxBounds: bounds
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
    var road_id = null;

    map.on('load', function () {
        var layers = map.getStyle().layers;
        // Find the index of the first symbol layer in the map style
        var firstSymbolId;
        for (var i = 0; i < layers.length; i++) {
            if (layers[i].type === 'symbol') {
                firstSymbolId = layers[i].id;
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
                        [2.0, "#EAE6F4"],
                        [4.0, "#D7CCE9"],
                        [6.0, "#B9A6DB"],
                        [8.0, '#B098D4'],
                        [10.0, '#A17DD0']
                    ]
                }
            }
        }, firstSymbolId);

        //var layers = map.getStyle().layers;

        //var labelLayerId;
        //for (var i = 0; i < layers.length; i++) {
        //    if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
        //        labelLayerId = layers[i].id;
        //        break;
        //    }
        //}

        map.addLayer({
            'id': '3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 15,
            'paint': {
                'fill-extrusion-color': '#aaa',

                // use an 'interpolate' expression to add a smooth transition effect to the
                // buildings as the user zooms in
                'fill-extrusion-height': [
                    "interpolate", ["linear"], ["zoom"],
                    15, 0,
                    15.05, ["get", "height"]
                ],
                'fill-extrusion-base': [
                    "interpolate", ["linear"], ["zoom"],
                    15, 0,
                    15.05, ["get", "min_height"]
                ],
                'fill-extrusion-opacity': .6
            }
        }, labelLayerId);
        
        map.on("mousemove", "lines", function (e) {
            var name = e.features[0].properties.name;
            var index = e.features[0].properties.index;

            if (e.features.length > 0) {
                if (road_id) {
                    map.setFeatureState({ source: 'road_segments', id: road_id }, { hover: false });
                    document.getElementById('point_detail').innerHTML = '<h1>Point Detail</h1><h4>' + 'Safety score: ' + index + '</h4>' + '<h4>Street address: ' + name + '</h4>';
                }
                road_id = e.features[0].id;
                map.setFeatureState({ source: 'safety_points', id: road_id }, { hover: true });
            }

        });

        // When the mouse leaves the state-fill layer, update the feature state of the
        // previously hovered feature.
        map.on("mouseleave", "lines", function () {
            if (road_id) {
                map.setFeatureState({ source: 'raod_segments', id: road_id }, { hover: false });
                document.getElementById('point_detail').innerHTML = '<h1>Point Detail</h1><h2>Hover over a point</h2><h2 style="font-size:12px;>The number in a cluster means how many points that area covers, drill down to see the safety score of each point.</h2>';
            }
            id: road_id = null;
        });

    });
}));