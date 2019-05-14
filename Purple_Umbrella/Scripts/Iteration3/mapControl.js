// export default class PitchToggle {
class PitchToggle {
    constructor({ bearing = -20, pitch = 70, minpitchzoom = null }) {
        this._bearing = bearing;
        this._pitch = pitch;
        this._minpitchzoom = minpitchzoom;
    }

    onAdd(map) {
        this._map = map;
        let _this = this;

        this._btn = document.createElement("button");
        this._btn.className = "mapboxgl-ctrl-icon mapboxgl-ctrl-pitchtoggle-3d";
        this._btn.type = "button";
        this._btn["aria-label"] = "Toggle Pitch";
        this._btn.onclick = function () {
            if (map.getPitch() === 0) {
                let options = { pitch: _this._pitch, bearing: _this._bearing };
                if (_this._minpitchzoom && map.getZoom() > _this._minpitchzoom) {
                    options.zoom = _this._minpitchzoom;
                }
                map.easeTo(options);
                _this._btn.className =
                    "mapboxgl-ctrl-icon mapboxgl-ctrl-pitchtoggle-2d";
            } else {
                map.easeTo({ pitch: 0, bearing: 0 });
                _this._btn.className =
                    "mapboxgl-ctrl-icon mapboxgl-ctrl-pitchtoggle-3d";
            }
        };

        this._container = document.createElement("div");
        this._container.className = "mapboxgl-ctrl-group mapboxgl-ctrl";
        this._container.appendChild(this._btn);

        return this._container;
    }

    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }
}

/* Idea from Stack Overflow https://stackoverflow.com/a/51683226  */
class MapboxGLButtonControl {
    constructor({
        className = "",
        title = "",
        id = "",
        eventHandler = evtHndlr
    }) {
        this._className = className;
        this._title = title;
        this._id = id;
        this._eventHandler = eventHandler;
    }

    onAdd(map) {
        this._map = map;
        this._btn = document.createElement("button");
        this._btn.className = "mapboxgl-ctrl-icon" + " " + this._className;
        this._btn.type = "button";
        this._btn.title = this._title;
        this._btn.id = this._id;
        this._btn.onclick = this._eventHandler;

        this._container = document.createElement("div");
        this._container.className = "mapboxgl-ctrl-group mapboxgl-ctrl";
        this._container.appendChild(this._btn);

        return this._container;
    }

    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }
}

/* Event Handlers */
function one(event) {
    alert("Event handler when clicking on \r\n" + event.target.className);
    console.log("event number 1", event);
}


var sidenav_status = false;
function openMenu(event) {
    if (!sidenav_status) {
        document.getElementById("mySidenav").style.width = "250px";
        document.getElementById("safetymap").style.marginLeft = "250px";
        document.getElementById("safetymap").style.backgroundColor = "rgba(0,0,0,0.4)";
        sidenav_status = true;
    }
    else {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("safetymap").style.marginLeft = "0";
        document.getElementById("safetymap").style.backgroundColor = "white";
        sidenav_status = false;
    }
    main_map.on("click", function (e) {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("safetymap").style.marginLeft = "0";
        sidenav_status = false;
    });
}

function report(event) {
    $('#report-form').modal('show');
    $('#report-form').on('shown.bs.modal', function () {
        mapboxgl.accessToken = TOKEN;
        let bounds = [
            [144.9134, -37.8415], // Southwest coordinates
            [145.0087, -37.7871]  // Northeast coordinates
        ];
        let map = new mapboxgl.Map({
            container: 'reportmap',
            style: 'mapbox://styles/mapbox/light-v10',
            zoom: 14,
            center: [144.958429, -37.815858],
            attributionControl: false
            //maxBounds: bounds
        });
        let options = {
            enableHighAccuracy: false,
            timeout: 3000,
            maximumAge: 0
        };
        navigator.geolocation.getCurrentPosition(success, error, options);
        function success(pos) {
            let lat = pos.coords.latitude;
            let lng = pos.coords.longitude;
            var position = {
                type: "FeatureCollection",
                features: [{
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [lng, lat]
                    },
                    properties: {
                        title: 'Current Location'
                    }
                }]
            };

            map.on('load', function () {
                if (map.getLayer('position')) {
                    main_map.getSource('position').setData(position);
                } else {
                    map.addLayer({
                        "id": "position",
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
                }
            });

            map.flyTo({
                center: [lng, lat]
            });
            document.getElementById("longitude").value = lng;
            document.getElementById("latitude").value = lat;
        }
        function error(err) {
            console.warn('ERROR(' + err.code + '): ' + err.message);
        }

        let geocoder = new MapboxGeocoder({
            accessToken: 'pk.eyJ1Ijoia2VvbnlhbWF0byIsImEiOiJjamw4cXR0MjcxZ24yM2txa2VhazJ2MmY5In0.b3cxVs4DdITNSJYZGzt9pA',
            countries: 'au',
            placeholder: false,
            marker: false,
            collapsed: true,
            bbox: [144.9134, -37.8415, 145.0087, -37.7871],
            filter: function (item) {
                // returns true if item contains Melbourne region
                return item.context.map(function (i) {
                    // id is in the form {index}.{id} per https://github.com/mapbox/carmen/blob/master/carmen-geojson.md
                    // this example attempts to find the `region` named `New South Wales`
                    return i.id.split('.').shift() === 'place' && i.text === 'Melbourne';
                }).reduce(function (acc, cur) {
                    return acc || cur;
                });
            },
            mapboxgl: mapboxgl
        });

        map.addControl(geocoder);
        let reportmarker = new mapboxgl.Marker({
            color: 'purple',
            draggable: true
        });
        geocoder.on('result', function (result) {
            reportmarker.remove();
            let longitude = result.result.geometry.coordinates[0];
            let latitude = result.result.geometry.coordinates[1];
            reportmarker.setLngLat([longitude, latitude])
                .addTo(map);
            document.getElementById("longitude").value = longitude;
            document.getElementById("latitude").value = latitude;
            reportmarker.on('dragend', onDragEnd);

            function onDragEnd() {
                let lngLat = reportmarker.getLngLat();
                let longitude = lngLat.lng;
                let latitude = lngLat.lat;
                document.getElementById("longitude").value = longitude;
                document.getElementById("latitude").value = latitude;
            }
        });
        $('#reportmap').show();
        // detect the map's new width and height and resize it
        map.resize();
    });

}

function geolocate() {
    this.gl = !this.gl;
    if (this.gl === true) {
        var startPos;
        var geoOptions = {
            enableHighAccuracy: true,
            timeout: Infinity,
            maximumAge: 0
        };

        var geoSuccess = function (position) {
            startPos = position;
            var radius = 20;
            main_map.flyTo({
                center: [startPos.coords.longitude, startPos.coords.latitude],
                zoom: 14,
                bearing: 0
            });
            main_map.addSource("geomarker", {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": [{
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [startPos.coords.longitude, startPos.coords.latitude]
                        },
                        "properties": {
                            "title": "You Found Me"
                        }
                    }]
                }
            });

            main_map.addLayer({
                "id": "geomarker",
                "type": "circle",
                "source": "geomarker",
                //"source-layer": "geomarker",
                "paint": {
                    "circle-radius": radius,
                    "circle-color": "#00FFFF",
                    "circle-stroke-width": 2,
                    "circle-stroke-color": "#FFF",
                    "circle-opacity": 0.8
                }
            });



            // D3 will insert a svg into the map container
            var container = main_map.getCanvasContainer();
            console.log(container);
            var svg = d3.select(container).append("svg").attr("id", "geoCircle");
            //An array with the coordinates of the geomarker
            var geolocate = [{
                "lon": startPos.coords.longitude,
                "lat": startPos.coords.latitude
            }];

            //convience function for projecting geolocation coordinates
            function project(d) {
                return main_map.project(getLL(d));
            }
            //convience function for adding projected coordinates to mapbox canvas
            function getLL(d) {
                return new mapboxgl.LngLat(+d.lon, +d.lat);
            }

            //setup and append our svg with a circle tag and a class of dot
            var dots = svg.selectAll("circle.dot").data(geolocate);
            console.log(dots);
            dots.enter().append("circle").classed("dot", true)
                .style({
                    "fill": "#000",
                    "fill-opacity": 0,
                    "stroke": "#00FFFF",
                    "stroke-width": 6,
                    "stroke-dasharray": [2, 2],
                    "cursor": "pointer",
                    "pointer-events": "none"
                });

            main_map.addSource("Minute10", {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": [{
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [startPos.coords.longitude - 0.0086736, startPos.coords.latitude]
                        },
                        "properties": {
                            "title": "10 Minutes"
                        }
                    }]
                }
            });
            main_map.addLayer({
                "id": "Minute10",
                "type": "symbol",
                "source": "Minute10",
                //"source-layer": "Minute10",
                "layout": {
                    "visibility": "visible",
                    "icon-image": "metro-demo",
                    "icon-size": 2,
                    "text-field": "{title}",
                    "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                    "text-offset": [0, 0.6],
                    "text-anchor": "top"
                },
                "paint": {
                    "text-color": "White"
                }
            });

            main_map.on("viewreset", function (e) {
                var zoom = main_map.getZoom(e);
                var bear = main_map.getBearing(e);
                var p1 = [startPos.coords.longitude, startPos.coords.latitude];
                //0.0086736 is roughly equal to 731.52 meters
                var p2 = [startPos.coords.longitude + 0.0086736, startPos.coords.latitude];
                var a = main_map.project(p1);
                var b = main_map.project(p2);
                var radius = b.x - a.x;
                dots.attr("r", radius).transition();
                dots.attr({

                    cx: function (d) {
                        var x = project(d).x;
                        console.log(x);
                        return x;
                    },
                    cy: function (d) {
                        var y = project(d).y;
                        console.log(y);
                        return y;
                    }
                });
            });

            main_map.on("move", function (e) {
                //render();
                var zoom = main_map.getZoom(e);
                var bear = main_map.getBearing(e);
                var p1 = [startPos.coords.longitude, startPos.coords.latitude];
                //0.0086736 is roughly equal to 731.52 meters
                var p2 = [startPos.coords.longitude + 0.0086736, startPos.coords.latitude];
                var a = main_map.project(p1);
                var b = main_map.project(p2);
                var radius = (b.x - a.x);
                dots.attr("r", radius).transition();
                dots.attr({
                    cx: function (d) {
                        var x = project(d).x;
                        return x;
                    },
                    cy: function (d) {
                        var y = project(d).y;
                        return y;
                    }
                });
            });

            main_map.on("zoomend", function (e) {
                //render();
                var zoom = main_map.getZoom(e);
                var bear = main_map.getBearing(e);
                var p1 = [startPos.coords.longitude, startPos.coords.latitude];
                //0.0086736 is roughly equal to 731.52 meters
                var p2 = [startPos.coords.longitude + 0.0086736, startPos.coords.latitude];
                var a = main_map.project(p1);
                var b = main_map.project(p2);
                var radius = b.x - a.x;
                dots.attr("r", radius).transition();
                dots.attr({
                    cx: function (d) {
                        var x = project(d).x;
                        return x;
                    },
                    cy: function (d) {
                        var y = project(d).y;
                        return y;
                    }
                });
            });

        };

        var geoError = function (error) {
            console.log('Error occurred. Error code: ' + error.code);
        };

        main_map.dragRotate.disable();
        main_map.touchZoomRotate.disableRotation();

        navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
    } else {
        d3.select("#geoCircle").remove();
        main_map.removeLayer("geomarker");
        main_map.removeSource("geomarker");
        main_map.removeLayer("Minute10");
        main_map.removeSource("Minute10");
        main_map.dragRotate.enable();
        main_map.touchZoomRotate.enableRotation();

    }
}

// Instance the tour
var tour = new Tour({
    steps: [
        {
            element: "#map-geolocate",
            placement: "left",
            title: "Locate yourself",
            content: "Find yourself and know how far you can go in 10 minutes."
        },
        {
            element: "#map-report",
            placement: "left",
            title: "Report an incident",
            content: "Report what happened to you at anywhere or anytime to us."
        },
        {
            element: "#filter-group",
            placement: "left",
            title: "Too many information?",
            content: "Try these filter button."
        }

    ]
});
function displayTutorial() {

    // Initialize the tour
    tour.init();

    // Start the tour
    tour.restart();
}


/* Instantiate new controls with custom event handlers */
const tutorialControl = new MapboxGLButtonControl({
    className: "mapbox-gl-tutorial",
    title: "Tutorial",
    id: "map-tutorial",
    eventHandler: displayTutorial
});

const menuControl = new MapboxGLButtonControl({
    className: "mapbox-gl-menu",
    title: "Menu",
    id: "map-menu",
    eventHandler: openMenu
});

const reportControl = new MapboxGLButtonControl({
    className: "mapbox-gl-report",
    title: "Report",
    id: "map-report",
    eventHandler: report
});

const geoLocateControl = new MapboxGLButtonControl({
    className: "mapbox-gl-geoLocate",
    title: "Geolocate",
    id: "map-geolocate",
    eventHandler: geolocate
});
/* Add Controls to the Map */
//map.addControl(new mapboxgl.NavigationControl(), "top-left");
//map.addControl(new PitchToggle({ minpitchzoom: 11 }), "top-left");
//map.addControl(ctrlPoint, "bottom-left");
//map.addControl(ctrlLine, "bottom-right");
//map.addControl(ctrlPolygon, "top-right");

$(document).ready(function () {
    // when the DOM has fully loaded...
    $("#save-report").bind("click", function () {
        var onEventCreateReport = new postReport();
        onEventCreateReport.createReport();
    });
});

//Post user report to database
function postReport() {
    this.createReport = function () {
        // fetch values from input
        var longitude = $("#longitude").val();
        var latitude = $("#latitude").val();
        var incidentType = $("#incidenttype").val();
        var incidentTime = $("#dateTimePicker").val();
        var userCookie = $("#user-cookie").val();
        if (incidentType === "") {
            document.getElementById("typeerror").innerHTML = "Plese select what happened.";
        }
        else {
            $.ajax({
                type: "POST",
                url: "/Reports/CreateReport",
                traditional: true,
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({ "longitude": longitude, "latitude": latitude, "incidentType": incidentType, "incidentTime": incidentTime, "userCookie": userCookie }),
                success: function (data) {
                    $('#report-form').modal('hide');
                    window.location.reload(true);
                    alert(data);
                },
                error: function (data) { console.log(data); }
            });
        }

    };
}