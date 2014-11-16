var x = document.getElementById("demo");

var map = L.map('map').setView([43.4705876,-80.5550397],17); //Initialize Map to West D WESST DDDD!
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png',
            {attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);

//var marker = L.marker([43.4705876,-80.5550397]).addTo(map);
//var marker = L.marker([43.4705876,-80.5550397]).addTo(map);
var marker = L.marker([43.4707063,-80.554874]).addTo(map);

/*var circle = L.circle([43.4701088, -80.5540204], 130,
  {
  color: 'orange',
  fillColor: '#f60',
  fillOpacity: 0.2
  }).addTo(map);
*/

//circle.bindPopup("Ron Eydt Village");
//marker.bindPopup("Hello Antonio").openPopup();

function pantoREV(){
    map.panTo(new L.LatLng(43.4701088, -80.5540204));
}
function getmyLocation(){
    map.panTo(new L.LatLng(43.4701088, -80.5540204));
}
function update(){
    getLocation();
    user_name = document.getElementById('name').value; //Fetch user's name from input field
    marker.bindPopup(user_name);
    //send position and name to server
    //receive other positions and names from server and add to map
}
function getPosition(position) {
    //alert("Latitude: " + position.coords.latitude +
    //"<br>Longitude: " + position.coords.longitude);
    document.getElementById('location').value = "Lat: " + position.coords.latitude
        + "Long: " + position.coords.longitude;
    marker.setLatLng(position.coords.latitude,position.coords.longitude); //Change marker position
}
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}
//SOCKET IO
var socket = io();
//User data is:
//  -> USERNAME,LATITUDE,LONGITUDE

//Send user data to server
$('form').submit(function(){
    socket.emit('user', $('#name').val() + ", " + $('#location').val());
    return false;
});

//Listen for new locations from server
socket.on('user', function(user){
    var user_data = user.split(",");
    var user_name = user_data[0];
    var user_lat = user_data[1];
    var user_long = user_data[2];
    var new_user = L.marker([user_lat,user_long]).addTo(map);
    new_user.bindPopup(user_name);
});
