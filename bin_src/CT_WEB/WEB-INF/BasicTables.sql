DROP FUNCTION IF EXISTS `calcWalkTime`;
DROP PROCEDURE IF EXISTS `generateWalkConnections`;
DROP PROCEDURE IF EXISTS `getNearbyStops`;
DROP PROCEDURE IF EXISTS `prepareNearbyStops`;
DROP TRIGGER IF EXISTS `updateWalkConnections`;
DROP FUNCTION IF EXISTS `calcDistance`;

DROP TABLE IF EXISTS `Connections`;
DROP TABLE IF EXISTS `Stops`;
DROP TABLE IF EXISTS `Transports`;
DROP TABLE IF EXISTS `Configuration`;
DROP TABLE IF EXISTS `TransportTypes`;
DROP TABLE IF EXISTS `Providers`;



CREATE TABLE `Configuration` (
  `idConfig` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `paramName` varchar(255) NOT NULL,
  `paramValue` varchar(255) NOT NULL,
  PRIMARY KEY (`idConfig`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

INSERT INTO `Configuration` (`idConfig`,`paramName`,`paramValue`) VALUES 
 (1,'walkLineId','123'),
 (2,'walkSpeed','4.0'),
 (3,'maxWalkTime','2.25'),
 (4,'username','admin'),
 (5,'password','123');
 

CREATE TABLE `TransportTypes` (
  `idType` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idType`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;


INSERT INTO `TransportTypes` (`idType`,`name`,`imageUrl`) VALUES 
 (1,'WALK','walk.png'),
 (2,'Трамвай','tram.png'),
 (3,'Автобус','bus.png'),
 (4,'Тролей','trolley.png'),
 (5,'Метро','subway.png');

CREATE TABLE `Providers` (
  `idProvider` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idProvider`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;


INSERT INTO `Providers` (`idProvider`,`name`) VALUES 
 (1,'SKGT'),
 (2,'admin');