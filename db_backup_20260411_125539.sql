-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: competencedb
-- ------------------------------------------------------
-- Server version	8.0.45-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `competencedb`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `competencedb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `competencedb`;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
INSERT INTO `auth_group` VALUES (1,'admin'),(2,'analytics'),(4,'statistics'),(3,'teacher');
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=139 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
INSERT INTO `auth_group_permissions` VALUES (1,1,1),(2,1,2),(3,1,3),(4,1,4),(5,1,5),(6,1,6),(7,1,7),(8,1,8),(9,1,9),(10,1,10),(11,1,11),(12,1,12),(13,1,13),(14,1,14),(15,1,15),(16,1,16),(17,1,17),(18,1,18),(19,1,19),(20,1,20),(21,1,21),(22,1,22),(23,1,23),(24,1,24),(25,1,25),(26,1,26),(27,1,27),(28,1,28),(29,1,29),(30,1,30),(31,1,31),(32,1,32),(33,1,33),(34,1,34),(35,1,35),(36,1,36),(37,1,37),(38,1,38),(39,1,39),(40,1,40),(41,1,41),(42,1,42),(43,1,43),(44,1,44),(45,1,45),(46,1,46),(47,1,47),(48,1,48),(49,1,49),(50,1,50),(51,1,51),(52,1,52),(53,1,53),(54,1,54),(55,1,55),(56,1,56),(57,1,57),(58,1,58),(59,1,59),(60,1,60),(61,1,61),(62,1,62),(63,1,63),(64,1,64),(65,1,65),(66,1,66),(67,1,67),(68,1,68),(69,1,69),(70,1,70),(71,1,71),(72,1,72),(73,1,73),(74,1,74),(75,1,75),(76,1,76),(77,1,77),(78,1,78),(79,1,79),(80,1,80),(81,1,81),(82,1,82),(83,1,83),(84,1,84),(85,1,85),(86,1,86),(87,1,87),(88,1,88),(89,1,89),(90,1,90),(91,1,91),(92,1,92),(93,2,4),(94,2,8),(95,2,12),(96,2,16),(97,2,20),(98,2,24),(99,2,28),(100,2,32),(101,2,36),(102,2,40),(103,2,44),(104,2,48),(105,2,52),(106,2,56),(107,2,60),(108,2,64),(109,2,68),(110,2,72),(111,2,76),(112,2,80),(113,2,84),(114,2,88),(115,2,92),(116,3,4),(117,3,8),(118,3,12),(119,3,16),(120,3,20),(121,3,24),(122,3,28),(123,3,32),(124,3,36),(125,3,40),(126,3,44),(127,3,48),(128,3,52),(129,3,56),(130,3,60),(131,3,64),(132,3,68),(133,3,72),(134,3,76),(135,3,80),(136,3,84),(137,3,88),(138,3,92);
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add content type',4,'add_contenttype'),(14,'Can change content type',4,'change_contenttype'),(15,'Can delete content type',4,'delete_contenttype'),(16,'Can view content type',4,'view_contenttype'),(17,'Can add session',5,'add_session'),(18,'Can change session',5,'change_session'),(19,'Can delete session',5,'delete_session'),(20,'Can view session',5,'view_session'),(21,'Can add user',6,'add_customuser'),(22,'Can change user',6,'change_customuser'),(23,'Can delete user',6,'delete_customuser'),(24,'Can view user',6,'view_customuser'),(25,'Can add annee',7,'add_annee'),(26,'Can change annee',7,'change_annee'),(27,'Can delete annee',7,'delete_annee'),(28,'Can view annee',7,'view_annee'),(29,'Can add catalogue',8,'add_catalogue'),(30,'Can change catalogue',8,'change_catalogue'),(31,'Can delete catalogue',8,'delete_catalogue'),(32,'Can view catalogue',8,'view_catalogue'),(33,'Can add eleve',9,'add_eleve'),(34,'Can change eleve',9,'change_eleve'),(35,'Can delete eleve',9,'delete_eleve'),(36,'Can view eleve',9,'view_eleve'),(37,'Can add etape',10,'add_etape'),(38,'Can change etape',10,'change_etape'),(39,'Can delete etape',10,'delete_etape'),(40,'Can view etape',10,'view_etape'),(41,'Can add groupage data',11,'add_groupagedata'),(42,'Can change groupage data',11,'change_groupagedata'),(43,'Can delete groupage data',11,'delete_groupagedata'),(44,'Can view groupage data',11,'view_groupagedata'),(45,'Can add item',12,'add_item'),(46,'Can change item',12,'change_item'),(47,'Can delete item',12,'delete_item'),(48,'Can view item',12,'view_item'),(49,'Can add matiere',13,'add_matiere'),(50,'Can change matiere',13,'change_matiere'),(51,'Can delete matiere',13,'delete_matiere'),(52,'Can view matiere',13,'view_matiere'),(53,'Can add my image',14,'add_myimage'),(54,'Can change my image',14,'change_myimage'),(55,'Can delete my image',14,'delete_myimage'),(56,'Can view my image',14,'view_myimage'),(57,'Can add niveau',15,'add_niveau'),(58,'Can change niveau',15,'change_niveau'),(59,'Can delete niveau',15,'delete_niveau'),(60,'Can view niveau',15,'view_niveau'),(61,'Can add pdf layout',16,'add_pdflayout'),(62,'Can change pdf layout',16,'change_pdflayout'),(63,'Can delete pdf layout',16,'delete_pdflayout'),(64,'Can view pdf layout',16,'view_pdflayout'),(65,'Can add report',17,'add_report'),(66,'Can change report',17,'change_report'),(67,'Can delete report',17,'delete_report'),(68,'Can view report',17,'view_report'),(69,'Can add report catalogue',18,'add_reportcatalogue'),(70,'Can change report catalogue',18,'change_reportcatalogue'),(71,'Can delete report catalogue',18,'delete_reportcatalogue'),(72,'Can view report catalogue',18,'view_reportcatalogue'),(73,'Can add resultat',19,'add_resultat'),(74,'Can change resultat',19,'change_resultat'),(75,'Can delete resultat',19,'delete_resultat'),(76,'Can view resultat',19,'view_resultat'),(77,'Can add resultat detail',20,'add_resultatdetail'),(78,'Can change resultat detail',20,'change_resultatdetail'),(79,'Can delete resultat detail',20,'delete_resultatdetail'),(80,'Can view resultat detail',20,'view_resultatdetail'),(81,'Can add score rule',21,'add_scorerule'),(82,'Can change score rule',21,'change_scorerule'),(83,'Can delete score rule',21,'delete_scorerule'),(84,'Can view score rule',21,'view_scorerule'),(85,'Can add translation',22,'add_translation'),(86,'Can change translation',22,'change_translation'),(87,'Can delete translation',22,'delete_translation'),(88,'Can view translation',22,'view_translation'),(89,'Can add score rule point',23,'add_scorerulepoint'),(90,'Can change score rule point',23,'change_scorerulepoint'),(91,'Can delete score rule point',23,'delete_scorerulepoint'),(92,'Can view score rule point',23,'view_scorerulepoint');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `competence_annee`
--

DROP TABLE IF EXISTS `competence_annee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `competence_annee` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `is_active` tinyint(1) NOT NULL,
  `start_date` date DEFAULT NULL,
  `stop_date` date DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `annee_active_idx` (`is_active`),
  KEY `annee_start_date_idx` (`start_date`),
  KEY `annee_stop_date_idx` (`stop_date`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `competence_annee`
--

LOCK TABLES `competence_annee` WRITE;
/*!40000 ALTER TABLE `competence_annee` DISABLE KEYS */;
INSERT INTO `competence_annee` VALUES (1,1,'2024-01-01',NULL,'2024-2025');
/*!40000 ALTER TABLE `competence_annee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `competence_catalogue`
--

DROP TABLE IF EXISTS `competence_catalogue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `competence_catalogue` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` longtext,
  `annee_id` bigint NOT NULL,
  `etape_id` bigint NOT NULL,
  `matiere_id` bigint NOT NULL,
  `niveau_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `catalogue_niveau_idx` (`niveau_id`),
  KEY `catalogue_etape_idx` (`etape_id`),
  KEY `catalogue_annee_idx` (`annee_id`),
  KEY `catalogue_matiere_idx` (`matiere_id`),
  CONSTRAINT `competence_catalogue_annee_id_03682a27_fk_competence_annee_id` FOREIGN KEY (`annee_id`) REFERENCES `competence_annee` (`id`),
  CONSTRAINT `competence_catalogue_etape_id_1718b45a_fk_competence_etape_id` FOREIGN KEY (`etape_id`) REFERENCES `competence_etape` (`id`),
  CONSTRAINT `competence_catalogue_matiere_id_26006e15_fk_competenc` FOREIGN KEY (`matiere_id`) REFERENCES `competence_matiere` (`id`),
  CONSTRAINT `competence_catalogue_niveau_id_9a69929d_fk_competence_niveau_id` FOREIGN KEY (`niveau_id`) REFERENCES `competence_niveau` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `competence_catalogue`
--

LOCK TABLES `competence_catalogue` WRITE;
/*!40000 ALTER TABLE `competence_catalogue` DISABLE KEYS */;
INSERT INTO `competence_catalogue` VALUES (1,'CP Point Repere Mathematiques 24-25',1,2,3,3),(2,'CP Point Etape Mathematiques 24-25',1,3,3,3),(3,'CP Bilan Fin annee Mathematiques 24-25',1,4,3,3),(4,'E1 Point Repere Mathematiques 24-25',1,2,3,4),(5,'E1 Point Etape Mathematiques 24-25',1,3,3,4),(6,'E1 Bilan Fin annee Mathematiques 24-25',1,4,3,4),(7,'E2 Point Repere Mathematiques 24-25',1,2,3,5),(8,'E2 Point Etape Mathematiques 24-25',1,3,3,5),(9,'E2 Bilan Fin annee Mathematiques 24-25',1,4,3,5),(10,'M1 Point Repere Mathematiques 24-25',1,2,3,6),(11,'M1 Point Etape Mathematiques 24-25',1,3,3,6),(12,'M1 Bilan Fin annee Mathematiques 24-25',1,4,3,6),(13,'M2 Point Repere Mathematiques 24-25',1,2,3,7),(14,'M2 Point Etape Mathematiques 24-25',1,3,3,7),(15,'M2 Bilan Fin annee Mathematiques 24-25',1,4,3,7),(16,'CP Point Repere Francais 24-25',1,2,2,3),(17,'CP Point Etape Francais 24-25',1,3,2,3),(18,'CP Bilan Fin annee Francais 24-25',1,4,2,3),(19,'E1 Point Repere Francais 24-25',1,2,2,4),(20,'E1 Point Etape Francais 24-25',1,3,2,4),(21,'E1 Bilan Fin annee Francais 24-25',1,4,2,4),(22,'E2 Point Repere Francais 24-25',1,2,2,5),(23,'E2 Point Etape Francais 24-25',1,3,2,5),(24,'E2 Bilan Fin annee Francais 24-25',1,4,2,5),(25,'M1 Point Repere Francais 24-25',1,2,2,6),(26,'M1 Point Etape Francais 24-25',1,3,2,6),(27,'M1 Bilan Fin annee Francais 24-25',1,4,2,6),(28,'M2 Point Repere Francais 24-25',1,2,2,7),(29,'M2 Point Etape Francais 24-25',1,3,2,7),(30,'M2 Bilan Fin annee Francais 24-25',1,4,2,7),(31,'GS Point Repere - VERSION DETAILLEE',1,2,1,2),(32,'GS Point Etape - VERSION DETAILLEE',1,3,1,2),(33,'GS Point Repere - VERSION RAPIDE',1,2,1,2),(34,'Grande Section Maternelle',1,5,1,2),(35,'CP Test Mathematiques initial',1,5,3,3),(36,'CP Test Language initial',1,5,2,3),(37,'Large Kindergarten Section',1,6,1,2),(38,'CP Initial Mathematics Test',1,6,3,3),(39,'CP Initial Language Test',1,6,4,3),(40,'Slot Kementad-Ker',1,8,1,2),(41,'Test Matematikoù Kentañ CP',1,8,5,3),(42,'Test Yezh Kentañ CP',1,8,2,3),(43,'Große Kindergartenabteilung',1,7,1,2),(44,'CP Ersttest Mathematik',1,7,6,3),(45,'CP Ersttest Sprache',1,7,2,3);
/*!40000 ALTER TABLE `competence_catalogue` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `competence_catalogue_professeurs`
--

DROP TABLE IF EXISTS `competence_catalogue_professeurs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `competence_catalogue_professeurs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `catalogue_id` bigint NOT NULL,
  `customuser_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `competence_catalogue_pro_catalogue_id_customuser__d61e35f4_uniq` (`catalogue_id`,`customuser_id`),
  KEY `competence_catalogue_customuser_id_96ab00b5_fk_competenc` (`customuser_id`),
  CONSTRAINT `competence_catalogue_catalogue_id_3508dc4f_fk_competenc` FOREIGN KEY (`catalogue_id`) REFERENCES `competence_catalogue` (`id`),
  CONSTRAINT `competence_catalogue_customuser_id_96ab00b5_fk_competenc` FOREIGN KEY (`customuser_id`) REFERENCES `competence_customuser` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `competence_catalogue_professeurs`
--

LOCK TABLES `competence_catalogue_professeurs` WRITE;
/*!40000 ALTER TABLE `competence_catalogue_professeurs` DISABLE KEYS */;
INSERT INTO `competence_catalogue_professeurs` VALUES (13,31,6),(16,31,7),(14,32,6),(17,32,7),(15,33,6),(18,33,7),(1,34,2),(2,35,2),(3,36,2),(10,37,5),(11,38,5),(12,39,5),(7,40,4),(8,41,4),(9,42,4),(4,43,3),(5,44,3),(6,45,3);
/*!40000 ALTER TABLE `competence_catalogue_professeurs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `competence_customuser`
--

DROP TABLE IF EXISTS `competence_customuser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `competence_customuser` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  `lang` varchar(2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `competence_customuser`
--

LOCK TABLES `competence_customuser` WRITE;
/*!40000 ALTER TABLE `competence_customuser` DISABLE KEYS */;
INSERT INTO `competence_customuser` VALUES (1,'pbkdf2_sha256$600000$HYFGoRlAZVU87DnOc6NeWo$mfjQBbbjv5zuDpMlNxFo+A+SKwM2c44uR8soTG8O+NU=','2026-04-10 17:32:44.314895',1,'compet','','','admin@nathabee.de',1,1,'2026-04-10 16:52:53.768634','en'),(2,'pbkdf2_sha256$600000$7guw1R8yROOWAC4oaHgYsb$JQOfa2zJpFjw289+h71TpWeSTg13rqLN/xN6LKqaKgA=',NULL,0,'jacques','Jacques','Dupain','',0,1,'2026-04-10 17:01:32.561951','fr'),(3,'pbkdf2_sha256$600000$QYR8o4aG3o06nl6Yb9q8N7$q4rSg8LTqhT6NwagBUMzzlQTzKz3DUrDyC+C2S0Mj2A=',NULL,0,'jakob','Jakob','Brotmann','',0,1,'2026-04-10 17:01:32.956630','de'),(4,'pbkdf2_sha256$600000$YdKuk5I3dqbDOkCcVM2zXY$25yrX2/ZxFvS3k9wJqFUkeMEsypFPiX73PcYZD0I/W0=',NULL,0,'jakez','Jakez','Bara','',0,1,'2026-04-10 17:01:33.335959','br'),(5,'pbkdf2_sha256$600000$n5TwsM4sUjXuqyh8udfmPz$atnmglGkXJhZdp9lOhnS4BvCVqFsu8m7UBJMbdobjls=',NULL,0,'james','James','Breadman','',0,1,'2026-04-10 17:01:33.716693','en'),(6,'pbkdf2_sha256$600000$zQuSczf1tbM8mmY0CdinYP$zfG6NxHZ0Wu5q9KG6AF9AA9/Q5/7dUtmabj9kTdCfow=',NULL,0,'nathaprof','Nathalie','Legrand','',0,1,'2026-04-10 17:01:34.178609','fr'),(7,'pbkdf2_sha256$600000$ZlFe3gW3VafULJn3pnRCjQ$mfMYaQUYrUY6OZqKPb3mcpJxoSHQjUYk5I+CsAEqHSI=',NULL,0,'nathachef','Nathalie','Bordas','',1,1,'2026-04-10 17:01:34.574623','fr'),(8,'pbkdf2_sha256$600000$EtKXFs3jEJmLoX8jZEl0lu$mGIRSVcapLikb40ayynHeS0Po6EY9QV75cGPEZO785w=',NULL,0,'compet_ci','','','nathabee123@gmail.com',0,1,'2026-04-11 09:04:08.529929','en');
/*!40000 ALTER TABLE `competence_customuser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `competence_customuser_groups`
--

DROP TABLE IF EXISTS `competence_customuser_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `competence_customuser_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `customuser_id` bigint NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `competence_customuser_gr_customuser_id_group_id_f53d2351_uniq` (`customuser_id`,`group_id`),
  KEY `competence_customuser_groups_group_id_afd4d1a5_fk_auth_group_id` (`group_id`),
  CONSTRAINT `competence_customuse_customuser_id_5940b2c1_fk_competenc` FOREIGN KEY (`customuser_id`) REFERENCES `competence_customuser` (`id`),
  CONSTRAINT `competence_customuser_groups_group_id_afd4d1a5_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `competence_customuser_groups`
--

LOCK TABLES `competence_customuser_groups` WRITE;
/*!40000 ALTER TABLE `competence_customuser_groups` DISABLE KEYS */;
INSERT INTO `competence_customuser_groups` VALUES (1,2,3),(2,3,3),(3,4,3),(4,5,3),(5,6,3),(6,7,1),(7,7,4);
/*!40000 ALTER TABLE `competence_customuser_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `competence_customuser_user_permissions`
--

DROP TABLE IF EXISTS `competence_customuser_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `competence_customuser_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `customuser_id` bigint NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `competence_customuser_us_customuser_id_permission_f02236fc_uniq` (`customuser_id`,`permission_id`),
  KEY `competence_customuse_permission_id_2d805a3c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `competence_customuse_customuser_id_afa58cd0_fk_competenc` FOREIGN KEY (`customuser_id`) REFERENCES `competence_customuser` (`id`),
  CONSTRAINT `competence_customuse_permission_id_2d805a3c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `competence_customuser_user_permissions`
--

LOCK TABLES `competence_customuser_user_permissions` WRITE;
/*!40000 ALTER TABLE `competence_customuser_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `competence_customuser_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `competence_eleve`
--

DROP TABLE IF EXISTS `competence_eleve`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `competence_eleve` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `datenaissance` date DEFAULT NULL,
  `niveau_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `eleve_niveau_idx` (`niveau_id`),
  CONSTRAINT `competence_eleve_niveau_id_4b9366ee_fk_competence_niveau_id` FOREIGN KEY (`niveau_id`) REFERENCES `competence_niveau` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `competence_eleve`
--

LOCK TABLES `competence_eleve` WRITE;
/*!40000 ALTER TABLE `competence_eleve` DISABLE KEYS */;
INSERT INTO `competence_eleve` VALUES (1,'Valjean','Jean','2021-04-10',3);
/*!40000 ALTER TABLE `competence_eleve` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `competence_eleve_professeurs`
--

DROP TABLE IF EXISTS `competence_eleve_professeurs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `competence_eleve_professeurs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `eleve_id` bigint NOT NULL,
  `customuser_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `competence_eleve_profess_eleve_id_customuser_id_6f21d292_uniq` (`eleve_id`,`customuser_id`),
  KEY `competence_eleve_pro_customuser_id_a608df8a_fk_competenc` (`customuser_id`),
  CONSTRAINT `competence_eleve_pro_customuser_id_a608df8a_fk_competenc` FOREIGN KEY (`customuser_id`) REFERENCES `competence_customuser` (`id`),
  CONSTRAINT `competence_eleve_pro_eleve_id_7c711c79_fk_competenc` FOREIGN KEY (`eleve_id`) REFERENCES `competence_eleve` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `competence_eleve_professeurs`
--

LOCK TABLES `competence_eleve_professeurs` WRITE;
/*!40000 ALTER TABLE `competence_eleve_professeurs` DISABLE KEYS */;
INSERT INTO `competence_eleve_professeurs` VALUES (1,1,6);
/*!40000 ALTER TABLE `competence_eleve_professeurs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `competence_etape`
--

DROP TABLE IF EXISTS `competence_etape`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `competence_etape` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `etape` varchar(10) NOT NULL,
  `description` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `etape_idx` (`etape`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `competence_etape`
--

LOCK TABLES `competence_etape` WRITE;
/*!40000 ALTER TABLE `competence_etape` DISABLE KEYS */;
INSERT INTO `competence_etape` VALUES (1,'?','Etape par default'),(2,'DEBUT','Etape repere'),(3,'INTER','Point Etape'),(4,'FINAL','Bilan fin d\'annee'),(5,'FR','Etape Repere '),(6,'EN','Initial test'),(7,'DE','Jahresanfang'),(8,'BR','Bloavez Kentañ');
/*!40000 ALTER TABLE `competence_etape` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `competence_groupagedata`
--

DROP TABLE IF EXISTS `competence_groupagedata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `competence_groupagedata` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `position` int NOT NULL,
  `desc_groupage` varchar(100) NOT NULL,
  `label_groupage` varchar(100) NOT NULL,
  `link` varchar(500) NOT NULL,
  `max_point` int NOT NULL,
  `seuil1` int NOT NULL,
  `seuil2` int NOT NULL,
  `max_item` int NOT NULL,
  `catalogue_id` bigint NOT NULL,
  `groupage_icon_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `competence_groupaged_groupage_icon_id_8bc76158_fk_competenc` (`groupage_icon_id`),
  KEY `groupagedata_catalogue_idx` (`catalogue_id`),
  CONSTRAINT `competence_groupaged_catalogue_id_7d32e7f2_fk_competenc` FOREIGN KEY (`catalogue_id`) REFERENCES `competence_catalogue` (`id`),
  CONSTRAINT `competence_groupaged_groupage_icon_id_8bc76158_fk_competenc` FOREIGN KEY (`groupage_icon_id`) REFERENCES `competence_myimage` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `competence_groupagedata`
--

LOCK TABLES `competence_groupagedata` WRITE;
/*!40000 ALTER TABLE `competence_groupagedata` DISABLE KEYS */;
INSERT INTO `competence_groupagedata` VALUES (1,1,'évaluation repères CP : Comprendre des mots','Comprendre des mots','https://www.education.gouv.fr/media/115921/download',15,6,10,0,16,NULL),(2,2,'évaluation repères CP : Comprendre des phrases','Comprendre des phrases','https://www.education.gouv.fr/media/115963/download',14,6,10,0,16,NULL),(3,3,'évaluation repères CP : Comprendre un texte','Comprendre un texte','https://www.education.gouv.fr/media/115972/download',11,3,5,0,16,NULL),(4,4,'évaluation repères CP : Connaître le nom des lettres','Connaître le nom des lettres','https://www.education.gouv.fr/media/115978/download',10,2,5,0,16,NULL),(5,5,'évaluation repères CP : Manipuler des phonèmes','Manipuler des phonèmes','https://www.education.gouv.fr/media/116005/download',15,2,5,0,16,NULL),(6,6,'évaluation repères CP : Manipuler des syllabes','Manipuler des syllabes','https://www.education.gouv.fr/media/116008/download',15,5,8,0,16,NULL),(7,7,'évaluation repères CP : Reconnaître des lettres','Reconnaître des lettres','https://www.education.gouv.fr/media/116017/download',9,0,1,0,16,NULL),(8,1,'évaluation repères CP : Comparer des nombres','Comparer des nombres','https://www.education.gouv.fr/media/115915/download',9,0,1,0,1,NULL),(9,2,'évaluation repères CP : Compter des objets','Compter des objets','https://www.education.gouv.fr/media/115975/download',9,0,1,0,1,NULL),(10,3,'évaluation repères CP : Écrire des nombres','Écrire des nombres','https://www.education.gouv.fr/media/115987/download',9,0,1,0,1,NULL),(11,4,'évaluation repères CP : Lire des nombres','Lire des nombres','https://www.education.gouv.fr/media/115996/download',9,0,1,0,1,NULL),(12,5,'évaluation repères CP : Placer un nombre sur une ligne graduée','Placer un nombre sur une ligne graduée','https://www.education.gouv.fr/media/116014/download',9,0,1,0,1,NULL),(13,6,'évaluation repères CP : Résoudre les problèmes','Résoudre les problèmes','https://www.education.gouv.fr/media/116023/download',9,0,1,0,1,NULL),(14,7,'évaluation repères CP : Résoudre un problème en géométrie','Résoudre un problème en géométrie','https://www.education.gouv.fr/media/116026/download',9,0,1,0,1,NULL),(15,1,'évaluation Point d\'étape : Comprendre des phrases lues seul','Comprendre des phrases lues seul','https://www.education.gouv.fr/media/119731/download',9,0,1,0,17,NULL),(16,2,'évaluation Point d\'étape : Comprendre des phrases','Comprendre des phrases','https://www.education.gouv.fr/media/119734/download',9,0,1,0,17,NULL),(17,3,'évaluation Point d\'étape : Connaître le nom des lettres','Connaître le nom des lettres','https://www.education.gouv.fr/media/119737/download',9,0,1,0,17,NULL),(18,4,'évaluation Point d\'étape : Écrire des mots','Écrire des mots','https://www.education.gouv.fr/media/119740/download',9,0,1,0,17,NULL),(19,5,'évaluation Point d\'étape : Écrire des syllabes','Écrire des syllabes','https://www.education.gouv.fr/media/119743/download',9,0,1,0,17,NULL),(20,6,'évaluation Point d\'étape : Lire à voix haute des mots','Lire à voix haute des mots','https://www.education.gouv.fr/media/119746/download',9,0,1,0,17,NULL),(21,7,'évaluation Point d\'étape : Lire à voix haute un texte','Lire à voix haute un texte','https://www.education.gouv.fr/media/119749/download',9,0,1,0,17,NULL),(22,8,'évaluation Point d\'étape :  Manipuler des phonèmes',' Manipuler des phonèmes','https://www.education.gouv.fr/media/119752/download',9,0,1,0,17,NULL),(23,1,'évaluation Point d\'étape CP : Additionner','Additionner','https://www.education.gouv.fr/media/119710/download',9,0,1,0,2,NULL),(24,2,'évaluation Point d\'étape CP : Comparer des nombres','Comparer des nombres','https://www.education.gouv.fr/media/119713/download',9,0,1,0,2,NULL),(25,3,'évaluation Point d\'étape CP : Écrire des nombres','Écrire des nombres','https://www.education.gouv.fr/media/119716/download',9,0,1,0,2,NULL),(26,4,'évaluation Point d\'étape CP : Placer un nombre sur une ligne graduée','Placer un nombre sur une ligne graduée','https://www.education.gouv.fr/media/119719/download',9,0,1,0,2,NULL),(27,5,'évaluation Point d\'étape CP : Résoudre des problèmes','Résoudre des problèmes','https://www.education.gouv.fr/media/119722/download',9,0,1,0,2,NULL),(28,6,'évaluation Point d\'étape CP : Soustraire','Soustraire','https://www.education.gouv.fr/media/119725/download',9,0,1,0,2,NULL),(29,1,'évaluation repères CE1 : Comprendre des mots','Comprendre des mots','https://www.education.gouv.fr/media/115918/download',9,0,1,0,19,NULL),(30,2,'évaluation repères CE1 : Comprendre des phrases','Comprendre des phrases','https://www.education.gouv.fr/media/115924/download',9,0,1,0,19,NULL),(31,3,'évaluation repères CE1 : Comprendre des phrases lues seul','Comprendre des phrases lues seul','https://www.education.gouv.fr/media/115927/download',9,0,1,0,19,NULL),(32,4,'évaluation repères CE1 : Comprendre un texte lu seul','Comprendre un texte lu seul','https://www.education.gouv.fr/media/115969/download',9,0,1,0,19,NULL),(33,5,'évaluation repères CE1 : Écrire des mots','Écrire des mots','https://www.education.gouv.fr/media/115981/download',9,0,1,0,19,NULL),(34,6,'évaluation repères CE1 : Écrire des syllabes','Écrire des syllabes','https://www.education.gouv.fr/media/115990/download',9,0,1,0,19,NULL),(35,7,'évaluation repères CE1 : Lire à voix haute des mots','Lire à voix haute des mots','https://www.education.gouv.fr/media/115999/download',9,0,1,0,19,NULL),(36,8,'évaluation repères CE1 : Lire à voix haute un texte','Lire à voix haute un texte','https://www.education.gouv.fr/media/116002/download',9,0,1,0,19,NULL),(37,1,'évaluation repères CE1 : Calculer mentalement','Calculer mentalement','https://www.education.gouv.fr/media/115852/download',9,0,1,0,4,NULL),(38,2,'évaluation repères CE1 : Additionner','Additionner','https://www.education.gouv.fr/media/115849/download',9,0,1,0,4,NULL),(39,3,'évaluation repères CE1 : Écrire des nombres','Écrire des nombres','https://www.education.gouv.fr/media/115984/download',9,0,1,0,4,NULL),(40,4,'évaluation repères CE1 : Lire des nombres','Lire des nombres','https://www.education.gouv.fr/media/115993/download',9,0,1,0,4,NULL),(41,5,'évaluation repères CE1 : Placer un nombre sur une ligne graduée','Placer un nombre sur une ligne graduée','https://www.education.gouv.fr/media/116011/download',9,0,1,0,4,NULL),(42,6,'évaluation repères CE1 : Résoudre des problèmes','Résoudre des problèmes','https://www.education.gouv.fr/media/116020/download',9,0,1,0,4,NULL),(43,7,'évaluation repères CE1 : Résoudre un problème en géométrie','Résoudre un problème en géométrie','https://www.education.gouv.fr/media/116029/download',9,0,1,0,4,NULL),(44,8,'évaluation repères CE1 : Soustraire','Soustraire','https://www.education.gouv.fr/media/116032/download',9,0,1,0,4,NULL),(45,1,'évaluations repères CM1 : Comprendre un texte','Comprendre un texte','https://www.education.gouv.fr/media/157629/download',9,0,1,0,25,NULL),(46,2,'évaluations repères CM1 : Comprendre un texte lu seul','Comprendre un texte lu seul','https://www.education.gouv.fr/media/157632/download',9,0,1,0,25,NULL),(47,3,'évaluations repères CM1 : Lire à voix haute un texte','Lire à voix haute un texte','https://www.education.gouv.fr/media/157635/download',9,0,1,0,25,NULL),(48,4,'évaluations repères CM1 : Écrire des mots','Écrire des mots','https://www.education.gouv.fr/media/157638/download',9,0,1,0,25,NULL),(49,5,'évaluations repères CM1 : Reconnaître des synonymes','Reconnaître des synonymes','https://www.education.gouv.fr/media/157641/download',9,0,1,0,25,NULL),(50,6,'évaluations repères CM1 : Reconnaître des mots de la même famille','Reconnaître des mots de la même famille','https://www.education.gouv.fr/media/157644/download',9,0,1,0,25,NULL),(51,7,'évaluations repères CM1 : Repérer le sujet et le verbe','Repérer le sujet et le verbe','https://www.education.gouv.fr/media/157647/download',9,0,1,0,25,NULL),(52,8,'évaluations repères CM1 : Accorder le nom et l’adjectif','Accorder le nom et l’adjectif','https://www.education.gouv.fr/media/157650/download',9,0,1,0,25,NULL),(53,9,'évaluations repères CM1 : Accorder le sujet et le verbe','Accorder le sujet et le verbe','https://www.education.gouv.fr/media/157653/download',9,0,1,0,25,NULL),(54,1,'évaluations repères CM1 : Écrire des nombres entiers','Écrire des nombres entiers','https://www.education.gouv.fr/media/157656/download',9,0,1,0,10,NULL),(55,2,'évaluations repères CM1 : Placer un nombre sur une ligne graduée','Placer un nombre sur une ligne graduée','https://www.education.gouv.fr/media/157659/download',9,0,1,0,10,NULL),(56,3,'évaluations repères CM1 : Résoudre des problèmes','Résoudre des problèmes','https://www.education.gouv.fr/media/157662/download',9,0,1,0,10,NULL),(57,4,'évaluations repères CM1 : Connaître les tables de multiplication','Connaître les tables de multiplication','https://www.education.gouv.fr/media/157665/download',9,0,1,0,10,NULL),(58,5,'évaluations repères CM1 : Calculer rapidement','Calculer rapidement','https://www.education.gouv.fr/media/157668/download',9,0,1,0,10,NULL),(59,6,'évaluations repères CM1 : Poser et calculer','Poser et calculer','https://www.education.gouv.fr/media/157671/download',9,0,1,0,10,NULL),(60,1,'évaluations repères GS : LES COULEURS','LES COULEURS','https://ec72.fr/wp-content/uploads/sites/42/2021/09/Evaldiag-GS-livret-ma%C3%AEtre-DEC72-Juin21.docx.pdf',22,5,8,22,31,3),(61,2,'évaluations repères GS : RECONNAISSANCE PRENOM','RECONNAISSANCE PRENOM','https://ec72.fr/wp-content/uploads/sites/42/2021/09/Evaldiag-GS-livret-ma%C3%AEtre-DEC72-Juin21.docx.pdf',5,2,3,8,31,7),(62,3,'évaluations repères GS : REPÉRAGE SPATIAL ET TOPOLOGIE','REPÉRAGE SPATIAL ET TOPOLOGIE','https://ec72.fr/wp-content/uploads/sites/42/2021/09/Evaldiag-GS-livret-ma%C3%AEtre-DEC72-Juin21.docx.pdf',32,4,6,16,31,9),(63,4,'évaluations repères GS : CATEGORISATION','CATEGORISATION','https://ec72.fr/wp-content/uploads/sites/42/2021/09/Evaldiag-GS-livret-ma%C3%AEtre-DEC72-Juin21.docx.pdf',6,2,3,6,31,2),(64,5,'évaluations repères GS : MEMORISATION HISTOIRE','MEMORISATION HISTOIRE','https://ec72.fr/wp-content/uploads/sites/42/2021/09/Evaldiag-GS-livret-ma%C3%AEtre-DEC72-Juin21.docx.pdf',10,2,3,7,31,4),(65,6,'évaluations repères GS : LA SUITE NUMÉRIQUE','LA SUITE NUMÉRIQUE','https://ec72.fr/wp-content/uploads/sites/42/2021/09/Evaldiag-GS-livret-ma%C3%AEtre-DEC72-Juin21.docx.pdf',15,2,3,8,31,5),(66,7,'évaluations repères GS : LA RÉSOLUTION DE PROBLEMES','LA RÉSOLUTION DE PROBLEMES','https://ec72.fr/wp-content/uploads/sites/42/2021/09/Evaldiag-GS-livret-ma%C3%AEtre-DEC72-Juin21.docx.pdf',6,1,2,3,31,8),(67,8,'évaluations repères GS : PHONOLOGIE','PHONOLOGIE','https://ec72.fr/wp-content/uploads/sites/42/2021/09/Evaldiag-GS-livret-ma%C3%AEtre-DEC72-Juin21.docx.pdf',31,4,7,16,31,6),(68,1,'évaluations repères CM2 : PROBLEMES','PROBLEMES','https://www.do.fr/doc.pdf',2,1,2,1,13,NULL),(69,1,'évaluations repères CM2 : PHONOLOGIE','PHONOLOGIE','https://www.do.fr/doc.pdf',2,1,2,1,28,NULL),(70,1,'évaluations repères GS : LES COULEURS','LES COULEURS','https://ec72.fr/wp-content/uploads/sites/42/2021/09/Evaldiag-GS-livret-ma%C3%AEtre-DEC72-Juin21.docx.pdf',22,5,8,22,33,3),(71,2,'évaluations repères GS : RECONNAISSANCE PRENOM','RECONNAISSANCE PRENOM','https://ec72.fr/wp-content/uploads/sites/42/2021/09/Evaldiag-GS-livret-ma%C3%AEtre-DEC72-Juin21.docx.pdf',5,2,3,8,33,7),(72,3,'évaluations repères GS : REPÉRAGE SPATIAL ET TOPOLOGIE','REPÉRAGE SPATIAL ET TOPOLOGIE','https://ec72.fr/wp-content/uploads/sites/42/2021/09/Evaldiag-GS-livret-ma%C3%AEtre-DEC72-Juin21.docx.pdf',32,4,6,16,33,9),(73,4,'évaluations repères GS : CATEGORISATION','CATEGORISATION','https://ec72.fr/wp-content/uploads/sites/42/2021/09/Evaldiag-GS-livret-ma%C3%AEtre-DEC72-Juin21.docx.pdf',6,2,3,6,33,2),(74,5,'évaluations repères GS : MEMORISATION HISTOIRE','MEMORISATION HISTOIRE','https://ec72.fr/wp-content/uploads/sites/42/2021/09/Evaldiag-GS-livret-ma%C3%AEtre-DEC72-Juin21.docx.pdf',10,2,3,7,33,4),(75,6,'évaluations repères GS : LA SUITE NUMÉRIQUE','LA SUITE NUMÉRIQUE','https://ec72.fr/wp-content/uploads/sites/42/2021/09/Evaldiag-GS-livret-ma%C3%AEtre-DEC72-Juin21.docx.pdf',15,2,3,8,33,5),(76,7,'évaluations repères GS : LA RÉSOLUTION DE PROBLEMES','LA RÉSOLUTION DE PROBLEMES','https://ec72.fr/wp-content/uploads/sites/42/2021/09/Evaldiag-GS-livret-ma%C3%AEtre-DEC72-Juin21.docx.pdf',6,1,2,3,33,8),(77,8,'évaluations repères GS : PHONOLOGIE','PHONOLOGIE','https://ec72.fr/wp-content/uploads/sites/42/2021/09/Evaldiag-GS-livret-ma%C3%AEtre-DEC72-Juin21.docx.pdf',31,4,7,16,33,6),(78,1,'benchmark preschool: COLORS','COLORS','',22,5,8,22,37,3),(79,2,'benchmark preschool: RECOGNITION OF FIRST NAME','NAME RECOGNITION','',5,2,3,8,37,7),(80,3,'benchmark preschool: SPATIAL AND TOPOLOGICAL ORIENTATION','SPATIAL ORIENTATION','',32,4,6,16,37,9),(81,4,'benchmark preschool: CATEGORIZATION','CATEGORIZATION','',6,2,3,6,37,2),(82,5,'benchmark preschool: STORY MEMORIZATION','STORY MEMORIZATION','',10,2,3,7,37,4),(83,6,'benchmark preschool: NUMERIC SEQUENCE','NUMERIC SEQUENCE','',15,2,3,8,37,5),(84,7,'benchmark preschool: PROBLEM SOLVING','PROBLEM SOLVING','',6,1,2,3,37,8),(85,8,'benchmark preschool: PHONOLOGY','PHONOLOGY','',31,4,7,16,37,6),(86,1,'bevenn skol-vamm : LIVIÑ','LIVIÑ','',22,5,8,22,40,3),(87,2,'bevenn skol-vamm : ANV AR PRENAME','ANV AR PRENAME','',5,2,3,8,40,7),(88,3,'bevenn skol-vamm : RANNIEZH SPATIEL HA TOPOLOJEK','RANNIEZH SPATIEL','',32,4,6,16,40,9),(89,4,'bevenn skol-vamm : KATEGORIZAÑ','KATEGORIZAÑ','',6,2,3,6,40,2),(90,5,'bevenn skol-vamm : MIRAÑ ISTORIOÙ','MIRAÑ ISTORIOÙ','',10,2,3,7,40,4),(91,6,'bevenn skol-vamm : HEULIAD NIVEREL','HEULIAD NIVEREL','',15,2,3,8,40,5),(92,7,'bevenn skol-vamm : SOLIAD PROBLEM','SOLIAD PROBLEM','',6,1,2,3,40,8),(93,8,'bevenn skol-vamm : FONOLOJIEZH','FONOLOJIEZH','',31,4,7,16,40,6),(94,1,'Referenz Kindergarten: FARBEN','FARBEN','',22,5,8,22,43,3),(95,2,'Referenz Kindergarten: ERKENNUNG DES VORNAMENS','NAME ERKENNUNG','',5,2,3,8,43,7),(96,3,'Referenz Kindergarten: RÄUMLICHE UND TOPOLOGISCHE ORIENTIERUNG','RÄUMLICHE ORIENTIERUNG','',32,4,6,16,43,9),(97,4,'Referenz Kindergarten: KATEGORISIERUNG','KATEGORISIERUNG','',6,2,3,6,43,2),(98,5,'Referenz Kindergarten: GESCHICHTENERINNERUNG','GESCHICHTENERINNERUNG','',10,2,3,7,43,4),(99,6,'Referenz Kindergarten: ZAHLENFOLGE','ZAHLENFOLGE','',15,2,3,8,43,5),(100,7,'Referenz Kindergarten: PROBLEMLÖSUNG','PROBLEMLÖSUNG','',6,1,2,3,43,8),(101,8,'Referenz Kindergarten: PHONOLOGIE','PHONOLOGIE','',31,4,7,16,43,6);
/*!40000 ALTER TABLE `competence_groupagedata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `competence_item`
--

DROP TABLE IF EXISTS `competence_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `competence_item` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `temps` varchar(100) NOT NULL,
  `description` varchar(255) NOT NULL,
  `observation` longtext,
  `max_score` double NOT NULL,
  `itempos` int NOT NULL,
  `link` varchar(500) NOT NULL,
  `groupagedata_id` bigint NOT NULL,
  `scorerule_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `item_groupagedata_idx` (`groupagedata_id`),
  KEY `item_scorerule_idx` (`scorerule_id`),
  CONSTRAINT `competence_item_groupagedata_id_664eb282_fk_competenc` FOREIGN KEY (`groupagedata_id`) REFERENCES `competence_groupagedata` (`id`),
  CONSTRAINT `competence_item_scorerule_id_d70ca41b_fk_competence_scorerule_id` FOREIGN KEY (`scorerule_id`) REFERENCES `competence_scorerule` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=185 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `competence_item`
--

LOCK TABLES `competence_item` WRITE;
/*!40000 ALTER TABLE `competence_item` DISABLE KEYS */;
INSERT INTO `competence_item` VALUES (2,'Temps X','Comprendre des mots','a definir',15,1,'',1,8),(3,'Temps X','Comprendre des phrases','a definir',14,1,'',2,8),(4,'Temps X','Comprendre un texte','a definir',11,1,'',3,8),(5,'Temps X','Connaître le nom des lettres','a definir',10,1,'',4,8),(6,'Temps X','Manipuler des phonèmes','a definir',15,1,'',5,8),(7,'Temps X','Manipuler des syllabes','a definir',15,1,'',6,8),(8,'Temps X','Reconnaître des lettres','a definir',9,1,'',7,8),(9,'Temps X','Comparer des nombres','a definir',9,1,'',8,8),(10,'Temps X','Compter des objets','a definir',9,1,'',9,8),(11,'Temps X','Écrire des nombres','a definir',9,1,'',10,8),(12,'Temps X','Lire des nombres','a definir',9,1,'',11,8),(13,'Temps X','Placer un nombre sur une ligne graduée','a definir',9,1,'',12,8),(14,'Temps X','Résoudre les problèmes','a definir',9,1,'',13,8),(15,'Temps X','Résoudre un problème en géométrie','a definir',9,1,'',14,8),(16,'Temps X','Comprendre des phrases lues seul','a definir',9,1,'',15,8),(17,'Temps X','Comprendre des phrases','a definir',9,1,'',16,8),(18,'Temps X','Connaître le nom des lettres','a definir',9,1,'',17,8),(19,'Temps X','Écrire des mots','a definir',9,1,'',18,8),(20,'Temps X','Écrire des syllabes','a definir',9,1,'',19,8),(21,'Temps X','Lire à voix haute des mots','a definir',9,1,'',20,8),(22,'Temps X','Lire à voix haute un texte','a definir',9,1,'',21,8),(23,'Temps X',' Manipuler des phonèmes','a definir',9,1,'',22,8),(24,'Temps X','Additionner','a definir',9,1,'',23,8),(25,'Temps X','Comparer des nombres','a definir',9,1,'',24,8),(26,'Temps X','Écrire des nombres','a definir',9,1,'',25,8),(27,'Temps X','Placer un nombre sur une ligne graduée','a definir',9,1,'',26,8),(28,'Temps X','Résoudre des problèmes','a definir',9,1,'',27,8),(29,'Temps X','Soustraire','a definir',9,1,'',28,8),(30,'Temps X','Comprendre des mots','a definir',9,1,'',29,8),(31,'Temps X','Comprendre des phrases','a definir',9,1,'',30,8),(32,'Temps X','Comprendre des phrases lues seul','a definir',9,1,'',31,8),(33,'Temps X','Comprendre un texte lu seul','a definir',9,1,'',32,8),(34,'Temps X','Écrire des mots','a definir',9,1,'',33,8),(35,'Temps X','Écrire des syllabes','a definir',9,1,'',34,8),(36,'Temps X','Lire à voix haute des mots','a definir',9,1,'',35,8),(37,'Temps X','Lire à voix haute un texte','a definir',9,1,'',36,8),(38,'Temps X','Calculer mentalement','a definir',9,1,'',37,8),(39,'Temps X','Additionner','a definir',9,1,'',38,8),(40,'Temps X','Écrire des nombres','a definir',9,1,'',39,8),(41,'Temps X','Lire des nombres','a definir',9,1,'',40,8),(42,'Temps X','Placer un nombre sur une ligne graduée','a definir',9,1,'',41,8),(43,'Temps X','Résoudre des problèmes','a definir',9,1,'',42,8),(44,'Temps X','Résoudre un problème en géométrie','a definir',9,1,'',43,8),(45,'Temps X','Soustraire','a definir',9,1,'',44,8),(46,'Temps X','Comprendre un texte','a definir',9,1,'',45,8),(47,'Temps X','Comprendre un texte lu seul','a definir',9,1,'',46,8),(48,'Temps X','Lire à voix haute un texte','a definir',9,1,'',47,8),(49,'Temps X','Écrire des mots','a definir',9,1,'',48,8),(50,'Temps X','Reconnaître des synonymes','a definir',9,1,'',49,8),(51,'Temps X','Reconnaître des mots de la même famille','a definir',9,1,'',50,8),(52,'Temps X','Repérer le sujet et le verbe','a definir',9,1,'',51,8),(53,'Temps X','Accorder le nom et l’adjectif','a definir',9,1,'',52,8),(54,'Temps X','Accorder le sujet et le verbe','a definir',9,1,'',53,8),(55,'Temps X','Écrire des nombres entiers','a definir',9,1,'',54,8),(56,'Temps X','Placer un nombre sur une ligne graduée','a definir',9,1,'',55,8),(57,'Temps X','Résoudre des problèmes','a definir',9,1,'',56,8),(58,'Temps X','Connaître les tables de multiplication','a definir',9,1,'',57,8),(59,'Temps X','Calculer rapidement','a definir',9,1,'',58,8),(60,'Temps X','Poser et calculer','a definir',9,1,'',59,8),(61,'Temps 1','identifier et nommer une couleur: Bleu','',1,1,'',60,2),(62,'Temps 1','identifier et nommer une couleur: Rouge','',1,2,' ',60,2),(63,'Temps 1','identifier et nommer une couleur: Jaune','',1,3,'',60,2),(64,'Temps 1','identifier et nommer une couleur: Vert','',1,4,'',60,2),(65,'Temps 1','identifier et nommer une couleur: Orange','',1,5,'',60,2),(66,'Temps 1','identifier et nommer une couleur: Rose','',1,6,'',60,2),(67,'Temps 1','identifier et nommer une couleur: Violet','',1,7,'',60,2),(68,'Temps 1','identifier et nommer une couleur: Blanc','',1,8,'',60,2),(69,'Temps 1','identifier et nommer une couleur: Noir','',1,9,'',60,2),(70,'Temps 1','identifier et nommer une couleur: Gris','',1,10,'',60,2),(71,'Temps 1','identifier et nommer une couleur: Marron','',1,11,'',60,2),(72,'Temps 2','reconnaitre une carte par le nom de sa couleur: Bleu','',1,12,'',60,2),(73,'Temps 2','reconnaitre une carte par le nom de sa couleur: Rouge','',1,13,'',60,2),(74,'Temps 2','reconnaitre une carte par le nom de sa couleur: Jaune','',1,14,'',60,2),(75,'Temps 2','reconnaitre une carte par le nom de sa couleur: Vert','',1,15,'',60,2),(76,'Temps 2','reconnaitre une carte par le nom de sa couleur: Orange','',1,16,'',60,2),(77,'Temps 2','reconnaitre une carte par le nom de sa couleur: Rose','',1,17,'',60,2),(78,'Temps 2','reconnaitre une carte par le nom de sa couleur: Violet','',1,18,'',60,2),(79,'Temps 2','reconnaitre une carte par le nom de sa couleur: Blanc','',1,19,'',60,2),(80,'Temps 2','reconnaitre une carte par le nom de sa couleur: Noir','',1,20,'',60,2),(81,'Temps 2','reconnaitre une carte par le nom de sa couleur: Gris','',1,21,'',60,2),(82,'Temps 2','reconnaitre une carte par le nom de sa couleur: Marron','',1,22,'',60,2),(83,'Temps 1','Reconnaissance de son prénom en majuscule d\'imprimerie','',1,1,'',61,4),(84,'Temps 1','Reconnaissance prénom en cursive','',1,2,'',61,4),(85,'Temps 1','Main d\'écriture','POINT A DEFINIR',0,3,'',61,7),(86,'Temps 2','Choix de l\'outils scripteurs','POINT A DEFINIR',0,4,'',61,7),(87,'Temps 2','Sens de l\'écriture ','',1,5,'',61,4),(88,'Temps 2','Sens d\'écriture des lettres','',1,6,'',61,4),(89,'Temps 2','Geste graphique','',1,7,'',61,7),(90,'Temps 2','Tenue de l\'outils scripteurs (photo)','POINT A DEFINIR',0,8,'',61,7),(91,'Temps 1','désigner la position d\'objets nommés par l\'enseignant: Au-dessus','',2,1,'',62,3),(92,'Temps 1','désigner la position d\'objets nommés par l\'enseignant: En-dessous','',2,2,'',62,3),(93,'Temps 1','désigner la position d\'objets nommés par l\'enseignant: À droite','',2,3,'',62,3),(94,'Temps 1','désigner la position d\'objets nommés par l\'enseignant: À gauche','',2,4,'',62,3),(95,'Temps 1','désigner la position d\'objets nommés par l\'enseignant: Dedans','',2,5,'',62,3),(96,'Temps 1','désigner la position d\'objets nommés par l\'enseignant: Dehors','',2,6,'',62,3),(97,'Temps 1','désigner la position d\'objets nommés par l\'enseignant: À l\'intérieur','',2,7,'',62,3),(98,'Temps 1','désigner la position d\'objets nommés par l\'enseignant: À l\'extérieur','',2,8,'',62,3),(99,'Temps 2','Nommer la position d\'objets nommés par l\'enseignant: Au-dessus','',2,9,'',62,3),(100,'Temps 2','Nommer la position d\'objets nommés par l\'enseignant: En-dessous','',2,10,'',62,3),(101,'Temps 2','Nommer la position d\'objets nommés par l\'enseignant: À droite','',2,11,'',62,3),(102,'Temps 2','Nommer la position d\'objets nommés par l\'enseignant: À gauche','',2,12,'',62,3),(103,'Temps 2','Nommer la position d\'objets nommés par l\'enseignant: Dedans','',2,13,'',62,3),(104,'Temps 2','Nommer la position d\'objets nommés par l\'enseignant: Dehors','',2,14,'',62,3),(105,'Temps 2','Nommer la position d\'objets nommés par l\'enseignant: À l\'intérieur','',2,15,'',62,3),(106,'Temps 2','Nommer la position d\'objets nommés par l\'enseignant: À l\'extérieur','',2,16,'',62,3),(107,'Temps 1','L\'élève nomme l\'ensemble des objets présentés','',1,1,'',63,4),(108,'Temps 1','L\'élève mémorise les objets qu\'il ne connaît pas présentés par l\'adulte','',1,2,'',63,4),(109,'Temps 1','L\'élève est capable de catégoriser l\'ensemble des objets','',1,3,'',63,4),(110,'Temps 1','L\'élève est capable de nommer la famille de l\'objet','',1,4,'',63,4),(111,'Temps 1','L\'élève est capable de revenir sur une erreur seul','',1,5,'',63,4),(112,'Temps 1','En cas d\'erreur','Non',0,6,'',63,7),(113,'Temps 1','L\'élève est capable d\'écouter une histoire','',2,1,'',64,3),(114,'Temps 2','L\'élève a mémorisé l\'histoire et la verbalise','',2,2,'',64,3),(115,'Temps 2','L\'élève utilise le vocabulaire utilisé dans l\'histoire','Observations (vocabulaire)',1,3,'',64,4),(116,'Temps 2','L\'élève présente les personnages de l\'histoire','',2,4,'',64,3),(117,'Temps 2','L\'élève remet les images dans l\'ordre chronologique de l\'histoire','',2,5,'',64,3),(118,'Temps 2','- sens de la lecture et de l\'écriture (ne pas induire)','',1,6,'',64,4),(119,'Temps 2','-mise en place des images','POINT A DEFINIR',0,7,'',64,7),(120,'Temps 1','L\'élève connaît la suite numérique orale jusqu\'à .....','',2,1,'',65,6),(121,'Temps 1','L\'élève met en lien la suite numérique oral et écrite jusqu\'à ...','',2,2,'',65,6),(122,'Temps 1','L\'élève fait émerger la notion de chiffre etde nombre','',2,3,'',65,3),(123,'Temps 1','L\'élève confond les notions de lettres et de chiffres','',1,4,'',65,5),(124,'Temps 2','L\'élève nomme les 5 cartes nombres','',2,5,'',65,3),(125,'Temps 2','L\'élève met en lien les quotités et les quantités','',2,6,'',65,3),(126,'Temps 3','L\'élève précise les quantités contenues dans chaque collection','',2,7,'',65,3),(127,'Temps 3','L\'élève met en lien les quantités et les quotités','',2,8,'',65,3),(128,'Temps 1','verbaliser le problème et demander la solution présentant 3 cartes réponses','test en mai?',2,1,'',66,3),(129,'Temps 1','présenter un problème à l\'aide d\'images et demande la solution avec 3 cartes réponses','test en mai?',2,2,'',66,3),(130,'Temps 1','présenter 1 image et poser questions ','test en mai?',2,3,'70',66,3),(131,'Temps 1','L\'élève entend le son A','',2,1,'',67,3),(132,'Temps 1','L\'élève entend le son E','',2,2,'',67,3),(133,'Temps 1','L\'élève entend le son I','',2,3,'',67,3),(134,'Temps 1','L\'élève entend le son O','',2,4,'',67,3),(135,'Temps 1','L\'élève entend le son U','',2,5,'',67,3),(136,'Temps 2','L\'élève nomme les 5 objets ou images','',2,6,'',67,3),(137,'Temps 2','L\'élève verbalise ceux où il entend le son A','',2,7,'',67,3),(138,'Temps 2','L\'élève nomme les 5 objets ou images','',2,8,'',67,3),(139,'Temps 2','L\'élève verbalise ceux où il entend le son E','',2,9,'',67,3),(140,'Temps 2','L\'élève nomme les 5 objets ou images','',2,10,'',67,3),(141,'Temps 2','L\'élève verbalise ceux où il entend le son I','',2,11,'',67,3),(142,'Temps 2','L\'élève nomme les 5 objets ou images','',2,12,'',67,3),(143,'Temps 2','L\'élève verbalise ceux où il entend le son O','',2,13,'',67,3),(144,'Temps 2','L\'élève nomme les 5 objets ou images','',2,14,'',67,3),(145,'Temps 2','L\'élève verbalise ceux où il entend le son U','',2,15,'',67,3),(146,'Temps 2','Observations complémentaires de l\'enseignant sur les conditions de passation.','',1,16,'',67,4),(147,'Temps 1','item1 cm2 mathematiques','',1,1,'',68,8),(148,'Temps 2','item2 cm2 mathematiques','',1,1,'',68,8),(149,'Temps 1','item1 cm2 francais','',1,1,'',69,8),(150,'Temps 2','item2 cm2 francais','',1,1,'',69,8),(151,'évaluations repères GS : LES COULEURS','LES COULEURS','',22,1,'https://ec72.fr/wp-content/uploads/sites/42/2021/09/Evaldiag-GS-livret-ma%C3%AEtre-DEC72-Juin21.docx.pdf',70,8),(152,'évaluations repères GS : RECONNAISSANCE PRENOM','RECONNAISSANCE PRENOM','',5,2,'https://ec72.fr/wp-content/uploads/sites/42/2021/09/Evaldiag-GS-livret-ma%C3%AEtre-DEC72-Juin21.docx.pdf',71,8),(153,'évaluations repères GS : REPÉRAGE SPATIAL ET TOPOLOGIE','REPÉRAGE SPATIAL ET TOPOLOGIE','',32,3,'https://ec72.fr/wp-content/uploads/sites/42/2021/09/Evaldiag-GS-livret-ma%C3%AEtre-DEC72-Juin21.docx.pdf',72,8),(154,'évaluations repères GS : CATEGORISATION','CATEGORISATION','',6,4,'https://ec72.fr/wp-content/uploads/sites/42/2021/09/Evaldiag-GS-livret-ma%C3%AEtre-DEC72-Juin21.docx.pdf',73,8),(155,'évaluations repères GS : MEMORISATION HISTOIRE','MEMORISATION HISTOIRE','',10,5,'https://ec72.fr/wp-content/uploads/sites/42/2021/09/Evaldiag-GS-livret-ma%C3%AEtre-DEC72-Juin21.docx.pdf',74,8),(156,'évaluations repères GS : LA SUITE NUMÉRIQUE','LA SUITE NUMÉRIQUE','',15,6,'https://ec72.fr/wp-content/uploads/sites/42/2021/09/Evaldiag-GS-livret-ma%C3%AEtre-DEC72-Juin21.docx.pdf',75,8),(157,'évaluations repères GS : LA RÉSOLUTION DE PROBLEMES','LA RÉSOLUTION DE PROBLEMES','',6,7,'https://ec72.fr/wp-content/uploads/sites/42/2021/09/Evaldiag-GS-livret-ma%C3%AEtre-DEC72-Juin21.docx.pdf',76,8),(158,'évaluations repères GS : PHONOLOGIE','PHONOLOGIE','',31,8,'https://ec72.fr/wp-content/uploads/sites/42/2021/09/Evaldiag-GS-livret-ma%C3%AEtre-DEC72-Juin21.docx.pdf',77,8),(161,'benchmark preschool: COLORS','COLORS','',22,1,'',78,8),(162,'benchmark preschool: RECOGNITION OF FIRST NAME','RECOGNITION OF FIRST NAME','',5,2,'',79,8),(163,'benchmark preschool: SPATIAL AND TOPOLOGICAL ORIENTATION','SPATIAL AND TOPOLOGICAL ORIENTATION','',32,3,'',80,8),(164,'benchmark preschool: CATEGORIZATION','CATEGORIZATION','',6,4,'',81,8),(165,'benchmark preschool: STORY MEMORIZATION','STORY MEMORIZATION','',10,5,'',82,8),(166,'benchmark preschool: NUMERIC SEQUENCE','NUMERIC SEQUENCE','',15,6,'',83,8),(167,'benchmark preschool: PROBLEM SOLVING','PROBLEM SOLVING','',6,7,'',84,8),(168,'benchmark preschool: PHONOLOGY','PHONOLOGY','',31,8,'',85,8),(169,'bevenn skol-vamm : LIVIÑ','LIVIÑ','',22,1,'',86,8),(170,'bevenn skol-vamm : ANV AR PRENAME','ANV AR PRENAME','',5,2,'',87,8),(171,'bevenn skol-vamm : RANNIEZH SPATIEL HA TOPOLOJEK','RANNIEZH SPATIEL HA TOPOLOJEK','',32,3,'',88,8),(172,'bevenn skol-vamm : KATEGORIZAÑ','KATEGORIZAÑ','',6,4,'',89,8),(173,'bevenn skol-vamm : MIRAÑ ISTORIOÙ','MIRAÑ ISTORIOÙ','',10,5,'',90,8),(174,'bevenn skol-vamm : HEULIAD NIVEREL','HEULIAD NIVEREL','',15,6,'',91,8),(175,'bevenn skol-vamm : SOLIAD PROBLEM',' SOLIAD PROBLEM','',6,7,'',92,8),(176,'bevenn skol-vamm : FONOLOJIEZH','FONOLOJIEZH','',31,8,'',93,8),(177,'Referenz Kindergarten: FARBEN','FARBEN','',22,1,'',94,8),(178,'Referenz Kindergarten: ERKENNUNG DES VORNAMENS','ERKENNUNG DES VORNAMENS','',5,2,'',95,8),(179,'Referenz Kindergarten: RÄUMLICHE UND TOPOLOGISCHE ORIENTIERUNG','RÄUMLICHE UND TOPOLOGISCHE ORIENTIERUNG','',32,3,'',96,8),(180,'Referenz Kindergarten: KATEGORISIERUNG','KATEGORISIERUNG','',6,4,'',97,8),(181,'Referenz Kindergarten: GESCHICHTENERINNERUNG','GESCHICHTENERINNERUNG','',10,5,'',98,8),(182,'Referenz Kindergarten: ZAHLENFOLGE','ZAHLENFOLGE','',15,6,'',99,8),(183,'Referenz Kindergarten: PROBLEMLÖSUNG','PROBLEMLÖSUNG','',6,7,'',100,8),(184,'Referenz Kindergarten: PHONOLOGIE','PHONOLOGIE','',31,8,'',101,8);
/*!40000 ALTER TABLE `competence_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `competence_matiere`
--

DROP TABLE IF EXISTS `competence_matiere`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `competence_matiere` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `matiere` varchar(1) NOT NULL,
  `description` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `matiere_idx` (`matiere`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `competence_matiere`
--

LOCK TABLES `competence_matiere` WRITE;
/*!40000 ALTER TABLE `competence_matiere` DISABLE KEYS */;
INSERT INTO `competence_matiere` VALUES (1,'?',' '),(2,'F','Francais '),(3,'M','Mathematiques'),(4,'D','English '),(5,'B','Breton'),(6,'B','Deutsch');
/*!40000 ALTER TABLE `competence_matiere` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `competence_myimage`
--

DROP TABLE IF EXISTS `competence_myimage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `competence_myimage` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `icon` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `competence_myimage`
--

LOCK TABLES `competence_myimage` WRITE;
/*!40000 ALTER TABLE `competence_myimage` DISABLE KEYS */;
INSERT INTO `competence_myimage` VALUES (1,'competence/icons/resized_beebot_b4eV13S.png'),(2,'competence/icons/resized_categorisation_5rwG4cm.png'),(3,'competence/icons/resized_couleur_vLoVIep.png'),(4,'competence/icons/resized_histoire_Qsrtnyt.png'),(5,'competence/icons/resized_nombre_iuX0Oo5.png'),(6,'competence/icons/resized_phonologie_5hJIHHn.png'),(7,'competence/icons/resized_prenom_JbdjrsW.png'),(8,'competence/icons/resized_probleme_8qTvYHZ.png'),(9,'competence/icons/resized_spacial_4p5CFd1.png');
/*!40000 ALTER TABLE `competence_myimage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `competence_niveau`
--

DROP TABLE IF EXISTS `competence_niveau`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `competence_niveau` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `niveau` varchar(10) NOT NULL,
  `description` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `niveau_idx` (`niveau`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `competence_niveau`
--

LOCK TABLES `competence_niveau` WRITE;
/*!40000 ALTER TABLE `competence_niveau` DISABLE KEYS */;
INSERT INTO `competence_niveau` VALUES (1,'?','Classe indefinie'),(2,'GS','NIV_desc0'),(3,'CP','NIV_desc1'),(4,'E1','NIV_desc2'),(5,'E2','NIV_desc3'),(6,'M1','NIV_desc4'),(7,'M2','NIV_desc5');
/*!40000 ALTER TABLE `competence_niveau` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `competence_pdflayout`
--

DROP TABLE IF EXISTS `competence_pdflayout`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `competence_pdflayout` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `header_icon` varchar(100) NOT NULL,
  `schule_name` longtext,
  `header_message` longtext,
  `footer_message1` longtext,
  `footer_message2` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `competence_pdflayout`
--

LOCK TABLES `competence_pdflayout` WRITE;
/*!40000 ALTER TABLE `competence_pdflayout` DISABLE KEYS */;
INSERT INTO `competence_pdflayout` VALUES (1,'competence/header_icons/resized_beebot_uyIuR6Y.png','ÉducaSphère','Résultats des tests de l\'evaluation pédagogique','Ce graphique radar illustre les résultats d\'un test cognitif varié. Les niveaux de compétence sont indiqués par les gradations + ++ et +++ symbolisant la progression de l\'élève dans différentes compétences.','Les domaines évalués touchent à des aspects clés du développement cognitif. L\'élève est amené à classer des objets selon des critères (catégorisation) résoudre des tâches pratiques (résolution de problèmes) et comprendre les séquences numériques (suite numérique). La reconnaissance des couleurs la mémoire d\'histoires et la manipulation des sons (phonologie cognitive et sensorielle) sont également testées. De plus la reconnaissance du prénom et le repérage spatial complètent cette évaluation.'),(2,'competence/header_icons/resized_beebot_4O1PfRY.png','Apprenti\'Clé','Analyse des Capacités Cognitives','Ce diagramme montre les performances cognitives dans divers domaines.','Les résultats reflètent le développement des compétences clés en classification  résolution de problèmes et reconnaissance des séquences numériques.'),(3,'competence/header_icons/resized_beebot_nQbCJJ2.png','Future Minds Institute','Test Results of the Pedagogical Evaluation','This radar chart illustrates the results of a varied cognitive test. The levels of competence are indicated by the gradations +  ++  and +++  symbolizing the student s progress in different skills.\"','The evaluated areas cover key aspects of cognitive development. The student is asked to classify objects by criteria (categorization), solve practical tasks (problem-solving), and understand numeric sequences (numeric sequence). Recognition of colors, story memorization, and manipulation of sounds (cognitive and sensory phonology) are also tested. Additionally, first name recognition and spatial orientation complete this evaluation.'),(4,'competence/header_icons/resized_beebot_VjM9Qzo.png','Insight Quest','Comprehensive Cognitive Skills Evaluation','This radar chart displays the student’s strengths across key cognitive areas.','Progress is measured in classification  problem-solving and numerical sequence comprehension.'),(5,'competence/header_icons/resized_beebot_8cgUCzL.png','Gwelladenn Arver','Rezultadennoù an testoù pedagogel','Ar graf radar-mañ a ziskouez disoc\'hoù un test kognitivel liesseurt. Ar liveoù aheuil (ganit +, ++, ha +++) a zo sinioù eus araokadenn ar skolaji e meur a verstik','Ar pezhioù test a c\'holo tachadoù a bouez evit diorroadur kognitivel. Goulennet e vez gant ar skolaji klaskoù war objektoù hervez kriterionoù (kategorizañ), diskoulmañ tachadoù oberoù (diskoulmañ kudennoù), hag ivez kompren reolennoù niverel (renkad niverel). Eveziet eo ivez anaout an livioù, eñvor gant istorioù, hag implij al sonioù (fonologie kognitivel ha santel). A-hend-all, anaout ar prename hag ar repérage spatiel a gas da benn an test-se.'),(6,'competence/header_icons/resized_beebot_SvDVvaR.png','Testoù Skiant','Dielfenn ar C\'hompetennoù','Ar graf-mañ diskouez liveoù araokadennoù ar skolaji e meur a verstik.','Evel en em ziskouez ar c\'hategori  diskoulm ar c\'hudennoù ha krog war an niverennoù.'),(7,'competence/header_icons/resized_beebot_QwisnIX.png','BildungsKompass','Testergebnisse der pädagogischen Auswertung','Dieses Radar-Diagramm veranschaulicht die Ergebnisse eines vielfältigen kognitiven Tests. Die Kompetenzstufen sind durch die Abstufungen +, ++ und +++ angezeigt und symbolisieren den Fortschritt des Schülers in verschiedenen Fähigkeiten.','Die bewerteten Bereiche umfassen wichtige Aspekte der kognitiven Entwicklung. Der Schüler wird aufgefordert, Objekte nach Kriterien zu klassifizieren (Kategorisierung), praktische Aufgaben zu lösen (Problemlösung), und numerische Sequenzen zu verstehen (Zahlenfolge). Die Farberkennung, das Memorieren von Geschichten und die Klangmanipulation (kognitive und sensorische Phonologie) werden ebenfalls getestet. Zusätzlich vervollständigen die Erkennung des Vornamens und die räumliche Orientierung diese Bewertung.'),(8,'competence/header_icons/resized_beebot_pOaoAjP.png','LernHorizonte','Auswertung der Kognitiven Kompetenzen','Dieses Diagramm zeigt Fortschritte in wesentlichen kognitiven Bereichen.','Gemessen werden Fähigkeiten wie Kategorisierung  Problemlösung und Zahlenverständnis.');
/*!40000 ALTER TABLE `competence_pdflayout` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `competence_report`
--

DROP TABLE IF EXISTS `competence_report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `competence_report` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `eleve_id` bigint NOT NULL,
  `pdflayout_id` bigint NOT NULL,
  `professeur_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `competence_report_pdflayout_id_e30a4d50_fk_competenc` (`pdflayout_id`),
  KEY `report_eleve_idx` (`eleve_id`),
  KEY `report_professeur_idx` (`professeur_id`),
  CONSTRAINT `competence_report_eleve_id_61f6e002_fk_competence_eleve_id` FOREIGN KEY (`eleve_id`) REFERENCES `competence_eleve` (`id`),
  CONSTRAINT `competence_report_pdflayout_id_e30a4d50_fk_competenc` FOREIGN KEY (`pdflayout_id`) REFERENCES `competence_pdflayout` (`id`),
  CONSTRAINT `competence_report_professeur_id_c77bbce0_fk_competenc` FOREIGN KEY (`professeur_id`) REFERENCES `competence_customuser` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `competence_report`
--

LOCK TABLES `competence_report` WRITE;
/*!40000 ALTER TABLE `competence_report` DISABLE KEYS */;
/*!40000 ALTER TABLE `competence_report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `competence_reportcatalogue`
--

DROP TABLE IF EXISTS `competence_reportcatalogue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `competence_reportcatalogue` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `catalogue_id` bigint NOT NULL,
  `report_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `reportcatalogue_report_idx` (`report_id`),
  KEY `reportcatalogue_catalogue_idx` (`catalogue_id`),
  CONSTRAINT `competence_reportcat_catalogue_id_48706707_fk_competenc` FOREIGN KEY (`catalogue_id`) REFERENCES `competence_catalogue` (`id`),
  CONSTRAINT `competence_reportcat_report_id_6e679352_fk_competenc` FOREIGN KEY (`report_id`) REFERENCES `competence_report` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `competence_reportcatalogue`
--

LOCK TABLES `competence_reportcatalogue` WRITE;
/*!40000 ALTER TABLE `competence_reportcatalogue` DISABLE KEYS */;
/*!40000 ALTER TABLE `competence_reportcatalogue` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `competence_resultat`
--

DROP TABLE IF EXISTS `competence_resultat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `competence_resultat` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `score` double NOT NULL,
  `seuil1_percent` double NOT NULL,
  `seuil2_percent` double NOT NULL,
  `seuil3_percent` double NOT NULL,
  `groupage_id` bigint NOT NULL,
  `report_catalogue_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `resultat_report_catalogue_idx` (`report_catalogue_id`),
  KEY `resultat_groupage_idx` (`groupage_id`),
  CONSTRAINT `competence_resultat_groupage_id_4993976d_fk_competenc` FOREIGN KEY (`groupage_id`) REFERENCES `competence_groupagedata` (`id`),
  CONSTRAINT `competence_resultat_report_catalogue_id_07877a44_fk_competenc` FOREIGN KEY (`report_catalogue_id`) REFERENCES `competence_reportcatalogue` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `competence_resultat`
--

LOCK TABLES `competence_resultat` WRITE;
/*!40000 ALTER TABLE `competence_resultat` DISABLE KEYS */;
/*!40000 ALTER TABLE `competence_resultat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `competence_resultatdetail`
--

DROP TABLE IF EXISTS `competence_resultatdetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `competence_resultatdetail` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `score` double NOT NULL,
  `scorelabel` varchar(50) DEFAULT NULL,
  `observation` longtext,
  `item_id` bigint NOT NULL,
  `resultat_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `resultatdetail_resultat_idx` (`resultat_id`),
  KEY `resultatdetail_item_idx` (`item_id`),
  CONSTRAINT `competence_resultatd_resultat_id_15e794f4_fk_competenc` FOREIGN KEY (`resultat_id`) REFERENCES `competence_resultat` (`id`),
  CONSTRAINT `competence_resultatdetail_item_id_788aa5a9_fk_competence_item_id` FOREIGN KEY (`item_id`) REFERENCES `competence_item` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `competence_resultatdetail`
--

LOCK TABLES `competence_resultatdetail` WRITE;
/*!40000 ALTER TABLE `competence_resultatdetail` DISABLE KEYS */;
/*!40000 ALTER TABLE `competence_resultatdetail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `competence_scorerule`
--

DROP TABLE IF EXISTS `competence_scorerule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `competence_scorerule` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `scorerule_description_idx` (`description`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `competence_scorerule`
--

LOCK TABLES `competence_scorerule` WRITE;
/*!40000 ALTER TABLE `competence_scorerule` DISABLE KEYS */;
INSERT INTO `competence_scorerule` VALUES (1,'default rule'),(2,'Rule 2 : A NA'),(3,'Rule 3 : A ECA NA'),(4,'Rule 4 : Oui=1 Non=0'),(5,'Rule 5 : Oui=0 Non=1'),(6,'Rule 6 : Moins de 10  de 10 a 20 plus de 20 '),(7,'Rule 7 : toujours 0 point'),(8,'Rule 8 : points a la demande');
/*!40000 ALTER TABLE `competence_scorerule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `competence_scorerulepoint`
--

DROP TABLE IF EXISTS `competence_scorerulepoint`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `competence_scorerulepoint` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `scorelabel` varchar(20) NOT NULL,
  `score` int NOT NULL,
  `description` varchar(50) DEFAULT NULL,
  `scorerule_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `scorerulepoint_scorerule_idx` (`scorerule_id`),
  CONSTRAINT `competence_scorerule_scorerule_id_5f5aa260_fk_competenc` FOREIGN KEY (`scorerule_id`) REFERENCES `competence_scorerule` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `competence_scorerulepoint`
--

LOCK TABLES `competence_scorerulepoint` WRITE;
/*!40000 ALTER TABLE `competence_scorerulepoint` DISABLE KEYS */;
INSERT INTO `competence_scorerulepoint` VALUES (1,'?',-1,'default score : nicht tested',1),(2,'A',1,'Rule 2 : A=1 point',2),(3,'NA',0,'Rule 2 : NA=0 point',2),(4,'NA',0,'Rule 3 : NA=0 point',3),(5,'ECA',1,'Rule 3 : ECA=1 point',3),(6,'A',2,'Rule 3 : A=2 points',3),(7,'Oui',1,'Rule 4 : Oui=1 point',4),(8,'Non',0,'Rule 4 : Non=0 point',4),(9,'Non',1,'Rule 5 : Non=1 point',5),(10,'Oui',0,'Rule 5 : Oui=0 point',5),(11,'Moins de 10',0,'Rule 6 : Moins de 10 =0 point',6),(12,'De 10 a 20',1,'Rule 6 : de 10 a 20=1 point',6),(13,'Plus que 10',2,'Rule 6 : plus de 20=2 points',6),(14,'Zero',0,'Rule 7 : toujours 0 point',7),(15,'0',0,'0',8),(16,'1',1,'1',8),(17,'2',2,'2',8),(18,'3',3,'3',8),(19,'4',4,'4',8),(20,'5',5,'5',8),(21,'6',6,'6',8),(22,'7',7,'7',8),(23,'8',8,'8',8),(24,'9',9,'9',8),(25,'10',10,'10',8),(26,'11',11,'11',8),(27,'12',12,'12',8),(28,'13',13,'13',8),(29,'14',14,'14',8),(30,'15',15,'15',8),(31,'16',16,'16',8);
/*!40000 ALTER TABLE `competence_scorerulepoint` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `competence_translation`
--

DROP TABLE IF EXISTS `competence_translation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `competence_translation` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `key` varchar(255) NOT NULL,
  `language` varchar(10) NOT NULL,
  `translation` longtext NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `competence_translation_key_language_5253982b_uniq` (`key`,`language`)
) ENGINE=InnoDB AUTO_INCREMENT=710 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `competence_translation`
--

LOCK TABLES `competence_translation` WRITE;
/*!40000 ALTER TABLE `competence_translation` DISABLE KEYS */;
INSERT INTO `competence_translation` VALUES (1,'inf_welcome','en','Welcome to our application'),(2,'news','en','News: Multi-language selection English and French added. Currently only on the student page.'),(3,'frm_name','en','Last Name'),(4,'frm_first','en','First Name'),(5,'frm_level','en','Level'),(6,'frm_birthDt','en','Date of Birth'),(7,'frm_chooseLvl','en','Choose a level'),(8,'frm_prof','en','Professors'),(9,'frm_createStud','en','Create Student'),(10,'frm_addStud','en','Add New Student'),(11,'frm_srchPlcHldr','en','Search by name or first name...'),(12,'opt_all','en','All'),(13,'tbH_name','en','Last Name'),(14,'tbH_first','en','First Name'),(15,'tbH_level','en','Level'),(16,'tbH_birthDt','en','Date of Birth'),(17,'tbH_prof','en','Professors'),(18,'msg_req','en','This field is required'),(19,'msg_noInfo','en','No student information available.'),(20,'msg_chosenStud','en','Chosen student'),(21,'msg_noProf','en','No assigned professors'),(22,'msg_loadStuds','en','Loading student data...'),(23,'msg_loadErr','en','Error loading. Please try again.'),(24,'msg_selStud','en','Please select a student.'),(25,'msg_noStud','en','No student found.'),(26,'msg_chooseTest','en','Choose the tests to perform:'),(27,'msg_ctg','en','Catalogues management'),(28,'msg_chosenCtg','en','Chosen catalogue'),(29,'msg_noCtg','en','No catalogue found.'),(30,'msg_errCreateStud','en','Error create student. Please try again.'),(31,'msg_na','en','Not available'),(32,'pgH_studMgmt','en','Student Management'),(33,'pgH_studSel','en','Student Selection'),(34,'rpt_selStudRpt','en','Reports obtained by selected student: {{name}}'),(35,'NIV_desc0','en','Senior Kindergarten'),(36,'NIV_desc1','en','Grade 1'),(37,'NIV_desc2','en','Grade 2'),(38,'NIV_desc3','en','Grade 3'),(39,'NIV_desc4','en','Grade 4'),(40,'NIV_desc5','en','Grade 5'),(41,'nav_Stud','en','Student'),(42,'nav_chooseStud','en','Choose a student'),(43,'nav_chooseConf','en','Choose a configuration'),(44,'nav_chooseCtg','en','Choose a catalog'),(45,'nav_help','en','Need help?'),(46,'pgH_histo','en','History'),(47,'pgH_confMgmt','en','PDF Configuration'),(48,'pgH_ctgMgmt','en','Test Catalog Management'),(49,'pgH_rptMgmt','en','Report Management'),(50,'pgH_overview','en','Overview of ongoing tests'),(51,'pgH_PDF','en','Print'),(52,'pgH_iconPDF','en','Print with icons'),(53,'pgH_logout','en','Logout'),(54,'pgH_login','en','Login'),(55,'nav_menu','en','Menu'),(56,'nav_chooseRpt','en','Choose to edit or create a report'),(57,'tbH_rptId','en','Report ref'),(58,'tbH_createdAt','en','Created at'),(59,'hlp_globalHelp','en','General Help'),(60,'hlp_introDescription','en','The assessment application allows for entering test results and creating associated reports. The reports can be saved in PDF format for printing when needed. These reports include student and teacher information, spider graphs, and results of problematic tests.'),(61,'hlp_accessMenu','en','Access to Menu'),(62,'hlp_accessMenuDesc','en','The menu collapses and can be accessed by clicking the icon in the top left.'),(63,'hlp_statusBar','en','Status Bar'),(64,'hlp_statusBarDesc','en','The upper bar displays the status of ongoing actions (selected student, catalog, configuration, or report). Actions still required before printing the report appear in yellow. For example, if no student is selected, the action to select a student will be highlighted in yellow. Navigation to the student management page is also possible through the menu.'),(65,'hlp_news','en','What\'s New'),(66,'hlp_newsDesc','en','Here are the latest updates in the application.'),(67,'btn_close','en','Close'),(68,'hlp_needHelp','en','Need help?'),(69,'hlp_wellcomeHelp','en','Welcome to the help section'),(70,'hlp_reportOverview','en','Report Overview: The report contains the header with the logo, the test date, the student’s name, teacher’s name, and their level. The radar graph is drawn based on the thresholds configured by the application administrator.'),(71,'hlp_histo','en','Report History'),(72,'pgH_histo_description','en','This page allows you to view the history of reports and see incomplete reports marked in red.'),(73,'hlp_refresh_data','en','Refresh data'),(74,'pgH_refresh_data_description','en','If some reports are not displayed, you can refresh to update the reports shown.'),(75,'hlp_red_reports','en','Red reports'),(76,'pgH_red_reports_description','en','Reports shown in red need to be re-edited: test data is missing.'),(77,'hlp_expand_icon','en','Expand icon'),(78,'pgH_expand_icon_description','en','To show the test progress by category, click on \'▲\'. To hide them, click on \'▼\'.'),(79,'hlp_studMgmt','en','Student Management'),(80,'pgH_studMgmt_description','en','Create or select a student and report.'),(81,'hlp_filter_students','en','Filter students'),(82,'pgH_filter_students_description','en','You can search by student’s name or first name, and also filter by level.'),(83,'hlp_add_student','en','Add a student'),(84,'pgH_add_student_description','en','If the student is not yet in the database, you can create them.'),(85,'hlp_select_student','en','Select a student'),(86,'pgH_select_student_description','en','The selected student will be highlighted in a different color. You can only select one student at a time.'),(87,'hlp_PDF','en','View and print the PDF'),(88,'pgH_PDF_description','en','This page is for viewing and printing PDFs with/without icons. Press print to print.'),(89,'hlp_print','en','Print'),(90,'pgH_print_description','en','A PDF file will be generated for the selected report with the visible data on the screen.'),(91,'hlp_report_first_page','en','Content of the first page of the report'),(92,'pgH_report_first_page_description','en','The report contains the header with the logo, the test date, the student’s name, teacher’s name, and their level.'),(93,'hlp_report_following_pages','en','Content of the following pages of the report'),(94,'pgH_report_following_pages_description','en','The report prints errors in tests if they belong to the selection rule.'),(95,'hlp_confMgmt','en','Configuration Management'),(96,'pgH_confMgmt_description','en','Logos, header names, and footer messages are configurable by the administrator.'),(97,'hlp_ctgMgmt','en','Test catalog management'),(98,'pgH_ctgMgmt_description','en','Test types are defined in the test catalog and are fully configurable by the administrator.'),(99,'hlp_choose_catalogue','en','Choose the catalog'),(100,'pgH_choose_catalogue_description','en','Choose a specific test catalog based on the section or level.'),(101,'hlp_overview','en','Report summary'),(102,'pgH_overview_description','en','This page shows the summary of the selected report. All data associated with the selected report is displayed.'),(103,'hlp_page_layout','en','Selected page layout'),(104,'pgH_page_layout_description','en','The report contains the header with the logo, the test date, and relevant data about the student and teacher.'),(105,'hlp_summary_scores','en','Score summary'),(106,'pgH_summary_scores_description','en','Aggregated test results with progress calculation based on configured thresholds.'),(107,'hlp_difficulties_summary','en','Summary of difficulties encountered'),(108,'pgH_difficulties_summary_description','en','Category below a threshold - to be defined during development.'),(109,'hlp_rptMgmt','en','Report Management'),(110,'hlp_select_report','en','Select a report'),(111,'pgH_select_report_description','en','Select an existing report to edit or reprint, or create a new report.'),(112,'hlp_save_report','en','Save a report'),(113,'pgH_save_report_description','en','The report being edited will be saved. After saving, if any tests are incomplete, their category will be highlighted in yellow.'),(114,'hlp_wellcomeMsg','en','Welcome! Use the navigation to discover the app.'),(115,'tab_year','en','Year'),(116,'tab_level','en','Class'),(117,'tab_stage','en','Stage'),(118,'tab_subject','en','Subject'),(119,'tab_desc','en','Description'),(120,'msg_manyCtg','en','Warning, you have selected more than one catalog'),(121,'msg_noConf','en','No configuration found.'),(122,'msg_noSelectConf','en','No configuration selected.'),(123,'msg_load','en','Loading data...'),(124,'msg_refresh','en','Refresh data...'),(125,'pgH_rptCarousel','en','Test carousel'),(126,'tbH_profid','en','Teacher Ref'),(127,'tbH_typeTest','en','Test type'),(128,'tbH_ctgTest','en','Test category'),(129,'tbH_test','en','Test'),(130,'tbH_score','en','Score'),(131,'tbH_MaxScore','en','Max score'),(132,'tbH_Label','en','Label'),(133,'tbH_Desc','en','Description'),(134,'pdf_prof','en','Teacher'),(135,'pdf_lytChosen','en','Chosen layout'),(136,'pdf_lytIconeTop','en','Header icon'),(137,'pdf_lytSchlName','en','School name'),(138,'pdf_lytMsgTop','en','Header message'),(139,'pdf_lytMsgFoot1','en','Footer message 1'),(140,'pdf_lytMsgFoot2','en','Footer message 2'),(141,'msg_noLyt','en','No print configuration found.'),(142,'pgH_select_conf','en','Select a configuration for printing'),(143,'btn_print','en','Print PDF'),(144,'pdf_stdt','en','Student'),(145,'pdf_rptCreatDt','en','Report created on'),(146,'pdf_ChartLabel','en','Progress'),(147,'msg_loadErrIcon','en','Image loading error'),(148,'pgH_admin','en','Administration console'),(149,'msg_noStdtRpt','en','No test report found for this student.'),(150,'msg_noRpt','en','No report available.'),(151,'pdf_UpdDt','en','Modification date'),(152,'tbH_Seuil1','en','Threshold 1'),(153,'tbH_Seuil2','en','Threshold 2'),(154,'tbH_Seuil3','en','Threshold 3'),(155,'nav_back','en','Previous'),(156,'nav_next','en','Next'),(157,'nav_page','en','Page'),(158,'nav_of','en','of'),(159,'tbH_detailRptPb','en','Detailed report of encountered difficulties'),(160,'tbH_scoreTotal','en','Total score'),(161,'tbH_icon','en','Icon'),(162,'tbH_compet','en','Acquired skill'),(163,'tbH_CatalogTest','en','Test catalog'),(164,'msg_noUserData','en','No user information available.'),(165,'tbH_resultat','en','Result'),(166,'msg_err_sav','en','Error during save. Please try again.'),(167,'tab_id','en','Identifier'),(168,'tab_lang','en','Language'),(169,'tab_roles','en','Roles'),(170,'btn_rptSelect','en','Select this report'),(171,'btn_show','en','Show'),(172,'btn_hide','en','Hide'),(173,'pgH_formStudent','en','Fill out the form to add a student:'),(174,'pgH_summaryScor','en','Score Summary'),(175,'pgH_summaryDifficult','en','Difficulty Summary'),(176,'pgH_summaryTest','en','Summary of ongoing tests'),(177,'lang','en','en'),(178,'language_list','en','{\"en\": \"English\", \"fr\": \"Français\", \"de\": \"Deutsch\", \"br\": \"Brezhoneg\"}'),(179,'inf_welcome','fr','Bienvenue dans notre application'),(180,'news','fr','Nouvelles : Sélection multilingue anglais et français ajoutée. Actuellement uniquement sur la page élève.'),(181,'frm_name','fr','Nom de famille'),(182,'frm_first','fr','Prénom'),(183,'frm_level','fr','Niveau'),(184,'frm_birthDt','fr','Date de naissance'),(185,'frm_chooseLvl','fr','Choisir un niveau'),(186,'frm_prof','fr','Professeurs'),(187,'frm_createStud','fr','Créer un élève'),(188,'frm_addStud','fr','Ajouter un nouvel élève'),(189,'frm_srchPlcHldr','fr','Rechercher par nom ou prénom...'),(190,'opt_all','fr','Tout'),(191,'tbH_name','fr','Nom de famille'),(192,'tbH_first','fr','Prénom'),(193,'tbH_level','fr','Niveau'),(194,'tbH_birthDt','fr','Date de naissance'),(195,'tbH_prof','fr','Professeurs'),(196,'msg_req','fr','Ce champ est requis'),(197,'msg_noInfo','fr','Aucune information disponible.'),(198,'msg_chosenStud','fr','Étudiant choisi'),(199,'msg_noProf','fr','Aucun professeur attribué'),(200,'msg_loadStuds','fr','Chargement des données des élèves...'),(201,'msg_loadErr','fr','Erreur de chargement. Veuillez réessayer.'),(202,'msg_errCreateStud','fr','Erreur en création élève. Veuillez réessayer.'),(203,'msg_na','fr','Non disponible'),(204,'msg_selStud','fr','Veuillez sélectionner un élève.'),(205,'msg_noStud','fr','Aucun élève trouvé.'),(206,'msg_chooseTest','fr','Choisir la liste des tests à faire:'),(207,'msg_ctg','fr','Gestion des catalogues'),(208,'msg_chosenCtg','fr','Catalogue(s) choisi(s)'),(209,'msg_noCtg','fr','pas de catalogue trouvé.'),(210,'pgH_studMgmt','fr','Gestion des élèves'),(211,'pgH_studSel','fr','Sélection des élèves'),(212,'rpt_selStudRpt','fr','Rapports obtenus par l\'élève sélectionné : {{name}}'),(213,'NIV_desc0','fr','Maternelle grande section'),(214,'NIV_desc1','fr','CP'),(215,'NIV_desc2','fr','CE1'),(216,'NIV_desc3','fr','CE2'),(217,'NIV_desc4','fr','CM1'),(218,'NIV_desc5','fr','CM2'),(219,'nav_Stud','fr','Elève'),(220,'nav_chooseStud','fr','Choisir un élève'),(221,'nav_chooseConf','fr','Choisir une configuration'),(222,'nav_chooseCtg','fr','Choisir un catalogue'),(223,'nav_help','fr','Besoin d\'aide ?'),(224,'pgH_histo','fr','Historique des tests'),(225,'pgH_confMgmt','fr','Configuration du PDF'),(226,'pgH_ctgMgmt','fr','Gestion du catalogue de tests'),(227,'pgH_rptMgmt','fr','Gestion des rapports'),(228,'pgH_overview','fr','Résumé des tests en cours'),(229,'pgH_PDF','fr','Impression'),(230,'pgH_iconPDF','fr','Impression avec pictogrammes'),(231,'pgH_logout','fr','Déconnexion'),(232,'pgH_login','fr','Connexion'),(233,'nav_menu','fr','Menu'),(234,'nav_chooseRpt','fr','Choisir de modifier ou de créer un report'),(235,'tbH_rptId','fr','Rapport ref'),(236,'tbH_createdAt','fr','Créé le'),(237,'hlp_globalHelp','fr','Aide globale'),(238,'hlp_introDescription','fr','L\'application d\'évaluation permet la saisie des résultats des tests d\'évaluation et la création des rapports associés. Les rapports peuvent être sauvegardés sous format PDF de façon à être imprimés par besoin. Ces rapports contiennent les informations élèves, enseignant, graphes de type araignées et résultats des tests problématiques.'),(239,'hlp_accessMenu','fr','Accès au Menu'),(240,'hlp_accessMenuDesc','fr','Le menu se résorbe, il est possible de le récupérer en appuyant sur l\'icône en haut à gauche.'),(241,'hlp_statusBar','fr','Barre de statut'),(242,'hlp_statusBarDesc','fr','Cette barre supérieure affiche le statut des actions en cours (élève, catalogue, configuration ou rapport sélectionnés). Sur la barre supérieure des actions s\'affichent en jaune pour indiquer ce qu\'il reste à faire avant l\'impression du rapport. Par exemple, si aucun élève n\'est sélectionné, l\'action de choisir un élève sera proposée en jaune sur cette barre. Il est aussi possible de naviguer la page de gestion des élèves par le menu également.'),(243,'hlp_news','fr','Nouveauté'),(244,'hlp_newsDesc','fr','Voici les nouveautés de l\'application.'),(245,'btn_close','fr','Fermer'),(246,'hlp_needHelp','fr','Besoin d\'aide ?'),(247,'hlp_wellcomeHelp','fr','Bienvenue dans la section d\'aide'),(248,'hlp_wellcomeMsg','fr','Bienvenue! Utilisez la navigation pour explorer l\'application.'),(249,'hlp_reportOverview','fr','Aperçu du rapport : Le rapport contient l&apos;entête avec le logo, la date du test, le nom de l&apos;élève et de l&apos;enseignant ainsi que son niveau. Le graphe araignée est dessiné en fonction des seuils configurés par l&apos;administrateur de l&apos;application.'),(250,'hlp_histo','fr','Historique des rapports'),(251,'pgH_histo_description','fr','Cette page permet de visualiser l\'historique des rapports et de voir en rouge les rapports incomplets.'),(252,'hlp_refresh_data','fr','Rafraichir les données'),(253,'pgH_refresh_data_description','fr','Si des rapports ne s\'affichent pas tous, il est possible de rafraîchir pour actualiser les rapports affichés.'),(254,'hlp_red_reports','fr','Rapport en rouge'),(255,'pgH_red_reports_description','fr','Les rapports affichés en rouge nécessitent d\'être édités à nouveau : il manque des données de tests.'),(256,'hlp_expand_icon','fr','Icône d\'agrandissement'),(257,'pgH_expand_icon_description','fr','Pour afficher le bilan d\'avancement des tests par catégorie, il est possible de cliquer sur \'▲\'. Pour ne plus les afficher, utiliser \'▼\'.'),(258,'hlp_studMgmt','fr','Gestion des élèves'),(259,'pgH_studMgmt_description','fr','Création ou sélection d\'élève et de rapport.'),(260,'hlp_filter_students','fr','Filtrer les élèves'),(261,'pgH_filter_students_description','fr','Il est possible de faire une recherche par nom ou prénom d\'élève, et aussi de filtrer par niveau.'),(262,'hlp_add_student','fr','Ajouter un élève'),(263,'pgH_add_student_description','fr','Si l\'élève n\'existe pas encore dans la base de données, il est possible de le créer.'),(264,'hlp_select_student','fr','Sélectionner un élève'),(265,'pgH_select_student_description','fr','L\'élève sélectionné sera affiché d\'une couleur différente. On ne peut que sélectionner un seul élève à la fois.'),(266,'hlp_PDF','fr','Visualiser et imprimer le PDF'),(267,'pgH_PDF_description','fr','Ceci est la page pour visualiser et imprimer les PDF avec/sans icône. Appuyer sur imprimer pour imprimer.'),(268,'hlp_print','fr','Imprimer'),(269,'pgH_print_description','fr','Un fichier PDF sera généré sur le rapport sélectionné avec les données visualisables à l\'écran.'),(270,'hlp_report_first_page','fr','Contenu de la première page du rapport'),(271,'pgH_report_first_page_description','fr','Le rapport contient l\'en-tête avec le logo, la date du test, le nom de l\'élève et de l\'enseignant ainsi que son niveau.'),(272,'hlp_report_following_pages','fr','Contenu des pages suivantes du rapport'),(273,'pgH_report_following_pages_description','fr','Le rapport imprime les tests en erreur si ils appartiennent à la loi de sélection.'),(274,'hlp_confMgmt','fr','Gestion de la configuration'),(275,'pgH_confMgmt_description','fr','Les logos, nom utilisés en entête et les messages de bas de page sont configurables par l\'administrateur.'),(276,'hlp_ctgMgmt','fr','Gestion des catalogues de tests'),(277,'pgH_ctgMgmt_description','fr','Les types de tests sont définis dans le catalogue de tests et sont entièrement configurables par l\'administrateur.'),(278,'hlp_choose_catalogue','fr','Choisir le catalogue'),(279,'pgH_choose_catalogue_description','fr','Choisir un catalogue de tests spécifique en fonction de la section ou du niveau.'),(280,'hlp_overview','fr','Bilan du rapport'),(281,'pgH_overview_description','fr','Ceci est la page pour montrer le bilan du rapport sélectionné. Toutes les données associées au rapport sélectionné sont affichées.'),(282,'hlp_page_layout','fr','Mise en page sélectionnée'),(283,'pgH_page_layout_description','fr','Le rapport contient l\'en-tête avec le logo, la date du test, et les données pertinentes sur l\'élève et l\'enseignant.'),(284,'hlp_summary_scores','fr','Résumé des scores'),(285,'pgH_summary_scores_description','fr','Résultat des tests agrégés et avec calcul d\'avancement en fonction des seuils configurés.'),(286,'hlp_difficulties_summary','fr','Résumé des difficultés rencontrées'),(287,'pgH_difficulties_summary_description','fr','Catégorie passée sous un seuil - à définir lors du développement.'),(288,'hlp_rptMgmt','fr','Gestion des rapports'),(289,'hlp_select_report','fr','Sélectionner un rapport'),(290,'pgH_select_report_description','fr','Sélectionner un rapport existant pour le retravailler ou pour le réimprimer, ou créer un nouveau rapport.'),(291,'hlp_save_report','fr','Sauvegarder un rapport'),(292,'pgH_save_report_description','fr','Le rapport en cours d\'édition sera sauvegardé. Après sauvegarde, si des tests sont incomplets, leur catégorie sera mise en jaune.'),(293,'tab_year','fr','Annee'),(294,'tab_level','fr','Classe'),(295,'tab_stage','fr','Etape'),(296,'tab_subject','fr','Matière'),(297,'tab_desc','fr','Description'),(298,'msg_manyCtg','fr','Attention, vous avez sélectionné plus d\'un catalogue'),(299,'msg_noConf','fr','pas de configuration trouvée.'),(300,'msg_noSelectConf','fr','pas de configuration sélectionnée.'),(301,'msg_load','fr','Chargement des données...'),(302,'msg_refresh','fr','Rafraîchir les données...'),(303,'pgH_rptCarousel','fr','Test carousel'),(304,'tbH_profid','fr','Professeur Ref'),(305,'tbH_typeTest','fr','Type de tests'),(306,'tbH_ctgTest','fr','Categorie de tests'),(307,'tbH_test','fr','Test'),(308,'tbH_score','fr','Score'),(309,'tbH_MaxScore','fr','Maximum'),(310,'tbH_Label','fr','Label'),(311,'tbH_Desc','fr','Description'),(312,'pdf_prof','fr','Pédagogue'),(313,'pdf_lytChosen','fr','Mise en page choisie'),(314,'pdf_lytIconeTop','fr','Icone en-tête'),(315,'pdf_lytSchlName','fr','Nom de l\'école'),(316,'pdf_lytMsgTop','fr','Message en-tête'),(317,'pdf_lytMsgFoot1','fr','Pied de page 1'),(318,'pdf_lytMsgFoot2','fr','Pied de page 2'),(319,'msg_noLyt','fr','pas de configuration d\'impression trouvée.'),(320,'pgH_select_conf','fr','Sélectionner une configuration pour l\'impression'),(321,'btn_print','fr','Imprimer PDF'),(322,'pdf_stdt','fr','Elève'),(323,'pdf_rptCreatDt','fr','Date création'),(324,'pdf_ChartLabel','fr','Avancement'),(325,'msg_loadErrIcon','fr','Erreur chargement image'),(326,'msg_noData','fr','Pas de données disponible.'),(327,'pgH_admin','fr','Console administration'),(328,'msg_noStdtRpt','fr','Pas de rapport de tests trouvé pour cet élève.'),(329,'msg_noRpt','fr','Pas de rapport disponible.'),(330,'pdf_UpdDt','fr','Date de modification'),(331,'tbH_Seuil1','fr','Seuil 1'),(332,'tbH_Seuil2','fr','Seuil 2'),(333,'tbH_Seuil3','fr','Seuil 3'),(334,'nav_back','fr','Précédent'),(335,'nav_next','fr','Suivant'),(336,'nav_page','fr','Page'),(337,'nav_of','fr','sur'),(338,'tbH_detailRptPb','fr','Rapport détaillé des difficultés rencontrées'),(339,'tbH_scoreTotal','fr','Total score'),(340,'tbH_icon','fr','Icône'),(341,'tbH_compet','fr','Compétence acquise'),(342,'tbH_CatalogTest','fr','Catalogue de tests'),(343,'msg_noUserData','fr','Pas d\'information utilisateur disponible.'),(344,'tbH_resultat','fr','Résultat'),(345,'msg_err_sav','fr','Erreur lors de la sauvegarde. Veuillez réessayer.'),(346,'tab_id','fr','Identifiant'),(347,'tab_lang','fr','langue'),(348,'tab_roles','fr','Roles'),(349,'btn_rptSelect','fr','Sélectionner ce rapport'),(350,'btn_show','fr','Montrer'),(351,'btn_hide','fr','Cacher'),(352,'pgH_formStudent','fr','Remplir le formulaire pour ajouter un élève:'),(353,'pgH_summaryScor','fr','Résumé des scores'),(354,'pgH_summaryDifficult','fr','Résumé des difficultés'),(355,'pgH_summaryTest','fr','Résumé des tests en cours'),(356,'lang','fr','fr'),(357,'language_list','fr','{\"fr\": \"Français\", \"de\": \"Deutsch\", \"en\": \"English\", \"br\": \"Brezhoneg\"}'),(358,'inf_welcome','br','Degemer mat er gontadenn-mañ'),(359,'news','br','Keleier: Ouzhpennañ brezhoneg hag al lizherennoù saoznek. Kinniget evit ar bajenn skolier ivez.'),(360,'frm_name','br','Anv krign'),(361,'frm_first','br','Anv kentañ'),(362,'frm_level','br','Lenn'),(363,'frm_birthDt','br','Deiz ganedigezh'),(364,'frm_chooseLvl','br','Dibab ur level'),(365,'frm_prof','br','Professerien'),(366,'frm_createStud','br','Krouiñ ur skolier'),(367,'frm_addStud','br','Ouzhpennañ ur skolier nevez'),(368,'frm_srchPlcHldr','br','Klask evit anv pe anv kentañ...'),(369,'opt_all','br','An holl'),(370,'tbH_name','br','Anv krign'),(371,'tbH_first','br','Anv kentañ'),(372,'tbH_level','br','Lenn'),(373,'tbH_birthDt','br','Deiz ganedigezh'),(374,'tbH_prof','br','Professerien'),(375,'msg_req','br','Bez’ ezhomm eus an elfenn-mañ'),(376,'msg_noInfo','br','N’eus tamm wybodaeth eus an skolier'),(377,'msg_chosenStud','br','Skolier dibabet'),(378,'msg_noProf','br','N’eus professer ebet digaset'),(379,'msg_loadStuds','br','O kaout data skolier...'),(380,'msg_loadErr','br','Fazi en ober. Pleer adkregiñ.'),(381,'msg_selStud','br','Pleermed dilivad ur skolier'),(382,'msg_noStud','br','N’eus skolier ebet kavet.'),(383,'msg_chooseTest','br','Dibabit ar c’hontroù da ober:'),(384,'msg_ctg','br','Management kataloj'),(385,'msg_chosenCtg','br','Kataloj dibabet'),(386,'msg_noCtg','br','N’eus kataloj ebet kavet.'),(387,'msg_errCreateStud','br','Fazi e krouiñ skolier. Pleer adkregiñ.'),(388,'msg_na','br','N’eus ket disponabl'),(389,'pgH_studMgmt','br','Merañ ar skolier'),(390,'pgH_studSel','br','Dibab skolier'),(391,'rpt_selStudRpt','br','Sklaerioù war ur skolier dibabet: {{name}}'),(392,'NIV_desc0','br','Kenderc’h senior'),(393,'NIV_desc1','br','Klasa 1'),(394,'NIV_desc2','br','Klasa 2'),(395,'NIV_desc3','br','Klasa 3'),(396,'NIV_desc4','br','Klasa 4'),(397,'NIV_desc5','br','Klasa 5'),(398,'nav_Stud','br','Skoliad'),(399,'nav_chooseStud','br','Dibab ur skoliad'),(400,'nav_chooseConf','br','Dibab un aozadur'),(401,'nav_chooseCtg','br','Dibab ur c\'hatalog'),(402,'nav_help','br','Ez eus ezhomm a sikour?'),(403,'pgH_histo','br','Istor'),(404,'pgH_confMgmt','br','Aozadur PDF'),(405,'pgH_ctgMgmt','br','Merañ katalog ar testoù'),(406,'pgH_rptMgmt','br','Merañ ar raportoù'),(407,'pgH_overview','br','Adweladenn an testoù oc\'h ober'),(408,'pgH_PDF','br','Moullañ'),(409,'pgH_iconPDF','br','Moullañ gant piktoù'),(410,'pgH_logout','br','Digevreañ'),(411,'pgH_login','br','Kevreañ'),(412,'nav_menu','br','Lañser'),(413,'nav_chooseRpt','br','Dibab reizhañ pe krouiñ ur raport'),(414,'tbH_rptId','br','Ref. ar raport'),(415,'tbH_createdAt','br','Krouet d\'an'),(416,'hlp_globalHelp','br','Sikour Hollek'),(417,'hlp_introDescription','br','Aplikasion an testoù a ro an tu da enrollañ disoc\'hoù an testoù hag da sevel an raportoù stag. Gallout a ra bezañ miret ar raportoù e PDF evit ma c\'hallfent bezañ moulet pa\'z eus ezhomm. Er raportoù-mañ emañ titouroù evit ar skolidi, ar c\'helennerien, ar grafoù delienn, hag an disoc\'hoù testoù kudennaus.'),(418,'hlp_accessMenu','br','Mont d\'ar Menu'),(419,'hlp_accessMenuDesc','br','Gallout a reer diskouez ar menu en ur frapañ war an arlun e laezh-krec\'h.'),(420,'hlp_statusBar','br','Barre statud'),(421,'hlp_statusBarDesc','br','Ar varenn uhelañ a diskouez statud an oberoù war ar stern (skolidi, katalogoù, keflunioù pe raportoù dibabet). E-maez eus ar varenn-mañ, e lec\'hvezont en jaune an oberoù a chom da gas da benn evit moullañ ar rapport. Da skouer, mar n\'eus skolaji dibabet ebet, e vo lakaet war-wel an ober da zibab ur skolaji e jaune. Gallout a reer mont d\'ar bajenn evit merañ ar skolidi dre ar menu ivez.'),(422,'hlp_news','br','Keloù nevez'),(423,'hlp_newsDesc','br','Setu ar keloù nevez evit an aplikasion.'),(424,'btn_close','br','Clerc\'h'),(425,'hlp_needHelp','br','Où peus ezhomm skoazell ?'),(426,'hlp_wellcomeHelp','br','Degemer mat er rummad skoazell'),(427,'hlp_reportOverview','br','Tachenn ar raport : Ar raport a zo gant ar pennad-kemmañ gant ar logo, deiziad ar test, anv ar skolier hag ar c\'henel, ha hevelep forzh. Ar graf radar a zo diskouezet diwar-benn ar meiziadoù a zo bet ouzhpennet gant ar rannogadur implijer ar programm.'),(428,'hlp_histo','br','Istor ar rapportioù'),(429,'pgH_histo_description','br','Ar bajenn-mañ a ro da zieub diouz ar raportioù hag a zibabit e rujori ar raportioù o krenn.'),(430,'hlp_refresh_data','br','Dreist-ober an dataoù'),(431,'pgH_refresh_data_description','br','Ma n\'hellit ket gwelet holl ar raportioù, e c\'hallit dreist-ober evit aozañ ar raportioù.'),(432,'hlp_red_reports','br','Raportioù ruz'),(433,'pgH_red_reports_description','br','Ar raportioù a zo rougit a rank bezañ adkemeret : n\'eo ket bet kinniget an data test.'),(434,'hlp_expand_icon','br','Ikon ar ruiñ'),(435,'pgH_expand_icon_description','br','Evit kavout an taol-skiant a-raok an testennoù dre babor, e c\'hallit klikañ war \'▲\'. Evit ouzhpennañ, e c\'hallit klikañ war \'▼\'.'),(436,'hlp_studMgmt','br','Merouriezh an deskadurezhioù'),(437,'pgH_studMgmt_description','br','Krouiñ pe dibab ur skolier hag ur raport.'),(438,'hlp_filter_students','br','Filtred skolier'),(439,'pgH_filter_students_description','br','Kallit klask gant an anv pe anv-skolier, ha filtrout war an leveled.'),(440,'hlp_add_student','br','Ouzhpennañ ur skolier'),(441,'pgH_add_student_description','br','Ma n\'eo ket bet skolier anken e-barzh ar database, e c\'hallit kreñvañ anezhañ.'),(442,'hlp_select_student','br','Dibabit ur skolier'),(443,'pgH_select_student_description','br','Ar skolier dibabet a vo desket gant ul liñse leun a liv. Ne c\'hallit dibab nemet ur skolier da vezh.'),(444,'hlp_PDF','br','Gweler ha prennañ ar PDF'),(445,'pgH_PDF_description','br','Ar bajenn-mañ a zo evit gwelout ha prennañ ar PDFioù gant/heb ikon. Klikañ war prennañ evit embregiñ.'),(446,'hlp_print','br','Prennañ'),(447,'pgH_print_description','br','Un PDF a vo krouet war ar raport dibabet gant ar dataou visible er skeudenn.'),(448,'hlp_report_first_page','br','Kontez ar bajenn gentañ eus ar raport'),(449,'pgH_report_first_page_description','br','Ar raport a zo gant an pennad-kemmañ gant ar logo, deiziad ar test, anv ar skolier, anv ar prof, hag hevelep forzh.'),(450,'hlp_report_following_pages','br','Kontez ar bajennadoù o tremen eus ar raport'),(451,'pgH_report_following_pages_description','br','Ar raport a rufeñ ar testennoù gant kizidigezhioù mar fell dezho un diforc\'h.'),(452,'hlp_confMgmt','br','Merouriezh ar kenkadoù'),(453,'pgH_confMgmt_description','br','Ar logos, anvioù useet er pennad-kemmañ hag an detabistoù a c\'haller stumm evezh eus ar merour.'),(454,'hlp_ctgMgmt','br','Merouriezh ar catalogoù test'),(455,'pgH_ctgMgmt_description','br','Ar seurt test a zo diskouezet er catalogoù test hag a c\'haller krouiñ er mennoz.'),(456,'hlp_choose_catalogue','br','Dielfig ar catalogoù'),(457,'pgH_choose_catalogue_description','br','Dielfig ur catalog test spesifik hervez ur skol hag ar vot.'),(458,'hlp_overview','br','Bilan ar raport'),(459,'pgH_overview_description','br','Ar bajenn-mañ a zo evit mont war an taol skritell kinnigat war ar raport dibabet.'),(460,'hlp_page_layout','br','Layout a raok prennañ'),(461,'pgH_page_layout_description','br','Ar raport a zo gant an pennad-kemmañ gant ar logo, deiziad ar test, ha gwiriont gant an skolier hialet an prof.'),(462,'hlp_summary_scores','br','Farc\'heziad an talmoudegezh'),(463,'pgH_summary_scores_description','br','Miserial e bugell ar test da bep tra ha leveled e keñver an sept e titl reol.'),(464,'hlp_difficulties_summary','br','Farc\'heziad an deviner'),(465,'pgH_difficulties_summary_description','br','An un drat-mat chadenni oh gwaret dabluel ho sempezi gmewedjeur !!!'),(466,'hlp_rptMgmt','br','Menage oubd...'),(467,'hlp_wellcomeMsg','br','Welcome! Use the navigation to discover the app.'),(468,'tab_year','br','Bloavezh'),(469,'tab_level','br','Klas'),(470,'tab_stage','br','Darempred'),(471,'tab_subject','br','Danvez'),(472,'tab_desc','br','Deskrivadur'),(473,'msg_manyCtg','br','Diwallit, hoc\'h eus dibabet muioc\'h evit un dastumad'),(474,'msg_noConf','br','Configuradur ebet kavet.'),(475,'msg_noSelectConf','br','Configuradur dibabet ebet.'),(476,'msg_load','br','O kargañ an titouroù...'),(477,'msg_refresh','br','Adfreskaat an titouroù...'),(478,'pgH_rptCarousel','br','Karousel test'),(479,'tbH_profid','br','Ref Skolaer'),(480,'tbH_typeTest','br','Seurt test'),(481,'tbH_ctgTest','br','Rummad testoù'),(482,'tbH_test','br','Test'),(483,'tbH_score','br','Skor'),(484,'tbH_MaxScore','br','Skor uhelañ'),(485,'tbH_Label','br','Label'),(486,'tbH_Desc','br','Deskrivadur'),(487,'pdf_prof','br','Skolaer'),(488,'pdf_lytChosen','br','Emdroadur dibabet'),(489,'pdf_lytIconeTop','br','Arlun talbenn'),(490,'pdf_lytSchlName','br','Anv skol'),(491,'pdf_lytMsgTop','br','Kemennadenn talbenn'),(492,'pdf_lytMsgFoot1','br','Kemennadenn troad 1'),(493,'pdf_lytMsgFoot2','br','Kemennadenn troad 2'),(494,'msg_noLyt','br','Konfigurañ moullañ ebet kavet.'),(495,'pgH_select_conf','br','Diuzañ ur c\'honfigurañ evit moullañ'),(496,'btn_print','br','Moullañ PDF'),(497,'pdf_stdt','br','Skoliad'),(498,'pdf_rptCreatDt','br','Rapor krouet d\'ar'),(499,'pdf_ChartLabel','br','Kenderc\'had'),(500,'msg_loadErrIcon','br','Fazi kargañ skeudenn'),(501,'pgH_admin','br','Konsol renerezh'),(502,'msg_noStdtRpt','br','Raport test ebet kavet evit ar skolajiad-mañ.'),(503,'msg_noRpt','br','Raport ebet a zo.'),(504,'pdf_UpdDt','br','Deiziad kemmañ'),(505,'tbH_Seuil1','br','Treuzwel 1'),(506,'tbH_Seuil2','br','Treuzwel 2'),(507,'tbH_Seuil3','br','Treuzwel 3'),(508,'nav_back','br','Kent'),(509,'nav_next','br','War-lerc\'h'),(510,'nav_page','br','Pajenn'),(511,'nav_of','br','eus'),(512,'tbH_detailRptPb','br','Raport munud war ar c’hudennoù darempredet'),(513,'tbH_scoreTotal','br','Skor hollek'),(514,'tbH_icon','br','Arlun'),(515,'tbH_compet','br','Arouezet skiant-prenet'),(516,'tbH_CatalogTest','br','Roll testennoù'),(517,'msg_noUserData','br','Roadennoù implijer ebet.'),(518,'tbH_resultat','br','Disoc\'h'),(519,'msg_err_sav','br','Fazi en ur enrollañ. Klaskit en-dro mar plij.'),(520,'tab_id','br','Anaouder'),(521,'tab_lang','br','Yezh'),(522,'tab_roles','br','Perzhioù'),(523,'btn_rptSelect','br','Diuzañ ar raport-mañ'),(524,'btn_show','br','Diskouez'),(525,'btn_hide','br','Kuzhat'),(526,'pgH_formStudent','br','Leuniañ ar furmskrid evit ouzhpennañ ur skolaji:'),(527,'pgH_summaryScor','br','Diverrañ ar poentoù'),(528,'pgH_summaryDifficult','br','Diverrañ an diaesterioù'),(529,'pgH_summaryTest','br','Diverrañ an testoù war ober'),(530,'lang','br','br'),(531,'language_list','br','{\"br\": \"Brezhoneg\",\"fr\": \"Français\", \"de\": \"Deutsch\", \"en\": \"English\"}'),(532,'inf_welcome','de','Willkommen in unserer Anwendung'),(533,'news','de','Neuigkeiten: Auswahl mehrerer Sprachen (Englisch und Französisch) hinzugefügt. Momentan nur auf der Studentenseite.'),(534,'frm_name','de','Nachname'),(535,'frm_first','de','Vorname'),(536,'frm_level','de','Stufe'),(537,'frm_birthDt','de','Geburtsdatum'),(538,'frm_chooseLvl','de','Wählen Sie eine Klasse'),(539,'frm_prof','de','Professoren'),(540,'frm_createStud','de','Schüler erstellen'),(541,'frm_addStud','de','Neuen Schüler hinzufügen'),(542,'frm_srchPlcHldr','de','Suche nach Namen oder Vorname...'),(543,'opt_all','de','Alle'),(544,'tbH_name','de','Nachname'),(545,'tbH_first','de','Vorname'),(546,'tbH_level','de','Stufe'),(547,'tbH_birthDt','de','Geburtsdatum'),(548,'tbH_prof','de','Professoren'),(549,'msg_req','de','Dieses Feld ist erforderlich'),(550,'msg_noInfo','de','Keine Informationen zum Schüler verfügbar.'),(551,'msg_chosenStud','de','Ausgewählter Schüler'),(552,'msg_noProf','de','Keine zugewiesenen Professoren'),(553,'msg_loadStuds','de','Lade Schülerdaten...'),(554,'msg_loadErr','de','Fehler beim Laden. Bitte versuchen Sie es erneut.'),(555,'msg_selStud','de','Bitte wählen Sie einen Schüler aus.'),(556,'msg_noStud','de','Kein Student gefunden.'),(557,'msg_chooseTest','de','Tests Auswahl:'),(558,'msg_ctg','de','Catalogue Verwaltung'),(559,'msg_chosenCtg','de','ausgewählten catalogue'),(560,'msg_noCtg','de','No catalogue gefunden.'),(561,'msg_errCreateStud','de','Fehler beim Schüler hinfügen. Please try again.'),(562,'msg_na','de','Nicht available'),(563,'pgH_studMgmt','de','Schülerverwaltung'),(564,'pgH_studSel','de','Schülerauswahl'),(565,'rpt_selStudRpt','de','Berichte des ausgewählten Schüler: {{name}}'),(566,'NIV_desc0','de','Vorschule'),(567,'NIV_desc1','de','1. Klasse'),(568,'NIV_desc2','de','2. Klasse'),(569,'NIV_desc3','de','3. Klasse'),(570,'NIV_desc4','de','4. Klasse'),(571,'NIV_desc5','de','5. Klasse'),(572,'nav_Stud','de','Schüler'),(573,'nav_chooseStud','de','Schüler wählen'),(574,'nav_chooseConf','de','Konfiguration wählen'),(575,'nav_chooseCtg','de','Katalog wählen'),(576,'nav_help','de','Brauchen Sie Hilfe?'),(577,'pgH_histo','de','Verlauf'),(578,'pgH_confMgmt','de','PDF-Konfiguration'),(579,'pgH_ctgMgmt','de','Katalogverwaltung der Tests'),(580,'pgH_rptMgmt','de','Berichtsverwaltung'),(581,'pgH_overview','de','Übersicht der laufenden Tests'),(582,'pgH_PDF','de','Drucken'),(583,'pgH_iconPDF','de','Drucken mit Piktogrammen'),(584,'pgH_logout','de','Abmelden'),(585,'pgH_login','de','Anmelden'),(586,'nav_menu','de','Menü'),(587,'nav_chooseRpt','de','Bearbeiten oder Bericht erstellen auswählen'),(588,'tbH_rptId','de','Berichts-Ref.'),(589,'tbH_createdAt','de','Erstellt am'),(590,'hlp_globalHelp','de','Allgemeine Hilfe'),(591,'hlp_introDescription','de','Die Bewertungsanwendung ermöglicht die Eingabe der Testergebnisse und die Erstellung der zugehörigen Berichte. Die Berichte können im PDF-Format gespeichert werden, um bei Bedarf gedruckt zu werden. Diese Berichte enthalten Schüler- und Lehrerinformationen, Spinnengrafiken und problematische Testergebnisse.'),(592,'hlp_accessMenu','de','Zugang zum Menü'),(593,'hlp_accessMenuDesc','de','Das Menü kann ausgeklappt werden, indem auf das Symbol oben links geklickt wird.'),(594,'hlp_statusBar','de','Statusleiste'),(595,'hlp_statusBarDesc','de','Die obere Leiste zeigt den Status der laufenden Aktionen an (ausgewählter Schüler, Katalog, Konfiguration oder Bericht). Auf der oberen Leiste werden die noch auszuführenden Schritte vor dem Drucken des Berichts in Gelb angezeigt. Zum Beispiel, wenn kein Schüler ausgewählt ist, wird die Aktion, einen Schüler auszuwählen, gelb angezeigt. Man kann auch über das Menü zur Schülerverwaltung gelangen.'),(596,'hlp_news','de','Neuigkeiten'),(597,'hlp_newsDesc','de','Hier sind die neuesten Updates der Anwendung.'),(598,'btn_close','de','Schließen'),(599,'hlp_needHelp','de','Brauchen Sie Hilfe?'),(600,'hlp_wellcomeHelp','de','Willkommen im Hilfebereich'),(601,'hlp_reportOverview','de','Berichtszusammenfassung: Der Bericht enthält die Kopfzeile mit dem Logo, dem Testdatum, dem Namen des Schülers, dem Namen des Lehrers und deren Niveau. Das Radar-Diagramm wird basierend auf den von der Anwendungsadministrator festgelegten Schwellenwerten gezeichnet.'),(602,'hlp_histo','de','Berichtsverlauf'),(603,'pgH_histo_description','de','Diese Seite ermöglicht das Anzeigen des Verlaufs von Berichten und das Markieren unvollständiger Berichte in Rot.'),(604,'hlp_refresh_data','de','Daten aktualisieren'),(605,'pgH_refresh_data_description','de','Falls einige Berichte nicht angezeigt werden, können Sie sie aktualisieren, um die angezeigten Berichte zu aktualisieren.'),(606,'hlp_red_reports','de','Rote Berichte'),(607,'pgH_red_reports_description','de','In Rot angezeigte Berichte müssen erneut bearbeitet werden: Testdaten fehlen.'),(608,'hlp_expand_icon','de','Erweitern-Symbol'),(609,'pgH_expand_icon_description','de','Um den Fortschritt der Tests nach Kategorien anzuzeigen, klicken Sie auf \'▲\'. Zum Ausblenden klicken Sie auf \'▼\'.'),(610,'hlp_studMgmt','de','Schülerverwaltung'),(611,'pgH_studMgmt_description','de','Erstellen oder auswählen eines Schülers und Berichts.'),(612,'hlp_filter_students','de','Schüler filtern'),(613,'pgH_filter_students_description','de','Sie können nach Namen oder Vornamen des Schülers suchen und auch nach Niveau filtern.'),(614,'hlp_add_student','de','Schüler hinzufügen'),(615,'pgH_add_student_description','de','Wenn der Schüler noch nicht in der Datenbank ist, können Sie ihn erstellen.'),(616,'hlp_select_student','de','Schüler auswählen'),(617,'pgH_select_student_description','de','Der ausgewählte Schüler wird in einer anderen Farbe hervorgehoben. Es kann nur ein Schüler gleichzeitig ausgewählt werden.'),(618,'hlp_PDF','de','PDF anzeigen und drucken'),(619,'pgH_PDF_description','de','Diese Seite dient zum Anzeigen und Drucken von PDFs mit/ohne Symbolen. Drücken Sie auf Drucken, um zu drucken.'),(620,'hlp_print','de','Drucken'),(621,'pgH_print_description','de','Eine PDF-Datei wird für den ausgewählten Bericht mit den auf dem Bildschirm sichtbaren Daten generiert.'),(622,'hlp_report_first_page','de','Inhalt der ersten Seite des Berichts'),(623,'pgH_report_first_page_description','de','Der Bericht enthält die Kopfzeile mit dem Logo, dem Testdatum, dem Namen des Schülers, dem Namen des Lehrers und deren Niveau.'),(624,'hlp_report_following_pages','de','Inhalt der folgenden Seiten des Berichts'),(625,'pgH_report_following_pages_description','de','Der Bericht druckt Fehler in Tests, wenn sie zur Auswahlregel gehören.'),(626,'hlp_confMgmt','de','Konfigurationsverwaltung'),(627,'pgH_confMgmt_description','de','Logos, Kopfzeilennamen und Fußzeilenmeldungen sind vom Administrator konfigurierbar.'),(628,'hlp_ctgMgmt','de','Testkatalogverwaltung'),(629,'pgH_ctgMgmt_description','de','Testtypen werden im Testkatalog definiert und sind vollständig vom Administrator konfigurierbar.'),(630,'hlp_choose_catalogue','de','Katalog wählen'),(631,'pgH_choose_catalogue_description','de','Wählen Sie einen spezifischen Testkatalog basierend auf der Sektion oder dem Niveau.'),(632,'hlp_overview','de','Berichtszusammenfassung'),(633,'pgH_overview_description','de','Diese Seite zeigt die Zusammenfassung des ausgewählten Berichts. Alle Daten des ausgewählten Berichts werden angezeigt.'),(634,'hlp_page_layout','de','Ausgewähltes Seitenlayout'),(635,'pgH_page_layout_description','de','Der Bericht enthält die Kopfzeile mit dem Logo, dem Testdatum und relevanten Daten des Schülers und Lehrers.'),(636,'hlp_summary_scores','de','Zusammenfassung der Ergebnisse'),(637,'pgH_summary_scores_description','de','Aggregierte Testergebnisse mit Fortschrittsberechnung basierend auf den konfigurierten Schwellenwerten.'),(638,'hlp_difficulties_summary','de','Zusammenfassung der aufgetretenen Schwierigkeiten'),(639,'pgH_difficulties_summary_description','de','Kategorie unter einem Schwellenwert - wird während der Entwicklung definiert.'),(640,'hlp_rptMgmt','de','Berichtverwaltung'),(641,'hlp_select_report','de','Bericht auswählen'),(642,'pgH_select_report_description','de','Wählen Sie einen bestehenden Bericht zur Bearbeitung oder Neudruck, oder erstellen Sie einen neuen Bericht.'),(643,'hlp_save_report','de','Bericht speichern'),(644,'pgH_save_report_description','de','Der bearbeitete Bericht wird gespeichert. Nach dem Speichern wird die Kategorie von Tests, die unvollständig sind, gelb markiert.'),(645,'hlp_wellcomeMsg','de','Willkommen! Benutze the Menü um die App zu entdecken.'),(646,'tab_year','de','Jahr'),(647,'tab_level','de','Klasse'),(648,'tab_stage','de','Stufe'),(649,'tab_subject','de','Fach'),(650,'tab_desc','de','Beschreibung'),(651,'msg_manyCtg','de','Achtung, Sie haben mehr als einen Katalog ausgewählt'),(652,'msg_noConf','de','Keine Konfiguration gefunden.'),(653,'msg_noSelectConf','de','Keine Konfiguration ausgewählt.'),(654,'msg_load','de','Daten werden geladen...'),(655,'msg_refresh','de','Daten aktualisieren...'),(656,'pgH_rptCarousel','de','Testkarussell'),(657,'tbH_profid','de','Lehrer Ref'),(658,'tbH_typeTest','de','Testtyp'),(659,'tbH_ctgTest','de','Testkategorie'),(660,'tbH_test','de','Test'),(661,'tbH_score','de','Ergebnis'),(662,'tbH_MaxScore','de','Maximalergebnis'),(663,'tbH_Label','de','Etikett'),(664,'tbH_Desc','de','Beschreibung'),(665,'pdf_prof','de','Lehrer'),(666,'pdf_lytChosen','de','Gewähltes Layout'),(667,'pdf_lytIconeTop','de','Kopfzeilen-Symbol'),(668,'pdf_lytSchlName','de','Schulname'),(669,'pdf_lytMsgTop','de','Kopfzeilen-Nachricht'),(670,'pdf_lytMsgFoot1','de','Fußzeile Nachricht 1'),(671,'pdf_lytMsgFoot2','de','Fußzeile Nachricht 2'),(672,'msg_noLyt','de','Keine Druckkonfiguration gefunden.'),(673,'pgH_select_conf','de','Druckkonfiguration wählen'),(674,'btn_print','de','PDF drucken'),(675,'pdf_stdt','de','Schüler'),(676,'pdf_rptCreatDt','de','Bericht erstellt am'),(677,'pdf_ChartLabel','de','Fortschritt'),(678,'msg_loadErrIcon','de','Bildladefehler'),(679,'pgH_admin','de','Verwaltungskonsole'),(680,'msg_noStdtRpt','de','Kein Testbericht für diesen Schüler gefunden.'),(681,'msg_noRpt','de','Kein Bericht verfügbar.'),(682,'pdf_UpdDt','de','Änderungsdatum'),(683,'tbH_Seuil1','de','Schwelle 1'),(684,'tbH_Seuil2','de','Schwelle 2'),(685,'tbH_Seuil3','de','Schwelle 3'),(686,'nav_back','de','Zurück'),(687,'nav_next','de','Weiter'),(688,'nav_page','de','Seite'),(689,'nav_of','de','von'),(690,'tbH_detailRptPb','de','Detaillierter Bericht über aufgetretene Schwierigkeiten'),(691,'tbH_scoreTotal','de','Gesamtergebnis'),(692,'tbH_icon','de','Symbol'),(693,'tbH_compet','de','Erworbene Kompetenz'),(694,'tbH_CatalogTest','de','Testkatalog'),(695,'msg_noUserData','de','Keine Benutzerinformationen verfügbar.'),(696,'tbH_resultat','de','Ergebnis'),(697,'msg_err_sav','de','Fehler beim Speichern. Bitte erneut versuchen.'),(698,'tab_id','de','Kennung'),(699,'tab_lang','de','Sprache'),(700,'tab_roles','de','Rollen'),(701,'btn_rptSelect','de','Diesen Bericht auswählen'),(702,'btn_show','de','Anzeigen'),(703,'btn_hide','de','Verbergen'),(704,'pgH_formStudent','de','Formular ausfüllen, um einen Schüler hinzuzufügen:'),(705,'pgH_summaryScor','de','Ergebnisübersicht'),(706,'pgH_summaryDifficult','de','Übersicht der Schwierigkeiten'),(707,'pgH_summaryTest','de','Zusammenfassung der laufenden Tests'),(708,'lang','de','de'),(709,'language_list','de','{\"de\": \"Deutsch\", \"fr\": \"Français\",  \"en\": \"English\", \"br\": \"Brezhoneg\"}');
/*!40000 ALTER TABLE `competence_translation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_competence_customuser_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_competence_customuser_id` FOREIGN KEY (`user_id`) REFERENCES `competence_customuser` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(3,'auth','group'),(2,'auth','permission'),(7,'competence','annee'),(8,'competence','catalogue'),(6,'competence','customuser'),(9,'competence','eleve'),(10,'competence','etape'),(11,'competence','groupagedata'),(12,'competence','item'),(13,'competence','matiere'),(14,'competence','myimage'),(15,'competence','niveau'),(16,'competence','pdflayout'),(17,'competence','report'),(18,'competence','reportcatalogue'),(19,'competence','resultat'),(20,'competence','resultatdetail'),(21,'competence','scorerule'),(23,'competence','scorerulepoint'),(22,'competence','translation'),(4,'contenttypes','contenttype'),(5,'sessions','session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2026-04-10 16:51:22.638140'),(2,'contenttypes','0002_remove_content_type_name','2026-04-10 16:51:22.828554'),(3,'auth','0001_initial','2026-04-10 16:51:23.396781'),(4,'auth','0002_alter_permission_name_max_length','2026-04-10 16:51:23.514422'),(5,'auth','0003_alter_user_email_max_length','2026-04-10 16:51:23.524989'),(6,'auth','0004_alter_user_username_opts','2026-04-10 16:51:23.539831'),(7,'auth','0005_alter_user_last_login_null','2026-04-10 16:51:23.560168'),(8,'auth','0006_require_contenttypes_0002','2026-04-10 16:51:23.568495'),(9,'auth','0007_alter_validators_add_error_messages','2026-04-10 16:51:23.580177'),(10,'auth','0008_alter_user_username_max_length','2026-04-10 16:51:23.591200'),(11,'auth','0009_alter_user_last_name_max_length','2026-04-10 16:51:23.599773'),(12,'auth','0010_alter_group_name_max_length','2026-04-10 16:51:23.621837'),(13,'auth','0011_update_proxy_permissions','2026-04-10 16:51:23.634025'),(14,'auth','0012_alter_user_first_name_max_length','2026-04-10 16:51:23.642698'),(15,'competence','0001_initial','2026-04-10 16:51:28.859565'),(16,'admin','0001_initial','2026-04-10 16:51:29.113603'),(17,'admin','0002_logentry_remove_auto_add','2026-04-10 16:51:29.130497'),(18,'admin','0003_logentry_add_action_flag_choices','2026-04-10 16:51:29.147327'),(19,'sessions','0001_initial','2026-04-10 16:51:29.269493');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES ('6uhjp5tpm4c590tpmp97ylgmf9q1hd2f','.eJxVjMsOwiAQRf-FtSEM5enSvd9AgBmkaiAp7cr479qkC93ec859sRC3tYZt0BJmZGcG7PS7pZgf1HaA99hunefe1mVOfFf4QQe_dqTn5XD_Dmoc9VtnT8lOaCl6B6CsRtCTdJAkyIlUTqQKeGFQmOyLI4sFNUAR0hmLzrL3B9niN4I:1wBFim:EonVYCKazKMnzF5xyMHlkq6fQksIcRK4i647sEpowg4','2026-04-24 17:32:44.320713');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-11 12:55:40
