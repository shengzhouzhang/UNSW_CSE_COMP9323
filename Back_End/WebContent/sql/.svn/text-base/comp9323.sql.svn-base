/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50515
 Source Host           : localhost
 Source Database       : comp9323

 Target Server Type    : MySQL
 Target Server Version : 50515
 File Encoding         : utf-8

 Date: 09/06/2012 18:32:18 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `branch resource`
-- ----------------------------
DROP TABLE IF EXISTS `branch resource`;
CREATE TABLE `branch resource` (
  `super URI` varchar(200) NOT NULL,
  `sub URI` varchar(200) NOT NULL,
  PRIMARY KEY (`super URI`,`sub URI`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `comment`
-- ----------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `comment_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `commenter_id` varchar(45) NOT NULL,
  `comment_content` varchar(200) NOT NULL,
  `comment_time` varchar(45) NOT NULL,
  PRIMARY KEY (`comment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `course`
-- ----------------------------
DROP TABLE IF EXISTS `course`;
CREATE TABLE `course` (
  `course_id` varchar(45) NOT NULL,
  `course_name` varchar(45) NOT NULL,
  `lecturer_id` varchar(45) NOT NULL,
  PRIMARY KEY (`course_id`),
  KEY `FK_course_lecturer` (`lecturer_id`),
  CONSTRAINT `FK_course_lecturer` FOREIGN KEY (`lecturer_id`) REFERENCES `person` (`person_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `enrollcourse`
-- ----------------------------
DROP TABLE IF EXISTS `enrollcourse`;
CREATE TABLE `enrollcourse` (
  `course_id` varchar(45) NOT NULL,
  `student_id` varchar(45) NOT NULL,
  PRIMARY KEY (`course_id`,`student_id`),
  KEY `FK_enrollcourse_1` (`student_id`),
  CONSTRAINT `FK_enrollcourse_1` FOREIGN KEY (`student_id`) REFERENCES `person` (`person_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `enrollgroup`
-- ----------------------------
DROP TABLE IF EXISTS `enrollgroup`;
CREATE TABLE `enrollgroup` (
  `group_id` varchar(45) NOT NULL,
  `student_id` varchar(45) NOT NULL,
  PRIMARY KEY (`group_id`,`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `group`
-- ----------------------------
DROP TABLE IF EXISTS `group`;
CREATE TABLE `group` (
  `group_id` varchar(45) NOT NULL,
  `group_name` varchar(45) NOT NULL,
  `project_id` varchar(45) NOT NULL,
  `tutor_id` varchar(45) NOT NULL,
  PRIMARY KEY (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `operation_log`
-- ----------------------------
DROP TABLE IF EXISTS `operation_log`;
CREATE TABLE `operation_log` (
  `operation_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `operation_time` varchar(45) NOT NULL,
  `operater_Id` varchar(45) NOT NULL,
  `operation_type` varchar(45) NOT NULL,
  PRIMARY KEY (`operation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `person`
-- ----------------------------
DROP TABLE IF EXISTS `person`;
CREATE TABLE `person` (
  `person_id` varchar(45) NOT NULL,
  `name` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `role` varchar(45) NOT NULL,
  PRIMARY KEY (`person_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `project`
-- ----------------------------
DROP TABLE IF EXISTS `project`;
CREATE TABLE `project` (
  `project_id` varchar(45) NOT NULL,
  `project_name` varchar(45) NOT NULL,
  `course_id` varchar(45) NOT NULL,
  PRIMARY KEY (`project_id`,`course_id`),
  KEY `FK_project_1` (`course_id`),
  CONSTRAINT `FK_project_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `project_filepath`
-- ----------------------------
DROP TABLE IF EXISTS `project_filepath`;
CREATE TABLE `project_filepath` (
  `project_id` varchar(45) CHARACTER SET latin1 NOT NULL DEFAULT '',
  `filepath` varchar(200) CHARACTER SET latin1 NOT NULL DEFAULT '',
  PRIMARY KEY (`project_id`,`filepath`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `resource`
-- ----------------------------
DROP TABLE IF EXISTS `resource`;
CREATE TABLE `resource` (
  `resource_id` varchar(100) NOT NULL,
  `group_id` varchar(45) NOT NULL,
  PRIMARY KEY (`resource_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `session`
-- ----------------------------
DROP TABLE IF EXISTS `session`;
CREATE TABLE `session` (
  `user_id` varchar(45) NOT NULL,
  `user_token` varchar(45) NOT NULL,
  `login_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS = 1;
