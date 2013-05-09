/**
 *  Copyright (C) 2010  Nikolay Dimitrov
 *  
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
var beginPlaced = false; //Is the begin marker placed
var finishPlaced = false; //Is the finish marker placed
var map; //Map
var geocoder; //Geocoder for search
var beginMarker; //Begin marker(flag)
var finishMarker; //Finish marker(flag)
var lastLatLng; //last LatLng from right click
var searchMarker = false; //The search result marker
var loadDiv = false;

//TODO: fix load
function showLoad()
{
	if(loadDiv) //If loadDiv was created
	{
		loadDiv.style.visibility = "visible"; //Display it
	}
	else
	{ //Otherwise create the div
		//Get center of display
		clientHeight = (typeof window.innerHeight != 'undefined' ? window.innerHeight : document.body.offsetHeight); 
		clientWidth = (typeof window.innerHeight != 'undefined' ? window.innerHeight : document.body.offsetHeight);
		loadDiv = document.createElement("div");//Create a div
		loadDiv.setAttribute("id", "loading");//Set id to loading
		//Position on the center of the display
		loadDiv.style.position = "absolute";
		loadDiv.style.top = (clientHeight / 2 - 50) + "px";
		loadDiv.style.left = (clientWidth / 2 + 50) + "px";
		loadDiv.style.zIndex = 100; //Above all
		loadDiv.style.backgroundColor = "#FF9900"; //Oragane background
		loadDiv.innerHTML = "Зареждане, моля изчакайте<br><img src='load.gif'>"; //load pic
		document.body.appendChild(loadDiv); //Add the document
	}
}

function hideLoad()
{
	if(loadDiv)	loadDiv.style.visibility = "hidden";
}

//Submit the current marker positions
function submitPosition()
{
	if(beginPlaced && finishPlaced) //If begin marker and finish marker are places
	{
		showLoad(); //Show the loading
		sendRequest(beginMarker, finishMarker); //Send the request
	}
}

//Clears the search marker
function clearSearchMarker()
{
	if(searchMarker)
	{
		searchMarker.setMap(null); //Remove from the map
		searchMarker = false; //Set the marker to false
	}
}

//Searches for address
function search()
{
	var address = document.getElementById("address").value + ", София, България"; //Get the address from the field and add city and country info

	geocoder.geocode({'address': address} , function(results, status) { //Send the request
        if (status == google.maps.GeocoderStatus.OK) //If search status is OK
        {
        	clearSearchMarker(); //Remove old search marker
        	var latLng = results[0].geometry.location; //Get the first result positon
            map.setCenter(latLng); //Position map over it
            searchMarker = new google.maps.Marker({
                map: map, 
                position: latLng //Place a marker on the first result position
            });
            //Get the center of the map div
            var mapDiv = map.getDiv(); 
            var x = mapDiv.offsetWidth /2 ;
            var y = mapDiv.offsetHeight / 2;
            //Create a point on the center of the map div
            var point = new google.maps.Point(x, y);
            //Display menu with on the map div center
            showMenu(point, latLng);
        } 
        else if(status == google.maps.GeocoderStatus.ZERO_RESULTS) //If nothing was found
       {
            window.alert("Няма намери резултати");
       } 
        else 
        {
            window.alert("Търсенето не може да се осъществи"); //On search error
        }
        
   });
}

//Place a flag from left mouse click
function placeFlag(event)
{
	//If no flags have been placed,place the begin flag
	if(!beginPlaced)
	{
		beginMarker.setPosition(event.latLng);
		beginPlaced = true;
		submitPosition(); //Send request to server
	}
	//If no flags have been placed,place the finish flag
	else if(!finishPlaced)
	{
		finishMarker.setPosition(event.latLng);
		finishPlaced = true;
		submitPosition(); //Send request to server
	}
	hideMenu(); //Close the right click menu 

}

//Place flag from right click
//begin - place the beign flag; on false - the end flag
function placeFlagFromRightClick(begin)
{
	if(begin) //Place the begin flag
	{
		beginMarker.setPosition(lastLatLng);
		beginPlaced = true;
	}
	else  //Place the finish flag
	{
		finishMarker.setPosition(lastLatLng);
		finishPlaced = true;
	}
	hideMenu(); //Hide right click menu
	submitPosition(); //Submit position
}
//Shows the right click menu
function showMenu(point, latLng)
{
	lastLatLng = latLng; //Sets the lastLatLng to the position of the mouse/search result
	var element = document.getElementById("context-menu"); //Get the menu div
	element.style.visibility = "visible"; //Set it to visible
	element.style.top = point.y + "px"; //Place it on the right place
	element.style.left = point.x + "px";
}
//On right click
function handleRightClick(event)
{
	showMenu(event.pixel, event.latLng);
}
//Hide the right click menu
function hideMenu()
{
	document.getElementById("context-menu").style.visibility = "hidden";
	clearSearchMarker(); //Clear the search marker
}
//Adds a flag on the map
function addFlag(imageUrl, map)
{
	var image = new google.maps.MarkerImage(imageUrl,
			//The size of this image is 30 x 43
			new google.maps.Size(30, 43),
			//The origin is 0,0
			new google.maps.Point(0,0),
			//Anchor point is the base of the flag at 
			new google.maps.Point(1,41)
	);
	marker = new google.maps.Marker({
		icon: image, //The image
		draggable: true,
		map: map,
		title: "Премести за промяна на маршрута"
	});
	google.maps.event.addListener(marker, 'dragend', submitPosition); //Submit data when the flag is dragged to new location
	return marker;
}
//Init the map and the begin/finish markers
function initialize() {
	geocoder = new google.maps.Geocoder(); //Geocoder for search 
	
	//Center the map over Sofia and zoom it appropriately
	var latlng = new google.maps.LatLng(42.690038347469, 23.335601938556);
	var myOptions = {
			zoom: 13,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			noClear: true
	};

	//Show the map
	map = new google.maps.Map(document.getElementById("map-container"), myOptions);
	//Set the click event handler
	google.maps.event.addListener(map, 'click', placeFlag);
	//Set the right click event handler
	google.maps.event.addListener(map, 'rightclick', handleRightClick);

	//Hide menu when map is moved or zoomed
	google.maps.event.addListener(map, 'dragstart', hideMenu);
	google.maps.event.addListener(map, 'zoom_changed', hideMenu);

	//Adds the begin/finish marker, but doesn't display them
	beginMarker = addFlag('start.png', map); 
	finishMarker = addFlag('finish.png', map);
	
}