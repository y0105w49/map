var user = {};
var map = L.map('map').setView([43.4705876,-80.5550397],17); //Initialize Map to West D WESST DDDD!
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png',
            {attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);

var socket = io();
var userLat;
var userLng;
var markers = {};

function pantoREV(){
    map.panTo(new L.LatLng(43.4701088, -80.5540204));
}
function updateLocation(){
    getLocation();
 
    user.name = document.getElementById('name').value;
    user.lat = userLat;
    user.lng = userLng;
    socket.emit('updateLocation', {name: user.name, location: {lat: user.lat, lng: user.lng}});
}
function getLocation() {
    if (navigator.geolocation) {
        var position = navigator.geolocation.getCurrentPosition(getPosition);

        userLat = position.coords.latitude;
        userLng = position.coords.longitude;
        document.getElementById('latitude').value = position.coords.latitude;
        document.getElementById('longitude').value = position.coords.longitude;
    }
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
  if (markers[newUser.name] == null) {
    var marker = L.marker(new L.LatLng(newUser.location.lat, newUser.location.lng), {icon: markerIcon});
    marker.bindPopup(newUser.name).addTo(map);
    markers[newUser.name] = marker;
  }
  else {
    markers[newUser.name].setLatLng(new L.LatLng(newUser.location.lat, newUser.location.lng)).update();
  }
});
socket.on('updateAllLocations', function(otherUsers){
  for (var newUser in otherUsers) {
    var marker = L.marker(new L.LatLng(newUser.location.lat, newUser.location.lng), {icon: markerIcon});
    marker.bindPopup(newUser.name).addTo(map);
    markers[newUser.name] = marker;
  }
});
