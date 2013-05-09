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

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
"http://www.w3.org/TR/html4/strict.dtd">
<html>
	<head>
		<meta http-equiv="Content-type" content="text/html;charset=UTF-8">
		<title>Public transport - Initial Configuration</title>
		
	</head>
<body>
	<form action="SaveConfig" method="post">
		Адрес на MySQL сървъра: <input type="text" name="dbserver" value="localhost"><br>
		Име на базата данни: <input type="text" name="dbname" value="gt"><br>
		Потребителско име: <input type="text" name="dbuser" value=""><br>
		Парола: <input type="password" name="dbpass"><br>
		<input type="submit" value="Запиши"><br>
		Внимание: Базата данни трябва да съществува и въведения потребител да има пълни права над нея.
	</form>
</body>
</html>