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
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<meta http-equiv="Content-type" content="text/html;charset=UTF-8">
		<title>Public transport</title>
	</head>
	<body>
		<form method="post" action="showPoints.jsp">
			Начална точка:<br>
			<input type="text" name="start"><br>
			Крайна точка:<br>
			<input type="text" name="end"><br>
			<input type="submit" value="Изпрати">
			</form>

	</body>
</html>