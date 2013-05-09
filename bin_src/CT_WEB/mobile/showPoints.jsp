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
 <%@ page import="tools.GPSLocationRetriver" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<% request.setCharacterEncoding("UTF-8"); 
GPSLocationRetriver retriever = new GPSLocationRetriver(request.getParameter("start"), request.getParameter("end"));%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<meta http-equiv="Content-type" content="text/html;charset=UTF-8">
		<title>Public transport</title>
	</head>
	<body>
	Потвърждаване на адрес: 
		<form method="post" action="showPoints.jsp">
			<input type="text" name="start" value="<%= request.getParameter("start") %>"><input type="submit" value="Обнови"><br>
			<img src="http://maps.google.com/maps/api/staticmap?markers=<%=retriever.getStartLat()%>,<%=retriever.getStartLon()%>&amp;zoom=14&amp;size=200x200&amp;sensor=false" alt="start"><br>
			<input type="text" name="end" value="<%= request.getParameter("end") %>"><input type="submit" value="Обнови"><br>
			<img src="http://maps.google.com/maps/api/staticmap?markers=<%=retriever.getFinishLat()%>,<%=retriever.getFinishLon()%>&amp;zoom=14&amp;size=200x200&amp;sensor=false" alt="end"><br>
		</form>
		<form method="post" action="ShowRoute">
			<input type="hidden" name="startLat" value="<%=retriever.getStartLat()%>">
			<input type="hidden" name="startLon" value="<%=retriever.getStartLon()%>">
			<input type="hidden" name="endLat" value="<%=retriever.getFinishLat()%>">
			<input type="hidden" name="endLon" value="<%=retriever.getFinishLon()%>">
			<input type="hidden" name="start" value="<%=request.getParameter("start")%>">
			<input type="hidden" name="end" value="<%=request.getParameter("end")%>">
			<input type="submit" value="Напред">
		</form>
	</body>
</html>