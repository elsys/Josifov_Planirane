CREATE FUNCTION `calcDistance`(lat1 DOUBLE, lon1 DOUBLE, lat2 DOUBLE, lon2 DOUBLE) RETURNS double
BEGIN
    DECLARE dist, diff DOUBLE;

	SET lat1 = RADIANS(lat1);
	SET lon1 = RADIANS(lon1);
	SET lat2 = RADIANS(lat2);
	SET lon2 = RADIANS(lon2);
	
	SET diff = lon2 - lon1;
	SET dist = ACOS(SIN(lat1) * SIN(lat2) + COS(lat1) * COS(lat2) * COS(diff));
	RETURN dist * 6371.2;
END;

CREATE FUNCTION `calcWalkTime`(dist DOUBLE) RETURNS int(11)
BEGIN
    DECLARE walkSpeed DOUBLE;
	SELECT CAST(paramValue AS DECIMAL) INTO walkSpeed FROM Configuration WHERE paramName="walkSpeed" LIMIT 1;
	RETURN CEIL(dist/ walkSpeed * 60);
END;

CREATE PROCEDURE `generateWalkConnections`(currStop INT, lat DOUBLE, lon DOUBLE)
BEGIN
	DECLARE walkLineId INT;
	DECLARE maxTime, walkSpeed DOUBLE;

	#Read configuration values
	SELECT CAST(paramValue AS DECIMAL) INTO walkLineId FROM Configuration WHERE paramName="walkLineId" LIMIT 1;
	SELECT CAST(paramValue AS DECIMAL) INTO walkSpeed FROM Configuration WHERE paramName="walkSpeed" LIMIT 1;
	SELECT CAST(paramValue AS DECIMAL) INTO maxTime FROM Configuration WHERE paramName="maxWalkTime" LIMIT 1;
	#Delete old walk connectios
	DELETE FROM Connections WHERE line = walkLineId AND (origStop = currStop OR destStop = currStop);
	
	#Calc nearby stops
	CALL prepareNearbyStops(lat, lon, walkSpeed * maxTime / 60);
	#Add conenctions to and from currstop to nearby stops
    INSERT INTO Connections(origStop, destStop, `line`, travelTime) SELECT currStop, idStop , walkLineId, calcWalkTime(distance) FROM nearby;
	INSERT INTO Connections(origStop, destStop, `line`, travelTime) SELECT idStop, currStop, walkLineId, calcWalkTime(distance) FROM nearby;
	DROP TEMPORARY TABLE nearby;
END;

CREATE PROCEDURE `getNearbyStops`(lat DOUBLE, lon DOUBLE, maxDistance DOUBLE)
BEGIN
	CALL prepareNearbyStops(lat, lon, maxDistance);
	SELECT idStop, calcWalkTime(distance) FROM nearby;
    DROP TEMPORARY TABLE nearby;
END ;



CREATE PROCEDURE `prepareNearbyStops`(lat DOUBLE, lon DOUBLE, maxDistance DOUBLE)
BEGIN
	DECLARE minLon, maxLon, minLat, maxLat DOUBLE;
	SET minLon = lon - maxDistance / ABS(COS(RADIANS(lat))*111);
	SET maxLon = lon + maxDistance / ABS(COS(RADIANS(lat))*111);

	SET minLat = lat - maxDistance/ 111;
	SET maxLat = lat + maxDistance / 111;

	CREATE TEMPORARY TABLE nearby ENGINE=MEMORY AS SELECT idStop, latitude, longitude, calcDistance(lat, lon, latitude, longitude) AS distance
							FROM Stops
							WHERE longitude BETWEEN minLon AND maxLon 
							AND latitude BETWEEN minLat AND maxLat 
							AND latitude <> lat 
							AND longitude <> lon
							HAVING distance <= maxDistance;
	
END;

CREATE TRIGGER `addWalkConnections` AFTER INSERT ON `Stops` FOR EACH ROW CALL generateWalkConnections(NEW.idStop, NEW.latitude, NEW.longitude);


CREATE  TRIGGER `updateWalkConnections` AFTER UPDATE ON `Stops` FOR EACH ROW CALL generateWalkConnections(NEW.idStop, NEW.latitude, NEW.longitude) ;

