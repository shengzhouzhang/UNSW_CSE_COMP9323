DROP TABLE IF EXISTS `9323`.`person`;
CREATE TABLE  `9323`.`person` (
  `person_id` varchar(45) NOT NULL,
  `name` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `role` varchar(45) NOT NULL,
  PRIMARY KEY (`person_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `9323`.`course`;
CREATE TABLE  `9323`.`course` (
  `course_id` varchar(45) NOT NULL,
  `course_name` varchar(45) NOT NULL,
  `lecturer_id` varchar(45) NOT NULL,
  PRIMARY KEY (`course_id`),
  KEY `FK_course_lecturer` (`lecturer_id`),
  CONSTRAINT `FK_course_lecturer` FOREIGN KEY (`lecturer_id`) REFERENCES `person` (`person_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `9323`.`enrollcourse`;
CREATE TABLE  `9323`.`enrollcourse` (
  `course_id` varchar(45) NOT NULL,
  `student_id` varchar(45) NOT NULL,
  PRIMARY KEY (`course_id`,`student_id`),
  KEY `FK_enrollcourse_1` (`student_id`),
  CONSTRAINT `FK_enrollcourse_1` FOREIGN KEY (`student_id`) REFERENCES `person` (`person_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `9323`.`enrollgroup`;
CREATE TABLE  `9323`.`enrollgroup` (
  `group_id` int(10) unsigned NOT NULL,
  `student_id` varchar(45) NOT NULL,
  PRIMARY KEY (`group_id`,`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `9323`.`group`;
CREATE TABLE  `9323`.`group` (
  `group_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `group_name` varchar(45) NOT NULL,
  `project_id` int(10) unsigned NOT NULL,
  `tutor_id` varchar(45) NOT NULL,
  PRIMARY KEY (`group_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `9323`.`operation_log`;
CREATE TABLE  `9323`.`operation_log` (
  `operation_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `operation_time` varchar(45) NOT NULL,
  `operater_Id` varchar(45) NOT NULL,
  `operation_type` varchar(45) NOT NULL,
  `repo_name` varchar(200) NOT NULL,
  PRIMARY KEY (`operation_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `9323`.`project`;
CREATE TABLE  `9323`.`project` (
  `project_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `project_name` varchar(45) NOT NULL,
  `course_id` varchar(45) NOT NULL,
  `project_description` varchar(250) NOT NULL,
  PRIMARY KEY (`project_id`,`course_id`),
  KEY `FK_project_1` (`course_id`),
  CONSTRAINT `FK_project_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `9323`.`resource`;
CREATE TABLE  `9323`.`resource` (
  `resource_id` varchar(100) NOT NULL,
  `group_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`resource_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `9323`.`session`;
CREATE TABLE  `9323`.`session` (
  `user_id` varchar(45) NOT NULL,
  `user_token` varchar(45) DEFAULT NULL,
  `login_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;