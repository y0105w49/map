var user = {};
var map = L.map('map').setView([43.4705876,-80.5550397],17); //Initialize Map to West D WESST DDDD!
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png',
            { attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);

var socket = io();
var userLat;
var userLng;
var markers = {};

function panToREV(){
    map.panTo(new L.LatLng(43.4701088, -80.5540204));
}

function panToMe() {
    map.panTo(new L.LatLng(userLat, userLng));
}

function updateLocation(){
    getLocation(function() {
        user.name = document.getElementById('name').value;
        user.lat = userLat;
        user.lng = userLng;
        socket.emit('updateLocation', { name: user.name, location: {lat: user.lat, lng: user.lng }});
    });
}

function getLocation(cb) {
    if (navigator.geolocation)
        navigator.geolocation.getCurrentPosition(function(pos) {
            userLat = pos.coords.latitude;
            userLng = pos.coords.longitude;
            document.getElementById('latitude').value = pos.coords.latitude;
            document.getElementById('longitude').value = pos.coords.longitude;
            cb();
        });
}

function addMarker(){
    var markerIcon = L.icon({iconUrl: 'images/drag_marker.png', iconSize:[40,40]});
    var draggableMarker = L.marker(map.getCenter(), {icon: markerIcon, id: markerArray.length}).addTo(map);
    draggableMarker.dragging.enable();
    draggableMarker.on('dragend',markerDropped);
}

function markerDropped(e){
    var id = e.target.options.id;
    var latlng = e.target.getLatLng();
}

socket.on('updateLocation', function(newUser){
    if (newUser.name in markers) {
        markers[newUser.name].setLatLng(new L.LatLng(newUser.location.lat, newUser.location.lng));
        markers[newUser.name].update();
    } else {
        var marker = L.marker(new L.LatLng(newUser.location.lat, newUser.location.lng));
        marker.bindPopup(newUser.name).addTo(map);
        markers[newUser.name] = marker;
  }
});
