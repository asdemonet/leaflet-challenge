var dataURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

const centerLatLng = [39.8283, -98.5795]

var myMap = L.map("map", {
    center: centerLatLng,
    zoom: 5,
    layers: baseMaps
});

var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
      }).addTo(myMap);

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
    }).addTo(myMap);

var baseMaps = {
    "street": streetmap,
    "dark": darkmap
};

var earthquakesLayer = L.layerGroup()

var overlayMaps = {
    Earthquakes: earthquakesLayer,
};


// How to import this data??

L.control.layers(baseMaps, overlayMaps).addTo(myMap)

d3.json(dataURL, function(data) {
    var earthquakes = data.features;
    // console.log(earthquakes)
    var coords = []

    for(var i=0; i<earthquakes.length; i++) {
        var data = earthquakes[i]["geometry"]["coordinates"]
        // console.log(data)
        var mags = earthquakes[i]["properties"]["mag"]
    

        coords.push(L.circle([data[1], data[0]], {
            stroke: true,
            color: "#DC143C",
            fillcolor: "#DC143C",
            weight: 1,
            radius: mags*10000
        }).addTo(earthquakesLayer))
    }

earthquakesLayer.addTo(myMap)
// console.log(coords) 

});

