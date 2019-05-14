const TOKEN = 'pk.eyJ1Ijoia2VvbnlhbWF0byIsImEiOiJjamw4cXR0MjcxZ24yM2txa2VhazJ2MmY5In0.b3cxVs4DdITNSJYZGzt9pA';

//Create marker when user enter value 
const first_marker_popup_content = "<ul id='start-button'><li><button onclick='setAsStart()'>Start from here</button></li><li><button onclick='goThere()'>Go there</button></li></ul>";
const first_marker_popup = new mapboxgl.Popup({ offset: 35.30,close:false })
    .setHTML(first_marker_popup_content);
const first_marker = new mapboxgl.Marker({
    color: 'red',
    draggable: true
});

const second_marker = new mapboxgl.Marker({
    color: 'Green',
    draggable: true
});

mapboxgl.accessToken = TOKEN;
var bounds = [
    [144.9200, -37.8310], // Southwest coordinates
    [144.9998, -37.7879]  // Northeast coordinates
];
const main_map = new mapboxgl.Map({
    container: 'safetymap',
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 14,
    center: [144.958429, -37.815858],
    attributionControl: false
    //,maxBounds: bounds
});

$(document).ready(function () {

    let geocoder = new MapboxGeocoder({
        accessToken: 'pk.eyJ1Ijoia2VvbnlhbWF0byIsImEiOiJjamw4cXR0MjcxZ24yM2txa2VhazJ2MmY5In0.b3cxVs4DdITNSJYZGzt9pA',
        countries: 'au',
        placeholder: "Search a place",
        marker: false,
        bbox: [144.9200, -37.8310, 144.9998, -37.7879],
        //filter: function (item) {
        //    // returns true if item contains Melbourne region
        //    return item.context.map(function (i) {
        //        // id is in the form {index}.{id} per https://github.com/mapbox/carmen/blob/master/carmen-geojson.md
        //        // this example attempts to find the `region` named `New South Wales`
        //        return i.id.split('.').shift() === 'region' && i.text === 'Melbourne';
        //    }).reduce(function (acc, cur) {
        //        return acc || cur;
        //    });
        //},
        mapboxgl: mapboxgl
    });

    main_map.addControl(menuControl, "top-left");
    main_map.addControl(geocoder, "top-left");
    main_map.addControl(tutorialControl, "top-right");
    main_map.addControl(new mapboxgl.NavigationControl());
    main_map.addControl(geoLocateControl, "top-right");
    main_map.addControl(reportControl, 'top-right');

    geocoder.on('result', function (result) {
        if (first_marker !== null) {
            first_marker.remove();
            let longitude = result.result.geometry.coordinates[0];
            let latitude = result.result.geometry.coordinates[1];
            first_marker.setLngLat([longitude, latitude]).setPopup(first_marker_popup)
                .addTo(main_map);
            first_marker_popup.setLngLat([longitude, latitude]).addTo(main_map);
            first_marker.on('dragend', onDragEnd);
        }
        else {
            let longitude = result.result.geometry.coordinates[0];
            let latitude = result.result.geometry.coordinates[1];
            first_marker.setLngLat([longitude, latitude])
                .addTo(main_map);
            first_marker.on('dragend', onDragEnd);
        }

        function onDragEnd() {
            let lngLat = first_marker.getLngLat();
            let longitude = lngLat.lng;
            let latitude = lngLat.lat;
            first_marker_popup.setLngLat([longitude, latitude]).addTo(main_map);
        }
    });

    // initialize the map canvas to interact with later
    //var canvas = main_map.getCanvasContainer();
    //var start = [144.9134, -37.8415];
    // create a function to make a directions request

    //main_map.on('load', function () {
    //    // make an initial directions request that
    //    // starts and ends at the same location
    //    getRoute(start);

    //    // Add starting point to the map
    //    main_map.addLayer({
    //        id: 'start',
    //        type: 'circle',
    //        source: {
    //            type: 'geojson',
    //            data: {
    //                type: 'FeatureCollection',
    //                features: [{
    //                    type: 'Feature',
    //                    properties: {},
    //                    geometry: {
    //                        type: 'Point',
    //                        coordinates: start
    //                    }
    //                }
    //                ]
    //            }
    //        },
    //        paint: {
    //            'circle-radius': 10,
    //            'circle-color': '#3887be'
    //        }
    //    });
    //    main_map.addLayer({
    //        "id": "start_label",
    //        "type": "symbol",
    //        "source": "start",
    //        "layout": {
    //            "text-field": "A",
    //            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
    //            "text-size": 12
    //        },
    //        "paint": {
    //            "text-color": "White"
    //        }
    //    });
    //    //main_map.on('click', function (e) {
    //    //    var coordsObj = e.lngLat;
    //    //    canvas.style.cursor = '';
    //    //    var coords = Object.keys(coordsObj).map(function (key) {
    //    //        return coordsObj[key];
    //    //    });
    //    //    var end = {
    //    //        type: 'FeatureCollection',
    //    //        features: [{
    //    //            type: 'Feature',
    //    //            properties: {},
    //    //            geometry: {
    //    //                type: 'Point',
    //    //                coordinates: coords
    //    //            }
    //    //        }
    //    //        ]
    //    //    };
    //    //    if (main_map.getLayer('end') && main_map.getLayer('end_label')) {
    //    //        main_map.getSource('end').setData(end);
    //    //    } else {
    //    //        main_map.addLayer({
    //    //            id: 'end',
    //    //            type: 'circle',
    //    //            source: {
    //    //                type: 'geojson',
    //    //                data: {
    //    //                    type: 'FeatureCollection',
    //    //                    features: [{
    //    //                        type: 'Feature',
    //    //                        properties: {},
    //    //                        geometry: {
    //    //                            type: 'Point',
    //    //                            coordinates: coords
    //    //                        }
    //    //                    }]
    //    //                }
    //    //            },
    //    //            paint: {
    //    //                'circle-radius': 10,
    //    //                'circle-color': '#f30'
    //    //            }
    //    //        });
    //    //        main_map.addLayer({
    //    //            "id": "end_label",
    //    //            "type": "symbol",
    //    //            "source": "end",
    //    //            "layout": {
    //    //                "text-field": "B",
    //    //                "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
    //    //                "text-size": 12
    //    //            },
    //    //            "paint": {
    //    //                "text-color": "White"
    //    //            }
    //    //        });
    //    //    }
    //    //    getRoute(coords);
    //    //});
    //});
    main_map.on("load", function () {

        getPedestrainCount();
        addBarsLayer();
        addReportsLayer();
        addNightClubsLayer();
        getAllRoadData();
        createFilter("sensors", "Pedestrain");
        createFilter("bars", "Bars");
        createFilter("nightclubs", "Night Clubs");
        createFilter("roads", "OUR Safety index");
    });
});


function roundtToDecimal(num) {
    return Math.round(num * 100) / 100;
}

//Get road data from backend
function getAllRoadData() {
    $.get("/Road_Segments/ReturnAllRoadSegments", function (data) {
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
            var index = camera_Index + light_Index + cafe_Index + bar_Index;
            //NewValue = (((OldValue - OldMin) * (NewMax - NewMin)) / (OldMax - OldMin)) + NewMin
            var new_index = (index + 1.360181178) * (4.8 - 0.2) / (121.9326 + 1.360181178) + 0.2;
            if (name.includes("lane")) {
                let roadSegment = {
                    'id': id,
                    'name': name,
                    'type': 'Lane',
                    'coordinate_1': coordinate_1,
                    'coordinate_2': coordinate_2,
                    'index': roundtToDecimal(new_index)
                };
                roadSegments.push(roadSegment);
            }
            else {
                let roadSegment = {
                    'id': id,
                    'name': name,
                    'type': 'Road',
                    'coordinate_1': coordinate_1,
                    'coordinate_2': coordinate_2,
                    'index': roundtToDecimal(new_index)
                };
                roadSegments.push(roadSegment);
            }
        }
        var road_data = [];
        for (i = 0; i < roadSegments.length; i++) {
            let feature = {
                'type': 'Feature',
                'properties': {
                    'index': roadSegments[i].index,
                    'name': roadSegments[i].name,
                    'type': roadSegments[i].type
                },
                'geometry': {
                    'type': 'LineString',
                    'coordinates': [roadSegments[i].coordinate_1, roadSegments[i].coordinate_2]
                },
                'id': roadSegments[i].id
            };
            road_data.push(feature);
        }
        // filters for classifying safety level into five categories based on score
        var index1 = ["<", ["get", "index"], 1];
        var index2 = ["all", [">=", ["get", "index"], 1], ["<", ["get", "index"], 2]];
        var index3 = ["all", [">=", ["get", "index"], 2], ["<", ["get", "index"], 3]];
        var index4 = ["all", [">=", ["get", "index"], 3], ["<", ["get", "index"], 4]];
        var index5 = [">=", ["get", "index"], 5];

        // colors to use for the categories
        var colors = ['#C00000', '#D07F78', '#FFC000', '#C5E0B4', '#548235'];
        var line_id = null;
        var layers = main_map.getStyle().layers;
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
        // create a Road source 
        main_map.addSource("road_segments", {
            "type": "geojson",
            'data': {
                'type': 'FeatureCollection',
                'features': road_data
            }
        });

        // line layers for rendering individual road segments
        main_map.addLayer({
            "id": "roads",
            "type": "line",
            "source": "road_segments",
            'paint': {
                'line-width': {
                    'base': 15,
                    'stops': [[14, 5], [16, 10], [20, 300]]
                },
                // to set the line-color to a feature property value.
                //'line-color': ['get', 'color']
                'line-color':
                    ["case",
                        ["boolean", ["feature-state", "touchstart"], false],
                        "#00FFFF",
                        ["case",
                            index1, colors[0],
                            index2, colors[1],
                            index3, colors[2],
                            index4, colors[3], colors[4]]],
                "line-opacity": ["case",
                    ["boolean", ["feature-state", "touchstart"], false],
                    0.7,
                    0.95]
            },
            "filter": ["==", ["get", "type"], 'Road']
        }, firstSymbolId);

        //map.addLayer({
        //    "id": "lanes",
        //    "type": "line",
        //    "source": "road_segments",
        //    'paint': {
        //        'line-width': {
        //            'base': 15,
        //            'stops': [[14, 3], [16, 8], [20, 240]]
        //        },
        //        // to set the line-color to a feature property value.
        //        //'line-color': ['get', 'color']
        //        'line-color':
        //            ["case",
        //                ["boolean", ["feature-state", "touchstart"], false],
        //                "#00FFFF",
        //                ["case",
        //                    index1, colors[0],
        //                    index2, colors[1],
        //                    index3, colors[2],
        //                    index4, colors[3], colors[4]]],
        //        "line-opacity": ["case",
        //            ["boolean", ["feature-state", "touchstart"], false],
        //            0.7,
        //            0.95]
        //    },
        //    "filter": ["==", ["get", "type"], 'Lane']
        //}, firstSymbolId);

        //Display popup when user touch a line
        var popup = new mapboxgl.Popup({
            closeButton: false
        });

        //Effect when mouse hover on a raod
        main_map.on("mousemove", "roads", function (e) {
            var index = e.features[0].properties.index;
            if (e.features.length > 0) {
                if (line_id) {
                    main_map.setFeatureState({ source: 'road_segments', id: line_id }, { touchstart: false });
                }
                line_id = e.features[0].id;
                main_map.setFeatureState({ source: 'road_segments', id: line_id }, { touchstart: true });
            }
            var description = "<div id='feedback_css'>"
                + "<h4 style='font-size: 16px;'>Safety Index: " + index + "</h4>"
                + "</div>";
            popup.setLngLat(e.lngLat)
                .setHTML(description)
                .addTo(main_map);

        });

        // When the mouse leaves the road, update the feature state of the
        // previously hovered feature.
        main_map.on("mouseleave", "roads", function () {
            if (line_id) {
                main_map.setFeatureState({ source: 'road_segments', id: line_id }, { touchstart: false });
            }
            id: line_id = null;
            popup.remove();
        });

        // Change the cursor to a pointer when the mouse is over the states layer.
        main_map.on('mouseenter', 'roads', function () {
            main_map.getCanvas().style.cursor = 'pointer';
        });

        // Change it back to a pointer when it leaves.
        main_map.on('mouseleave', 'roads', function () {
            main_map.getCanvas().style.cursor = '';
        });

        //Display popup when user touch a road
        main_map.on("touchstart", "roads", function (e) {
            var index = e.features[0].properties.index;
            if (e.features.length > 0) {
                if (line_id) {
                    main_map.setFeatureState({ source: 'road_segments', id: line_id }, { touchstart: false });
                }
                line_id = e.features[0].id;
                main_map.setFeatureState({ source: 'road_segments', id: line_id }, { touchstart: true });
            }
            var description = "<div id='feedback_css'>"
                + "<h4 style='font-size: 16px;'>Safety Index: " + index + "</h4>"
                + "</div>";
            popup.setLngLat(e.lngLat)
                .setHTML(description)
                .addTo(main_map);


        });

        // Delete the popup when user's finger leave the road
        main_map.on("touchend", "roads", function () {
            if (line_id) {
                main_map.setFeatureState({ source: 'road_segments', id: line_id }, { touchstart: false });
            }
            id: line_id = null;
            popup.remove();
        });

    });
}

//Get reports data from backend
function addReportsLayer() {
    $.ajax({
        type: "Get",
        url: "/Reports/ReturnAllReports",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var reportList = [];
            for (i = 0; i < data.length; i++) {
                let id = data[i].Id;
                let longitude = data[i].Longitude;
                let latitude = data[i].Latitude;
                let incidentTime = data[i].IncidentTime;
                let incidentType = data[i].IncidentType;
                let reportedTime = data[i].ReportedTime;
                let userCookie = data[i].UserCookie;
                let confirmationNum = data[i].ConfirmationNum;
                let report = {
                    "type": "Feature",
                    "properties": {
                        "incidentType": incidentType,
                        "incidentTime": incidentTime,
                        "reportedTime": reportedTime,
                        "userCookie": userCookie,
                        "confirmationNum": confirmationNum,
                        "iconSize": [22, 22]
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [longitude, latitude]
                    },
                    "id": id
                };
                reportList.push(report);
            }

            var geojson = {
                "type": "FeatureCollection",
                "features": reportList
            };

            geojson.features.forEach(function (marker) {
                // create a DOM element for the marker
                var el = document.createElement('div');
                el.className = 'marker';
                var popup_content = "";
                var currentUserCookie = getCookie();
                var id = marker.id;
                if (marker.properties.confirmationNum < 2 && currentUserCookie !== marker.properties.userCookie) {
                    el.style.backgroundImage = 'url(../Content/Iteration3/css/img/unconfirmed.png';
                    if (marker.properties.incidentType === "Risk") {
                        popup_content = "<div id='report-popup'>"
                            + "<h4>Another user reported there's a suspicious person.</h4>"
                            + "<h5>Is that true?</h5>"
                            + "<button onclick='confirmReport(" + id + ")'>Confirm</button>"
                            + "</div>";
                    }
                    else {
                        popup_content = "<div id='report-popup'>"
                            + "<h4>Another user reported he/she was harassed here.</h4>"
                            + "<h5>Is that true?</h5>"
                            + "<button onclick='confirmReport(" + id + ")'>Confirm</button>"
                            + "</div>";
                    }

                } else if (marker.properties.confirmationNum < 2 && currentUserCookie === marker.properties.userCookie) {
                    el.style.backgroundImage = 'url(../Content/Iteration3/css/img/unconfirmed.png';
                    if (marker.properties.incidentType === "Risk") {
                        popup_content = "<div id='report-popup'>"
                            + "<h4>Another user reported there's a suspicious person.</h4>"
                            + "<h5>Waiting to be confirmed by other users...</h5>"
                            + "</div>";
                    }
                    else {
                        popup_content = "<div id='report-popup'>"
                            + "<h4>Another user reported he/she was harassed here.</h4>"
                            + "<h5>Waiting to be confirmed by other users...</h5>"
                            + "</div>";
                    }
                }
                else {
                    if (marker.properties.incidentType === "Risk") {
                        el.style.backgroundImage = 'url(../Content/Iteration3/css/img/spy.png';
                        popup_content = "<div id='report-popup'>"
                            + "<h4>There's a suspicious person.</h4>"
                            + "<h5>Confirmed by other users</h5>"
                            + "</div>";
                    }
                    else {
                        el.style.backgroundImage = 'url(../Content/Iteration3/css/img/evil.png';
                        popup_content = "<div id='report-popup'>"
                            + "<h4>Someone was harassed here.</h4>"
                            + "<h5>Confirmed by other users</h5>"
                            + "</div>";
                    }
                }


                el.style.backgroundRepeat = "no-repeat";
                el.style.backgroundPosition = "center";
                el.style.backgroundSize = "35px";
                el.style.borderRadius = "0%";
                el.style.width = "35px";
                el.style.height = '35px';


                var popup = new mapboxgl.Popup()
                    .setHTML(popup_content);
                //el.addEventListener('click', function () {
                //    window.alert(marker.properties.message);
                //});

                // add marker to map
                new mapboxgl.Marker(el)
                    .setLngLat(marker.geometry.coordinates)
                    .setPopup(popup)
                    .addTo(main_map);
            });
        }
    });
}

function getPedestrainCount() {
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url = "http://ec2-54-206-81-253.ap-southeast-2.compute.amazonaws.com/json";
    $.ajax({
        type: "Get",
        url: proxyurl + url,
        success: function (data) {
            var json = JSON.parse("[" + data.replace(/^\n+|\n+$/g, "").replace(/\n+/g, ",") + "]");
            var sensors = [];
            for (i = 0; i < json.length; i++) {
                var center = json[i].geometry.coordinates;
                var count = json[i].properties.count;
                if (count !== 0) {
                    var radius = json[i].properties.count / 20000;
                    var options = { steps: 25, units: 'kilometers', properties: { name: json[i].properties.name, count: json[i].properties.count, center: center } };
                    var circle = turf.circle(center, radius, options);
                }
                sensors.push(circle);
            }
            main_map.addSource("sensors", {
                "type": "geojson",
                "data": {
                    'type': 'FeatureCollection',
                    'features': sensors
                }
            });

            //add pedestrian to the map
            main_map.addLayer({
                "id": "sensors",
                "type": "fill",
                "source": "sensors",
                'layout': {},
                'paint': {
                    'fill-color': {
                        property: 'count',
                        type: 'exponential',
                        stops: [
                            [0, 'rgba(236,222,239,0)'],
                            [800, 'rgb(236,222,239)'],
                            [1600, 'rgb(208,209,230)'],
                            [2400, 'rgb(166,189,219)'],
                            [3200, 'rgb(103,169,207)'],
                            [4000, 'rgb(28,144,153)'],
                            [4800, 'rgb(1,108,89)']
                        ]
                    },
                    'fill-opacity': 0.5
                }
            }, 'waterway-label');
            //callback(sensors);
        }
    });
}


function addBarsLayer() {
    $.ajax({
        type: "Get",
        url: "/Jsons/ReturnJson",
        data: { name: "bar" }, // passing the parameter 
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (jsonString) {
            var data = JSON.parse(jsonString);
            main_map.addLayer({
                "id": "bars",
                "type": "symbol",
                "source": {
                    "type": "geojson",
                    "data": data
                },
                "layout": {
                    "icon-image": "alcohol-shop-15",
                    "text-field": "{name}",
                    "text-size": 8,
                    "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                    "text-offset": [0, 0.6],
                    "text-anchor": "top"
                },
                "paint": {
                    "text-color": "White"
                }
            });

        }
    });
}

function addNightClubsLayer() {
    $.ajax({
        type: "Get",
        url: "/Jsons/ReturnJson",
        data: { name: "nightclub" }, // passing the parameter 
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (jsonString) {
            var data = JSON.parse(jsonString);
            main_map.loadImage('https://img.icons8.com/ios/100/ffffff/dancing-party-filled.png', function (error, image) {
                if (error) throw error;
                main_map.addImage('nightclub', image);
                main_map.addLayer({
                    "id": "nightclubs",
                    "type": "symbol",
                    "source": {
                        "type": "geojson",
                        "data": data
                    },
                    "layout": {
                        "icon-image": "nightclub",
                        "icon-size": 0.15,
                        "text-field": "{name}",
                        "text-size": 8,
                        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                        "text-offset": [0, 0.6],
                        "text-anchor": "top"
                    },
                    "paint": {
                        "text-color": "White"
                    }
                });
            });

        }
    });
}


function trackUser() {
    let options = {
        enableHighAccuracy: true,
        timeout: Infinity,
        maximumAge: 0
    };

    navigator.geolocation.watchPosition(success, error, options);
    function success(pos) {
        let lat = pos.coords.latitude;
        let lng = pos.coords.longitude;
        main_map.on('load', function () {
            main_map.addLayer({
                "id": "points",
                "type": "circle",
                "source": {
                    "type": "geojson",
                    "data": {
                        "type": "FeatureCollection",
                        "features": [{
                            "type": "Feature",
                            "geometry": {
                                "type": "Point",
                                "coordinates": [lng, lat]
                            },
                            "properties": {
                                "title": 'Current Location'
                            }
                        }]
                    }
                },
                "paint": {
                    "circle-radius": 10,
                    "circle-color": "#007cbf"
                }
            });
        });

        main_map.flyTo({
            center: [lng, lat]
        });
        document.getElementById("longitude").value = lng;
        document.getElementById("latitude").value = lat;
    }
    function error(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
    }
}

function confirmReport(id) {
    $.ajax({
        type: "Post",
        url: "/Reports/ConfirmReport",
        data: JSON.stringify({ "id": id }), // passing the parameter 
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            alert(data);
            window.location.reload(true);
        }
    });
}

function setAsStart() {

}

function goThere() {
    let lngLat = first_marker_popup.getLngLat();
    let longitude = lngLat.lng;
    let latitude = lngLat.lat;
    let destination = [longitude, latitude];
    navigator.geolocation.getCurrentPosition(success,error);
    navigator.geolocation.getCurrentPosition(success,error);
    function success(pos) {
        let lat = pos.coords.latitude;
        let lng = pos.coords.longitude;
        var start = [lng, lat];
        getRoute(start, destination);        
    }

    function error(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
    }
}

function getRoute(start, end) {
    // make a directions request using walking profile
    var url = 'https://api.mapbox.com/directions/v5/mapbox/walking/' + start[0] + ',' + start[1] + ';' + end[0] + ',' + end[1] + '?steps=true&geometries=geojson&access_token=' + mapboxgl.accessToken;

    // make an XHR request https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
    var req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open('GET', url, true);
    req.onload = function () {
        var data = req.response.routes[0];
        var route = data.geometry.coordinates;
        var geojson = {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'LineString',
                coordinates: route
            }
        };
        // if the route already exists on the map, reset it using setData
        if (main_map.getSource('route')) {
            main_map.getSource('route').setData(geojson);
        } else { // otherwise, make a new request
            main_map.addLayer({
                id: 'route',
                type: 'line',
                source: {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'LineString',
                            coordinates: geojson
                        }
                    }
                },
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#3887be',
                    'line-width': 5,
                    'line-opacity': 0.75
                }
            });
        }
        // add turn instructions here at the end
    };
    req.send();
}


main_map.on('mousemove', function (e) {
    var markers = main_map.queryRenderedFeatures(e.point, {
        layers: ['geomarker']
    });
    main_map.getCanvas().style.cursor = (markers.length) ? 'pointer' : '';
});
//Fly to and center on geolocation marker
main_map.on('click', function (e) {
    //variables for each marker and its properties
    var geomarkers = main_map.queryRenderedFeatures(e.point, {
        layers: ['geomarker']
    });
    if (geomarkers.length) {
        main_map.flyTo({
            center: geomarkers[0].geometry.coordinates
        });
    }
});

function createFilter(layerID, text) {
    // Add checkbox and label elements for the layer.
    var filterGroup = document.getElementById('filter-group');

    var input = document.createElement('input');
    input.type = 'checkbox';
    input.id = layerID;
    input.checked = true;
    filterGroup.appendChild(input);

    var label = document.createElement('label');
    label.setAttribute('for', layerID);
    label.textContent = text;
    filterGroup.appendChild(label);

    // When the checkbox changes, update the visibility of the layer.
    input.addEventListener('change', function (e) {
        main_map.setLayoutProperty(layerID, 'visibility',
            e.target.checked ? 'visible' : 'none');
    });
}

