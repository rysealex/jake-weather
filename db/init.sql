SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema jake_weather
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `jake_weather` DEFAULT CHARACTER SET utf8 ;
USE `jake_weather` ;

-- -----------------------------------------------------
-- Table `jake_weather`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `jake_weather`.`user` (
  `userid` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(40) NOT NULL,
  `fname` VARCHAR(45) NOT NULL,
  `lname` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(20) NOT NULL,
  `country` VARCHAR(45) NOT NULL,
  `city` VARCHAR(45) NOT NULL,
  `state` CHAR(2) NOT NULL,
  `zip` CHAR(5) NOT NULL,
  PRIMARY KEY (`userid`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `jake_weather`.`favlocations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `jake_weather`.`favlocations` (
  `locationid` INT NOT NULL AUTO_INCREMENT,
  `userid` INT NOT NULL,
  `latitude` FLOAT NOT NULL,
  `longitude` FLOAT NOT NULL,
  `city` VARCHAR(45) NOT NULL,
  `state` CHAR(2) NOT NULL,
  `country` VARCHAR(45) NOT NULL,
  `zip` CHAR(5) NOT NULL,
  PRIMARY KEY (`locationid`),
  INDEX `favlocations_user_idx` (`userid` ASC) VISIBLE,
  CONSTRAINT `favlocations_user`
    FOREIGN KEY (`userid`)
    REFERENCES `jake_weather`.`user` (`userid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;