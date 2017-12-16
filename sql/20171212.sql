
CREATE TABLE IF NOT EXISTS `settings` (
  `Id` smallint(5) NOT NULL AUTO_INCREMENT,
  `Key` varchar(255) NOT NULL,
  `Value` varchar(255) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `api_keys` (
  `ApiKey` varchar(255) NOT NULL,
  `Description` varchar(255) NOT NULL,
  `RightProfileId` smallint(5) unsigned NOT NULL,
  `LimitProfileId` smallint(5) unsigned NOT NULL,
  `Active` enum('YES','NO') NOT NULL DEFAULT 'NO',
  PRIMARY KEY (`ApiKey`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
