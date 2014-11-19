var user = {}
var map = L.map('map').setView([43.4705876,-80.5550397],17); //Initialize Map to West D WESST DDDD!
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png',
            {attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);

//var marker = L.marker([43.4707063,-80.554874]).addTo(map);

/*
  var circle = L.circle([43.4701088, -80.5540204], 130,
  {
  color: 'orange',
  fillColor: '#f60',
  fillOpacity: 0.2
  }).addTo(map);
*/

//circle.bindPopup("Ron Eydt Village");
//marker.bindPopup("Hello Antonio").openPopup();

var socket = io();
var userLat;
var userLng;

var markerArray = [];

function pantoREV(){
    map.panTo(new L.LatLng(43.4701088, -80.5540204));
}
function update(){
    getLocation();
    userName = document.getElementById('name').value; //Fetch user's name from input field
    user.name = userName;
    user.lat = userLat;
    user.lng = userLng;
    socket.emit('showUser', user);
}
function getPosition(position) {
    userLat = position.coords.latitude;
    userLng = position.coords.longitude;
    document.getElementById('latitude').value = position.coords.latitude;
    document.getElementById('longitude').value = position.coords.longitude;
    //marker.setLatLng(position.coords.latitude,position.coords.longitude); //Change marker position
}
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getPosition);
    } else {
        //x.innerHTML = "Geolocation is not supported by this browser.";
    }
}
function addMarker(){
    var markerIcon = L.icon({iconUrl: 'images/drag_marker.png', iconSize:[40,40]});
    var draggableMarker = L.marker(map.getCenter(), {icon: markerIcon, id: markerArray.length}).addTo(map);
    draggableMarker.dragging.enable();
    draggableMarker.on('dragend',markerDropped);
    markerArray.push(draggableMarker);
}
function markerDropped(e){
    var id = e.target.options.id;
    var latlng = e.target.getLatLng();
    markerArray[id].setLatLng(latlng);

    socket.emit('updateDroppedMarker', {arrayq: markerArray });
}
function updateMarkers(){
    for (var i = 0; i < markerArray.length; i++) {
	markerArray[i].update();
    }
}
//SOCKET IO
// User data is:
//  -> USERNAME,LATITUDE,LONGITUDE
//Send user data to server
/*$('#update').click(function(){
  alert("hello");
  socket.emit('user', $('#name').val());
  return false;
  });*/

//Listen for new locations from server
socket.on('showUser', function(newUser){
    if (newUser.name != null){
	if(newUser.name != null && newUser.lat != null && newUser.lng != null){
	    var new_marker = L.marker([newUser.lat,newUser.lng]).addTo(map);
	    new_marker.bindPopup(newUser.name);
	    markerArray.push(new_marker);
	    document.getElementById('log').value += " ---" + newUser.name + "Added A Marker!---- ";
	}
    }
}
         });

socket.on('updateDroppedMarker', function(data){
    //markerArray = data.arrayq;
    //updateMarkers();
    /*var markerIcon = L.icon({iconUrl: 'images/drag_marker.png', iconSize:[40,40]});

      var new_marker = L.marker(latlng, {icon: markerIcon, id: markerArray.length}).addTo(map);
      new_marker.dragging.enable();
      new_marker.on('dragend',markerDropped);
      new_marker.bindPopup("I'M DRAGGABLE!");
      markerArray.push(new_marker);
      document.getElementById('log').value += " ---Custom Marker Dropped!--- ";*/
});
socket.on('showCustomMarker', function(latlng){
    var markerIcon = L.icon({iconUrl: 'images/drag_marker.png', iconSize:[40,40]});

    var new_marker = L.marker(latlng, {icon: markerIcon}).addTo(map);
    new_marker.dragging.enable();
    new_marker.on('dragend',markerDropped);
    new_marker.bindPopup("I'M DRAGGABLE!");
    document.getElementById('log').value += " ---Custom Marker Dropped!--- ";
});
