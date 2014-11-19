var x = document.getElementById("demo");
var user = {"name":"", "lat":"", "long":""};
var map = L.map('map').setView([43.4705876,-80.5550397],17); //Initialize Map to West D WESST DDDD!
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png',
            {attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);

//var marker = L.marker([43.4705876,-80.5550397]).addTo(map);
//var marker = L.marker([43.4705876,-80.5550397]).addTo(map);
var marker = L.marker([43.4707063,-80.554874]).addTo(map);
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
var user_lat;
var user_long;

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
	socket.emit('user', user_name);
	user.name = user_name;
	user.lat = user_lat;
	user.long = user_long;
	//document.getElementById('log').value += user.name;
	if (user_data != null)
	{
		socket.emit('user', user);
	}
	//send position and name to server
    //receive other positions and names from server and add to map
}
function getPosition(position) {
    //alert("Latitude: " + position.coords.latitude +
    //"<br>Longitude: " + position.coords.longitude);
    user_lat = position.coords.latitude;
	user_long = position.coords.longitude;
	document.getElementById('location').value = "Lat: " + position.coords.latitude
        + " Long: " + position.coords.longitude;
    //marker.setLatLng(position.coords.latitude,position.coords.longitude); //Change marker position
}
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getPosition);
    } else {
        //x.innerHTML = "Geolocation is not supported by this browser.";
    }
}
//SOCKET IO
//User data is:
//  -> USERNAME,LATITUDE,LONGITUDE
//Send user data to server
/*$('#update').click(function(){
    alert("hello");
	socket.emit('user', $('#name').val());
    return false;
});*/ 

//Listen for new locations from server
socket.on('user', function(user){
	document.getElementById('log').value += user.name;	
		
});
