

const TOKEN = 'pk.eyJ1Ijoia2VvbnlhbWF0byIsImEiOiJjamw4cXR0MjcxZ24yM2txa2VhazJ2MmY5In0.b3cxVs4DdITNSJYZGzt9pA';

//function () {
//    var xhr = new XMLHttpRequest();
//    xhr.open('GET', "../Content/Iteration3/json/bars.json");
//    xhr.setRequestHeader('Content-Type', 'application/json');
//    xhr.onload = function () {
//        if (xhr.status === 200) {
//            var data = JSON.parse(xhr.responseText);

//            map.addLayer({
//                "id": "bars",
//                "type": "symbol",
//                "source": {
//                    "type": "geojson",
//                    "data": data
//                },
//                "layout": {
//                    "icon-image": "bar-15",
//                    "text-field": "{name}",
//                    "text-size": 8,
//                    "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
//                    "text-offset": [0, 0.6],
//                    "text-anchor": "top"
//                }
//            });

//        }
//    };
//    xhr.send();
//}
$(document).ready(function () {
    document.cookie = "username=John Smith; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";
    var ck = document.cookie;
    document.getElementById('safetymap').innerHTML = "Current cookie"+ck;
   
    //mapboxgl.accessToken = TOKEN;
    //var bounds = [
    //    [144.9134, -37.8415], // Southwest coordinates
    //    [145.0087, -37.7871]  // Northeast coordinates
    //];
    //var map = new mapboxgl.Map({
    //    container: 'safetymap',
    //    style: 'mapbox://styles/mapbox/dark-v10',
    //    zoom: 14,
    //    center: [144.958429, -37.815858]
    //    //maxBounds: bounds
    //});

    //map.on('load', function () {
    //    var xhr = new XMLHttpRequest();
    //    xhr.open('GET', "../Content/Iteration3/json/bars.json");
    //    xhr.setRequestHeader('Content-Type', 'application/json');
    //    xhr.onload = function () {
    //        if (xhr.status === 200) {
    //            var data = JSON.parse(xhr.responseText);

    //            map.addLayer({
    //                "id": "bars",
    //                "type": "symbol",
    //                "source": {
    //                    "type": "geojson",
    //                    "data": data
    //                },
    //                "layout": {
    //                    "icon-image": "bar-15",
    //                    "text-field": "{name}",
    //                    "text-size": 8,
    //                    "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
    //                    "text-offset": [0, 0.6],
    //                    "text-anchor": "top"
    //                }
    //            });

    //        }
    //    };
    //    xhr.send();
    //});
});
//const query_overpass = require("query-overpass");
//const turf = require("turf");
//const fs = require("fs");
//let test;
//let filename = "data/test.js";
//let bbox = "48.91821286473131,8.309097290039062,49.0610446187357,8.520584106445312";
//console.log('starting query for ' + filename);
//console.log('bbox: ' + bbox);
//let query = ` 
//  [out:json][timeout:250];
//  // gather results
//  (
//  // query part for: “vending=milk”
//  node["vending"="milk"](${bbox});
//  way["vending"="milk"](${bbox});
//  relation["vending"="milk"](${bbox});
//  // query part for: “shop=farm”
//  node["shop"="farm"](${bbox});
//  way["shop"="farm"](${bbox});
//  relation["shop"="farm"](${bbox});
//  // query part for: “vending=food”
//  node["vending"="food"](${bbox});
//  way["vending"="food"](${bbox});
//  relation["vending"="food"](${bbox});
//  );
//  // print results
//  out body;
//  >;
//  out skel qt;
//`;

//// query overpass, write result to file
//query_overpass(query, (error, data) => {
//    data = JSON.stringify(data, null, 1);
//    console.log(data);
//    test = JSON.parse(data);


//    //create centroids for every polyon and save them as a point
//    for (var i = 0; i < test.features.length; i++) {
//        console.log("Log: " + test.features[i].geometry.type);
//        console.log("Log: " + test.features[i].properties.name);
//        if (test.features[i].geometry.type === "Polygon") {
//            console.log("polygon detected")
//            var centroid = turf.centroid(test.features[i]);
//            var lon = centroid.geometry.coordinates[0];
//            var lat = centroid.geometry.coordinates[1];
//            console.log(" lon: " + lon + " lat: " + lat);

//            test.features[i].geometry.type = 'Point'
//            //delete Polygon structure and insert centroids as new points here
//            console.log("polygon deleted and changed to point")
//        }

//    }
//    console.log(test);
//    fs.writeFile(filename, `var file = ${test};`, ["utf-8"], (error, data) => { if (error) { console.log(error) } });
//}, { flatProperties: true }
//);