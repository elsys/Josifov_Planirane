<!-- 
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
 * -->
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<jsp:useBean id="configFile" scope="page" class="tools.ConfigurationLoader" />
<% 
//Check if configuration file exists and redirect to configuration file if it doesn't
	configFile.setContext(config.getServletContext());
	if(!configFile.isFilePresent()) { 
%>
<jsp:forward page="initialConfig.jsp"/>
<% } %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
"http://www.w3.org/TR/html4/strict.dtd">
<html>
	<head>
		<meta http-equiv="Content-type" content="text/html;charset=UTF-8">
		<title>Public transport</title>
		<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false&amp;region=BG&amp;language=bg"></script>
		<script type="text/javascript" src="interface.js"></script>
		<script type="text/javascript" src="ajax.js"></script>
		<link rel="stylesheet" type="text/css" href="style.css">
	</head>
	<body onload="initialize()">
		<div id="sidebar" style="margin: 2px; width: 200px; float: left;">
			<div class="sideMenuItem">
				<div class="searchTitle">Търсене по адрес: </div>
				<input id="address" style="width: 95%" type="text">
				<input type="button" value="Търси" onclick="javascript:search()">
			</div>
			<div id="route-container" class="sideMenuItem">
				Изберете начална и крайна точка от картата
			</div>
			* Можете да преместите началната или крайната точка за да промените маршрута
		</div>
		<div id="map-container" style="height:100%">
			<div id="context-menu" class="rightClickMenu">
				<a href="javascript:placeFlagFromRightClick(true)">Начална точка</a><br>
				<a href="javascript:placeFlagFromRightClick(false)">Крайна точка</a><br>
				<a href="javascript:hideMenu();">Затвори</a>
			</div>
		</div>

	</body>
</html>