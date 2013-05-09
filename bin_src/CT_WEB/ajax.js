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

var req; //The asynchronous request
var WALK_LINE_ID = 123; //The id of the walk line
var polylines = new Array(); //Lines on the map
var markers = new Array(); //Markers on the map

//Slowly resize the map
function resizeMap()
{
	var sidebarDiv = document.getElementById("sidebar"); 
	var newWidth = sidebarDiv.offsetWidth + 10; //Increase the sidebar div
	if(newWidth <= 400) //If we haven't reached the target
	{
		sidebarDiv.style.width = newWidth + "px"; //Set the new width
		setTimeout ("resizeMap()", 10); //Call this function aftes 10ms
	}
	else {
		google.maps.event.trigger(map, 'resize'); //Inform the map about the resize
	}
}

//Highlight an item 
function highlight(highlightId)
{
	if(typeof(polylines[highlightId]) !== 'undefined')
		polylines[highlightId].setOptions({strokeColor: "#FF0000"}); //Higligth the appropiate line
	document.getElementById("routeInfoDiv" + highlightId).style.backgroundColor = "#C1CDC1"; //Highligth the item from the detailed route information
}

//Unhighlight an item 
function unhighlight (highlightId)
{
	if(typeof(polylines[highlightId]) !== 'undefined')
		polylines[highlightId].setOptions({strokeColor: "#000000"});//Unhigligth the appropiate line
	document.getElementById("routeInfoDiv" + highlightId).style.backgroundColor = "#FFFFFF";//Unhighligth the item from the detailed route information
}

//Clears the detailed route info container and the map/line arrays
function clearBeforeSubmit()
{
	document.getElementById("route-container").innerHTML = "Зареждане...";
	//Remove all lines from map
	for(var i in polylines)
	{
		polylines[i].setMap(null);
	}
	polylines = new Array();
	
	//Remove all markers from map
	for(var i in markers)
	{
		markers[i].setMap(null);
	}
	markers = new Array();
}

//Clears the detailed route info container just before the new data is set
function clearAfterSubmit()
{
	document.getElementById("route-container").innerHTML = "";
	hideLoad(); //Hide the loading 
}


//Add an item to the detailed info container
function addRouteInformation(text, highlightId)
{
	var routeInfo = "<div id=\"routeInfoDiv" + highlightId + "\" class=\"routeItem\" "; //The css class
	routeInfo += "onmouseover=\"javascript: highlight(" + highlightId + ")\" onmouseout=\"javascript: unhighlight(" + highlightId + ")\""; //Highlight js functions
	routeInfo += ">";
	routeInfo += text; //The text to add
	routeInfo += "</div>";
	document.getElementById("route-container").innerHTML += routeInfo;
}

//Place a marker on the map
function placeMarker(coords, highlightId)
{
	if(typeof(coords) !== 'undefined' && coords != null) //If coords is defined
	{
		var latlng = new google.maps.LatLng(coords.lat,coords.lon); //Marker position
		var marker = new google.maps.Marker({ //Marker
	        position: latlng
	    }); 
		marker.setMap(map); //Add the marker
		
		//Add listeners for highlight/unhighlight
		google.maps.event.addListener(marker,'mouseover', function() { highlight(highlightId); });
		google.maps.event.addListener(marker,'mouseout', function() { unhighlight(highlightId); });
		markers.push(marker);//Add marker to array
	}
}

//Draws a line between beginCoords and endCoords
function drawWalkLine(beginCoords, endCoords, highlightId)
{
	if(typeof(beginCoords) !== 'undefined' && beginCoords != null && typeof(endCoords) !== 'undefined' && endCoords != null) //If begin and end coords are set
	{
		var lineCoords = [new google.maps.LatLng(beginCoords.lat,beginCoords.lon), //The coords for the line
						  new google.maps.LatLng(endCoords.lat,endCoords.lon)
		];
		var line = new google.maps.Polyline({ //The line
			path: lineCoords,
			strokeWeight: 1 //Walk line is with lower stroke
		});
		line.setMap(map); //Display on map
		polylines[highlightId] = line; //Add to the lines array
	}
}

//Draws a line with the coords from transitStops
function drawTransitStopsLine(transitStops, highlightId)
{
	var lineCoords = new Array(); //The coords for the line
	for(var k in transitStops) //Iterate through all transitStops
	{
		if(typeof(transitStops[k].coord) !== 'undefined' && transitStops[k].coord != null) //If coords are set
			lineCoords.push(new google.maps.LatLng(transitStops[k].coord.lat, transitStops[k].coord.lon)); //Add the coords to the line array
	}
	var line = new google.maps.Polyline({ //Draw the line with the lineCoords
		path: lineCoords
	});
	line.setMap(map); //Display on map
	
	polylines[highlightId] = line;//Add to the lines array
}

//Parses the reponse from server
function parseResponse(response)
{
	resizeMap();//Resize the map

	var totalTime = 0; //The total time for the trip
	
	responseArray = eval(response); //Covert the response from JSON to objects. This is NOT a safety concern, because we trust the server and the data
	for (var i in responseArray)
	{
		var stop = responseArray[i];
		var routeInfo; //The message to display
		//IF this is the first stop
		if(i==0) 
		{
			routeInfo = "Тръгване от: ";
			//Display the begin flag if it is selected from map
			if(stop.transferStop.id == "firstStop") routeInfo += "<img src='start.png'>";
			//Or the name if it is selected otherwise
			else {
				routeInfo += stop.transferStop.name;
				placeMarker(stop.transferStop.coord, i);
			}
			
		}
		else
		{
			var prevStop = responseArray[i - 1]; //The previous stop
			if(prevStop.lines[0].id == WALK_LINE_ID)  //If we should walk to this stop
			{

				routeInfo = "<img src='" + prevStop.lines[0].image + "'>Отидете до: "; //Display the text and walk pic
				if(stop.transferStop.id == "lastStop") { //If this is the last stop
					routeInfo +=  "<img src='finish.png'>"; //Display the finish flag

				}
				else
				{
					routeInfo += "<span style=\"font-weight: bold\">" + stop.transferStop.name + "</span><br>"; //Display the stop name otherwise
					placeMarker(stop.transferStop.coord, i); //Place marker on the end of the walk
				}
				
				drawWalkLine(prevStop.transferStop.coord, stop.transferStop.coord, i); //Draw the line on map
				

			}
			else
			{
				//The message to display
				routeInfo = "Пътуване до: <span style=\"font-weight: bold\">"+ stop.transferStop.name + "</span>";
				
				placeMarker(stop.transferStop.coord, i); //Place marker on the end of the journey
				
				//Add which transports to take
				routeInfo += "<ul>";
				for(var k in prevStop.lines)
				{
					var line = prevStop.lines[k];
					routeInfo += "<li><img src='" + line.image + "'>" + line.type + " " + line.name + "</li>";
				}
				routeInfo += "</ul>";
				
				//Draw the line between stops
				drawTransitStopsLine(prevStop.transitStops, i);

			}
			totalTime +=stop.travelTime;
			routeInfo += " Време: " +  stop.travelTime + " минути"; //Add travel time
		}
		if(stop.transferStop.id == "lastStop") routeInfo += "<br><span style=\"font-weight: bold; font-size:larger\">Общо време за пътуване: </span>" + totalTime + " минути";
		addRouteInformation(routeInfo, i); //Display the information
	}
}

//Handles the response from server
function handleResponse()
{
	if (req.readyState == 4)  //If the request is ready
	{  
		clearAfterSubmit();
		if(req.status == 200) //If HTTP code is 200(OK)
		{
			var response = req.responseText; //Get the reponse
			if(response.substr(0, 6) == "Грешка") //If it is an error, display it
			{
				window.alert(response.substring(8));
			}
			else
			{	
				parseResponse(req.responseText); //Otherwise parse further the response
			}
		}
		else
		{
			window.alert("Няма връзка със сървъра!"); //On communication error, display this message
		}
	}
}

//Send request to the server
function sendRequest(beginMarker, finishMarker)
{
	clearBeforeSubmit(); //Clear the map and the route info container
	
	req = false;
	if(window.XMLHttpRequest)  //Check if XMLHTTP  is supported
	{
		try {
			req = new XMLHttpRequest();
	    } catch(e) {
				window.alert("Вашият браузър не се поддържа");
				req = false;
	    }
	}
	else if(window.ActiveXObject) //Checks for activeX support(IE)
	{
		try{
			req = new ActiveXObject("Msxml2.XMLHTTP");
		} catch(e){
				try{
					req = new new ActiveXObject("Microsoft.XMLHTTP");
				} catch(e) {
					window.alert("Вашият браузър не се поддържа"); //If nothing works, display error
					req = false;
				}
		}
	}
	
	if(req)
	{
		req.onreadystatechange = handleResponse; //Which function to handle the reponse
	}
	if(req)
	{
		//Create the request data
		var request_data = "lat1=" + beginMarker.getPosition().lat() + "&lon1=" + beginMarker.getPosition().lng() + "&lat2=" + finishMarker.getPosition().lat() + "&lon2=" + finishMarker.getPosition().lng();
		req.open("GET", "CT_SetCoordinatesPathServlet?" + request_data); //Set request options
		req.send(null); //Send request
	}
}