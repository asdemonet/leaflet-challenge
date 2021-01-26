var dataURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

const centerLatLng = [39.8283, -98.5795]

var myMap = L.map("map", {
    center: centerLatLng,
    zoom: 5,
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

function getColor(mags) {
    switch (true) {
        case mags > 5:
            return "#ea2c2c";
        case mags > 4:
            return "#ea822c";
        case mags > 3:
            return "#ee9c00";
        case mags > 2:
            return "#eecc00";
        case mags > 1:
            return "#d4ee00";
        default:
            return "98ee00";
        }
}

function getRadius(mags) {
    if (mags === 0) {
        return 1;
    }

return mags*20000
}

d3.json(dataURL, function(data) {
        
    var earthquakes = data.features;
    console.log(earthquakes)
    var coords = []

    for(var i=0; i<earthquakes.length; i++) {
        var data = earthquakes[i]["geometry"]["coordinates"]
        // console.log(data)
        var mags = earthquakes[i]["properties"]["mag"]
        // console.log(mags)
    
        var place = earthquakes[i]["properties"]["place"]

        coords.push(L.circle([data[1], data[0]], {
            stroke: true,
            fillOpacity: .75,
            fillColor: getColor(mags),
            color: getColor(mags),
            radius: getRadius(mags),
            weight: 1 
        }).bindPopup("<h3> Magnitude: " + mags + "</h3> <h3> Location: " + place + "</h3>")
        .addTo(earthquakesLayer))
    }

  

earthquakesLayer.addTo(myMap)

var colors = ["#98ee00", "#d4ee00", "#eecc00", "#ee9c00",  "#ea822c", "ea2c2c"]
var scale = [1, 2, 3, 4, 5];

var legend = L.control({
    position: "bottomright"
});

legend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");

    div.innerHTML = "<h3> Magnitude </h3>"
    
    for(var i = 0; i<colors.length; i++) {
        div.innerHTML += `<svg class="squares" style='background-color: ${colors[i]}'> <p> ${i} - ${i+1} </p> </svg>`
    }
    return div
}
legend.addTo(myMap)
// console.log(coords) 

});

