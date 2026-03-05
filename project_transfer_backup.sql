-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: cms
-- ------------------------------------------------------
-- Server version	8.0.45

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
-- Current Database: `cms`
--

/*!40000 DROP DATABASE IF EXISTS `cms`*/;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `cms` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `cms`;

--
-- Table structure for table `AvailableBooks`
--

DROP TABLE IF EXISTS `AvailableBooks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AvailableBooks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `BookNo` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CallNo` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `BookTitle` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Category` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Author` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Publisher` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `PublishedYear` int DEFAULT NULL,
  `Availability` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Rack` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Position` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Quantity` int DEFAULT '1',
  `isbn` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `book_language` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `edition` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `number_of_pages` int DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AvailableBooks`
--

LOCK TABLES `AvailableBooks` WRITE;
/*!40000 ALTER TABLE `AvailableBooks` DISABLE KEYS */;
/*!40000 ALTER TABLE `AvailableBooks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BookIssue`
--

DROP TABLE IF EXISTS `BookIssue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BookIssue` (
  `IssueID` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `BorrowerID` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `BorrowerName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Department` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `RollOrStaffID` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `BookID` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `BookTitle` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `IssueDate` date DEFAULT NULL,
  `DueDate` date DEFAULT NULL,
  `RenewalID` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ReturnID` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ReturnDate` date DEFAULT NULL,
  `Status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Issued',
  `Remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `FineAmount` decimal(10,2) DEFAULT '0.00',
  `FineStatus` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Pending',
  `RenewalCount` int DEFAULT '0',
  `RenewalDate` date DEFAULT NULL,
  `YearSection` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `RegisterNo` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `DaysOverdue` int DEFAULT '0',
  `FinePaid` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`IssueID`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BookIssue`
--

LOCK TABLES `BookIssue` WRITE;
/*!40000 ALTER TABLE `BookIssue` DISABLE KEYS */;
/*!40000 ALTER TABLE `BookIssue` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BorrowerDetails`
--

DROP TABLE IF EXISTS `BorrowerDetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BorrowerDetails` (
  `id` int NOT NULL AUTO_INCREMENT,
  `BorrowerID` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `BorrowerType` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Department` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `RollOrEmpID` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `YearOrSection` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ContactNumber` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `EmailAddress` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `DateOfRegistration` date DEFAULT NULL,
  `ActiveStatus` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `MaxBooksAllowed` int DEFAULT '3',
  `FineDue` decimal(10,2) DEFAULT '0.00',
  `Remarks` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `PhotoPath` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BorrowerDetails`
--

LOCK TABLES `BorrowerDetails` WRITE;
/*!40000 ALTER TABLE `BorrowerDetails` DISABLE KEYS */;
/*!40000 ALTER TABLE `BorrowerDetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CurrentBorrowerReport`
--

DROP TABLE IF EXISTS `CurrentBorrowerReport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CurrentBorrowerReport` (
  `id` int NOT NULL AUTO_INCREMENT,
  `BorrowerID` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `BorrowerName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Department` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `RollOrStaffID` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `BookID` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `BookTitle` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `IssueDate` date DEFAULT NULL,
  `DueDate` date DEFAULT NULL,
  `DaysLeft` int DEFAULT '0',
  `FineAmount` decimal(10,2) DEFAULT '0.00',
  `Status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ContactNumber` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CurrentBorrowerReport`
--

LOCK TABLES `CurrentBorrowerReport` WRITE;
/*!40000 ALTER TABLE `CurrentBorrowerReport` DISABLE KEYS */;
/*!40000 ALTER TABLE `CurrentBorrowerReport` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CurrentBorrowers`
--

DROP TABLE IF EXISTS `CurrentBorrowers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CurrentBorrowers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `BorrowerID` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Department` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `BookID` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `BookTitle` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `IssueDate` date DEFAULT NULL,
  `DueDate` date DEFAULT NULL,
  `DaysLeft` int DEFAULT NULL,
  `FineAmount` decimal(10,2) DEFAULT '0.00',
  `Status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Issued',
  `Remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CurrentBorrowers`
--

LOCK TABLES `CurrentBorrowers` WRITE;
/*!40000 ALTER TABLE `CurrentBorrowers` DISABLE KEYS */;
/*!40000 ALTER TABLE `CurrentBorrowers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DueDateExitReport`
--

DROP TABLE IF EXISTS `DueDateExitReport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DueDateExitReport` (
  `id` int NOT NULL AUTO_INCREMENT,
  `BorrowerID` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `BorrowerName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Department` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ContactNumber` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `BookID` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `BookTitle` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `DueDate` date DEFAULT NULL,
  `DaysOverdue` int DEFAULT '0',
  `FineAmount` decimal(10,2) DEFAULT '0.00',
  `ReminderStatus` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Not Sent',
  `Remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `IssueID` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Actions` enum('Edit','Delete','Sent Reminder','View') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Lastpay` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Unpaid',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DueDateExitReport`
--

LOCK TABLES `DueDateExitReport` WRITE;
/*!40000 ALTER TABLE `DueDateExitReport` DISABLE KEYS */;
/*!40000 ALTER TABLE `DueDateExitReport` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FineDetails`
--

DROP TABLE IF EXISTS `FineDetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FineDetails` (
  `id` int NOT NULL AUTO_INCREMENT,
  `FineID` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `BorrowerID` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Amount` decimal(10,2) DEFAULT NULL,
  `FineDate` date DEFAULT NULL,
  `Status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FineDetails`
--

LOCK TABLES `FineDetails` WRITE;
/*!40000 ALTER TABLE `FineDetails` DISABLE KEYS */;
/*!40000 ALTER TABLE `FineDetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FineReport`
--

DROP TABLE IF EXISTS `FineReport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FineReport` (
  `id` int NOT NULL AUTO_INCREMENT,
  `FineID` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `BorrowerID` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Amount` decimal(10,2) DEFAULT NULL,
  `FineDate` date DEFAULT NULL,
  `Status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FineReport`
--

LOCK TABLES `FineReport` WRITE;
/*!40000 ALTER TABLE `FineReport` DISABLE KEYS */;
/*!40000 ALTER TABLE `FineReport` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MissingBooks`
--

DROP TABLE IF EXISTS `MissingBooks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MissingBooks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `SNo` int DEFAULT NULL,
  `MissingID` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `BookID` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CallNo` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `BookTitle` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Author` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Category` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `DateMarkedMissing` date DEFAULT NULL,
  `ReportedBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Reason` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `BorrowerName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `BorrowerID` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `FineAmount` decimal(10,2) DEFAULT '0.00',
  `ActionTaken` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ReplacementStatus` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Status` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MissingBooks`
--

LOCK TABLES `MissingBooks` WRITE;
/*!40000 ALTER TABLE `MissingBooks` DISABLE KEYS */;
/*!40000 ALTER TABLE `MissingBooks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `academic_calendar`
--

DROP TABLE IF EXISTS `academic_calendar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `academic_calendar` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Calendar_Date` date DEFAULT NULL,
  `Day_Order` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Event_Title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Event_Timing` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Label` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `Created_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `Updated_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3830 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `academic_calendar`
--

LOCK TABLES `academic_calendar` WRITE;
/*!40000 ALTER TABLE `academic_calendar` DISABLE KEYS */;
INSERT INTO `academic_calendar` VALUES (3805,'2026-02-04','Wednesday','W',NULL,NULL,NULL,NULL,'2026-02-04 02:15:12','2026-02-04 02:15:12',NULL),(3806,'2026-02-05','Thursday','W',NULL,NULL,NULL,NULL,'2026-02-04 02:15:12','2026-02-04 02:15:12',NULL),(3807,'2026-02-06','Friday','W',NULL,NULL,NULL,NULL,'2026-02-04 02:15:12','2026-02-04 02:15:12',NULL),(3808,'2026-02-07','Saturday','W',NULL,NULL,NULL,NULL,'2026-02-04 02:15:12','2026-02-04 02:15:12',NULL),(3809,'2026-02-08','Sunday','H',NULL,NULL,NULL,NULL,'2026-02-04 02:15:12','2026-02-04 02:15:12','Sunday'),(3810,'2026-02-09','Monday','W',NULL,NULL,NULL,NULL,'2026-02-04 02:15:12','2026-02-04 02:15:12',NULL),(3811,'2026-02-10','Tuesday','W',NULL,NULL,NULL,NULL,'2026-02-04 02:15:12','2026-02-04 02:15:12',NULL),(3812,'2026-02-11','Wednesday','W',NULL,NULL,NULL,NULL,'2026-02-04 02:15:12','2026-02-04 02:15:12',NULL),(3813,'2026-02-12','Thursday','W',NULL,NULL,NULL,NULL,'2026-02-04 02:15:12','2026-02-04 02:15:12',NULL),(3814,'2026-02-13','Friday','W',NULL,NULL,NULL,NULL,'2026-02-04 02:15:12','2026-02-04 02:15:12',NULL),(3815,'2026-02-14','Saturday','W',NULL,NULL,NULL,NULL,'2026-02-04 02:15:12','2026-02-04 02:15:12',NULL),(3816,'2026-02-15','Sunday','H',NULL,NULL,NULL,NULL,'2026-02-04 02:15:12','2026-02-04 02:15:12','Sunday'),(3817,'2026-02-16','Monday','W',NULL,NULL,NULL,NULL,'2026-02-04 02:15:12','2026-02-04 02:15:12',NULL),(3818,'2026-02-17','Tuesday','W',NULL,NULL,NULL,NULL,'2026-02-04 02:15:12','2026-02-04 02:15:12',NULL),(3819,'2026-02-18','Wednesday','W',NULL,NULL,NULL,NULL,'2026-02-04 02:15:12','2026-02-04 02:15:12',NULL),(3820,'2026-02-19','Thursday','W',NULL,NULL,NULL,NULL,'2026-02-04 02:15:12','2026-02-04 02:15:12',NULL),(3821,'2026-02-20','Friday','W',NULL,NULL,NULL,NULL,'2026-02-04 02:15:12','2026-02-04 02:15:12',NULL),(3822,'2026-02-21','Saturday','W',NULL,NULL,NULL,NULL,'2026-02-04 02:15:12','2026-02-04 02:15:12',NULL),(3823,'2026-02-22','Sunday','H',NULL,NULL,NULL,NULL,'2026-02-04 02:15:12','2026-02-04 02:15:12','Sunday'),(3824,'2026-02-23','Monday','W',NULL,NULL,NULL,NULL,'2026-02-04 02:15:12','2026-02-04 02:15:12',NULL),(3825,'2026-02-24','Tuesday','W',NULL,NULL,NULL,NULL,'2026-02-04 02:15:12','2026-02-04 02:15:12',NULL),(3826,'2026-02-25','Wednesday','W',NULL,NULL,NULL,NULL,'2026-02-04 02:15:12','2026-02-04 02:15:12',NULL),(3827,'2026-02-26','Thursday','W',NULL,NULL,NULL,NULL,'2026-02-04 02:15:12','2026-02-04 02:15:12',NULL),(3828,'2026-02-27','Friday','W',NULL,NULL,NULL,NULL,'2026-02-04 02:15:12','2026-02-04 02:15:12',NULL),(3829,'2026-02-28','Saturday','W',NULL,NULL,NULL,NULL,'2026-02-04 02:15:12','2026-02-04 02:15:12',NULL);
/*!40000 ALTER TABLE `academic_calendar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `academic_calendar_date_fix`
--

DROP TABLE IF EXISTS `academic_calendar_date_fix`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `academic_calendar_date_fix` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Start_Date` date DEFAULT NULL,
  `End_Date` date DEFAULT NULL,
  `Total_Weeks` int DEFAULT NULL,
  `Created_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `Updated_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `academic_calendar_date_fix`
--

LOCK TABLES `academic_calendar_date_fix` WRITE;
/*!40000 ALTER TABLE `academic_calendar_date_fix` DISABLE KEYS */;
INSERT INTO `academic_calendar_date_fix` VALUES (5,'2026-02-04','2026-02-28',4,'2026-02-04 02:15:12','2026-02-04 02:15:12');
/*!40000 ALTER TABLE `academic_calendar_date_fix` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `academic_year_master`
--

DROP TABLE IF EXISTS `academic_year_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `academic_year_master` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Academic_Year` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Created_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `Update_At` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `academic_year_master`
--

LOCK TABLES `academic_year_master` WRITE;
/*!40000 ALTER TABLE `academic_year_master` DISABLE KEYS */;
INSERT INTO `academic_year_master` VALUES (1,'2017-2018','2025-11-19 11:21:54','2025-12-14 13:09:56'),(2,'2018-2019','2025-11-19 11:21:54',NULL),(3,'2019-2020','2025-11-19 11:21:54',NULL),(4,'2020-2021','2025-11-19 11:21:54',NULL),(5,'2021-2022','2025-11-19 11:21:54',NULL),(6,'2022-2023','2025-11-19 11:21:54',NULL),(7,'2023-2024','2025-11-19 11:21:54',NULL),(8,'2024-2025','2025-11-19 11:21:54',NULL),(9,'2025-2026','2025-11-19 11:21:54',NULL),(10,'2026-2027','2025-11-20 06:42:46','2025-11-20 06:43:03');
/*!40000 ALTER TABLE `academic_year_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admission_status`
--

DROP TABLE IF EXISTS `admission_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admission_status` (
  `application_no` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `student_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `branch` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `branch_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `year` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `community` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `current_status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `new_status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `remarks` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `contact_number` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`application_no`) USING BTREE,
  KEY `idx_branch_code` (`branch_code`) USING BTREE,
  KEY `idx_current_status` (`current_status`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admission_status`
--

LOCK TABLES `admission_status` WRITE;
/*!40000 ALTER TABLE `admission_status` DISABLE KEYS */;
/*!40000 ALTER TABLE `admission_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admitted_students`
--

DROP TABLE IF EXISTS `admitted_students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admitted_students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `EntryType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ApplicationNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `BranchSec` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `AllocatedQuota` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SeatNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `RollNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `RegNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_ApplicationNo` (`ApplicationNo`) USING BTREE,
  KEY `idx_RollNo` (`RollNo`) USING BTREE,
  KEY `idx_RegNo` (`RegNo`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admitted_students`
--

LOCK TABLES `admitted_students` WRITE;
/*!40000 ALTER TABLE `admitted_students` DISABLE KEYS */;
/*!40000 ALTER TABLE `admitted_students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `application_issue`
--

DROP TABLE IF EXISTS `application_issue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `application_issue` (
  `id` int NOT NULL AUTO_INCREMENT,
  `application_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `course_applied` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `community` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `date` date DEFAULT NULL,
  `qualification` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parent_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contact` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `reference_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `pharmacy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_application_no` (`application_no`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application_issue`
--

LOCK TABLES `application_issue` WRITE;
/*!40000 ALTER TABLE `application_issue` DISABLE KEYS */;
/*!40000 ALTER TABLE `application_issue` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `area`
--

DROP TABLE IF EXISTS `area`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `area` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Area` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10081 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `area`
--

LOCK TABLES `area` WRITE;
/*!40000 ALTER TABLE `area` DISABLE KEYS */;
INSERT INTO `area` VALUES (1,'Aravakurichi,Aravakurichi'),(2,'Erode,Surampatti,Edayankattuvalsu'),(3,'Erode,Kathirampatti,Perundurai,Ichanda,Kanagapuram'),(4,'Erode,Surampatti,Erode,Collectorate'),(5,'Erode,Erode,Collectorate'),(6,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(7,'Erode,Erode,East'),(8,'Erode,Rangampalayam,Chennimalai,Edayankattuvalsu'),(9,'Erode,Chennimalai,Edayankattuvalsu'),(10,'Coimbatore,Gandhipuram,(Coimbatore)'),(11,'Erode,Periyar,Nagar,Arur,Karur,Erode,East'),(12,'Erode,Surampatti,Edayankattuvalsu'),(13,'Erode,Edayankattuvalsu'),(14,'Erode,Thindal,Thindal'),(15,'Erode,Perundurai,Thindal,Thindal'),(16,'Erode,Erode,East'),(17,'Perundurai,Athur,Ingur'),(18,'Erode,Perundurai,Edayankattuvalsu'),(19,'Avalpoondurai,Avalpundurai'),(20,'Erode,Nadarmedu,Erode,Railway,Colony'),(21,'Bhavani,Elavamalai,Erode,Moolapalayam,Vasavi,College'),(22,'Erode,Edayankattuvalsu'),(23,'Erode,Peria,Agraharam'),(24,'Erode,Thindal,Thindal'),(25,'Alapuram,Kamalapuram,Darapuram'),(26,'Erode,Teachers,Colony,Erode,Collectorate'),(27,'Erode,Periyar,Nagar,Surampatti,Erode,East'),(28,'Erode,Nasiyanur,Anur,Arasampatti,Thindal'),(29,'Erode,Nagadevampalayam,Kadukkampalayam'),(30,'Erode,Chettipalayam,Erode,Railway,Colony'),(31,'Alampalayam,Pappampalayam'),(32,'Perundurai,Ingur'),(33,'Thindal,Thindal'),(34,'Erode,Perundurai,Erode,Collectorate'),(35,'Erode,Ganapathy,Chikkaiah,Naicker,College'),(36,'Chithode,Erode,Chittode'),(37,'Erode,Chikkaiah,Naicker,College'),(38,'Erode,Sampath,Nagar,Erode,Collectorate'),(39,'Kokkarayanpettai,Koottapalli'),(40,'Erode,Railway,Colony,Surampatti,Erode,East'),(41,'Erode,Nasiyanur,Anur,Emur,Erode,Collectorate'),(42,'Coimbatore,Coimbatore,Industrial,Estate'),(43,'Erode,Solar,Erode,Railway,Colony'),(44,'Erode,Kanagapuram'),(45,'Bhavani,Erode,Vairapalayam,Chikkaiah,Naicker,College'),(46,'Agraharam,Erode,Chikkaiah,Naicker,College'),(47,'Kavandapadi,Kalichettipalayam.,Mettupalayam'),(48,'Erode,Erode,East'),(49,'Erode,Tiruchengodu,North'),(50,'Erode,Erode,Fort,Erode,East'),(51,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(52,'Erode,Surampatti,Erode,East'),(53,'Erode,Thindal,Thindal'),(54,'Coimbatore,Malumichampatti'),(55,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(56,'Erode,Chikkaiah,Naicker,College'),(57,'Erode,Perundurai,Thindal,Thindal'),(58,'Anthiyur,Alampalayam'),(59,'Erode,Palayapalayam,Perundurai,Teachers,Colony,Erode,Collectorate'),(60,'Erode,Teachers,Colony,Erode,Collectorate'),(61,'Erode,Erode,East'),(62,'Komarapalayam,Kallankattuvalasu'),(63,'Erode,Perundurai,Erode,Collectorate'),(64,'Bhavani,Bhavani,Kudal'),(65,'Erode,Karungalpalayam'),(66,'Erode,Erode,Fort,Erode,East'),(67,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(68,'Erode,Erode,East'),(69,'Erode,Karungalpalayam'),(70,'Erode,Karungalpalayam'),(71,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(72,'Pallipalayam,Pallipalayam'),(73,'Erode,Karungalpalayam'),(74,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(75,'Erode,Chikkaiah,Naicker,College'),(76,'Erode,Perundurai,Thindal'),(77,'Erode,Chidambaram,Erode,East'),(78,'Erode,Erode,Fort,Erode,East'),(79,'Erode,Perundurai,Kanagapuram'),(80,'Erode,Erode,East'),(81,'Erode,Palayapalayam,Erode,Collectorate'),(82,'Erode,Erode,Collectorate'),(83,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(84,'Erode,Erode,Collectorate'),(85,'Erode,Erode,Fort,Erode,East'),(86,'Erode,Surampatti,Edayankattuvalsu'),(87,'Erode,Erode,East'),(88,'Erode,Amoor,Karungalpalayam'),(89,'Komarapalayam,Kallankattuvalasu'),(90,'Erode,Chikkaiah,Naicker,College'),(91,'Erode,Vallipurathanpalayam,Kanagapuram'),(92,'Erode,Chidambaram,Erode,East'),(93,'Erode,Pudur,Solar,Erode,Railway,Colony'),(94,'Erode,Arasampatti,Erode,Collectorate'),(95,'Erode,Moolapalayam,Erode,Railway,Colony'),(96,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(97,'Erode,Erode,Fort,Erode,Collectorate'),(98,'Erode,Surampatti,Veerappanchatram,Karungalpalayam'),(99,'Erode,Kollampalayam,Railway,Colony,Erode,Railway,Colony'),(100,'Erode,Muncipal,Colony,Veerappanchatram,Chikkaiah,Naicker,College'),(101,'Erode,Perundurai,Amoor,Erode,Collectorate'),(102,'Erode,Erode,East'),(103,'Erode,Erode,Collectorate'),(104,'Erode,Erode,Collectorate'),(105,'Vijayapuri,Kambiliyampatti'),(106,'Bhavani,Erode,Chittode,Chittode'),(107,'Erode,Kollampalayam,Arur,Karur,Erode,Railway,Colony'),(108,'Erode,Pudur,Peria,Agraharam'),(109,'Erode,Periyar,Nagar,Erode,East'),(110,'Erode,Perundurai,638060'),(111,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(112,'Erode,Muthugoundanpalayam,Elumathur'),(113,'Ingur,Chennimalai,Basuvapatti'),(114,'Erode,Erode,Fort,Erode,East'),(115,'Erode,Erode,Fort,Erode,East'),(116,'Coimbatore,Rathinapuri'),(117,'Erode,Kollampalayam,Erode,Railway,Colony'),(118,'Erode,Chettipalayam,Erode,Railway,Colony'),(119,'Erode,Ganapathy,Ganapathipalayam'),(120,'Erode,Karungalpalayam'),(121,'Erode,Erode,East'),(122,'Erode,Thindal,Thindal'),(123,'Erode,Erode,East'),(124,'Sathyamangalam,Aliyur,Kali,Kaliyur,Guthialathur'),(125,'Erode,Pallipalayam'),(126,'Erode,Erode,Fort,Erode,East'),(127,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(128,'Erode,Erode,Fort,Kavilipalayam'),(129,'Erode,Erode,Fort,Erode,East'),(130,'Bhavani,Erode,Chikkaiah,Naicker,College'),(131,'Erode,Erode,Fort,Erode,East'),(132,'Bhavani,Erode,Kavindapadi,Kalichettipalayam.,Mettupalayam'),(133,'Erode,Kanjikovil'),(134,'Erode,Karungalpalayam'),(135,'Erode,Erode,East'),(136,'Erode,Perundurai,Thindal'),(137,'Erode,Edayankattuvalsu'),(138,'Erode,Erode,Collectorate'),(139,'Erode,Karungalpalayam'),(140,'Erode,Karungalpalayam'),(141,'Erode,Erumapalayam,Kali,Kavindapadi,Vasavi,College'),(142,'Erode,Perundurai,Thindal,Thindal'),(143,'Erode,Kollampalayam,Erode,Railway,Colony'),(144,'Erode,Surampatti,Erode,East'),(145,'Erode,Erode,Fort,Erode,East'),(146,'Erode,Erode,Fort,Erode,East'),(147,'Chithode,Erode,Chittode'),(148,'Bhavani,Erode,Bhavani,Kudal'),(149,'Thindal,Thindal'),(150,'Erode,Moolapalayam,Erode,Railway,Colony'),(151,'Bhavani,Vasavi,College'),(152,'Erode,Palayapalayam,Thindal'),(153,'Erode,Vasavi,College'),(154,'Erode,Nadarmedu,Erode,Railway,Colony'),(155,'Erode,Arasampatti,Thindal'),(156,'Bhavani,Erode,Chikkaiah,Naicker,College'),(157,'Gandhipuram,Pallipalayam'),(158,'Chithode,Kanji,Chittode'),(159,'Erode,Karungalpalayam'),(160,'Erode,Erode,Railway,Colony'),(161,'Erode,Periyar,Nagar,Erode,East'),(162,'Erode,Surampatti,Edayankattuvalsu'),(163,'Erode,Nasiyanur,Anur,Arasampatti,Kadirampatti'),(164,'Erode,Perundurai,Thindal'),(165,'Solar,Arur,Karur,Erode,Railway,Colony'),(166,'Erode,Erode,East'),(167,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(168,'Erode,Komarapalayam,Karungalpalayam'),(169,'Bhavani,Kali,Bhavani,Kudal'),(170,'Tiruchengodu,North,Tiruchengodu,North'),(171,'Erode,Erode,East'),(172,'Moolapalayam,Erode,Railway,Colony'),(173,'Chithode,Chittode'),(174,'Erode,Perundurai,Vadamugam,Vellode,Ingur'),(175,'Erode,Erode,Collectorate'),(176,'Erode,Perundurai,Kali,Kalipalayam,Ingur'),(177,'Erode,Edayankattuvalsu'),(178,'Erode,Karungalpalayam'),(179,'Erode,Chikkaiah,Naicker,College'),(180,'Erode,Moolapalayam,Erode,Railway,Colony'),(181,'Erode,Erode,East'),(182,'Erode,Chikkaiah,Naicker,College'),(183,'Erode,Nadarmedu,Erode,Railway,Colony'),(184,'Erode,Marapalam,Erode,East'),(185,'Avalpoondurai,Erode,Dharapuram,Avalpundurai'),(186,'Erode,Chikkaiah,Naicker,College'),(187,'Erode,Chennimalai,Kanagapuram'),(188,'Erode,Solar,Erode,Railway,Colony'),(189,'Erode,Edayankattuvalsu'),(190,'Erode,Thindal'),(191,'Erode,Chettipalayam,Erode,Railway,Colony'),(192,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(193,'Erode,Chidambaram,Erode,East'),(194,'Erode,Chittode'),(195,'Pappampalayam,Pappampalayam'),(196,'Erode,Vasavi,College'),(197,'Erode,Soolai,Chennai,Chikkaiah,Naicker,College'),(198,'Erode,Chikkaiah,Naicker,College'),(199,'Erode,Periyar,Nagar,Karungalpalayam'),(200,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(201,'Erode,Chikkaiah,Naicker,College'),(202,'Erode,Erode,East'),(203,'Erode,Surampatti,Edayankattuvalsu'),(204,'Erode,Perundurai,Kadirampatti'),(205,'Erode,Erode,Fort,Erode,East'),(206,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(207,'Veerappanchatram,Chikkaiah,Naicker,College'),(208,'Erode,Railway,Colony,Erode,Railway,Colony'),(209,'Bhavani,Veerappanchatram,Chikkaiah,Naicker,College'),(210,'Perundurai,Kadirampatti'),(211,'Erode,Kollampalayam,Railway,Colony,Erode,Railway,Colony'),(212,'Erode,Chittode'),(213,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(214,'Kurichi,Modakurichi,Nanjaiuthukuli,Elumathur'),(215,'Kokkarayanpettai,Pappampalayam'),(216,'Erode,Chettipalayam,Erode,Railway,Colony'),(217,'Bhavani,Erode,Peria,Agraharam'),(218,'Bhavani,Bhavani,Kudal'),(219,'Akkaraipatti,Akkaraipatti'),(220,'Surampatti,Edayankattuvalsu'),(221,'Erode,Erode,Collectorate'),(222,'Erode,Kasipalayam,Edayankattuvalsu'),(223,'Erode,Soolai,Chikkaiah,Naicker,College'),(224,'Erode,Thindal,Thindal'),(225,'Erode,Pallipalayam'),(226,'Erode,Perundurai,Thindal'),(227,'Erode,Chikkaiah,Naicker,College'),(228,'Erode,Karungalpalayam'),(229,'Erode,Rangampalayam,Edayankattuvalsu'),(230,'Erode,Chettipalayam,Erode,Railway,Colony'),(231,'Erode,Erode,Railway,Colony'),(232,'Erode,Chikkaiah,Naicker,College'),(233,'Erode,Erode,Fort,Erode,East'),(234,'Bhavani,Erode,Peria,Agraharam'),(235,'Erode,Periyar,Nagar,Erode,East'),(236,'Erode,Chettipalayam,Erode,Railway,Colony'),(237,'Erode,Surampatti,Edayankattuvalsu'),(238,'Erode,Pallipalayam'),(239,'Erode,Chikkaiah,Naicker,College'),(240,'Erode,Chikkaiah,Naicker,College'),(241,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(242,'Erode,Muncipal,Colony,Veerappanchatram,Chikkaiah,Naicker,College'),(243,'Bhavani,Erode,Chikkaiah,Naicker,College'),(244,'Erode,Erode,Collectorate'),(245,'Erode,Karungalpalayam'),(246,'Erode,Ayal,Chidambaram,Erode,East'),(247,'Erode,Erode,Collectorate'),(248,'Erode,Periya,Valasu,Chikkaiah,Naicker,College'),(249,'Erode,Erode,Fort,Erode,East'),(250,'Arachalur,Erode,Arachalur'),(251,'Erode,Karungalpalayam'),(252,'Erode,Periyar,Nagar,Erode,East'),(253,'Erode,Erode,East'),(254,'Erumapalayam,Koottapalli'),(255,'Erode,Nadarmedu,Erode,Railway,Colony'),(256,'Nallur,Allur,Karunampathi'),(257,'Erode,Erode,East'),(258,'Erode,Chittode'),(259,'Erode,Moolapalayam,Bannari,Erode,Railway,Colony'),(260,'Erode,Erode,Collectorate'),(261,'Erode,Arur,Karur,Erode,Railway,Colony'),(262,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(263,'Seerampalayam,Seerampalayam'),(264,'Erode,Teachers,Colony,Erode,Collectorate'),(265,'Bhavani,Erode,Pudur,Peria,Agraharam'),(266,'Erode,Rangampalayam,Edayankattuvalsu'),(267,'Erode,Chettipalayam,Erode,Railway,Colony'),(268,'Erode,Palayapalayam,Erode,Collectorate'),(269,'Erode,Erode,East'),(270,'Erode,Karungalpalayam'),(271,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(272,'Erode,Perundurai,Erode,Collectorate'),(273,'Erode,Erode,Collectorate'),(274,'Bhavani,Vasavi,College'),(275,'Erode,Erode,Railway,Colony'),(276,'Bhavani,Erode,Bhavani,Kudal'),(277,'Karamadai,Belladi'),(278,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(279,'Arasampatti,Kadirampatti'),(280,'Kokkarayanpettai,Pappampalayam'),(281,'Arachalur,Erode,Dharapuram,Arachalur'),(282,'Erode,Chikkaiah,Naicker,College'),(283,'Thuduppathi,Karai,Palakarai'),(284,'Bhavani,Erode,Mettunasuvanpalayam,Kali,Vasavi,College'),(285,'Erode,Perundurai,Erode,Collectorate'),(286,'Erode,Thindal'),(287,'Erode,Rangampalayam,Edayankattuvalsu'),(288,'Erode,Erode,East'),(289,'Erode,Chettipalayam,Erode,Railway,Colony'),(290,'Erode,Thindal,Thindal'),(291,'Erode,Erode,Fort,Erode,East'),(292,'Erode,Soolai,Chikkaiah,Naicker,College'),(293,'Erode,Railway,Colony,Erode,Railway,Colony'),(294,'Erode,Gobichettipalayam'),(295,'Erode,Kavandapadi,Kalichettipalayam.,Mettupalayam'),(296,'Erode,Moolapalayam,Arur,Karur,Erode,Railway,Colony'),(297,'Kanjikovil,Kanjikovil'),(298,'Erode,Arungal,Karungalpalayam'),(299,'Erode,Perundurai,Erode,Collectorate'),(300,'Erode,Teachers,Colony,Erode,Collectorate'),(301,'Karukkampalayam,Karukkampalayam'),(302,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(303,'Erode,Railway,Colony,Erode,Railway,Colony'),(304,'Erode,Erode,Fort,Erode,Collectorate'),(305,'Chithode,Erode,Soolai,Chikkaiah,Naicker,College'),(306,'Erode,Perundurai,Thindal,Thindal'),(307,'Erode,Erode,Fort,Erode,East'),(308,'Erode,Sampath,Nagar,Erode,Collectorate'),(309,'Erode,Erode,East'),(310,'Erode,Karungalpalayam,Amoor,Arungal,Karungalpalayam'),(311,'Erode,Chikkaiah,Naicker,College'),(312,'Erode,Perundurai,Thindal,Thindal'),(313,'Erode,Perundurai,Thindal,Thindal'),(314,'Erode,Karungalpalayam'),(315,'Erode,Erode,East'),(316,'Erode,Rangampalayam,Edayankattuvalsu'),(317,'Erode,Erode,Fort,Karungalpalayam'),(318,'Erode,Karungalpalayam'),(319,'Erode,Uppupalayam'),(320,'Erode,Marapalam,Erode,East'),(321,'Erode,Erode,Railway,Colony'),(322,'Erode,Palayapalayam,Teachers,Colony,Erode,Collectorate'),(323,'Anthiyur,Erode,Guruvareddiyur'),(324,'Alampalayam,Spb,Colony'),(325,'Erode,Veerappanchatram,Athur,Erode,Collectorate'),(326,'Erode,Periyar,Nagar,Erode,East'),(327,'Erode,Chikkaiah,Naicker,College'),(328,'Erode,Kollampalayam,Erode,Railway,Colony'),(329,'Erode,Chikkaiah,Naicker,College'),(330,'Erode,Erode,Collectorate'),(331,'Dharmapuri,Public,Offices,Dharmapuri,Public,Offices'),(332,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(333,'Erode,Thindal'),(334,'Erode,Pungampadi,Kanagapuram'),(335,'Erode,Erode,Collectorate'),(336,'Erode,Thindal,Thindal'),(337,'Erode,Kodumudi,Arur,Karur,Thamaraipalayam'),(338,'Erode,Erode,Collectorate'),(339,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(340,'Erode,Periyar,Nagar,Erode,East'),(341,'Erode,Perundurai,Teachers,Colony,Thindal,Erode,Collectorate'),(342,'Erode,Kali,Edayankattuvalsu'),(343,'Erode,Karungalpalayam'),(344,'Erode,Surampatti,Erode,East'),(345,'Erode,Palayapalayam,Thindal'),(346,'Erode,Chennimalai,Erode,Railway,Colony'),(347,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(348,'Erode,Chikkaiah,Naicker,College'),(349,'Erode,Thindal,Thindal'),(350,'Erode,Moolapalayam,Erode,Railway,Colony'),(351,'Erode,Palayapalayam,Teachers,Colony,Erode,Collectorate'),(352,'Erode,Thirunagar,Colony,Karungalpalayam'),(353,'Erode,Erode,Collectorate'),(354,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(355,'Erode,Chikkaiah,Naicker,College'),(356,'Perundurai,Ingur'),(357,'Erode,Thirunagar,Colony,Karungalpalayam'),(358,'Erode,Erode,Railway,Colony'),(359,'Erode,Kollampalayam,Erode,Railway,Colony'),(360,'Komarapalayam,Kallankattuvalasu'),(361,'Erode,Kadirampatti'),(362,'Erode,Erode,Fort,Erode,East'),(363,'Erode,Perundurai,Ingur'),(364,'Erode,Soolai,Chikkaiah,Naicker,College'),(365,'Erode,Periyar,Nagar,Erode,East'),(366,'Erode,Ellapalayam,Chikkaiah,Naicker,College'),(367,'Bhavani,Erode,Peria,Agraharam'),(368,'Erode,Teachers,Colony,Erode,Collectorate'),(369,'Erode,Soolai,Chikkaiah,Naicker,College'),(370,'Moolapalayam,Erode,Railway,Colony'),(371,'Bhavani,Kavindapadi,Vasavi,College'),(372,'Erode,Arasampatti,Kadirampatti'),(373,'Erode,Erode,Fort,Karungalpalayam'),(374,'Erode,Chikkaiah,Naicker,College'),(375,'Erode,Periyar,Nagar,Erode,East'),(376,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(377,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(378,'Erode,Erode,East'),(379,'Erode,Arur,Karur,Erode,Railway,Colony'),(380,'Erode,Palayapalayam,Erode,Collectorate'),(381,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(382,'Erode,Erode,Fort,Erode,East'),(383,'Erode,Erode,East'),(384,'Erode,Erode,East'),(385,'Erode,Moolapalayam,Erode,Railway,Colony'),(386,'Erode,Allikuttai'),(387,'Erode,Erode,Fort,Erode,East'),(388,'Erode,Kollampalayam,Erode,Railway,Colony'),(389,'Erode,Nadarmedu,Erode,Railway,Colony'),(390,'Erode,Soolai,Emur,Chikkaiah,Naicker,College'),(391,'Komarapalayam,Kallankattuvalasu'),(392,'Erode,Thindal,Thindal'),(393,'Erode,Surampatti,Edayankattuvalsu'),(394,'Erode,Pallipalayam'),(395,'Erode,Manickampalayam,Chikkaiah,Naicker,College'),(396,'Agraharam,Erode,Peria,Agraharam'),(397,'Mettunasuvanpalayam,Bhavani,Kudal'),(398,'Erode,Periyar,Nagar,Erode,East'),(399,'Erode,Pudur,Erode,Railway,Colony'),(400,'Erode,Erode,Fort,Erode,Collectorate'),(401,'Sivagiri,Ammankoil'),(402,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(403,'Erode,Perundurai,Kanji,Kavindapadi,Kanjikovil'),(404,'Erode,Erode,Fort,Erode,East'),(405,'Avalpoondurai,Erode,Moolapalayam,Erode,Railway,Colony'),(406,'Ottapparai,Chennimalai,Kangayam,Basuvapatti'),(407,'Erode,Erode,Fort,Erode,East'),(408,'Avalpoondurai,Avalpundurai'),(409,'Erode,Rangampalayam,Chennimalai,Edayankattuvalsu'),(410,'Bhavani,Erode,Peria,Agraharam'),(411,'Gobichettipalayam,Chettipalayam,Cuddalore,Kadukkampalayam'),(412,'Erode,Erode,East'),(413,'Erode,Karungalpalayam'),(414,'Erode,Erode,East'),(415,'Kavundachipalayam,Vallipurathanpalayam,Kanagapuram'),(416,'Erode,Erode,Collectorate'),(417,'Kallankattuvalasu,Kallankattuvalasu'),(418,'Erode,Edayankattuvalsu'),(419,'Erode,Erode,Railway,Colony'),(420,'Coimbatore,Gandhipuram,Gandhipuram,(Coimbatore)'),(421,'Erode,Periya,Valasu,Veerappanchatram,Chikkaiah,Naicker,College'),(422,'Agraharam,Bhavani,Erode,Peria,Agraharam'),(423,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(424,'Veerappanchatram,Chikkaiah,Naicker,College'),(425,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(426,'Erode,Erode,Collectorate'),(427,'Erode,Perundurai,Thindal,Thindal'),(428,'Erode,Erode,East'),(429,'Erode,Vairapalayam,Karungalpalayam'),(430,'Erode,Vairapalayam,Karungalpalayam'),(431,'Chithode,Kanji,Kanjikovil,Chittode'),(432,'Erode,Emur,Chikkaiah,Naicker,College'),(433,'Erode,Karungalpalayam'),(434,'Erode,Tiruchengodu,North'),(435,'Erode,Erode,East'),(436,'Erode,Arur,Karur,Erode,Railway,Colony'),(437,'Erode,Thindal'),(438,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(439,'Erode,Perundurai,Erode,Collectorate'),(440,'Erode,Surampatti,Edayankattuvalsu'),(441,'Erode,Erode,Fort,Erode,East'),(442,'Erode,Erode,Fort,Erode,East'),(443,'Erode,Chettipalayam,Erode,Railway,Colony'),(444,'Solar,Erode,Railway,Colony'),(445,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(446,'Erode,Perundurai,Erode,Collectorate'),(447,'Erode,Erode,Collectorate'),(448,'Erode,Erode,East'),(449,'Erode,Edayankattuvalsu'),(450,'Erode,Erode,East'),(451,'Erode,Kanji,Kanjikovil,Chittode'),(452,'Erode,Kathirampatti,Perundurai,Thindal,Kadirampatti'),(453,'Erode,Koottapalli'),(454,'63,Velampalayam,63,Velampalayam'),(455,'Erode,Moolapalayam,Arur,Karur,Erode,Railway,Colony'),(456,'Erode,Periyar,Nagar,Erode,East'),(457,'Erode,Chikkaiah,Naicker,College'),(458,'Erode,Erode,East'),(459,'Erode,Erode,East'),(460,'Erode,Edayankattuvalsu'),(461,'Erode,Sathyamangalam,Kavilipalayam'),(462,'Erode,Edayankattuvalsu'),(463,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(464,'Erode,Teachers,Colony,Erode,Collectorate'),(465,'Erode,Perundurai,Thindal'),(466,'Erode,Perundurai,Erode,Collectorate'),(467,'Kondalam,Dasanaickenpatti'),(468,'Erode,Erode,Collectorate'),(469,'Erode,Perundurai,Erode,Collectorate'),(470,'Erode,Karungalpalayam'),(471,'Erode,Nadarmedu,Erode,Railway,Colony'),(472,'Erode,Erode,Fort,Erode,East'),(473,'Erode,Chidambaram,Edayankattuvalsu'),(474,'Erode,Edayankattuvalsu'),(475,'Erode,Arimalam,Erode,Collectorate'),(476,'Erode,Erode,East'),(477,'Bhavani,Erode,Chikkaiah,Naicker,College'),(478,'Erode,Sampath,Nagar,Erode,Collectorate'),(479,'Perundurai,Thindal,Thindal'),(480,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(481,'Erode,Erode,East'),(482,'Chithode,Chittode'),(483,'Erode,Perundurai,Erode,Collectorate'),(484,'Erode,Thindal,Thindal'),(485,'Erode,Surampatti,Erode,East'),(486,'Erode,Erode,East'),(487,'Erode,Surampatti,Erode,East'),(488,'Agraharam,Bhavani,Erode,Peria,Agraharam'),(489,'Erode,Periya,Valasu,Veerappanchatram,Chikkaiah,Naicker,College'),(490,'Perundurai,Coimbatore,Ingur'),(491,'Erode,Surampatti,Erode,East'),(492,'Erode,Marapalam,Erode,East'),(493,'Kadirampatti,Kadirampatti'),(494,'Erode,Karungalpalayam'),(495,'Erode,Vairapalayam,Karungalpalayam'),(496,'Chromepet,Chennai,Bharathipuram,(Kanchipuram)'),(497,'Erode,Sampath,Nagar,Erode,Collectorate'),(498,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(499,'Erode,Chikkaiah,Naicker,College'),(500,'Erode,Collectorate,Erode,Collectorate'),(501,'Erode,Karungalpalayam'),(502,'Erode,Soolai,Chikkaiah,Naicker,College'),(503,'Erode,Komarapalayam,Seerampalayam'),(504,'Erode,Erode,Collectorate'),(505,'Erode,Perundurai,Thindal,Thindal'),(506,'Erode,Thindal,Thindal'),(507,'Erode,Perundurai,Erode,Collectorate'),(508,'Erode,Ellapalayam,Chikkaiah,Naicker,College'),(509,'Bhavani,Erode,Chikkaiah,Naicker,College'),(510,'Erode,Erode,Fort,Erode,East'),(511,'Erode,Karungalpalayam'),(512,'Erode,Edayankattuvalsu'),(513,'Komarapalayam,Kallankattuvalasu'),(514,'Erode,Thindal,Thindal'),(515,'Sampath,Nagar,Chikkaiah,Naicker,College'),(516,'Choolaimedu,Chennai,Choolaimedu'),(517,'Erode,Erode,Collectorate'),(518,'Erode,Edayankattuvalsu'),(519,'Erode,Chikkaiah,Naicker,College'),(520,'Erode,Chikkaiah,Naicker,College'),(521,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(522,'Erode,Kathirampatti,Perundurai,Kadirampatti'),(523,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(524,'Marapalam,Erode,East'),(525,'Erode,Muncipal,Colony,Karungalpalayam'),(526,'Bhavani,Elavamalai,Erode,Vasavi,College'),(527,'Erode,Surampatti,Chennimalai,Erode,East'),(528,'Komarapalayam,Kallankattuvalasu'),(529,'Erode,Moolapalayam,Chettipalayam,Erode,Railway,Colony'),(530,'Erode,Peria,Agraharam'),(531,'Erode,Karungalpalayam'),(532,'Erode,Erode,East'),(533,'Erode,Perundurai,Erode,Collectorate'),(534,'Erode,Perundurai,Erode,Collectorate'),(535,'Erode,Erode,Collectorate'),(536,'Erode,Chidambaram,Erode,East'),(537,'Erode,Kathirampatti,Perundurai,Kadirampatti'),(538,'Erode,Thindal'),(539,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(540,'Erode,Perundurai,Erode,Collectorate'),(541,'Erode,Surampatti,Edayankattuvalsu'),(542,'Erode,Palayapalayam,Perundurai,Thindal'),(543,'Erode,Erode,Collectorate'),(544,'Erode,Perundurai,Thindal,Thindal'),(545,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(546,'Erode,Kali,Erode,East'),(547,'Erode,Thirunagar,Colony,Karungalpalayam'),(548,'Erode,Erode,Collectorate'),(549,'63,Velampalayam,63,Velampalayam'),(550,'Erode,Thindal'),(551,'Erode,Erode,Collectorate'),(552,'Erode,Thindal'),(553,'Erode,Moolapalayam,Erode,Railway,Colony'),(554,'Erode,Teachers,Colony,Erode,Collectorate'),(555,'Erode,Erode,East'),(556,'Erode,Kollampalayam,Erode,Railway,Colony'),(557,'Erode,Arasampatti,Kaikatti,Kadirampatti'),(558,'Erode,Surampatti,Edayankattuvalsu'),(559,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(560,'Erode,Perundurai,Erode,Collectorate'),(561,'Erode,Perundurai,Thindal'),(562,'Erode,Perundurai,Thindal'),(563,'Agraharam,Bhavani,Erode,Peria,Agraharam'),(564,'Erode,Thindal'),(565,'Erode,Peria,Agraharam'),(566,'Pudur,Namakkal,Bazaar'),(567,'Erode,Muncipal,Colony,Arimalam,Erode,Collectorate'),(568,'Ganesapuram,Namakkal,Bazaar'),(569,'Karungalpalayam,Karungalpalayam'),(570,'Bhavani,Erode,Bhavani,Kudal'),(571,'Erode,Moolapalayam,Railway,Colony,Erode,Railway,Colony'),(572,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(573,'Erode,Erode,East'),(574,'Erode,Erode,Railway,Colony'),(575,'Veerappanchatram,Erode,Collectorate'),(576,'Erode,Gobichettipalayam,Kullampalayam,Nathipalayam,Athipalayam,Chettipalayam,Kadukkampalayam'),(577,'Erode,Muncipal,Colony,Kavilipalayam'),(578,'Erode,Perundurai,Athur,Ingur'),(579,'Erode,Erode,Fort,Erode,East'),(580,'Erode,Thirunagar,Colony,Karungalpalayam'),(581,'Erode,Chikkaiah,Naicker,College'),(582,'Erode,Edayankattuvalsu'),(583,'Erode,Erode,Fort,Erode,East'),(584,'Erode,Komarapalayam,Chinnagoundanur'),(585,'Erode,Erode,Fort,Erode,Collectorate'),(586,'Erode,Thirunagar,Colony,Erode,East'),(587,'Erode,Erode,East'),(588,'Erode,Edayankattuvalsu'),(589,'Erode,Erode,Collectorate'),(590,'Jawahar,Mills,Jawahar,Mills'),(591,'Perundurai,Ingur'),(592,'Erode,Erode,Fort,Karungalpalayam'),(593,'Erode,Moolapalayam,Erode,Railway,Colony'),(594,'Morur,Morur'),(595,'Erode,Chidambaram,Erode,East'),(596,'Erode,Perundurai,Erode,Collectorate'),(597,'Erode,Kollampalayam,Moolapalayam,Perundurai,Ingur'),(598,'Erode,Erode,Railway,Colony'),(599,'Erode,Erode,East'),(600,'Erode,Periyar,Nagar,Chidambaram,Erode,East'),(601,'Erode,Erode,East'),(602,'Erode,Arur,Bannari,Karur,Erode,Railway,Colony'),(603,'Erode,Moolapalayam,Erode,Railway,Colony'),(604,'Erode,Perundurai,Erode,Collectorate'),(605,'Kallankattuvalasu,Kallankattuvalasu'),(606,'Erode,Erode,East'),(607,'Erode,Rangampalayam,Edayankattuvalsu'),(608,'Erode,Moolapalayam,Erode,Railway,Colony'),(609,'Erode,Surampatti,Edayankattuvalsu'),(610,'Erode,Erode,East'),(611,'Erode,Karungalpalayam'),(612,'Erode,Chikkaiah,Naicker,College'),(613,'Erode,Kanagapuram'),(614,'Erode,Thindal,Thindal'),(615,'Erode,Erode,Collectorate'),(616,'Coimbatore,P&T,Staff,Quarters'),(617,'Erode,Erode,East'),(618,'Erode,Avalpundurai'),(619,'Erode,Narayana,Valasu,Erode,Collectorate'),(620,'Bhavani,Kali,Bhavani,Kudal'),(621,'Erode,Soolai,Karungalpalayam'),(622,'Ambattur,Attur,Chennai,Ambattur,Indl,Estate'),(623,'Erode,Chikkaiah,Naicker,College'),(624,'Erode,Marapalam,Karungalpalayam'),(625,'Erode,Perundurai,Ingur'),(626,'Erode,Railway,Colony,Erode,Railway,Colony'),(627,'Pallipalayam,Pallipalayam'),(628,'Erode,Vasavi,College'),(629,'Erode,Moolapalayam,Erode,Railway,Colony'),(630,'Erode,Chikkaiah,Naicker,College'),(631,'Erode,Nasiyanur,Annur,Anur,Avalpundurai'),(632,'Erode,Thindal'),(633,'Erode,Erode,Fort,Erode,East'),(634,'Erode,Chidambaram,Erode,East'),(635,'Erode,Muncipal,Colony,Veerappanchatram,Chikkaiah,Naicker,College'),(636,'Erode,Chikkaiah,Naicker,College'),(637,'Erode,Nadarmedu,Erode,Railway,Colony'),(638,'Erode,Chennimalai,Edayankattuvalsu'),(639,'Erode,Erode,East'),(640,'Bhavani,Ayal,Bhavani,Kudal'),(641,'Gobichettipalayam,Chettipalayam,Kadukkampalayam'),(642,'Erode,Nasiyanur,Anur,Thindal'),(643,'Gangapuram,Chikkaiah,Naicker,College'),(644,'Erode,Nadarmedu,Kali,Erode,Railway,Colony'),(645,'Erode,Thirunagar,Colony,Karungalpalayam'),(646,'Erode,Nasiyanur,Anur,Thindal'),(647,'Erode,Erode,Fort,Erode,East'),(648,'Erode,Thindal,Thindal'),(649,'Erode,Erode,East'),(650,'Erode,Soolai,Chikkaiah,Naicker,College'),(651,'Edayankattuvalsu,Edayankattuvalsu'),(652,'Erode,Perundurai,Erode,Collectorate'),(653,'Erode,Thirunagar,Colony,Karungalpalayam'),(654,'Erode,Edayankattuvalsu'),(655,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(656,'Erode,Chikkaiah,Naicker,College'),(657,'Erode,Erode,East'),(658,'Erode,Chettipalayam,Erode,Railway,Colony'),(659,'Erode,Perundurai,Erode,Collectorate'),(660,'Erode,Perundurai,Erode,Collectorate'),(661,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(662,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(663,'Erode,Karungalpalayam'),(664,'Erode,Edayankattuvalsu'),(665,'Erode,Punjai,Kalamangalam,Arur,Karur,Kolanalli'),(666,'Erode,Nadarmedu,Erode,Railway,Colony'),(667,'Erode,Edayankattuvalsu'),(668,'Erode,Karungalpalayam'),(669,'Erode,Perundurai,Erode,Collectorate'),(670,'Erode,Perundurai,Erode,Collectorate'),(671,'Perundurai,Vijayapuri,Kambiliyampatti'),(672,'Veerappanchatram,Chikkaiah,Naicker,College'),(673,'Erode,Erode,Collectorate'),(674,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(675,'Kuruppanaickenpalayam,Bhavani,Kudal'),(676,'Erode,Veerappanchatram,Voc,Park,Karungalpalayam'),(677,'Erode,Kollampalayam,Erode,Railway,Colony'),(678,'Erode,Rangampalayam,Erode,Railway,Colony'),(679,'Erode,Erode,Fort,Erode,East'),(680,'Erode,Erode,Collectorate'),(681,'Erode,Erode,East'),(682,'Erode,Chidambaram,Erode,Collectorate'),(683,'Erode,Erode,Fort,Erode,East'),(684,'Erode,Rangampalayam,Edayankattuvalsu'),(685,'Erode,Chikkaiah,Naicker,College'),(686,'Avalpoondurai,Erode,Kaspapettai,Avalpundurai'),(687,'Erode,Thindal,Arimalam,Thindal'),(688,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(689,'Erode,Moolapalayam,Erode,Railway,Colony'),(690,'Kollampalayam,Erode,Railway,Colony'),(691,'Agraharam,Erode,Athipalayam,Seerampalayam'),(692,'Erode,Arur,Karur,Erode,Railway,Colony'),(693,'Erode,Kavundachipalayam,Kanagapuram'),(694,'Erode,Arur,Karur,Erode,Railway,Colony'),(695,'Erode,Perundurai,Erode,Collectorate'),(696,'Erode,Moolapalayam,Erode,Railway,Colony'),(697,'Kaspapettai,Avalpundurai'),(698,'Erode,Karungalpalayam'),(699,'Thindal,Thindal'),(700,'Erode,Arasampatti,Erode,Collectorate'),(701,'Erode,Erode,Fort,Erode,East'),(702,'Erode,Perundurai,Erode,Collectorate'),(703,'Ammapettai,Anthiyur,Ammapet,Kannadipalayam'),(704,'Erode,Surampatti,Erode,East'),(705,'Erode,Surampatti,Edayankattuvalsu'),(706,'Bhavani,Erode,Vasavi,College'),(707,'Erode,Marapalam,Karungalpalayam'),(708,'Erode,Pudur,Solar,Erode,Railway,Colony'),(709,'Morur,Morur'),(710,'Erode,Erode,Collectorate'),(711,'Erode,Karungalpalayam'),(712,'Bhavani,Perundurai,Ingur'),(713,'Erode,Erode,Fort,Erode,East'),(714,'Erode,Chikkaiah,Naicker,College'),(715,'Erode,Karungalpalayam'),(716,'Erode,Periyar,Nagar,Erode,East'),(717,'Erode,Moolapalayam,Erode,Railway,Colony'),(718,'Erode,Moolapalayam,Erode,Railway,Colony'),(719,'Kalpalayam,Erode,Railway,Colony'),(720,'Erode,Erode,East'),(721,'Dharapuram,Iruppu,Karuvampalayam'),(722,'Erode,Thindal,Thindal'),(723,'Erode,Erode,Fort,Erode,East'),(724,'Erode,Teachers,Colony,Erode,Collectorate'),(725,'Erode,Erode,Fort,Karungalpalayam'),(726,'Erode,Teachers,Colony,Erode,Collectorate'),(727,'Erode,Araipalayam,Thamaraipalayam'),(728,'Erode,Thindal,Thindal'),(729,'Thottipalayam,Chinniyampalayam,Coimbatore,Coimbatore,Tidel,Park'),(730,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(731,'Araipalayam,Thamaraipalayam'),(732,'Alapuram,Coimbatore,Gopalapuram,Cbe,Mpl.Central,Busstand'),(733,'Erode,Erode,Collectorate'),(734,'Erode,Kollampalayam,Arur,Karur,Erode,Railway,Colony'),(735,'Solar,Arur,Karur,Erode,Railway,Colony'),(736,'Erode,Arasampatti,Kadirampatti'),(737,'Erode,Erode,East'),(738,'Erode,Arur,Karur,Elumathur'),(739,'Erode,Sampath,Nagar,Kali,Erode,Collectorate'),(740,'Erode,Erode,East'),(741,'Bhavani,Erode,Anur,Kalichettipalayam.,Mettupalayam'),(742,'Singampettai,Kali,Ammapettai'),(743,'Erode,Thindal,Thindal'),(744,'Erode,Muncipal,Colony,Veerappanchatram,Karungalpalayam'),(745,'Erode,Thindal'),(746,'Erode,Erode,Collectorate'),(747,'Perundurai,Kambiliyampatti'),(748,'Erode,Teachers,Colony,Erode,Collectorate'),(749,'Erode,Thindal'),(750,'Erode,Edayankattuvalsu'),(751,'Erode,Thindal,Thindal'),(752,'Erode,Erode,East'),(753,'Erode,Palayapalayam,Perundurai,Teachers,Colony,Erode,Collectorate'),(754,'Erode,Thindal,Thindal'),(755,'Thindal,Kanagapuram'),(756,'Erode,Thindal'),(757,'Perundurai,Thindal,Kanagapuram'),(758,'Perundurai,Ingur'),(759,'Erode,Perundurai,Thindal,Thindal'),(760,'Erode,Anur,Thindal'),(761,'Erode,Surampatti,Veerappanchatram,Chikkaiah,Naicker,College'),(762,'Perundurai,Ingur'),(763,'Ayyanthirumaligai,Ayyanthirumaligai'),(764,'Erode,Thindal,Thindal'),(765,'Pallipalayam,Pallipalayam'),(766,'Erode,Thindal,Thindal'),(767,'Bhavani,Erode,Peria,Agraharam'),(768,'Erode,Ingur'),(769,'Erode,Edayankattuvalsu'),(770,'Erode,Karungalpalayam'),(771,'Erode,Perundurai,Thindal,Thindal'),(772,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(773,'Erode,Vadamugam,Vellode,Kanagapuram'),(774,'Erode,Chennimalai,Erode,East'),(775,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(776,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(777,'Agraharam,Erode,Chikkaiah,Naicker,College'),(778,'Erode,Edayankattuvalsu'),(779,'Erode,Chikkaiah,Naicker,College'),(780,'Erode,Palayapalayam,Edayankattuvalsu'),(781,'Erode,Erode,Fort,Erode,East'),(782,'Erode,Pallipalayam'),(783,'Erode,Kollampalayam,Erode,Railway,Colony'),(784,'Clock,Tower,(Tiruchirappalli),Clock,Tower,(Tiruchirappalli)'),(785,'Erode,Erode,East'),(786,'Erode,Surampatti,Edayankattuvalsu'),(787,'Arachalur,Erode,Pudur,Chennimalai,Basuvapatti'),(788,'Erode,Erode,East'),(789,'Erode,Chikkaiah,Naicker,College'),(790,'Erode,Perundurai,Erode,Collectorate'),(791,'Erode,Erode,Railway,Colony'),(792,'Erode,Erode,East'),(793,'Erode,Karungalpalayam'),(794,'Erode,Chennimalai,Edayankattuvalsu'),(795,'Erode,Edayankattuvalsu'),(796,'Erode,Seerampalayam'),(797,'Erode,Kurichi,Modakurichi,Edayankattuvalsu'),(798,'Erode,Nasiyanur,Anur,Karamadai,Kadirampatti'),(799,'Kollampalayam,Moolapalayam,Nadarmedu,Arur,Karur,Erode,Railway,Colony'),(800,'Erode,Erode,East'),(801,'Erode,Palayapalayam,Erode,Collectorate'),(802,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(803,'Seerampalayam,Seerampalayam'),(804,'Arachalur,Avalpoondurai,Erode,Avalpundurai'),(805,'Erode,Chikkaiah,Naicker,College'),(806,'Edayankattuvalsu,Edayankattuvalsu'),(807,'Erode,Elumathur'),(808,'Erode,Erode,Fort,Erode,East'),(809,'Erode,Palayapalayam,Perundurai,Thindal'),(810,'Erode,Perundurai,Ingur'),(811,'Erode,Moolapalayam,Erode,Railway,Colony'),(812,'Erode,Thindal,Thindal'),(813,'Erode,Nochikuttai,Vasavi,College'),(814,'Erode,Karungalpalayam'),(815,'Erode,Kasipalayam,Edayankattuvalsu'),(816,'Emur,Chikkaiah,Naicker,College'),(817,'Chithode,Erode,Chittode'),(818,'Erode,Erode,Fort,Erode,East'),(819,'Dharmapuri,Chettipatti'),(820,'Erode,Erode,Collectorate'),(821,'Erode,Periyar,Nagar,Erode,East'),(822,'Erode,Erode,Fort,Erode,East'),(823,'Erode,Eral,Edayankattuvalsu'),(824,'Erode,Chikkaiah,Naicker,College'),(825,'Karungalpalayam,Thirunagar,Colony,Arungal,Karungalpalayam'),(826,'Erode,Erode,Fort,Erode,East'),(827,'Erode,Chikkaiah,Naicker,College'),(828,'Erode,Kasipalayam,Edayankattuvalsu'),(829,'Erode,Erode,Collectorate'),(830,'Erode,Vadamugam,Vellode,Chennimalai,Kanagapuram'),(831,'Erode,Perundurai,Ingur'),(832,'Erode,Thindal'),(833,'Erode,Perundurai,Erode,Collectorate'),(834,'Erode,Erode,Fort,Erode,East'),(835,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(836,'Erode,Ganapathi,Nagar,Thindal'),(837,'Erode,Pallipalayam'),(838,'Kurichi,Modakurichi,Elumathur'),(839,'Erode,Moolapalayam,Arur,Karur,Erode,Railway,Colony'),(840,'Erode,Chidambaram,Erode,East'),(841,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(842,'Erode,Kasipalayam,Chennimalai,Edayankattuvalsu'),(843,'Kondalam,Alampatti,Kondalampatti'),(844,'Agraharam,Nallur,Singanallur,Allur,Singanallur'),(845,'Erode,Gobichettipalayam,Kullampalayam,Chettipalayam,Kadukkampalayam'),(846,'Erode,Erode,Collectorate'),(847,'Erode,Erode,Collectorate'),(848,'Karungalpalayam,Arungal,Karungalpalayam'),(849,'Erode,Rangampalayam,Chennimalai,Edayankattuvalsu'),(850,'Erode,Kadirampatti'),(851,'Erode,Erode,Collectorate'),(852,'Erode,Erode,East'),(853,'Bhavani,Komarapalayam,Jambai,Kallankattuvalasu'),(854,'Erode,Surampatti,Thindal,Thindal'),(855,'Erode,Perundurai,Eral,Edayankattuvalsu'),(856,'Erode,Chidambaram,Erode,East'),(857,'Erode,Erode,East'),(858,'Erode,Muncipal,Colony,Veerappanchatram,Chikkaiah,Naicker,College'),(859,'Erode,Thindal'),(860,'Erode,Edayankattuvalsu'),(861,'Erode,Erode,Fort,Erode,East'),(862,'Erode,Erode,East'),(863,'Erode,Periyar,Nagar,Erode,East'),(864,'Agraharam,Erode,Erode,East'),(865,'Erode,Perundurai,Ingur'),(866,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(867,'Perundurai,Kambiliyampatti'),(868,'Erode,Kasipalayam,Edayankattuvalsu'),(869,'Kollampalayam,Erode,Railway,Colony'),(870,'Erode,Chikkaiah,Naicker,College'),(871,'Erode,Erode,Fort,Erode,East'),(872,'Marapalam,Erode,East'),(873,'Erode,Rangampalayam,Edayankattuvalsu'),(874,'Perundurai,Ingur'),(875,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(876,'Erode,Kathirampatti,Kadirampatti'),(877,'Erode,Surampatti,Erode,East'),(878,'Erode,Chikkaiah,Naicker,College'),(879,'Erode,Edayankattuvalsu'),(880,'Erode,Nadarmedu,Erode,Railway,Colony'),(881,'Erode,Erode,Collectorate'),(882,'Erode,Edayankattuvalsu'),(883,'Erode,Thirunagar,Colony,Karungalpalayam'),(884,'Erode,Allapalayam,Erode,Collectorate'),(885,'Anur,Kanur,Anaipalayam'),(886,'Erode,Erode,Railway,Colony'),(887,'Erode,Edayankattuvalsu'),(888,'Erode,Moolapalayam,Erode,Railway,Colony'),(889,'Erode,Thindal,Thindal'),(890,'Erode,Chettipalayam,Erode,Railway,Colony'),(891,'Chithode,Chittode'),(892,'Erode,Periyar,Nagar,Erode,East'),(893,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(894,'Erode,Erode,Collectorate'),(895,'Erode,Kollampalayam,Arur,Karur,Erode,Railway,Colony'),(896,'Erode,Thindal,Thindal'),(897,'Karungalpalayam,Arungal,Karungalpalayam'),(898,'Chithode,Erode,Chittode'),(899,'Erode,Arur,Karur,Erode,Railway,Colony'),(900,'Chithode,Erode,Chittode'),(901,'Erode,Erode,Fort,Erode,East'),(902,'Erode,Periyar,Nagar,Erode,East'),(903,'Erode,Chikkaiah,Naicker,College'),(904,'Erode,Perundurai,Thindal,Thindal'),(905,'Erode,Moolapalayam,Erode,Railway,Colony'),(906,'Erode,Chennimalai,Kanagapuram'),(907,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(908,'Chithode,Erode,Kanjikovil'),(909,'Erode,Karungalpalayam'),(910,'Erode,Kadirampatti'),(911,'Bhavani,Kali,Vasavi,College'),(912,'Soolai,Chikkaiah,Naicker,College'),(913,'Alampalayam,Seerampalayam'),(914,'Erode,Rangampalayam,Thindal'),(915,'Erode,Periyar,Nagar,Erode,East'),(916,'Erode,Karungalpalayam'),(917,'Erode,Karungalpalayam'),(918,'Erode,Muncipal,Colony,Veerappanchatram,Chikkaiah,Naicker,College'),(919,'Erode,Railway,Colony,Erode,Railway,Colony'),(920,'Erode,Perundurai,Surampatti,Erode,East'),(921,'Erode,Marapalam,Surampatti,Erode,East'),(922,'Anampatti,Avanam,Coimbatore,Keeranatham'),(923,'Erode,Periyar,Nagar,Edayankattuvalsu'),(924,'Erode,Gobichettipalayam,Chettipalayam,Alukuli'),(925,'Erode,Perundurai,Erode,Collectorate'),(926,'Erode,Erode,Railway,Colony'),(927,'Erode,Edayankattuvalsu'),(928,'Erode,Emur,Chikkaiah,Naicker,College'),(929,'Erode,Erode,East'),(930,'Erode,Periyar,Nagar,Erode,East'),(931,'Bhavani,Erode,Peria,Agraharam'),(932,'Erode,Chennai,Erode,East'),(933,'Erode,Erode,Railway,Colony'),(934,'Erode,Palayapalayam,Erode,Collectorate'),(935,'Iruppu,15,Velampalayam'),(936,'Erode,Chettipalayam,Erode,Railway,Colony'),(937,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(938,'Erode,Thindal,Thindal'),(939,'Erode,Chikkaiah,Naicker,College'),(940,'Erode,Edayankattuvalsu'),(941,'Erode,Karungalpalayam'),(942,'Chithode,Chittode'),(943,'Erode,Erode,Fort,Erode,East'),(944,'Ariyur,Basuvapatti'),(945,'Erode,Thindal,Thindal'),(946,'Erode,Karungalpalayam'),(947,'Erode,Soolai,Chikkaiah,Naicker,College'),(948,'Erode,Edayankattuvalsu'),(949,'Erode,Kollampalayam,Erode,Railway,Colony'),(950,'Karungalpalayam,Arungal,Karungalpalayam'),(951,'Erode,Kasipalayam,Solar,Erode,Railway,Colony'),(952,'Erode,Perundurai,Erode,Collectorate'),(953,'Thindal,Thindal'),(954,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(955,'Erode,Edayankattuvalsu'),(956,'Erode,Erode,East'),(957,'Erode,Erode,East'),(958,'Erode,Perundurai,Erode,Collectorate'),(959,'Erode,Perundurai,Erode,Collectorate'),(960,'Erode,Periyar,Nagar,Erode,East'),(961,'Erode,Kaspapettai,Avalpundurai'),(962,'Perundurai,Erode,Collectorate'),(963,'Erode,Sampath,Nagar,Teachers,Colony,Erode,Collectorate'),(964,'Erode,Erode,Fort,Erode,East'),(965,'Erode,Perundurai,Ingur'),(966,'Erode,Erode,Fort,Erode,East'),(967,'Kallankattuvalasu,Kallankattuvalasu'),(968,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(969,'Anur,Chennai,Eyyanur,Marakkadai'),(970,'Erode,Perundurai,Erode,Collectorate'),(971,'Erode,Nasiyanur,Anur,Thindal'),(972,'Odathurai,Athur,Athurai,Kalichettipalayam.,Mettupalayam'),(973,'Erode,Ammapet,Erode,Collectorate'),(974,'Erode,Karungalpalayam'),(975,'Agraharam,Erode,Chikkaiah,Naicker,College'),(976,'Erode,Thindal,Thindal'),(977,'Ottapparai,Chennimalai,Basuvapatti'),(978,'Erode,Erode,Collectorate'),(979,'Erode,Solar,Erode,Railway,Colony'),(980,'Erode,Soolai,Chikkaiah,Naicker,College'),(981,'Erode,Surampatti,Edayankattuvalsu'),(982,'Erode,Pudupalayam,Kanagapuram'),(983,'Pallipalayam,Pallipalayam'),(984,'Erode,Ingur'),(985,'Erode,Thindal'),(986,'Erode,Erode,Collectorate'),(987,'Erode,Chennimalai,Edayankattuvalsu'),(988,'Erode,Gobichettipalayam,Chettipalayam,Kalichettipalayam.,Mettupalayam'),(989,'Perundurai,Seenapuram,Palakarai'),(990,'Erode,Periyar,Nagar,Erode,East'),(991,'Erode,Erode,Fort,Erode,East'),(992,'Erode,Marapalam,Erode,East'),(993,'Erode,Edayankattuvalsu'),(994,'Erode,Erode,East'),(995,'Erode,Railway,Colony,Erode,Railway,Colony'),(996,'Erode,Chikkaiah,Naicker,College'),(997,'Erode,Erode,Fort,Erode,East'),(998,'Erode,Edayankattuvalsu'),(999,'Bhavani,Chithode,Erode,Chittode'),(1000,'Erode,Erode,East'),(1001,'Erode,Erode,Fort,Erode,East'),(1002,'Erode,Muncipal,Colony,Karungalpalayam'),(1003,'Erode,Rangampalayam,Edayankattuvalsu'),(1004,'Erode,Erode,East'),(1005,'Perundurai,Coimbatore,Ingur'),(1006,'Agraharam,Erode,Marapalam,Erode,East'),(1007,'Perundurai,Ingur'),(1008,'Erode,Periya,Valasu,Veerappanchatram,Chikkaiah,Naicker,College'),(1009,'Erode,Erode,East'),(1010,'Erode,Arur,Karur,Erode,Railway,Colony'),(1011,'Erode,Moolapalayam,Erode,Railway,Colony'),(1012,'Erode,Gobichettipalayam,Kullampalayam,Chettipalayam,Kadukkampalayam'),(1013,'Anthiyur,Bhavani,Paruvachi,Dalavoipettai'),(1014,'Erode,Thindal,Thindal'),(1015,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(1016,'Erode,Kandampalayam,Perundurai,Kadirampatti'),(1017,'Erode,Karungalpalayam'),(1018,'Erode,Moolapalayam,Arur,Karur,Erode,Railway,Colony'),(1019,'Erode,Moolapalayam,Pudur,Erode,Railway,Colony'),(1020,'Erode,Kadirampatti'),(1021,'Erode,Arur,Karur,Erode,Railway,Colony'),(1022,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(1023,'Erode,Lakkapuram,Erode,Railway,Colony'),(1024,'Erode,Periyar,Nagar,Edayankattuvalsu'),(1025,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(1026,'Erode,Avalpundurai'),(1027,'Kali,Kalipalayam,Alagumalai'),(1028,'Erode,Erode,Fort,Erode,East'),(1029,'Erode,Erode,Collectorate'),(1030,'Erode,Kollampalayam,Erode,Railway,Colony'),(1031,'Erode,Karungalpalayam'),(1032,'Erode,Perundurai,Thindal,Thindal'),(1033,'Erode,Narayana,Valasu,Erode,Collectorate'),(1034,'Erode,Moolapalayam,Erode,Railway,Colony'),(1035,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(1036,'Ennai,Nandanam'),(1037,'Chithode,Erode,Gangapuram,Chittode'),(1038,'Ellapalayam,Chikkaiah,Naicker,College'),(1039,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(1040,'Erode,Erode,Collectorate'),(1041,'Komarapalayam,Kallankattuvalasu'),(1042,'Erode,Erode,Railway,Colony'),(1043,'Kurichi,Kolaram'),(1044,'Erode,Erode,Fort,Erode,East'),(1045,'Erode,Anna,Road,Erode,Collectorate'),(1046,'Erode,Palayapalayam,Thindal'),(1047,'Erode,Moolapalayam,Arur,Karur,Erode,Railway,Colony'),(1048,'Fairlands,Fairlands'),(1049,'Erode,Muncipal,Colony,Veerappanchatram,Chikkaiah,Naicker,College'),(1050,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(1051,'Erode,Perundurai,Thindal,Thindal'),(1052,'Erode,Thirunagar,Colony,Karungalpalayam'),(1053,'Erode,Soolai,Chikkaiah,Naicker,College'),(1054,'Erode,Erode,East'),(1055,'Erode,Erode,Railway,Colony'),(1056,'Erode,Erode,Fort,Erode,East'),(1057,'Kadirampatti,Kadirampatti'),(1058,'Nadarmedu,Erode,Railway,Colony'),(1059,'Erode,Chikkaiah,Naicker,College'),(1060,'Erode,Edayankattuvalsu'),(1061,'Erode,Erode,Fort,Erode,East'),(1062,'Erode,Erode,Collectorate'),(1063,'Erode,Edayankattuvalsu'),(1064,'Erode,Karungalpalayam'),(1065,'Erode,Perundurai,Erode,Collectorate'),(1066,'Erode,Thirunagar,Colony,Gandhipuram,Karungalpalayam'),(1067,'Erode,Thindal,Thindal'),(1068,'Andipalayam,Iruppu,Karuvampalayam,Karuvampalayam'),(1069,'Erode,Thindal'),(1070,'Erode,Chettipalayam,Erode,Railway,Colony'),(1071,'Erode,Thindal,Thindal'),(1072,'Arur,Karur,Thamaraipalayam'),(1073,'Erode,Arungal,Karungalpalayam'),(1074,'Erode,Edayankattuvalsu'),(1075,'Eachanari,Coimbatore,Industrial,Estate'),(1076,'Bhavani,Bhavani,Kudal'),(1077,'Idappadi,Nedunkulam'),(1078,'Erode,Erode,Collectorate'),(1079,'Erode,Palayapalayam,Perundurai,Edayankattuvalsu'),(1080,'Erode,Karungalpalayam'),(1081,'Palayapalayam,Perundurai,Thindal'),(1082,'Erode,Chettipalayam,Erode,Railway,Colony'),(1083,'Erode,Lakkapuram,Pudur,Erode,Railway,Colony'),(1084,'Erode,Edayankattuvalsu'),(1085,'Perundurai,Ingur'),(1086,'Erode,Erode,Collectorate'),(1087,'Erode,Erode,Fort,Erode,East'),(1088,'Erode,Muncipal,Colony,Karungalpalayam'),(1089,'Agraharam,Erode,Seerampalayam'),(1090,'Erode,Soolai,Chikkaiah,Naicker,College'),(1091,'Erode,Thindal,Thindal'),(1092,'Erode,Surampatti,Erode,East'),(1093,'Erode,Muncipal,Colony,Veerappanchatram,Chikkaiah,Naicker,College'),(1094,'Erode,Thirunagar,Colony,Karungalpalayam'),(1095,'Kollampalayam,Arur,Karur,Erode,Railway,Colony'),(1096,'Erode,Gobichettipalayam,Kullampalayam,Chettipalayam,Kadukkampalayam'),(1097,'Erode,Erode,Fort,Erode,East'),(1098,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(1099,'Erode,Karungalpalayam'),(1100,'Iruppu,Ayyankalipalayam'),(1101,'Bhavani,Erode,Chikkaiah,Naicker,College'),(1102,'Erode,Erode,East'),(1103,'Erode,Perundurai,Erode,Collectorate'),(1104,'Erode,Erode,East'),(1105,'Erode,Erode,East'),(1106,'Erode,Chikkaiah,Naicker,College'),(1107,'Erode,Ganapathy,Erode,Collectorate'),(1108,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(1109,'Erode,Chettipalayam,Erode,Railway,Colony'),(1110,'Erode,Pudur,Akkur,Erode,Railway,Colony'),(1111,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(1112,'Erode,Erode,Fort,Erode,East'),(1113,'Erode,Asur,Erode,Collectorate'),(1114,'Erode,Perundurai,Thindal,Thindal'),(1115,'Erode,Palayapalayam,Surampatti,Edayankattuvalsu'),(1116,'Bhavani,Erode,Chikkaiah,Naicker,College'),(1117,'Erode,Thindal,Thindal'),(1118,'Erode,Karungalpalayam'),(1119,'Erode,Periyar,Nagar,Erode,East'),(1120,'Erode,Nasiyanur,Anur,Kadirampatti'),(1121,'Erode,Nasiyanur,Anur,Thindal'),(1122,'Erode,Kasipalayam,Edayankattuvalsu'),(1123,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(1124,'Erode,Erode,Fort,Erode,East'),(1125,'Erode,Palayapalayam,Thindal'),(1126,'Bhavani,Vasavi,College'),(1127,'Erode,Erode,East'),(1128,'Coimbatore,Pappanaickenpalayam'),(1129,'Erode,Erode,Collectorate'),(1130,'Aliyur,Ayal,Kali,Kaliyur,Kanakkampalayam,Kanakkampalayam'),(1131,'Periyar,Nagar,Pallipalayam'),(1132,'Erode,Perundurai,Erode,Collectorate'),(1133,'Erode,Perundurai,Thindal'),(1134,'Seerampalayam,Seerampalayam'),(1135,'Erode,Edayankattuvalsu'),(1136,'Erode,Erode,East'),(1137,'Erode,Arur,Karur,Erode,Railway,Colony'),(1138,'Kavandapadi,Kalichettipalayam.,Mettupalayam'),(1139,'Erode,Karungalpalayam'),(1140,'Erode,Pallipalayam'),(1141,'Erode,Karungalpalayam'),(1142,'Erode,Soolai,Chikkaiah,Naicker,College'),(1143,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(1144,'Erode,Periyar,Nagar,Edayankattuvalsu'),(1145,'Bhavani,Erode,Karungalpalayam'),(1146,'Erode,Moolapalayam,Nadarmedu,Erode,Railway,Colony'),(1147,'Erode,Kollampalayam,Moolapalayam,Erode,Railway,Colony'),(1148,'Erode,Chennimalai,Edayankattuvalsu'),(1149,'Erode,Nasiyanur,Sampath,Nagar,Anur,Erode,Collectorate'),(1150,'Erode,Chidambaram,Erode,East'),(1151,'Erode,Chikkaiah,Naicker,College'),(1152,'Erode,Erode,East'),(1153,'Erode,Chikkaiah,Naicker,College'),(1154,'Erode,Karungalpalayam'),(1155,'Perundurai,Thuduppathi,Palakarai'),(1156,'Erode,Erode,Fort,Erode,East'),(1157,'Alampalayam,Pappampalayam'),(1158,'Erode,Edayankattuvalsu'),(1159,'Erode,Erode,Collectorate'),(1160,'Erode,Chikkaiah,Naicker,College'),(1161,'Erode,Ganapathi,Nagar,Thindal'),(1162,'Erode,Erode,East'),(1163,'Erode,Gangapuram,Chittode'),(1164,'Erode,Thindal,Thindal'),(1165,'Erode,Erode,East'),(1166,'Erode,Erode,Fort,Erode,East'),(1167,'Erode,Pallipalayam'),(1168,'Ennai,Kelambakkam,Melakkottaiyur'),(1169,'Erode,Solar,Erode,Railway,Colony'),(1170,'Erode,Solar,Erode,Railway,Colony'),(1171,'Pallipalayam,Pallipalayam'),(1172,'Erode,Perundurai,Sampath,Nagar,Teachers,Colony,Erode,Collectorate'),(1173,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(1174,'Erode,Karungalpalayam'),(1175,'Nallur,Allur,Karunampathi'),(1176,'Erode,Periyar,Nagar,Erode,East'),(1177,'Erode,Perundurai,Erode,Collectorate'),(1178,'Erode,Erode,East'),(1179,'Nanjaiuthukuli,Elumathur'),(1180,'Rangampalayam,Chennimalai,Edayankattuvalsu'),(1181,'Erode,Erode,East'),(1182,'Erode,Thindal,Thindal'),(1183,'Erode,Thindal,Thindal'),(1184,'Erode,Perundurai,Erode,Collectorate'),(1185,'Erode,Muncipal,Colony,Veerappanchatram,Chikkaiah,Naicker,College'),(1186,'Erode,Palayapalayam,Perundurai,Thindal,Thindal'),(1187,'Erode,Karungalpalayam'),(1188,'Chithode,Erode,Pudur,Chittode'),(1189,'Erode,Erode,East'),(1190,'Erode,Edayankattuvalsu'),(1191,'Kokkarayanpettai,Pappampalayam'),(1192,'Erode,Erode,Fort,Erode,East'),(1193,'Erode,Karungalpalayam'),(1194,'Erode,Teachers,Colony,Erode,Collectorate'),(1195,'Erode,Edayankattuvalsu'),(1196,'Erode,Muncipal,Colony,Veerappanchatram,Chikkaiah,Naicker,College'),(1197,'Erode,Erode,East'),(1198,'Bhavani,Kali,Vasavi,College'),(1199,'Erode,Amoor,Karungalpalayam'),(1200,'Bhavani,Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(1201,'Erode,Erode,East'),(1202,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(1203,'Erode,Erode,East'),(1204,'Erode,Thindal,Thindal'),(1205,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(1206,'Erode,Erode,East'),(1207,'Erode,Perundurai,Erode,Collectorate'),(1208,'Erode,Erode,Fort,Erode,East'),(1209,'Erode,Perundurai,Erode,Collectorate'),(1210,'Erode,Thirunagar,Colony,Karungalpalayam'),(1211,'Erode,Erode,Collectorate'),(1212,'Chithode,Erode,Vasavi,College'),(1213,'Bhavani,Erode,Peria,Agraharam'),(1214,'Erode,Kadirampatti'),(1215,'Erode,Surampatti,Edayankattuvalsu'),(1216,'Erode,Collectorate,Erode,Collectorate'),(1217,'Erode,Moolapalayam,Arur,Karur,Erode,Railway,Colony'),(1218,'Erode,Edayankattuvalsu'),(1219,'Kurichi,Modakurichi,Elumathur'),(1220,'Erode,Erode,Collectorate'),(1221,'Dadagapatti,Dadagapatti'),(1222,'Erode,Erode,Fort,Erode,East'),(1223,'Agraharam,Erode,Peria,Agraharam'),(1224,'Erode,Periyar,Nagar,Chidambaram,Erode,East'),(1225,'Erode,Chikkaiah,Naicker,College'),(1226,'Komarapalayam,Kallankattuvalasu'),(1227,'Erode,Gobichettipalayam,Chettipalayam,Kadukkampalayam'),(1228,'Bhavani,Bhavani,Kudal'),(1229,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(1230,'Agraharam,Erode,Peria,Agraharam'),(1231,'Erode,Palayapalayam,Perundurai,Teachers,Colony,Erode,Collectorate'),(1232,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(1233,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(1234,'Erode,Kollampalayam,Moolapalayam,Erode,Railway,Colony'),(1235,'Kodumudi,Pudur,Avudayarparai'),(1236,'Erode,Thindal'),(1237,'Erode,Soolai,Chikkaiah,Naicker,College'),(1238,'Erode,Chikkaiah,Naicker,College'),(1239,'Erode,Erode,Collectorate'),(1240,'Erode,Kavilipalayam'),(1241,'Erode,Karungalpalayam'),(1242,'Erode,Erode,Collectorate'),(1243,'Bhavani,Bhavani,Kudal'),(1244,'Erode,Kollampalayam,Erode,Railway,Colony'),(1245,'Nasiyanur,Anur,Kadirampatti'),(1246,'Erode,Teachers,Colony,Edayankattuvalsu'),(1247,'Komarapalayam,Chikkaiah,Naicker,College'),(1248,'Erode,Erode,Fort,Erode,East'),(1249,'Erode,Erode,East'),(1250,'Erode,Alampalayam'),(1251,'Erode,Chinniyampalayam,Elumathur'),(1252,'Erode,Chikkaiah,Naicker,College'),(1253,'Erode,Karungalpalayam'),(1254,'Erode,Karungalpalayam,Arungal,Kali,Karungalpalayam'),(1255,'Erode,Perundurai,Kadirampatti'),(1256,'Bhavani,Bhavani,Kudal'),(1257,'Erode,Vadamugam,Vellode,Chennimalai,Erode,East'),(1258,'Erode,Emur,Chikkaiah,Naicker,College'),(1259,'Erode,Gobichettipalayam,Attur,Chettipalayam,Kadukkampalayam'),(1260,'Erode,Chikkaiah,Naicker,College'),(1261,'Erode,Sampath,Nagar,Erode,Collectorate'),(1262,'Erode,East,Erode,East'),(1263,'Erode,Thirunagar,Colony,Karungalpalayam'),(1264,'Erode,Chidambaram,Erode,East'),(1265,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(1266,'Erode,Erode,East'),(1267,'Erode,Periyar,Nagar,Erode,East'),(1268,'Erode,Perundurai,Ingur'),(1269,'Erode,Erode,Collectorate'),(1270,'Erode,Thindal,Thindal'),(1271,'Erode,Erode,Railway,Colony'),(1272,'Erode,Moolapalayam,Athipalayam,Erode,Railway,Colony'),(1273,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(1274,'Erode,Eral,Edayankattuvalsu'),(1275,'Erode,Chennimalai,Erode,Railway,Colony'),(1276,'Erode,Nasiyanur,Anur,Thindal'),(1277,'Gobichettipalayam,Chettipalayam,Kadukkampalayam'),(1278,'Kokkarayanpettai,Pappampalayam'),(1279,'Erode,Perundurai,Erode,East'),(1280,'Erode,Thirunagar,Colony,Karungalpalayam'),(1281,'Periyapuliyur,Chittode'),(1282,'Erode,Moolapalayam,Arur,Karur,Erode,Railway,Colony'),(1283,'Erode,Thindal,Thindal'),(1284,'Erode,Chikkaiah,Naicker,College'),(1285,'Erode,Erode,East'),(1286,'Erode,Arur,Karur,Erode,Railway,Colony'),(1287,'Erode,Edayankattuvalsu'),(1288,'Erode,Edayankattuvalsu'),(1289,'Erode,Perundurai,Thindal'),(1290,'Erode,Peria,Agraharam'),(1291,'Erode,Pudur,Avadi,Elumathur'),(1292,'Erode,Erode,Railway,Colony'),(1293,'Arasampatti,Kadirampatti'),(1294,'Erode,Karungalpalayam,Marapalam,Arungal,Karungalpalayam'),(1295,'Erode,Erode,Collectorate'),(1296,'Erode,Chikkaiah,Naicker,College'),(1297,'Erode,Pallipalayam'),(1298,'Erode,Alampalayam,Seerampalayam'),(1299,'Erode,Erode,East'),(1300,'Erode,Chidambaram,Erode,East'),(1301,'Erode,Chikkaiah,Naicker,College'),(1302,'Erode,Emur,Chikkaiah,Naicker,College'),(1303,'Chithode,Erode,Chittode'),(1304,'Erode,Periyar,Nagar,Erode,East'),(1305,'Erode,Erode,Collectorate'),(1306,'Erode,Erode,East'),(1307,'Erode,Thirunagar,Colony,Karungalpalayam'),(1308,'Kanagapuram,Kanagapuram'),(1309,'Erode,Solar,Arur,Karur,Erode,Railway,Colony'),(1310,'Erode,Perundurai,Thindal'),(1311,'Erode,Muncipal,Colony,Veerappanchatram,Karungalpalayam'),(1312,'Kanagapuram,Kanagapuram'),(1313,'Erode,Kasipalayam,Edayankattuvalsu'),(1314,'Bhavani,Erode,Peria,Agraharam'),(1315,'Erode,Karungalpalayam'),(1316,'Erode,Karungalpalayam,Arungal,Erode,East'),(1317,'Erode,Kokkarayanpettai,Surampatti,Erode,East'),(1318,'Erode,Kathirampatti,Perundurai,Ichanda,Kanagapuram'),(1319,'Erode,Thindal,Thindal'),(1320,'Erode,Thindal'),(1321,'Erode,Karungalpalayam'),(1322,'Erode,Thirunagar,Colony,Karungalpalayam'),(1323,'Solar,Annadanapatti'),(1324,'Komarapalayam,Kallankattuvalasu'),(1325,'Bhavani,Bhavani,Kudal'),(1326,'Erode,Thirunagar,Colony,Karungalpalayam'),(1327,'Pudupalayam,Kangayam,Tea,Nagar'),(1328,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(1329,'Erode,Karungalpalayam'),(1330,'Erode,Erode,Fort,Erode,East'),(1331,'Paruvachi,Dalavoipettai'),(1332,'Erode,Perundurai,Erode,Collectorate'),(1333,'Chennimalai,Basuvapatti'),(1334,'Erode,Marapalam,Erode,East'),(1335,'Erode,Periyar,Nagar,Erode,East'),(1336,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(1337,'Erode,Narayana,Valasu,Erode,Collectorate'),(1338,'Siruvalur,Vellankovil,Kavindapadi,Vellankoil'),(1339,'Erode,Chennimalai,Edayankattuvalsu'),(1340,'Erode,Railway,Colony,Erode,Railway,Colony'),(1341,'Erode,Karungalpalayam,Amoor,Arungal,Karungalpalayam'),(1342,'Erode,Thindal,Thindal'),(1343,'Erode,Periyar,Nagar,Erode,East'),(1344,'Erode,Periyar,Nagar,Erode,East'),(1345,'Erode,Emur,Chikkaiah,Naicker,College'),(1346,'Erode,Erode,Collectorate'),(1347,'Erode,Perundurai,Thindal'),(1348,'Erode,Perundurai,Kanagapuram'),(1349,'Nadarmedu,Erode,Railway,Colony'),(1350,'Erode,Kalpalayam,Erode,Railway,Colony'),(1351,'Erode,Erode,East'),(1352,'Erode,Soolai,Karumal,Karumalai,Chikkaiah,Naicker,College'),(1353,'Erode,Erode,Fort,Erode,East'),(1354,'Erode,Solar,Erode,Railway,Colony'),(1355,'Erode,Erode,East'),(1356,'Seerampalayam,Seerampalayam'),(1357,'Komarapalayam,Kallankattuvalasu'),(1358,'Erode,Periyar,Nagar,Erode,East'),(1359,'Erode,Erode,Fort,Erode,East'),(1360,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(1361,'Erode,Erode,Collectorate'),(1362,'Gobichettipalayam,Chettipalayam,Kadukkampalayam'),(1363,'Erode,Edayankattuvalsu'),(1364,'Arasampatti,Kadirampatti'),(1365,'Erode,Chettipalayam,Erode,Railway,Colony'),(1366,'Gangapuram,Kadirampatti'),(1367,'Erode,Periyar,Nagar,Erode,East'),(1368,'Erode,Railway,Colony,Erode,Railway,Colony'),(1369,'Erode,Perundurai,Erode,Collectorate'),(1370,'Erode,Edayankattuvalsu'),(1371,'Erode,Chikkaiah,Naicker,College'),(1372,'Erode,Perundurai,Erode,Collectorate'),(1373,'Erode,Nadarmedu,Erode,Railway,Colony'),(1374,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(1375,'Erode,Karungalpalayam'),(1376,'Erode,Erode,Railway,Colony'),(1377,'Bhavani,Periyar,Nagar,Vasavi,College'),(1378,'Erode,Kali,Kavindapadi,Bhavani,Kudal'),(1379,'Erode,Avalpundurai'),(1380,'Erode,Chettipalayam,Erode,Railway,Colony'),(1381,'Erode,Edayankattuvalsu'),(1382,'Erode,Emur,Chikkaiah,Naicker,College'),(1383,'Erode,Nadarmedu,Erode,Railway,Colony'),(1384,'Erode,Edayankattuvalsu'),(1385,'Erode,Marapalam,Erode,East'),(1386,'Erode,Thirunagar,Colony,Karungalpalayam'),(1387,'Erode,Appakudal'),(1388,'Erode,Erode,Fort,Erode,East'),(1389,'Erode,Erode,East'),(1390,'Erode,Thindal,Ganapathi,Nagar,Thindal'),(1391,'Erode,Erode,East'),(1392,'Erode,Kalichettipalayam.,Mettupalayam'),(1393,'Erode,Teachers,Colony,Erode,Collectorate'),(1394,'Erode,Erode,Fort,Erode,East'),(1395,'Erode,Erode,East'),(1396,'Erode,Erode,Collectorate'),(1397,'Erode,Erode,Fort,Arimalam,Erode,Collectorate'),(1398,'Erode,Nasiyanur,Anur,Kanji,Erode,East'),(1399,'Coimbatore,R.S.Puram,East'),(1400,'Karungalpalayam,Thirunagar,Colony,Amoor,Arungal,Karungalpalayam'),(1401,'Erode,Erode,Collectorate'),(1402,'Erode,Kadirampatti'),(1403,'Adambakkam,Chennai,Adambakkam'),(1404,'Erode,Periyar,Nagar,Erode,East'),(1405,'Erode,Sampath,Nagar,Erode,Collectorate'),(1406,'Erode,Kollampalayam,Erode,Railway,Colony'),(1407,'Erode,Erode,Railway,Colony'),(1408,'Erode,Erode,Fort,Erode,East'),(1409,'Erode,Kambiliyampatti'),(1410,'Komarapalayam,Kallankattuvalasu'),(1411,'Erode,Kavandapadi,Kalichettipalayam.,Mettupalayam'),(1412,'Erode,Kurichi,Modakurichi,Elumathur'),(1413,'Chikkaiah,Naicker,College,Chikkaiah,Naicker,College'),(1414,'Bhavani,Erode,Paruvachi,Dalavoipettai'),(1415,'Erode,Karungalpalayam'),(1416,'Erode,Periyar,Nagar,Erode,East'),(1417,'Kathirampatti,Nasiyanur,Anur,Kadirampatti'),(1418,'Erode,Pappampalayam,Seerampalayam'),(1419,'Appakudal,Appakudal'),(1420,'Erode,Karungalpalayam'),(1421,'Chithode,Chittode'),(1422,'Erode,Lakkapuram,Pudur,Erode,Railway,Colony'),(1423,'Erode,Kollampalayam,Erode,Railway,Colony'),(1424,'Erode,East,Erode,East'),(1425,'Erode,A.Sembulichampalayam,Alampalayam'),(1426,'Erode,Chikkaiah,Naicker,College'),(1427,'Erode,Railway,Colony,Erode,Railway,Colony'),(1428,'Kavandapadi,Kalichettipalayam.,Mettupalayam'),(1429,'Erode,Erode,East'),(1430,'Gangapuram,Chittode'),(1431,'Erode,Erode,East'),(1432,'Erode,Thindal,Thindal'),(1433,'Erode,Chettipalayam,Erode,Railway,Colony'),(1434,'Erode,Erode,East'),(1435,'Thindal,Thindal'),(1436,'Erode,Erode,Railway,Colony'),(1437,'Ammapet,Cuddalore,Allikuttai'),(1438,'Erode,Lakkapuram,Elumathur'),(1439,'Erode,Erode,East'),(1440,'Erode,Perundurai,Erode,Collectorate'),(1441,'Erode,Railway,Colony,Erode,Railway,Colony'),(1442,'Erode,Arasampatti,Kadirampatti'),(1443,'Erode,Erode,East'),(1444,'Erode,Kasipalayam,Pudur,Solar,Erode,Railway,Colony'),(1445,'Erode,Bhavani,Kudal'),(1446,'Erode,Perundurai,Ingur'),(1447,'Bhavani,Erode,Perundurai,Ingur'),(1448,'Erode,Teachers,Colony,Erode,Collectorate'),(1449,'Erode,Erode,Collectorate'),(1450,'Bhavani,Erode,Chikkaiah,Naicker,College'),(1451,'Erode,Komarapalayam,Surampatti,Erode,East'),(1452,'Chennimalai,Basuvapatti'),(1453,'Anaipalayam,Anaipalayam'),(1454,'Erode,Edayankattuvalsu'),(1455,'Erode,Erode,Fort,Erode,East'),(1456,'Erode,Erode,Fort,Erode,East'),(1457,'Erode,Edayankattuvalsu'),(1458,'Erode,Emur,Chikkaiah,Naicker,College'),(1459,'Erode,Erode,East'),(1460,'Erode,Dharapuram,Erode,Railway,Colony'),(1461,'Erode,Erode,Railway,Colony'),(1462,'Erode,Perundurai,Thindal,Thindal'),(1463,'Erode,Erode,Collectorate'),(1464,'Coimbatore,Pannimadai'),(1465,'Erode,Solar,Arur,Karur,Erode,Railway,Colony'),(1466,'Erode,Chidambaram,Erode,East'),(1467,'Erode,Edayankattuvalsu'),(1468,'Erode,Edayankattuvalsu'),(1469,'Chennimalai,Basuvapatti'),(1470,'Erode,Surampatti,Teachers,Colony,Edayankattuvalsu'),(1471,'Erode,Erode,Fort,Erode,East'),(1472,'Erode,Chidambaram,Erode,East'),(1473,'Erode,Erode,Fort,Erode,East'),(1474,'Erode,Erode,East'),(1475,'Erode,Perundurai,Erode,Collectorate'),(1476,'Gobichettipalayam,Chettipalayam,Alukuli'),(1477,'Erode,Perundurai,Thindal'),(1478,'Erode,Moolapalayam,Erode,Railway,Colony'),(1479,'Arasampalayam,Karankad,Karankadu,Seerampalayam'),(1480,'Jambai,Kali,Dalavoipettai'),(1481,'Erode,Edayankattuvalsu'),(1482,'Erode,Chikkaiah,Naicker,College'),(1483,'Erode,Rangampalayam,Edayankattuvalsu'),(1484,'Erode,Surampatti,Erode,East'),(1485,'Erode,Periyar,Nagar,Erode,East'),(1486,'Erode,Lakkapuram,Erode,Railway,Colony'),(1487,'Erode,Chikkaiah,Naicker,College'),(1488,'Erode,Erode,Collectorate'),(1489,'Erode,Edayankattuvalsu'),(1490,'Erode,Kavilipalayam'),(1491,'Bhavani,Erode,Chikkaiah,Naicker,College'),(1492,'Erode,Muncipal,Colony,Karungalpalayam'),(1493,'Erode,Erode,Collectorate'),(1494,'Bhavani,Erode,Kali,Vasavi,College'),(1495,'Chithode,Erode,Chittode'),(1496,'Erode,Arur,Karur,Erode,Railway,Colony'),(1497,'Erode,Teachers,Colony,Erode,Collectorate'),(1498,'Erode,Erode,East'),(1499,'Palayapalayam,Erode,Collectorate'),(1500,'Erode,Sampath,Nagar,Chikkaiah,Naicker,College'),(1501,'Erode,Erode,Fort,Erode,Collectorate'),(1502,'Erode,Edayankattuvalsu'),(1503,'Erode,Perundurai,Ingur'),(1504,'Erode,Thindal'),(1505,'Erode,Chikkaiah,Naicker,College'),(1506,'Athipalayam,Seerampalayam'),(1507,'Erode,Erode,East'),(1508,'Erode,Perundurai,Sanitorium'),(1509,'Erode,Erode,Fort,Erode,East'),(1510,'Erode,Karungalpalayam'),(1511,'Erode,Kallankattuvalasu'),(1512,'Erode,Periyar,Nagar,Edayankattuvalsu'),(1513,'Erode,Lakkapuram,Pudur,Erode,Railway,Colony'),(1514,'Erode,Chikkaiah,Naicker,College'),(1515,'Erode,Arakkankottai'),(1516,'Erode,Nasiyanur,Anur,Kadirampatti'),(1517,'Erode,Moolapalayam,Erode,Railway,Colony'),(1518,'Erode,Surampatti,Edayankattuvalsu'),(1519,'Bhavani,Chithode,Erode,Gangapuram,Chittode'),(1520,'Erode,Perundurai,Thindal,Thindal'),(1521,'Erode,Perundurai,Thindal,Amur,Thindal'),(1522,'Erode,Chikkaiah,Naicker,College'),(1523,'Erode,Perundurai,Chennimalai,Ingur'),(1524,'Bhavani,Erode,Bhavani,Kudal'),(1525,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(1526,'Erode,Soolai,Chikkaiah,Naicker,College'),(1527,'Erode,Chikkaiah,Naicker,College'),(1528,'Erode,Erode,Collectorate'),(1529,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(1530,'Erode,Perundurai,Thindal'),(1531,'Erode,Kollampalayam,Erode,Railway,Colony'),(1532,'Erode,Karungalpalayam'),(1533,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(1534,'Pudur,Coimbatore,Gandhipuram,Gandhipuram,(Coimbatore)'),(1535,'Kambiliyampatti,Kambiliyampatti'),(1536,'Erode,Erode,Fort,Erode,East'),(1537,'Erode,Chikkaiah,Naicker,College'),(1538,'Erode,Erode,East'),(1539,'Marakkadai,Marakkadai'),(1540,'Erode,Erode,Collectorate'),(1541,'Erode,Erode,East'),(1542,'Erode,Surampatti,Edayankattuvalsu'),(1543,'Erode,Erode,Collectorate'),(1544,'Erode,Kaspapettai,Kangayam,Avalpundurai'),(1545,'Erode,Erode,East'),(1546,'Erode,Perundurai,Ingur'),(1547,'Anur,Eyyanur,Leigh,Bazaar'),(1548,'Erode,Chikkaiah,Naicker,College'),(1549,'Erode,Erode,Fort,Erode,East'),(1550,'Erode,Palayapalayam,Perundurai,Thindal'),(1551,'Perundurai,Thindal,Thindal'),(1552,'Erode,Edayankattuvalsu'),(1553,'Nanjaiuthukuli,Elumathur'),(1554,'Erode,Chikkaiah,Naicker,College'),(1555,'Erode,Erode,Collectorate'),(1556,'Erode,Thindal,Thindal'),(1557,'Erode,Erode,East'),(1558,'Erode,Erode,East'),(1559,'Koottapalli,Koottapalli'),(1560,'Perundurai,Thindal'),(1561,'Erode,Moolapalayam,Erode,Railway,Colony'),(1562,'Erode,Perundurai,Ingur'),(1563,'Erode,Emur,Chikkaiah,Naicker,College'),(1564,'Erode,Palayapalayam,Erode,Collectorate'),(1565,'Erode,Edayankattuvalsu'),(1566,'Erode,Edayankattuvalsu'),(1567,'Komarapalayam,Karai,Kallankattuvalasu'),(1568,'Seerampalayam,Seerampalayam'),(1569,'Erode,Kadirampatti'),(1570,'Erode,Pallipalayam'),(1571,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(1572,'Erode,Periyar,Nagar,Erode,East'),(1573,'Erode,Perundurai,Erode,Collectorate'),(1574,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(1575,'Erode,Erode,Railway,Colony'),(1576,'Perundurai,Ingur'),(1577,'Erode,Kokkarayanpettai,Pappampalayam'),(1578,'Erode,Thindal'),(1579,'Erode,Erode,Collectorate'),(1580,'Erode,Karungalpalayam'),(1581,'Erode,Surampatti,Edayankattuvalsu'),(1582,'Erode,Perundurai,Thindal'),(1583,'Erode,Marapalam,Erode,East'),(1584,'Erode,Kanagapuram'),(1585,'Erode,Nasiyanur,Anur,Kadirampatti'),(1586,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(1587,'Erode,Erode,Collectorate'),(1588,'Erode,Periyar,Nagar,Edayankattuvalsu'),(1589,'Erode,Karungalpalayam'),(1590,'Erode,Kandampalayam,Nadayanur'),(1591,'Erode,Nanjaiuthukuli,Akkur,Elumathur'),(1592,'Erode,Thindal,Thindal'),(1593,'Erode,Nasiyanur,Anur,Kaikatti,Thindal'),(1594,'Erode,Karungalpalayam'),(1595,'Erode,Perundurai,Chennimalai,Erode,Collectorate'),(1596,'Erode,Erode,Collectorate'),(1597,'Erode,Vasavi,College'),(1598,'Bodupatti,Bodupatti'),(1599,'Edayankattuvalsu,Edayankattuvalsu'),(1600,'Erode,Perundurai,Ingur'),(1601,'Erode,Erode,Fort,Erode,East'),(1602,'Erode,Erode,Fort,Erode,East'),(1603,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(1604,'Agraharam,Erode,Erode,East'),(1605,'Erode,Karungalpalayam'),(1606,'Erode,Karungalpalayam'),(1607,'Erode,Surampatti,Erode,East'),(1608,'Komarapalayam,Kallankattuvalasu'),(1609,'Erode,Karungalpalayam'),(1610,'Erode,Moolapalayam,Nadarmedu,Erode,Railway,Colony'),(1611,'Erode,Erode,East'),(1612,'Fairlands,Fairlands'),(1613,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(1614,'Ayyanthirumaligai,Ayyanthirumaligai'),(1615,'Erode,Rangampalayam,Edayankattuvalsu'),(1616,'Erode,Surampatti,Kavilipalayam'),(1617,'Erode,Arur,Karur,Erode,Railway,Colony'),(1618,'Erode,Ellapalayam,Chikkaiah,Naicker,College'),(1619,'Erode,Chikkaiah,Naicker,College'),(1620,'Erode,Chidambaram,Erode,East'),(1621,'Erode,Erode,Collectorate'),(1622,'Erode,Erode,Collectorate'),(1623,'Erode,Erode,East'),(1624,'Erode,Edayankattuvalsu'),(1625,'Agraharam,Dharmapuri,Public,Offices'),(1626,'Erode,Erode,Collectorate'),(1627,'Erode,Thindal'),(1628,'Erode,Perundurai,Ingur'),(1629,'Erode,Arasampatti,Kadirampatti'),(1630,'Pappampalayam,Pappampalayam'),(1631,'Erode,Kollampalayam,Erode,Railway,Colony'),(1632,'Erode,Chikkaiah,Naicker,College'),(1633,'Erode,Erode,East'),(1634,'Kollampalayam,Arur,Karur,Erode,Railway,Colony'),(1635,'Erode,Perundurai,Ingur'),(1636,'Iruppu,Kallampalayam,Road'),(1637,'Erode,Karungalpalayam'),(1638,'Karungalpalayam,Arungal,Karungalpalayam'),(1639,'Erode,Karungalpalayam'),(1640,'Erode,Kollampalayam,Erode,Railway,Colony'),(1641,'Erode,Erode,East'),(1642,'Erode,Erode,East'),(1643,'Pallipalayam,Pallipalayam'),(1644,'Erode,Palayapalayam,Erode,Collectorate'),(1645,'Erode,Ayal,Erode,East'),(1646,'Bhavani,Erode,Peria,Agraharam'),(1647,'Erode,Erode,Fort,Erode,Collectorate'),(1648,'Erode,Chettipalayam,Erode,Railway,Colony'),(1649,'Erode,Chikkaiah,Naicker,College'),(1650,'Iruppu,Kallampalayam,Road'),(1651,'Mylambadi,Amaram,Kannadipalayam'),(1652,'Erode,Thindal,Thindal'),(1653,'Erode,Karungalpalayam'),(1654,'Perundurai,Ingur'),(1655,'Erode,Chikkaiah,Naicker,College'),(1656,'Erode,Arimalam,Thindal'),(1657,'Erode,Erode,East'),(1658,'Erode,Erode,East'),(1659,'Erode,Narayana,Valasu,Nasiyanur,Anur,Erode,Collectorate'),(1660,'Erode,Kollampalayam,Erode,Railway,Colony'),(1661,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(1662,'Erode,Emur,Chikkaiah,Naicker,College'),(1663,'Erode,Edayankattuvalsu'),(1664,'Erode,Moolapalayam,Erode,Railway,Colony'),(1665,'Erode,Nadarmedu,Erode,Railway,Colony'),(1666,'Erode,Moolapalayam,Chettipalayam,Erode,Railway,Colony'),(1667,'Gobichettipalayam,Atur,Chettipalayam,Kadukkampalayam'),(1668,'Erode,Surampatti,Erode,East'),(1669,'Erode,Chittode,Chittode'),(1670,'Erode,Erode,East'),(1671,'Erode,Erode,East'),(1672,'Chithode,Sellappampalayam,Coimbatore,Chittode'),(1673,'Erode,Edayankattuvalsu'),(1674,'Erode,Perundurai,Erode,Collectorate'),(1675,'Kondalam,Kondalampatti'),(1676,'Erode,Erode,Fort,Erode,Collectorate'),(1677,'Namakkal,Bazaar,Namakkal,Bazaar'),(1678,'Chithode,Erode,Chittode'),(1679,'Erode,Karungalpalayam'),(1680,'Erode,Erode,Fort,Erode,East'),(1681,'Erode,Sampath,Nagar,Erode,Collectorate'),(1682,'Erode,Nadarmedu,Erode,Railway,Colony'),(1683,'Erode,Karungalpalayam'),(1684,'Appakudal,Erode,Appakudal'),(1685,'Erode,Vairapalayam,Karungalpalayam'),(1686,'Erode,Erode,East'),(1687,'Erode,Teachers,Colony,Erode,Collectorate'),(1688,'Erode,Moolapalayam,Erode,Railway,Colony'),(1689,'Erode,Nasiyanur,Anur,Thindal'),(1690,'Sathyamangalam,Kavilipalayam'),(1691,'Komarapalayam,Kallankattuvalasu'),(1692,'Erode,Erode,Fort,Erode,East'),(1693,'Erode,Thindal'),(1694,'Bhavani,Erode,Chittode'),(1695,'Erode,Amoor,Karungalpalayam'),(1696,'Erode,Erode,East'),(1697,'Erode,Surampatti,Erode,East'),(1698,'Erode,Sathyamangalam,Kavilipalayam'),(1699,'Erode,Seerampalayam'),(1700,'Pallipalayam,Pallipalayam'),(1701,'Erode,Kadirampatti'),(1702,'Kattampatti-Coimbatore,Kattampatti-Coimbatore'),(1703,'Erode,Moolapalayam,Erode,Railway,Colony'),(1704,'Erode,Erode,East'),(1705,'Erode,Erode,Fort,Erode,East'),(1706,'Erode,Pudur,Amaravathi,Nagar,Kavilipalayam'),(1707,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(1708,'Erode,Perundurai,Thindal,Thindal'),(1709,'Kondalam,Alampatti,Kondalampatti'),(1710,'Erode,Nasiyanur,Anur,Arasampatti,Thindal'),(1711,'Erode,Erode,Fort,Erode,East'),(1712,'Erode,Chettipalayam,Erode,Railway,Colony'),(1713,'Erode,Erode,Collectorate'),(1714,'Erode,Chidambaram,Erode,East'),(1715,'Edayankattuvalsu,Edayankattuvalsu'),(1716,'Erode,Erode,Collectorate'),(1717,'Erode,Chennimalai,Edayankattuvalsu'),(1718,'Avalpoondurai,Elumathur,Erode,Mathur,Athur,Emur,Avalpundurai'),(1719,'Erode,Chikkaiah,Naicker,College'),(1720,'Erode,Kasipalayam,Edayankattuvalsu'),(1721,'Erode,Chikkaiah,Naicker,College'),(1722,'Erode,Perundurai,Thindal'),(1723,'Chithode,Erode,Kavilipalayam'),(1724,'Komarapalayam,Kallankattuvalasu'),(1725,'Erode,Devagoundanur'),(1726,'Erode,Karungalpalayam'),(1727,'Attur,Erumaipatti,Kattur,Erumaipatti'),(1728,'Erode,Karungalpalayam'),(1729,'Erode,Surampatti,Erode,East'),(1730,'Erode,Marapalam,Karungalpalayam'),(1731,'Erode,Chikkaiah,Naicker,College'),(1732,'Bhavani,Periyapuliyur,Kavindapadi,Kanjikovil'),(1733,'Erode,Nasiyanur,Anur,Kadirampatti'),(1734,'Erode,Bommahalli,Erode,Collectorate'),(1735,'Erode,Erode,Fort,Erode,East'),(1736,'Erode,Erode,Railway,Colony'),(1737,'Erode,Chikkaiah,Naicker,College'),(1738,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(1739,'Erode,Teachers,Colony,Erode,Collectorate'),(1740,'Erode,Karungalpalayam'),(1741,'Erode,Erode,East'),(1742,'Erode,Kollampalayam,Erode,Railway,Colony'),(1743,'Erode,Nasiyanur,Anur,Arasampatti,Thindal'),(1744,'Chithode,Erode,Chittode'),(1745,'Erode,Erode,East'),(1746,'Erode,Rangampalayam,Edayankattuvalsu'),(1747,'Ennai,600096'),(1748,'Erode,Erode,East'),(1749,'Erode,Rangampalayam,Edayankattuvalsu'),(1750,'Karungalpalayam,Arungal,Karungalpalayam'),(1751,'Erode,Erode,Fort,Dusi,Erode,Collectorate'),(1752,'Erode,Mettunasuvanpalayam,Vasavi,College'),(1753,'Erode,Kavundachipalayam,Kanagapuram'),(1754,'Erode,Edayankattuvalsu'),(1755,'Coimbatore,Gandhimaanagar'),(1756,'Erode,Erode,Collectorate'),(1757,'Athani,Sathyamangalam,Chikkarasampalayam'),(1758,'Erode,Arur,Karur,Erode,Railway,Colony'),(1759,'Erode,Karungalpalayam'),(1760,'Erode,Thindal,Thindal'),(1761,'Erode,Pudur,Chettipalayam,Erode,Railway,Colony'),(1762,'Agraharam,Erode,Seerampalayam'),(1763,'Erode,Chikkaiah,Naicker,College'),(1764,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(1765,'Gangapuram,Chittode'),(1766,'Nadarmedu,Erode,Railway,Colony'),(1767,'Erode,Gangapuram,Chittode'),(1768,'Erode,Palamangalam,Sivagiri,Ammankoil'),(1769,'Erode,Pallipalayam'),(1770,'Erode,Surampatti,Edayankattuvalsu'),(1771,'Komarapalayam,Kallankattuvalasu'),(1772,'Erode,Thindal,Thindal'),(1773,'Erode,Erode,Railway,Colony'),(1774,'Erode,Emur,Chikkaiah,Naicker,College'),(1775,'Erode,Palayapalayam,Edayankattuvalsu'),(1776,'Erode,Palayapalayam,Thindal'),(1777,'Erode,Erode,East'),(1778,'Erode,Kathirampatti,Nanjanapuram,Thindal'),(1779,'Erode,Thindal,Kanagapuram'),(1780,'Erode,Palayapalayam,Edayankattuvalsu'),(1781,'Erode,Nadarmedu,Dharapuram,Erode,Railway,Colony'),(1782,'Erode,Karungalpalayam'),(1783,'Komarapalayam,Kallankattuvalasu'),(1784,'Erode,Surampatti,Edayankattuvalsu'),(1785,'Erode,Edayankattuvalsu'),(1786,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(1787,'Erode,Karungalpalayam'),(1788,'Erode,Rangampalayam,Edayankattuvalsu'),(1789,'Athur,Merkupathi'),(1790,'Thindal,Thindal'),(1791,'Ammapettai,Anthiyur,Bhavani,Ammapet,Ammapettai'),(1792,'Erode,Perundurai,Erode,Collectorate'),(1793,'Erode,Erode,Fort,Erode,East'),(1794,'Erode,Kollampalayam,Arur,Karur,Erode,Railway,Colony'),(1795,'Erode,Erode,East'),(1796,'Erode,Nasiyanur,Anur,Kadirampatti'),(1797,'Erode,Pallipalayam'),(1798,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(1799,'Ennai,Alandur(Reopened,W.E.F.6.6.05)'),(1800,'Erode,Chidambaram,Erode,East'),(1801,'Chikkaiah,Naicker,College,Chikkaiah,Naicker,College'),(1802,'Erode,Surampatti,Erode,East'),(1803,'Erode,Solar,Erode,Railway,Colony'),(1804,'Erode,Chikkaiah,Naicker,College'),(1805,'Erode,Perundurai,Thindal,Thindal'),(1806,'Erode,Kalpalayam,Erode,Railway,Colony'),(1807,'Erode,Perundurai,Thindal,Thindal'),(1808,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(1809,'Thindal,Thindal'),(1810,'Bhavani,Dharmapuri,Kalichettipalayam.,Mettupalayam'),(1811,'Erode,Erode,Fort,Marapalam,Erode,East'),(1812,'Erode,Erode,East'),(1813,'Erode,Perundurai,Erode,Collectorate'),(1814,'46,Pudur,Erode,Kollampalayam,Moolapalayam,Pudur,Erode,Railway,Colony'),(1815,'Erode,Periya,Valasu,Chikkaiah,Naicker,College'),(1816,'Erode,Erode,East'),(1817,'Erode,Kollampalayam,Arur,Karur,Erode,Railway,Colony'),(1818,'Erode,Palayapalayam,Thindal'),(1819,'Perundurai,Ingur'),(1820,'Erode,Chettipalayam,Erode,Railway,Colony'),(1821,'Erode,Kasipalayam,Pudur,Solar,Erode,Railway,Colony'),(1822,'Emur,Chikkaiah,Naicker,College'),(1823,'Erode,Perundurai,Erode,Collectorate'),(1824,'Agraharam,Erode,Peria,Agraharam'),(1825,'Coimbatore,Edayapalayam'),(1826,'Erode,Perundurai,Kanagapuram'),(1827,'Erode,Kollampalayam,Erode,Railway,Colony'),(1828,'Erode,Kanagapuram'),(1829,'Erode,Railway,Colony,Erode,Railway,Colony'),(1830,'Erode,Ingur'),(1831,'Erode,Thindal'),(1832,'Erode,Perundurai,Thindal,Thindal'),(1833,'Erode,Karungalpalayam'),(1834,'Erode,Periyar,Nagar,Erode,East'),(1835,'Coimbatore,Krishnaswamy,Nagar'),(1836,'Erode,Chikkaiah,Naicker,College'),(1837,'Erode,Perundurai,Ingur'),(1838,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(1839,'Erode,Edayankattuvalsu'),(1840,'Erode,Perundurai,Amoor,Erode,Collectorate'),(1841,'Erode,Ambur,Elumathur'),(1842,'Erode,Periyar,Nagar,Erode,East'),(1843,'Erode,Chikkaiah,Naicker,College'),(1844,'Erode,Perundurai,Erode,Collectorate'),(1845,'Agraharam,Erode,Peria,Agraharam'),(1846,'Erode,Erode,Fort,Erode,East'),(1847,'Bhavani,Kali,Vasavi,College'),(1848,'Erode,Thirunagar,Colony,Karungalpalayam'),(1849,'Erode,Karungalpalayam'),(1850,'Kollampalayam,Moolapalayam,Erode,Railway,Colony'),(1851,'Erode,Erode,Railway,Colony'),(1852,'Elavamalai,Vasavi,College'),(1853,'Erode,Erode,Fort,Erode,East'),(1854,'Perundurai,Ingur'),(1855,'Erode,Perundurai,Ingur'),(1856,'Nanjaiuthukuli,Elumathur'),(1857,'Gobichettipalayam,Kullampalayam,Chettipalayam,Kadukkampalayam'),(1858,'Erode,Thindal'),(1859,'Erode,Erode,Railway,Colony'),(1860,'Erode,Kanagapuram'),(1861,'Chinnamalai,Erode,Moolapalayam,Nadarmedu,Erode,Railway,Colony'),(1862,'Seerampalayam,Seerampalayam'),(1863,'Kanagapuram,Kanagapuram'),(1864,'Kanagapuram,Kanagapuram'),(1865,'Erode,Erode,Collectorate'),(1866,'Erode,Erode,Collectorate'),(1867,'Erode,Nasiyanur,Anur,Kadirampatti'),(1868,'Erode,Elumathur'),(1869,'Pallipalayam,Pallipalayam'),(1870,'Erode,Marapalam,Erode,East'),(1871,'Chithode,Kanji,Chittode'),(1872,'Chikkaiah,Naicker,College,Veerappanchatram,Chikkaiah,Naicker,College'),(1873,'Ennai,Tondiarpet,Bazaar'),(1874,'Erode,Erode,East'),(1875,'Bhavani,Mettunasuvanpalayam,Vasavi,College'),(1876,'Erode,Erode,East'),(1877,'Perundurai,Vadamugam,Vellode,Chennimalai,638060'),(1878,'Erode,Chittode'),(1879,'Kali,Kottavadi'),(1880,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(1881,'Erode,Alampalayam,Pappampalayam'),(1882,'Perundurai,Kanji,Kanjikovil,Ingur'),(1883,'Appakudal,Appakudal'),(1884,'Chithode,Kanji,Kanjikovil'),(1885,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(1886,'Erode,Chikkaiah,Naicker,College'),(1887,'Chithode,Chittode'),(1888,'Erode,Perundurai,Erode,Collectorate'),(1889,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(1890,'Erode,Erode,Fort,Erode,East'),(1891,'Erode,Marapalam,Surampatti,Erode,East'),(1892,'Erode,Pudur,Solar,Arachi,Erode,Railway,Colony'),(1893,'Erode,Erode,East'),(1894,'Erode,Chettipalayam,Erode,Railway,Colony'),(1895,'Erode,Kadirampatti'),(1896,'Anur,Jawahar,Mills'),(1897,'Karungalpalayam,Karungalpalayam'),(1898,'Koottapalli,Koottapalli'),(1899,'Erode,Erode,East'),(1900,'Erode,Attur,Kattur,Erode,East'),(1901,'Erode,Erode,East'),(1902,'Erode,Kathirampatti,Kadirampatti'),(1903,'Erode,Surampatti,Erode,East'),(1904,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(1905,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(1906,'Erode,Perundurai,Erode,Collectorate'),(1907,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(1908,'Erode,Erode,East'),(1909,'Erode,Erode,East'),(1910,'Erode,Perundurai,Erode,Collectorate'),(1911,'Erode,Chidambaram,Erode,East'),(1912,'Erode,Thindal'),(1913,'Erode,Sivagiri,Ammankoil'),(1914,'Erode,Perundurai,Erode,Collectorate'),(1915,'Erode,Karungalpalayam'),(1916,'Erode,Kollampalayam,Erode,Railway,Colony'),(1917,'Erode,Surampatti,Edayankattuvalsu'),(1918,'Erode,Surampatti,Erode,East'),(1919,'Erode,Erode,Collectorate'),(1920,'Coimbatore,Konavaikalpalayam'),(1921,'Bhavani,Erode,Peria,Agraharam'),(1922,'Erode,Perundurai,Illupur,Ingur'),(1923,'Pappampalayam,Spb,Colony,Alampalayam,Seerampalayam'),(1924,'Erode,Kathirampatti,Perundurai,Kadirampatti'),(1925,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(1926,'Erode,Erode,Fort,Erode,Collectorate'),(1927,'Pudupalayam,Kanagapuram'),(1928,'Leigh,Bazaar,Leigh,Bazaar'),(1929,'Erode,Erode,Fort,Erode,Collectorate'),(1930,'Erode,Chennimalai,Edayankattuvalsu'),(1931,'Erode,Chikkaiah,Naicker,College'),(1932,'Erode,Chennimalai,Ingur'),(1933,'Erode,Erode,Fort,Erode,East'),(1934,'Erode,Surampatti,Edayankattuvalsu'),(1935,'Komarapalayam,Kallankattuvalasu,Kallankattuvalasu'),(1936,'Erode,Moolapalayam,Erode,Railway,Colony'),(1937,'Anur,Chettipalayam,Coimbatore,Konavaikalpalayam'),(1938,'Erode,Erode,Fort,Erode,East'),(1939,'Erode,Perundurai,Thindal'),(1940,'Erode,Sampath,Nagar,Erode,Collectorate'),(1941,'Erode,Chikkaiah,Naicker,College'),(1942,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(1943,'Erode,Erode,Fort,Erode,East'),(1944,'Erode,Nanjaiuthukuli,Elumathur'),(1945,'Erode,Palayapalayam,Erode,Collectorate'),(1946,'Erode,Erode,Collectorate'),(1947,'Erode,Sampath,Nagar,Erode,Collectorate'),(1948,'Erode,Erode,Collectorate'),(1949,'Attayampatti,Attayampatti'),(1950,'Erode,Kavilipalayam'),(1951,'Ennai,Maduravoyal'),(1952,'Erode,Vasavi,College'),(1953,'Erode,Erode,East'),(1954,'Erode,Kollampalayam,Erode,Railway,Colony'),(1955,'Erode,Perundurai,Erode,Collectorate'),(1956,'Erode,Thirunagar,Colony,Karungalpalayam'),(1957,'Erode,Erode,Fort,Muncipal,Colony,Chikkaiah,Naicker,College'),(1958,'Arasampatti,Thindal'),(1959,'Erode,Erode,Collectorate'),(1960,'Erode,Solar,Arur,Karur,Erode,Railway,Colony'),(1961,'Erode,Erode,Collectorate'),(1962,'Kasthuripatti,Kasthuripatti'),(1963,'Erode,Nanjaiuthukuli,Elumathur'),(1964,'Erode,Erode,East'),(1965,'Erode,Erode,Collectorate'),(1966,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(1967,'Erode,Erode,East'),(1968,'Erode,Surampatti,Erode,East'),(1969,'Palayapalayam,Perundurai,Erode,Collectorate'),(1970,'Perundurai,Thindal,Thindal'),(1971,'Erode,Thirunagar,Colony,Karungalpalayam'),(1972,'Erode,Moolapalayam,Erode,Railway,Colony'),(1973,'Erode,Kokkarayanpettai,Pudur,Pappampalayam'),(1974,'Erode,Edayankattuvalsu'),(1975,'Erode,Chennimalai,Erode,Railway,Colony'),(1976,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(1977,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(1978,'Erode,Karungalpalayam'),(1979,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(1980,'Erode,Erode,Fort,Erode,East'),(1981,'Erode,Palayapalayam,Perundurai,Thindal,Chennai,Thindal'),(1982,'Erode,Perundurai,Thindal'),(1983,'Erode,Kalanivasal,Erode,Railway,Colony'),(1984,'Emur,Chikkaiah,Naicker,College'),(1985,'Perundurai,Kanji,Kanjikovil,Ingur'),(1986,'Erode,Erode,Fort,Erode,East'),(1987,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(1988,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(1989,'Erode,Erode,Fort,Erode,East'),(1990,'Erode,Edayankattuvalsu'),(1991,'Chithode,Chittode'),(1992,'Erode,Erode,Fort,Erode,East'),(1993,'Erode,Surampatti,Edayankattuvalsu'),(1994,'Elumathur,Erode,Mathur,Athur,Elumathur'),(1995,'Erode,Avadi,Ganapathy,Chikkaiah,Naicker,College'),(1996,'Erode,Chikkaiah,Naicker,College'),(1997,'Erode,Edayankattuvalsu'),(1998,'Erode,Kollampalayam,Erode,Railway,Colony'),(1999,'Erode,Chikkaiah,Naicker,College'),(2000,'Erode,Palayapalayam,Erode,Collectorate'),(2001,'Erode,Periyar,Nagar,Erode,East'),(2002,'Erode,Erode,East'),(2003,'Erode,Kanchipuram,Edayankattuvalsu'),(2004,'Chennimalai,Kangayam,Basuvapatti'),(2005,'Erode,Thindal,Thindal'),(2006,'Erode,Periya,Valasu,Veerappanchatram,Chikkaiah,Naicker,College'),(2007,'Chettipatti,Chettipatti'),(2008,'Erode,Erode,East'),(2009,'Erode,Chittode'),(2010,'Erode,Karungalpalayam'),(2011,'Erode,Thindal'),(2012,'Erode,Thindal'),(2013,'Erode,Sampath,Nagar,Erode,Collectorate'),(2014,'Erode,Edayankattuvalsu'),(2015,'Erode,Kasipalayam,Edayankattuvalsu'),(2016,'Erode,Rangampalayam,Edayankattuvalsu'),(2017,'Erode,Perundurai,Erode,Collectorate'),(2018,'Erode,Edayankattuvalsu'),(2019,'Pallipalayam,Pallipalayam'),(2020,'Perundurai,Amoor,Erode,Collectorate'),(2021,'Erode,Erode,Collectorate'),(2022,'Erode,Erode,Fort,Erode,East'),(2023,'Edayankattuvalsu,Edayankattuvalsu'),(2024,'Erode,Erode,East'),(2025,'Erode,Nasiyanur,Anur,Kadirampatti'),(2026,'Erode,Erode,East'),(2027,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(2028,'Erode,Karungalpalayam'),(2029,'Agraharam,Pappampalayam,Pappampalayam'),(2030,'Erode,Chikkaiah,Naicker,College'),(2031,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(2032,'Erode,Chikkaiah,Naicker,College'),(2033,'Erode,Attur,Tiruchengodu,North'),(2034,'Erode,Nichampalayam'),(2035,'Peria,Agraharam,Peria,Agraharam'),(2036,'Ellapalayam,Emur,Chikkaiah,Naicker,College'),(2037,'Kadirampatti,Kadirampatti'),(2038,'Erode,Palayapalayam,Erode,Collectorate'),(2039,'Erode,Pallipalayam'),(2040,'Kurichi,Punjai,Kalamangalam,Akkur,Athipalayam,Ganapathipalayam'),(2041,'Erode,Soolai,Chikkaiah,Naicker,College'),(2042,'Erode,Periya,Valasu,Chikkaiah,Naicker,College'),(2043,'Erode,Perundurai,Thindal'),(2044,'Erode,Periyar,Nagar,Erode,East'),(2045,'Erode,Erode,East'),(2046,'Dharapuram,Iruppu,Karuvampalayam'),(2047,'Erode,Thindal,Thindal'),(2048,'Iruppu,Tea,Nagar'),(2049,'Erode,Erode,East'),(2050,'Erode,Dharapuram,Erode,Collectorate'),(2051,'Erode,Veerappanchatram,Voc,Park,Karungalpalayam'),(2052,'Erode,Perundurai,Thindal'),(2053,'Erode,Thirunagar,Colony,Karungalpalayam'),(2054,'Erode,Perundurai,Erode,Collectorate'),(2055,'Ennai,Anna,Road'),(2056,'Erode,Perundurai,Thindal,Thindal'),(2057,'Erode,Thindal'),(2058,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(2059,'Erode,Arasampalayam,Attur,Kattur,Seerampalayam'),(2060,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(2061,'Erode,Thindal'),(2062,'Erode,Erode,Railway,Colony'),(2063,'Erode,Nasiyanur,Anur,Kadirampatti'),(2064,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(2065,'Erode,Edayankattuvalsu'),(2066,'Erode,Perundurai,Kanji,Kanjikovil,Ingur'),(2067,'Erode,Moolapalayam,Erode,Railway,Colony'),(2068,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(2069,'Arachalur,Erode,Moolapalayam,Erode,Railway,Colony'),(2070,'Erode,Erode,East'),(2071,'Erode,Pudur,Karukkampalayam,Erode,Railway,Colony'),(2072,'Erode,Arur,Karur,Erode,East'),(2073,'Erode,Palayapalayam,Erode,Collectorate'),(2074,'Erode,Railway,Colony,Chennimalai,Erode,East'),(2075,'Kollampalayam,Solar,Erode,Railway,Colony'),(2076,'Erode,Periya,Valasu,Veerappanchatram,Chikkaiah,Naicker,College'),(2077,'Erode,Erode,Fort,Erode,East'),(2078,'Erode,Moolapalayam,Erode,Railway,Colony'),(2079,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(2080,'Chithode,Erode,Pudur,Chittode'),(2081,'Erode,Lakkapuram,Erode,Railway,Colony'),(2082,'Palayapalayam,Perundurai,Erode,Collectorate'),(2083,'Erode,Periyar,Nagar,Erode,East'),(2084,'Chithode,Chittode'),(2085,'Erode,Solar,Erode,Railway,Colony'),(2086,'Erode,Karungalpalayam'),(2087,'Erode,Erode,East'),(2088,'Erode,Chikkaiah,Naicker,College'),(2089,'Evur,Idappadi,Kaveripatti'),(2090,'Erode,Nasiyanur,Anur,Arasampatti,Kadirampatti'),(2091,'Erode,Komarapalayam,Bhavani,Kudal'),(2092,'Erode,Karungalpalayam'),(2093,'Erode,Thindal,Arasampatti,Thindal'),(2094,'Erode,Karungalpalayam'),(2095,'Erode,Teachers,Colony,Erode,Collectorate'),(2096,'Erode,Seerampalayam'),(2097,'Erode,Soolai,Chikkaiah,Naicker,College'),(2098,'Erode,Edayankattuvalsu'),(2099,'Erode,Erode,East'),(2100,'Erode,Sampath,Nagar,Erode,Collectorate'),(2101,'Erode,Kali,Kadukkampalayam'),(2102,'Erode,Amur,Palakarai'),(2103,'Erode,Moolapalayam,Erode,Railway,Colony'),(2104,'Erode,Arimalam,Erode,Collectorate'),(2105,'Erode,Arni,Thindal'),(2106,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(2107,'Erode,Erode,Fort,Erode,East'),(2108,'Erode,Edayankattuvalsu'),(2109,'Erode,Lakkapuram,Pudur,Solar,Arachi,Erode,Railway,Colony'),(2110,'Erode,Erode,East'),(2111,'Erode,Erode,Fort,Kanchipuram,Erode,East'),(2112,'Erode,Pudur,Suriyampalayam,Peria,Agraharam'),(2113,'Erode,Perundurai,Erode,Collectorate'),(2114,'Erode,Erode,Railway,Colony'),(2115,'Erode,Spb,Colony,Spb,Colony'),(2116,'Erode,Tiruchengodu,North'),(2117,'Erode,Thindal,Thindal'),(2118,'Erode,Chikkaiah,Naicker,College'),(2119,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(2120,'Erode,Chittode'),(2121,'Agraharam,Dharmapuri,Public,Offices'),(2122,'Erode,Teachers,Colony,Edayankattuvalsu'),(2123,'Andipalayam,Solar,Arur,Karur,Erode,Railway,Colony'),(2124,'Erode,Lakkapuram,Pudur,Erode,Railway,Colony'),(2125,'Erode,Erode,Collectorate'),(2126,'Erode,Erode,Collectorate'),(2127,'Erode,Erode,Fort,Erode,East'),(2128,'Erode,Perundurai,Edayankattuvalsu'),(2129,'Agraharam,Erode,Peria,Agraharam'),(2130,'Erode,Thindal'),(2131,'Erode,Pudur,Solar,Erode,Railway,Colony'),(2132,'Erode,Emur,Chikkaiah,Naicker,College'),(2133,'Erode,Surampatti,Karai,Erode,East'),(2134,'Erode,Karungalpalayam'),(2135,'Erode,Chikkaiah,Naicker,College'),(2136,'Erode,Surampatti,Erode,East'),(2137,'Erode,Thindal,Thindal'),(2138,'Erode,Karungalpalayam'),(2139,'Erode,Erode,Collectorate'),(2140,'Erode,Periyar,Nagar,Erode,East'),(2141,'Erode,Kali,Vasavi,College'),(2142,'Erode,Erode,East'),(2143,'Anthiyur,Alampalayam'),(2144,'Erode,Solar,Erode,Railway,Colony'),(2145,'Erode,Karungalpalayam'),(2146,'Erode,Edayankattuvalsu'),(2147,'Erode,Edayankattuvalsu'),(2148,'Erode,Perundurai,Thindal'),(2149,'Erode,Teachers,Colony,Erode,Collectorate'),(2150,'Erode,Muncipal,Colony,Karungalpalayam'),(2151,'Erode,Atur,Erode,East'),(2152,'Erode,Soolai,Kadirampatti'),(2153,'Erode,Edayankattuvalsu'),(2154,'Erode,Nadarmedu,Erode,Railway,Colony'),(2155,'Erode,Lakkapuram,Erode,Railway,Colony'),(2156,'Erode,Erode,Fort,Erode,East'),(2157,'Vallipuram,Alapatti,Bodupatti'),(2158,'Erode,Erode,East'),(2159,'Erode,Palayapalayam,Erode,Collectorate'),(2160,'Erode,Thirunagar,Colony,Karungalpalayam'),(2161,'Bhavani,Chithode,Erode,Chittode'),(2162,'Pallipalayam,Pallipalayam'),(2163,'Erode,Nadarmedu,Erode,Railway,Colony'),(2164,'Erode,Erode,Collectorate'),(2165,'Erode,Erode,Fort,Erode,East'),(2166,'Erode,Chettipalayam,Erode,Railway,Colony'),(2167,'Erode,Edayankattuvalsu'),(2168,'Erode,Arasampatti,Edayankattuvalsu'),(2169,'Erode,Erode,Railway,Colony'),(2170,'Erode,Bhavani,Kudal'),(2171,'Erode,Thindal,Thindal'),(2172,'Erode,Erode,East'),(2173,'Erode,Nadarmedu,Erode,Railway,Colony'),(2174,'Bhavani,Elavamalai,Periyar,Nagar,Kali,Vasavi,College'),(2175,'Erode,Kollampalayam,Erode,Railway,Colony'),(2176,'Erode,Thindal,Thindal'),(2177,'Alapatti,Kalapatti,Vellanaipatti'),(2178,'Thindal,Thindal'),(2179,'Erode,Thindal,Thindal'),(2180,'Erode,Chikkaiah,Naicker,College'),(2181,'Perundurai,Thindal,Thindal'),(2182,'Erode,Chikkaiah,Naicker,College'),(2183,'Erode,Aladi,Erode,Railway,Colony'),(2184,'Erode,Erode,Railway,Colony'),(2185,'Erode,Erode,Fort,Erode,East'),(2186,'Erode,Athipalayam,Chennimalai,Enathi,Kanagapuram'),(2187,'Erode,Edayankattuvalsu'),(2188,'Erode,Edayankattuvalsu'),(2189,'Komarapalayam,Kallankattuvalasu'),(2190,'Rangampalayam,Chettipalayam,Erode,Railway,Colony'),(2191,'Erode,Arasampatti,Thindal'),(2192,'Erode,Nasiyanur,Periyar,Nagar,Anur,Kadirampatti'),(2193,'Erode,Chikkaiah,Naicker,College'),(2194,'Chithode,Chittode'),(2195,'Erode,Karungalpalayam,Andiyur,Arungal,Karungalpalayam'),(2196,'Erode,Chidambaram,Erode,East'),(2197,'Erode,Karungalpalayam'),(2198,'Erode,Erode,Fort,Erode,East'),(2199,'Morur,Morur'),(2200,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(2201,'Annur,Karai,Kariampalayam,Karegoundenpalayam'),(2202,'Erode,Chikkaiah,Naicker,College'),(2203,'Anur,Eyyanur,Marakkadai'),(2204,'Erode,Nasiyanur,Anur,Thindal'),(2205,'Erode,Voc,Park,Karungalpalayam'),(2206,'Erode,Edayankattuvalsu'),(2207,'Erode,Thindal,Thindal'),(2208,'Chithode,Erode,Gangapuram,Chittode'),(2209,'Palayapalayam,Thindal'),(2210,'Erode,Karungalpalayam'),(2211,'Erode,Chennimalai,Edayankattuvalsu'),(2212,'Erode,Solar,Erode,Railway,Colony'),(2213,'Tiruchengodu,North,Tiruchengodu,North'),(2214,'Attur,Chennimalai,Kattur,Basuvapatti'),(2215,'Ammapettai,Erode,Ammapet,Edayankattuvalsu'),(2216,'Erode,Erode,Collectorate'),(2217,'Devanankurichi,Devanankurichi'),(2218,'Erode,Thindal,Thindal'),(2219,'Palayapalayam,Erode,Collectorate'),(2220,'Erode,Chikkaiah,Naicker,College'),(2221,'Perundurai,Ingur'),(2222,'Erode,Karungalpalayam'),(2223,'Erode,Marapalam,Erode,East'),(2224,'Erode,Erode,East'),(2225,'Chithode,Chittode'),(2226,'Chithode,Erode,Chittode'),(2227,'Agraharam,Bhavani,Erode,Peria,Agraharam'),(2228,'Zamin,Elampalli,Zamin,Elampalli'),(2229,'Chettipalayam,Erode,Railway,Colony'),(2230,'Erode,Edayankattuvalsu'),(2231,'Erode,Rangampalayam,Chennimalai,Edayankattuvalsu'),(2232,'Erode,Sampath,Nagar,Erode,Collectorate'),(2233,'Erode,Edayankattuvalsu'),(2234,'Erode,Kambiliyampatti'),(2235,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(2236,'Erode,Thindal'),(2237,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(2238,'Koottapalli,Koottapalli'),(2239,'Erode,Nasiyanur,Anur,Karamadai,Kadirampatti'),(2240,'Bhavani,Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(2241,'Erode,Perundurai,Ingur'),(2242,'Jambai,Dalavoipettai'),(2243,'Erode,Teachers,Colony,Erode,Collectorate'),(2244,'Perundurai,Kambiliyampatti'),(2245,'Erode,Thindal'),(2246,'Erode,Erode,Collectorate'),(2247,'Erode,Erode,East'),(2248,'Erode,Palayapalayam,Erode,Collectorate'),(2249,'Erode,Karungalpalayam'),(2250,'Erode,Chettipalayam,Erode,Railway,Colony'),(2251,'Peria,Agraharam,Peria,Agraharam'),(2252,'Erode,Erode,East'),(2253,'Erode,Pudur,Unjalur,Avadi,Kangayam,Elumathur'),(2254,'Erode,Gobichettipalayam,Chettipalayam,Kadukkampalayam'),(2255,'Elur,Belur,(Salem)'),(2256,'Erode,Chikkaiah,Naicker,College'),(2257,'Erode,Kaspapettai,Avalpundurai'),(2258,'Erode,Nadarmedu,Erode,Railway,Colony'),(2259,'Erode,Nanjaiuthukuli,Elumathur'),(2260,'Erode,Chidambaram,Erode,East'),(2261,'Erode,Erode,Collectorate'),(2262,'Erode,Seerampalayam'),(2263,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(2264,'Erode,Teachers,Colony,Erode,Collectorate'),(2265,'Bhavani,Chithode,Chittode'),(2266,'Erode,Chikkaiah,Naicker,College'),(2267,'Erode,Moolapalayam,Arur,Karur,Erode,Railway,Colony'),(2268,'Anur,Eyyanur,Jawahar,Mills'),(2269,'Erode,Erode,Fort,Erode,East'),(2270,'Ganapathipalayam,Kurichi,Akkur,Athipalayam,Ganapathipalayam'),(2271,'Agraharam,Erode,Peria,Agraharam'),(2272,'Erode,Chettipalayam,Erode,Railway,Colony'),(2273,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(2274,'Erode,Erode,East'),(2275,'Erode,Surampatti,Edayankattuvalsu'),(2276,'Erode,Erode,Fort,Erode,East'),(2277,'Erode,Erode,Fort,Erode,East'),(2278,'Erode,Erode,Fort,Muncipal,Colony,Chikkaiah,Naicker,College'),(2279,'Chithode,Erode,Gangapuram,Chittode'),(2280,'Erode,Thindal,Thindal'),(2281,'Erode,Erode,Railway,Colony'),(2282,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(2283,'Erode,Erode,Railway,Colony'),(2284,'Erode,Soolai,Chikkaiah,Naicker,College'),(2285,'Erode,Chikkaiah,Naicker,College'),(2286,'Erode,Araipalayam,Thamaraipalayam'),(2287,'Erode,Erode,Collectorate'),(2288,'Andipalayam,Koottapalli'),(2289,'Erode,Karungalpalayam'),(2290,'Erode,Chidambaram,Erode,East'),(2291,'Vairapalayam,Karungalpalayam'),(2292,'Erode,Chikkaiah,Naicker,College'),(2293,'Erode,Chikkaiah,Naicker,College'),(2294,'Bhavani,Chithode,Erode,Chittode'),(2295,'Erode,Chettipalayam,Erode,Railway,Colony'),(2296,'Erode,Erode,East'),(2297,'Erode,Moolapalayam,Arur,Karur,Erode,Railway,Colony'),(2298,'Agaram,Dinnabelur'),(2299,'Erode,Erode,East'),(2300,'Vallipurathanpalayam,Kanagapuram'),(2301,'Gobichettipalayam,Chettipalayam,Iruppu,Kurichi-Kunnathur'),(2302,'Erode,Erode,East'),(2303,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(2304,'Kavandapadi,Kalichettipalayam.,Mettupalayam'),(2305,'Bhavani,Erode,Bhavani,Kudal'),(2306,'Erode,Kadirampatti'),(2307,'Erode,Sampath,Nagar,Erode,Collectorate'),(2308,'Nagadevampalayam,Kadukkampalayam'),(2309,'Iruppu,Karuvampalayam'),(2310,'Pallipalayam,Pallipalayam'),(2311,'Erode,Kadirampatti'),(2312,'Erode,Emur,Chikkaiah,Naicker,College'),(2313,'Erode,Karungalpalayam'),(2314,'Chithode,Gangapuram,Chittode'),(2315,'Bhavani,Erode,Kali,Bhavani,Kudal'),(2316,'Erode,Karungalpalayam'),(2317,'Erode,Chikkaiah,Naicker,College'),(2318,'Erode,Dharapuram,Erode,Railway,Colony'),(2319,'Iruppu,Ayyankalipalayam'),(2320,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(2321,'Erode,Arur,Karur,Erode,Railway,Colony'),(2322,'Jawahar,Mills,Jawahar,Mills'),(2323,'Erode,Periyar,Nagar,Erode,East'),(2324,'Erode,Kollampalayam,Erode,Railway,Colony'),(2325,'Coimbatore,Gandhimaanagar'),(2326,'Erode,Erode,East'),(2327,'Erode,Pallipalayam'),(2328,'Erode,Kollampalayam,Erode,Railway,Colony'),(2329,'Erode,Erode,Fort,Erode,East'),(2330,'Iruppu,Khaderpet,Kallampalayam,Road'),(2331,'Erode,Arkadu,Chikkaiah,Naicker,College'),(2332,'Komarapalayam,Kallankattuvalasu'),(2333,'Erode,Edayankattuvalsu'),(2334,'Erode,Muncipal,Colony,Veerappanchatram,Chikkaiah,Naicker,College'),(2335,'Erode,Thindal'),(2336,'Erode,Erode,Fort,Karungalpalayam'),(2337,'Erode,Veerappanchatram,Karungalpalayam'),(2338,'Erode,Erode,Collectorate'),(2339,'Kalichettipalayam.,Mettupalayam,Kalichettipalayam.,Mettupalayam'),(2340,'Muncipal,Colony,Veerappanchatram,Erode,Collectorate'),(2341,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(2342,'Erode,Soolai,Erode,Collectorate'),(2343,'Erode,Sampath,Nagar,Erode,Collectorate'),(2344,'Erode,Karungalpalayam'),(2345,'Erode,Perundurai,Erode,Collectorate'),(2346,'Bhavani,Erode,Kadappanallur,Nallur,Allur,Appanallur,Ammapettai'),(2347,'Erode,Thindal,Thindal'),(2348,'Erode,Erode,Fort,Erode,East'),(2349,'Erode,Vairapalayam,Karungalpalayam'),(2350,'Erode,East,Erode,East'),(2351,'Erode,Muncipal,Colony,Karungalpalayam'),(2352,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(2353,'Erode,Pudur,Erode,Railway,Colony'),(2354,'Avadi,Tiruchengodu,North'),(2355,'Erode,Chikkaiah,Naicker,College'),(2356,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(2357,'Erode,Periyar,Nagar,Edayankattuvalsu'),(2358,'Bhavani,Bhavani,Kudal'),(2359,'Ennai,Karanai,Medavakkam,'),(2360,'Erode,Erode,Collectorate'),(2361,'Anur,Eyyanur,Jawahar,Mills'),(2362,'Erode,Perundurai,Thindal,Thindal'),(2363,'Erode,Thindal'),(2364,'Agraharam,Ayal,Seerampalayam'),(2365,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(2366,'Erode,Karungalpalayam'),(2367,'Agraharam,Erode,Seerampalayam'),(2368,'Erode,Surampatti,Edayankattuvalsu'),(2369,'Erode,Palayapalayam,Teachers,Colony,Erode,Collectorate'),(2370,'Erode,Erode,Collectorate'),(2371,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(2372,'Athur,Thindal'),(2373,'Erode,Perundurai,Chettinad,Thindal'),(2374,'Erode,Perundurai,Erode,Collectorate'),(2375,'Erode,Thirunagar,Colony,Karungalpalayam'),(2376,'Erode,Lakkapuram,Pudur,Erode,Railway,Colony'),(2377,'Erode,Chettipalayam,Erode,Railway,Colony'),(2378,'Arur,Karur,Mudiganam'),(2379,'Erode,Perundurai,Thindal,Thindal'),(2380,'Arasampatti,Kadirampatti'),(2381,'Pallipalayam,Pallipalayam'),(2382,'Bhavani,Chithode,Chittode'),(2383,'Erode,Erode,Railway,Colony'),(2384,'Erode,Erode,East'),(2385,'Erode,Palayapalayam,Erode,Collectorate'),(2386,'Erode,Thindal'),(2387,'Erode,Nasiyanur,Sampath,Nagar,Anur,Erode,Collectorate'),(2388,'Erode,Thindal,Thindal'),(2389,'Erode,Erode,East'),(2390,'Thindal,Thindal'),(2391,'Erode,Surampatti,Edayankattuvalsu'),(2392,'Erode,Kamaraj,Nagar,Kanagapuram'),(2393,'Erode,Edayankattuvalsu'),(2394,'Erode,Pallipalayam'),(2395,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(2396,'Bhavani,Bhavani,Kudal'),(2397,'Injampalli,Elumathur'),(2398,'Alampalayam,Alampalayam'),(2399,'Coimbatore,Vadavalli'),(2400,'Bharathiyar,University,Bharathiyar,University'),(2401,'Erode,Periyar,Nagar,Erode,East'),(2402,'Erode,Erode,East'),(2403,'Erode,Erode,East'),(2404,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(2405,'Erode,Edayankattuvalsu'),(2406,'Erode,Erode,East'),(2407,'Erode,Perundurai,Edayankattuvalsu'),(2408,'Erode,Moolapalayam,Erode,Railway,Colony'),(2409,'Erode,Chettipalayam,Erode,Railway,Colony'),(2410,'Erode,Peria,Agraharam'),(2411,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(2412,'Erode,Erode,Fort,Erode,East'),(2413,'Erode,Erode,East'),(2414,'Erode,Ganapathi,Nagar,Thindal'),(2415,'Erode,Erode,East'),(2416,'Erode,Pallipalayam'),(2417,'Erode,Periyar,Nagar,Erode,East'),(2418,'Bhavani,Chithode,Erode,Chittode'),(2419,'Erode,Erode,Fort,Erode,East'),(2420,'Erode,Ayal,Erode,Collectorate'),(2421,'Erode,Chittode'),(2422,'Erode,Vasavi,College'),(2423,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(2424,'Erode,Erode,Fort,Erode,Collectorate'),(2425,'Erode,Moolapalayam,Erode,Railway,Colony'),(2426,'Erode,Nanjaiuthukuli,Elumathur'),(2427,'Erode,Erode,Collectorate'),(2428,'Erode,Teachers,Colony,Edayankattuvalsu'),(2429,'Erode,Chikkaiah,Naicker,College'),(2430,'Erode,Erode,Collectorate'),(2431,'Erode,Edayankattuvalsu'),(2432,'Bhavani,Erode,Pudur,Peria,Agraharam'),(2433,'Ayyamperumalpatti,Ayyamperumalpatti'),(2434,'Erode,Moolapalayam,Arur,Karur,Erode,Railway,Colony'),(2435,'Erode,Erode,Fort,Erode,East'),(2436,'Erode,Erode,Fort,Erode,East'),(2437,'Erode,Karungalpalayam'),(2438,'Eral,Dasanaickenpatti'),(2439,'Erode,Chikkaiah,Naicker,College'),(2440,'Erode,Kasipalayam,Chennimalai,Erode,Railway,Colony'),(2441,'Erode,Erode,East'),(2442,'Punjai,Palatholuvu,Chennimalai,Koothampalayam'),(2443,'Attur,Kattur,Kallankattuvalasu'),(2444,'Nasiyanur,Thindal,Anur,Thindal'),(2445,'Erode,Erode,East'),(2446,'Erode,Thindal,Thindal'),(2447,'Erode,Thirunagar,Colony,Erode,East'),(2448,'Erode,Karungalpalayam'),(2449,'Erode,Erode,Railway,Colony'),(2450,'Erode,Pudur,Peria,Agraharam'),(2451,'Komarapalayam,Kallankattuvalasu'),(2452,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(2453,'Erode,Erode,East'),(2454,'Erode,Kollampalayam,Moolapalayam,Arur,Karur,Erode,Railway,Colony'),(2455,'Erode,Marapalam,Surampatti,Erode,East'),(2456,'Erode,Perundurai,Erode,Collectorate'),(2457,'Erode,Periyar,Nagar,Edayankattuvalsu'),(2458,'Erode,Kollampalayam,Erode,Railway,Colony'),(2459,'Pudur,Coimbatore,Siddhapudur'),(2460,'Chithode,Erode,Gangapuram,Chittode'),(2461,'Erode,Ellapalayam,Emur,Chikkaiah,Naicker,College'),(2462,'Erode,Erode,Fort,Erode,East'),(2463,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(2464,'Chithode,Erode,Sellappampalayam,Chittode'),(2465,'Erode,Rangampalayam,Edayankattuvalsu'),(2466,'Erode,Surampatti,Seerampalayam'),(2467,'Erode,Erode,East'),(2468,'Agraharam,Bhavani,Erode,Peria,Agraharam'),(2469,'Erode,Erode,Fort,Erode,East'),(2470,'Erode,Chettipalayam,Erode,Railway,Colony'),(2471,'Erode,Rangampalayam,Edayankattuvalsu'),(2472,'Erode,Surampatti,Edayankattuvalsu'),(2473,'Erode,Kalpalayam,Erode,Railway,Colony'),(2474,'Erode,Edayankattuvalsu'),(2475,'Erode,Edayankattuvalsu'),(2476,'Kolanaickenpatti,Kolanaickenpatti'),(2477,'Erode,Erode,East'),(2478,'Erode,Erode,Fort,Erode,East'),(2479,'Erode,Periyar,Nagar,Erode,East'),(2480,'Erode,Kollampalayam,Erode,Railway,Colony'),(2481,'Erode,Voc,Park,Karungalpalayam'),(2482,'Erode,Edayankattuvalsu'),(2483,'Erode,Thindal,Thindal'),(2484,'Erode,Thindal,Thindal'),(2485,'Erode,Palayapalayam,Teachers,Colony,Erode,Collectorate'),(2486,'Ammankoil,Kali,Bhavani,Kudal'),(2487,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(2488,'Bhavani,Bhavani,Kudal'),(2489,'Erode,Perundurai,Ambal,Erode,Collectorate'),(2490,'Erode,Chikkaiah,Naicker,College'),(2491,'Erode,Periyar,Nagar,Chidambaram,Erode,East'),(2492,'Erode,Erode,Fort,Erode,East'),(2493,'Erode,Moolapalayam,Erode,Railway,Colony'),(2494,'Erode,Palayapalayam,Erode,Collectorate'),(2495,'Perundurai,Athur,Ingur'),(2496,'Erode,Nadarmedu,Erode,Railway,Colony'),(2497,'Erode,Athipalayam,Seerampalayam'),(2498,'Erode,Erode,Fort,Erode,East'),(2499,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(2500,'Erode,Edayankattuvalsu'),(2501,'Chithode,Gangapuram,Chittode'),(2502,'Avadi,Bodipalayam'),(2503,'Erode,Thindal'),(2504,'Erode,Chikkaiah,Naicker,College'),(2505,'Erode,Thirunagar,Colony,Karungalpalayam'),(2506,'Erode,Teachers,Colony,Erode,Collectorate'),(2507,'Erode,Erode,East'),(2508,'Erode,Erode,Fort,Erode,East'),(2509,'Erode,Karungalpalayam'),(2510,'Erode,Thirunagar,Colony,Erode,Collectorate'),(2511,'Erode,Edayankattuvalsu'),(2512,'Erode,Surampatti,Edayankattuvalsu'),(2513,'Erode,Periyar,Nagar,Erode,East'),(2514,'Erode,Karungalpalayam'),(2515,'Erode,Erode,East'),(2516,'Ampuram,Ambodi'),(2517,'Chithode,Chittode'),(2518,'Arachalur,Arachalur'),(2519,'Erode,Adaiyur,Kuttapalayam'),(2520,'Erode,Solar,Arur,Karur,Erode,Railway,Colony'),(2521,'Gobichettipalayam,Chettipalayam,Kalichettipalayam.,Mettupalayam'),(2522,'Erode,Kollampalayam,Moolapalayam,Erode,Railway,Colony'),(2523,'Erode,Palayapalayam,Erode,Collectorate'),(2524,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(2525,'Erode,Erode,East'),(2526,'Erode,Chettipalayam,Erode,Railway,Colony'),(2527,'Erode,Edayankattuvalsu'),(2528,'Erode,Perundurai,Ingur'),(2529,'Erode,Erode,Fort,Erode,East'),(2530,'Erode,Karungalpalayam'),(2531,'Erode,Sampath,Nagar,Erode,Collectorate'),(2532,'Kanchipuram,Erode,East'),(2533,'Nasiyanur,Anur,Kadirampatti'),(2534,'Erode,Kandampalayam,Perundurai,Ingur'),(2535,'Erode,Erode,Fort,Erode,East'),(2536,'Erode,Edayankattuvalsu'),(2537,'Kavandapadi,Kalichettipalayam.,Mettupalayam'),(2538,'Erode,Lakkapuram,Erode,Railway,Colony'),(2539,'Erode,Chikkaiah,Naicker,College'),(2540,'Erode,Erode,East'),(2541,'Bhavani,Kali,Vasavi,College'),(2542,'Erode,Erode,Fort,Erode,East'),(2543,'Erode,Thirunagar,Colony,Karungalpalayam'),(2544,'Erode,Erode,Fort,Erode,Collectorate'),(2545,'Bhavani,Komarapalayam,Bhavani,Kudal'),(2546,'Erode,Muncipal,Colony,Karungalpalayam'),(2547,'Erode,Erode,East'),(2548,'Vallipurathanpalayam,Kanagapuram'),(2549,'Erode,Edayankattuvalsu'),(2550,'Anthiyur,Alampalayam'),(2551,'Erode,Kollampalayam,Erode,Railway,Colony'),(2552,'Erode,Karungalpalayam'),(2553,'Erode,Erode,Fort,Erode,East'),(2554,'Erode,Erode,Fort,Erode,East'),(2555,'Erode,Erode,East'),(2556,'Erode,Erode,East'),(2557,'Erode,Surampatti,Erode,East'),(2558,'Erode,Chikkaiah,Naicker,College'),(2559,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(2560,'Erode,Perundurai,Erode,Collectorate'),(2561,'Erode,Lakkapuram,Pudur,Erode,Railway,Colony'),(2562,'Erode,Perundurai,Erode,Collectorate'),(2563,'Erode,Teachers,Colony,Erode,Collectorate'),(2564,'Erode,Periyar,Nagar,Erode,Railway,Colony'),(2565,'Erode,Moolapalayam,Erode,Railway,Colony'),(2566,'Erode,Erode,Fort,Erode,East'),(2567,'Erode,Chikkaiah,Naicker,College'),(2568,'Erode,Edayankattuvalsu'),(2569,'Erode,Solar,Erode,Railway,Colony'),(2570,'Erode,Erode,East'),(2571,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(2572,'Erode,Erode,Fort,Erode,East'),(2573,'Erode,Unjalur,Erode,Collectorate'),(2574,'Pudur,Iruppu,15,Velampalayam'),(2575,'Erode,Thindal,Arasampatti,Thindal'),(2576,'Erode,Erode,East'),(2577,'Erode,Erode,East'),(2578,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(2579,'Erode,Thindal,Isur,Thindal'),(2580,'Erode,Edayankattuvalsu'),(2581,'Anur,Hasthampatti'),(2582,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(2583,'Gundalapatti,Gundalapatti'),(2584,'Erode,Erode,Fort,Muncipal,Colony,Chikkaiah,Naicker,College'),(2585,'Erode,Perundurai,Erode,Collectorate'),(2586,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(2587,'Erode,Palayapalayam,Erode,Collectorate'),(2588,'Arachalur,Erode,Arachalur'),(2589,'Erode,Erode,East'),(2590,'Erode,Lakkapuram,Erode,Railway,Colony'),(2591,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(2592,'Erode,Erode,Fort,Karungalpalayam'),(2593,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(2594,'Erode,Erode,Fort,Erode,East'),(2595,'Erode,Surampatti,Erode,East'),(2596,'Erode,Chikkaiah,Naicker,College'),(2597,'Thindal,Thindal'),(2598,'Chithode,Erode,Chittode'),(2599,'Erode,Erode,East'),(2600,'Erode,Erode,East'),(2601,'Coimbatore,Bogampatti'),(2602,'Erode,Periyar,Nagar,Erode,East'),(2603,'Erode,Perundurai,Thindal,Thindal'),(2604,'Erode,Thirunagar,Colony,Karungalpalayam'),(2605,'Erode,Thindal'),(2606,'Erode,Erode,Collectorate'),(2607,'Erode,Pallipalayam'),(2608,'Bhavani,Erode,Peria,Agraharam'),(2609,'Erode,Pudur,Solar,Arachi,Erode,Railway,Colony'),(2610,'Erode,Railway,Colony,Erode,Railway,Colony'),(2611,'Chithode,Erode,Suriyampalayam,Chittode'),(2612,'Bhavani,Erode,Pudur,Amaravathi,Nagar,Peria,Agraharam'),(2613,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(2614,'Erode,Chikkaiah,Naicker,College'),(2615,'Palayapalayam,Erode,Collectorate'),(2616,'Erode,Rangampalayam,Edayankattuvalsu'),(2617,'Erode,Thirunagar,Colony,Ambal,Karungalpalayam'),(2618,'Erode,Karungalpalayam,Thirunagar,Colony,Arungal,Karungalpalayam'),(2619,'Erode,Pudur,Solar,Arur,Karur,Erode,Railway,Colony'),(2620,'Erode,Edayankattuvalsu'),(2621,'Erode,Erode,Collectorate'),(2622,'Erode,Erode,Collectorate'),(2623,'Bhavani,Peria,Agraharam'),(2624,'Erode,Erode,Fort,Erode,East'),(2625,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(2626,'Thindal,Thindal'),(2627,'Gobichettipalayam,Chettipalayam,Kadukkampalayam'),(2628,'Agraharam,Erode,Erode,East'),(2629,'Erode,Edayankattuvalsu'),(2630,'Kuchi,Palayam,Kuchi,Palayam'),(2631,'Erode,Erode,Collectorate'),(2632,'Coimbatore,Coimbatore,Ukkadam'),(2633,'Erode,Erode,East'),(2634,'Erode,Karungalpalayam'),(2635,'Erode,Palayapalayam,Edayankattuvalsu'),(2636,'Agraharam,Pallipalayam'),(2637,'Erode,Perundurai,Erode,Collectorate'),(2638,'Erode,Perundurai,Thindal,Thindal'),(2639,'Chikkaiah,Naicker,College,Chikkaiah,Naicker,College'),(2640,'Erode,Kollampalayam,Arur,Karur,Erode,Railway,Colony'),(2641,'Erode,Karungalpalayam'),(2642,'Erode,Erode,Collectorate'),(2643,'Erode,Karungalpalayam'),(2644,'Erode,Karungalpalayam'),(2645,'Erode,Karungalpalayam'),(2646,'Erode,Arasampatti,Thindal'),(2647,'Erode,Erode,Collectorate'),(2648,'Erode,Thirunagar,Colony,Karungalpalayam'),(2649,'Erode,Perundurai,Erode,Collectorate'),(2650,'Erode,Edayankattuvalsu'),(2651,'Bhavani,Erode,Bhavani,Kudal'),(2652,'Erode,Erode,East'),(2653,'Erode,Chikkaiah,Naicker,College'),(2654,'Erode,Chikkaiah,Naicker,College'),(2655,'Perundurai,638060'),(2656,'Erode,Chidambaram,Erode,East'),(2657,'Erode,Surampatti,Edayankattuvalsu'),(2658,'Erode,Nasiyanur,Anur,Arasampatti,Chikkaiah,Naicker,College'),(2659,'Chettipalayam,Chettipalayam'),(2660,'Erode,Edayankattuvalsu'),(2661,'Erode,Muncipal,Colony,Veerappanchatram,Erode,Collectorate'),(2662,'Perundurai,Ingur'),(2663,'Erode,Gobichettipalayam,Attur,Ayal,Chettipalayam,Kadukkampalayam'),(2664,'Bhavani,Erode,Vasavi,College'),(2665,'Erode,Edayankattuvalsu'),(2666,'Erode,Karungalpalayam'),(2667,'Erode,Vadamugam,Vellode,Chennimalai,Kanagapuram'),(2668,'Erode,Avalpundurai'),(2669,'Erode,Erode,East'),(2670,'Iruppu,Kallampalayam,Road'),(2671,'Erode,Surampatti,Edayankattuvalsu'),(2672,'Erode,Sampath,Nagar,Erode,Collectorate'),(2673,'Emur,Chikkaiah,Naicker,College'),(2674,'Bhavani,Erode,Kavandapadi,Kalichettipalayam.,Mettupalayam'),(2675,'Erode,Erode,Collectorate'),(2676,'Unjanaigoundampalayam,Unjanaigoundampalayam'),(2677,'Erode,Perundurai,Arimalam,Thindal'),(2678,'Erode,Karungalpalayam'),(2679,'Erode,Solar,Erode,Railway,Colony'),(2680,'Erode,Kollampalayam,Railway,Colony,Erode,Railway,Colony'),(2681,'Uppilipalayam,Uppilipalayam'),(2682,'Erode,Periyar,Nagar,Erode,East'),(2683,'Erode,Ichipalayam,Chennimalai,Kavundichipalayam,Kanagapuram'),(2684,'Arur,Karur,Erode,Railway,Colony'),(2685,'Erode,Erode,East'),(2686,'Erode,Perundurai,Kanagapuram'),(2687,'Erode,Erode,Fort,Erode,East'),(2688,'Erode,Thindal'),(2689,'Erode,Erode,Fort,Erode,East'),(2690,'Erode,Coimbatore,Vasavi,College'),(2691,'Erode,Kasipalayam,Erode,East'),(2692,'Edayankattuvalsu,Edayankattuvalsu'),(2693,'Erode,Erode,Collectorate'),(2694,'Erode,Karungalpalayam,Amoor,Arungal,Karungalpalayam'),(2695,'Erode,Palayapalayam,Surampatti,Edayankattuvalsu'),(2696,'Erode,Teachers,Colony,Erode,Collectorate'),(2697,'Erode,Periyar,Nagar,Erode,East'),(2698,'Erode,Muncipal,Colony,Edayankattuvalsu'),(2699,'Erode,Arasampatti,Kadirampatti'),(2700,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(2701,'Appakudal,Erode,Appakudal'),(2702,'Erode,Erode,East'),(2703,'Bhavani,Erode,Kali,Kavindapadi,Bhavani,Kudal'),(2704,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(2705,'Pallipalayam,Pallipalayam'),(2706,'Pallipalayam,Pallipalayam'),(2707,'Erode,Thindal'),(2708,'Erode,Periyar,Nagar,Erode,East'),(2709,'Erode,Perundurai,Thindal,Thindal'),(2710,'Erode,Erode,East'),(2711,'Erode,Thindal'),(2712,'Erode,Kurichi,Modakurichi,Elumathur'),(2713,'Erode,Seerampalayam'),(2714,'Erode,Palayapalayam,Erode,Collectorate'),(2715,'Erode,Soolai,Chikkaiah,Naicker,College'),(2716,'Tiruchengodu,North,Tiruchengodu,North'),(2717,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(2718,'Hasthampatti,Hasthampatti'),(2719,'Erode,Perundurai,Thindal,Thindal'),(2720,'Erode,Teachers,Colony,Erode,Collectorate'),(2721,'Erode,Perundurai,Erode,Collectorate'),(2722,'Erode,Marapalam,Erode,East'),(2723,'Erode,Thindal'),(2724,'Erode,Erode,Fort,Erode,Collectorate'),(2725,'Avalpundurai,Avalpundurai'),(2726,'Chithode,Chittode'),(2727,'Erode,Erode,Fort,Erode,East'),(2728,'Erode,Periyar,Nagar,Surampatti,Edayankattuvalsu'),(2729,'Erode,Periyar,Nagar,Erode,East'),(2730,'Attur,Kattur,Kalichettipalayam.,Mettupalayam'),(2731,'Erode,Chikkaiah,Naicker,College'),(2732,'Erode,Kalpalayam,Erode,Railway,Colony'),(2733,'Erode,Erode,Fort,Erode,East'),(2734,'Hogenakkal,Dinnabelur'),(2735,'Erode,Erode,Fort,Erode,East'),(2736,'Erode,Solar,Arur,Karur,Erode,Railway,Colony'),(2737,'Erode,Alampalayam,Seerampalayam'),(2738,'Erode,Erode,East'),(2739,'Erode,Marapalam,Karungalpalayam'),(2740,'Erode,Periyar,Nagar,Erode,East'),(2741,'Erode,Rangampalayam,Edayankattuvalsu'),(2742,'Erode,Erode,Railway,Colony'),(2743,'Erode,Teachers,Colony,Edayankattuvalsu'),(2744,'Erode,Erode,East'),(2745,'Erode,Erode,Railway,Colony'),(2746,'Iruppu,Kallampalayam,Road'),(2747,'Erode,Moolapalayam,Erode,Railway,Colony'),(2748,'Erode,Erode,East'),(2749,'Erode,Periyar,Nagar,Erode,East'),(2750,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(2751,'Erode,Thirunagar,Colony,Erode,East'),(2752,'Erode,Surampatti,Erode,East'),(2753,'Erode,Chennimalai,Erode,East'),(2754,'Erode,Perundurai,Erode,Collectorate'),(2755,'Erode,Chikkaiah,Naicker,College'),(2756,'Erode,Thirunagar,Colony,Kanai,Karungalpalayam'),(2757,'Erode,Karungalpalayam'),(2758,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(2759,'Mukasipidariyur,Ariyur,Basuvapatti'),(2760,'Erode,Erode,Fort,Erode,East'),(2761,'Erode,Perundurai,Ingur'),(2762,'Erode,Solar,Arur,Karur,Erode,Railway,Colony'),(2763,'Erode,Perundurai,Erode,Collectorate'),(2764,'Erode,Erode,East'),(2765,'Kollampalayam,Arur,Karur,Erode,Railway,Colony'),(2766,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(2767,'Erode,Nasiyanur,Sampath,Nagar,Anur,Erode,Collectorate'),(2768,'Erode,Perundurai,Erode,Collectorate'),(2769,'Erode,Marapalam,Erode,East'),(2770,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(2771,'Erode,Perundurai,Erode,Collectorate'),(2772,'Erode,Moolapalayam,Arur,Karur,Erode,Railway,Colony'),(2773,'Chithode,Erode,Gangapuram,Chittode'),(2774,'Erode,Kanagapuram'),(2775,'Erode,Erode,East'),(2776,'Chinnamalai,Erode,Nadarmedu,Erode,Railway,Colony'),(2777,'Erode,Thirunagar,Colony,Karungalpalayam'),(2778,'Erode,Seerampalayam'),(2779,'Erode,Thindal,Thindal'),(2780,'Erode,Muncipal,Colony,Karungalpalayam'),(2781,'Erode,Erode,Fort,Erode,East'),(2782,'Nasiyanur,Anur,Kadirampatti'),(2783,'Chithode,Pudur,Chittode'),(2784,'Erode,Nadarmedu,Erode,Railway,Colony'),(2785,'Erode,Erode,East'),(2786,'Anur,Jawahar,Mills'),(2787,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(2788,'Erode,Perundurai,Thindal'),(2789,'Erode,Periyar,Nagar,Erode,East'),(2790,'Erode,Arur,Karur,Erode,Railway,Colony'),(2791,'Erode,Erode,Collectorate'),(2792,'Erode,Erode,East'),(2793,'Erode,Thirunagar,Colony,Erode,Railway,Colony'),(2794,'Erode,Arur,Karur,Erode,Railway,Colony'),(2795,'Erode,Erode,Fort,Erode,East'),(2796,'Erode,Erode,East'),(2797,'Erode,Thindal,Thindal'),(2798,'Erode,Solar,Arur,Karur,Erode,Railway,Colony'),(2799,'Devanankurichi,Devanankurichi'),(2800,'Erode,Periyar,Nagar,Erode,East'),(2801,'Erode,Kollampalayam,Erode,Railway,Colony'),(2802,'Chikkaiah,Naicker,College,Ellapalayam,Chikkaiah,Naicker,College'),(2803,'Erode,Lakkapuram,Erode,Railway,Colony'),(2804,'Erode,Perundurai,Thindal,Thindal'),(2805,'Erode,Erode,Fort,Karungalpalayam'),(2806,'Erode,Chennimalai,Erode,East'),(2807,'Erode,Erode,East'),(2808,'Kurichi,Modakurichi,Akkur,Elumathur'),(2809,'Bhavani,Bhavani,Kudal'),(2810,'Erode,Edayankattuvalsu'),(2811,'Erode,Erode,Fort,Erode,East'),(2812,'Erode,Erode,East'),(2813,'Erode,Kangayam,Erode,Railway,Colony'),(2814,'Erode,Erode,Fort,Erode,East'),(2815,'Erode,Surampatti,Erode,East'),(2816,'Erode,Surampatti,Chennimalai,Edayankattuvalsu'),(2817,'Erode,Erode,Collectorate'),(2818,'Erode,East,Erode,East'),(2819,'Erode,Nadarmedu,Erode,Railway,Colony'),(2820,'Erode,Muncipal,Colony,Veerappanchatram,Chikkaiah,Naicker,College'),(2821,'Erode,Muncipal,Colony,Erode,Collectorate'),(2822,'Pudur,Solar,Erode,Railway,Colony'),(2823,'Erode,Pudur,Erode,Railway,Colony'),(2824,'Erode,Chidambaram,Erode,East'),(2825,'Erode,Vasavi,College'),(2826,'Erode,Erode,Fort,648001'),(2827,'Erode,Ganapathi,Nagar,Dalavoipettai'),(2828,'Erode,Lakkapuram,Erode,Railway,Colony'),(2829,'Erode,Periyar,Nagar,Erode,East'),(2830,'Veerappanchatram,Chikkaiah,Naicker,College'),(2831,'Erode,Chikkaiah,Naicker,College'),(2832,'Erode,Kollampalayam,Arur,Karur,Erode,Railway,Colony'),(2833,'Erode,Erode,Fort,Erode,East'),(2834,'Erode,Nanjanapuram,Kadirampatti'),(2835,'Erode,Emur,Chikkaiah,Naicker,College'),(2836,'Erode,Chikkaiah,Naicker,College'),(2837,'Erode,Erode,Fort,Erode,East'),(2838,'Erode,Ellapalayam,Emur,Chikkaiah,Naicker,College'),(2839,'Erode,Rangampalayam,Chennimalai,Edayankattuvalsu'),(2840,'Erode,Kasipalayam,Chennimalai,Edayankattuvalsu'),(2841,'Perundurai,Ingur'),(2842,'Erode,Erode,Fort,Erode,East'),(2843,'Gobichettipalayam,Chettipalayam,Anaipalayam'),(2844,'Bhavani,Erode,Chikkaiah,Naicker,College'),(2845,'Erode,Karungalpalayam'),(2846,'Bhavani,Kali,Bhavani,Kudal'),(2847,'Erode,Palayapalayam,Perundurai,Thindal'),(2848,'Erode,Teachers,Colony,Erode,Collectorate'),(2849,'Erode,Solar,Erode,Railway,Colony'),(2850,'Chithode,Chittode'),(2851,'Erode,Erode,Fort,Erode,East'),(2852,'Erode,Erode,East'),(2853,'Bhavani,Bhavani,Kudal'),(2854,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(2855,'Bhavani,Erode,Vasavi,College'),(2856,'Erode,Erode,Fort,Muncipal,Colony,Chikkaiah,Naicker,College'),(2857,'Erode,Erode,Fort,Erode,East'),(2858,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(2859,'Erode,Erode,Collectorate'),(2860,'Erode,Railway,Colony,Erode,Railway,Colony'),(2861,'Erode,Arasampatti,Kadirampatti'),(2862,'Ennai,Chennai,G.P.O.,'),(2863,'Erode,Perundurai,Erode,Collectorate'),(2864,'Ennai,Thiruvidanthai'),(2865,'Erode,Karungalpalayam'),(2866,'Kallankattuvalasu,Kallankattuvalasu'),(2867,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(2868,'Erode,Perundurai,Erode,Collectorate'),(2869,'Erode,Erode,Fort,Erode,East'),(2870,'Erode,Muncipal,Colony,Erode,Collectorate'),(2871,'Coimbatore,P&T,Staff,Quarters'),(2872,'Erode,Erode,East'),(2873,'Erode,Chettipalayam,Erode,Railway,Colony'),(2874,'Erode,Edayankattuvalsu'),(2875,'Erode,Kollampalayam,Peria,Agraharam'),(2876,'Erode,Ingur'),(2877,'Erode,Teachers,Colony,Erode,Collectorate'),(2878,'Gobichettipalayam,Pudur,Chettipalayam,Kangayam,Anaipalayam'),(2879,'Erode,Manickampalayam,Chikkaiah,Naicker,College'),(2880,'Erode,Teachers,Colony,Erode,Collectorate'),(2881,'Erode,Karungalpalayam'),(2882,'Erode,Karungalpalayam'),(2883,'Erode,Erode,East'),(2884,'Erode,Vasavi,College'),(2885,'Erode,Erode,Fort,Erode,East'),(2886,'Erode,Erode,East'),(2887,'Erode,Vasavi,College'),(2888,'Erode,Thindal'),(2889,'Erode,Mettunasuvanpalayam,Vasavi,College'),(2890,'Erode,Chennimalai,Erode,Railway,Colony'),(2891,'Erode,Kollampalayam,Erode,Railway,Colony'),(2892,'Erode,Erode,Collectorate'),(2893,'Erode,Karungalpalayam'),(2894,'Erode,Perundurai,Erode,Collectorate'),(2895,'Erode,Edayankattuvalsu'),(2896,'Erode,Erode,Fort,Erode,East'),(2897,'Edayankattuvalsu,Edayankattuvalsu'),(2898,'Erode,Erode,East'),(2899,'Erode,Teachers,Colony,Edayankattuvalsu'),(2900,'Erode,Soolai,Chikkaiah,Naicker,College'),(2901,'Erode,Chikkaiah,Naicker,College'),(2902,'Erode,Erode,Fort,Erode,East'),(2903,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(2904,'Erode,Soolai,Chikkaiah,Naicker,College'),(2905,'Erode,Nasiyanur,Anur,Thindal'),(2906,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(2907,'Erode,Gangapuram,Chittode'),(2908,'Fairlands,Fairlands'),(2909,'Erode,Erode,Collectorate'),(2910,'Erode,Perundurai,Thindal,Thindal'),(2911,'Erode,Erode,Fort,Edappadi,Erode,East'),(2912,'Erode,Moolapalayam,Erode,Railway,Colony'),(2913,'Thindal,Thindal'),(2914,'Erode,Periyar,Nagar,Erode,East'),(2915,'Erode,Erode,Fort,Erode,East'),(2916,'Erode,Periya,Valasu,Chikkaiah,Naicker,College'),(2917,'Erode,Perundurai,Erode,Collectorate'),(2918,'Edayankattuvalsu,Edayankattuvalsu'),(2919,'Erode,Edayankattuvalsu'),(2920,'Nambiyur,Gandhinagar,Gandhipuram,Koshanam'),(2921,'Erode,Thindal'),(2922,'Erode,Erode,Collectorate'),(2923,'Erode,Palayapalayam,Thindal'),(2924,'Erode,Chidambaram,Erode,East'),(2925,'Emmammpoondi,Emmammpoondi'),(2926,'Erode,Erode,Fort,Erode,East'),(2927,'Erode,Erode,Fort,Erode,East'),(2928,'Erode,Periyar,Nagar,Erode,East'),(2929,'Chithode,Sellappampalayam,Chittode'),(2930,'Erode,Soolai,Chikkaiah,Naicker,College'),(2931,'Erode,Perundurai,Kadirampatti'),(2932,'Erode,Erode,Fort,Erode,East'),(2933,'Manickampalayam,Elachipalayam'),(2934,'Erode,Erode,East'),(2935,'Erode,Erode,East'),(2936,'Erode,Perundurai,Erode,Collectorate'),(2937,'Erode,Perundurai,Erode,Collectorate'),(2938,'Erode,Erode,Railway,Colony'),(2939,'Erode,Surampatti,Erode,East'),(2940,'Erode,Edayankattuvalsu'),(2941,'Erode,Karungalpalayam'),(2942,'Erode,Erode,East'),(2943,'Erode,Perundurai,Erode,Collectorate'),(2944,'Erode,Erode,East'),(2945,'Erode,Perundurai,Thindal,Thindal'),(2946,'Erode,Kokkarayanpettai,Marapalam,Surampatti,Erode,East'),(2947,'Veerappanchatram,Chikkaiah,Naicker,College'),(2948,'Erode,Thirunagar,Colony,Karungalpalayam'),(2949,'Erode,Surampatti,Edayankattuvalsu'),(2950,'Moolapalayam,Erode,Railway,Colony'),(2951,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(2952,'Erode,Erode,East'),(2953,'Erode,Nambiyur,Chikkaiah,Naicker,College'),(2954,'Erode,Perundurai,Erode,Collectorate'),(2955,'Kali,Seerampalayam'),(2956,'Erode,Erode,Collectorate'),(2957,'Erode,Chikkaiah,Naicker,College'),(2958,'Erode,Chikkaiah,Naicker,College'),(2959,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(2960,'Erode,Ammayappan,Karungalpalayam'),(2961,'Erode,Voc,Park,Karungalpalayam'),(2962,'Erode,Erode,East'),(2963,'Erode,Surampatti,Edayankattuvalsu'),(2964,'Erode,Erode,Fort,Kavilipalayam'),(2965,'Erode,Erode,Railway,Colony'),(2966,'Erode,Erode,East'),(2967,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(2968,'Erode,Pudur,Peria,Agraharam'),(2969,'Erode,Karungalpalayam'),(2970,'Erode,Kollampalayam,Erode,Railway,Colony'),(2971,'Erode,Solar,Erode,Railway,Colony'),(2972,'Erode,Thindal,Thindal'),(2973,'Erode,Erode,Fort,Erode,East'),(2974,'Erode,Kali,Edayankattuvalsu'),(2975,'Erode,Erode,Collectorate'),(2976,'Erode,Edayankattuvalsu'),(2977,'Erode,Surampatti,Edayankattuvalsu'),(2978,'Erode,Erode,Fort,Erode,East'),(2979,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(2980,'Iruppu,Mangalapatti'),(2981,'Erode,Rangampalayam,Edayankattuvalsu'),(2982,'Erode,Chidambaram,Erode,East'),(2983,'Erode,Erode,Fort,Erode,East'),(2984,'Erode,Moolapalayam,Arur,Karur,Erode,Railway,Colony'),(2985,'Komarapalayam,Kallankattuvalasu'),(2986,'Erode,Edayankattuvalsu'),(2987,'Erode,Kadirampatti'),(2988,'Seerampalayam,Seerampalayam'),(2989,'Alampalayam,Pallipalayam'),(2990,'Erode,Emur,Chikkaiah,Naicker,College'),(2991,'Erode,Chikkaiah,Naicker,College'),(2992,'Erode,Soolai,Chikkaiah,Naicker,College'),(2993,'Nallur,Allur,Ganapathy,Iruppu,Karunampathi'),(2994,'Erode,Thirunagar,Colony,Karungalpalayam'),(2995,'Erode,Kollampalayam,Erode,Railway,Colony'),(2996,'Erode,Erode,Fort,Erode,East'),(2997,'Erode,Nasiyanur,Sampath,Nagar,Anur,Erode,Collectorate'),(2998,'Pudur,Iruppu,Ayyankalipalayam'),(2999,'Anur,Kali,Kaliyanur,Chinnagoundanur'),(3000,'Erode,Perundurai,Erode,Collectorate'),(3001,'Bhavani,Erode,Erode,Collectorate'),(3002,'Arachalur,Erode,Arachalur'),(3003,'Erode,Periyar,Nagar,Surampatti,Erode,East'),(3004,'Erode,Karungalpalayam'),(3005,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(3006,'Erode,Surampatti,Edayankattuvalsu'),(3007,'Erode,Erode,Collectorate'),(3008,'Erode,Muncipal,Colony,Veerappanchatram,Chikkaiah,Naicker,College'),(3009,'Erode,Edayankattuvalsu'),(3010,'Periya,Valasu,Veerappanchatram,Chikkaiah,Naicker,College'),(3011,'Coimbatore,Bilichi'),(3012,'Erode,Perundurai,Thindal,Thindal'),(3013,'Erode,Perundurai,Thindal'),(3014,'Erode,Erode,East'),(3015,'Erode,Chikkaiah,Naicker,College'),(3016,'Erode,Erode,East'),(3017,'Erode,Pudur,Solar,Arur,Karur,Erode,Railway,Colony'),(3018,'Pallipalayam,Pallipalayam'),(3019,'Erode,Erode,East'),(3020,'Nadarmedu,Erode,Railway,Colony'),(3021,'Erode,Erode,Collectorate'),(3022,'Erode,Darapuram,Erode,Railway,Colony'),(3023,'Erode,Perundurai,Thindal,Thindal'),(3024,'Erode,Kali,Kavindapadi,Bhavani,Kudal'),(3025,'Erode,Thindal'),(3026,'Erode,Thirunagar,Colony,Karungalpalayam'),(3027,'Erode,Erode,Collectorate'),(3028,'Bhavani,Bhavani,Kudal'),(3029,'Erode,Karungalpalayam'),(3030,'Erode,Nasiyanur,Anur,Thindal'),(3031,'Erode,Erode,East'),(3032,'Erode,Thindal,Thindal'),(3033,'Komarapalayam,Kallankattuvalasu'),(3034,'Erode,Erode,Fort,Erode,East'),(3035,'Erode,Chidambaram,Erode,East'),(3036,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(3037,'Erode,Kasipalayam,Erode,Railway,Colony'),(3038,'Erode,Erode,Collectorate'),(3039,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(3040,'Erode,Teachers,Colony,Erode,Collectorate'),(3041,'Erode,Periyar,Nagar,Erode,East'),(3042,'Erode,Karungalpalayam'),(3043,'Komarapalayam,Kallankattuvalasu'),(3044,'Erode,Surampatti,Erode,Collectorate'),(3045,'Erode,Edayankattuvalsu'),(3046,'Erode,Soolai,Chikkaiah,Naicker,College'),(3047,'Erode,Erode,East'),(3048,'Erode,Muncipal,Colony,Karungalpalayam'),(3049,'Erode,Rangampalayam,Edayankattuvalsu'),(3050,'Erode,Emur,Chikkaiah,Naicker,College'),(3051,'Erode,Muncipal,Colony,Perundurai,Chikkaiah,Naicker,College'),(3052,'Edayankattuvalsu,Edayankattuvalsu'),(3053,'Erode,Perundurai,Thindal,Thindal'),(3054,'Erode,Karungalpalayam,Amoor,Arungal,Karungalpalayam'),(3055,'Erode,Karungalpalayam'),(3056,'Erode,Kollampalayam,Arur,Karur,Erode,Railway,Colony'),(3057,'Erode,Thindal,Thindal'),(3058,'Erode,Thindal,Thindal'),(3059,'Erode,Soolai,Chikkaiah,Naicker,College'),(3060,'Anthiyur,Bhavani,Erode,Kadayam,Kadayampatti,Dalavoipettai'),(3061,'Erode,Erode,Fort,Erode,East'),(3062,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(3063,'Erode,Palayapalayam,Erode,Collectorate'),(3064,'Erode,Periyar,Nagar,Pallipalayam'),(3065,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(3066,'Bhavani,Erode,Kali,Bhavani,Kudal'),(3067,'Erode,Moolapalayam,Erode,Railway,Colony'),(3068,'Erode,Karungalpalayam'),(3069,'Erode,Palayapalayam,Erode,Collectorate'),(3070,'Erode,Erode,Collectorate'),(3071,'Erode,Palayapalayam,Surampatti,Edayankattuvalsu'),(3072,'Karungalpalayam,Karungalpalayam'),(3073,'Erode,Periyar,Nagar,Erode,East'),(3074,'Erode,Erode,East'),(3075,'Erode,Erode,East'),(3076,'Erode,Erode,East'),(3077,'Erode,Kasipalayam,Edayankattuvalsu'),(3078,'Erode,Erode,Collectorate'),(3079,'Erode,Erode,Fort,Erode,East'),(3080,'Erode,Thindal'),(3081,'Erode,Erode,East'),(3082,'Erode,Karungalpalayam'),(3083,'Erode,Surampatti,Edayankattuvalsu'),(3084,'Bhavani,Kali,Kamaraj,Nagar,Bhavani,Kudal'),(3085,'Pallipalayam,Pallipalayam'),(3086,'Erode,Perundurai,Erode,Collectorate'),(3087,'Erode,Chikkaiah,Naicker,College'),(3088,'Erode,Edayankattuvalsu'),(3089,'Erode,Erode,East'),(3090,'Erode,Chikkaiah,Naicker,College'),(3091,'Erode,Perundurai,Erode,Collectorate'),(3092,'Erode,Chikkaiah,Naicker,College'),(3093,'Erode,Karungalpalayam'),(3094,'Erode,Thindal'),(3095,'Erode,Erode,Fort,Karungalpalayam'),(3096,'Erode,Rangampalayam,Chennimalai,Edayankattuvalsu'),(3097,'Erode,Thindal,Edayankattuvalsu'),(3098,'Erode,Edayankattuvalsu'),(3099,'Erode,Karungalpalayam,Arungal,Chikkaiah,Naicker,College'),(3100,'Bhavani,Erode,Chikkaiah,Naicker,College'),(3101,'Erode,Muncipal,Colony,Veerappanchatram,Chikkaiah,Naicker,College'),(3102,'Iruppu,Kallampalayam,Road'),(3103,'Kollampalayam,Erode,Railway,Colony'),(3104,'Erode,Edayankattuvalsu'),(3105,'Erode,Erode,Fort,Erode,East'),(3106,'Erode,Erode,Collectorate'),(3107,'Erode,Erode,Fort,Erode,East'),(3108,'Erode,Erode,East'),(3109,'Erode,Erode,Fort,Erode,East'),(3110,'Erode,Edayankattuvalsu'),(3111,'Ottapparai,Chennimalai,Basuvapatti'),(3112,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(3113,'Anthiyur,Bhavani,Erode,Bhavani,Kudal'),(3114,'Erode,Edayankattuvalsu'),(3115,'Erode,Thindal,Thindal'),(3116,'Erode,Karungalpalayam'),(3117,'Erode,Nasiyanur,Anur,Arasampatti,Kadirampatti'),(3118,'Erode,Veerappanchatram,Erode,Collectorate'),(3119,'Andipalayam,Koottapalli'),(3120,'Erode,Nasiyanur,Anur,Kanji,Thindal'),(3121,'Erode,Thindal,Thindal'),(3122,'Erode,Nadarmedu,Erode,Railway,Colony'),(3123,'Erode,Erode,East'),(3124,'Erode,Edayankattuvalsu'),(3125,'Nanjaiuthukuli,Elumathur'),(3126,'Erode,Arur,Karur,Erode,Railway,Colony'),(3127,'Erode,Edayankattuvalsu'),(3128,'Erode,Perundurai,Thindal'),(3129,'Erode,Perundurai,Erode,Collectorate'),(3130,'Erode,Periyar,Nagar,Erode,East'),(3131,'Erode,Chidambaram,Erode,East'),(3132,'Erode,Athipalayam,Chettipalayam,Erode,Railway,Colony'),(3133,'Erode,Karungalpalayam'),(3134,'Erode,Erode,Collectorate'),(3135,'Ammapettai,Bhavani,Erode,Ammapet,Thindal'),(3136,'Chennimalai,Basuvapatti'),(3137,'Erode,Edayankattuvalsu'),(3138,'Agraharam,Erode,Marapalam,Erode,East'),(3139,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(3140,'Erode,Nasiyanur,Sampath,Nagar,Anur,Erode,Collectorate'),(3141,'Bhavani,Erode,Peria,Agraharam'),(3142,'Erode,Kokkarayanpettai,Pappampalayam'),(3143,'Erode,Arur,Karur,Erode,Railway,Colony'),(3144,'Bhavani,Erode,Chikkaiah,Naicker,College'),(3145,'Erode,Gandhipuram,Karungalpalayam'),(3146,'Erode,Ingur'),(3147,'Erode,Chidambaram,Erode,East'),(3148,'Erode,Isur,Thindal'),(3149,'Erode,Erode,Fort,Marapalam,Erode,East'),(3150,'Anur,Eyyanur,Marakkadai'),(3151,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(3152,'Erode,Chikkaiah,Naicker,College'),(3153,'Erode,Perundurai,Ingur'),(3154,'Gandhinagar,Iruppu,Ayyankalipalayam'),(3155,'Erode,Arur,Kadirampatti'),(3156,'Erode,Palayapalayam,Perundurai,Teachers,Colony,Erode,Collectorate'),(3157,'Araipalayam,Arur,Karur,Thamaraipalayam'),(3158,'Erode,Thindal,Thindal'),(3159,'Erode,Palayapalayam,Erode,Collectorate'),(3160,'Erode,Marapalam,Erode,East'),(3161,'Agraharam,Karai,Erode,East'),(3162,'Erode,Soolai,Veerappanchatram,Chikkaiah,Naicker,College'),(3163,'Erode,Erode,Fort,Erode,East'),(3164,'Coimbatore,Ramnagar,Coimbatore'),(3165,'Erode,Arur,Karur,Erode,Railway,Colony'),(3166,'Chinnagoundanur,Chinnagoundanur'),(3167,'Erode,Perundurai,Thindal,Thindal'),(3168,'Bhavani,Vasavi,College'),(3169,'Erode,Perundurai,Erode,Collectorate'),(3170,'Erode,Erode,East'),(3171,'Erode,Erode,East'),(3172,'Erode,Soolai,Chikkaiah,Naicker,College'),(3173,'Chithode,Erode,Vasavi,College'),(3174,'Bhavani,Erode,Bhavani,Kudal'),(3175,'Erode,Edayankattuvalsu'),(3176,'Erode,Thindal,Thindal'),(3177,'Erode,Thindal,Thindal'),(3178,'Erode,Voc,Park,Karungalpalayam'),(3179,'Seerampalayam,Seerampalayam'),(3180,'Erode,Erode,East'),(3181,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(3182,'Erode,Erode,Fort,Erode,East'),(3183,'Erode,Periyar,Nagar,Erode,East'),(3184,'Erode,Karungalpalayam'),(3185,'Erode,Chettipalayam,Erode,Railway,Colony'),(3186,'Erode,Marapalam,Surampatti,Kali,Erode,East'),(3187,'Erode,Solar,Erode,Railway,Colony'),(3188,'Erode,Kollampalayam,Arur,Karur,Erode,East'),(3189,'Erode,Erode,East'),(3190,'Komarapalayam,Pallipalayam'),(3191,'Erode,Erode,Fort,Erode,East'),(3192,'Erode,Teachers,Colony,Erode,Collectorate'),(3193,'Erode,Erode,East'),(3194,'Erode,Chidambaram,Erode,East'),(3195,'Erode,Palayapalayam,Edayankattuvalsu'),(3196,'Erode,Nasiyanur,Anur,Kadirampatti'),(3197,'Erode,Kadirampatti'),(3198,'Erode,Soolai,Emur,Chikkaiah,Naicker,College'),(3199,'Erode,Chikkaiah,Naicker,College'),(3200,'Devagoundanur,Devagoundanur'),(3201,'Erode,Thindal'),(3202,'Seerampalayam,Seerampalayam'),(3203,'Erode,Erode,East'),(3204,'Perundurai,Chennimalai,Ingur'),(3205,'Erode,Thirunagar,Colony,Karungalpalayam'),(3206,'Bhavani,Erode,Peria,Agraharam'),(3207,'Erode,Erode,Collectorate'),(3208,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(3209,'Agraharam,Seerampalayam'),(3210,'Erode,Moolapalayam,Erode,Railway,Colony'),(3211,'Erode,Chidambaram,Erode,East'),(3212,'Erode,Thindal'),(3213,'Erode,Thindal'),(3214,'Erode,Nasiyanur,Anur,Kadirampatti'),(3215,'Erode,Muncipal,Colony,Erode,Collectorate'),(3216,'Erode,Edayankattuvalsu'),(3217,'Erode,Erode,Collectorate'),(3218,'Erode,Thirunagar,Colony,Karungalpalayam'),(3219,'Erode,Erode,Collectorate'),(3220,'Erode,Edayankattuvalsu'),(3221,'Erode,Karungalpalayam'),(3222,'Erode,Perundurai,Edayankattuvalsu'),(3223,'Bhavani,Kali,Kavindapadi,Bhavani,Kudal'),(3224,'Erode,Erode,East'),(3225,'Erode,Pudur,Peria,Agraharam'),(3226,'Erode,Karungalpalayam'),(3227,'Erode,Surampatti,Edayankattuvalsu'),(3228,'Erode,Palayapalayam,Erode,Collectorate'),(3229,'Kurichi,Coimbatore,Keeranatham'),(3230,'Komarapalayam,Kallankattuvalasu'),(3231,'Erode,Moolapalayam,Erode,Railway,Colony'),(3232,'Erode,East,Erode,East'),(3233,'Erode,Erode,Fort,Erode,East'),(3234,'Pallipalayam,Pallipalayam'),(3235,'Komarapalayam,Anur,Kallankattuvalasu'),(3236,'Erode,Perundurai,Erode,Collectorate'),(3237,'Erode,Chikkaiah,Naicker,College'),(3238,'Anthiyur,Bhavani,Erode,Bhavani,Kudal'),(3239,'Erode,Chidambaram,Edayankattuvalsu'),(3240,'Erode,Kollampalayam,Erode,Railway,Colony'),(3241,'Erode,Soolai,Chikkaiah,Naicker,College'),(3242,'Erode,Thindal'),(3243,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(3244,'Erode,Nasiyanur,Anur,Arasampatti,Thindal'),(3245,'Erode,Erode,Fort,Karungalpalayam'),(3246,'Thindal,Thindal'),(3247,'Erode,East,Erode,East'),(3248,'Erode,Erode,Fort,Erode,East'),(3249,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(3250,'Erode,Vellankovil,Chikkarasampalayam'),(3251,'Ammapettai,Ammapet,Ammapettai'),(3252,'Erode,Ellapalayam,Chikkaiah,Naicker,College'),(3253,'Erode,Karungalpalayam'),(3254,'Erode,Erode,East'),(3255,'Erode,Karungalpalayam'),(3256,'Erode,Karungalpalayam'),(3257,'Erode,Railway,Colony,Erode,Railway,Colony'),(3258,'Erode,Muncipal,Colony,Veerappanchatram,Chikkaiah,Naicker,College'),(3259,'Erode,Chikkaiah,Naicker,College'),(3260,'Pallipalayam,Pallipalayam'),(3261,'Devagoundanur,Devagoundanur'),(3262,'Erode,Solar,Kavilipalayam'),(3263,'Erode,Pudur,Solar,Arur,Karur,Erode,Railway,Colony'),(3264,'Erode,Moolapalayam,Erode,Railway,Colony'),(3265,'Erode,Pallipalayam'),(3266,'Erode,Arasampatti,Thindal'),(3267,'Erode,Thindal,Thindal'),(3268,'Erode,Erode,East'),(3269,'Erode,Thindal'),(3270,'Erode,Erode,Fort,Erode,East'),(3271,'Erode,Lakkapuram,Solar,Erode,Railway,Colony'),(3272,'Koottapalli,Koottapalli'),(3273,'Erode,Perundurai,Erode,Collectorate'),(3274,'Kaikolapalayam,Kambiliyampatti'),(3275,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(3276,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(3277,'Erode,Thindal'),(3278,'Devanankurichi,Devanankurichi'),(3279,'Erode,Appakudal'),(3280,'Erode,Erode,Collectorate'),(3281,'Erode,Enathi,Edayankattuvalsu'),(3282,'Coimbatore,Ukkadam,Coimbatore,Ukkadam'),(3283,'Bhavani,Erode,Chikkaiah,Naicker,College'),(3284,'Karattupalayam,Devanankurichi'),(3285,'Erode,Karungalpalayam'),(3286,'Erode,Kali,Edayankattuvalsu'),(3287,'Avadi,Chennai,600096'),(3288,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(3289,'Erode,Chikkaiah,Naicker,College'),(3290,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(3291,'Erode,Karungalpalayam'),(3292,'Erode,Palayapalayam,Erode,Collectorate'),(3293,'Erode,Periyar,Nagar,Rangampalayam,Edayankattuvalsu'),(3294,'Erode,Solar,Arur,Karur,Erode,Railway,Colony'),(3295,'Erode,Thirunagar,Colony,Karungalpalayam'),(3296,'Erode,Thindal'),(3297,'Erode,Teachers,Colony,Erode,Collectorate'),(3298,'Erode,Karungalpalayam,Thirunagar,Colony,Arungal,Karungalpalayam'),(3299,'Erode,Periyar,Nagar,Erode,East'),(3300,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(3301,'Erode,Erode,Fort,Isur,Erode,East'),(3302,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(3303,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(3304,'Erode,Kodumudi,Arur,Karur,Thamaraipalayam'),(3305,'Emur,Chikkaiah,Naicker,College'),(3306,'Erode,Moolapalayam,Erode,Railway,Colony'),(3307,'Erode,Erode,East'),(3308,'Kadirampatti,Kadirampatti'),(3309,'Alapatti,Coimbatore,Kalapatti,Vellanaipatti'),(3310,'Chithode,Erode,Chittode'),(3311,'Erode,Veerappanchatram,Amoor,Chikkaiah,Naicker,College'),(3312,'Erode,Erode,East'),(3313,'Erode,East,Erode,East'),(3314,'Erode,Erode,Collectorate'),(3315,'Erode,Perundurai,Erode,Collectorate'),(3316,'Erode,Karungalpalayam'),(3317,'Erode,Rangampalayam,Chennimalai,Edayankattuvalsu'),(3318,'Agraharam,Bhavani,Erode,Peria,Agraharam'),(3319,'Erode,Lakkapuram,Arur,Karur,Erode,Railway,Colony'),(3320,'Erode,Erode,Fort,Erode,East'),(3321,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(3322,'Alampalayam,Pappampalayam'),(3323,'Erode,Thindal'),(3324,'Iruppu,Karunampathi'),(3325,'Erode,Erode,Collectorate'),(3326,'Erode,Surampatti,Erode,East'),(3327,'Erode,Erode,East'),(3328,'Erode,Railway,Colony,Erode,Railway,Colony'),(3329,'Erode,Vairapalayam,Karungalpalayam'),(3330,'Pungampadi,Kanagapuram'),(3331,'Erode,Erode,East'),(3332,'Erode,Erode,Collectorate'),(3333,'Erode,Erode,East'),(3334,'Erode,Erode,East'),(3335,'Erode,Moolapalayam,Erode,Railway,Colony'),(3336,'Erode,Karungalpalayam'),(3337,'Chikkaiah,Naicker,College,Chikkaiah,Naicker,College'),(3338,'Erode,Erode,East'),(3339,'Chithode,Erode,Chittode'),(3340,'Erode,Erode,Collectorate'),(3341,'Erode,Perundurai,Erode,Collectorate'),(3342,'Erode,Karungalpalayam'),(3343,'Erode,Erode,East'),(3344,'Erode,Nasiyanur,Pudur,Anur,Kadirampatti'),(3345,'Erode,Sampath,Nagar,Erode,Collectorate'),(3346,'Erode,Periyar,Nagar,Erode,East'),(3347,'Erode,Erode,Fort,Karungalpalayam'),(3348,'Erode,Kollampalayam,Arur,Karur,Erode,Railway,Colony'),(3349,'Erode,Perundurai,Erode,Collectorate'),(3350,'Karukkampalayam,Karukkampalayam'),(3351,'Erode,Nasiyanur,Sampath,Nagar,Anur,Erode,Collectorate'),(3352,'Erode,Chikkaiah,Naicker,College'),(3353,'Erode,Moolapalayam,Arur,Karur,Erode,Railway,Colony'),(3354,'Kadukkampalayam,Kadukkampalayam'),(3355,'Erode,Chettipalayam,Erode,Railway,Colony'),(3356,'Erode,Periyar,Nagar,Erode,East'),(3357,'Erode,Erode,Collectorate'),(3358,'Erode,Erode,East'),(3359,'Komarapalayam,Kallankattuvalasu'),(3360,'Erode,Sampath,Nagar,Erode,Collectorate'),(3361,'Erode,Kollampalayam,Erode,Railway,Colony'),(3362,'Pallipalayam,Pallipalayam'),(3363,'Erode,Edayankattuvalsu'),(3364,'Erode,Thindal,Kadirampatti'),(3365,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(3366,'Sampath,Nagar,Erode,Collectorate'),(3367,'Erode,Edayankattuvalsu'),(3368,'Erode,Teachers,Colony,Erode,Collectorate'),(3369,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(3370,'Erode,Erode,Collectorate'),(3371,'Sampath,Nagar,Erode,Collectorate'),(3372,'Erode,Perundurai,Ingur'),(3373,'Erode,Surampatti,Veerappanchatram,Chikkaiah,Naicker,College'),(3374,'Erode,Karungalpalayam,Arungal,Gandhipuram,Karungalpalayam'),(3375,'Devanankurichi,Devanankurichi'),(3376,'Erode,Erode,Fort,Erode,East'),(3377,'Erode,Nanjaiuthukuli,Chinniyampalayam,Elumathur'),(3378,'Erode,Edayankattuvalsu'),(3379,'Erode,Erode,Fort,Erode,Collectorate'),(3380,'Erode,Erode,East'),(3381,'Erode,Marapalam,Arur,Karur,Erode,East'),(3382,'Perundurai,Ingur'),(3383,'Gobichettipalayam,Chettipalayam,Kadukkampalayam'),(3384,'Gobichettipalayam,Chettipalayam,Kali,Kadukkampalayam'),(3385,'Erode,Erode,Railway,Colony'),(3386,'Erode,Perundurai,Eral,Edayankattuvalsu'),(3387,'Erode,Karungalpalayam'),(3388,'Erode,Erode,Collectorate'),(3389,'Arasampalayam,Seerampalayam'),(3390,'Athani,Erode,Guthialathur'),(3391,'Erode,Arur,Karur,Erode,Railway,Colony'),(3392,'Lakkapuram,Engan,Iruppu,Erode,Railway,Colony'),(3393,'Erode,Railway,Colony,Erode,Railway,Colony'),(3394,'Erode,Perundurai,Ingur'),(3395,'Erode,Surampatti,Erode,East'),(3396,'Erode,Erode,Collectorate'),(3397,'Morur,Morur'),(3398,'Erode,East,Erode,East'),(3399,'Erode,Rangampalayam,Chennimalai,Edayankattuvalsu'),(3400,'Erode,Kanjikovil'),(3401,'Pudur,Kanagapuram'),(3402,'Erode,Appakudal'),(3403,'Erode,Thindal,Thindal'),(3404,'Erode,Suriyampalayam,Erode,Collectorate'),(3405,'Erode,Ganapathipalayam,Arur,Athipalayam,Karur,Ganapathipalayam'),(3406,'Erode,Erode,East'),(3407,'Erode,Anur,Ammapettai'),(3408,'Perundurai,Kanji,Kanjikovil,Kanjikovil'),(3409,'Erode,Thindal,Thindal'),(3410,'Erode,Erode,East'),(3411,'Erode,Erode,Collectorate'),(3412,'Chithode,Erode,Chittode'),(3413,'Bhavani,Vasavi,College'),(3414,'Erode,Peria,Agraharam'),(3415,'Ingur,Ingur'),(3416,'Erode,Erode,East'),(3417,'Erode,Erode,East'),(3418,'Erode,Chikkaiah,Naicker,College'),(3419,'Erode,Soolai,Chikkaiah,Naicker,College'),(3420,'Vairapalayam,Karungalpalayam'),(3421,'Bhavani,Perundurai,Ingur'),(3422,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(3423,'Erode,Surampatti,Ayal,Erode,East'),(3424,'Erode,Erode,East'),(3425,'Erode,Perundurai,Erode,Collectorate'),(3426,'Erode,Moolapalayam,Arur,Karur,Erode,Railway,Colony'),(3427,'Erode,Thindal'),(3428,'Erode,East,Erode,East'),(3429,'Erode,Surampatti,Erode,Collectorate'),(3430,'Erode,Erode,East'),(3431,'Erode,Erode,Collectorate'),(3432,'Kambiliyampatti,Kambiliyampatti'),(3433,'Erode,Erode,Fort,Erode,East'),(3434,'Erode,Chittode'),(3435,'Erode,Erode,Fort,Erode,East'),(3436,'Kollampalayam,Erode,Railway,Colony'),(3437,'Erode,Erode,Fort,Erode,East'),(3438,'Erode,Erode,Collectorate'),(3439,'Erode,Erode,Collectorate'),(3440,'Bhavani,Erode,Voc,Park,Chikkaiah,Naicker,College'),(3441,'Perundurai,Chennimalai,Ingur'),(3442,'Erode,Erode,East'),(3443,'Erode,Thindal'),(3444,'Erode,Erode,East'),(3445,'Erode,Kalpalayam,Erode,Railway,Colony'),(3446,'Kaspapettai,Avalpundurai'),(3447,'Erode,Palayapalayam,Thindal'),(3448,'Erode,Palayapalayam,Thindal'),(3449,'Erode,Edayankattuvalsu'),(3450,'Erode,Thindal'),(3451,'Erode,Muncipal,Colony,Veerappanchatram,Chikkaiah,Naicker,College'),(3452,'Erode,Erode,Collectorate'),(3453,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(3454,'Erode,Surampatti,Edayankattuvalsu'),(3455,'Erode,Erode,Collectorate'),(3456,'Erode,Chikkaiah,Naicker,College'),(3457,'Erode,Erode,Collectorate'),(3458,'Erode,Perundurai,Kanagapuram'),(3459,'Erode,Voc,Park,Karungalpalayam'),(3460,'Erode,Erode,East'),(3461,'Erode,Erode,Railway,Colony'),(3462,'Erode,Rangampalayam,Edayankattuvalsu'),(3463,'Erode,Chikkaiah,Naicker,College'),(3464,'Erode,Erode,Fort,Erode,East'),(3465,'Erode,Ingur'),(3466,'Erode,Kadirampatti'),(3467,'Erode,Periyar,Nagar,Surampatti,Erode,East'),(3468,'Erode,Rangampalayam,Edayankattuvalsu'),(3469,'Erode,Perundurai,Athur,Ingur'),(3470,'Erode,Erode,East'),(3471,'Erode,Elumathur'),(3472,'Erode,Peria,Agraharam'),(3473,'Seerampalayam,Seerampalayam'),(3474,'Erode,Karungalpalayam'),(3475,'Erode,Teachers,Colony,Erode,Collectorate'),(3476,'Erode,Erode,Fort,Erode,East'),(3477,'Erode,Ganapathipalayam'),(3478,'Erode,Lakkapuram,Erode,Railway,Colony'),(3479,'Erode,Nasiyanur,Anur,Edayankattuvalsu'),(3480,'Erode,Chikkaiah,Naicker,College'),(3481,'Erode,Thindal,Thindal'),(3482,'Chithode,Erode,Pudur,Chittode'),(3483,'Erode,Kathirampatti,Perundurai,Illupur,Kadirampatti'),(3484,'Erode,Kaikatti,Thindal'),(3485,'Erode,Erode,East'),(3486,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(3487,'Erode,Erode,East'),(3488,'Erode,Erode,East'),(3489,'Erode,Emur,Chikkaiah,Naicker,College'),(3490,'Erode,Erode,Collectorate'),(3491,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(3492,'Erode,Periyar,Nagar,Erode,East'),(3493,'Erode,Perundurai,Kadirampatti'),(3494,'Erode,Chidambaram,Edayankattuvalsu'),(3495,'Erode,Karungalpalayam'),(3496,'Erode,Perundurai,Thindal'),(3497,'Erode,Erode,Fort,Erode,East'),(3498,'Erode,Erode,Railway,Colony'),(3499,'Erode,Erode,Fort,Erode,East'),(3500,'Erode,Erode,East'),(3501,'Erode,Erode,Fort,Karungalpalayam'),(3502,'Erode,Moolapalayam,Erode,Railway,Colony'),(3503,'Erode,Chidambaram,Erode,East'),(3504,'Erode,Kasipalayam,Erode,Railway,Colony'),(3505,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(3506,'Erode,Vasavi,College'),(3507,'Erode,Erode,Fort,Erode,East'),(3508,'Erode,Kasipalayam,Erode,Railway,Colony'),(3509,'Erode,Pallipalayam'),(3510,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(3511,'Bhavani,Bhavani,Kudal'),(3512,'Erode,Mullampatti,Kadirampatti'),(3513,'Iruppu,Kallampalayam,Road'),(3514,'Ennai,Pallavaram'),(3515,'Erode,Thindal,Thindal'),(3516,'Erode,Kathirampatti,Perundurai,Erode,Collectorate'),(3517,'Erode,Erode,Railway,Colony'),(3518,'Erode,Sampath,Nagar,Erode,Collectorate'),(3519,'Agraharam,Bhavani,Erode,Chikkaiah,Naicker,College'),(3520,'Erode,Erode,Fort,Erode,East'),(3521,'Erode,Erode,Fort,Erode,East'),(3522,'Erode,Erode,Fort,Erode,East'),(3523,'Sathyamangalam,Akkaraisengapalli'),(3524,'Erode,Eral,Edayankattuvalsu'),(3525,'Erode,Perundurai,Edayankattuvalsu'),(3526,'Erode,Chikkaiah,Naicker,College'),(3527,'Erode,Periyar,Nagar,Erode,East'),(3528,'Erode,Chennimalai,Erode,East'),(3529,'Seerampalayam,Seerampalayam'),(3530,'Thindal,Thindal'),(3531,'Erode,Erode,Collectorate'),(3532,'Allikuttai,Allikuttai'),(3533,'Erode,Narayana,Valasu,Nasiyanur,Anur,Kadirampatti'),(3534,'Kamaraj,Nagar,Bommasamudram'),(3535,'Erode,Erode,Railway,Colony'),(3536,'Erode,East,Erode,East'),(3537,'Kollampalayam,Arur,Karur,Erode,Railway,Colony'),(3538,'Erode,Nadarmedu,Erode,Railway,Colony'),(3539,'Erode,Periyar,Nagar,Edayankattuvalsu'),(3540,'Agraharam,Alampalayam,Seerampalayam'),(3541,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(3542,'Erode,Erode,Railway,Colony'),(3543,'Erode,Erode,Fort,Erode,East'),(3544,'Erode,Erode,Collectorate'),(3545,'Erode,Edayankattuvalsu'),(3546,'Erode,Erode,Railway,Colony'),(3547,'Erode,Moolapalayam,Erode,Railway,Colony'),(3548,'Erode,Karungalpalayam'),(3549,'Erode,Erode,Fort,Erode,East'),(3550,'Bhavani,Kali,Vasavi,College'),(3551,'Erode,Surampatti,Edayankattuvalsu'),(3552,'Erode,Teachers,Colony,Erode,Collectorate'),(3553,'Chithode,Chittode'),(3554,'Erode,Thindal,Thindal'),(3555,'Erode,Moolapalayam,Arur,Karur,Erode,Railway,Colony'),(3556,'Erode,Thirunagar,Colony,Karungalpalayam'),(3557,'Erode,Erode,Fort,Erode,East'),(3558,'Erode,Karungalpalayam'),(3559,'Erode,Karungalpalayam'),(3560,'Erode,Amoor,Karungalpalayam'),(3561,'Erode,Surampatti,Erode,East'),(3562,'Erode,Erode,Fort,Erode,East'),(3563,'Erode,Amoor,Karungalpalayam'),(3564,'Bhavani,Erode,Bhavani,Kudal'),(3565,'Erode,Erode,East'),(3566,'Erode,Erode,Fort,Erode,East'),(3567,'Erode,Perundurai,Thindal,Thindal'),(3568,'Erode,Muncipal,Colony,Erode,Collectorate'),(3569,'Erode,Erode,Collectorate'),(3570,'Erode,Erode,East'),(3571,'Erode,Soolai,Chikkaiah,Naicker,College'),(3572,'Erode,Sampath,Nagar,Erode,Collectorate'),(3573,'Erode,Karungalpalayam'),(3574,'Erode,Erode,Fort,Erode,East'),(3575,'Bhavani,Erode,Vasavi,College'),(3576,'Gobichettipalayam,Chettipalayam,Gobichettipalayam'),(3577,'Erode,Teachers,Colony,Erode,Collectorate'),(3578,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(3579,'Erode,Chettipalayam,Erode,Railway,Colony'),(3580,'Erode,Periyar,Nagar,Erode,East'),(3581,'Erode,Thirunagar,Colony,Karungalpalayam'),(3582,'Morur,Morur'),(3583,'Erode,Sampath,Nagar,Erode,Collectorate'),(3584,'Erode,Erode,Fort,Erode,East'),(3585,'Erode,Erode,East'),(3586,'Teachers,Colony,Alampalayam,Seerampalayam'),(3587,'Ennai,Chetput'),(3588,'Erode,Erode,Collectorate'),(3589,'Erode,Thindal,Thindal'),(3590,'Ennai,Anna,Nagar,(Chennai)'),(3591,'Erode,Erode,East'),(3592,'Erode,Edayankattuvalsu'),(3593,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(3594,'Erode,Perundurai,Kadirampatti'),(3595,'Karungalpalayam,Arungal,Karungalpalayam'),(3596,'Namakkal,Bazaar,Namakkal,Bazaar'),(3597,'Bhavani,Erode,Kali,Bhavani,Kudal'),(3598,'Gobichettipalayam,Chettipalayam,Kadukkampalayam'),(3599,'Elur,Nanjai,Edaiyar'),(3600,'Avadi,Marakkadai'),(3601,'Erode,Perundurai,Thindal,Thindal'),(3602,'Kasthuripatti,Kasthuripatti'),(3603,'Erode,Dharapuram,Iruppu,Cholakkadai,Street'),(3604,'Erode,Pudur,Tiruchengodu,North'),(3605,'Erode,Karungalpalayam'),(3606,'Erode,Perundurai,Erode,Collectorate'),(3607,'Erode,Erode,Collectorate'),(3608,'Erode,Erode,East'),(3609,'Erode,Karungalpalayam'),(3610,'Iruppu,Kallampalayam,Road'),(3611,'Perundurai,Sullipalayam,Palakarai'),(3612,'Bhavani,Erode,Peria,Agraharam'),(3613,'Erode,Erode,East'),(3614,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(3615,'Bhavani,Chittode'),(3616,'Erode,Erode,East'),(3617,'Gobichettipalayam,Pudupalayam,Chettipalayam,Kadukkampalayam'),(3618,'Erode,Sampath,Nagar,Erode,Collectorate'),(3619,'Erode,Kalichettipalayam.,Mettupalayam'),(3620,'Erode,Erode,Fort,Erode,East'),(3621,'Emur,Chikkaiah,Naicker,College'),(3622,'Erode,Erode,Fort,Erode,East'),(3623,'Erode,Erode,East'),(3624,'Erode,Chidambaram,Erode,East'),(3625,'Erode,Palayapalayam,Perundurai,Thindal'),(3626,'Erode,Erode,Collectorate'),(3627,'Erode,Veerappanchatram,Arur,Karur,Chikkaiah,Naicker,College'),(3628,'Erode,Erode,East'),(3629,'Pallipalayam,Pallipalayam'),(3630,'Erode,Surampatti,Erode,East'),(3631,'Erode,Perundurai,Erode,Collectorate'),(3632,'Erode,Chikkaiah,Naicker,College'),(3633,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(3634,'Erode,Chikkaiah,Naicker,College'),(3635,'Erode,Perundurai,Thindal,Thindal'),(3636,'Erode,Karungalpalayam'),(3637,'Erode,Erode,Collectorate'),(3638,'Erode,Karungalpalayam'),(3639,'Basuvapatti,Basuvapatti'),(3640,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(3641,'Erode,Kavilipalayam'),(3642,'Nanjai,Edaiyar,Nanjai,Edaiyar'),(3643,'Erode,Athur,Edayankattuvalsu'),(3644,'Iruppu,Karukkankattupudur'),(3645,'Erode,Arasampatti,Thindal'),(3646,'Erode,Solar,Erode,Railway,Colony'),(3647,'Erode,Erode,Collectorate'),(3648,'Chidambaram,Chennai,Anna,Road'),(3649,'Erode,Erode,East'),(3650,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(3651,'Erode,Edayankattuvalsu'),(3652,'Agraharam,Erode,Peria,Agraharam'),(3653,'Erode,Thindal,Thindal'),(3654,'Erode,Edayankattuvalsu'),(3655,'Erode,Periyar,Nagar,Erode,East'),(3656,'Erode,Thindal,Arasampatti,Kadirampatti'),(3657,'Chithode,Erode,Kavilipalayam'),(3658,'Erode,Surampatti,Edayankattuvalsu'),(3659,'Bhavani,Erode,Chikkaiah,Naicker,College'),(3660,'Erode,Moolapalayam,Perundurai,Kanji,Kanjikovil,Kavilipalayam'),(3661,'Kavundampalayam,Seerampalayam'),(3662,'Erode,Surampatti,Edayankattuvalsu'),(3663,'Erode,Erode,Fort,Erode,East'),(3664,'Erode,Palayapalayam,Erode,Collectorate'),(3665,'Erode,Surampatti,Edayankattuvalsu'),(3666,'Erode,Chikkaiah,Naicker,College'),(3667,'Erode,Vasavi,College'),(3668,'Erode,Moolapalayam,Erode,Railway,Colony'),(3669,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(3670,'Erode,Erode,East'),(3671,'Iruppu,Karukkankattupudur'),(3672,'Erode,Veerappanchatram,Cauvery,Nagar,Chikkaiah,Naicker,College'),(3673,'Erode,Periyar,Nagar,Erode,East'),(3674,'Erode,Erode,Fort,Erode,East'),(3675,'Lakkapuram,Solar,Erode,Railway,Colony'),(3676,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(3677,'Erode,Erode,Railway,Colony'),(3678,'Iruppu,Karuvampalayam,Karuvampalayam'),(3679,'Erode,Erode,East'),(3680,'Erode,Erode,East'),(3681,'Unjanaigoundampalayam,Unjanaigoundampalayam'),(3682,'Iruppu,Karuvampalayam'),(3683,'Erode,Thindal'),(3684,'Erode,Erode,Collectorate'),(3685,'Erode,Perundurai,Erode,Collectorate'),(3686,'Erode,Erode,Fort,Erode,East'),(3687,'Erode,Arur,Karai,Karur,Erode,Railway,Colony'),(3688,'Erode,Erode,East'),(3689,'Erode,Chikkaiah,Naicker,College'),(3690,'Perundurai,Athur,Ingur'),(3691,'Erode,Nasiyanur,Sampath,Nagar,Anur,Erode,Collectorate'),(3692,'Erode,Chittode'),(3693,'Erode,Palayapalayam,Erode,Collectorate'),(3694,'Erode,Perundurai,Erode,Collectorate'),(3695,'Erode,Chikkaiah,Naicker,College'),(3696,'Erode,Perundurai,Erode,Collectorate'),(3697,'Gobichettipalayam,Kasipalayam,Chettipalayam,Akkaraikodiveri'),(3698,'Erode,Erode,Fort,Erode,East'),(3699,'Erode,Kadirampatti'),(3700,'Erode,Kullampalayam,Kadukkampalayam'),(3701,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(3702,'Erode,Periyar,Nagar,Erode,East'),(3703,'Erode,Voc,Park,Karungalpalayam'),(3704,'Erode,Perundurai,Erode,Collectorate'),(3705,'Erode,Erode,East'),(3706,'Erode,Perundurai,Thindal,Thindal'),(3707,'Erode,Karungalpalayam'),(3708,'Erode,Nasiyanur,Anur,Thindal'),(3709,'Erode,Sampath,Nagar,Erode,Collectorate'),(3710,'Erode,Erode,Fort,Erode,East'),(3711,'Erode,Erode,Collectorate'),(3712,'Gobichettipalayam,Modachur,Pudur,Achur,Chettipalayam,Dharapuram,Kadukkampalayam'),(3713,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(3714,'Fairlands,Fairlands'),(3715,'Erode,Karungalpalayam'),(3716,'Erode,Thirunagar,Colony,Karungalpalayam'),(3717,'Erode,Chittode'),(3718,'Erode,Karungalpalayam'),(3719,'Erode,Karungalpalayam'),(3720,'Erode,Muncipal,Colony,Karungalpalayam'),(3721,'Erode,Sampath,Nagar,Chikkaiah,Naicker,College'),(3722,'Erode,Erode,Fort,Erode,East'),(3723,'Erode,Karungalpalayam'),(3724,'Erode,Chikkaiah,Naicker,College'),(3725,'Palayapalayam,Perundurai,Erode,Collectorate'),(3726,'Pallipalayam,Pallipalayam'),(3727,'Erode,Erode,Collectorate'),(3728,'Erode,Perundurai,Thindal,Thindal'),(3729,'Erode,Erode,Fort,Arimalam,Erode,Collectorate'),(3730,'Erode,Ingur'),(3731,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(3732,'Erode,Perundurai,Karai,Kadirampatti'),(3733,'Erode,Karungalpalayam'),(3734,'Appakudal,Appakudal'),(3735,'Erode,Perundurai,Erode,Collectorate'),(3736,'Komarapalayam,Kallankattuvalasu'),(3737,'Akkarapalayam,Akkarapalayam'),(3738,'Erode,Ellapalayam,Chikkaiah,Naicker,College'),(3739,'Erode,Kokkarayanpettai,Pappampalayam'),(3740,'Erode,Karungalpalayam'),(3741,'Erode,Sampath,Nagar,Erode,Collectorate'),(3742,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(3743,'Erode,Thindal'),(3744,'Emur,Chikkaiah,Naicker,College'),(3745,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(3746,'Erode,Edayankattuvalsu'),(3747,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(3748,'Erode,Erode,Collectorate'),(3749,'Erode,Erode,East'),(3750,'Erode,Palayapalayam,Edayankattuvalsu'),(3751,'Erode,Sampath,Nagar,Erode,Collectorate'),(3752,'Erode,Karungalpalayam'),(3753,'Erode,Thindal'),(3754,'Erode,Thindal,Thindal'),(3755,'Chikkaiah,Naicker,College,Chikkaiah,Naicker,College'),(3756,'Alampalayam,Anur,Kali,Kaliyanur,Seerampalayam'),(3757,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(3758,'Erode,Railway,Colony,Arur,Karur,Erode,Railway,Colony'),(3759,'Emur,Chikkaiah,Naicker,College'),(3760,'Agraharam,Seerampalayam'),(3761,'Erode,Erode,East'),(3762,'Erode,Perundurai,Erode,Collectorate'),(3763,'Erode,Chennimalai,Erode,East'),(3764,'Erode,Perundurai,Edayankattuvalsu'),(3765,'Erode,Perundurai,Edayankattuvalsu'),(3766,'Erode,Erode,Railway,Colony'),(3767,'Erode,Sampath,Nagar,Erode,Collectorate'),(3768,'Erode,Kalpalayam,Erode,Railway,Colony'),(3769,'Erode,Kadirampatti'),(3770,'Erode,Perundurai,Thindal,Thindal'),(3771,'Erode,Karungalpalayam'),(3772,'Attavanai,Hanuman,Palli,Arachalur'),(3773,'Erode,Periyar,Nagar,Erode,East'),(3774,'Erode,Erode,Fort,Erode,East'),(3775,'Erode,Erode,East'),(3776,'Erode,Chikkaiah,Naicker,College'),(3777,'Erode,Kalpalayam,Erode,Railway,Colony'),(3778,'Erode,Erode,East'),(3779,'Erode,Thirunagar,Colony,Karungalpalayam'),(3780,'Erode,Perundurai,Erode,Collectorate'),(3781,'Erode,Karungalpalayam'),(3782,'Erode,Veerappanchatram,Karungalpalayam'),(3783,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(3784,'Erode,Kavilipalayam'),(3785,'Avalpoondurai,Erode,Erode,East'),(3786,'Erode,Erode,East'),(3787,'Pudur,Coimbatore,Siddhapudur'),(3788,'Erode,Chittode'),(3789,'Erode,Erode,East'),(3790,'Erode,Soolai,Chikkaiah,Naicker,College'),(3791,'Edayankattuvalsu,Edayankattuvalsu'),(3792,'Gobichettipalayam,Chettipalayam,Kadukkampalayam'),(3793,'Erode,Erode,East'),(3794,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(3795,'Erode,Moolapalayam,Erode,Railway,Colony'),(3796,'Erode,Erode,Railway,Colony'),(3797,'Erode,Erode,Fort,Erode,East'),(3798,'Erode,Erode,East'),(3799,'Agraharam,Bhavani,Erode,Peria,Agraharam'),(3800,'Erode,Karungalpalayam'),(3801,'Karungalpalayam,Arungal,Karungalpalayam'),(3802,'Ellapalayam,Emur,Chikkaiah,Naicker,College'),(3803,'Erode,Erode,Fort,Edappadi,Erode,East'),(3804,'Chithode,Erode,Chikkaiah,Naicker,College'),(3805,'Erode,Moolapalayam,Erode,Railway,Colony'),(3806,'Gobichettipalayam,Chettipalayam,Kadukkampalayam'),(3807,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(3808,'Komarapalayam,Coimbatore,Kallankattuvalasu'),(3809,'Erode,Solar,Erode,Railway,Colony'),(3810,'Erode,Periyar,Nagar,Erode,East'),(3811,'Erode,Erode,Collectorate'),(3812,'Erode,Thirunagar,Colony,Karungalpalayam'),(3813,'Erode,Kali,Erode,East'),(3814,'Erode,Erode,East'),(3815,'Erode,Erode,Collectorate'),(3816,'Erode,Erode,Fort,Erode,East'),(3817,'Erode,Thirunagar,Colony,Karungalpalayam'),(3818,'Erode,Kanagapuram'),(3819,'Erode,Erode,East'),(3820,'Erode,Erode,Fort,Erode,East'),(3821,'Erode,Chikkaiah,Naicker,College'),(3822,'Erode,Chennimalai,Edayankattuvalsu'),(3823,'Erode,Erode,East'),(3824,'Erode,Edayankattuvalsu'),(3825,'Erode,Perundurai,Erode,Collectorate'),(3826,'Erode,Moolapalayam,Erode,Railway,Colony'),(3827,'Erode,Erode,Fort,Karungalpalayam'),(3828,'Komarapalayam,Kallankattuvalasu'),(3829,'Erode,Surampatti,Erode,East'),(3830,'Erode,Karungalpalayam'),(3831,'Erode,Perundurai,Erode,Collectorate'),(3832,'Erode,Allapalayam,Kanji,Kanjikovil,Kavundampalayam,Kanjikovil'),(3833,'Veerappanchatram,Chikkaiah,Naicker,College'),(3834,'Erode,Marapalam,Erode,East'),(3835,'Erode,Solar,Erode,Railway,Colony'),(3836,'Erode,Edayankattuvalsu'),(3837,'Erode,Erode,East'),(3838,'Ayyampalayam,Kalichettipalayam.,Mettupalayam'),(3839,'Erode,Teachers,Colony,Erode,Collectorate'),(3840,'Erode,Erode,Fort,Erode,East'),(3841,'Erode,Marapalam,Erode,East'),(3842,'Erode,Kamaraj,Nagar,Bhavani,Kudal'),(3843,'Ambur,Kannampalayam'),(3844,'Athur,Chennai,Kolathur'),(3845,'Erode,Periya,Valasu,Veerappanchatram,Chikkaiah,Naicker,College'),(3846,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(3847,'Erode,Erode,Fort,Erode,East'),(3848,'Veerappanchatram,Chikkaiah,Naicker,College'),(3849,'Erode,Railway,Colony,Erode,East'),(3850,'Erode,Erode,Collectorate'),(3851,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(3852,'Erode,Karungalpalayam'),(3853,'Erode,Surampatti,Erode,East'),(3854,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(3855,'Erode,Thirunagar,Colony,Karungalpalayam'),(3856,'Erode,Erode,Fort,Erode,East'),(3857,'Erode,Karungalpalayam'),(3858,'Erode,Erode,Fort,Erode,East'),(3859,'Erode,Marapalam,Erode,East'),(3860,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(3861,'Erode,Erode,Fort,Erode,East'),(3862,'Erode,Emur,Chikkaiah,Naicker,College'),(3863,'Erode,Erode,East'),(3864,'Erode,Karungalpalayam'),(3865,'Erode,Thindal,Thindal'),(3866,'Erode,Seerampalayam'),(3867,'Erode,Erode,Fort,Erode,East'),(3868,'Erode,Erode,Railway,Colony'),(3869,'Erode,Karungalpalayam'),(3870,'Erode,Karungalpalayam'),(3871,'Erode,Karungalpalayam'),(3872,'Erode,Erode,East'),(3873,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(3874,'Veerappanchatram,Chikkaiah,Naicker,College'),(3875,'Perundurai,Thindal,Thindal'),(3876,'Erode,Thindal,Thindal'),(3877,'Edappadi,Erumaipatti'),(3878,'Erode,Erode,Fort,Erode,East'),(3879,'Erode,Erode,Fort,Erode,East'),(3880,'Erode,Thindal,Thindal'),(3881,'Erode,Chikkaiah,Naicker,College'),(3882,'Chettipalayam,Coimbatore,Eachanari,Ichampatti,Coimbatore,Industrial,Estate'),(3883,'Erode,Lakkapuram,Erode,Railway,Colony'),(3884,'Erode,Chidambaram,Erode,East'),(3885,'Erode,Edayankattuvalsu'),(3886,'Erode,Edayankattuvalsu'),(3887,'Erode,Erode,East'),(3888,'Erode,Moolapalayam,Erode,Railway,Colony'),(3889,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(3890,'Erode,Chikkaiah,Naicker,College'),(3891,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(3892,'Erode,Teachers,Colony,Erode,Collectorate'),(3893,'Palayapalayam,Perundurai,Thindal'),(3894,'Erode,Kadirampatti'),(3895,'Erode,Gandhipuram,Karungalpalayam'),(3896,'Erode,Chettipalayam,Erode,Railway,Colony'),(3897,'Erode,Gandhipuram,Karungalpalayam'),(3898,'Erode,Perundurai,Thindal'),(3899,'Iruppu,Karaipudur'),(3900,'Pudur,Iruppu,15,Velampalayam'),(3901,'Erode,Perundurai,Thindal'),(3902,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(3903,'Erode,Kanagapuram'),(3904,'Alapatti,Coimbatore,Kalapatti,Coimbatore,Tidel,Park'),(3905,'Erode,Palayapalayam,Perundurai,Thindal'),(3906,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(3907,'Erode,Muncipal,Colony,Karungalpalayam'),(3908,'Erode,Surampatti,Erode,East'),(3909,'Erode,Karungalpalayam'),(3910,'Erode,Gangapuram,Chittode'),(3911,'Erode,Erode,Fort,Erode,East'),(3912,'Pudur,Coimbatore,Irugur,Athappagoundenpudur'),(3913,'Pallipalayam,Pallipalayam'),(3914,'Erode,Erode,East'),(3915,'Erode,Perundurai,Kanagapuram'),(3916,'Erode,Marapalam,Erode,East'),(3917,'Erode,Ganapathipalayam,Athipalayam,Ganapathipalayam'),(3918,'Erode,Edayankattuvalsu'),(3919,'Erode,Nasiyanur,Anur,Thindal'),(3920,'Erode,Chikkaiah,Naicker,College'),(3921,'Erode,Erode,Fort,Erode,East'),(3922,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(3923,'Perundurai,Ingur'),(3924,'Erode,Railway,Colony,Erode,Railway,Colony'),(3925,'Vadamugam,Vellode,Kanagapuram'),(3926,'Erode,Veerappanchatram,Erode,Collectorate'),(3927,'Erode,Erode,Fort,Erode,East'),(3928,'Erode,Lakkapuram,Arur,Karur,Erode,Railway,Colony'),(3929,'Erode,Erode,East'),(3930,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(3931,'Erode,Erode,Collectorate'),(3932,'Erode,Erode,Fort,Erode,East'),(3933,'Erode,Thindal'),(3934,'Erode,Erode,East'),(3935,'Erode,Erode,East'),(3936,'Erode,Pudur,Ellapalayam,Erode,Railway,Colony'),(3937,'Erode,Arimalam,Thindal'),(3938,'Erode,Siruvalur,Vellankoil'),(3939,'Erode,Erode,East'),(3940,'Erode,Karungalpalayam,Amoor,Arungal,Karungalpalayam'),(3941,'Erode,Erode,Collectorate'),(3942,'Kurichi,Coimbatore,Keeranatham'),(3943,'Agraharam,Seerampalayam'),(3944,'Erode,Pudur,Peria,Agraharam'),(3945,'Dharmapuri,Public,Offices,Dharmapuri,Public,Offices'),(3946,'Erode,Chikkaiah,Naicker,College'),(3947,'Pallipalayam,Pallipalayam'),(3948,'Erode,Erode,Fort,Erode,East'),(3949,'Erode,Solar,Erode,Railway,Colony'),(3950,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(3951,'Erode,Erode,Fort,Erode,East'),(3952,'Perundurai,Chennimalai,Kanagapuram'),(3953,'Bhavani,Kali,Vasavi,College'),(3954,'Erode,Erode,Fort,Erode,East'),(3955,'Erode,Coimbatore,Thindal'),(3956,'Iruppu,Kallampalayam,Road'),(3957,'Erode,Erode,East'),(3958,'Erode,Erode,East'),(3959,'Erode,Erode,Fort,Erode,East'),(3960,'Erode,Erode,Collectorate'),(3961,'Erode,Karungalpalayam,Moolapalayam,Arungal,Karungalpalayam'),(3962,'Erode,Erode,Collectorate'),(3963,'Erode,Perundurai,Erode,Collectorate'),(3964,'Erode,Perundurai,Erode,Collectorate'),(3965,'Erode,Edayankattuvalsu'),(3966,'Ayal,Seerampalayam'),(3967,'Perundurai,Seenapuram,Athur,Palakarai'),(3968,'Erode,Erode,Collectorate'),(3969,'Erode,Erode,Railway,Colony'),(3970,'Erode,Karungalpalayam,Marapalam,Arungal,Karungalpalayam'),(3971,'Agraharam,Attur,Kattur,Seerampalayam'),(3972,'Erode,Erode,East'),(3973,'Erode,Karungalpalayam'),(3974,'Erode,Palayapalayam,Thindal'),(3975,'Erode,Seerampalayam'),(3976,'Perundurai,Kambiliyampatti'),(3977,'Erode,Perundurai,Thindal'),(3978,'Erode,Nanjaiuthukuli,Elumathur'),(3979,'Erode,Emur,Karungalpalayam'),(3980,'Erode,Perundurai,Eral,Erode,Collectorate'),(3981,'Erode,Erode,Collectorate'),(3982,'Bhavani,Bhavani,Kudal'),(3983,'Erode,Chikkaiah,Naicker,College'),(3984,'Erode,Karungalpalayam'),(3985,'Palayapalayam,Perundurai,Teachers,Colony,Erode,Collectorate'),(3986,'Erode,Erode,Collectorate'),(3987,'Erode,Chikkaiah,Naicker,College'),(3988,'Erode,Periyar,Nagar,Edayankattuvalsu'),(3989,'Erode,Edayankattuvalsu'),(3990,'Karungalpalayam,Arungal,Kali,Karungalpalayam'),(3991,'Erode,Perundurai,Thindal,Thindal'),(3992,'Idappadi,Erumaipatti'),(3993,'Pallipalayam,Pallipalayam'),(3994,'Erode,Thindal,Kanagapuram'),(3995,'Erode,Arasampatti,Kadirampatti'),(3996,'Erode,Erode,Collectorate'),(3997,'Erode,Perundurai,Kadirampatti'),(3998,'Erode,Moolapalayam,Railway,Colony,Erode,Railway,Colony'),(3999,'Erode,Chikkaiah,Naicker,College'),(4000,'Erode,Alampalayam,Seerampalayam'),(4001,'Erode,Erode,East'),(4002,'Erode,Chidambaram,Erode,East'),(4003,'Coimbatore,Ganapathy,P&T,Staff,Quarters'),(4004,'Erode,Periya,Valasu,Veerappanchatram,Chikkaiah,Naicker,College'),(4005,'Erode,Thindal,Thindal'),(4006,'Erode,Kali,Kavindapadi,Bhavani,Kudal'),(4007,'Erode,Palayapalayam,Ganapathi,Nagar,Erode,Collectorate'),(4008,'Erode,Perundurai,Erode,Collectorate'),(4009,'Erode,Erode,Fort,Erode,East'),(4010,'Erode,Palayapalayam,Erode,Collectorate'),(4011,'Erode,Perundurai,Erode,Collectorate'),(4012,'Erode,Erode,Railway,Colony'),(4013,'Erode,Arasampatti,Kadirampatti'),(4014,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(4015,'Erode,Perundurai,Thindal'),(4016,'Erode,Kanagapuram'),(4017,'Erode,Erode,East'),(4018,'Erode,Thindal,Thindal'),(4019,'Erode,Erode,Collectorate'),(4020,'Erode,Edayankattuvalsu'),(4021,'Erode,Nasiyanur,Anur,Thindal'),(4022,'Erode,Teachers,Colony,Erode,Collectorate'),(4023,'Bhavani,Erode,Komarapalayam,Edappadi,Kallankattuvalasu'),(4024,'Agraharam,Edayankattuvalsu'),(4025,'Erode,Ellapalayam,Emur,Chikkaiah,Naicker,College'),(4026,'Erode,Alampalayam,Seerampalayam'),(4027,'Dasanaickenpatti,Dasanaickenpatti'),(4028,'Erode,Erode,East'),(4029,'Erode,Arasampatti,Kadirampatti'),(4030,'Erode,Injampalli,Kurichi,Akkur,Elumathur'),(4031,'Erode,Rangampalayam,Edayankattuvalsu'),(4032,'Erode,Edayankattuvalsu'),(4033,'Erode,Nanjaiuthukuli,Erode,Railway,Colony'),(4034,'Erode,Periya,Valasu,Chikkaiah,Naicker,College'),(4035,'Erode,Arasampatti,Thindal'),(4036,'Erode,Thindal'),(4037,'Coimbatore,Iruppu,Karumathampatti,Karumathampatti'),(4038,'Erode,Kavandapadi,Kalichettipalayam.,Mettupalayam'),(4039,'Erode,Erode,Collectorate'),(4040,'Erode,Thindal'),(4041,'Perundurai,Thindal,Thindal'),(4042,'Erode,Kathirampatti,Nanjanapuram,Kadirampatti'),(4043,'Mukasipidariyur,Perundurai,Ariyur,Chennimalai,Basuvapatti'),(4044,'Erode,Thirunagar,Colony,Karungalpalayam'),(4045,'Erode,Thindal,Thindal'),(4046,'Erode,Erode,Collectorate'),(4047,'Erode,Erode,East'),(4048,'Erode,Erode,Fort,Erode,East'),(4049,'Erode,Erode,East'),(4050,'Erode,Erode,East'),(4051,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(4052,'Erode,Kasipalayam,Solar,Erode,Railway,Colony'),(4053,'Erode,Erode,East'),(4054,'Erode,Erode,Collectorate'),(4055,'Bhavani,Erode,Peria,Agraharam'),(4056,'Thindal,Kanagapuram'),(4057,'Erode,Marapalam,Erode,East'),(4058,'Erode,Erode,East'),(4059,'Erode,Surampatti,Erode,East'),(4060,'Chikkaiah,Naicker,College,Chikkaiah,Naicker,College'),(4061,'Erode,Erode,East'),(4062,'Erode,Thindal,Kanagapuram'),(4063,'Erode,Palayapalayam,Thindal'),(4064,'Erode,Vairapalayam,Ganapathy,Karungalpalayam'),(4065,'Erode,Teachers,Colony,Erode,Collectorate'),(4066,'Erode,Kanagapuram'),(4067,'Erode,Soolai,Chikkaiah,Naicker,College'),(4068,'Erode,Chettipalayam,Erode,Railway,Colony'),(4069,'Erode,Erode,Collectorate'),(4070,'Erode,Muncipal,Colony,Veerappanchatram,Chikkaiah,Naicker,College'),(4071,'Erode,Periyar,Nagar,Erode,East'),(4072,'Erode,Karungalpalayam'),(4073,'Erode,Erode,East'),(4074,'Karungalpalayam,Karungalpalayam'),(4075,'Erode,Erode,Fort,Erode,East'),(4076,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(4077,'Erode,Vairapalayam,Karungalpalayam'),(4078,'Erode,Perundurai,Erode,Collectorate'),(4079,'Erode,Karungalpalayam'),(4080,'Erode,Veerappanchatram,Karungalpalayam'),(4081,'Erode,Pudur,Erode,Railway,Colony'),(4082,'Erode,Erode,East'),(4083,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(4084,'Erode,Chikkaiah,Naicker,College'),(4085,'Erode,Erode,East'),(4086,'Erode,Chikkaiah,Naicker,College'),(4087,'Avalpundurai,Avalpundurai'),(4088,'Karungalpalayam,Arungal,Karungalpalayam'),(4089,'Erode,Chittode'),(4090,'Erode,Erode,Collectorate'),(4091,'Erode,Erode,Fort,Erode,East'),(4092,'Morur,Morur'),(4093,'Erode,Karungalpalayam,Andiyur,Arungal,Karungalpalayam'),(4094,'Erode,Perundurai,Erode,Collectorate'),(4095,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(4096,'Kanjikovil,Kanjikovil'),(4097,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(4098,'Bhavani,Erode,Chikkaiah,Naicker,College'),(4099,'Erode,Thirunagar,Colony,Karungalpalayam'),(4100,'Iruppu,Karuvampalayam'),(4101,'Palayapalayam,Erode,Collectorate'),(4102,'Erode,Thindal'),(4103,'Erode,Surampatti,Edayankattuvalsu'),(4104,'Asur,Edayankattuvalsu'),(4105,'Erode,Karungalpalayam'),(4106,'Jawahar,Mills,Jawahar,Mills'),(4107,'Erode,Thindal'),(4108,'Erode,Perundurai,Thindal,Thindal'),(4109,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(4110,'Anur,Namakkal,Bazaar'),(4111,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(4112,'Erode,Edayankattuvalsu'),(4113,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(4114,'Erode,Perundurai,Kali,Ingur'),(4115,'Erode,Erode,Collectorate'),(4116,'Erode,Arur,Karur,Erode,Railway,Colony'),(4117,'Erode,Erode,East'),(4118,'Chithode,Erode,Chikkaiah,Naicker,College'),(4119,'Erode,Moolapalayam,Arur,Karur,Erode,Railway,Colony'),(4120,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(4121,'Erode,Erode,Fort,Erode,East'),(4122,'Erode,Erode,East'),(4123,'Erode,Chikkaiah,Naicker,College'),(4124,'Chithode,Chittode'),(4125,'Anthiyur,Bhavani,Dalavoipettai'),(4126,'Erode,Edayankattuvalsu'),(4127,'Pudur,Coimbatore,Siddhapudur'),(4128,'Erode,Kanagapuram'),(4129,'Erode,Karungalpalayam'),(4130,'Erode,Thindal,Kanagapuram'),(4131,'Erode,Erode,Collectorate'),(4132,'Erode,Chittode'),(4133,'Erode,Pudur,Chettipalayam,Erode,Railway,Colony'),(4134,'Erode,Edayankattuvalsu'),(4135,'Erode,Karungalpalayam'),(4136,'Erode,Perundurai,Erode,Collectorate'),(4137,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(4138,'Erode,Chikkaiah,Naicker,College'),(4139,'Erode,Perundurai,Thindal'),(4140,'Erode,Erode,Fort,Erode,Collectorate'),(4141,'Erode,Arimalam,Erode,Collectorate'),(4142,'Erode,Periyar,Nagar,Edayankattuvalsu'),(4143,'Erode,Erode,East'),(4144,'Pallipalayam,Pallipalayam'),(4145,'Chithode,Erode,Chittode'),(4146,'Erode,Edayankattuvalsu'),(4147,'Erode,Erode,Fort,Erode,East'),(4148,'Erode,Perundurai,Thindal'),(4149,'Alampalayam,Pappampalayam'),(4150,'Erode,Erode,Fort,Erode,East'),(4151,'Erode,Surampatti,Erode,East'),(4152,'Erode,Chikkaiah,Naicker,College'),(4153,'Erode,Nadarmedu,Erode,Railway,Colony'),(4154,'Erode,Erode,Fort,Erode,East'),(4155,'Erode,Erode,East'),(4156,'Erode,Moolapalayam,Erode,Railway,Colony'),(4157,'Erode,Periyar,Nagar,Erode,East'),(4158,'Erode,Karungalpalayam'),(4159,'Erode,Soolai,Chikkaiah,Naicker,College'),(4160,'Erode,Kavilipalayam'),(4161,'Erode,Karungalpalayam'),(4162,'Erode,Thindal'),(4163,'Erode,Moolapalayam,Arur,Karur,Erode,Railway,Colony'),(4164,'Erode,Erode,Fort,Erode,East'),(4165,'Erode,Emur,Chikkaiah,Naicker,College'),(4166,'Erode,Nadarmedu,Erode,Railway,Colony'),(4167,'Perundurai,Ingur'),(4168,'Erode,East,Erode,East'),(4169,'Chithode,Erode,Chittode'),(4170,'Erode,Erode,Fort,Erode,East'),(4171,'Erode,Erode,Fort,Erode,East'),(4172,'Erode,Moolapalayam,Nadarmedu,Erode,Railway,Colony'),(4173,'Erode,Edayankattuvalsu'),(4174,'Erode,Chikkaiah,Naicker,College'),(4175,'Erode,Karungalpalayam'),(4176,'Erode,Kanagapuram'),(4177,'Erode,Marapalam,Erode,East'),(4178,'Appakudal,Appakudal'),(4179,'Perundurai,Eral,Ingur'),(4180,'Erode,Moolapalayam,Erode,Railway,Colony'),(4181,'Erode,Erode,Collectorate'),(4182,'T.Kokkulam,T.Kokkulam'),(4183,'Erode,Emur,Chikkaiah,Naicker,College'),(4184,'Erode,Erode,Fort,Erode,East'),(4185,'Erode,Palayapalayam,Perundurai,Thindal'),(4186,'Erode,Karungalpalayam'),(4187,'Erode,Erode,Fort,Erode,East'),(4188,'Erode,Railway,Colony,Erode,Railway,Colony'),(4189,'Erode,Nanjaiuthukuli,Elumathur'),(4190,'Bhavani,Erode,Chikkaiah,Naicker,College'),(4191,'Pallipalayam,Pallipalayam'),(4192,'Erode,Karungalpalayam'),(4193,'Erode,Erode,Fort,Erode,East'),(4194,'Erode,Kurichi,Erode,East'),(4195,'Erode,Surampatti,Edayankattuvalsu'),(4196,'Erode,Erode,Fort,Erode,East'),(4197,'Avanashipalayampudur,Avanashipalayampudur'),(4198,'Erode,Erode,East'),(4199,'Erode,Erode,Fort,Erode,East'),(4200,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(4201,'Iruppu,Tea,Nagar'),(4202,'Chithode,Chittode'),(4203,'Erode,Sampath,Nagar,Erode,Collectorate'),(4204,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(4205,'Erode,Erode,East'),(4206,'Iruppu,Karuvampalayam'),(4207,'Erode,Edayankattuvalsu'),(4208,'Kollampalayam,Erode,Railway,Colony'),(4209,'Erode,Thindal,Thindal'),(4210,'Erode,Marapalam,Erode,East'),(4211,'Bhavani,Erode,Erode,East'),(4212,'Perundurai,Ichanda,Karukkampalayam,Ingur'),(4213,'Erode,Thindal'),(4214,'Erode,Erode,East'),(4215,'Amaravathi,Nagar,Peria,Agraharam'),(4216,'Erode,Erode,East'),(4217,'Bhavani,Erode,Vasavi,College'),(4218,'Erode,Perundurai,Ingur'),(4219,'Erode,Chikkaiah,Naicker,College'),(4220,'Erode,Thindal'),(4221,'Erode,Erode,East'),(4222,'Erode,Athipalayam,Chettipalayam,Erode,Railway,Colony'),(4223,'Erode,Arur,Karur,Kolanalli'),(4224,'Erode,Karungalpalayam'),(4225,'Erode,Pallipalayam'),(4226,'Erode,Erode,East'),(4227,'Elumathur,Elumathur'),(4228,'Erode,Kandampalayam,Kadirampatti'),(4229,'Erode,Erode,Fort,Erode,East'),(4230,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(4231,'Erode,Erode,Fort,Erode,East'),(4232,'Erode,Surampatti,Edayankattuvalsu'),(4233,'Erode,Erode,East'),(4234,'Erode,Sivagiri,Karukkampalayam,Ammankoil'),(4235,'Erode,Erode,Fort,Erode,East'),(4236,'Erode,Erode,Fort,Erode,East'),(4237,'Erode,Teachers,Colony,Erode,Collectorate'),(4238,'Avalpoondurai,Kangayam,Avalpundurai'),(4239,'Periyar,Nagar,Edayankattuvalsu'),(4240,'Erode,Erode,Fort,Erode,East'),(4241,'Erode,Moolapalayam,Erode,Railway,Colony'),(4242,'Erode,Dusi,Erode,Collectorate'),(4243,'Perundurai,638060'),(4244,'Nasiyanur,Anur,Kadirampatti'),(4245,'Erode,Karungalpalayam'),(4246,'Erode,Erode,Fort,Erode,East'),(4247,'Erode,Erode,East'),(4248,'Erode,Palayapalayam,Erode,Collectorate'),(4249,'Erode,Marapalam,Erode,East'),(4250,'Erode,Erode,East'),(4251,'Erode,Perundurai,Erode,Collectorate'),(4252,'Erode,Marapalam,Surampatti,Erode,East'),(4253,'Bhavani,Erode,Bhavani,Kudal'),(4254,'Erode,Moolapalayam,Nadarmedu,Kallivalasu,Erode,Railway,Colony'),(4255,'Erode,Chidambaram,Erode,East'),(4256,'Erode,Erode,East'),(4257,'Erode,Periyar,Nagar,Erode,East'),(4258,'Merkupathi,Merkupathi'),(4259,'Kuruppanaickenpalayam,Bhavani,Kudal'),(4260,'Bodupatti,Bodupatti'),(4261,'Erode,Karungalpalayam'),(4262,'Erode,Nadarmedu,Erode,Railway,Colony'),(4263,'Erode,Chikkaiah,Naicker,College'),(4264,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(4265,'Erode,Erode,Fort,Erode,East'),(4266,'Erode,Erode,Fort,Erode,East'),(4267,'Erode,Muncipal,Colony,Veerappanchatram,Chikkaiah,Naicker,College'),(4268,'Agraharam,Bhavani,Erode,Peria,Agraharam'),(4269,'Erode,Perundurai,Chennimalai,Basuvapatti'),(4270,'Siruvalur,Vellankovil,Vellankoil'),(4271,'Erode,Avalpundurai'),(4272,'Erode,Soolai,Chikkaiah,Naicker,College'),(4273,'Erode,Gobichettipalayam,Chettipalayam,Kadukkampalayam'),(4274,'Erode,Erode,East'),(4275,'Erode,Surampatti,Edayankattuvalsu'),(4276,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(4277,'Erode,Erode,Collectorate'),(4278,'Gobichettipalayam,Kullampalayam,Chettipalayam,Kadukkampalayam'),(4279,'Erode,Chettipalayam,Erode,Railway,Colony'),(4280,'Punnamchatram,Punnamchatram'),(4281,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(4282,'Erode,Erode,East'),(4283,'Erode,Ganapathipalayam,Athipalayam,Seerampalayam'),(4284,'Erode,Kalpalayam,Chikkaiah,Naicker,College'),(4285,'Erode,Kandampalayam,Perundurai,Ingur'),(4286,'Erode,Erode,East'),(4287,'Erode,Thindal,Thindal'),(4288,'Chithode,Erode,Chittode'),(4289,'Erode,Erode,Collectorate'),(4290,'Perundurai,Ingur'),(4291,'Erode,Erode,East'),(4292,'Erode,Erode,Fort,Erode,East'),(4293,'Erode,Erode,Fort,Erode,East'),(4294,'Erode,Ambodi'),(4295,'Erode,Chidambaram,Erode,East'),(4296,'Erode,Erode,Fort,Erode,East'),(4297,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(4298,'Erode,Erode,Railway,Colony'),(4299,'Erode,Marapalam,Erode,East'),(4300,'Coimbatore,Krishnaswamy,Nagar'),(4301,'Erode,Erode,East'),(4302,'Bhavani,Perundurai,Ingur'),(4303,'Erode,Erode,Fort,Erode,East'),(4304,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(4305,'Erode,Moolapalayam,Erode,Railway,Colony'),(4306,'Erode,Thindal'),(4307,'Erode,Erode,Fort,Erode,East'),(4308,'Nambiyur,Koshanam'),(4309,'Erode,Arasampatti,Kadirampatti'),(4310,'Erode,Karungalpalayam'),(4311,'Erode,Chikkaiah,Naicker,College'),(4312,'Erode,Erode,Fort,Karungalpalayam'),(4313,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(4314,'Erode,Vairapalayam,Karungalpalayam'),(4315,'Erode,Surampatti,Erode,East'),(4316,'Erode,Chikkaiah,Naicker,College'),(4317,'Anthiyur,Bhavani,Bhavani,Kudal'),(4318,'Unjanaigoundampalayam,Unjanaigoundampalayam'),(4319,'Erode,Erode,Fort,Erode,East'),(4320,'Erode,Erode,East'),(4321,'Erode,Thindal,Thindal'),(4322,'Erode,Ammankoil'),(4323,'Erode,Erode,Collectorate'),(4324,'Bhavani,Erode,Ammapettai'),(4325,'Erode,Periyar,Nagar,Erode,East'),(4326,'Erode,Kaikatti,Thindal'),(4327,'Anur,Eyyanur,Marakkadai'),(4328,'Erode,Thindal,Thindal'),(4329,'Agraharam,Erode,Erode,East'),(4330,'Erode,Palayapalayam,Erode,Collectorate'),(4331,'Erode,Vairapalayam,Karungalpalayam'),(4332,'Erode,Edayankattuvalsu'),(4333,'Erode,Nadarmedu,Erode,Railway,Colony'),(4334,'Bhavani,Erode,Chikkaiah,Naicker,College'),(4335,'Perundurai,Kanji,Kanjikovil'),(4336,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(4337,'Rajan,Nagar,Sathyamangalam,Anur,Chikkarasampalayam'),(4338,'Erode,Nanjaiuthukuli,Elumathur'),(4339,'Erode,Erode,East'),(4340,'Erode,Erode,East'),(4341,'Erode,Moolapalayam,Erode,Railway,Colony'),(4342,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(4343,'Veerappanchatram,Chikkaiah,Naicker,College'),(4344,'Erode,Erode,East'),(4345,'Erode,Perundurai,Erode,Collectorate'),(4346,'Erode,Erode,Railway,Colony'),(4347,'Erode,Arasampatti,Kadirampatti'),(4348,'Erode,Erode,Fort,Karungalpalayam'),(4349,'Karungalpalayam,Arungal,Karungalpalayam'),(4350,'Erode,Perundurai,Kadirampatti'),(4351,'Bhavani,Bhavani,Kudal'),(4352,'Erode,Erode,Fort,Erode,East'),(4353,'Erode,Pudur,Solar,Erode,Railway,Colony'),(4354,'Erode,Erode,East'),(4355,'Agraharam,Bhavani,Erode,Peria,Agraharam'),(4356,'Pallipalayam,Pallipalayam'),(4357,'Erode,Sathyamangalam,Chikkarasampalayam'),(4358,'Erode,Sampath,Nagar,Erode,Collectorate'),(4359,'Erode,Thindal,Thindal'),(4360,'Erode,Karungalpalayam'),(4361,'Erode,Kollampalayam,Erode,Railway,Colony'),(4362,'Erode,Chikkaiah,Naicker,College'),(4363,'Erode,Karungalpalayam'),(4364,'Erode,Karungalpalayam'),(4365,'Erode,Erode,Fort,Erode,East'),(4366,'Bhavani,Erode,Peria,Agraharam'),(4367,'Erode,Thirunagar,Colony,Karungalpalayam'),(4368,'Bhavani,Erode,Chikkaiah,Naicker,College'),(4369,'Erode,Chikkaiah,Naicker,College'),(4370,'Erode,Karungalpalayam'),(4371,'Erode,Erode,Fort,Erode,East'),(4372,'Bhavani,Erode,Perundurai,Chikkaiah,Naicker,College'),(4373,'Erode,Erode,Fort,Erode,East'),(4374,'Nasiyanur,Anur,Kadirampatti'),(4375,'Veerappanchatram,Chikkaiah,Naicker,College'),(4376,'Erode,Erode,Collectorate'),(4377,'Erode,Teachers,Colony,Erode,Collectorate'),(4378,'Erode,Manickampalayam,Soolai,Chikkaiah,Naicker,College'),(4379,'Erode,Surampatti,Erode,East'),(4380,'Erode,Thirunagar,Colony,Karungalpalayam'),(4381,'Erode,Marapalam,Erode,East'),(4382,'Bhavani,Erode,Chikkaiah,Naicker,College'),(4383,'Erode,Erode,Fort,Erode,East'),(4384,'Erode,Alampalayam,Seerampalayam'),(4385,'Erode,Kollampalayam,Erode,Railway,Colony'),(4386,'Erode,Kanagapuram'),(4387,'Erode,Soolai,Andikadu,Chikkaiah,Naicker,College'),(4388,'Erode,Periyar,Nagar,Erode,East'),(4389,'Erode,Palayapalayam,Edayankattuvalsu'),(4390,'Erode,Erode,Collectorate'),(4391,'Erode,Chennimalai,Erode,East'),(4392,'Emur,Chikkaiah,Naicker,College'),(4393,'Erode,Karungalpalayam'),(4394,'Erode,Perundurai,Thindal'),(4395,'Karungalpalayam,Arungal,Karungalpalayam'),(4396,'Erode,Edayankattuvalsu'),(4397,'Erode,Thindal'),(4398,'Erode,Karungalpalayam'),(4399,'Coimbatore,Cbe,Mpl.Central,Busstand'),(4400,'Erode,Pudur,Erode,Railway,Colony'),(4401,'Erode,Kaspapettai,Avalpundurai'),(4402,'Erode,Erode,Collectorate'),(4403,'Erode,Erode,Collectorate'),(4404,'Erode,Edayankattuvalsu'),(4405,'Erode,Teachers,Colony,Erode,Collectorate'),(4406,'Erode,Thindal,Thindal'),(4407,'Erode,Erode,Fort,Erode,East'),(4408,'Erode,Karungalpalayam'),(4409,'Kollampalayam,Solar,Erode,Railway,Colony'),(4410,'Erode,Thindal,Ganapathi,Nagar,Thindal'),(4411,'Erode,Edayankattuvalsu'),(4412,'Erode,Surampatti,Erode,East'),(4413,'Erode,Karungalpalayam'),(4414,'Erode,Kadirampatti'),(4415,'Erode,Perundurai,Thindal,Thindal'),(4416,'Erode,Erode,East'),(4417,'Hogenakkal,Dinnabelur'),(4418,'Erode,Erode,Collectorate'),(4419,'Agraharam,Bhavani,Erode,Peria,Agraharam'),(4420,'Erode,Pudur,Arachalur'),(4421,'Erode,Periyar,Nagar,Erode,East'),(4422,'Pallipalayam,Pallipalayam'),(4423,'Erode,Thindal,Thindal'),(4424,'Erode,Erode,East'),(4425,'Erode,Erode,East'),(4426,'Erode,Karungalpalayam'),(4427,'Erode,Edayankattuvalsu'),(4428,'Agraharam,Erode,Erode,East'),(4429,'Erode,Erode,East'),(4430,'Erode,Erode,East'),(4431,'Pallipalayam,Pallipalayam'),(4432,'Erode,Nadarmedu,Erode,Railway,Colony'),(4433,'Erode,Chidambaram,Erode,East'),(4434,'Erode,Kollampalayam,Arur,Karur,Erode,Railway,Colony'),(4435,'Bairamangalam,Bairamangalam'),(4436,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(4437,'Erode,Erode,Fort,Erode,East'),(4438,'Erode,Teachers,Colony,Erode,Collectorate'),(4439,'Erode,Arur,Karur,Kavilipalayam'),(4440,'Erode,Erode,Fort,Erode,East'),(4441,'Erode,Karungalpalayam'),(4442,'Erode,Lakkapuram,Erode,Railway,Colony'),(4443,'Thindal,Thindal'),(4444,'Erode,Erode,East'),(4445,'Erode,Erode,East'),(4446,'Chikkarasampalayam,Chikkarasampalayam'),(4447,'Erode,Erode,East'),(4448,'Erode,Erode,Fort,Erode,East'),(4449,'Perundurai,Ingur'),(4450,'Erode,Rangampalayam,Edayankattuvalsu'),(4451,'Erode,Erode,Fort,Erode,East'),(4452,'Erode,Nanjaiuthukuli,Ayal,Elumathur'),(4453,'Erode,Surampatti,Edayankattuvalsu'),(4454,'Erode,Erode,East'),(4455,'Erode,Muncipal,Colony,Karungalpalayam'),(4456,'Erode,Erode,East'),(4457,'Sathyamangalam,Kavilipalayam'),(4458,'Erode,Erode,Fort,Dharmapuri,Erode,East'),(4459,'Erode,Sivagiri,Ammankoil'),(4460,'Erode,Erode,Fort,Erode,East'),(4461,'Erode,Thindal,Thindal'),(4462,'Alampalayam,Seerampalayam'),(4463,'Erode,Thindal'),(4464,'Bhavani,Erode,Suriyampalayam,Vasavi,College'),(4465,'Erode,Erode,East'),(4466,'Perundurai,Chittode'),(4467,'Erode,Moolapalayam,Erode,Railway,Colony'),(4468,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(4469,'Erode,Erode,Fort,Erode,East'),(4470,'Erode,Surampatti,Erode,East'),(4471,'Erode,Erode,Fort,Palayapalayam,Erode,East'),(4472,'Erode,Erode,Collectorate'),(4473,'Erode,Chidambaram,Erode,East'),(4474,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(4475,'Karungalpalayam,Arungal,Karungalpalayam'),(4476,'Erode,Erode,Fort,Erode,East'),(4477,'Bhavani,Erode,Chikkaiah,Naicker,College'),(4478,'Erode,Edayankattuvalsu'),(4479,'Erode,Erode,East'),(4480,'Erode,Karungalpalayam'),(4481,'Kodumudi,Sivagiri,Ammankoil'),(4482,'Erode,Thindal'),(4483,'Erode,Ganapathy,Erode,East'),(4484,'Erode,Erode,Fort,Erode,East'),(4485,'Erode,Arur,Karur,Erode,Railway,Colony'),(4486,'Erode,Soolai,Chikkaiah,Naicker,College'),(4487,'Erode,Moolapalayam,Nadarmedu,Arur,Karur,Erode,Railway,Colony'),(4488,'Erode,Karungalpalayam'),(4489,'Vasavi,College,Vasavi,College'),(4490,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(4491,'Erode,Thindal'),(4492,'Erode,Erode,East'),(4493,'Erode,Moolapalayam,Arur,Karur,Erode,Railway,Colony'),(4494,'Andagalur,Andagalur'),(4495,'Erode,Erode,Fort,Nadarmedu,Erode,East'),(4496,'Erode,Erode,East'),(4497,'Erode,Chikkaiah,Naicker,College'),(4498,'Erode,Perundurai,Erode,Collectorate'),(4499,'Erode,Erode,Collectorate'),(4500,'Erode,Erode,Fort,Erode,East'),(4501,'Thindal,Thindal'),(4502,'Erode,Erode,Collectorate'),(4503,'Erode,Pallipalayam'),(4504,'Erode,Chikkaiah,Naicker,College'),(4505,'Erode,Palayapalayam,Teachers,Colony,Erode,Collectorate'),(4506,'Ellapalayam,Chikkaiah,Naicker,College'),(4507,'Devanankurichi,Devanankurichi'),(4508,'Karattupalayam,Devanankurichi'),(4509,'Erode,Erode,Fort,Erode,East'),(4510,'Erode,Erode,Collectorate'),(4511,'Erode,Erode,Fort,Erode,East'),(4512,'Perumugai,Kanakkampalayam'),(4513,'Athur,Merkupathi'),(4514,'Erode,Perundurai,Karumandisellipalayam,Ingur'),(4515,'Edayankattuvalsu,Edayankattuvalsu'),(4516,'Erode,Erode,Collectorate'),(4517,'Metturdam,Metturdam'),(4518,'Perundurai,Kadirampatti'),(4519,'Erode,Erode,Collectorate'),(4520,'Erode,Moolapalayam,Arur,Karur,Erode,Railway,Colony'),(4521,'Agraharam,Erode,Erode,East'),(4522,'Erode,Erode,Fort,Erode,East'),(4523,'Erode,Erode,Fort,Erode,East'),(4524,'Pallipalayam,Pallipalayam'),(4525,'Bhavani,Erode,Chikkaiah,Naicker,College'),(4526,'Chithode,Erode,Chittode'),(4527,'Erode,Kollampalayam,Arur,Karur,Erode,Railway,Colony'),(4528,'Erode,Kollampalayam,Erode,Railway,Colony'),(4529,'Erode,Erode,Fort,Erode,East'),(4530,'Erode,Erode,Fort,Karungalpalayam'),(4531,'Erode,Surampatti,Kali,Edayankattuvalsu'),(4532,'Bhavani,Chithode,Erode,Chittode'),(4533,'Erode,Veerappanchatram,Arur,Karur,Chikkaiah,Naicker,College'),(4534,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(4535,'Erode,Muncipal,Colony,Periya,Valasu,Veerappanchatram,Chikkaiah,Naicker,College'),(4536,'Erode,Erode,East'),(4537,'Erode,Erode,Fort,Erode,East'),(4538,'Erode,Edayankattuvalsu'),(4539,'Bhavani,Erode,Chikkaiah,Naicker,College'),(4540,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(4541,'Erode,Karungalpalayam'),(4542,'Erode,Erode,Fort,Erode,East'),(4543,'Erode,Erode,Fort,Erode,East'),(4544,'Erode,Karungalpalayam'),(4545,'Pasur,Asur,Kolanalli'),(4546,'Erode,Erode,Fort,Erode,East'),(4547,'Erode,Chikkaiah,Naicker,College'),(4548,'Erode,Erode,East'),(4549,'Erode,Karungalpalayam'),(4550,'Erode,Chidambaram,Erode,East'),(4551,'Erode,Edayankattuvalsu'),(4552,'Komarapalayam,Kallankattuvalasu'),(4553,'Erode,Thirunagar,Colony,Karungalpalayam'),(4554,'Erode,Chikkaiah,Naicker,College'),(4555,'Erode,Nasiyanur,Anur,Thindal'),(4556,'Arasampatti,Kaikatti,Kadirampatti'),(4557,'Kamaraj,Nagar,Bommasamudram'),(4558,'Periyapuliyur,Chittode'),(4559,'Erode,Perundurai,Erode,Collectorate'),(4560,'Erode,Erode,Fort,Erode,East'),(4561,'Agraharam,Erode,Peria,Agraharam'),(4562,'Bhavani,Erode,Kali,Vasavi,College'),(4563,'Erode,Karungalpalayam'),(4564,'Erode,Erode,Fort,Erode,East'),(4565,'Erode,Palayapalayam,Perundurai,Teachers,Colony,Erode,Collectorate'),(4566,'Erode,Karungalpalayam'),(4567,'Erode,Erode,East'),(4568,'Erode,Perundurai,Teachers,Colony,Amoor,Erode,Collectorate'),(4569,'Elumathur,Mathur,Athur,Ammankoil'),(4570,'Erode,Perundurai,Kanagapuram'),(4571,'Erode,Erode,Fort,Erode,East'),(4572,'Erode,Surampatti,Edayankattuvalsu'),(4573,'Erode,Muncipal,Colony,Veerappanchatram,Chikkaiah,Naicker,College'),(4574,'Erode,Nasiyanur,Anur,Thindal'),(4575,'Erode,Erode,Collectorate'),(4576,'Erode,Avalpundurai'),(4577,'Erode,Karungalpalayam'),(4578,'Erode,Moolapalayam,Erode,Railway,Colony'),(4579,'Erode,Karungalpalayam'),(4580,'Erode,Marapalam,Erode,East'),(4581,'Erode,Karungalpalayam'),(4582,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(4583,'Chithode,Erode,Chittode'),(4584,'Erode,Erode,East'),(4585,'Erode,Thirunagar,Colony,Karungalpalayam'),(4586,'Bhavani,Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(4587,'Erode,Erode,Fort,Erode,East'),(4588,'Erode,Sampath,Nagar,Erode,Collectorate'),(4589,'Erode,Edayankattuvalsu'),(4590,'Erode,Perundurai,Erode,Collectorate'),(4591,'Erode,Erode,Fort,Erode,East'),(4592,'Erode,Chennimalai,Erode,East'),(4593,'Erode,Perundurai,Erode,Collectorate'),(4594,'Erode,Erode,East'),(4595,'Annadanapatti,Annadanapatti'),(4596,'Erode,Karungalpalayam'),(4597,'Erode,Thindal,Thindal'),(4598,'Erode,Erode,East'),(4599,'Erode,Karungalpalayam'),(4600,'Erode,Pallipalayam'),(4601,'Erode,Erode,East'),(4602,'Erode,Periyar,Nagar,Erode,East'),(4603,'Erode,Karungalpalayam'),(4604,'Erode,Kasipalayam,Edayankattuvalsu'),(4605,'Erode,Voc,Park,Karungalpalayam'),(4606,'Erode,Edayankattuvalsu'),(4607,'Pudur,Ganapathipalayam'),(4608,'Erode,Erode,East'),(4609,'Devagoundanur,Devagoundanur'),(4610,'Erode,Solar,Erode,Railway,Colony'),(4611,'Erode,Palayapalayam,Perundurai,Thindal'),(4612,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(4613,'Erode,Karungalpalayam'),(4614,'Erode,Erode,East'),(4615,'Erode,Periya,Valasu,Chikkaiah,Naicker,College'),(4616,'Erode,Sampath,Nagar,Erode,Collectorate'),(4617,'Erode,Erode,Fort,Erode,East'),(4618,'Erode,Surampatti,Edayankattuvalsu'),(4619,'Erode,Erode,Fort,Erode,East'),(4620,'Erode,Chikkaiah,Naicker,College'),(4621,'Erode,Erode,Fort,Erode,East'),(4622,'Erode,Erode,Fort,Avanam,Erode,East'),(4623,'Ammapettai,Ammapet,Ammapettai'),(4624,'Erode,Erode,Fort,Erode,East'),(4625,'Erode,Erode,Fort,Erode,East'),(4626,'Erode,Thirunagar,Colony,Karungalpalayam'),(4627,'Erode,Chikkaiah,Naicker,College'),(4628,'Erode,Gandhipuram,Karungalpalayam'),(4629,'Erode,Erode,Railway,Colony'),(4630,'Erode,Karungalpalayam'),(4631,'Erode,Erode,Fort,Erode,East'),(4632,'Erode,Erode,East'),(4633,'Erode,Edayankattuvalsu'),(4634,'Erode,Lakkapuram,Pudur,Erode,Railway,Colony'),(4635,'Erode,Gobichettipalayam,Chettipalayam,Kadukkampalayam'),(4636,'Erode,Moolapalayam,Dharapuram,Erode,Railway,Colony'),(4637,'Erode,Gandhipuram,Karungalpalayam'),(4638,'Erode,Erode,Fort,Erode,East'),(4639,'Erode,Periyar,Nagar,Erode,East'),(4640,'Erode,Chidambaram,Erode,East'),(4641,'Erode,Erode,Fort,Erode,East'),(4642,'Erode,Erode,East'),(4643,'Erode,Peria,Agraharam'),(4644,'Erode,Erode,Collectorate'),(4645,'Anur,Pothanur'),(4646,'Erode,Chikkaiah,Naicker,College'),(4647,'Erode,Erode,Collectorate'),(4648,'Avalpoondurai,Avalpundurai'),(4649,'Kodumudi,Sivagiri,Ammankoil'),(4650,'Moolpattarai,Karungalpalayam'),(4651,'Erode,Nanjaiuthukuli,Elumathur'),(4652,'Erode,Erode,Fort,Erode,East'),(4653,'Agraharam,Bhavani,Erode,Peria,Agraharam'),(4654,'Indunagar,Dunsandle'),(4655,'Erode,Erode,Fort,Erode,East'),(4656,'Erode,Karungalpalayam,Thirunagar,Colony,Arungal,Karungalpalayam'),(4657,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(4658,'Erode,Erode,Fort,Erode,East'),(4659,'Erode,Erode,East'),(4660,'Erode,Marapalam,Erode,East'),(4661,'Erode,Erode,East'),(4662,'Erode,Kanagapuram'),(4663,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(4664,'Erode,Thindal'),(4665,'Erode,Perundurai,Erode,Collectorate'),(4666,'Erode,Erode,East'),(4667,'Chithode,Erode,Perundurai,Chittode'),(4668,'Erode,East,Erode,East'),(4669,'Erode,Perundurai,Thingalur,Nichampalayam'),(4670,'Erode,Kavuthampalayam,Erode,Railway,Colony'),(4671,'Erode,Periyar,Nagar,Erode,East'),(4672,'Erode,Erode,East'),(4673,'Erode,Erode,Fort,Erode,East'),(4674,'Erode,Soolai,Veerappanchatram,Chikkaiah,Naicker,College'),(4675,'Erode,Teachers,Colony,Erode,Collectorate'),(4676,'Erode,Erode,East'),(4677,'Erode,Karungalpalayam'),(4678,'Erode,Marapalam,Erode,East'),(4679,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(4680,'Erode,Marapalam,Kannivadi,Erode,East'),(4681,'Perundurai,Ingur'),(4682,'Erode,Erode,Fort,Erode,East'),(4683,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(4684,'Erode,Kalichettipalayam.,Mettupalayam'),(4685,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(4686,'Erode,Perundurai,Amoor,Erode,Collectorate'),(4687,'Erode,Perundurai,Thuduppathi,Palakarai'),(4688,'Erode,Thindal,Thindal'),(4689,'Erode,Erode,Collectorate'),(4690,'Erode,Erode,Fort,Karungalpalayam'),(4691,'Erode,Erode,East'),(4692,'Kollampalayam,Erode,Railway,Colony'),(4693,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(4694,'Erode,Gandhipuram,Karungalpalayam'),(4695,'Erode,Perundurai,Thindal'),(4696,'Erode,Chikkaiah,Naicker,College'),(4697,'Erode,Karungalpalayam'),(4698,'Erode,Erode,Fort,Erode,Collectorate'),(4699,'Erode,Chikkaiah,Naicker,College'),(4700,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(4701,'Erode,Koottapalli'),(4702,'Erode,Chikkaiah,Naicker,College'),(4703,'Pallipalayam,Pallipalayam'),(4704,'Seerampalayam,Seerampalayam'),(4705,'Erode,Erode,Fort,Erode,East'),(4706,'Erode,Erode,Fort,Erode,East'),(4707,'Erode,Thindal'),(4708,'Agraharam,Bhavani,Erode,Peria,Agraharam'),(4709,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(4710,'Erode,Erode,Collectorate'),(4711,'Erode,Perundurai,Coimbatore,Ingur'),(4712,'Erode,Marapalam,Erode,East'),(4713,'Kalichettipalayam.,Mettupalayam,Kalichettipalayam.,Mettupalayam'),(4714,'Erode,Edayankattuvalsu'),(4715,'Alampalayam,Seerampalayam'),(4716,'Erode,Erode,Fort,Erode,East'),(4717,'Erode,Erode,Collectorate'),(4718,'Erode,Erode,Fort,Erode,East'),(4719,'Erode,Perundurai,Ingur'),(4720,'Erode,Erode,East'),(4721,'Erode,Marapalam,Erode,East'),(4722,'Erode,Sivagiri,Avudayarparai'),(4723,'Erode,Karattadipalayam,Alukuli'),(4724,'Chithode,Erode,Gangapuram,Chittode'),(4725,'Erode,Thindal,Thindal'),(4726,'Pudur,Kalpalayam,Erode,Railway,Colony'),(4727,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(4728,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(4729,'Erode,Surampatti,Erode,East'),(4730,'Erode,Erode,Railway,Colony'),(4731,'Erode,Erode,Fort,Erode,East'),(4732,'Erode,Erode,East'),(4733,'Erode,Edayankattuvalsu'),(4734,'Erode,Erode,East'),(4735,'Erode,Moolapalayam,Erode,Railway,Colony'),(4736,'Erode,Erode,Railway,Colony'),(4737,'Erode,Perundurai,Thindal'),(4738,'Erode,Surampatti,Edayankattuvalsu'),(4739,'Erode,Perundurai,Erode,Collectorate'),(4740,'Erode,Voc,Park,Karungalpalayam'),(4741,'Dadhadripuram,Dadhadripuram'),(4742,'Erode,East,Erode,East'),(4743,'Rangampalayam,Chennimalai,Edayankattuvalsu'),(4744,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(4745,'Erode,Erode,East'),(4746,'Erode,Erode,Collectorate'),(4747,'Erode,Erode,Fort,Erode,East'),(4748,'Erode,Erode,Fort,Erode,East'),(4749,'Erode,Erode,Fort,Erode,East'),(4750,'Erode,Erode,Fort,Marapalam,Erode,East'),(4751,'Agraharam,Erode,Marapalam,Erode,East'),(4752,'Erode,Karungalpalayam'),(4753,'Erode,Erode,East'),(4754,'Perundurai,Kali,Ingur'),(4755,'Erode,Erode,Fort,Erode,East'),(4756,'Erode,Marapalam,Erode,East'),(4757,'Erode,Rajan,Nagar,Sathyamangalam,Bannari,Doddampalayam'),(4758,'Alathur,Bhavani,Athur,Chettipalayam,Kalichettipalayam.,Mettupalayam'),(4759,'Erode,Karungalpalayam'),(4760,'Erode,Karungalpalayam'),(4761,'Erode,Karungalpalayam'),(4762,'Erode,Chennimalai,Erode,East'),(4763,'Erode,Erode,East'),(4764,'Erode,Palayapalayam,Thindal'),(4765,'Erode,Perundurai,Thindal'),(4766,'Erode,Narayana,Valasu,Nasiyanur,Anur,Erode,Collectorate'),(4767,'Erode,Erode,Fort,Erode,East'),(4768,'Andipalayam,Koottapalli'),(4769,'Komarapalayam,Alampalayam,Seerampalayam'),(4770,'Idappadi,Devagoundanur'),(4771,'Erode,Marapalam,Erode,East'),(4772,'Erode,Karungalpalayam'),(4773,'Erode,Erode,Fort,Erode,East'),(4774,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(4775,'Chinnadharapuram,Chinnadharapuram'),(4776,'Erode,Marapalam,Surampatti,Erode,East'),(4777,'Chithode,Gangapuram,Chittode'),(4778,'Erode,Erode,Fort,Erode,East'),(4779,'Erode,Rangampalayam,Chennimalai,Edayankattuvalsu'),(4780,'Erode,Perundurai,Thindal,Thindal'),(4781,'Erode,Nasiyanur,Anur,Thindal'),(4782,'Erode,Erode,Fort,Erode,East'),(4783,'Bhavani,Kavindapadi,Bhavani,Kudal'),(4784,'Avalpoondurai,Erode,Erode,Railway,Colony'),(4785,'Perundurai,Ingur'),(4786,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(4787,'Marakkadai,Marakkadai'),(4788,'Erode,Surampatti,Erode,East'),(4789,'Kurichi,Anampatti,Avanam,Coimbatore,Keeranatham'),(4790,'Kollampalayam,Erode,Railway,Colony'),(4791,'Ennai,Kamarajapuram,Gowriwakkam'),(4792,'Erode,Koottapalli'),(4793,'Erode,Voc,Park,Karungalpalayam'),(4794,'Erode,Chikkaiah,Naicker,College'),(4795,'Erode,Perundurai,Amoor,Erode,Collectorate'),(4796,'Marapalam,Surampatti,Erode,East'),(4797,'Erode,Arur,Karur,Erode,Railway,Colony'),(4798,'Erode,Periyar,Nagar,Erode,East'),(4799,'Erode,Surampatti,Erode,East'),(4800,'Palayapalayam,Perundurai,Erode,Collectorate'),(4801,'Ennai,Nandanam'),(4802,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(4803,'Erode,Karungalpalayam'),(4804,'Bhavani,Bhavani,Kudal'),(4805,'Erode,Erode,East'),(4806,'Erode,Erode,East'),(4807,'Erode,Chikkaiah,Naicker,College'),(4808,'Erode,Karungalpalayam'),(4809,'Erode,Teachers,Colony,Veerappanchatram,Erode,Collectorate'),(4810,'Erode,Dharapuram,Erode,Railway,Colony'),(4811,'Erode,Erode,East'),(4812,'Bodupatti,Bodupatti'),(4813,'Erode,Chikkaiah,Naicker,College'),(4814,'Chithode,Chittode'),(4815,'Erode,Edayankattuvalsu'),(4816,'Erode,Dharapuram,Kalpalayam,Erode,Railway,Colony'),(4817,'Erode,Chikkaiah,Naicker,College'),(4818,'Attur,Kattur,Palakarai'),(4819,'Erode,Karungalpalayam'),(4820,'Erode,Nasiyanur,Sampath,Nagar,Anur,Chinthamani,Erode,Collectorate'),(4821,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(4822,'Erode,Edayankattuvalsu'),(4823,'Erode,Erode,Fort,Erode,East'),(4824,'Erode,Karungalpalayam,Thirunagar,Colony,Arungal,Karungalpalayam'),(4825,'Erode,Erode,East'),(4826,'Erode,Erode,Fort,Erode,East'),(4827,'Kollampalayam,Arur,Karur,Erode,Railway,Colony'),(4828,'Erode,Perundurai,638060'),(4829,'Perundurai,Athur,Ingur'),(4830,'Erode,Surampatti,Erode,Railway,Colony'),(4831,'Erode,Surampatti,Karungalpalayam'),(4832,'Erode,Erode,Collectorate'),(4833,'Erode,Erode,Fort,Erode,Collectorate'),(4834,'Erode,Chikkaiah,Naicker,College'),(4835,'Erode,Chettipalayam,Erode,Railway,Colony'),(4836,'Erode,Moolapalayam,Nadarmedu,Erode,Railway,Colony'),(4837,'Erode,Erode,Collectorate'),(4838,'Erode,Edayankattuvalsu'),(4839,'Erode,Moolapalayam,Erode,Railway,Colony'),(4840,'Erode,Chikkaiah,Naicker,College'),(4841,'Erode,Nadarmedu,Erode,Railway,Colony'),(4842,'Erode,Lakkapuram,Erode,Railway,Colony'),(4843,'Erode,Erode,Fort,Erode,East'),(4844,'Erode,Edayankattuvalsu'),(4845,'Erode,Erode,East'),(4846,'Erode,Erode,East'),(4847,'Erode,Erode,East'),(4848,'Erode,Edayankattuvalsu'),(4849,'Erode,Karungalpalayam'),(4850,'Erode,Chikkaiah,Naicker,College'),(4851,'Erode,Erode,Fort,Erode,East'),(4852,'Erode,Erode,East'),(4853,'Erode,Amoor,Karungalpalayam'),(4854,'Erode,Moolapalayam,Erode,Railway,Colony'),(4855,'Erode,Chennimalai,Erode,East'),(4856,'Seerampalayam,Seerampalayam'),(4857,'Kuppandampalayam,Iruppu,Karaipudur'),(4858,'Erode,Teachers,Colony,Erode,Collectorate'),(4859,'Komarapalayam,Kallankattuvalasu'),(4860,'Erode,Perundurai,Arni,Erode,Collectorate'),(4861,'Erode,Erode,Fort,Erode,East'),(4862,'Erode,Chikkaiah,Naicker,College'),(4863,'Erode,Chettipalayam,Erode,Railway,Colony'),(4864,'Perundurai,Seenapuram,Palakarai'),(4865,'Erode,Erode,Fort,Erode,East'),(4866,'Erode,Kurichi,Pudur,Akkur,Elumathur'),(4867,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(4868,'Erode,Perundurai,Illupur,Kadirampatti'),(4869,'Erode,Erode,Fort,Erode,East'),(4870,'Gangapuram,Kolathupalayam,Chikkaiah,Naicker,College'),(4871,'Pallipalayam,Pallipalayam'),(4872,'Erode,Railway,Colony,Erode,Railway,Colony'),(4873,'Erode,Soolai,Chikkaiah,Naicker,College'),(4874,'Erode,Surampatti,Ayal,Erode,East'),(4875,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(4876,'Chithode,Chittode'),(4877,'Erode,Moolapalayam,Erode,Railway,Colony'),(4878,'Erode,Periyar,Nagar,Erode,East'),(4879,'Erode,Kangayam,Avanashipalayampudur'),(4880,'Erode,Moolapalayam,Arur,Karur,Erode,Railway,Colony'),(4881,'Erode,Erode,Fort,Karungalpalayam'),(4882,'Iruppu,Kallampalayam,Road'),(4883,'Erode,Chikkaiah,Naicker,College'),(4884,'Erode,Karungalpalayam'),(4885,'Anthiyur,Bhavani,Avadi,Bhavani,Kudal'),(4886,'Erode,Solar,Erode,Railway,Colony'),(4887,'Erode,Erode,Collectorate'),(4888,'Erode,Moolapalayam,Erode,Railway,Colony'),(4889,'Erode,Erode,Railway,Colony'),(4890,'Erode,Kollampalayam,Erode,Railway,Colony'),(4891,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(4892,'Erode,Karungalpalayam'),(4893,'Erode,Erode,Fort,Erode,East'),(4894,'Erode,Perundurai,Erode,Collectorate'),(4895,'Erode,Erode,Fort,Erode,East'),(4896,'Erode,Edayankattuvalsu'),(4897,'Erode,Erode,Fort,Erode,East'),(4898,'Erode,Chidambaram,Erode,East'),(4899,'Erode,Thindal,Thindal'),(4900,'Erode,Teachers,Colony,Erode,Collectorate'),(4901,'Erode,Erode,Fort,Erode,East'),(4902,'Erode,Edayankattuvalsu'),(4903,'Erode,Perundurai,Erode,Collectorate'),(4904,'Erode,Chidambaram,Erode,East'),(4905,'Erode,Chennimalai,Erode,Railway,Colony'),(4906,'Erode,Chikkaiah,Naicker,College'),(4907,'Erode,Sampath,Nagar,Chikkaiah,Naicker,College'),(4908,'Agraharam,Erode,Peria,Agraharam'),(4909,'Erode,Erode,East'),(4910,'Erode,Edayankattuvalsu'),(4911,'Erode,Kathirampatti,Perundurai,Thindal'),(4912,'Erode,Marapalam,Erode,East'),(4913,'Erode,Erode,Fort,Erode,East'),(4914,'Bhavani,Erode,Bhavani,Kudal'),(4915,'Erode,Thindal'),(4916,'Erode,Chikkaiah,Naicker,College'),(4917,'Erode,Perundurai,Amoor,Erode,Collectorate'),(4918,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(4919,'Andipalayam,Erode,Arur,Karur,Erode,Railway,Colony'),(4920,'Erode,Moolapalayam,Erode,Railway,Colony'),(4921,'Erode,Periyar,Nagar,Erode,East'),(4922,'Erode,Ganapathy,Erode,Collectorate'),(4923,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(4924,'Erode,Erode,Fort,Erode,East'),(4925,'Erode,Periyar,Nagar,Erode,East'),(4926,'Erode,Karungalpalayam'),(4927,'Erode,Erode,East'),(4928,'Erode,Moolapalayam,Pudur,Erode,Railway,Colony'),(4929,'Erode,Erode,East'),(4930,'Erode,Chikkaiah,Naicker,College'),(4931,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(4932,'Erode,Muncipal,Colony,Veerappanchatram,Chikkaiah,Naicker,College'),(4933,'Annur,Ariyampalayam,Coimbatore,Eral,Allapalayam'),(4934,'Erode,Erode,East'),(4935,'46,Pudur,Erode,Pudur,Erode,Railway,Colony'),(4936,'Erode,Erode,Fort,Erode,East'),(4937,'Erode,Thindal,Thindal'),(4938,'Erode,Erode,Collectorate'),(4939,'Erode,Chikkaiah,Naicker,College'),(4940,'Veerappanchatram,Chikkaiah,Naicker,College'),(4941,'Erode,Perundurai,Kambiliyampatti'),(4942,'Komarapalayam,Kallankattuvalasu'),(4943,'Andipalayam,Erode,Ganapathipalayam,Nanjaikalamangalam,Athipalayam,Ganapathipalayam'),(4944,'Erode,Kollampalayam,Erode,Railway,Colony'),(4945,'Erode,Karungalpalayam'),(4946,'Erode,Erode,Fort,Erode,East'),(4947,'Erode,Teachers,Colony,Edayankattuvalsu'),(4948,'Erode,Nasiyanur,Anur,Thindal'),(4949,'Erode,Karungalpalayam'),(4950,'Erode,Thindal'),(4951,'Avalpundurai,Avalpundurai'),(4952,'Iruppu,Kathankanni,Anaipalayam'),(4953,'Erode,Railway,Colony,Erode,Railway,Colony'),(4954,'Erode,Erode,Collectorate'),(4955,'Erode,Chittode,Chittode'),(4956,'Erode,Erode,Fort,Erode,East'),(4957,'Erode,Erode,Collectorate'),(4958,'Agraharam,Erode,Peria,Agraharam'),(4959,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(4960,'Komarapalayam,Kallankattuvalasu'),(4961,'Nanjanapuram,Kadirampatti'),(4962,'Erode,Edayankattuvalsu'),(4963,'Erode,Erode,Fort,Erode,East'),(4964,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(4965,'Erode,Thindal,Thindal'),(4966,'Perundurai,Kanagapuram'),(4967,'Erode,Palayapalayam,Perundurai,Teachers,Colony,Erode,Collectorate'),(4968,'Erode,Thirunagar,Colony,Karungalpalayam'),(4969,'Erode,Moolapalayam,Erode,Railway,Colony'),(4970,'Erode,Erode,Fort,Karungalpalayam'),(4971,'Erumaipatti,Erumaipatti'),(4972,'Erode,Erode,Fort,Erode,East'),(4973,'Erode,Erode,Fort,Erode,East'),(4974,'Elachipalayam,Elachipalayam'),(4975,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(4976,'Komarapalayam,Seerampalayam'),(4977,'Erode,Karungalpalayam'),(4978,'Erode,Chettipalayam,Erode,Railway,Colony'),(4979,'Erode,Erode,Collectorate'),(4980,'Erode,Karungalpalayam,Andiyur,Arungal,Karungalpalayam'),(4981,'Erode,Erode,Fort,Solar,Karungalpalayam'),(4982,'Erode,Spb,Colony,Alampalayam,Seerampalayam'),(4983,'Erode,Thindal,Thindal'),(4984,'Erode,Muncipal,Colony,Veerappanchatram,Chikkaiah,Naicker,College'),(4985,'Erode,Chettipalayam,Erode,Railway,Colony'),(4986,'Bhavani,Perundurai,Ingur'),(4987,'Erode,Perundurai,Thindal'),(4988,'Erode,Arur,Karur,Thamaraipalayam'),(4989,'Bhavani,Vasavi,College'),(4990,'Erode,Muncipal,Colony,Karungalpalayam'),(4991,'Erode,Erode,Fort,Erode,East'),(4992,'Erode,Erode,East'),(4993,'Erode,Thingalur,Nichampalayam'),(4994,'Erode,Nanjaiuthukuli,Chinniyampalayam,Elumathur'),(4995,'Erode,Karungalpalayam'),(4996,'Erode,Erode,East'),(4997,'Bhavani,Kali,Bhavani,Kudal'),(4998,'Erode,Arasampalayam,Seerampalayam'),(4999,'Erode,Erode,Fort,Erode,East'),(5000,'Erode,Rangampalayam,Chennimalai,Edayankattuvalsu'),(5001,'Erode,Chidambaram,Erode,East'),(5002,'Erode,Kasipalayam,Edayankattuvalsu'),(5003,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(5004,'Erode,Surampatti,Edayankattuvalsu'),(5005,'Erode,Karungalpalayam,Amoor,Arungal,Karungalpalayam'),(5006,'Erode,Pudur,Peria,Agraharam'),(5007,'Erode,Erode,East'),(5008,'Bhavani,Erode,Kadappanallur,Manickampalayam,Nallur,Allur,Appanallur,Ammapettai'),(5009,'Erode,Marapalam,Erode,East'),(5010,'Erode,Chikkaiah,Naicker,College'),(5011,'Erode,Edayankattuvalsu'),(5012,'Erode,Arasampatti,Thindal'),(5013,'Erode,Perundurai,Thindal,Thindal'),(5014,'Erode,Palayapalayam,Erode,Collectorate'),(5015,'Erode,Karungalpalayam'),(5016,'Bhavani,Erode,Chikkaiah,Naicker,College'),(5017,'Erode,Periya,Valasu,Chikkaiah,Naicker,College'),(5018,'Erode,Pudur,Karukkampalayam,Erode,Railway,Colony'),(5019,'Erode,Erode,East'),(5020,'Erode,Karungalpalayam'),(5021,'Erode,Chikkaiah,Naicker,College'),(5022,'Erode,Erode,Fort,Erode,East'),(5023,'Erode,Surampatti,Edayankattuvalsu'),(5024,'Erode,Erode,Fort,Erode,East'),(5025,'Erode,Moolapalayam,Erode,Railway,Colony'),(5026,'Ganapathipalayam,Athipalayam,Seerampalayam'),(5027,'Erode,Thirunagar,Colony,Karungalpalayam'),(5028,'Erode,Perundurai,Erode,Collectorate'),(5029,'Erode,Manickampalayam,Soolai,Chikkaiah,Naicker,College'),(5030,'Erode,Nanjaiuthukuli,Elumathur'),(5031,'Erode,Kollampalayam,Erode,Railway,Colony'),(5032,'Erode,Karungalpalayam'),(5033,'Ottapparai,Chennimalai,Iruppu,Basuvapatti'),(5034,'Erode,Marapalam,Erode,East'),(5035,'Erode,Karungalpalayam'),(5036,'Erode,Nasiyanur,Anur,Thindal'),(5037,'Chikkaiah,Naicker,College,Chikkaiah,Naicker,College'),(5038,'Erode,Moolapalayam,Erode,Railway,Colony'),(5039,'Erode,Nanjaiuthukuli,Erode,Railway,Colony'),(5040,'Erode,Chikkaiah,Naicker,College'),(5041,'Erode,Erode,East'),(5042,'Karungalpalayam,Thirunagar,Colony,Arungal,Karungalpalayam'),(5043,'Erode,Thindal,Kanagapuram'),(5044,'Arkadu,Seerampalayam'),(5045,'Erode,Erode,Collectorate'),(5046,'Erode,Chikkaiah,Naicker,College'),(5047,'Erode,Ingur,Perundurai,Amur,Chennimalai,Basuvapatti'),(5048,'Erode,Kadirampatti'),(5049,'Perundurai,Seenapuram,Athur,Palakarai'),(5050,'Bhavani,Erode,Bhavani,Kudal'),(5051,'Erode,Perundurai,Erode,Collectorate'),(5052,'Erode,Chettipalayam,Erode,Railway,Colony'),(5053,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(5054,'Erode,Periyar,Nagar,Erode,East'),(5055,'Karattupalayam,Devanankurichi'),(5056,'Erode,Edayankattuvalsu'),(5057,'Erode,Erode,Railway,Colony'),(5058,'Erode,Perundurai,Thindal,Thindal'),(5059,'Erode,Chettipalayam,Erode,Railway,Colony'),(5060,'Erode,Chikkaiah,Naicker,College'),(5061,'Seerampalayam,Seerampalayam'),(5062,'Ennai,Christian,College,Tambaram'),(5063,'Erode,Chidambaram,Erode,East'),(5064,'Ottapparai,Chennimalai,Basuvapatti'),(5065,'Erode,Vijayapuri,Kambiliyampatti'),(5066,'Erode,Erode,East'),(5067,'Erode,Koottapalli'),(5068,'Erode,Arur,Karur,Erode,Railway,Colony'),(5069,'Erode,Surampatti,Erode,East'),(5070,'Agraharam,Erode,Erode,East'),(5071,'Erode,Erode,Fort,Erode,East'),(5072,'Erode,Moolapalayam,Erode,Railway,Colony'),(5073,'Chithode,Chittode'),(5074,'Erode,Kodumudi,Arur,Karur,Avudayarparai'),(5075,'Bhavani,Erode,Erode,Collectorate'),(5076,'Erode,Ellapalayam,Chikkaiah,Naicker,College'),(5077,'Palayapalayam,Edayankattuvalsu'),(5078,'Erode,Rangampalayam,Edayankattuvalsu'),(5079,'Erode,Erode,Railway,Colony'),(5080,'Erode,Erode,Collectorate'),(5081,'Bhavani,Bhavani,Kudal'),(5082,'Erode,Karungalpalayam'),(5083,'Erode,Erode,Collectorate'),(5084,'Erode,Perundurai,Thindal,Thindal'),(5085,'Arachalur,Nallur,Sivagiri,Allur,Araipalayam,Ammankoil'),(5086,'Erode,Erode,East'),(5087,'Perundalaiyur,Kavindapadi,Appakudal'),(5088,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(5089,'Erode,Erode,East'),(5090,'Kambiliyampatti,Kambiliyampatti'),(5091,'Erode,Nasiyanur,Anur,Thindal'),(5092,'Erode,Kanagapuram,Lakkapuram,Erode,Railway,Colony'),(5093,'Erode,Perundurai,Thindal'),(5094,'Erode,Chikkaiah,Naicker,College'),(5095,'Erode,Chikkaiah,Naicker,College'),(5096,'Coimbatore,Ganapathy,Ganapathy'),(5097,'Erode,Erode,East'),(5098,'Erode,Periyar,Nagar,Erode,East'),(5099,'Avalpoondurai,Moolapalayam,Nadarmedu,Erode,Railway,Colony'),(5100,'Palani,Palani'),(5101,'Erode,Erode,Collectorate'),(5102,'Erode,Perundurai,Erode,Collectorate'),(5103,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(5104,'Arasampatti,Thindal'),(5105,'Erode,Erode,Collectorate'),(5106,'Erode,Erode,Fort,Erode,East'),(5107,'Komarapalayam,Tiruchengodu,North'),(5108,'Erode,Pudur,Peria,Agraharam'),(5109,'Erode,Rangampalayam,Edayankattuvalsu'),(5110,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(5111,'Erode,Thindal'),(5112,'Erode,Kali,Bhavani,Kudal'),(5113,'Erode,Kadirampatti'),(5114,'Erode,Erode,Collectorate'),(5115,'Erode,Chikkaiah,Naicker,College'),(5116,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(5117,'Erode,Lakkapuram,Pudur,Solar,Kamaraj,Nagar,Erode,Railway,Colony'),(5118,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(5119,'Erode,Chennimalai,Erode,East'),(5120,'Agraharam,Erode,Erode,East'),(5121,'Erode,Erode,East'),(5122,'Pallipalayam,Pallipalayam'),(5123,'Erode,Thirunagar,Colony,Karungalpalayam'),(5124,'Erode,Lakkapuram,Erode,Railway,Colony'),(5125,'Erode,Chidambaram,Erode,East'),(5126,'Chithode,Chittode'),(5127,'Erode,Erode,East'),(5128,'Erode,Erode,East'),(5129,'Erode,Kali,Karungalpalayam'),(5130,'Erode,Erode,Fort,Erode,East'),(5131,'Erode,Erode,Fort,Erode,Collectorate'),(5132,'Arachalur,Erode,Dharapuram,Arachalur'),(5133,'Erode,Injampalli,Elumathur'),(5134,'Erode,Thindal'),(5135,'Erode,Moolapalayam,Erode,Railway,Colony'),(5136,'Marapalam,Erode,East'),(5137,'Perundurai,Thiruvachi,Ingur'),(5138,'Erode,Perundurai,Thindal,Thindal'),(5139,'Erode,Chikkaiah,Naicker,College'),(5140,'Erode,Erode,East'),(5141,'Erode,Erode,East'),(5142,'Erode,Erode,Fort,Erode,East'),(5143,'Erode,Erode,East'),(5144,'Erode,Vairapalayam,Karungalpalayam'),(5145,'Erode,Erode,East'),(5146,'Erode,Kollampalayam,Erode,Railway,Colony'),(5147,'Erode,Erode,East'),(5148,'Erode,Erode,Collectorate'),(5149,'Erode,Erode,Fort,Erode,East'),(5150,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(5151,'Erode,Kurichi,Modakurichi,Elumathur'),(5152,'Erode,Kollampalayam,Arur,Karur,Erode,Railway,Colony'),(5153,'Erode,Chettipalayam,Erode,Railway,Colony'),(5154,'Erode,Avalpundurai'),(5155,'Erode,Erode,Railway,Colony'),(5156,'Chithode,Erode,Gangapuram,Nasiyanur,Anur,Chittode'),(5157,'Erode,Chikkaiah,Naicker,College'),(5158,'Ariyappampalayam,Erode,Sathyamangalam,Kavilipalayam'),(5159,'Erode,Moolapalayam,Erode,Railway,Colony'),(5160,'Devarajapattinam,Devarajapattinam'),(5161,'Appakudal,Erode,Appakudal'),(5162,'Erode,Erode,East'),(5163,'Erode,Erode,Fort,Erode,East'),(5164,'Erode,Periyar,Nagar,Dharapuram,Erode,East'),(5165,'Erode,Karungalpalayam'),(5166,'Devanankurichi,Devanankurichi'),(5167,'Erode,Anur,Erode,Collectorate'),(5168,'Coimbatore,Cbe,Mpl.Central,Busstand'),(5169,'Coimbatore,Edayar,Edayarpalayam,Edayarpalayam'),(5170,'Erode,Karungalpalayam'),(5171,'Erode,Erode,East'),(5172,'Erode,Chidambaram,Dharapuram,Edayankattuvalsu'),(5173,'Emur,Chikkaiah,Naicker,College'),(5174,'Erode,Erode,Fort,Erode,East'),(5175,'Iruppu,Kallampalayam,Road'),(5176,'Ambur,Athur,Chennai,Kolathur'),(5177,'Erode,Kasipalayam,Chennimalai,Edayankattuvalsu'),(5178,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(5179,'Erode,Moolapalayam,Chinniyampalayam,Erode,Railway,Colony'),(5180,'Kadirampatti,Kadirampatti'),(5181,'Erode,Kanji,Kanjikovil,Kavindapadi,Kanjikovil'),(5182,'Erode,Nasiyanur,Anur,Thindal'),(5183,'Erode,Erode,Collectorate'),(5184,'Erode,Muncipal,Colony,Karungalpalayam'),(5185,'Bhavani,Kali,Vasavi,College'),(5186,'Kanagapuram,Kanagapuram'),(5187,'Erode,Erode,East'),(5188,'Erode,Perundurai,Erode,Collectorate'),(5189,'Erode,Thirunagar,Colony,Karungalpalayam'),(5190,'Erode,Moolapalayam,Erode,Railway,Colony'),(5191,'Erode,Kadirampatti'),(5192,'Veerappanchatram,Chikkaiah,Naicker,College'),(5193,'Chithode,Erode,Chittode'),(5194,'Arur,Karur,Erode,Railway,Colony'),(5195,'Erode,Chikkaiah,Naicker,College'),(5196,'Erode,Chikkaiah,Naicker,College'),(5197,'Erode,Perundurai,Thindal,Thindal'),(5198,'Erode,Teachers,Colony,Erode,Collectorate'),(5199,'Bhavani,Erode,Chikkaiah,Naicker,College'),(5200,'Erode,Chikkaiah,Naicker,College'),(5201,'Erode,Erode,East'),(5202,'Devanankurichi,Devanankurichi'),(5203,'Erode,Edayankattuvalsu'),(5204,'Erode,Erode,East'),(5205,'Erode,Erode,East'),(5206,'Erode,Erode,Railway,Colony'),(5207,'Erode,Soolai,Chikkaiah,Naicker,College'),(5208,'Erode,Gandhipuram,Karungalpalayam'),(5209,'Kanchipuram,Erode,Railway,Colony'),(5210,'Gobichettipalayam,Chettipalayam,Kugalur'),(5211,'Erode,Edayankattuvalsu'),(5212,'Erode,Perundurai,Thindal,Thindal'),(5213,'Erode,Perundurai,Erode,Collectorate'),(5214,'Erode,Erode,East'),(5215,'Erode,Erode,Railway,Colony'),(5216,'Erode,Erode,Fort,Erode,East'),(5217,'Erode,Karungalpalayam'),(5218,'Edayankattuvalsu,Edayankattuvalsu'),(5219,'Erode,Moolapalayam,Nadarmedu,Erode,Railway,Colony'),(5220,'Erode,Perundurai,Erode,Collectorate'),(5221,'Erode,Erode,East'),(5222,'Erode,Edayankattuvalsu'),(5223,'Erode,Edayankattuvalsu'),(5224,'Erode,Pudur,Peria,Agraharam'),(5225,'Erode,Perundurai,Athur,Ingur'),(5226,'Erode,Perundurai,Erode,Collectorate'),(5227,'Erode,Erode,East'),(5228,'Erode,Railway,Colony,Erode,Railway,Colony'),(5229,'Erode,Erode,Fort,Kavilipalayam'),(5230,'Erode,Karungalpalayam'),(5231,'Erode,Surampatti,Edayankattuvalsu'),(5232,'Erode,Erode,Collectorate'),(5233,'Erode,Surampatti,Erode,East'),(5234,'Erode,Pudur,Peria,Agraharam'),(5235,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(5236,'Erode,Perundurai,Erode,Collectorate'),(5237,'Erode,Perundurai,Erode,Collectorate'),(5238,'Erode,Surampatti,Erode,East'),(5239,'Erode,Edayankattuvalsu'),(5240,'Nasiyanur,Anur,Kadirampatti'),(5241,'Erode,Narayana,Valasu,Nasiyanur,Anur,Thindal'),(5242,'Erode,Erode,Railway,Colony'),(5243,'Erode,Erode,East'),(5244,'Agraharam,Erode,Peria,Agraharam'),(5245,'Erode,Nanjanapuram,Kadirampatti'),(5246,'Erode,Erode,Fort,Erode,East'),(5247,'Erode,Muncipal,Colony,Karungalpalayam'),(5248,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(5249,'Erode,Erode,Railway,Colony'),(5250,'Erode,Erode,Collectorate'),(5251,'Erode,Chidambaram,Erode,East'),(5252,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(5253,'Erode,Chikkaiah,Naicker,College'),(5254,'Karungalpalayam,Karungalpalayam'),(5255,'Erode,Karungalpalayam'),(5256,'Karungalpalayam,Arungal,Karungalpalayam'),(5257,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(5258,'Erode,Erode,Collectorate'),(5259,'Erode,Erode,East'),(5260,'Deenampalayam,Deenampalayam'),(5261,'Erode,Palayapalayam,Erode,Collectorate'),(5262,'Erode,Chidambaram,Erode,East'),(5263,'Erode,Kasipalayam,Edayankattuvalsu'),(5264,'Erode,Voc,Park,Karungalpalayam'),(5265,'Erode,Erode,East'),(5266,'Agraharam,Bhavani,Peria,Agraharam'),(5267,'Erode,Chennimalai,Edayankattuvalsu'),(5268,'Erode,Erode,East'),(5269,'Erode,Perundurai,Erode,Collectorate'),(5270,'Erode,Palayapalayam,Perundurai,Thindal'),(5271,'Erode,Erode,Railway,Colony'),(5272,'Erode,Lakkapuram,Elumathur'),(5273,'Erode,Veerappanchatram,Karungalpalayam'),(5274,'Erode,Solar,Erode,Railway,Colony'),(5275,'Erode,Edayankattuvalsu'),(5276,'Erode,Periyar,Nagar,Erode,East'),(5277,'Erode,Nanjanapuram,Perundurai,Thindal,Thindal'),(5278,'Erode,Karamadai,Kadirampatti'),(5279,'Erode,Karungalpalayam'),(5280,'Coimbatore,Tudiyalur'),(5281,'Erode,Gobichettipalayam,Chettipalayam,Kadukkampalayam'),(5282,'Erode,Karungalpalayam'),(5283,'Erode,Thindal,Thindal'),(5284,'Erode,Periyar,Nagar,Erode,East'),(5285,'Erode,Erode,Fort,Erode,Collectorate'),(5286,'Erode,Erode,Fort,Erode,East'),(5287,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(5288,'Erode,Perundurai,Erode,Collectorate'),(5289,'Erode,Chikkaiah,Naicker,College'),(5290,'Erode,Erode,East'),(5291,'Erode,Nasiyanur,Anur,Thindal'),(5292,'Erode,Chikkaiah,Naicker,College'),(5293,'Perundurai,Ingur'),(5294,'Erode,Perundurai,Thindal'),(5295,'Erode,Erode,Fort,Erode,Collectorate'),(5296,'Erode,Periya,Valasu,Chikkaiah,Naicker,College'),(5297,'Erode,Perundurai,Edayankattuvalsu'),(5298,'Erode,Karungalpalayam'),(5299,'Erode,Kaikatti,Kadirampatti'),(5300,'Agraharam,Komarapalayam,Seerampalayam'),(5301,'Erode,Perundurai,Thindal,Thindal'),(5302,'Erode,Chidambaram,Erode,East'),(5303,'Anur,Jawahar,Mills'),(5304,'Erode,Chidambaram,Erode,East'),(5305,'Erode,Palayapalayam,Erode,Collectorate'),(5306,'Erode,Erode,Collectorate'),(5307,'Erode,Chidambaram,Erode,East'),(5308,'Erode,Erode,Collectorate'),(5309,'Erode,Kalpalayam,Erode,Railway,Colony'),(5310,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(5311,'Allur,E.Pethampatti'),(5312,'Erode,Chikkaiah,Naicker,College'),(5313,'Erode,Erode,Fort,Erode,East'),(5314,'Erode,Thindal,Thindal'),(5315,'Erode,Erode,Fort,Erode,East'),(5316,'Erode,Erode,Collectorate'),(5317,'Erode,Karungalpalayam'),(5318,'Erode,Perundurai,Thindal'),(5319,'Erode,Chidambaram,Erode,East'),(5320,'Erode,Perundurai,Thindal'),(5321,'Erode,Perundurai,Thindal,Thindal'),(5322,'Erode,Thindal'),(5323,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(5324,'Erode,Kollampalayam,Erode,Railway,Colony'),(5325,'Erode,Erode,Fort,Erode,East'),(5326,'Erode,Chikkaiah,Naicker,College'),(5327,'Thindal,Thindal'),(5328,'Gobichettipalayam,Vellalapalayam,Chettipalayam,Kadukkampalayam'),(5329,'Chithode,Erode,Chittode'),(5330,'Erode,Erode,Railway,Colony'),(5331,'Komarapalayam,Kallankattuvalasu'),(5332,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(5333,'Erode,Solar,Erode,Railway,Colony'),(5334,'Erode,Chikkaiah,Naicker,College'),(5335,'Erode,Kasipalayam,Moolapalayam,Dharapuram,Erode,Railway,Colony'),(5336,'Erode,Erode,Collectorate'),(5337,'Erode,Chikkaiah,Naicker,College'),(5338,'Erode,Erode,Fort,Erode,East'),(5339,'Bhavani,Elavamalai,Erode,Ellapalayam,Karai,Vasavi,College'),(5340,'Erode,Solar,Erode,Railway,Colony'),(5341,'Erode,Moolapalayam,Erode,Railway,Colony'),(5342,'Seerampalayam,Seerampalayam'),(5343,'Erode,Kadirampatti'),(5344,'Erode,Erode,Collectorate'),(5345,'Erode,Perundurai,Sathyamangalam,Seenapuram,Palakarai'),(5346,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(5347,'Keerambur,Keerambur'),(5348,'Erode,Erode,Railway,Colony'),(5349,'Chithode,Kanji,Chittode'),(5350,'Erode,Ellapalayam,Emur,Chikkaiah,Naicker,College'),(5351,'Erode,Perundurai,Amoor,Erode,Collectorate'),(5352,'Sivagiri,Ammankoil'),(5353,'Chinnamalai,Erode,Erode,Railway,Colony'),(5354,'Erode,Perundurai,Pudur,Ingur'),(5355,'Erode,Erode,East'),(5356,'Erode,Perundurai,Kadirampatti'),(5357,'Erode,Edayankattuvalsu'),(5358,'Erode,Erode,Collectorate'),(5359,'Erode,Erode,Railway,Colony'),(5360,'Erode,Karungalpalayam'),(5361,'Erode,Solar,Arur,Karur,Erode,Railway,Colony'),(5362,'Erode,Lakkapuram,Pudur,Erode,Railway,Colony'),(5363,'Erode,Teachers,Colony,Erode,Collectorate'),(5364,'Erode,Chikkaiah,Naicker,College'),(5365,'Erode,Teachers,Colony,Erode,Collectorate'),(5366,'Erode,Erode,East'),(5367,'Erode,Pudur,Chikkaiah,Naicker,College'),(5368,'Erode,Edayankattuvalsu'),(5369,'Erode,Thirunagar,Colony,Karungalpalayam'),(5370,'Erode,Thindal'),(5371,'Alampalayam,Attur,Kattur,Pappampalayam'),(5372,'Erode,Solar,Eral,Erode,Railway,Colony'),(5373,'Erode,Moolapalayam,Erode,Railway,Colony'),(5374,'Erode,Moolapalayam,Nadarmedu,Dharapuram,Erode,Railway,Colony'),(5375,'Erode,Perundurai,Thindal,Thindal'),(5376,'46,Pudur,Erode,Pudur,Chettipalayam,Erode,Railway,Colony'),(5377,'Erode,Nadarmedu,Erode,Railway,Colony'),(5378,'Erode,Kavindapadi,Bhavani,Kudal'),(5379,'Perundurai,Ingur'),(5380,'Erode,Soolai,Chikkaiah,Naicker,College'),(5381,'Erode,Erode,Fort,Erode,East'),(5382,'Coimbatore,Coimbatore,Tidel,Park'),(5383,'Erode,Muncipal,Colony,Adambar,Karungalpalayam'),(5384,'Erode,Perundurai,Erode,Collectorate'),(5385,'Erode,Erode,Fort,Erode,East'),(5386,'Erode,Erode,East'),(5387,'Erode,Erode,Fort,Erode,East'),(5388,'Erode,Erode,Fort,Erode,East'),(5389,'Erode,Erode,Fort,Erode,East'),(5390,'Erode,Erode,East'),(5391,'Erode,Emur,Chikkaiah,Naicker,College'),(5392,'Erode,Chittode'),(5393,'Erode,Chettipalayam,Erode,Railway,Colony'),(5394,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(5395,'Erode,Karungalpalayam'),(5396,'Erode,Erode,East'),(5397,'Erode,Erode,Fort,Erode,East'),(5398,'Erode,Chennimalai,Edayankattuvalsu'),(5399,'Erode,Vairapalayam,Karungalpalayam'),(5400,'Erode,East,Erode,East'),(5401,'Erode,Perundurai,Erode,Collectorate'),(5402,'Erode,Periya,Valasu,Veerappanchatram,Chikkaiah,Naicker,College'),(5403,'Agraharam,Seerampalayam'),(5404,'Erode,Thindal,Thindal'),(5405,'Perundurai,Kadirampatti'),(5406,'Erode,Moolapalayam,Erode,Railway,Colony'),(5407,'Erode,Surampatti,Erode,East'),(5408,'Erode,Erode,East'),(5409,'Erode,Erode,Fort,Erode,East'),(5410,'Erode,Chikkaiah,Naicker,College'),(5411,'Erode,Erode,Collectorate'),(5412,'Erode,Karungalpalayam'),(5413,'Erode,Nasiyanur,Anur,Kadirampatti'),(5414,'Erode,Moolapalayam,Karai,Karaipatti,Erode,Railway,Colony'),(5415,'Erode,Erode,Railway,Colony'),(5416,'Erode,Railway,Colony,Erode,Railway,Colony'),(5417,'Erode,Erode,Fort,Erode,East'),(5418,'Coimbatore,Ganapathy,Ganapathy'),(5419,'Erode,Marapalam,Erode,East'),(5420,'Erode,Chikkaiah,Naicker,College'),(5421,'Erode,Chikkaiah,Naicker,College'),(5422,'Erode,Thirunagar,Colony,Karungalpalayam'),(5423,'Erode,Karungalpalayam'),(5424,'Erode,Thindal'),(5425,'Agraharam,Erode,Peria,Agraharam'),(5426,'Erode,Perundurai,Erode,Collectorate'),(5427,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(5428,'Erode,Karungalpalayam'),(5429,'Erode,Gobichettipalayam,Chettipalayam,Kali,Kalipalayam,Kadukkampalayam'),(5430,'Bhavani,Erode,Pudur,Peria,Agraharam'),(5431,'Erode,Karungalpalayam'),(5432,'Erode,Thindal,Erode,Collectorate'),(5433,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(5434,'Seerampalayam,Seerampalayam'),(5435,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(5436,'Erode,Thindal,Thindal'),(5437,'Erode,Kanagapuram'),(5438,'Erode,Perundurai,Thindal,Erode,Collectorate'),(5439,'Ennai,Karai,Old,Perungalathur'),(5440,'Erode,Erode,East'),(5441,'Edayankattuvalsu,Edayankattuvalsu'),(5442,'Erode,Erode,Railway,Colony'),(5443,'Erode,Perundurai,Kanagapuram'),(5444,'Erode,Erode,East'),(5445,'Erode,Arasampatti,Kadirampatti'),(5446,'Erode,Thirunagar,Colony,Karungalpalayam'),(5447,'Erode,Karungalpalayam'),(5448,'Erode,Erode,Fort,Erode,East'),(5449,'Bhavani,Erode,Ammapettai'),(5450,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(5451,'Erode,Erode,Fort,Erode,East'),(5452,'Nasiyanur,Anur,Kadirampatti'),(5453,'Erode,Palayapalayam,Erode,Collectorate'),(5454,'Athani,Erode,Erode,East'),(5455,'Palayapalayam,Perundurai,Thindal'),(5456,'Erode,Kathirampatti,Kadirampatti'),(5457,'Ennai,Greams,Road'),(5458,'Perundurai,Ingur'),(5459,'Erode,Perundurai,Erode,Collectorate'),(5460,'Erode,Nasiyanur,Thingalur,Anur,Kadirampatti'),(5461,'Avalpoondurai,Avalpundurai'),(5462,'Karungalpalayam,Karungalpalayam'),(5463,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(5464,'Kurumandur,Kadukkampalayam'),(5465,'Odathurai,Athur,Athurai,Kalichettipalayam.,Mettupalayam'),(5466,'Erode,Edayankattuvalsu'),(5467,'Erode,Erode,East'),(5468,'Erode,Erode,East'),(5469,'Perundurai,Thindal,Thindal'),(5470,'Erode,Chittode'),(5471,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(5472,'Erode,Chikkaiah,Naicker,College'),(5473,'Iruppu,Anaipalayam'),(5474,'Erode,Erode,Fort,Erode,Collectorate'),(5475,'Erode,Surampatti,Edayankattuvalsu'),(5476,'Devagoundanur,Devagoundanur'),(5477,'Erode,Solar,Erode,Railway,Colony'),(5478,'Erode,Thirunagar,Colony,Karungalpalayam'),(5479,'Erode,Thindal,Thindal'),(5480,'Erode,Chikkaiah,Naicker,College'),(5481,'Erode,Pallipalayam'),(5482,'Erode,Erode,Fort,Erode,East'),(5483,'Erode,Erode,Fort,Erode,East'),(5484,'Erode,Moolapalayam,Erode,Railway,Colony'),(5485,'Erode,Arasampatti,Kadirampatti'),(5486,'Erode,Kollampalayam,Arur,Karur,Erode,Railway,Colony'),(5487,'Erode,Perundurai,Seenapuram,Palakarai'),(5488,'Erode,Periyar,Nagar,Erode,East'),(5489,'Erode,Erode,Fort,Karungalpalayam'),(5490,'Erode,Erode,East'),(5491,'Erode,Surampatti,Edayankattuvalsu'),(5492,'Erode,Pudur,Erode,Railway,Colony'),(5493,'Erode,Thindal,Thindal'),(5494,'Erode,Perundurai,Thindal'),(5495,'Erode,Edayankattuvalsu'),(5496,'Erode,Surampatti,Edayankattuvalsu'),(5497,'Erode,Edayankattuvalsu'),(5498,'Bhavani,Chithode,Erode,Vasavi,College'),(5499,'Erode,Moolapalayam,Chettipalayam,Erode,Railway,Colony'),(5500,'Erode,Surampatti,Erode,East'),(5501,'Erode,Chikkaiah,Naicker,College'),(5502,'Erode,Thindal'),(5503,'Erode,Sampath,Nagar,Erode,Collectorate'),(5504,'Erode,Erode,East'),(5505,'Chithode,Erode,Gangapuram,Chittode'),(5506,'Chittalandur,Kolaram'),(5507,'Erode,Thindal'),(5508,'Erode,Chettipalayam,Erode,Railway,Colony'),(5509,'Erode,Erode,East'),(5510,'Bhavani,Erode,Vasavi,College'),(5511,'Erode,Moolapalayam,Erode,Collectorate'),(5512,'Erode,Surampatti,Erode,East'),(5513,'Agraharam,Bhavani,Erode,Peria,Agraharam'),(5514,'Erode,Erode,Fort,Erode,East'),(5515,'Erode,Seerampalayam'),(5516,'Anthiyur,Bhavani,Dalavoipettai'),(5517,'Bhavani,Erode,Karungalpalayam'),(5518,'Kallampalayam,Road,Kallampalayam,Road'),(5519,'Erode,Erode,Collectorate'),(5520,'Erode,Palayapalayam,Edayankattuvalsu'),(5521,'Erode,Thindal,Kanagapuram'),(5522,'Erode,Karungalpalayam'),(5523,'Erode,Erode,East'),(5524,'Teachers,Colony,Coimbatore,Darapuram,Konavaikalpalayam'),(5525,'Erode,Kollampalayam,Erode,Railway,Colony'),(5526,'Kollampalayam,Erode,Railway,Colony'),(5527,'Dharmapuri,Kalichettipalayam.,Mettupalayam'),(5528,'Erode,Erode,East'),(5529,'Kadirampatti,Kadirampatti'),(5530,'Erode,Kollampalayam,Erode,Railway,Colony'),(5531,'Erode,Surampatti,Edayankattuvalsu'),(5532,'Erode,Kugalur'),(5533,'Erode,Thindal,Kanagapuram'),(5534,'Erode,Chikkaiah,Naicker,College'),(5535,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(5536,'Erode,Erode,Fort,Erode,East'),(5537,'Erode,Erode,Railway,Colony'),(5538,'Erode,Thindal,Thindal'),(5539,'Erode,Kollampalayam,Erode,Railway,Colony'),(5540,'Erode,Erode,Collectorate'),(5541,'Erode,Surampatti,Edayankattuvalsu'),(5542,'Ammankoil,Ammankoil'),(5543,'Erode,Erode,Fort,Erode,East'),(5544,'Anampatti,Avanam,Kattampatti-Coimbatore'),(5545,'Erode,Pallipalayam'),(5546,'Erode,Erode,Collectorate'),(5547,'Erode,Perundurai,Ingur'),(5548,'Erode,Soolai,Veerappanchatram,Chikkaiah,Naicker,College'),(5549,'Erode,Karungalpalayam,Amoor,Arungal,Karungalpalayam'),(5550,'Erode,Perundurai,Erode,Collectorate'),(5551,'Perundurai,Teachers,Colony,638060'),(5552,'Erode,Kavandapadi,Kalichettipalayam.,Mettupalayam'),(5553,'Erode,Chettipalayam,Erode,Railway,Colony'),(5554,'Erode,Perundurai,Ingur'),(5555,'Erode,Erode,Fort,Erode,East'),(5556,'Bhavani,Erode,Pudur,Peria,Agraharam'),(5557,'Erode,Pungampadi,Kanagapuram'),(5558,'Erode,Karungalpalayam'),(5559,'Bhavani,Kali,Vasavi,College'),(5560,'Erode,Erode,Collectorate'),(5561,'Erode,Erode,Fort,Erode,East'),(5562,'Erode,Karungalpalayam'),(5563,'Erode,Thindal,Thindal'),(5564,'Erode,Nasiyanur,Anur,Arasampatti,Kadirampatti'),(5565,'Erode,Erode,East'),(5566,'Erode,Erode,East'),(5567,'Erode,Chennimalai,Erode,East'),(5568,'Erode,Lakkapuram,Erode,Railway,Colony'),(5569,'Erode,Moolapalayam,Erode,Railway,Colony'),(5570,'Erode,Perundurai,Edayankattuvalsu'),(5571,'Erode,Moolapalayam,Erode,Railway,Colony'),(5572,'Erode,Moolapalayam,Erode,Railway,Colony'),(5573,'Erode,Chidambaram,Erode,East'),(5574,'Erode,Chennimalai,Erode,East'),(5575,'Erode,Periyar,Nagar,Erode,East'),(5576,'Erode,Chikkaiah,Naicker,College'),(5577,'Erode,Erode,Railway,Colony'),(5578,'Perundurai,Chennimalai,Ingur'),(5579,'Erode,Thindal'),(5580,'Erode,Edayankattuvalsu'),(5581,'Agraharam,Bhavani,Erode,Peria,Agraharam'),(5582,'Erode,Erode,Collectorate'),(5583,'Erode,Chennai,Erode,East'),(5584,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(5585,'Erode,Perundurai,Sampath,Nagar,Erode,Collectorate'),(5586,'Erode,Erode,Collectorate'),(5587,'Erode,Lakkapuram,Muthugoundanpalayam,Erode,Railway,Colony'),(5588,'Erode,Erode,Collectorate'),(5589,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(5590,'Erode,Erode,Collectorate'),(5591,'Erode,Thindal'),(5592,'Erode,Erode,Fort,Erode,East'),(5593,'Pudur,Athappagoundenpudur,Coimbatore,Athappagoundenpudur'),(5594,'Erode,Thindal,Ganapathi,Nagar,Thindal'),(5595,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(5596,'Erode,Perundurai,Kadirampatti'),(5597,'Erode,Erode,Fort,Erode,East'),(5598,'Erode,Perundurai,Erode,Collectorate'),(5599,'Edayankattuvalsu,Edayankattuvalsu'),(5600,'Erode,Perundurai,Erode,Collectorate'),(5601,'Erode,Karungalpalayam'),(5602,'Bhavani,Erode,Chikkaiah,Naicker,College'),(5603,'Erode,Chettipalayam,Erode,Railway,Colony'),(5604,'Bhavani,Suriyampalayam,Vasavi,College'),(5605,'Erode,Perundurai,Erode,Collectorate'),(5606,'Erode,Erode,Fort,Erode,East'),(5607,'Bhavani,Erode,Pudur,Peria,Agraharam'),(5608,'Erode,Siruvalur,Vellankovil,Vellankoil'),(5609,'Erode,Chettipalayam,Erode,Railway,Colony'),(5610,'Erode,Erode,East'),(5611,'Erode,Chikkaiah,Naicker,College'),(5612,'Avalpoondurai,Avalpundurai'),(5613,'Erode,Erode,Collectorate'),(5614,'Erode,Nasiyanur,Anur,Kadirampatti'),(5615,'Erode,Moolapalayam,Erode,Railway,Colony'),(5616,'Erode,Edayankattuvalsu'),(5617,'Erode,Perundurai,Ingur'),(5618,'Erode,Avalpundurai'),(5619,'Veerappanchatram,Karungalpalayam'),(5620,'Erode,Perundurai,Thindal,Thindal'),(5621,'Erode,Surampatti,Edayankattuvalsu'),(5622,'Komarapalayam,Kallankattuvalasu'),(5623,'Erode,Muncipal,Colony,Veerappanchatram,Karungalpalayam'),(5624,'Avalpundurai,Avalpundurai'),(5625,'Erode,Thindal,Thindal'),(5626,'Erode,Lakkapuram,Erode,Railway,Colony'),(5627,'Bhavani,Erode,Erode,Fort,Chikkaiah,Naicker,College'),(5628,'Erode,Voc,Park,Karungalpalayam'),(5629,'Erode,Avalpundurai'),(5630,'Erode,Karungalpalayam,Arungal,Karai,Karungalpalayam'),(5631,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(5632,'Erode,Teachers,Colony,Edayankattuvalsu'),(5633,'Anthiyur,Pachampalayam,Kannadipalayam'),(5634,'Erode,Nallur,Allur,Thindal'),(5635,'Erode,Chikkaiah,Naicker,College'),(5636,'Erode,Chikkaiah,Naicker,College'),(5637,'Erode,Erode,Collectorate'),(5638,'Erode,Kollampalayam,Erode,Railway,Colony'),(5639,'Erode,Erode,Fort,Erode,East'),(5640,'Avalpoondurai,Erode,Kaspapettai,Kurichi,Modakurichi,Avalpundurai'),(5641,'Erode,Gandhipuram,Karungalpalayam'),(5642,'Erode,Erode,Collectorate'),(5643,'Gangapuram,Chittode'),(5644,'Erode,Thindal'),(5645,'Erode,Erode,East'),(5646,'Erode,Erode,Fort,Erode,East'),(5647,'Erode,Erode,East'),(5648,'Erode,Karungalpalayam'),(5649,'Erode,Kanagapuram,Kanagapuram'),(5650,'Avanashipalayampudur,Avanashipalayampudur'),(5651,'Erode,Karungalpalayam,Marapalam,Arungal,Karungalpalayam'),(5652,'Erode,Erode,East'),(5653,'Erode,Railway,Colony,Erode,Railway,Colony'),(5654,'Erode,Marapalam,Erode,East'),(5655,'Erode,Erode,Fort,Karungalpalayam'),(5656,'Erode,Erode,East'),(5657,'Erode,Erode,Collectorate'),(5658,'Erode,Karungalpalayam,Amoor,Arungal,Karungalpalayam'),(5659,'Pudur,Namakkal,Bazaar'),(5660,'Erode,Periyar,Nagar,Erode,East'),(5661,'Erode,Erode,Fort,Erode,East'),(5662,'Erode,Karungalpalayam'),(5663,'Erode,Veerappanchatram,Edayankattuvalsu'),(5664,'Erode,Moolapalayam,Erode,Railway,Colony'),(5665,'Erode,Edayankattuvalsu'),(5666,'Erode,Perundurai,Kadirampatti'),(5667,'Erode,Solar,Erode,Railway,Colony'),(5668,'Gobichettipalayam,Chettipalayam,Gobichettipalayam'),(5669,'Erode,Chettipalayam,Erode,Railway,Colony'),(5670,'Erode,Erode,East'),(5671,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(5672,'Pallipalayam,Pallipalayam'),(5673,'Erode,Vasavi,College'),(5674,'Erode,Chidambaram,Erode,East'),(5675,'Palayapalayam,Thindal'),(5676,'Bhavani,Kurichi,Kannadipalayam'),(5677,'Erode,Erode,East'),(5678,'Erode,Chikkaiah,Naicker,College'),(5679,'Erode,Thindal,Arasampatti,Erode,East'),(5680,'Erode,Emur,Chikkaiah,Naicker,College'),(5681,'Erode,Erode,Collectorate'),(5682,'Ottapparai,Chennimalai,Basuvapatti'),(5683,'Erode,Edayankattuvalsu'),(5684,'Erode,Karungalpalayam'),(5685,'Periyar,Nagar,Erode,East'),(5686,'Erode,Ingur'),(5687,'Erode,East,Erode,East'),(5688,'Erode,Erode,East'),(5689,'Erode,Chikkaiah,Naicker,College'),(5690,'Bhavani,Bhavani,Kudal'),(5691,'Erode,East,Erode,East'),(5692,'Erode,Chikkaiah,Naicker,College'),(5693,'Dasanaickenpatti,Dasanaickenpatti'),(5694,'Erode,Perundurai,Erode,Collectorate'),(5695,'Nanjaigopi,Kugalur'),(5696,'Erode,Erode,East'),(5697,'Erode,Erode,Collectorate'),(5698,'Erode,Chittode'),(5699,'Agraharam,Erode,Peria,Agraharam'),(5700,'Erode,Surampatti,Edayankattuvalsu'),(5701,'Erode,Periyar,Nagar,Chidambaram,Erode,East'),(5702,'Erode,Thirunagar,Colony,Karungalpalayam'),(5703,'Erode,Surampatti,Erode,Railway,Colony'),(5704,'Erode,Chikkaiah,Naicker,College'),(5705,'Erode,Surampatti,Erode,East'),(5706,'Agraharam,Bhavani,Erode,Peria,Agraharam'),(5707,'Erode,Thindal,Thindal'),(5708,'Erode,Emur,Chikkaiah,Naicker,College'),(5709,'Thirunagar,Colony,Karungalpalayam'),(5710,'Erode,Kathirampatti,Nasiyanur,Anur,Kadirampatti'),(5711,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(5712,'Erode,Karungalpalayam'),(5713,'Gobichettipalayam,Chettipalayam,Kavindapadi,Kalichettipalayam.,Mettupalayam'),(5714,'Karungalpalayam,Arungal,Ganapathipuram,Karungalpalayam'),(5715,'Erode,Marapalam,Erode,East'),(5716,'Erode,Sampath,Nagar,Erode,Collectorate'),(5717,'Erode,Moolapalayam,Arur,Karur,Erode,Railway,Colony'),(5718,'Erode,Perundurai,Erode,Collectorate'),(5719,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(5720,'Fairlands,Fairlands'),(5721,'Erode,Athipalayam,Erode,Railway,Colony'),(5722,'Erode,Erode,East'),(5723,'Erode,Thindal'),(5724,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(5725,'Anaiyur,Chennai,Sathyabama,University'),(5726,'Pallipalayam,Pallipalayam'),(5727,'Erode,Erode,East'),(5728,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(5729,'Erode,Erode,Railway,Colony'),(5730,'Palayapalayam,Perundurai,Erode,Collectorate'),(5731,'Erode,Sampath,Nagar,Erode,Collectorate'),(5732,'Komarapalayam,Kallankattuvalasu'),(5733,'Erode,Edayankattuvalsu'),(5734,'Erode,Kavilipalayam'),(5735,'Erode,Thindal,Thindal'),(5736,'Erode,Erode,East'),(5737,'Erode,Chikkaiah,Naicker,College'),(5738,'Erode,Arur,Karur,Erode,Railway,Colony'),(5739,'Erode,Erode,East'),(5740,'Pallipalayam,Pallipalayam'),(5741,'Erode,Karungalpalayam'),(5742,'Erode,Erode,Fort,Erode,East'),(5743,'Erode,Thindal'),(5744,'Erode,Nadarmedu,Erode,Railway,Colony'),(5745,'Erode,Nasiyanur,Anur,Thindal'),(5746,'Erode,Nasiyanur,Anur,Thindal'),(5747,'Erode,Surampatti,Edayankattuvalsu'),(5748,'Erode,Perundurai,Erode,Collectorate'),(5749,'Erode,Erode,Fort,Erode,East'),(5750,'Erode,Erode,Fort,Erode,East'),(5751,'Erode,Erode,East'),(5752,'Erode,Erode,East'),(5753,'Gobichettipalayam,Chettipalayam,Gobichettipalayam'),(5754,'Erode,Nadarmedu,Erode,Railway,Colony'),(5755,'Erode,Erode,East'),(5756,'Erode,Moolapalayam,Arur,Karur,Erode,Railway,Colony'),(5757,'Erode,Sampath,Nagar,Erode,Collectorate'),(5758,'Erode,Teachers,Colony,Edayankattuvalsu'),(5759,'Erode,Moolapalayam,Dharapuram,Erode,Railway,Colony'),(5760,'Erode,Nasiyanur,Thindal,Anur,Thindal'),(5761,'Erode,Erode,East'),(5762,'Bhavani,Chithode,Erode,Chittode'),(5763,'Erode,Thindal,Thindal'),(5764,'Erode,Avalpundurai'),(5765,'Dasanaickenpatti,Dasanaickenpatti'),(5766,'Karuveppampatti,Morur'),(5767,'Erode,Perundurai,Erode,Collectorate'),(5768,'Palayapalayam,Perundurai,Thindal'),(5769,'Erode,Erode,Fort,Erode,Collectorate'),(5770,'Erode,Chikkaiah,Naicker,College'),(5771,'Erode,Periyar,Nagar,Erode,East'),(5772,'Erode,Chikkaiah,Naicker,College'),(5773,'Erode,Chikkaiah,Naicker,College'),(5774,'Erode,Erode,East'),(5775,'Erode,Karungalpalayam'),(5776,'Erode,Erode,Fort,Erode,East'),(5777,'Erode,Edayankattuvalsu'),(5778,'Erode,Soolai,Chikkaiah,Naicker,College'),(5779,'Erode,Elumathur'),(5780,'Erode,Perundurai,Thindal'),(5781,'Erode,Erode,Fort,Erode,East'),(5782,'Erode,Kamaraj,Nagar,Edayankattuvalsu'),(5783,'Nanjaiuthukuli,Elumathur'),(5784,'Erode,Thindal,Thindal'),(5785,'Chettipalayam,Ganapathy,Iruppu,Kallampalayam,Road'),(5786,'Thottipalayam,Seerampalayam'),(5787,'Erode,Erode,East'),(5788,'Erode,Perundurai,Erode,Collectorate'),(5789,'Erode,Erode,East'),(5790,'Erode,Moolapalayam,Erode,Railway,Colony'),(5791,'Erode,Seerampalayam'),(5792,'Erode,Chikkaiah,Naicker,College'),(5793,'Erode,Palayapalayam,Erode,Collectorate'),(5794,'Erode,Chikkaiah,Naicker,College'),(5795,'Kallampalayam,Road,Kallampalayam,Road'),(5796,'Sivagiri,Ammankoil'),(5797,'Erode,Chikkaiah,Naicker,College'),(5798,'Erode,Surampatti,Erode,East'),(5799,'Erode,Sampath,Nagar,Erode,Collectorate'),(5800,'Erode,Palayapalayam,Teachers,Colony,Erode,Collectorate'),(5801,'Erode,Rangampalayam,Edayankattuvalsu'),(5802,'Erode,Erode,Collectorate'),(5803,'Perundurai,Ingur'),(5804,'Seerampalayam,Seerampalayam'),(5805,'Arachalur,Avalpoondurai,Erode,Avalpundurai'),(5806,'Jawahar,Mills,Jawahar,Mills'),(5807,'Erode,Erode,Collectorate'),(5808,'Erode,Perundurai,Ambal,Erode,Collectorate'),(5809,'Erode,Vasavi,College'),(5810,'Sathyamangalam,Bannari,Chikkarasampalayam'),(5811,'Erode,Koottapalli'),(5812,'Erode,Moolapalayam,Arur,Karur,Erode,Railway,Colony'),(5813,'Erode,Teachers,Colony,Erode,Collectorate'),(5814,'Erode,Edayankattuvalsu'),(5815,'Erode,Periyar,Nagar,Chidambaram,Erode,East'),(5816,'Erode,Chikkaiah,Naicker,College'),(5817,'Sarkarperiapalayam,Sarkarperiapalayam'),(5818,'Erode,Chidambaram,Erode,East'),(5819,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(5820,'Erode,Erode,Collectorate'),(5821,'Erode,Chittode'),(5822,'Erode,Thindal'),(5823,'Erode,Komarapalayam,Kallankattuvalasu'),(5824,'Iruppu,Kallampalayam,Road'),(5825,'Erode,Erode,Collectorate'),(5826,'Erode,Palayapalayam,Erode,Collectorate'),(5827,'Erode,Chennimalai,Erode,East'),(5828,'Erode,Veerappanchatram,Karungalpalayam'),(5829,'Coimbatore,Veerapandi-Tadagam'),(5830,'Erode,Vasavi,College'),(5831,'Erode,Thindal,Thindal'),(5832,'Erode,Erode,Fort,Erode,East'),(5833,'Erode,Erode,East'),(5834,'Erode,Erode,Railway,Colony'),(5835,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(5836,'Erode,Erode,Fort,Erode,East'),(5837,'Chithode,Chittode'),(5838,'Erode,Moolapalayam,Erode,Railway,Colony'),(5839,'Erode,Erode,East'),(5840,'Erode,Palayapalayam,Perundurai,Thindal'),(5841,'Dasanaickenpatti,Dasanaickenpatti'),(5842,'Erode,Soolai,Chikkaiah,Naicker,College'),(5843,'Nadarmedu,Erode,Railway,Colony'),(5844,'Erode,Surampatti,Edayankattuvalsu'),(5845,'Erode,Nasiyanur,Sampath,Nagar,Anur,Erode,Collectorate'),(5846,'Karamadai,Belladi'),(5847,'Erode,Thirunagar,Colony,Karungalpalayam'),(5848,'Erode,Akkur,Edayankattuvalsu'),(5849,'Erode,Palayapalayam,Ganapathi,Nagar,Erode,Collectorate'),(5850,'Erode,Surampatti,Edayankattuvalsu'),(5851,'Erode,Thindal,Thindal'),(5852,'Perundurai,Ingur'),(5853,'Erode,Erode,East'),(5854,'Erode,Kali,Kalipalayam,Kadukkampalayam'),(5855,'Erode,Erode,East'),(5856,'Erode,Thindal,Thindal'),(5857,'Erode,Thirunagar,Colony,Karungalpalayam'),(5858,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(5859,'Erode,Edayankattuvalsu'),(5860,'Erode,Erode,Fort,Erode,East'),(5861,'Erode,Erode,Collectorate'),(5862,'Erode,Chikkaiah,Naicker,College'),(5863,'Erode,Odathurai,Athur,Athurai,Kalichettipalayam.,Mettupalayam'),(5864,'Erode,Thirunagar,Colony,Erode,East'),(5865,'Thindal,Arasampatti,Thindal'),(5866,'Erode,Erode,Fort,Erode,East'),(5867,'Erode,Thindal,Thindal'),(5868,'Erode,Moolapalayam,Erode,Railway,Colony'),(5869,'Thindal,Thindal'),(5870,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(5871,'Erode,Perundurai,Erode,Collectorate'),(5872,'Erode,Erode,Fort,Erode,East'),(5873,'Erode,Erode,Collectorate'),(5874,'Erode,Erode,East'),(5875,'Erode,Edayankattuvalsu'),(5876,'Suriyampalayam,Alapatti,Koottapalli'),(5877,'Erode,Nanjaiuthukuli,Elumathur'),(5878,'Erode,Chittode'),(5879,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(5880,'Erode,Periyar,Nagar,Erode,East'),(5881,'Erode,Elumathur'),(5882,'Erode,Seerampalayam'),(5883,'Agraharam,Erode,Peria,Agraharam'),(5884,'Erode,Chennimalai,Kanagapuram'),(5885,'Erode,Periya,Valasu,Erode,Collectorate'),(5886,'Erode,Periyar,Nagar,Erode,East'),(5887,'Erode,Nasiyanur,Perundurai,Anur,Thindal'),(5888,'Erode,Perundurai,Thindal,Thindal'),(5889,'Erode,Erode,East'),(5890,'Erode,Edayankattuvalsu'),(5891,'Arachalur,Arachalur'),(5892,'Chithode,Erode,Chittode'),(5893,'Erode,Erode,Railway,Colony'),(5894,'Anangur,Seerampalayam'),(5895,'Erode,Erode,East'),(5896,'Erode,Surampatti,Edayankattuvalsu'),(5897,'Erode,Erode,Railway,Colony'),(5898,'Erode,Perundurai,Kambiliyampatti'),(5899,'Erode,Soolai,Peria,Agraharam'),(5900,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(5901,'Erode,Erode,Fort,Erode,East'),(5902,'Erode,Edayankattuvalsu'),(5903,'Hasthampatti,Hasthampatti'),(5904,'Erode,Muncipal,Colony,Veerappanchatram,Chikkaiah,Naicker,College'),(5905,'Erode,Palayapalayam,Perundurai,Thindal'),(5906,'Erode,Perundurai,Kadirampatti'),(5907,'Erode,Ayal,Erode,East'),(5908,'Erode,Thirunagar,Colony,Karungalpalayam'),(5909,'Erode,Erode,Fort,Erode,East'),(5910,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(5911,'Erode,Sathyamangalam,Chikkaiah,Naicker,College'),(5912,'Erode,Periyar,Nagar,Chennimalai,Erode,East'),(5913,'Erode,Karungalpalayam'),(5914,'Erode,Karungalpalayam'),(5915,'Erode,Edayankattuvalsu'),(5916,'Agraharam,Erode,Komarapalayam,Pappampalayam'),(5917,'Erode,Moolapalayam,Kamaraj,Nagar,Erode,Railway,Colony'),(5918,'Erode,Erode,Fort,Erode,East'),(5919,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(5920,'Bhavani,Chithode,Chittode'),(5921,'Erode,Suriyampalayam,Vasavi,College'),(5922,'Erode,Kathirampatti,Perundurai,Thindal,Thindal'),(5923,'Erode,Soolai,Chikkaiah,Naicker,College'),(5924,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(5925,'Agraharam,Erode,Erode,East'),(5926,'Erode,Perundurai,Erode,Collectorate'),(5927,'Fairlands,Marakkadai'),(5928,'Erode,Vairapalayam,Karungalpalayam'),(5929,'Erode,Kokkarayanpettai,Solar,Kavilipalayam'),(5930,'Agraharam,Seerampalayam'),(5931,'Erode,Thindal'),(5932,'Erode,Perundurai,Ingur'),(5933,'Erode,Marapalam,Erode,East'),(5934,'Perundurai,Vadamugam,Vellode,Ingur'),(5935,'Erode,Karungalpalayam,Amoor,Arungal,Karungalpalayam'),(5936,'Erode,Chennimalai,Edayankattuvalsu'),(5937,'Erode,Veerappanchatram,Erode,East'),(5938,'Erode,Palayapalayam,Erode,Collectorate'),(5939,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(5940,'Moolapalayam,Nadarmedu,Erode,Railway,Colony'),(5941,'Perundurai,Thingalur,Palakarai'),(5942,'Erode,Perundurai,Ingur'),(5943,'Erode,Erode,Collectorate'),(5944,'Erode,Periyar,Nagar,Edayankattuvalsu'),(5945,'Erode,Perundurai,Erode,Collectorate'),(5946,'Erode,Erode,East'),(5947,'Erode,Erode,East'),(5948,'Erode,Karungalpalayam'),(5949,'Thindal,Arasampatti,Kadirampatti'),(5950,'Erode,Karungalpalayam'),(5951,'Erode,Periyar,Nagar,Chidambaram,Erode,East'),(5952,'Bhavani,Kali,Bhavani,Kudal'),(5953,'Erode,Punnam,Amur,Punnamchatram'),(5954,'Erode,East,Erode,East'),(5955,'Erode,Sampath,Nagar,Erode,Collectorate'),(5956,'Komarapalayam,Kallankattuvalasu'),(5957,'Erode,Karungalpalayam'),(5958,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(5959,'Erode,Edayankattuvalsu'),(5960,'Erode,Nanjaiuthukuli,Elumathur'),(5961,'Erode,Veerappanchatram,Karungalpalayam'),(5962,'Pallipalayam,Pallipalayam'),(5963,'Erode,Surampatti,Teachers,Colony,Erode,Collectorate'),(5964,'Coimbatore,Eral,Kavundampalayam'),(5965,'Erode,Nasiyanur,Anur,Thindal'),(5966,'Arachalur,Erode,Arachalur'),(5967,'Bhavani,Erode,Peria,Agraharam'),(5968,'Erode,Perundurai,Ingur'),(5969,'Erode,Soolai,Chikkaiah,Naicker,College'),(5970,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(5971,'Edappadi,Devagoundanur'),(5972,'Erode,Erode,Fort,Karungalpalayam'),(5973,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(5974,'Erode,Nasiyanur,Sampath,Nagar,Anur,Erode,Collectorate'),(5975,'Marakkadai,Marakkadai'),(5976,'Arur,Karur,Mudiganam'),(5977,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(5978,'Kathirampatti,Kadirampatti'),(5979,'Erode,Perundurai,Thindal'),(5980,'Erode,Erode,East'),(5981,'Coimbatore,Pannimadai'),(5982,'Erode,Erode,Fort,Erode,East'),(5983,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(5984,'Erode,Thindal,Thindal'),(5985,'Erode,Erode,Fort,Erode,East'),(5986,'Erode,Surampatti,Erode,East'),(5987,'Erode,Moolapalayam,Erode,Railway,Colony'),(5988,'Erode,Erode,East'),(5989,'Erode,Rangampalayam,Edayankattuvalsu'),(5990,'Annadanapatti,Annadanapatti'),(5991,'Erode,Periyar,Nagar,Erode,East'),(5992,'Erode,Perundurai,Erode,Collectorate'),(5993,'Erode,Teachers,Colony,Erode,Collectorate'),(5994,'Erode,Erode,Fort,Erode,East'),(5995,'Kokkarayanpettai,Pappampalayam'),(5996,'Perundurai,Ingur'),(5997,'Erode,Perundurai,Surampatti,Edayankattuvalsu'),(5998,'Bhavani,Perundurai,Ingur'),(5999,'Bhavani,Erode,Karungalpalayam'),(6000,'Erode,Edayankattuvalsu'),(6001,'Erode,Erode,Collectorate'),(6002,'Erode,Soolai,Ingur'),(6003,'Erode,Vadamugam,Vellode,Kanagapuram'),(6004,'Chithode,Chittode'),(6005,'Erode,Perundurai,Thindal,Thindal'),(6006,'Erode,Chennimalai,Edayankattuvalsu'),(6007,'Kannivadi,Seerampalayam'),(6008,'Erode,Rangampalayam,Chennimalai,Edayankattuvalsu'),(6009,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(6010,'Erode,Kavundachipalayam,Kanagapuram'),(6011,'Erode,Periya,Valasu,Veerappanchatram,Chikkaiah,Naicker,College'),(6012,'Erode,Chidambaram,Erode,East'),(6013,'Erode,Nadarmedu,Erode,Railway,Colony'),(6014,'Seerampalayam,Seerampalayam'),(6015,'Erode,Edayankattuvalsu'),(6016,'Erode,Thindal,Thindal'),(6017,'Bhavani,Bhavani,Kudal'),(6018,'Kurichi,Modakurichi,Avalpundurai'),(6019,'Erode,Perundurai,Erode,Collectorate'),(6020,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(6021,'Erode,Erode,Fort,Erode,East'),(6022,'Erode,Soolai,Chikkaiah,Naicker,College'),(6023,'Erode,Erode,Collectorate'),(6024,'Erode,Karungalpalayam'),(6025,'Erode,Periyar,Nagar,Erode,East'),(6026,'Erode,Nallur,Perundurai,Singanallur,Allur,Kalichettipalayam.,Mettupalayam'),(6027,'Kattampatti-Coimbatore,Kattampatti-Coimbatore'),(6028,'Erode,Perundurai,Erode,Collectorate'),(6029,'Chettipalayam,Erode,Railway,Colony'),(6030,'Erode,Erode,East'),(6031,'Erode,Karungalpalayam'),(6032,'Erode,Rangampalayam,Ganapathy,Edayankattuvalsu'),(6033,'Nasiyanur,Anur,Kadirampatti'),(6034,'Erode,Erode,East'),(6035,'Erode,Erode,Collectorate'),(6036,'Erode,Perundurai,Erode,Collectorate'),(6037,'Erode,Chikkaiah,Naicker,College'),(6038,'Bhavani,Erode,Vairapalayam,Voc,Park,Karungalpalayam'),(6039,'Erode,Erode,East'),(6040,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(6041,'Pallipalayam,Pallipalayam'),(6042,'Erode,Surampatti,Erode,East'),(6043,'Erode,Erode,Collectorate'),(6044,'Erode,Avalpundurai'),(6045,'Erode,Erode,Fort,Erode,East'),(6046,'Erode,Surampatti,Edayankattuvalsu'),(6047,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(6048,'Erode,Moolapalayam,Erode,Railway,Colony'),(6049,'Seerampalayam,Seerampalayam'),(6050,'Erode,Erode,Railway,Colony'),(6051,'Erode,Thindal,Thindal'),(6052,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(6053,'Erode,Periyar,Nagar,Erode,East'),(6054,'Erode,Erode,Fort,Karungalpalayam'),(6055,'Erode,Thindal,Thindal'),(6056,'Erode,Nadarmedu,Erode,Railway,Colony'),(6057,'Komarapalayam,Kallankattuvalasu'),(6058,'Erode,Rangampalayam,Edayankattuvalsu'),(6059,'Erode,Edayankattuvalsu'),(6060,'Erode,Chittode'),(6061,'Erode,Thirunagar,Colony,Karungalpalayam'),(6062,'Erode,Perundurai,Ingur'),(6063,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(6064,'Erode,Surampatti,Erode,East'),(6065,'Erode,Kadirampatti'),(6066,'Bhavani,Erode,Vasavi,College'),(6067,'Erode,Erode,Collectorate'),(6068,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(6069,'Erode,Erode,East'),(6070,'Erode,Chittode'),(6071,'Erode,Erode,East'),(6072,'Erode,Periyar,Nagar,Erode,East'),(6073,'Erode,Periyar,Nagar,Erode,East'),(6074,'Erode,Erode,East'),(6075,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(6076,'Erode,Railway,Colony,Erode,Railway,Colony'),(6077,'Erode,Pudur,Erode,Railway,Colony'),(6078,'Pudupalayam,Thindal,Kadirampatti'),(6079,'Erode,Perundurai,Thindal'),(6080,'Kavandapadi,Odathurai,Athur,Athurai,Kalichettipalayam.,Mettupalayam'),(6081,'Erode,Voc,Park,Karungalpalayam'),(6082,'Erode,Athipalayam,Chennimalai,Kanagapuram'),(6083,'Erode,Karungalpalayam'),(6084,'Kavundachipalayam,Kanagapuram'),(6085,'Erode,Edayankattuvalsu'),(6086,'Erode,Edayankattuvalsu'),(6087,'Erode,Perundurai,Erode,Collectorate'),(6088,'Erode,Teachers,Colony,Erode,Collectorate'),(6089,'Bhavani,Appakudal'),(6090,'Erode,Solar,Erode,Railway,Colony'),(6091,'Erode,Karungalpalayam,Amoor,Arungal,Karungalpalayam'),(6092,'Erode,Arasampatti,Kadirampatti'),(6093,'Kambiliyampatti,Kambiliyampatti'),(6094,'Erode,Perundurai,Thindal'),(6095,'Chithode,Chittode'),(6096,'Gundalapatti,Gundalapatti'),(6097,'Erode,Collectorate,Erode,Collectorate'),(6098,'Erode,Thirunagar,Colony,Karungalpalayam'),(6099,'Erode,Periyar,Nagar,Erode,East'),(6100,'Erode,Periyar,Nagar,Erode,East'),(6101,'Erode,Perundurai,Erode,Collectorate'),(6102,'Erode,Erode,East'),(6103,'Adaiyur,Andapuram,Adaiyur'),(6104,'Erode,Kodumudi,Solar,Erode,Railway,Colony'),(6105,'Erode,Erode,Fort,Erode,East'),(6106,'Coimbatore,Gandhimaanagar'),(6107,'Erode,Erode,Railway,Colony'),(6108,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(6109,'Erode,Chikkaiah,Naicker,College'),(6110,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(6111,'Chithode,Chittode'),(6112,'Erode,Thirunagar,Colony,Karungalpalayam'),(6113,'Erode,Amoor,Karungalpalayam'),(6114,'Erode,Muncipal,Colony,Veerappanchatram,Chikkaiah,Naicker,College'),(6115,'Erode,Edayankattuvalsu'),(6116,'Erode,Erode,East'),(6117,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(6118,'Coimbatore,Ramnagar,Coimbatore'),(6119,'Erode,Erode,Railway,Colony'),(6120,'Erode,Erode,East'),(6121,'Erode,Perundurai,Ganapathy,Ingur'),(6122,'Erode,Erode,Fort,Karungalpalayam'),(6123,'Erode,Thirunagar,Colony,Karungalpalayam'),(6124,'Eral,Karungalpalayam'),(6125,'Kadirampatti,Kadirampatti'),(6126,'Erode,Karungalpalayam'),(6127,'Erode,Erode,East'),(6128,'Erode,Perundurai,Thindal'),(6129,'Erode,Vairapalayam,Karungalpalayam'),(6130,'Erode,Chettipalayam,Erode,Railway,Colony'),(6131,'Kurichi,Attur,Kattur,Seerampalayam'),(6132,'Thindal,Kadirampatti'),(6133,'Erode,Erode,Collectorate'),(6134,'Athur,Merkupathi'),(6135,'Erode,Erode,Fort,Erode,East'),(6136,'Seerampalayam,Seerampalayam'),(6137,'Erode,Erode,East'),(6138,'Erode,Thindal'),(6139,'Erode,Erode,Collectorate'),(6140,'Pallipalayam,Pallipalayam'),(6141,'Chinnamalai,Erode,Chikkaiah,Naicker,College'),(6142,'Erode,Erode,East'),(6143,'Erode,Erode,East'),(6144,'Erode,Edayankattuvalsu'),(6145,'Erode,Chikkaiah,Naicker,College'),(6146,'Erode,Chittode'),(6147,'Erode,Thindal,Emur,Chikkaiah,Naicker,College'),(6148,'Erode,Perumugai,Pudur,Arapallam,Kallipatti,Kanakkampalayam'),(6149,'Devanankurichi,Devanankurichi'),(6150,'Erode,Edayankattuvalsu'),(6151,'Erode,Thindal'),(6152,'Chithode,Erode,Gangapuram,Chittode'),(6153,'Erode,Erode,East'),(6154,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(6155,'Perundurai,Ingur'),(6156,'Erode,Thindal'),(6157,'Anampatti,Avanam,Coimbatore,Keeranatham,Keeranatham'),(6158,'Ayal,Seerampalayam'),(6159,'Anthiyur,Bhavani,Bhavani,Kudal'),(6160,'Erode,Palayapalayam,Teachers,Colony,Erode,Collectorate'),(6161,'Bhavani,Bhavani,Kudal'),(6162,'Erode,Erode,Fort,Erode,East'),(6163,'Agraharam,Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(6164,'Erode,Periya,Valasu,Chikkaiah,Naicker,College'),(6165,'Erode,Erode,East'),(6166,'Erode,Ayal,Erode,East'),(6167,'Erode,Nasiyanur,Anur,Kadirampatti'),(6168,'Bhavani,Erode,Kollampalayam,Kalpalayam,Erode,Railway,Colony'),(6169,'Erode,Muncipal,Colony,Karungalpalayam'),(6170,'Erode,Periyar,Nagar,Chidambaram,Erode,East'),(6171,'Polavakkalipalayam,Kali,Kalipalayam,Kadukkampalayam'),(6172,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(6173,'Erode,Moolapalayam,Erode,Railway,Colony'),(6174,'Erode,Erode,Fort,Erode,East'),(6175,'Erode,Thindal,Thindal'),(6176,'Erode,Chidambaram,Erode,East'),(6177,'Erode,Chikkaiah,Naicker,College'),(6178,'Chikkaiah,Naicker,College,Chikkaiah,Naicker,College'),(6179,'Erode,Chennimalai,Kanagapuram'),(6180,'Erode,Ellapalayam,Chikkaiah,Naicker,College'),(6181,'Erode,Thindal'),(6182,'Erode,Palakarai'),(6183,'Perundurai,Kanji,Kanjikovil,Ingur'),(6184,'Erode,Rangampalayam,Edayankattuvalsu'),(6185,'Kunnamalai,Kunnamalai'),(6186,'Erode,Erode,East'),(6187,'Chittode,Chittode'),(6188,'Erode,Chikkaiah,Naicker,College'),(6189,'Erode,Nasiyanur,Anur,Kadirampatti'),(6190,'Erode,Ganapathy,Ganapathipalayam'),(6191,'Chithode,Gangapuram,Chittode'),(6192,'Erode,Surampatti,Chikkaiah,Naicker,College'),(6193,'Veerappanchatram,Chikkaiah,Naicker,College'),(6194,'Erode,Soolai,Chikkaiah,Naicker,College'),(6195,'Erode,Chikkaiah,Naicker,College'),(6196,'Erode,Voc,Park,Karungalpalayam'),(6197,'Elumathur,Elumathur'),(6198,'Erode,Chittode'),(6199,'Erode,Karungalpalayam'),(6200,'Erode,Emur,Chikkaiah,Naicker,College'),(6201,'Chettipalayam,Coimbatore,Sundakkamuthur'),(6202,'Pallipalayam,Pallipalayam'),(6203,'Erode,Surampatti,Erode,East'),(6204,'Agraharam,Erode,Chikkaiah,Naicker,College'),(6205,'Erode,Manickampalayam,Chikkaiah,Naicker,College'),(6206,'Erode,Thindal,Thindal'),(6207,'Ayyanthirumaligai,Ayyanthirumaligai'),(6208,'Erode,Thindal'),(6209,'Erode,Erode,East'),(6210,'Erode,Surampatti,Edayankattuvalsu'),(6211,'Erode,Chikkaiah,Naicker,College'),(6212,'Avalpoondurai,Erode,Rangampalayam,Avalpundurai'),(6213,'Rangampalayam,Devagoundanur'),(6214,'Chennimalai,Basuvapatti'),(6215,'Gobichettipalayam,Pariyur,Ariyur,Atur,Chettipalayam,Kadukkampalayam'),(6216,'Erode,Soolai,Chikkaiah,Naicker,College'),(6217,'Erode,Surampatti,Erode,East'),(6218,'Erode,Rangampalayam,Edayankattuvalsu'),(6219,'Erode,Nasiyanur,Anur,Thindal'),(6220,'Erode,Palayapalayam,Thindal,Thindal'),(6221,'Erode,Erode,Collectorate'),(6222,'Erode,Nasiyanur,Anur,Kadirampatti'),(6223,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(6224,'Nadayanur,Nadayanur'),(6225,'Seerampalayam,Seerampalayam'),(6226,'Erode,Edayankattuvalsu'),(6227,'Chikkaiah,Naicker,College,Chikkaiah,Naicker,College'),(6228,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(6229,'Erode,Erode,Collectorate'),(6230,'Erode,Emur,Chikkaiah,Naicker,College'),(6231,'Erode,Erode,Fort,Erode,East'),(6232,'Erode,Thindal,Thindal'),(6233,'Erode,Perundurai,Erode,Collectorate'),(6234,'Erode,Palayapalayam,Thindal'),(6235,'Bhavani,Chithode,Erode,Chittode'),(6236,'Erode,Seerampalayam'),(6237,'Solar,Erode,Railway,Colony'),(6238,'Erode,Erode,Fort,Thindal,Erode,East'),(6239,'Erode,Moolapalayam,Erode,Railway,Colony'),(6240,'Erode,Erode,Railway,Colony'),(6241,'Erode,Karungalpalayam'),(6242,'Nasiyanur,Anur,Kadirampatti'),(6243,'Kanjikovil,Kanjikovil'),(6244,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(6245,'Erode,Moolapalayam,Nadarmedu,Erode,Railway,Colony'),(6246,'Erode,Nasiyanur,Perundurai,Anur,Kadirampatti'),(6247,'Erode,Erode,Fort,Erode,East'),(6248,'Erode,Periya,Valasu,Chikkaiah,Naicker,College'),(6249,'Erode,Ingur'),(6250,'Erode,Elumathur'),(6251,'Bhavani,Erode,Karungalpalayam'),(6252,'Erode,Erode,Collectorate'),(6253,'Erode,Erode,Fort,Erode,East'),(6254,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(6255,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(6256,'Erode,Edayankattuvalsu'),(6257,'Bhavani,Bhavani,Kudal'),(6258,'Erode,Thindal'),(6259,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(6260,'Erode,Surampatti,Erode,East'),(6261,'Kasipalayam,Edayankattuvalsu'),(6262,'Erode,Perundurai,Thindal,Thindal'),(6263,'Erode,Periyar,Nagar,Erode,East'),(6264,'Erode,Kollampalayam,Moolapalayam,Arur,Karur,Erode,Railway,Colony'),(6265,'Erode,Muncipal,Colony,Karungalpalayam'),(6266,'Erode,Nasiyanur,Anur,Kadirampatti'),(6267,'Erode,Perundurai,Ingur'),(6268,'Kathirampatti,Kadirampatti'),(6269,'Erode,Perundurai,Erode,Collectorate'),(6270,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(6271,'Erode,Chikkaiah,Naicker,College'),(6272,'Dharmapuri,Kalichettipalayam.,Mettupalayam'),(6273,'Erode,Edayankattuvalsu'),(6274,'Erode,Periyar,Nagar,Surampatti,Erode,East'),(6275,'Erode,Thindal,Thindal'),(6276,'Erode,Thindal'),(6277,'Erode,Avalpundurai'),(6278,'Erode,Kanjikovil'),(6279,'Chinnagoundanur,Chinnagoundanur'),(6280,'Erode,Arasampatti,Erode,Collectorate'),(6281,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(6282,'Erode,Sampath,Nagar,Erode,Collectorate'),(6283,'Erode,Erode,Collectorate'),(6284,'Agraharam,Erode,Peria,Agraharam'),(6285,'Thindal,Thindal'),(6286,'Iruppu,Karuvampalayam'),(6287,'Erode,Rangampalayam,Edayankattuvalsu'),(6288,'Erode,Perundurai,Erode,Collectorate'),(6289,'Erode,Erode,Collectorate'),(6290,'Erode,Perundurai,Ingur'),(6291,'Erode,Erode,Fort,Erode,East'),(6292,'Erode,Chennimalai,Erode,East'),(6293,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(6294,'Erode,Marapalam,Erode,East'),(6295,'Erode,Erode,East'),(6296,'Erode,Erode,East'),(6297,'Agraharam,Erode,Soolai,Chikkaiah,Naicker,College'),(6298,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(6299,'Erode,Moolapalayam,Erode,Railway,Colony'),(6300,'Erode,Solar,Erode,Railway,Colony'),(6301,'Erode,Moolapalayam,Erode,Railway,Colony'),(6302,'Gettisamudram,Kannadipalayam'),(6303,'Erode,Erode,East'),(6304,'Erode,Thindal,Thindal'),(6305,'Narayana,Valasu,Sampath,Nagar,Erode,Collectorate'),(6306,'Erode,Muncipal,Colony,Karungalpalayam'),(6307,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(6308,'Erode,Thindal,Thindal'),(6309,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(6310,'Erode,Edayankattuvalsu'),(6311,'Perundurai,Athur,Ingur'),(6312,'Erode,Pudur,Kanagapuram'),(6313,'Erode,Chittode'),(6314,'Mettunasuvanpalayam,Kali,Bhavani,Kudal'),(6315,'Erode,Chikkaiah,Naicker,College'),(6316,'Erode,Moolapalayam,Erode,Railway,Colony'),(6317,'Erode,Erode,East'),(6318,'Nasiyanur,Anur,Kadirampatti'),(6319,'Erode,Erode,Fort,Erode,East'),(6320,'Erode,Ellapalayam,Emur,Chikkaiah,Naicker,College'),(6321,'Erode,Periyar,Nagar,Erode,East'),(6322,'Erode,Moolapalayam,Erode,Railway,Colony'),(6323,'Erode,Thindal'),(6324,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(6325,'Erode,Palayapalayam,Teachers,Colony,Erode,Collectorate'),(6326,'Erode,Sampath,Nagar,Erode,Collectorate'),(6327,'Erode,Erode,East'),(6328,'Erode,Perundurai,Erode,Collectorate'),(6329,'Erode,Moolapalayam,Nadarmedu,Erode,Railway,Colony'),(6330,'Pudur,Peria,Agraharam'),(6331,'Erode,Moolapalayam,Erode,Railway,Colony'),(6332,'Erode,Arur,Karur,Erode,Railway,Colony'),(6333,'Seerampalayam,Seerampalayam'),(6334,'Solar,Arur,Karur,Erode,Railway,Colony'),(6335,'Erode,Erode,Collectorate'),(6336,'Emur,Avalpundurai'),(6337,'Erode,Moolapalayam,Erode,Railway,Colony'),(6338,'Erode,Thindal,Thindal'),(6339,'Bhavani,Erode,Bhavani,Kudal'),(6340,'Erode,Erode,East'),(6341,'Erode,Karungalpalayam'),(6342,'Erode,Erode,East'),(6343,'Erode,Chikkaiah,Naicker,College'),(6344,'Erode,Surampatti,Edayankattuvalsu'),(6345,'Erode,Thindal'),(6346,'Perundurai,Eral,Ingur'),(6347,'Kavundampalayam,Kuchi,Palayam'),(6348,'Pallipalayam,Pallipalayam'),(6349,'Erode,East,Erode,East'),(6350,'Erode,Erode,East'),(6351,'Erode,Kali,Vasavi,College'),(6352,'Arur,Karur,Erode,Railway,Colony'),(6353,'Erode,Karungalpalayam'),(6354,'Chithode,Chittode'),(6355,'Erode,Erode,Fort,Erode,East'),(6356,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(6357,'Pallipalayam,Pallipalayam'),(6358,'Erode,Palayapalayam,Erode,Collectorate'),(6359,'Erode,Erode,Collectorate'),(6360,'Erode,Seerampalayam'),(6361,'Erode,Eral,Erode,Collectorate'),(6362,'Erode,Karungalpalayam'),(6363,'Pudur,Hasthampatti'),(6364,'Uppupalayam,Uppupalayam'),(6365,'Erode,Erode,Fort,Erode,East'),(6366,'Erode,Erode,Collectorate'),(6367,'Erode,Peria,Agraharam'),(6368,'Erode,Thindal'),(6369,'Erode,Kanji,Kanjikovil'),(6370,'Pallipalayam,Pallipalayam'),(6371,'Erode,Chikkaiah,Naicker,College'),(6372,'Erode,Perundurai,Edayankattuvalsu'),(6373,'Erode,Manickampalayam,Erode,East'),(6374,'Komarapalayam,Kallankattuvalasu'),(6375,'Erode,Chikkaiah,Naicker,College'),(6376,'Erode,Gobichettipalayam,Chettipalayam,Kalichettipalayam.,Mettupalayam'),(6377,'Erode,Soolai,Chikkaiah,Naicker,College'),(6378,'Chennimalai,Gandhinagar,Basuvapatti'),(6379,'Erode,Periyar,Nagar,Erode,East'),(6380,'Erode,Erode,Collectorate'),(6381,'Alampalayam,Seerampalayam'),(6382,'Erode,Periyar,Nagar,Erode,East'),(6383,'Erode,Erode,Collectorate'),(6384,'Komarapalayam,Kallankattuvalasu'),(6385,'Komarapalayam,Kallankattuvalasu'),(6386,'Perundurai,Ingur'),(6387,'Erode,Thindal,Thindal'),(6388,'Erode,Perundurai,Ingur'),(6389,'Chithode,Chittode'),(6390,'Erode,East,Erode,East'),(6391,'Erode,Edayankattuvalsu'),(6392,'Erode,Palayapalayam,Edayankattuvalsu'),(6393,'Erode,Erode,East'),(6394,'Erode,Erode,Collectorate'),(6395,'Erode,Erode,Fort,Erode,Market,Voc,Park,Karungalpalayam'),(6396,'Erode,Edayankattuvalsu'),(6397,'Komarapalayam,Kallankattuvalasu'),(6398,'Erode,Karungalpalayam'),(6399,'Erode,Ellapalayam,Emur,Chikkaiah,Naicker,College'),(6400,'Chikkaiah,Naicker,College,Chikkaiah,Naicker,College'),(6401,'Erode,Sivagiri,Erode,East'),(6402,'Erode,Lakkapuram,Kamaraj,Nagar,Erode,Railway,Colony'),(6403,'Thindal,Thindal'),(6404,'Veerappanchatram,Chikkaiah,Naicker,College'),(6405,'Erode,Chettipalayam,Erode,Railway,Colony'),(6406,'Erode,Periyar,Nagar,Edayankattuvalsu'),(6407,'Erode,Gobichettipalayam,Chettipalayam,Erode,Collectorate'),(6408,'Erode,Erode,Fort,Erode,East'),(6409,'Erode,Soolai,Karumal,Karumalai,Chikkaiah,Naicker,College'),(6410,'Erode,Karungalpalayam'),(6411,'Agraharam,Thottipalayam,Seerampalayam'),(6412,'Erode,Perundurai,Erode,Collectorate'),(6413,'Kollampalayam,Erode,Railway,Colony'),(6414,'Pudupalayam,Alampalayam,Seerampalayam'),(6415,'Moolapalayam,Erode,Railway,Colony'),(6416,'Erode,Kathirampatti,Perundurai,Kadirampatti'),(6417,'Chithode,Erode,Chittode'),(6418,'Erode,Chidambaram,Erode,East'),(6419,'Kambiliyampatti,Kambiliyampatti'),(6420,'Erode,Moolapalayam,Erode,Railway,Colony'),(6421,'Erode,Perundurai,Kadirampatti'),(6422,'Erode,Erode,Fort,Erode,East'),(6423,'Erode,Surampatti,Kali,Erode,East'),(6424,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(6425,'Agraharam,Erode,Komarapalayam,Seerampalayam'),(6426,'Elur,Tiruchengodu,North'),(6427,'Erode,Periyar,Nagar,Erode,East'),(6428,'Erode,Periyar,Nagar,Erode,East'),(6429,'Erode,Chikkaiah,Naicker,College'),(6430,'Erode,Erode,Fort,Erode,East'),(6431,'Erode,Perundurai,Kadirampatti'),(6432,'Erode,Erode,Fort,Erode,Collectorate'),(6433,'Bhavani,Chithode,Erode,Chittode'),(6434,'Bhavani,Pudur,Suriyampalayam,Peria,Agraharam'),(6435,'Erode,Perundurai,Kanagapuram'),(6436,'Erode,Erode,East'),(6437,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(6438,'Erode,Erode,Collectorate'),(6439,'Avalpoondurai,Erode,Avalpundurai'),(6440,'Erode,Erode,East'),(6441,'Erode,Erode,Fort,Erode,East'),(6442,'Erode,Perundurai,Kanagapuram'),(6443,'Erode,Karungalpalayam'),(6444,'Erode,Mullampatti,Nasiyanur,Anur,Atur,Kadirampatti'),(6445,'Erode,Perundurai,Erode,Collectorate'),(6446,'Erode,Emur,Chikkaiah,Naicker,College'),(6447,'Erode,Karungalpalayam'),(6448,'Erode,Erode,East'),(6449,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(6450,'Erode,Rangampalayam,Edayankattuvalsu'),(6451,'Perundurai,Ingur'),(6452,'Erode,Thirunagar,Colony,Karungalpalayam'),(6453,'Erode,Chikkaiah,Naicker,College'),(6454,'Erode,Marapalam,Erode,East'),(6455,'Anthiyur,Bhavani,Boothapadi,Erode,Ammapettai'),(6456,'Erode,Thindal,Thindal'),(6457,'Erode,Erode,Fort,Erode,East'),(6458,'Palayapalayam,Perundurai,Thindal'),(6459,'Erode,Perundurai,Ingur'),(6460,'Erode,Thirunagar,Colony,Karungalpalayam'),(6461,'Muncipal,Colony,Veerappanchatram,Chintamani,Karungalpalayam'),(6462,'Erode,Nasiyanur,Anur,Erode,Railway,Colony'),(6463,'Erode,Erode,Fort,Karungalpalayam'),(6464,'Erode,Erode,Fort,Erode,East'),(6465,'Solar,Arur,Karur,Erode,Railway,Colony'),(6466,'Erode,Erode,East'),(6467,'Perundurai,Athur,Ingur'),(6468,'Erode,Erode,Collectorate'),(6469,'Erode,Amayapuram,Erode,Collectorate'),(6470,'Erode,Moolapalayam,Erode,Railway,Colony'),(6471,'Chithode,Erode,Chittode'),(6472,'Erode,Moolapalayam,Erode,Railway,Colony'),(6473,'Erode,Erode,Fort,Erode,East'),(6474,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(6475,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(6476,'Erode,Solar,Erode,Railway,Colony'),(6477,'Perundurai,Kadirampatti'),(6478,'Erode,Karungalpalayam'),(6479,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(6480,'Erode,Perundurai,Erode,Collectorate'),(6481,'Kuruppanaickenpalayam,Bhavani,Kudal'),(6482,'Erode,Nasiyanur,Periyar,Nagar,Sampath,Nagar,Anur,Erode,East'),(6483,'Erode,Erode,East'),(6484,'Erode,Karungalpalayam'),(6485,'Erode,Elanagar,Chikkaiah,Naicker,College'),(6486,'Erode,Thindal,Thindal'),(6487,'Padavalkalvai,Ammapettai'),(6488,'Erode,Muncipal,Colony,Veerappanchatram,Chikkaiah,Naicker,College'),(6489,'Koothampalayam,Koothampalayam'),(6490,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(6491,'Bhavani,Erode,Kandampalayam,Karumandisellipalayam,Ingur'),(6492,'Erode,Perundurai,Thindal,Thindal'),(6493,'Erode,Perundurai,Thindal'),(6494,'Erode,Erode,Fort,Erode,East'),(6495,'Erode,Marapalam,Surampatti,Erode,East'),(6496,'Erode,Karungalpalayam'),(6497,'Erode,Erode,East'),(6498,'Erode,Kadirampatti'),(6499,'Erode,Kollampalayam,Erode,Railway,Colony'),(6500,'Erode,Pudur,Suriyampalayam,Peria,Agraharam'),(6501,'Chithode,Erode,Chittode'),(6502,'Erode,Erode,Fort,Erode,East'),(6503,'Erode,Solar,Arur,Karur,Erode,Railway,Colony'),(6504,'Erode,Nasiyanur,Sampath,Nagar,Anur,Erode,Collectorate'),(6505,'Gobichettipalayam,Mevani,Chettipalayam,Kugalur'),(6506,'Erode,Erode,Collectorate'),(6507,'Erode,Erode,East'),(6508,'Erode,Karungalpalayam'),(6509,'Erode,Erode,Fort,Erode,East'),(6510,'Erode,Palayapalayam,Thindal'),(6511,'Erode,Marapalam,Surampatti,Erode,East'),(6512,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(6513,'Erode,Thindal'),(6514,'Erode,Perundurai,Edayankattuvalsu'),(6515,'Erode,Teachers,Colony,Erode,Collectorate'),(6516,'Erode,Arur,Karur,Erode,Railway,Colony'),(6517,'Erode,Railway,Colony,Erode,East'),(6518,'Erode,Erode,East'),(6519,'Gangapuram,Chittode'),(6520,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(6521,'Erode,Periyar,Nagar,Surampatti,Edayankattuvalsu'),(6522,'Erode,Perundurai,Allapalayam,Thindal'),(6523,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(6524,'Bhavani,Erode,Vasavi,College'),(6525,'Erode,Teachers,Colony,Erode,Collectorate'),(6526,'Erode,Kollampalayam,Erode,Railway,Colony'),(6527,'Athani,Erode,Pudur,Sathyamangalam,Guthialathur'),(6528,'Erode,Muncipal,Colony,Veerappanchatram,Chikkaiah,Naicker,College'),(6529,'Erode,Erode,East'),(6530,'Perundurai,Ponmudi,Kambiliyampatti'),(6531,'Erode,Perundurai,Thindal,Thindal'),(6532,'Erode,Karungalpalayam,Amoor,Arungal,Karungalpalayam'),(6533,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(6534,'Erode,Perundurai,Erode,Collectorate'),(6535,'Erode,Rangampalayam,Edayankattuvalsu'),(6536,'Erode,Lakkapuram,Erode,Railway,Colony'),(6537,'Annur,Kaniyur,641407'),(6538,'Erode,Karungalpalayam'),(6539,'Erode,Elumathur'),(6540,'Erode,Marapalam,Karungalpalayam'),(6541,'Erode,Edayankattuvalsu'),(6542,'Erode,Narayana,Valasu,Nasiyanur,Anur,Erode,Collectorate'),(6543,'Koottapalli,Koottapalli'),(6544,'Erode,Chikkaiah,Naicker,College'),(6545,'Erode,Chittode'),(6546,'Perundurai,Karumal,Karumalai,Kanagapuram'),(6547,'Erode,Erode,Fort,Erode,East'),(6548,'Erode,Chikkaiah,Naicker,College'),(6549,'Erode,Nasiyanur,Anur,Kadirampatti'),(6550,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(6551,'Erode,Perundurai,Kanagapuram'),(6552,'Gobichettipalayam,Modachur,Achur,Chettipalayam,Kadukkampalayam'),(6553,'Erode,Chennimalai,Edayankattuvalsu'),(6554,'Erode,Arakkankottai'),(6555,'Erode,Lakkapuram,Erode,Railway,Colony'),(6556,'Erode,Chikkaiah,Naicker,College'),(6557,'Pudur,Erode,Railway,Colony'),(6558,'Erode,Erode,East'),(6559,'Gangapuram,Chittode'),(6560,'Palayapalayam,Thindal'),(6561,'Bhavani,Erode,Chikkaiah,Naicker,College'),(6562,'Anur,Idappadi,Erumaipatti'),(6563,'Erode,Thirunagar,Colony,Karungalpalayam'),(6564,'Perundurai,Ingur'),(6565,'Erode,Perundurai,Erode,Collectorate'),(6566,'Erode,Chennimalai,Erode,Railway,Colony'),(6567,'Erode,Ellapalayam,Emur,Chikkaiah,Naicker,College'),(6568,'Coimbatore,Ramnagar,Coimbatore'),(6569,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(6570,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(6571,'Kollampalayam,Arur,Karur,Erode,Railway,Colony'),(6572,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(6573,'Erode,Karungalpalayam,Marapalam,Arungal,Karungalpalayam'),(6574,'Erode,Perundurai,Thindal,Thindal'),(6575,'Erode,Attur,Kakkaveri'),(6576,'Erode,Nasiyanur,Anur,Thindal'),(6577,'Erode,Erode,Railway,Colony'),(6578,'Edappadi,Dadapuram'),(6579,'Erode,Erode,East'),(6580,'Erode,Erode,Fort,Erode,East'),(6581,'Pudur,Coimbatore,Pappanaickenpalayam'),(6582,'Erode,Arur,Karur,Erode,Railway,Colony'),(6583,'Erode,Erode,Fort,Erode,East'),(6584,'Erode,Chikkaiah,Naicker,College'),(6585,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(6586,'Erode,Veerappanchatram,Karungalpalayam'),(6587,'Erode,Guruvareddiyur,Edayankattuvalsu'),(6588,'Coimbatore,Ramnagar,Coimbatore'),(6589,'Erode,Gobichettipalayam,Chettipalayam,Kadukkampalayam'),(6590,'Bhavani,Kavandapadi,Appakudal'),(6591,'Erode,Arur,Karur,Erode,Railway,Colony'),(6592,'Erode,Solar,Arur,Karur,Erode,Railway,Colony'),(6593,'Erode,Moolapalayam,Erode,Railway,Colony'),(6594,'Pudur,Kovaipudur'),(6595,'Coimbatore,R.S.Puram,East'),(6596,'Erode,Edayankattuvalsu'),(6597,'Erode,Karungalpalayam'),(6598,'Erode,Karungalpalayam'),(6599,'Erode,Surampatti,Edayankattuvalsu'),(6600,'Erode,Erode,Fort,Erode,East'),(6601,'Erode,Erode,Fort,Erode,East'),(6602,'Erode,Edayankattuvalsu'),(6603,'Erode,Erode,Fort,Erode,East'),(6604,'Erode,Edayankattuvalsu'),(6605,'Erode,Perundurai,Thindal'),(6606,'Erode,Teachers,Colony,Erode,Collectorate'),(6607,'Namakkal,Bazaar,Namakkal,Bazaar'),(6608,'Erode,Chidambaram,Erode,East'),(6609,'Erode,Erode,East'),(6610,'Erode,Chettipalayam,Erode,Railway,Colony'),(6611,'Erode,Karungalpalayam'),(6612,'Erode,Erode,East'),(6613,'Erode,Perundurai,Kadirampatti'),(6614,'Perundurai,Athur,Kadirampatti'),(6615,'Erode,Nasiyanur,Anur,Kaikatti,Kadirampatti'),(6616,'Erode,Erode,East'),(6617,'Erode,Edayankattuvalsu'),(6618,'Erode,Chikkaiah,Naicker,College'),(6619,'Edayankattuvalsu,Edayankattuvalsu'),(6620,'Erode,Karungalpalayam,Arungal,Edayankattuvalsu'),(6621,'Erode,Edayankattuvalsu'),(6622,'Erode,Erode,Fort,Erode,East'),(6623,'Erode,Perundurai,Thindal,Thindal'),(6624,'Coimbatore,Ramnagar,Coimbatore'),(6625,'Erode,Erode,Fort,Erode,East'),(6626,'Pallipalayam,Pallipalayam'),(6627,'Erode,Erode,Collectorate'),(6628,'Erode,Erode,East'),(6629,'Kurichi,Coimbatore,641051'),(6630,'Erode,Erode,East'),(6631,'Erode,Erode,Collectorate'),(6632,'Erode,Chidambaram,Erode,Collectorate'),(6633,'Erode,Periyar,Nagar,Erode,East'),(6634,'Erode,Teachers,Colony,Erode,Collectorate'),(6635,'Erode,Thindal,Thindal'),(6636,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(6637,'Erode,Chikkaiah,Naicker,College'),(6638,'Erode,Avalpundurai'),(6639,'Erode,Erode,East'),(6640,'Erode,Pudur,Arur,Karur,Avudayarparai'),(6641,'Erode,Periyar,Nagar,Erode,East'),(6642,'Erode,Erode,Fort,Erode,East'),(6643,'Erode,Erode,Fort,Erode,East'),(6644,'Kadirampatti,Kadirampatti'),(6645,'Chithode,Chittode'),(6646,'Erode,Erode,East'),(6647,'Chinnasalem,Anumanandal'),(6648,'Erode,Karungalpalayam'),(6649,'Erode,Perundurai,Erode,Collectorate'),(6650,'Erode,Erode,Railway,Colony'),(6651,'Erode,Perundurai,Thindal'),(6652,'Erode,Rangampalayam,Edayankattuvalsu'),(6653,'Erode,Edayankattuvalsu'),(6654,'Erode,Chidambaram,Erode,East'),(6655,'Erode,Perundurai,Erode,Collectorate'),(6656,'Erode,Erode,Fort,Erode,East'),(6657,'Erode,Chikkaiah,Naicker,College'),(6658,'Pappampalayam,Pappampalayam'),(6659,'Chithode,Vasavi,College'),(6660,'Erode,Erode,East'),(6661,'Erode,Perundurai,Thindal,Thindal'),(6662,'Chithode,Chittode'),(6663,'Erode,Karungalpalayam'),(6664,'Pallipalayam,Pallipalayam'),(6665,'Chithode,Chittode'),(6666,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(6667,'Erode,Perundurai,Ingur'),(6668,'Erode,Erode,Fort,Erode,East'),(6669,'Dharmapuri,Public,Offices,Dharmapuri,Public,Offices'),(6670,'Erode,Thirunagar,Colony,Karungalpalayam'),(6671,'Perundurai,Thindal'),(6672,'Erode,Perundurai,Thindal,Thindal'),(6673,'Erode,Moolapalayam,Arur,Karur,Erode,Railway,Colony'),(6674,'Erode,Karungalpalayam'),(6675,'Erode,Nasiyanur,Sampath,Nagar,Anur,Erode,Collectorate'),(6676,'Erode,Guruvareddiyur'),(6677,'Erode,Chidambaram,Erode,East'),(6678,'Erode,Erode,East'),(6679,'Thindal,Thindal'),(6680,'Erode,Chikkaiah,Naicker,College'),(6681,'Erode,Karungalpalayam'),(6682,'Agraharam,Seerampalayam'),(6683,'Erode,Perundurai,Thingalur,Nichampalayam'),(6684,'Erode,Emur,Chikkaiah,Naicker,College'),(6685,'Solar,Arur,Karur,Erode,Railway,Colony'),(6686,'Erode,Avadi,Kuchi,Palayam'),(6687,'Erode,Marapalam,Erode,East'),(6688,'Erode,Edayankattuvalsu'),(6689,'Iduvampalayam,Iruppu,Iduvampalayam'),(6690,'Erode,Teachers,Colony,Edayankattuvalsu'),(6691,'Nadarmedu,Arur,Karur,Erode,Railway,Colony'),(6692,'Erode,Erode,Fort,Erode,East'),(6693,'Erode,Edayankattuvalsu'),(6694,'Ganapathipalayam,Athipalayam,Ganapathipalayam'),(6695,'Erode,Periyar,Nagar,Kanchipuram,Erode,East'),(6696,'Erode,Erode,Fort,Erode,East'),(6697,'Bhavani,Erode,Chikkaiah,Naicker,College'),(6698,'Erode,Thindal'),(6699,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(6700,'Bhavani,Erode,Kali,Vasavi,College'),(6701,'Erode,Palayapalayam,Avanam,Edayankattuvalsu'),(6702,'Erode,Teachers,Colony,Edayankattuvalsu'),(6703,'Erode,Erode,East'),(6704,'Erode,Thindal,Thindal'),(6705,'Erode,Chidambaram,Erode,East'),(6706,'Erode,Erode,East'),(6707,'Erode,Perundurai,Amoor,Erode,Collectorate'),(6708,'Erode,Periya,Valasu,Chikkaiah,Naicker,College'),(6709,'Erode,Karungalpalayam'),(6710,'Erode,Perundurai,Athur,Ingur'),(6711,'Erode,Chikkaiah,Naicker,College'),(6712,'Erode,Erode,East'),(6713,'Erode,Erode,Fort,Erode,East'),(6714,'Erode,Perundurai,Erode,Collectorate'),(6715,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(6716,'Erode,Edayankattuvalsu'),(6717,'Erode,Basuvapatti'),(6718,'Erode,Erode,Collectorate'),(6719,'Erode,Erode,Collectorate'),(6720,'Erode,Perundurai,Thindal'),(6721,'Perundalaiyur,Appakudal'),(6722,'Erode,Thindal'),(6723,'Erode,Marapalam,Erode,East'),(6724,'Erode,Kanagapuram'),(6725,'Erode,Surampatti,Erode,East'),(6726,'Erode,Erode,East'),(6727,'Erode,Erode,East'),(6728,'Komarapalayam,Kallankattuvalasu'),(6729,'Erode,Ammapettai'),(6730,'Erode,Erode,Collectorate'),(6731,'Erode,Erode,Fort,Erode,East'),(6732,'Avalpoondurai,Erode,Avalpundurai'),(6733,'Komarapalayam,Kallankattuvalasu'),(6734,'Erode,Perundurai,Erode,Collectorate'),(6735,'Erode,Edayankattuvalsu'),(6736,'Vasavi,College,Vasavi,College'),(6737,'Erode,Thindal'),(6738,'Erode,Kavilipalayam'),(6739,'Erode,Chikkaiah,Naicker,College'),(6740,'Erode,Perundurai,Thindal'),(6741,'Erode,Erode,Railway,Colony'),(6742,'Erode,Kanjikovil'),(6743,'Erode,Marapalam,Erode,East'),(6744,'Erode,Erode,Fort,Erode,East'),(6745,'Erode,Teachers,Colony,Erode,Collectorate'),(6746,'Chithode,Chittode'),(6747,'Erode,Chidambaram,Erode,East'),(6748,'Erode,Erode,Fort,Erode,East'),(6749,'Erode,Chettipalayam,Erode,Railway,Colony'),(6750,'Erode,Avadi,Erode,Railway,Colony'),(6751,'Erode,Perundurai,Kavindapadi,Kalichettipalayam.,Mettupalayam'),(6752,'Erode,Vijayapuri,Kambiliyampatti'),(6753,'Erode,Erode,Fort,Erode,East'),(6754,'Erode,Perundurai,Thindal'),(6755,'Komarapalayam,Adiyur,Kuttapalayam'),(6756,'Erode,Surampatti,Pallipalayam'),(6757,'Perundurai,Sathyamangalam,Thuduppathi,Palakarai'),(6758,'Erode,Erode,Collectorate'),(6759,'Erode,Erode,Railway,Colony'),(6760,'Erode,Thindal,Thindal'),(6761,'Erode,Karungalpalayam'),(6762,'Karungalpalayam,Karungalpalayam'),(6763,'Erode,Karungalpalayam'),(6764,'Erode,Moolapalayam,Erode,Railway,Colony'),(6765,'Erode,Erode,Fort,Erode,East'),(6766,'Erode,Erode,East'),(6767,'Erode,Erode,Railway,Colony'),(6768,'Erode,Erode,East'),(6769,'Erode,Thindal,Thindal'),(6770,'Erode,Moolapalayam,Erode,Railway,Colony'),(6771,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(6772,'Erode,Nasiyanur,Anur,Kaikatti,Kadirampatti'),(6773,'Erode,Erode,Fort,Erode,East'),(6774,'Erode,Kanagapuram'),(6775,'Erode,Karungalpalayam'),(6776,'Erode,Pallipalayam'),(6777,'Erode,Periyar,Nagar,Edayankattuvalsu'),(6778,'Erode,Kavindapadi,Vasavi,College'),(6779,'Erode,Edayankattuvalsu'),(6780,'Erode,Thindal'),(6781,'Erode,Erode,Fort,Erode,Collectorate'),(6782,'Erode,Erode,Fort,Erode,East'),(6783,'Erode,Agalaraipalayam,Araipalayam,Uppupalayam'),(6784,'Iruppu,Kallampalayam,Road'),(6785,'Erode,Palayapalayam,Erode,Collectorate'),(6786,'Erode,Edayankattuvalsu'),(6787,'Erode,Karungalpalayam'),(6788,'Erode,Edayankattuvalsu'),(6789,'Thindal,Thindal'),(6790,'Erode,Karungalpalayam'),(6791,'Perundurai,'),(6792,'Erode,Edayankattuvalsu'),(6793,'Erode,Moolapalayam,Erode,Railway,Colony'),(6794,'Erode,Edayankattuvalsu'),(6795,'Erode,Chikkaiah,Naicker,College'),(6796,'Erode,Gobichettipalayam,Attur,Chettipalayam,Kadukkampalayam'),(6797,'Chithode,Chittode'),(6798,'Erode,Erode,Collectorate'),(6799,'Erode,Chidambaram,Erode,East'),(6800,'Erode,Kavandapadi,Kalichettipalayam.,Mettupalayam'),(6801,'Erode,Kavandapadi,Kalichettipalayam.,Mettupalayam'),(6802,'Erode,Pudur,Erode,Railway,Colony'),(6803,'Karukkampalayam,Karukkampalayam'),(6804,'Erode,Erode,East'),(6805,'Erode,Kasipalayam,Edayankattuvalsu'),(6806,'Erode,Edayankattuvalsu'),(6807,'Erode,Periyar,Nagar,Erode,East'),(6808,'Erode,Perode,Chittode'),(6809,'Erode,Chikkaiah,Naicker,College'),(6810,'Erode,Erode,Fort,Erode,East'),(6811,'Erode,Erode,Collectorate'),(6812,'Erode,Erode,Fort,Erode,East'),(6813,'Erode,Surampatti,Edayankattuvalsu'),(6814,'Erode,Edayankattuvalsu'),(6815,'Erode,Erode,Collectorate'),(6816,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(6817,'Erode,Ammapettai'),(6818,'Erode,Erode,Fort,Erode,East'),(6819,'Agraharam,Komarapalayam,Kallankattuvalasu'),(6820,'Erode,Voc,Park,Karungalpalayam'),(6821,'Bhavani,Kali,Vasavi,College'),(6822,'Erode,Periyar,Nagar,Erode,East'),(6823,'Erode,Eral,Edayankattuvalsu'),(6824,'Erode,Karungalpalayam'),(6825,'Erode,Soolai,Chikkaiah,Naicker,College'),(6826,'Chikkaiah,Naicker,College,Chikkaiah,Naicker,College'),(6827,'Erode,Erode,East'),(6828,'Ennai,Kodambakkam'),(6829,'Erode,Chidambaram,Erode,East'),(6830,'Jawahar,Mills,Jawahar,Mills'),(6831,'Erode,Palayapalayam,Erode,Collectorate'),(6832,'Erode,Moolapalayam,Erode,Railway,Colony'),(6833,'Erode,Chittode'),(6834,'Erode,Kanai,Arakkankottai'),(6835,'Erode,Marapalam,Erode,East'),(6836,'Erode,Solar,Arur,Karur,Erode,Railway,Colony'),(6837,'Erode,Edayankattuvalsu'),(6838,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(6839,'Erode,Erode,Collectorate'),(6840,'Erode,Erode,East'),(6841,'Erode,Thirunagar,Colony,Amoor,Karungalpalayam'),(6842,'Erode,Nanjaiuthukuli,Elumathur'),(6843,'Erode,Erode,East'),(6844,'Erode,Erode,East'),(6845,'Erode,Erode,Fort,Karungalpalayam'),(6846,'Erode,Sampath,Nagar,Erode,Collectorate'),(6847,'Erode,Chennimalai,Edayankattuvalsu'),(6848,'Erode,Sampath,Nagar,Erode,Collectorate'),(6849,'Erode,Karungalpalayam'),(6850,'Erode,Emur,Chikkaiah,Naicker,College'),(6851,'Erode,Soolai,Chikkaiah,Naicker,College'),(6852,'Erode,Solar,Erode,Railway,Colony'),(6853,'Erode,Nasiyanur,Anur,Kadirampatti'),(6854,'Erode,Karungalpalayam'),(6855,'Erode,Erode,Fort,Erode,East'),(6856,'Erode,Marapalam,Erode,Railway,Colony'),(6857,'Erode,Nasiyanur,Anur,Kadirampatti'),(6858,'Erode,Emur,Chikkaiah,Naicker,College'),(6859,'Erode,Seerampalayam'),(6860,'Erode,Pudur,Amaravathi,Nagar,Peria,Agraharam'),(6861,'Erode,Perundurai,Erode,Collectorate'),(6862,'Erode,Pappampalayam'),(6863,'Erode,Voc,Park,Karungalpalayam'),(6864,'Erode,Periyar,Nagar,Erode,East'),(6865,'Chithode,Erode,Gangapuram,Chittode'),(6866,'Erode,Erode,Fort,Erode,East'),(6867,'Erode,Ingur,Ingur'),(6868,'Erode,Erode,Fort,Karungalpalayam'),(6869,'Erode,Edayankattuvalsu'),(6870,'Erode,Perundurai,Kadirampatti'),(6871,'Erode,Erode,East'),(6872,'Erode,Thindal,Thindal'),(6873,'Perundurai,Athur,Ingur'),(6874,'Erode,Perundurai,Ingur'),(6875,'Pudur,Sivagiri,Ammankoil'),(6876,'Erode,Erode,East'),(6877,'Erode,Chettipalayam,Erode,Railway,Colony'),(6878,'Kadirampatti,Kadirampatti'),(6879,'Erode,Periyar,Nagar,Edayankattuvalsu'),(6880,'Erode,Erode,East'),(6881,'Edayankattuvalsu,Edayankattuvalsu'),(6882,'Erode,Erode,East'),(6883,'Erode,Erode,Fort,Erode,East'),(6884,'Erode,Perundurai,Erode,Collectorate'),(6885,'Erode,Karungalpalayam'),(6886,'Vallipurathanpalayam,Karumal,Karumalai,Kanagapuram'),(6887,'Bhavani,Bhavani,Kudal'),(6888,'Erode,Karungalpalayam'),(6889,'Erode,Kanagapuram'),(6890,'Erode,Erode,East'),(6891,'Nallur,Allur,Chennai,Nanganallur,Bazaar'),(6892,'Erode,Erode,East'),(6893,'Erode,Moolapalayam,Erode,Railway,Colony'),(6894,'Pallipalayam,Pallipalayam'),(6895,'Erode,Moolapalayam,Nadarmedu,Erode,Railway,Colony'),(6896,'Erode,Chikkaiah,Naicker,College'),(6897,'Erode,Thirunagar,Colony,Gandhipuram,Karungalpalayam'),(6898,'Bhavani,Kali,Bhavani,Kudal'),(6899,'Erode,Kollampalayam,Arur,Karur,Erode,Railway,Colony'),(6900,'Erode,Erode,East'),(6901,'Erode,Erode,East'),(6902,'Erode,Solar,Arur,Karur,Erode,Railway,Colony'),(6903,'Erode,Erode,Collectorate'),(6904,'Komarapalayam,Kallankattuvalasu'),(6905,'Erode,Karungalpalayam'),(6906,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(6907,'Erode,Erode,East'),(6908,'Erode,Nadarmedu,Erode,Railway,Colony'),(6909,'Erode,Erode,Fort,Erode,East'),(6910,'Erode,Karungalpalayam'),(6911,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(6912,'Erode,Erode,East'),(6913,'Erode,Surampatti,Erode,East'),(6914,'Erode,Erode,Collectorate'),(6915,'Erode,Erode,Fort,Erode,East'),(6916,'Erode,Erode,East'),(6917,'Erode,Erode,East'),(6918,'Erode,Rangampalayam,Chennimalai,Edayankattuvalsu'),(6919,'Veerappanchatram,Chikkaiah,Naicker,College'),(6920,'Erode,Chidambaram,Erode,East'),(6921,'Erode,Muncipal,Colony,Veerappanchatram,Karungalpalayam'),(6922,'Erode,Teachers,Colony,Edayankattuvalsu'),(6923,'Chithode,Erode,Chittode'),(6924,'Erode,Thirunagar,Colony,Karungalpalayam'),(6925,'Perundurai,Chennimalai,Ingur'),(6926,'Erode,Erode,East'),(6927,'Erode,Erode,Fort,Erode,East'),(6928,'Erode,Chennimalai,Edayankattuvalsu'),(6929,'Komarapalayam,Kallankattuvalasu'),(6930,'Erode,Manickampalayam,Erode,Collectorate'),(6931,'Erode,Teachers,Colony,Erode,Collectorate'),(6932,'Erode,Ellapalayam,Chikkaiah,Naicker,College'),(6933,'Erode,Chikkaiah,Naicker,College'),(6934,'Erode,Pudur,Solar,Erode,Railway,Colony'),(6935,'Erode,Erode,Collectorate'),(6936,'Erode,Periyar,Nagar,Erode,East'),(6937,'Erode,Erode,Collectorate'),(6938,'Erode,Perundurai,Thindal'),(6939,'Nadarmedu,Erode,Railway,Colony'),(6940,'Erode,Sampath,Nagar,Erode,Collectorate'),(6941,'Erode,Erode,East'),(6942,'Erode,Perundurai,Ambattur,Attur,Thindal'),(6943,'Chettipatti,Chettipatti'),(6944,'Iruppu,Karuvampalayam'),(6945,'Erode,Sampath,Nagar,Erode,Collectorate'),(6946,'Perundurai,Ingur'),(6947,'Erode,Solar,Arur,Karur,Erode,Railway,Colony'),(6948,'Erode,Erode,Collectorate'),(6949,'Kollampalayam,Erode,Railway,Colony'),(6950,'Erode,Moolapalayam,Erode,Railway,Colony'),(6951,'Erode,Thindal,Thindal'),(6952,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(6953,'Erode,Erode,East'),(6954,'Erode,Erode,Fort,Erode,East'),(6955,'Erode,Soolai,Chikkaiah,Naicker,College'),(6956,'Erode,Periya,Valasu,Chikkaiah,Naicker,College'),(6957,'Erode,Periyar,Nagar,Erode,East'),(6958,'Erode,Thindal,Thindal'),(6959,'Erode,Chikkaiah,Naicker,College'),(6960,'Erode,Solar,Erode,Railway,Colony'),(6961,'Erode,Erode,East'),(6962,'Erode,Edayankattuvalsu'),(6963,'Erode,Perundurai,Kadirampatti'),(6964,'Erode,Erode,Collectorate'),(6965,'Erode,Gandhipuram,Erode,Railway,Colony'),(6966,'Erode,Erode,East'),(6967,'Erode,Chidambaram,Erode,East'),(6968,'Erode,Sampath,Nagar,Chikkaiah,Naicker,College'),(6969,'Erode,Chikkaiah,Naicker,College'),(6970,'Erode,Erode,Fort,Karungalpalayam'),(6971,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(6972,'Erode,Kasipalayam,Surampatti,Edayankattuvalsu'),(6973,'Erode,Perundurai,Ingur'),(6974,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(6975,'Erode,Perundurai,Thindal'),(6976,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(6977,'Erode,Soolai,Karumal,Karumalai,Chikkaiah,Naicker,College'),(6978,'Avalpoondurai,Erode,Avalpundurai'),(6979,'Erode,Erode,Fort,Erode,East'),(6980,'Erode,Perundurai,Ingur'),(6981,'Erode,Erode,Collectorate'),(6982,'Agraharam,Erode,Peria,Agraharam'),(6983,'Erode,Thindal,Thindal'),(6984,'Erode,Chennimalai,Edayankattuvalsu'),(6985,'Erode,Thindal,Thindal'),(6986,'Erode,Erode,Collectorate'),(6987,'Erode,Gobichettipalayam,Kullampalayam,Chettipalayam,Kadukkampalayam'),(6988,'Erode,Erode,Fort,Erode,East'),(6989,'Erode,Sampath,Nagar,Erode,Collectorate'),(6990,'Erode,Pudur,Amaravathi,Nagar,Peria,Agraharam'),(6991,'Erode,Lakkapuram,Pudur,Erode,Railway,Colony'),(6992,'Erode,Appakudal'),(6993,'Erode,Nadarmedu,Erode,Railway,Colony'),(6994,'Erode,Erode,Collectorate'),(6995,'Erode,Karungalpalayam'),(6996,'Erode,Perundurai,Thindal'),(6997,'Erode,Surampatti,Edayankattuvalsu'),(6998,'Erode,Chettipalayam,Erode,Railway,Colony'),(6999,'Erode,Karungalpalayam,Arungal,Karai,Karungalpalayam'),(7000,'Erode,Erode,Collectorate'),(7001,'Erode,Thindal'),(7002,'Attayampatti,Attayampatti'),(7003,'Erode,Collectorate,Erode,Collectorate'),(7004,'Erode,Railway,Colony,Erode,Railway,Colony'),(7005,'Erode,Nadarmedu,Erode,Railway,Colony'),(7006,'Thindal,Thindal'),(7007,'Erode,Perundurai,Erode,Collectorate'),(7008,'Erode,Erode,Fort,Karungalpalayam'),(7009,'Erode,Erode,Collectorate'),(7010,'Erode,Surampatti,Karungalpalayam'),(7011,'Komarapalayam,Alampalayam,Seerampalayam'),(7012,'Erode,Erode,Fort,Erode,East'),(7013,'Bhavani,Erode,Chikkaiah,Naicker,College'),(7014,'Perundurai,Ingur'),(7015,'Erode,Erode,Fort,Karungalpalayam'),(7016,'Erode,Karungalpalayam'),(7017,'Erode,Ganapathi,Nagar,Thindal'),(7018,'Erode,Erode,Collectorate'),(7019,'Erode,Erode,Fort,Erode,East'),(7020,'Erode,Perundurai,Ingur'),(7021,'Erode,Edayankattuvalsu'),(7022,'Erode,Moolapalayam,Arur,Karur,Erode,Railway,Colony'),(7023,'Erode,Teachers,Colony,Thindal,Erode,Collectorate'),(7024,'Erode,Erode,East'),(7025,'Erode,Erode,Fort,Erode,East'),(7026,'Erode,Edayankattuvalsu'),(7027,'Erode,Chikkaiah,Naicker,College'),(7028,'Erode,Erode,East'),(7029,'Erode,Soolai,Chikkaiah,Naicker,College'),(7030,'Erode,Erode,Fort,Erode,East'),(7031,'Erode,Thindal,Thindal'),(7032,'Erode,Palayapalayam,Erode,Collectorate'),(7033,'Erode,Lakkapuram,Erode,Railway,Colony'),(7034,'Erode,Erode,Fort,Erode,East'),(7035,'Erode,Erode,East'),(7036,'Erode,Perundurai,Thindal,Kadirampatti'),(7037,'Erode,Erode,Collectorate'),(7038,'Erode,Chettipalayam,Erode,Railway,Colony'),(7039,'Erode,Perundurai,Thindal'),(7040,'Erode,Perundurai,Ingur'),(7041,'Erode,Moolapalayam,Arur,Karur,Erode,Railway,Colony'),(7042,'Erode,Muncipal,Colony,Veerappanchatram,Karungalpalayam'),(7043,'Erode,Thindal,Thindal'),(7044,'Erode,Erode,East'),(7045,'Erode,Muncipal,Colony,Karungalpalayam'),(7046,'Erode,Chikkaiah,Naicker,College'),(7047,'Ennai,Greams,Road'),(7048,'Erode,Muncipal,Colony,Karungalpalayam'),(7049,'Erode,Erode,East'),(7050,'Ennai,Koyambedu,Wholesale,Market,Com'),(7051,'Erode,Karungalpalayam'),(7052,'Kangayam,Anaipalayam'),(7053,'Erode,Elumathur'),(7054,'Erode,Nasiyanur,Anur,Kadirampatti'),(7055,'Erode,Moolapalayam,Erode,Railway,Colony'),(7056,'Erode,Arur,Karur,Erode,Railway,Colony'),(7057,'Erode,Muncipal,Colony,Karungalpalayam'),(7058,'Ennai,Erukkancheri'),(7059,'Erode,Palayapalayam,Thindal'),(7060,'Erode,Palayapalayam,Perundurai,Teachers,Colony,Erode,Collectorate'),(7061,'Erode,Erode,East'),(7062,'Komarapalayam,Kallankattuvalasu'),(7063,'Erode,Erode,Railway,Colony'),(7064,'Nasiyanur,Anur,Kadirampatti'),(7065,'Erode,Gangapuram,Chittode'),(7066,'Dharmapuri,Public,Offices,Dharmapuri,Public,Offices'),(7067,'Erode,Perundurai,Erode,Collectorate'),(7068,'Adamangalam,Chennai,Melakkottaiyur'),(7069,'Erode,Karungalpalayam'),(7070,'Attur,Kattur,Devagoundanur'),(7071,'Erode,Erode,East'),(7072,'Erode,Periyar,Nagar,Erode,East'),(7073,'Erode,Elumathur'),(7074,'Annadanapatti,Annadanapatti'),(7075,'Devagoundanur,Devagoundanur'),(7076,'Erode,Karungalpalayam'),(7077,'Ennai,Thiruvidanthai'),(7078,'Kodumudi,Sivagiri,Ammankoil'),(7079,'Arcot,Chennai,Gramam,Saligramam'),(7080,'Erode,Marapalam,Erode,East'),(7081,'Erode,Thindal,Thindal'),(7082,'Guttapatti,Guttapatti'),(7083,'Erode,Tiruchengodu,North'),(7084,'Erode,Periya,Valasu,Chikkaiah,Naicker,College'),(7085,'Bhavani,Erode,Peria,Agraharam'),(7086,'Coimbatore,R.S.Puram,East'),(7087,'Erode,Thirunagar,Colony,Karungalpalayam'),(7088,'Erode,Erode,Collectorate'),(7089,'Erode,Erode,East'),(7090,'Erode,Nasiyanur,Sampath,Nagar,Anur,Erode,Collectorate'),(7091,'Erode,Erode,East'),(7092,'46,Pudur,Erode,Pudur,Erode,Railway,Colony'),(7093,'Talguni,Talguni'),(7094,'Erode,Chidambaram,Edayankattuvalsu'),(7095,'Bhavani,Erode,Oricheri,Pudur,Appakudal'),(7096,'Erode,Emur,Chikkaiah,Naicker,College'),(7097,'Nanjaiuthukuli,Elumathur'),(7098,'Erode,Palayapalayam,Erode,Collectorate'),(7099,'Erode,Erode,East'),(7100,'Erode,Erode,East'),(7101,'Athur,Chinniyampalayam,Coimbatore,Mylampatti'),(7102,'Erode,Erode,Fort,Erode,East'),(7103,'Erode,Erode,East'),(7104,'Erode,Erode,East'),(7105,'Erode,Kokkarayanpettai,Kalpalayam,Erode,Railway,Colony'),(7106,'Erode,Erode,Fort,Erode,East'),(7107,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(7108,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(7109,'Erode,Thindal'),(7110,'Erode,Chikkaiah,Naicker,College'),(7111,'Erode,Thindal,Thindal'),(7112,'Erode,Arasampatti,Thindal'),(7113,'Komarapalayam,Kallankattuvalasu'),(7114,'Erode,Avalpundurai'),(7115,'Erode,Erode,East'),(7116,'Erode,Chikkaiah,Naicker,College'),(7117,'Erode,Sampath,Nagar,Erode,Collectorate'),(7118,'Erode,Erode,East'),(7119,'Chithode,Erode,Perode,Kanji,Kanjikovil,Chittode'),(7120,'Erode,Gandhipuram,Karungalpalayam'),(7121,'Erode,Erode,Collectorate'),(7122,'Erode,Moolapalayam,Erode,Railway,Colony'),(7123,'Sathyamangalam,Bannari,Chikkarasampalayam'),(7124,'Erode,Solar,Arachi,Erode,Railway,Colony'),(7125,'Erode,Kokkarayanpettai,Pappampalayam,Pappampalayam'),(7126,'Erode,Arasampatti,Kaikatti,Kadirampatti'),(7127,'Erode,Gandhipuram,Karungalpalayam'),(7128,'Bhavani,Erode,Surampatti,Bhavani,Kudal'),(7129,'Arachalur,Vadamugam,Vellode,Kanagapuram'),(7130,'Erode,Erode,Fort,Erode,East'),(7131,'Alampalayam,Spb,Colony'),(7132,'Veerappanchatram,Chikkaiah,Naicker,College'),(7133,'Erode,Kavilipalayam'),(7134,'Erode,Basuvapatti'),(7135,'Annupapatti,Annupapatti'),(7136,'Erode,Perundurai,Ingur'),(7137,'Erode,Soolai,Emur,Chikkaiah,Naicker,College'),(7138,'Kadirampatti,Kadirampatti'),(7139,'Erode,Perundurai,Erode,Collectorate'),(7140,'Erode,Erode,Fort,Erode,East'),(7141,'Erode,Chikkaiah,Naicker,College'),(7142,'Erode,Periyar,Nagar,Chennimalai,Erode,East'),(7143,'Erode,Nasiyanur,Anur,Thindal'),(7144,'Erode,Marapalam,Surampatti,Erode,East'),(7145,'Erode,Voc,Park,Karungalpalayam'),(7146,'Erode,Surampatti,Eral,Erode,East'),(7147,'Erode,Erode,East'),(7148,'Erode,Erode,Fort,Erode,East'),(7149,'Erode,Vijayapuri,Kambiliyampatti'),(7150,'Chithode,Erode,Chittode'),(7151,'Nallur,Allur,Kadachanallur,Seerampalayam'),(7152,'Erode,Erode,Collectorate'),(7153,'Erode,Kollampalayam,Moolapalayam,Erode,Railway,Colony'),(7154,'Erode,Arimalam,Erode,East'),(7155,'Erode,Voc,Park,Karungalpalayam'),(7156,'Erode,Thirunagar,Colony,Karungalpalayam'),(7157,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(7158,'Erode,Erode,Railway,Colony'),(7159,'Erode,Erode,Fort,Erode,East'),(7160,'Erode,Thindal,Thindal'),(7161,'Erode,Marapalam,Erode,East'),(7162,'Erode,Chidambaram,Erode,East'),(7163,'Erode,Perundurai,Thindal,Thindal'),(7164,'Erode,Erode,East'),(7165,'Erode,Peria,Agraharam'),(7166,'Erode,Surampatti,Erode,East'),(7167,'Erode,Chikkaiah,Naicker,College'),(7168,'Erode,Perundurai,Thindal,Thindal'),(7169,'Erode,Edayankattuvalsu'),(7170,'Erode,Erode,East'),(7171,'Erode,Erode,East'),(7172,'Erode,Muncipal,Colony,Karungalpalayam'),(7173,'Erode,Perundurai,Erode,Collectorate'),(7174,'Kurichi,Coimbatore,Darapuram,Sundarapuram'),(7175,'Iruppu,Kallampalayam,Road'),(7176,'Kuttapalayam,Kuttapalayam'),(7177,'Erode,Erode,East'),(7178,'Erode,Surampatti,Erode,East'),(7179,'Iruppu,Kali,Alagumalai'),(7180,'Bhavani,Erode,Bhavani,Kudal'),(7181,'Bhavani,Kali,Kamaraj,Nagar,Bhavani,Kudal'),(7182,'Koorapalayam,Perundurai,Ingur'),(7183,'Erode,Erode,Collectorate'),(7184,'Erode,Muncipal,Colony,Veerappanchatram,Erode,Collectorate'),(7185,'Bhavani,Erode,Perundurai,Ingur'),(7186,'Erode,Suriyampalayam,Vasavi,College'),(7187,'Erode,Erode,Collectorate'),(7188,'Iruppu,15,Velampalayam'),(7189,'Bhavani,Erode,Chikkaiah,Naicker,College'),(7190,'Erode,Palayapalayam,Erode,Collectorate'),(7191,'Erode,Erode,Fort,Erode,East'),(7192,'Erode,Sampath,Nagar,Erode,Collectorate'),(7193,'Erode,Perundurai,Thindal,Thindal'),(7194,'63,Velampalayam,63,Velampalayam'),(7195,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(7196,'Erode,Palayapalayam,Erode,Collectorate'),(7197,'Erode,Perundurai,Erode,Collectorate'),(7198,'Coimbatore,Ganapathy,Chinnavedampatti'),(7199,'Erode,Surampatti,Edayankattuvalsu'),(7200,'Erode,Erode,East'),(7201,'Erode,Erode,Collectorate'),(7202,'Erode,Erode,East'),(7203,'Chithode,Erode,Gangapuram,Nasiyanur,Anur,Chittode'),(7204,'Pudur,Kaniyur,Karumathampatti'),(7205,'Coimbatore,Ganapathy'),(7206,'Erode,Erode,East'),(7207,'Erode,Erode,Collectorate'),(7208,'Erode,Perundurai,Erode,Collectorate'),(7209,'Erode,Surampatti,Erode,East'),(7210,'Erode,Soolai,Karumal,Chikkaiah,Naicker,College'),(7211,'Erode,Kadirampatti'),(7212,'Erode,Erode,Fort,Erode,East'),(7213,'Erode,Moolapalayam,Erode,Railway,Colony'),(7214,'Erode,Moolapalayam,Erode,Railway,Colony'),(7215,'Edayankattuvalsu,Edayankattuvalsu'),(7216,'Erode,Erode,Collectorate'),(7217,'Erode,Erode,East'),(7218,'Erode,Kalpalayam,Erode,Railway,Colony'),(7219,'Erode,Perundurai,Kanji,Ingur'),(7220,'Perundurai,Attur,Kattur,Ingur'),(7221,'Erode,Arasampatti,Kadirampatti'),(7222,'Erode,Erode,Fort,Erode,East'),(7223,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(7224,'Erode,Perundurai,Ambal,Erode,Collectorate'),(7225,'Erode,Periyar,Nagar,Erode,East'),(7226,'Erode,Chettipalayam,Erode,Railway,Colony'),(7227,'Erode,Periyar,Nagar,Edayankattuvalsu'),(7228,'Erode,Chidambaram,Edayankattuvalsu'),(7229,'Erode,Chikkaiah,Naicker,College'),(7230,'Erode,Chikkaiah,Naicker,College'),(7231,'Erode,Erode,East'),(7232,'Devagoundanur,Devagoundanur'),(7233,'Erode,Railway,Colony,Erode,Railway,Colony'),(7234,'Erode,Soolai,Chikkaiah,Naicker,College'),(7235,'Sathyamangalam,Chikkaiah,Naicker,College'),(7236,'Bhavani,Bhavani,Kudal'),(7237,'Erode,Voc,Park,Karungalpalayam'),(7238,'Pallipalayam,Pallipalayam'),(7239,'Erode,Kadirampatti'),(7240,'Erode,Kanagapuram'),(7241,'Karungalpalayam,Karungalpalayam'),(7242,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(7243,'Erode,Perundurai,Thindal'),(7244,'Erode,Thindal'),(7245,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(7246,'Erode,Erode,Collectorate'),(7247,'Erode,Erode,East'),(7248,'Erode,Perundurai,Erode,Collectorate'),(7249,'Erode,Erode,East'),(7250,'Pallipalayam,Pallipalayam'),(7251,'Erode,Muncipal,Colony,Veerappanchatram,Chikkaiah,Naicker,College'),(7252,'Erode,Erode,Fort,Erode,East'),(7253,'Erode,Surampatti,Erode,Collectorate'),(7254,'Erode,Nasiyanur,Sampath,Nagar,Anur,Erode,Collectorate'),(7255,'Erode,Erode,East'),(7256,'Erode,Sampath,Nagar,Erode,Collectorate'),(7257,'Erode,Chennimalai,Erode,East'),(7258,'Erode,Palayapalayam,Erode,Collectorate'),(7259,'Erode,Karungalpalayam'),(7260,'Erode,Komarapalayam,Seerampalayam'),(7261,'Erode,Erode,Fort,Erode,Collectorate'),(7262,'Erode,Arasampatti,Chikkaiah,Naicker,College'),(7263,'Chithode,Chittode'),(7264,'Erode,Karungalpalayam'),(7265,'Ariyur,Ariyur'),(7266,'Erode,Erode,Fort,Erode,East'),(7267,'Erode,Erode,Fort,Erode,East'),(7268,'Anthiyur,Alampalayam'),(7269,'Thindal,Thindal'),(7270,'Erode,Erode,Railway,Colony'),(7271,'Erode,Periyar,Nagar,Erode,East'),(7272,'Erode,Erode,Collectorate'),(7273,'Erode,Periyar,Nagar,Erode,East'),(7274,'Erode,Surampatti,Edayankattuvalsu'),(7275,'Erode,Karungalpalayam'),(7276,'Pallipalayam,Pallipalayam'),(7277,'Erode,Marapalam,Erode,East'),(7278,'Erode,Thingalur,Palakarai'),(7279,'Erode,Erode,Collectorate'),(7280,'Erode,Periyar,Nagar,Erode,East'),(7281,'Erode,Vairapalayam,Karai,Karungalpalayam'),(7282,'Erode,Kannadipalayam'),(7283,'Erode,Koottapalli'),(7284,'Erode,Veerappanchatram,Erode,Collectorate'),(7285,'Erode,Perundurai,Erode,Collectorate'),(7286,'Erode,Chikkaiah,Naicker,College'),(7287,'Erode,Edayankattuvalsu'),(7288,'Perundurai,Ingur'),(7289,'Erode,Moolapalayam,Erode,Railway,Colony'),(7290,'Erode,Erode,Fort,Erode,East'),(7291,'Erode,Railway,Colony,Erode,Railway,Colony'),(7292,'Erode,Erode,East'),(7293,'Erode,Erode,Collectorate'),(7294,'Erode,Erode,Collectorate'),(7295,'Erode,Erode,East'),(7296,'Erode,Periya,Valasu,Chikkaiah,Naicker,College'),(7297,'Erode,Karungalpalayam'),(7298,'Bhavani,Chithode,Chittode'),(7299,'Erode,Kollampalayam,Arur,Karur,Erode,Railway,Colony'),(7300,'Erode,Lakkapuram,Erode,Railway,Colony'),(7301,'Chithode,Erode,Perode,Chittode'),(7302,'Erode,Nasiyanur,Anur,Thindal'),(7303,'Erode,Erode,Fort,Erode,East'),(7304,'Erode,Sampath,Nagar,Erode,Collectorate'),(7305,'Erode,Kathirampatti,Perundurai,Kadirampatti'),(7306,'Perundurai,Ingur'),(7307,'Erode,Chikkaiah,Naicker,College'),(7308,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(7309,'Erode,Erode,Fort,Erode,East'),(7310,'Perundurai,Ingur'),(7311,'Elumathur,Mathur,Athur,Elumathur'),(7312,'Erode,Marapalam,Isur,Erode,East'),(7313,'Erode,Erode,East'),(7314,'Erode,Thindal'),(7315,'Erode,Erode,East'),(7316,'Ottapparai,Chennimalai,Basuvapatti'),(7317,'Perundurai,Thindal,Thindal'),(7318,'Erode,Edayankattuvalsu'),(7319,'Erode,Moolapalayam,Erode,Railway,Colony'),(7320,'Erode,Erode,Fort,Erode,East'),(7321,'Anaipalayam,Anaipalayam'),(7322,'Ambodi,Ambodi'),(7323,'Komarapalayam,Kammavarpalayam,Kallankattuvalasu'),(7324,'Erode,Erode,Fort,Erode,East'),(7325,'Erode,Lakkapuram,Erode,Railway,Colony'),(7326,'Devanankurichi,Devanankurichi'),(7327,'Erode,Erode,East'),(7328,'Erode,Periyar,Nagar,Erode,East'),(7329,'Erode,Teachers,Colony,Edayankattuvalsu'),(7330,'Bhavani,Erode,Kali,Kavindapadi,Bhavani,Kudal'),(7331,'Erode,Chikkaiah,Naicker,College'),(7332,'Erode,Marapalam,Erode,East'),(7333,'Erode,Teachers,Colony,Erode,Collectorate'),(7334,'Erode,Thindal,Thindal'),(7335,'Erode,Thindal'),(7336,'Erode,Erode,East'),(7337,'Karungalpalayam,Amoor,Arungal,Karungalpalayam'),(7338,'Erode,Chikkaiah,Naicker,College'),(7339,'Erode,Edayankattuvalsu'),(7340,'Erode,Perundurai,Thindal'),(7341,'Bhavani,Bhavani,Kudal'),(7342,'Erode,Erode,East'),(7343,'Anthiyur,Erode,Alampalayam'),(7344,'Erode,Edayankattuvalsu'),(7345,'Erode,Perundurai,Erode,Collectorate'),(7346,'Erode,Thirunagar,Colony,Karungalpalayam'),(7347,'Bhavani,Mettunasuvanpalayam,Vasavi,College'),(7348,'Erode,Muncipal,Colony,Erode,East'),(7349,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(7350,'Erode,Solar,Erode,Railway,Colony'),(7351,'Erode,Periya,Valasu,Veerappanchatram,Chikkaiah,Naicker,College'),(7352,'Erode,Erode,Railway,Colony'),(7353,'Erode,Erode,Fort,Erode,East'),(7354,'Erode,Erode,Fort,Erode,East'),(7355,'Komarapalayam,Kallankattuvalasu'),(7356,'Erode,Chikkaiah,Naicker,College'),(7357,'Erode,Erode,Fort,Erode,East'),(7358,'Erode,Kollampalayam,Arur,Karur,Erode,Railway,Colony'),(7359,'Avalpoondurai,Erode,Kamaraj,Nagar,Erode,Railway,Colony'),(7360,'Bhavani,Vasavi,College'),(7361,'Coimbatore,Pannimadai'),(7362,'Erode,Nallur,Nasiyanur,Allur,Anur,Thindal'),(7363,'Bhavani,Erode,Erode,Fort,Ichipalayam,Ammapettai'),(7364,'Erode,Erode,East'),(7365,'Erode,Sampath,Nagar,Erode,Collectorate'),(7366,'Erode,Sampath,Nagar,Erode,Collectorate'),(7367,'Erode,Chittode'),(7368,'Erode,Moolapalayam,Erode,Railway,Colony'),(7369,'Erode,Erode,Fort,Erode,East'),(7370,'Erode,Erode,Fort,Erode,East'),(7371,'Erode,Erode,East'),(7372,'Pudur,Chinthamani,Chinthamanipudur,Coimbatore,Athappagoundenpudur'),(7373,'Erode,Gobichettipalayam,Chettipalayam,Gobichettipalayam'),(7374,'Erode,Palayapalayam,Perundurai,Thindal'),(7375,'Erode,Erode,Fort,Erode,East'),(7376,'Attur,Elachipalayam'),(7377,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(7378,'Erode,Chikkaiah,Naicker,College'),(7379,'Erode,Karungalpalayam'),(7380,'Erode,Kollampalayam,Erode,Railway,Colony'),(7381,'Erode,Perundurai,Thindal,Asur,Thindal'),(7382,'Erode,Tiruchengodu,North'),(7383,'Erode,Erode,Fort,Erode,East'),(7384,'Erode,Thindal'),(7385,'Erode,Sampath,Nagar,Erode,Collectorate'),(7386,'Bhavani,Erode,Thirunagar,Colony,Karungalpalayam'),(7387,'Erode,Erode,East'),(7388,'Erode,Thindal'),(7389,'Erode,Chittode'),(7390,'Erode,Periya,Valasu,Chikkaiah,Naicker,College'),(7391,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(7392,'Erode,Erode,Fort,Erode,East'),(7393,'Erode,Chidambaram,Erode,East'),(7394,'Erode,Edayankattuvalsu'),(7395,'Erode,Edayankattuvalsu'),(7396,'Erode,Moolapalayam,Nadarmedu,Erode,Railway,Colony'),(7397,'Erode,Erode,Railway,Colony'),(7398,'Erode,Erode,Fort,Erode,Collectorate'),(7399,'Komarapalayam,Kallankattuvalasu'),(7400,'Erode,Soolai,Emur,Chikkaiah,Naicker,College'),(7401,'Erode,Kumalankutti,Erode,Collectorate'),(7402,'Devanankurichi,Devanankurichi'),(7403,'Erode,Kadirampatti'),(7404,'Erode,Emur,Chikkaiah,Naicker,College'),(7405,'Erode,Moolapalayam,Erode,Railway,Colony'),(7406,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(7407,'Erode,Erode,Collectorate'),(7408,'Erode,Sampath,Nagar,Erode,Collectorate'),(7409,'Erode,Erode,East'),(7410,'Erode,Karungalpalayam'),(7411,'Devanankurichi,Devanankurichi'),(7412,'Erode,Teachers,Colony,Erode,Collectorate'),(7413,'Erode,Moolapalayam,Erode,Railway,Colony'),(7414,'Erode,Erode,Collectorate'),(7415,'Erode,Erode,Collectorate'),(7416,'Chinnamalai,Erode,Moolapalayam,Erode,Railway,Colony'),(7417,'Thindal,Thindal'),(7418,'Erode,Erode,Collectorate'),(7419,'Erode,Karungalpalayam'),(7420,'Erode,Marapalam,Surampatti,Erode,East'),(7421,'Erode,Thindal,Thindal'),(7422,'Karungalpalayam,Arungal,Karungalpalayam'),(7423,'Erode,Palayapalayam,Erode,Collectorate'),(7424,'Erode,Chennimalai,Erode,East'),(7425,'Erode,Marapalam,Erode,East'),(7426,'Erode,Erode,Fort,Erode,East'),(7427,'Erode,Moolapalayam,Arur,Karur,Erode,Railway,Colony'),(7428,'Erode,Karungalpalayam'),(7429,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(7430,'Erode,Perundurai,Ingur'),(7431,'Erode,Chikkaiah,Naicker,College'),(7432,'Erode,Erode,East'),(7433,'Erode,Erode,Fort,Erode,East'),(7434,'Erode,Erode,East'),(7435,'Erode,Perundurai,Erode,Collectorate'),(7436,'Erode,Perundurai,Erode,Collectorate'),(7437,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(7438,'Erode,Karungalpalayam'),(7439,'Erode,Pasur,Asur,Kolanalli'),(7440,'Erode,Marapalam,Erode,East'),(7441,'Komarapalayam,Chinnagoundanur'),(7442,'Erode,Kasipalayam,Railway,Colony,Erode,Railway,Colony'),(7443,'Erode,Erode,East'),(7444,'Erode,Erode,East'),(7445,'Perundurai,Ingur'),(7446,'Erode,Perundurai,Thindal,Thindal'),(7447,'Erode,Thirunagar,Colony,Karungalpalayam'),(7448,'Erode,Erode,Collectorate'),(7449,'Erode,Erode,Fort,Erode,East'),(7450,'Erode,Perundurai,Erode,Collectorate'),(7451,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(7452,'Erode,Erode,Fort,Erode,East'),(7453,'Erode,Marapalam,Erode,East'),(7454,'Erode,Sampath,Nagar,Erode,Collectorate'),(7455,'Erode,Soolai,Chikkaiah,Naicker,College'),(7456,'Erode,Erode,Collectorate'),(7457,'Erode,Edayankattuvalsu'),(7458,'Erode,Veerappanchatram,Karungalpalayam'),(7459,'Komarapalayam,Kallankattuvalasu'),(7460,'Erode,Sathyamangalam,Chikkarasampalayam'),(7461,'Alampalayam,Spb,Colony'),(7462,'Erode,Palayapalayam,Perundurai,Thindal'),(7463,'Erode,Emur,Chikkaiah,Naicker,College'),(7464,'Erode,Chennimalai,Erode,East'),(7465,'Erode,Erode,Collectorate'),(7466,'Erode,Karungalpalayam'),(7467,'Erode,Palayapalayam,Teachers,Colony,Erode,Collectorate'),(7468,'Erode,Marapalam,Erode,East'),(7469,'Erode,Thindal,Thindal'),(7470,'Erode,East,Erode,East'),(7471,'Erode,Marapalam,Erode,East'),(7472,'Erode,Erode,East'),(7473,'Erode,Chikkaiah,Naicker,College'),(7474,'Erode,Karungalpalayam'),(7475,'Erode,Karungalpalayam'),(7476,'Karungalpalayam,Arungal,Karungalpalayam'),(7477,'Erode,Edayankattuvalsu'),(7478,'Erode,Edayankattuvalsu'),(7479,'Erode,Karungalpalayam,Arachi,Arungal,Karungalpalayam'),(7480,'Erode,Pallipalayam'),(7481,'Erode,Thindal'),(7482,'Erode,Erode,East'),(7483,'Erode,Karungalpalayam'),(7484,'Erode,Thindal,Thindal'),(7485,'Erode,Chikkaiah,Naicker,College'),(7486,'Alathur,Erode,Athur,Kalichettipalayam.,Mettupalayam'),(7487,'Erode,Erode,East'),(7488,'Perundurai,Athur,Ingur'),(7489,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(7490,'Erode,Chikkaiah,Naicker,College'),(7491,'Erode,Thirunagar,Colony,Karungalpalayam'),(7492,'Erode,Erode,Collectorate'),(7493,'Chithode,Chittode'),(7494,'Pallipalayam,Pallipalayam'),(7495,'Erode,Erode,East'),(7496,'Erode,Erode,Fort,Erode,East'),(7497,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(7498,'Erode,Perundurai,Erode,Collectorate'),(7499,'Erode,Edayankattuvalsu'),(7500,'Erode,Erode,Fort,Erode,East'),(7501,'Erode,Erode,East'),(7502,'Erode,Erode,Fort,Karungalpalayam'),(7503,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(7504,'Erode,Erode,Fort,Erode,Collectorate'),(7505,'Bhavani,Bhavani,Kudal'),(7506,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(7507,'Erode,Erode,Collectorate'),(7508,'Erode,Erode,East'),(7509,'Erode,Kavandapadi,Kalichettipalayam.,Mettupalayam'),(7510,'Komarapalayam,Kallankattuvalasu'),(7511,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(7512,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(7513,'Erode,Erode,Fort,Erode,East'),(7514,'Erode,Karungalpalayam'),(7515,'Erode,Karungalpalayam'),(7516,'Erode,Edayankattuvalsu'),(7517,'Kanagapuram,Kanagapuram'),(7518,'Erode,Erode,Fort,Erode,East'),(7519,'Erode,Edayankattuvalsu'),(7520,'Erode,Thindal'),(7521,'Thindal,Thindal'),(7522,'Erode,Gobichettipalayam,Ayal,Chettipalayam,Kadukkampalayam'),(7523,'Erode,Perundurai,Erode,Collectorate'),(7524,'Erode,Erode,East'),(7525,'Erode,Erode,East'),(7526,'Kasipalayam,Chettipalayam,Erode,Railway,Colony'),(7527,'Erode,Erode,East'),(7528,'Erode,Erode,East'),(7529,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(7530,'Erode,Perundurai,Kanagapuram'),(7531,'Erode,Chikkaiah,Naicker,College'),(7532,'Erode,Anur,Erode,Collectorate'),(7533,'Erode,Sampath,Nagar,Thindal'),(7534,'Erode,Kokkarayanpettai,Pappampalayam,Chikkaiah,Naicker,College'),(7535,'Erode,Perundurai,Thindal'),(7536,'Erode,Chikkaiah,Naicker,College'),(7537,'Erode,Karungalpalayam'),(7538,'Bhavani,Erode,Kali,Bhavani,Kudal'),(7539,'Erode,Erode,Fort,Erode,East'),(7540,'Erode,Erode,Fort,Erode,East'),(7541,'Bhavani,Erode,Kali,Kamaraj,Nagar,Bhavani,Kudal'),(7542,'E.Pethampatti,E.Pethampatti'),(7543,'Bhavani,Bhavani,Kudal'),(7544,'Kangayam,Kangayampalayam,Elumathur'),(7545,'Nasiyanur,Anur,Kadirampatti'),(7546,'Erode,Perundurai,Erode,Collectorate'),(7547,'Erode,Surampatti,Edayankattuvalsu'),(7548,'Erode,Perundurai,Erode,Collectorate'),(7549,'Erode,Edayankattuvalsu'),(7550,'Perundurai,Kanji,Kanjikovil,Kanjikovil'),(7551,'Erode,Palayapalayam,Thindal'),(7552,'Agraharam,Erode,Seerampalayam'),(7553,'Bhavani,Kali,Vasavi,College'),(7554,'Erode,Erode,East'),(7555,'Erode,Nadarmedu,Erode,Railway,Colony'),(7556,'Erode,Erode,Fort,Erode,East'),(7557,'Erode,Teachers,Colony,Erode,Collectorate'),(7558,'Erode,Erode,East'),(7559,'Erode,Thindal,Thindal'),(7560,'Erode,Chikkaiah,Naicker,College'),(7561,'Erode,Karungalpalayam'),(7562,'Chithode,Erode,Chittode'),(7563,'Lakkapuram,Erode,Railway,Colony'),(7564,'Erode,Erode,Fort,Erode,East'),(7565,'Perundurai,Ingur'),(7566,'Erode,Kadukkampalayam'),(7567,'Erode,Perundurai,Erode,Collectorate'),(7568,'Erode,Perundurai,Thindal'),(7569,'Erode,Teachers,Colony,Erode,Collectorate'),(7570,'Erode,Karungalpalayam'),(7571,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(7572,'Erode,Karungalpalayam,Marapalam,Arungal,Karungalpalayam'),(7573,'Erode,Teachers,Colony,Erode,Collectorate'),(7574,'Seerampalayam,Seerampalayam'),(7575,'Erode,Perundurai,Ingur'),(7576,'Erode,Chennimalai,Erode,East'),(7577,'Bhavani,Bhavani,Kudal'),(7578,'Erode,Thindal'),(7579,'Vallipurathanpalayam,Kanagapuram'),(7580,'Erode,Erode,Railway,Colony'),(7581,'Erode,Palayapalayam,Edayankattuvalsu'),(7582,'Erode,Karungalpalayam'),(7583,'Erode,Edayankattuvalsu'),(7584,'Erode,Erode,Fort,Erode,East'),(7585,'Erode,Vairapalayam,Karungalpalayam'),(7586,'Erode,Vallipurathanpalayam,Kanagapuram'),(7587,'Erode,Edayankattuvalsu'),(7588,'Erode,Edayankattuvalsu'),(7589,'Erode,Karungalpalayam,Amoor,Arungal,Karungalpalayam'),(7590,'Erode,Erode,Collectorate'),(7591,'Edayankattuvalsu,Edayankattuvalsu'),(7592,'Erode,Kollampalayam,Erode,Railway,Colony'),(7593,'Erode,Chidambaram,Erode,East'),(7594,'Erode,Adari,Pallipalayam'),(7595,'Erode,Thindal,Arasampatti,Thindal'),(7596,'Erode,Erode,Collectorate'),(7597,'Erode,Teachers,Colony,Erode,Collectorate'),(7598,'Agraharam,Erode,Seerampalayam'),(7599,'Seerampalayam,Seerampalayam'),(7600,'Erode,Thindal'),(7601,'Erode,Attur,Kadukkampalayam'),(7602,'Komarapalayam,Kallankattuvalasu'),(7603,'Erode,Thindal,Thindal'),(7604,'Erode,Edayankattuvalsu'),(7605,'Erode,Karungalpalayam'),(7606,'Erode,Erode,East'),(7607,'Erode,Erode,Collectorate'),(7608,'Erode,Erode,Fort,Erode,East'),(7609,'Pallipalayam,Pallipalayam'),(7610,'Erode,Erode,Fort,Erode,East'),(7611,'Erode,Moolapalayam,Erode,Railway,Colony'),(7612,'Erode,Surampatti,Edayankattuvalsu'),(7613,'Pallipalayam,Pallipalayam'),(7614,'Erode,Thindal,Kanagapuram'),(7615,'Erode,Periyar,Nagar,Edayankattuvalsu'),(7616,'Seerampalayam,Seerampalayam'),(7617,'Erode,Chidambaram,Erode,East'),(7618,'Erode,Thindal'),(7619,'Erode,Thindal,Thindal'),(7620,'Erode,Teachers,Colony,Erode,Collectorate'),(7621,'Anthiyur,Gettisamudram,Alampalayam'),(7622,'Erode,Erode,Fort,Karungalpalayam'),(7623,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(7624,'Erode,Edayankattuvalsu'),(7625,'Pallipalayam,Pallipalayam'),(7626,'Erode,Erode,Fort,Erode,East'),(7627,'Erode,Periyar,Nagar,Erode,East'),(7628,'Erode,Edayankattuvalsu'),(7629,'Erode,Athipalayam,Chettipalayam,Erode,Railway,Colony'),(7630,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(7631,'Erode,Periyar,Nagar,Erode,East'),(7632,'Avalpoondurai,Erode,Kangayam,Avalpundurai'),(7633,'Erode,Erode,East'),(7634,'Erode,Erode,East'),(7635,'Erode,Karungalpalayam'),(7636,'Erode,Thirunagar,Colony,Karungalpalayam'),(7637,'Pallipalayam,Pallipalayam'),(7638,'Karungalpalayam,Karungalpalayam'),(7639,'Erode,Soolai,Veerappanchatram,Chikkaiah,Naicker,College'),(7640,'Pappampalayam,Pappampalayam'),(7641,'Erode,Erode,Collectorate'),(7642,'Palakarai,Palakarai'),(7643,'Erode,Thindal'),(7644,'Erode,Marapalam,Erode,East'),(7645,'Erode,Rangampalayam,Edayankattuvalsu'),(7646,'Ambal,Elur,Tiruchengodu,North'),(7647,'Erode,Erode,Fort,Erode,East'),(7648,'Chithode,Chittode'),(7649,'Perundurai,Thiruvachi,Ingur'),(7650,'Athur,Merkupathi'),(7651,'Erode,Kollampalayam,Pudur,Erode,Railway,Colony'),(7652,'Erode,Edayankattuvalsu'),(7653,'Erode,Erode,Fort,Erode,East'),(7654,'Ganapathipalayam,Athipalayam,Ganapathipalayam'),(7655,'Bhavani,Erode,Bhavani,Kudal'),(7656,'Erode,Perundurai,Thindal,Thindal'),(7657,'Erode,Karungalpalayam'),(7658,'Erode,Solar,Erode,Railway,Colony'),(7659,'Erode,Chennimalai,Erode,East'),(7660,'Erode,Erode,Railway,Colony'),(7661,'Erode,Chidambaram,Erode,East'),(7662,'Erode,Perundurai,Erode,Collectorate'),(7663,'Perundurai,Siruvalur,Ingur'),(7664,'Erode,Erode,Fort,Erode,East'),(7665,'Erode,Vairapalayam,Karungalpalayam'),(7666,'Erode,Teachers,Colony,Erode,Collectorate'),(7667,'Erode,Karungalpalayam'),(7668,'Kallankattuvalasu,Kallankattuvalasu'),(7669,'Bhavani,Erode,Chikkaiah,Naicker,College'),(7670,'Erode,Palayapalayam,Erode,Collectorate'),(7671,'Erode,Ottapparai,Periyar,Nagar,Chennimalai,Basuvapatti'),(7672,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(7673,'Erode,Erode,Fort,Erode,East'),(7674,'Erode,Erode,East'),(7675,'Erode,Erode,Fort,Erode,East'),(7676,'Erode,Perundurai,Erode,Collectorate'),(7677,'Pallipalayam,Pallipalayam'),(7678,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(7679,'Perundurai,Kambiliyampatti'),(7680,'Chikkaiah,Naicker,College,Chikkaiah,Naicker,College'),(7681,'Erode,Arur,Karur,Erode,Railway,Colony'),(7682,'Erode,Kollampalayam,Erode,Railway,Colony'),(7683,'Nasiyanur,Anur,Kadirampatti'),(7684,'Erode,Perundurai,Edayankattuvalsu'),(7685,'Erode,Surampatti,Ayal,Erode,East'),(7686,'Erode,Erode,Collectorate'),(7687,'Rangampalayam,Chennimalai,Edayankattuvalsu'),(7688,'Bhavani,Pudur,Thottipalayam,Dalavoipettai'),(7689,'Erode,Arasampatti,Erode,Railway,Colony'),(7690,'Erode,Lakkapuram,Erode,Railway,Colony'),(7691,'Erode,Perundurai,Kanagapuram'),(7692,'Perundurai,Karumandisellipalayam,Ingur'),(7693,'Erode,Erode,East'),(7694,'Erode,Perundurai,Ingur'),(7695,'Erode,Chikkaiah,Naicker,College'),(7696,'Erode,Erode,East'),(7697,'Erode,Surampatti,Erode,East'),(7698,'Erode,Sathyamangalam,Attur,638060'),(7699,'Erode,Erode,East'),(7700,'Erode,Chikkaiah,Naicker,College'),(7701,'Erode,Chennimalai,Erode,Railway,Colony'),(7702,'Erode,Thirunagar,Colony,Karungalpalayam'),(7703,'Erode,East,Erode,East'),(7704,'Erode,Moolapalayam,Erode,Railway,Colony'),(7705,'Erode,Erode,Fort,Erode,East'),(7706,'Erode,Karungalpalayam'),(7707,'Erode,Chettipalayam,Erode,Railway,Colony'),(7708,'Erode,Erode,Collectorate'),(7709,'Erode,Nasiyanur,Anur,Kadirampatti'),(7710,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(7711,'Erode,Thindal,Thindal'),(7712,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(7713,'Erode,Nasiyanur,Sampath,Nagar,Anur,Erode,Collectorate'),(7714,'Erode,Periyar,Nagar,Erode,East'),(7715,'Erode,Erode,East'),(7716,'Erode,Voc,Park,Karungalpalayam'),(7717,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(7718,'Erode,Edayankattuvalsu'),(7719,'Erode,Erode,Fort,Erode,East'),(7720,'Erode,Erode,East'),(7721,'Erode,Erode,East'),(7722,'Erode,Chikkaiah,Naicker,College'),(7723,'Erode,Palayapalayam,Perundurai,Thindal'),(7724,'Erode,Soolai,Chikkaiah,Naicker,College'),(7725,'Erode,Edayankattuvalsu'),(7726,'Erode,Periyar,Nagar,Erode,East'),(7727,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(7728,'Erode,Erode,Fort,Erode,East'),(7729,'Erode,Kalichettipalayam.,Mettupalayam'),(7730,'Erode,Perundurai,Thindal,Thindal'),(7731,'Erode,Erode,Fort,Erode,East'),(7732,'Erode,Erode,East'),(7733,'Erode,Erode,Fort,Erode,East'),(7734,'Erode,Railway,Colony,Erode,Railway,Colony'),(7735,'Erode,Emur,Chikkaiah,Naicker,College'),(7736,'Erode,Avalpundurai'),(7737,'Karungalpalayam,Karungalpalayam'),(7738,'Erode,Edayankattuvalsu'),(7739,'Erode,Perundurai,Erode,Collectorate'),(7740,'Erode,Chikkaiah,Naicker,College'),(7741,'Elur,Zamin,Elampalli'),(7742,'Erode,Erode,Fort,Erode,East'),(7743,'Erode,Erode,Fort,Karungalpalayam'),(7744,'Erode,Erode,East'),(7745,'Erode,Sampath,Nagar,Erode,Collectorate'),(7746,'Erode,Muncipal,Colony,Veerappanchatram,Chikkaiah,Naicker,College'),(7747,'Erode,Chidambaram,Erode,East'),(7748,'Erode,Erode,Fort,Erode,East'),(7749,'Erode,Karungalpalayam'),(7750,'Erode,Erode,Collectorate'),(7751,'Erode,Palayapalayam,Erode,Collectorate'),(7752,'Anthiyur,Alampalayam'),(7753,'Anthiyur,Bhavani,Alampalayam'),(7754,'Erode,Pallipalayam'),(7755,'Erode,Erode,East'),(7756,'Erode,Pallipalayam'),(7757,'Erode,Perundurai,Thindal,Thindal'),(7758,'Kollampalayam,Arur,Karur,Erode,Railway,Colony'),(7759,'Thindal,Thindal'),(7760,'Erode,Erode,Collectorate'),(7761,'Erode,Erode,Collectorate'),(7762,'Pudur,Erode,Railway,Colony'),(7763,'Erode,Muncipal,Colony,Veerappanchatram,Erode,Collectorate'),(7764,'Erode,Muncipal,Colony,Periya,Valasu,Chikkaiah,Naicker,College'),(7765,'Erode,Chikkaiah,Naicker,College'),(7766,'Erode,Perundurai,Erode,Collectorate'),(7767,'Erode,Erode,Fort,Erode,East'),(7768,'Erode,Rangampalayam,Chennimalai,Edayankattuvalsu'),(7769,'Komarapalayam,Kammavarpalayam,Kallankattuvalasu'),(7770,'Seerampalayam,Seerampalayam'),(7771,'Erode,Periyar,Nagar,Erode,East'),(7772,'Komarapalayam,Kallankattuvalasu'),(7773,'Erode,Palayapalayam,Erode,Collectorate'),(7774,'Karungalpalayam,Karungalpalayam'),(7775,'Kasthuripatti,Kasthuripatti'),(7776,'Erode,Railway,Colony,Erode,Railway,Colony'),(7777,'Erode,Erode,Collectorate'),(7778,'Bhavani,Erode,Chikkaiah,Naicker,College'),(7779,'Erode,Erode,East'),(7780,'Agraharam,Erode,Karungalpalayam'),(7781,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(7782,'Erode,Moolapalayam,Arur,Karur,Erode,Railway,Colony'),(7783,'Erode,Perundurai,Thindal'),(7784,'Perundurai,Ingur'),(7785,'Erode,Periyar,Nagar,Erode,East'),(7786,'Erode,Teachers,Colony,Erode,Collectorate'),(7787,'Erode,Kanagapuram'),(7788,'Erode,Chettipalayam,Erode,Railway,Colony'),(7789,'Erode,Erode,Collectorate'),(7790,'Erode,Erode,East'),(7791,'Erode,Thindal'),(7792,'Arasampatti,Kadirampatti'),(7793,'Erode,Soolai,Chikkaiah,Naicker,College'),(7794,'Erode,Erode,East'),(7795,'Bhavani,Chithode,Chittode'),(7796,'Erode,Moolapalayam,Erode,Railway,Colony'),(7797,'Erode,Pallipalayam'),(7798,'Komarapalayam,Kallankattuvalasu'),(7799,'Erode,Solar,Erode,Railway,Colony'),(7800,'Erode,Erode,Fort,Erode,East'),(7801,'Erode,Erode,Fort,Erode,East'),(7802,'Thindal,Thindal'),(7803,'Erode,Pallipalayam'),(7804,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(7805,'Erode,Kasipalayam,Solar,Arur,Karur,Erode,Railway,Colony'),(7806,'Erode,Railway,Colony,Erode,Railway,Colony'),(7807,'Erode,Periyar,Nagar,Erode,East'),(7808,'Erode,Thindal'),(7809,'Erode,Ammayappan,Karungalpalayam'),(7810,'Erode,Erode,Collectorate'),(7811,'Erode,Perundurai,Erode,Collectorate'),(7812,'Gobichettipalayam,Chettipalayam,Kallipatti,Gobichettipalayam'),(7813,'Erode,Edayankattuvalsu'),(7814,'Bhavani,Erode,Vasavi,College'),(7815,'Erode,Erode,Fort,Erode,Collectorate'),(7816,'Katpadi,Bakiyath'),(7817,'Erode,Surampatti,Erode,East'),(7818,'Erode,Edayankattuvalsu'),(7819,'Erode,Karungalpalayam'),(7820,'Erode,Karungalpalayam'),(7821,'Erode,Moolapalayam,Erode,Railway,Colony'),(7822,'Erode,Perundurai,Ingur'),(7823,'Erode,Erode,Collectorate'),(7824,'Erode,Kollampalayam,Erode,Railway,Colony'),(7825,'Erode,Thindal,Thindal'),(7826,'Erode,Voc,Park,Karungalpalayam'),(7827,'Erode,Erode,Fort,Erode,East'),(7828,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(7829,'Erode,Peria,Agraharam'),(7830,'Erode,Kanjikovil'),(7831,'Erode,Karungalpalayam'),(7832,'Erode,Perundurai,Ingur'),(7833,'Ayyanthirumaligai,Ayyanthirumaligai'),(7834,'Erode,Thindal'),(7835,'Erode,Ammapettai'),(7836,'Erode,Palayapalayam,Perundurai,Thindal'),(7837,'Arur,Karur,Erode,Railway,Colony'),(7838,'Erode,Erode,Fort,Erode,East'),(7839,'Erode,Erode,East'),(7840,'Erode,Thindal,Thindal'),(7841,'Bhavani,Erode,Chikkaiah,Naicker,College'),(7842,'Erode,Chikkaiah,Naicker,College'),(7843,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(7844,'Erode,Gobichettipalayam,Chettipalayam,Kadukkampalayam'),(7845,'Erode,Thindal,Thindal'),(7846,'Erode,Perundurai,Athur,Ingur'),(7847,'Erode,Chennimalai,Edayankattuvalsu'),(7848,'Thindal,Thindal'),(7849,'Ellapalayam,Emur,Chikkaiah,Naicker,College'),(7850,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(7851,'Erode,Erode,East'),(7852,'Erode,Perundurai,Ingur'),(7853,'Erode,Pappampalayam,Elur,Erode,Railway,Colony'),(7854,'Erode,Karungalpalayam'),(7855,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(7856,'Erode,Amoor,Karungalpalayam'),(7857,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(7858,'Erode,Lakkapuram,Erode,Railway,Colony'),(7859,'Chithode,Chittode'),(7860,'Bhavani,Chithode,Erode,Chittode'),(7861,'Erode,Kali,Bhavani,Kudal'),(7862,'Erode,Thindal,Thindal'),(7863,'Erode,Erode,East'),(7864,'Erode,Erode,Fort,Erode,East'),(7865,'Kanagapuram,Kanagapuram'),(7866,'Erode,Periyar,Nagar,Erode,East'),(7867,'Erode,Chikkaiah,Naicker,College'),(7868,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(7869,'Kavandapadi,Kalichettipalayam.,Mettupalayam'),(7870,'Erode,Peria,Agraharam'),(7871,'Erode,Sampath,Nagar,Erode,Collectorate'),(7872,'Pallipalayam,Pallipalayam'),(7873,'Erode,Erode,East'),(7874,'Erode,Thindal'),(7875,'Erode,Thindal,Thindal'),(7876,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(7877,'Erode,Karungalpalayam'),(7878,'Erode,Thindal'),(7879,'Erode,Erode,East'),(7880,'Erode,Karungalpalayam'),(7881,'Erode,Erode,Fort,Erode,East'),(7882,'Erode,Erode,Fort,Muncipal,Colony,Veerappanchatram,Chikkaiah,Naicker,College'),(7883,'Erode,Chikkaiah,Naicker,College'),(7884,'Erode,Thirunagar,Colony,Gandhipuram,Karungalpalayam'),(7885,'Erode,Karungalpalayam'),(7886,'Erode,Periyar,Nagar,Erode,East'),(7887,'Erode,Moolapalayam,Erode,Railway,Colony'),(7888,'Erode,Thindal,Thindal'),(7889,'Erode,Rangampalayam,Edayankattuvalsu'),(7890,'Erode,Vairapalayam,Chikkaiah,Naicker,College'),(7891,'Erode,Perundurai,Teachers,Colony,Ambal,Erode,Collectorate'),(7892,'Chithode,Erode,Chittode'),(7893,'Erode,Palayapalayam,Erode,Collectorate'),(7894,'Anur,Pothanur'),(7895,'Erode,Perundurai,Thindal,Thindal'),(7896,'Erode,Erode,Fort,Erode,East'),(7897,'Erode,Erode,East'),(7898,'Gobichettipalayam,Chettipalayam,Kadukkampalayam'),(7899,'Erode,Erode,East'),(7900,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(7901,'Erode,Nadarmedu,Erode,Railway,Colony'),(7902,'Erode,Lakkapuram,Erode,Railway,Colony'),(7903,'Erode,Vasavi,College'),(7904,'Erode,Periyar,Nagar,Erode,East'),(7905,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(7906,'Erode,Moolapalayam,Erode,Railway,Colony'),(7907,'Erode,Teachers,Colony,Edayankattuvalsu'),(7908,'Gangapuram,Ellapalayam,Emur,Chikkaiah,Naicker,College'),(7909,'Erode,Arungal,Ayal,Karungalpalayam'),(7910,'Erode,Palayapalayam,Erode,Collectorate'),(7911,'Erode,Thindal,Thindal'),(7912,'Erode,Kadirampatti'),(7913,'Erode,Erode,Collectorate'),(7914,'Erode,Perundurai,Erode,Collectorate'),(7915,'Erode,Erode,Collectorate'),(7916,'Erode,Arur,Karur,Erode,Railway,Colony'),(7917,'Erode,Erode,Fort,Erode,East'),(7918,'Erode,Moolapalayam,Erode,Railway,Colony'),(7919,'Erode,Erode,East'),(7920,'Devanankurichi,Devanankurichi'),(7921,'Erode,Erode,Fort,Erode,East'),(7922,'Erode,Palayapalayam,Erode,Collectorate'),(7923,'Erode,Thindal,Thindal'),(7924,'Erode,Erode,Fort,Erode,East'),(7925,'Erode,Edayankattuvalsu'),(7926,'Erode,Erode,East'),(7927,'Erode,Chikkaiah,Naicker,College'),(7928,'Erode,Muncipal,Colony,Erode,Collectorate'),(7929,'Erode,Chikkaiah,Naicker,College'),(7930,'Erode,Erode,East'),(7931,'Erode,Thirunagar,Colony,Karungalpalayam'),(7932,'Bhavani,Erode,Bhavani,Kudal'),(7933,'Erode,Erode,Fort,Erode,East'),(7934,'Perundurai,Ingur'),(7935,'Erode,Surampatti,Voc,Park,Karungalpalayam'),(7936,'Erode,Thindal'),(7937,'Erode,Arasampatti,Kadirampatti'),(7938,'Erode,Chikkaiah,Naicker,College'),(7939,'Erode,Chettipalayam,Erode,Railway,Colony'),(7940,'Erode,Nasiyanur,Anur,Kadirampatti'),(7941,'Erode,Palayapalayam,Perundurai,Teachers,Colony,Erode,Collectorate'),(7942,'Erode,Karungalpalayam'),(7943,'Chettipalayam,Erode,Railway,Colony'),(7944,'Agraharam,Bhavani,Brahmana,Periya,Agraharam,Erode,Peria,Agraharam'),(7945,'Erode,Erode,Fort,Erode,East'),(7946,'Erode,Erode,East'),(7947,'Erode,Marapalam,Erode,East'),(7948,'Erode,Erode,Fort,Muncipal,Colony,Chikkaiah,Naicker,College'),(7949,'Erode,Perundurai,Thindal,Erode,Collectorate'),(7950,'Erode,Emur,Edayankattuvalsu'),(7951,'Erode,Kollampalayam,Arur,Karur,Erode,Railway,Colony'),(7952,'Arasampatti,Kadirampatti'),(7953,'Erode,Erode,Fort,Erode,East'),(7954,'Erode,Erode,Fort,Erode,East'),(7955,'Erode,Karungalpalayam'),(7956,'Erode,Thirunagar,Colony,Karungalpalayam'),(7957,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(7958,'Erode,Erode,East'),(7959,'Erode,Surampatti,Edayankattuvalsu'),(7960,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(7961,'Erode,Erode,Fort,Erode,East'),(7962,'Erode,Solar,Erode,Railway,Colony'),(7963,'Erode,Rangampalayam,Chennimalai,Edayankattuvalsu'),(7964,'Erode,Erode,East'),(7965,'Solar,Erode,Railway,Colony'),(7966,'Erode,Chikkaiah,Naicker,College'),(7967,'Erode,Erode,Collectorate'),(7968,'Erode,Gobichettipalayam,Chettipalayam,Kadukkampalayam'),(7969,'Erode,Bhavani,Kudal'),(7970,'Erode,Erode,East'),(7971,'Erode,Erode,Fort,Erode,East'),(7972,'Erode,Erode,Fort,Erode,East'),(7973,'Erode,Karungalpalayam'),(7974,'Erode,Erode,Fort,Erode,East'),(7975,'Nasiyanur,Anur,Kadirampatti'),(7976,'Erode,Erode,Collectorate'),(7977,'Erode,Veerappanchatram,Karungalpalayam'),(7978,'Erode,Perundurai,Ingur'),(7979,'Erode,Chikkaiah,Naicker,College'),(7980,'Kavandapadi,Siruvalur,Kalichettipalayam.,Mettupalayam'),(7981,'Agraharam,Arasampalayam,Seerampalayam'),(7982,'Erode,Erode,Fort,Erode,East'),(7983,'Devagoundanur,Devagoundanur'),(7984,'Erode,Coimbatore,Kambiliyampatti'),(7985,'Agraharam,Seerampalayam'),(7986,'Komarapalayam,Kallankattuvalasu'),(7987,'Erode,Moolapalayam,Erode,Railway,Colony'),(7988,'Anthiyur,Bhavani,Erode,Vellithiruppur,Iruppu,Alampalayam'),(7989,'Erode,Erode,Fort,Erode,East'),(7990,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(7991,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(7992,'Irugur,Athappagoundenpudur'),(7993,'Erode,Komarapalayam,Seerampalayam'),(7994,'Erode,Soolai,Chikkaiah,Naicker,College'),(7995,'Erode,Erode,East'),(7996,'Erode,Perundurai,Thuduppathi,Palakarai'),(7997,'Erode,Erode,East'),(7998,'Erode,Periyar,Nagar,Erode,East'),(7999,'Erode,Thindal'),(8000,'Surampatti,Anaikkattu,Edayankattuvalsu'),(8001,'Erode,Karungalpalayam'),(8002,'Erode,Teachers,Colony,Erode,Collectorate'),(8003,'Erode,Thindal,Thindal'),(8004,'Erode,Periyar,Nagar,Chidambaram,Erode,East'),(8005,'Erode,Kollampalayam,Erode,Railway,Colony'),(8006,'Erode,Chettipalayam,Erode,Railway,Colony'),(8007,'Erode,Erode,Collectorate'),(8008,'Erode,Karungalpalayam'),(8009,'Erode,Pudur,Chettipalayam,Erode,Railway,Colony'),(8010,'Erode,Karungalpalayam'),(8011,'Erode,Edayankattuvalsu'),(8012,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(8013,'Erode,Erode,Fort,Erode,East'),(8014,'Erode,Erode,Fort,Erode,East'),(8015,'Erode,Nasiyanur,Anur,Arasampatti,Kadirampatti'),(8016,'Erode,Erode,Fort,Erode,East'),(8017,'Erode,Surampatti,Teachers,Colony,Edayankattuvalsu'),(8018,'Erode,Veerappanchatram,Voc,Park,Karungalpalayam'),(8019,'Erode,Edayankattuvalsu'),(8020,'Devanankurichi,Devanankurichi'),(8021,'Erode,Erode,East'),(8022,'Erode,Marapalam,Erode,East'),(8023,'Erode,Karungalpalayam'),(8024,'Erode,Thirunagar,Colony,Gandhipuram,Karungalpalayam'),(8025,'Erode,Chidambaram,Erode,East'),(8026,'Erode,Erode,Railway,Colony'),(8027,'Erode,Nanjaiuthukuli,Elumathur'),(8028,'Erode,Gobichettipalayam,Chettipalayam,Kadukkampalayam'),(8029,'Erode,Erode,Fort,Erode,East'),(8030,'Erode,Vasavi,College'),(8031,'Erode,Erode,Fort,Erode,East'),(8032,'Komarapalayam,Kallankattuvalasu'),(8033,'Erode,Karungalpalayam'),(8034,'Erode,Perundurai,Kadirampatti'),(8035,'Erode,Chidambaram,Erode,East'),(8036,'Erode,Karungalpalayam'),(8037,'Erode,Periya,Valasu,Chikkaiah,Naicker,College'),(8038,'Erode,Erode,Collectorate'),(8039,'Ingur,Ingur'),(8040,'Erode,Karungalpalayam'),(8041,'Erode,Erode,Fort,Erode,East'),(8042,'Erode,Erode,East'),(8043,'Erode,Chikkaiah,Naicker,College'),(8044,'Erode,Periyar,Nagar,Erode,East'),(8045,'Erode,Thindal'),(8046,'Iruppu,Iduvampalayam'),(8047,'Erode,Moolapalayam,Dharapuram,Erode,Railway,Colony'),(8048,'Erode,Muncipal,Colony,Veerappanchatram,Karungalpalayam'),(8049,'Erode,Karungalpalayam'),(8050,'Erode,Perundurai,Ingur'),(8051,'Erode,Erode,Collectorate'),(8052,'Erode,Palayapalayam,Perundurai,319319'),(8053,'Erode,Perundurai,Karai,Kadirampatti'),(8054,'Erode,Erode,East'),(8055,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(8056,'Erode,Karungalpalayam,Marapalam,Arungal,Karungalpalayam'),(8057,'Erode,Thirunagar,Colony,Karungalpalayam'),(8058,'Erode,Erode,Fort,Erode,East'),(8059,'Erode,Teachers,Colony,Erode,Collectorate'),(8060,'Erode,Vairapalayam,Karungalpalayam'),(8061,'Suriyampalayam,Vasavi,College'),(8062,'Erode,Karungalpalayam'),(8063,'Erode,Marapalam,Erode,East'),(8064,'Erode,Chidambaram,Erode,East'),(8065,'Erode,Chikkaiah,Naicker,College'),(8066,'Erode,Marapalam,Erode,East'),(8067,'Erode,Solar,Arur,Karur,Erode,Railway,Colony'),(8068,'Erode,Palayapalayam,Erode,Collectorate'),(8069,'Erode,Erode,Fort,Erode,East'),(8070,'Erode,Thindal,Thindal'),(8071,'Erode,Marapalam,Surampatti,Erode,East'),(8072,'Erode,Marapalam,Erode,East'),(8073,'Erode,Erode,Collectorate'),(8074,'Nasiyanur,Thindal,Anur,Thindal'),(8075,'Erode,Sampath,Nagar,Erode,Collectorate'),(8076,'Erode,Perundurai,Thindal'),(8077,'Erode,Chidambaram,Erode,East'),(8078,'Erode,Palayapalayam,Teachers,Colony,Erode,Collectorate'),(8079,'Coimbatore,Ganapathy,Ganapathy'),(8080,'Erode,Erode,Fort,Erode,East'),(8081,'Erode,Erode,East'),(8082,'Erode,Jambai,Thindal'),(8083,'Perundurai,Ingur'),(8084,'Erode,Erode,East'),(8085,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(8086,'Erode,Chidambaram,Edayankattuvalsu'),(8087,'Erode,Chikkaiah,Naicker,College'),(8088,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(8089,'Erode,Erode,Collectorate'),(8090,'Erode,Erode,Collectorate'),(8091,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(8092,'Erode,Karungalpalayam'),(8093,'Erode,Erode,East'),(8094,'Erode,Erode,East'),(8095,'Erode,Erode,East'),(8096,'Erode,Erode,Collectorate'),(8097,'Erode,Moolapalayam,Erode,Railway,Colony'),(8098,'Erode,Erode,Fort,Erode,East'),(8099,'Erode,Surampatti,Edayankattuvalsu'),(8100,'Erode,Arur,Karur,Erode,Railway,Colony'),(8101,'Erode,Erode,Collectorate'),(8102,'Perundurai,Ingur'),(8103,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(8104,'Erode,Moolapalayam,Nadarmedu,Erode,Railway,Colony'),(8105,'Erode,Chennimalai,Edayankattuvalsu'),(8106,'Erode,Chikkaiah,Naicker,College'),(8107,'Erode,Surampatti,Edayankattuvalsu'),(8108,'Alampalayam,Pallipalayam'),(8109,'Erode,Edayankattuvalsu'),(8110,'Erode,Veerappanchatram,Kanagapuram'),(8111,'Erode,Erode,East'),(8112,'Erode,Erode,East'),(8113,'Erode,Pallipalayam'),(8114,'Erode,Gandhipuram,Karungalpalayam'),(8115,'Erode,Perundurai,Erode,Collectorate'),(8116,'Erode,Perundurai,Erode,Collectorate'),(8117,'Erode,Moolapalayam,Dharapuram,Erode,Railway,Colony'),(8118,'Erode,Erode,Collectorate'),(8119,'Erode,Surampatti,Edayankattuvalsu'),(8120,'Erode,Arimalam,Erode,Collectorate'),(8121,'Erode,Erode,Fort,Erode,East'),(8122,'Erode,Emur,Chikkaiah,Naicker,College'),(8123,'Erode,Muncipal,Colony,Erode,Collectorate'),(8124,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(8125,'Erode,Erode,Railway,Colony'),(8126,'Erode,Arasampatti,Kaikatti,Kadirampatti'),(8127,'Erode,Surampatti,Erode,East'),(8128,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(8129,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(8130,'Erode,Erode,East'),(8131,'Erode,Moolapalayam,Erode,Railway,Colony'),(8132,'Coimbatore,Gandhimaanagar'),(8133,'Erode,Chikkaiah,Naicker,College'),(8134,'Erode,Erode,Fort,Erode,East'),(8135,'Erode,Pallipalayam'),(8136,'Erode,Veerappanchatram,Karungalpalayam'),(8137,'Erode,Sampath,Nagar,Erode,Collectorate'),(8138,'Erode,Karungalpalayam'),(8139,'Nallur,Allur,Kadachanallur,Seerampalayam'),(8140,'Erode,Erode,Fort,Solar,Erode,East'),(8141,'Erode,Erode,Fort,Erode,East'),(8142,'Erode,Moolapalayam,Erode,Railway,Colony'),(8143,'Chithode,Erode,Chittode'),(8144,'Erode,Gobichettipalayam'),(8145,'Erode,Sampath,Nagar,Erode,Collectorate'),(8146,'Erode,Chittode'),(8147,'Erode,Erode,East'),(8148,'Andankoil,Mudiganam'),(8149,'Erode,Erode,Fort,Erode,East'),(8150,'Iruppu,Karai,Karaipudur'),(8151,'Erode,Chikkaiah,Naicker,College'),(8152,'Erode,Erode,East'),(8153,'Erode,Thirunagar,Colony,Karungalpalayam'),(8154,'Erode,Edayankattuvalsu'),(8155,'Pallipalayam,Pallipalayam'),(8156,'Erode,Erode,East'),(8157,'Erode,Periyar,Nagar,Erode,East'),(8158,'Gobichettipalayam,Chettipalayam,Alukuli'),(8159,'Agaram,Hogenakkal,Dinnabelur'),(8160,'Erode,Erode,Railway,Colony'),(8161,'Erode,Erode,East'),(8162,'Karungalpalayam,Arungal,Karungalpalayam'),(8163,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(8164,'Erode,Chidambaram,Erode,East'),(8165,'Erode,Periyar,Nagar,Erode,East'),(8166,'Erode,Thindal,Thindal'),(8167,'Vadamugam,Vellode,Ingur'),(8168,'Erode,Perundurai,Thindal'),(8169,'Erode,Moolapalayam,Arur,Karur,Erode,Railway,Colony'),(8170,'Erode,Erode,Fort,Erode,East'),(8171,'Erode,Solar,Erode,Railway,Colony'),(8172,'Erode,Chidambaram,Erode,East'),(8173,'Erode,Thindal'),(8174,'Erode,Perundurai,Erode,Collectorate'),(8175,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(8176,'Erode,Chikkaiah,Naicker,College'),(8177,'Erode,Edayankattuvalsu'),(8178,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(8179,'Erode,Kollampalayam,Erode,Railway,Colony'),(8180,'Chettipalayam,Erode,Railway,Colony'),(8181,'Erode,Perundurai,Thindal'),(8182,'Erode,Erode,East'),(8183,'Erode,Erode,East'),(8184,'Erode,Erode,Fort,Erode,East'),(8185,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(8186,'Erode,Surampatti,Erode,East'),(8187,'Erode,Soolai,Emur,Chikkaiah,Naicker,College'),(8188,'Erode,Palayapalayam,Erode,Collectorate'),(8189,'Odayampalayam,Odayampalayam'),(8190,'Erode,Muncipal,Colony,Veerappanchatram,Avadi,Chikkaiah,Naicker,College'),(8191,'Erode,Chikkaiah,Naicker,College'),(8192,'Perundurai,Ingur'),(8193,'Erode,Moolapalayam,Erode,Railway,Colony'),(8194,'Erode,Karungalpalayam,Arungal,Gramam,Karungalpalayam'),(8195,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(8196,'Erode,Moolapalayam,Erode,Railway,Colony'),(8197,'Avadi,Tiruchengodu,North'),(8198,'Erode,Kanagapuram'),(8199,'Erode,Chidambaram,Erode,East'),(8200,'Erode,Marapalam,Erode,East'),(8201,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(8202,'Erode,Erode,East'),(8203,'Erode,Perundurai,Thindal'),(8204,'Erode,Thindal'),(8205,'Komarapalayam,Kallankattuvalasu'),(8206,'Erode,Erode,Fort,Erode,Collectorate'),(8207,'Erode,Erode,Fort,Erode,East'),(8208,'Erode,Sampath,Nagar,Kali,Erode,Collectorate'),(8209,'Erode,Marapalam,Erode,East'),(8210,'Erode,Erode,East'),(8211,'Erode,Lakkapuram,Erode,Railway,Colony'),(8212,'Erode,Erode,East'),(8213,'Erode,Karungalpalayam'),(8214,'Tiruchengodu,North,Tiruchengodu,North'),(8215,'Erode,Kollampalayam,Arur,Karur,Erode,Railway,Colony'),(8216,'Bhavani,Erode,Chikkaiah,Naicker,College'),(8217,'Erode,Edayankattuvalsu'),(8218,'Erode,Erode,Fort,Erode,East'),(8219,'Erode,Erode,Fort,Erode,East'),(8220,'Erode,Erode,East'),(8221,'Erode,Thindal'),(8222,'Erode,Erode,East'),(8223,'Erode,Erode,East'),(8224,'Erode,Erode,East'),(8225,'Pallipalayam,Pallipalayam'),(8226,'Erode,Periyar,Nagar,Edayankattuvalsu'),(8227,'Erode,Nadarmedu,Erode,Railway,Colony'),(8228,'Erode,Periyar,Nagar,Erode,East'),(8229,'Erode,Erode,East'),(8230,'Erode,Erode,Collectorate'),(8231,'Erode,Chidambaram,Erode,East'),(8232,'Chettipalayam,Erode,Railway,Colony'),(8233,'Erode,Thirunagar,Colony,Karungalpalayam'),(8234,'Anampatti,Avanam,Coimbatore,Keeranatham'),(8235,'Erode,Periyar,Nagar,Erode,East'),(8236,'Erode,Erode,Fort,Erode,East'),(8237,'Erode,Chidambaram,Erode,East'),(8238,'Erode,Erode,Fort,Erode,East'),(8239,'Erode,Nasiyanur,Anur,Kaikatti,Kadirampatti'),(8240,'Erode,Erode,Collectorate'),(8241,'Erode,Kollampalayam,Erode,Railway,Colony'),(8242,'Erode,Ellapalayam,Emur,Chikkaiah,Naicker,College'),(8243,'Devagoundanur,Devagoundanur'),(8244,'Erode,Erode,East'),(8245,'Agraharam,Seerampalayam'),(8246,'Erode,Periyar,Nagar,Erode,East'),(8247,'Erode,Teachers,Colony,Erode,Collectorate'),(8248,'Erode,Palayapalayam,Erode,Collectorate'),(8249,'Erode,Erode,East'),(8250,'Erode,Perundurai,Erode,Collectorate'),(8251,'Erode,Karungalpalayam,Amoor,Arungal,Karungalpalayam'),(8252,'Kollampalayam,Erode,Railway,Colony'),(8253,'Nallur,Spb,Colony,Allur,Attur,Kadachanallur,Seerampalayam'),(8254,'Perundurai,Thindal,Thindal'),(8255,'Erode,Periyar,Nagar,Erode,East'),(8256,'Erode,Thindal,Thindal'),(8257,'Erode,Erode,Fort,Erode,East'),(8258,'Pudur,Tiruchengodu,North'),(8259,'Erode,Erode,Fort,Karungalpalayam'),(8260,'Erode,Perundurai,Erode,Collectorate'),(8261,'Erode,Erode,East'),(8262,'Erode,Edayankattuvalsu'),(8263,'Erode,Ellapalayam,Chikkaiah,Naicker,College'),(8264,'Erode,Erode,East'),(8265,'Perundurai,Pudur,Ichanda,Ingur'),(8266,'Bhavani,Erode,Kuruppanaickenpalayam,Bhavani,Kudal'),(8267,'Erode,Perundurai,Erode,Collectorate'),(8268,'Erode,Erode,Fort,Erode,East'),(8269,'Erode,Erode,Fort,Erode,Collectorate'),(8270,'Erode,Erode,Collectorate'),(8271,'Coimbatore,Krishnaswamy,Nagar'),(8272,'Bhavani,Erode,Pudur,Dalavoipettai'),(8273,'Perundurai,Ingur'),(8274,'Erode,Chikkaiah,Naicker,College'),(8275,'Komarapalayam,Kallankattuvalasu'),(8276,'Erode,Teachers,Colony,Erode,Collectorate'),(8277,'Sathyamangalam,Guthialathur'),(8278,'Erode,Perundurai,Erode,Collectorate'),(8279,'Erode,Muncipal,Colony,Edayankattuvalsu'),(8280,'Erode,Kasipalayam,Chennimalai,Edayankattuvalsu'),(8281,'Erode,Atur,Chikkaiah,Naicker,College'),(8282,'Erode,Karungalpalayam'),(8283,'Erode,Karungalpalayam'),(8284,'Erode,Erode,Fort,Erode,East'),(8285,'Erode,Karungalpalayam'),(8286,'Perundurai,Ingur'),(8287,'Erode,Soolai,Andikadu,Chikkaiah,Naicker,College'),(8288,'Erode,Karungalpalayam'),(8289,'Erode,Perundurai,Erode,Collectorate'),(8290,'Anthiyur,Bhavani,Dalavoipettai'),(8291,'Erode,Erode,Fort,Erode,East'),(8292,'Erode,Erode,East'),(8293,'Erode,Arur,Karur,Erode,Collectorate'),(8294,'Erode,Soolai,Chikkaiah,Naicker,College'),(8295,'Erode,Erode,Railway,Colony'),(8296,'Erode,Railway,Colony,Chennimalai,Erode,East'),(8297,'Erode,Erode,Collectorate'),(8298,'Coimbatore,Ganapathy,Ganapathy'),(8299,'Erode,Kadirampatti'),(8300,'Erode,Manickampalayam,Chikkaiah,Naicker,College'),(8301,'Erode,Erode,East'),(8302,'Erode,Kali,Seerampalayam'),(8303,'Anur,Kumaripalyam'),(8304,'Erode,Erode,Fort,Marapalam,Erode,East'),(8305,'Ammapettai,Ammapettai'),(8306,'Anthiyur,Bhavani,Erode,Bhavani,Kudal'),(8307,'Erode,Perundurai,Ingur'),(8308,'Pallipalayam,Pallipalayam'),(8309,'Erode,Chikkaiah,Naicker,College'),(8310,'Veerappanchatram,Chikkaiah,Naicker,College'),(8311,'Attur,Turaiyur,Extension'),(8312,'Erode,Nasiyanur,Anur,Thindal'),(8313,'Erode,Surampatti,Edayankattuvalsu'),(8314,'Erode,Erode,Collectorate'),(8315,'Erode,Erode,Collectorate'),(8316,'Erode,Perundurai,Ambal,Erode,Collectorate'),(8317,'Erode,Erode,East'),(8318,'Erode,Moolapalayam,Arur,Karur,Erode,Railway,Colony'),(8319,'Bhavani,Vasavi,College'),(8320,'Veerappanchatram,Chikkaiah,Naicker,College'),(8321,'Erode,Chikkaiah,Naicker,College'),(8322,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(8323,'Erode,Gandhipuram,Karungalpalayam'),(8324,'Chithode,Erode,Perode,Chittode'),(8325,'Erode,Thirunagar,Colony,Karungalpalayam'),(8326,'Erode,Erode,Collectorate'),(8327,'Erode,Edayankattuvalsu'),(8328,'Erode,Periyar,Nagar,Erode,East'),(8329,'Erode,Erode,Railway,Colony'),(8330,'Erode,Erode,East'),(8331,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(8332,'Erode,Edayankattuvalsu'),(8333,'Erode,Erode,East'),(8334,'Erode,Erode,East'),(8335,'Erode,Surampatti,Erode,East'),(8336,'Perundurai,Ingur'),(8337,'Nasiyanur,Anur,Kadirampatti'),(8338,'Erode,Chidambaram,Erode,East'),(8339,'Erode,Perundurai,Ingur'),(8340,'Erode,Erode,Collectorate'),(8341,'Erode,Erode,Collectorate'),(8342,'Erode,Perundurai,Thindal'),(8343,'Erode,Chikkaiah,Naicker,College'),(8344,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(8345,'Erode,Erode,Railway,Colony'),(8346,'Erode,Manickampalayam,Chikkaiah,Naicker,College'),(8347,'Erode,Kavindapadi,Kalichettipalayam.,Mettupalayam'),(8348,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(8349,'Erode,East,Erode,East'),(8350,'Bhavani,Perundurai,Ingur'),(8351,'Erode,Arur,Karur,Erode,Railway,Colony'),(8352,'Erode,Perundurai,Seenapuram,Palakarai'),(8353,'Erode,Periyar,Nagar,Erode,East'),(8354,'Erode,Periyar,Nagar,Erode,East'),(8355,'Erode,Karungalpalayam'),(8356,'Erode,Erode,East'),(8357,'Muncipal,Colony,Veerappanchatram,Karungalpalayam'),(8358,'Erode,Erode,East'),(8359,'Erode,Perundurai,Erode,Collectorate'),(8360,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(8361,'Emur,Chikkaiah,Naicker,College'),(8362,'Erode,Kurichi,Modakurichi,Elumathur'),(8363,'Erode,Marapalam,Erode,East'),(8364,'Andankoil,Coimbatore,Mudiganam'),(8365,'Erode,Erode,East'),(8366,'Erode,Erode,Fort,Erode,East'),(8367,'Erode,Edayankattuvalsu'),(8368,'Erode,Chikkaiah,Naicker,College'),(8369,'Erode,Surampatti,Erode,East'),(8370,'Erode,Perundurai,Thindal'),(8371,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(8372,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(8373,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(8374,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(8375,'Erode,Erode,East'),(8376,'Erode,Edayankattuvalsu'),(8377,'Solar,Arur,Karur,Erode,Railway,Colony'),(8378,'Erode,Palayapalayam,Erode,Collectorate'),(8379,'Erode,Perundurai,Erode,Collectorate'),(8380,'Erode,Edayankattuvalsu'),(8381,'Erode,Erode,Fort,Erode,East'),(8382,'Erode,Erode,Collectorate'),(8383,'Erode,Erode,East'),(8384,'Erode,Erode,Collectorate'),(8385,'Erode,Marapalam,Erode,East'),(8386,'Perundurai,Ingur'),(8387,'Erode,Periyar,Nagar,Erode,East'),(8388,'Erode,Erode,East'),(8389,'Erode,Erode,East'),(8390,'Erode,Emur,Chikkaiah,Naicker,College'),(8391,'Erode,Periyar,Nagar,Erode,East'),(8392,'Erode,Edayankattuvalsu'),(8393,'Erode,Perundurai,Ingur'),(8394,'Erode,Erode,Fort,Erode,East'),(8395,'Erode,Kollampalayam,Erode,Railway,Colony'),(8396,'Erode,Karungalpalayam'),(8397,'Erode,Erode,Fort,Erode,East'),(8398,'Erode,Perundurai,Ingur'),(8399,'Erode,Erode,Collectorate'),(8400,'Kurichi,Modakurichi,Elumathur'),(8401,'Erode,Perundurai,Thindal'),(8402,'Erode,Erode,Fort,Erode,East'),(8403,'Komarapalayam,Kallankattuvalasu'),(8404,'Erode,Kadirampatti'),(8405,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(8406,'Erode,Erode,East'),(8407,'Pallipalayam,Pallipalayam'),(8408,'Erode,Erode,East'),(8409,'Erode,Thindal,Thindal'),(8410,'Erode,Nasiyanur,Anur,Thindal'),(8411,'Erode,Railway,Colony,Erode,Railway,Colony'),(8412,'Arisipalayam,Leigh,Bazaar'),(8413,'Erode,Surampatti,Erode,East'),(8414,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(8415,'Veerappanchatram,Chikkaiah,Naicker,College'),(8416,'Erode,Erode,Fort,Karungalpalayam'),(8417,'Erode,Perundurai,Thindal,Thindal'),(8418,'Erode,Thindal,Thindal'),(8419,'Bhavani,Erode,Pudur,Peria,Agraharam'),(8420,'Erode,Erode,East'),(8421,'Erode,Erode,East'),(8422,'Bhavani,Erode,Bhavani,Kudal'),(8423,'Agraharam,Bhavani,Erode,Peria,Agraharam'),(8424,'Iruppu,Karukkankattupudur'),(8425,'Erode,Seerampalayam'),(8426,'Perundurai,Athur,Palakarai'),(8427,'Erode,Koottapalli'),(8428,'Erode,Moolapalayam,Erode,Railway,Colony'),(8429,'Erode,Sampath,Nagar,Erode,Collectorate'),(8430,'Bhavani,Coimbatore,Kali,Vasavi,College'),(8431,'Erode,Erode,Collectorate'),(8432,'Erode,Karungalpalayam'),(8433,'Erode,Voc,Park,Karungalpalayam'),(8434,'Komarapalayam,Kallankattuvalasu'),(8435,'Karungalpalayam,Arungal,Karungalpalayam'),(8436,'Erode,Ganapathi,Nagar,Erode,Collectorate'),(8437,'Erode,Perundurai,Erode,Collectorate'),(8438,'Erode,Chettipalayam,Erode,Railway,Colony'),(8439,'Erode,Perundurai,Kadirampatti'),(8440,'Erode,Erode,Railway,Colony'),(8441,'Erode,Vairapalayam,Karungalpalayam'),(8442,'Erode,Perode,Chittode'),(8443,'Erode,Erode,East'),(8444,'Erode,Erode,Collectorate'),(8445,'Karai,Kadirampatti'),(8446,'Erode,Soolai,Chikkaiah,Naicker,College'),(8447,'Erode,Erode,Fort,Erode,East'),(8448,'Erode,Kavundachipalayam,Chennimalai,Kanagapuram'),(8449,'Erode,Erode,Fort,Erode,East'),(8450,'Erode,Perundurai,Kanagapuram'),(8451,'Erode,Erode,Fort,Erode,Collectorate'),(8452,'Erode,Perundurai,Thindal,Thindal'),(8453,'Erode,Erode,East'),(8454,'Erode,Erode,East'),(8455,'Komarapalayam,Arur,Karur,Kallankattuvalasu'),(8456,'Komarapalayam,Kallankattuvalasu'),(8457,'Erode,Pudur,Peria,Agraharam'),(8458,'Erode,Erode,Fort,Erode,East'),(8459,'Madathupalayam,Perundurai,Ingur'),(8460,'Erode,Karungalpalayam'),(8461,'Erode,Sampath,Nagar,Erode,Collectorate'),(8462,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(8463,'Erode,Surampatti,Erode,East'),(8464,'Erode,Teachers,Colony,Chikkaiah,Naicker,College'),(8465,'Erode,Chikkaiah,Naicker,College'),(8466,'Erode,Erode,East'),(8467,'Erode,Perundurai,Kanagapuram'),(8468,'Erode,Ambur,Arur,Karur,Elumathur'),(8469,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(8470,'Erode,Chikkaiah,Naicker,College'),(8471,'Erode,Avalpundurai'),(8472,'Chithode,Erode,Chittode'),(8473,'Sathyamangalam,Bannari,Chikkarasampalayam'),(8474,'Erode,Erode,Collectorate'),(8475,'Erode,Perundurai,Kadirampatti'),(8476,'Erode,Perundurai,Thindal,Erode,Collectorate'),(8477,'Erode,Chikkaiah,Naicker,College'),(8478,'Erode,Erode,Collectorate'),(8479,'Erode,Solar,Erode,Railway,Colony'),(8480,'Erode,Thottipalayam,Athur,Ingur'),(8481,'Erode,Pallipalayam'),(8482,'Erode,Perundurai,Erode,Collectorate'),(8483,'Nallur,Allur,Athur,Merkupathi'),(8484,'Erode,Erode,East'),(8485,'Erode,Erode,Fort,Erode,East'),(8486,'Erode,Erode,Fort,Erode,East'),(8487,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(8488,'Erode,Kolanalli'),(8489,'Erode,Erode,Fort,Erode,East'),(8490,'Bhavani,Erode,Bhavani,Kudal'),(8491,'Erode,Perundurai,Erode,Collectorate'),(8492,'Alapuram,Iruppu,Karaipudur'),(8493,'Erode,Chikkaiah,Naicker,College'),(8494,'Erode,Edayankattuvalsu'),(8495,'Erode,Voc,Park,Karungalpalayam'),(8496,'Erode,Erode,Railway,Colony'),(8497,'Avalpundurai,Avalpundurai'),(8498,'Erode,Marapalam,Erode,East'),(8499,'Erode,Karungalpalayam'),(8500,'Erode,Marapalam,Erode,East'),(8501,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(8502,'Erode,Erode,Fort,Erode,Collectorate'),(8503,'Avalpundurai,Avalpundurai'),(8504,'Erode,Solar,Erode,Railway,Colony'),(8505,'Chithode,Chittode'),(8506,'Erode,Solar,Erode,Railway,Colony'),(8507,'Erode,Avalpundurai'),(8508,'Erode,Periyar,Nagar,Erode,East'),(8509,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(8510,'Marapalam,Erode,East'),(8511,'Erode,Erode,Fort,Erode,East'),(8512,'Bhavani,Bhavani,Kudal'),(8513,'Erode,Amur,Chikkaiah,Naicker,College'),(8514,'Erode,Teachers,Colony,Edayankattuvalsu'),(8515,'Erode,Chidambaram,Erode,East'),(8516,'Erode,Railway,Colony,Erode,Railway,Colony'),(8517,'Erode,Erode,Collectorate'),(8518,'Erode,Erode,Fort,Erode,East'),(8519,'Erode,Erode,Fort,Erode,East'),(8520,'Pallipalayam,Pallipalayam'),(8521,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(8522,'Karungalpalayam,Arungal,Erode,East'),(8523,'Erode,Kollampalayam,Arur,Karur,Erode,Railway,Colony'),(8524,'Pallipalayam,Pallipalayam'),(8525,'Oricheri,Appakudal'),(8526,'Erode,Soolai,Chikkaiah,Naicker,College'),(8527,'Erode,Edayankattuvalsu'),(8528,'Erode,Karungalpalayam,Amoor,Arungal,Karungalpalayam'),(8529,'Erode,Erode,Fort,Erode,East'),(8530,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(8531,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(8532,'Erode,Periyar,Nagar,Erode,East'),(8533,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(8534,'Erode,Periyar,Nagar,Erode,East'),(8535,'Erode,Edayankattuvalsu'),(8536,'Erode,Perundurai,Kanji,Kanjikovil,Kanjikovil'),(8537,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(8538,'Erode,Solar,Erode,Railway,Colony'),(8539,'Erode,Erode,Railway,Colony'),(8540,'Erode,Sampath,Nagar,Erode,Collectorate'),(8541,'Erode,Voc,Park,Karungalpalayam'),(8542,'Erode,Chikkaiah,Naicker,College'),(8543,'Erode,Thindal,Thindal'),(8544,'Erode,Perundurai,Vadamugam,Vellode,Ingur'),(8545,'Erode,Erode,Railway,Colony'),(8546,'Erode,Lakkapuram,Erode,Railway,Colony'),(8547,'Erode,Surampatti,Edayankattuvalsu'),(8548,'Erode,East,Erode,East'),(8549,'Sathyamangalam,Ambodi'),(8550,'Erode,Erode,Fort,Erode,East'),(8551,'Erode,Palayapalayam,Erode,Collectorate'),(8552,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(8553,'Erode,Kadirampatti'),(8554,'Erode,Teachers,Colony,Erode,Collectorate'),(8555,'Erode,Karungalpalayam'),(8556,'Erode,Erode,Fort,Erode,East'),(8557,'Erode,Erode,Fort,Erode,East'),(8558,'Erode,Perundurai,Thindal'),(8559,'Erode,Chikkaiah,Naicker,College'),(8560,'Erode,Erode,Fort,Erode,East'),(8561,'Bhavani,Bhavani,Kudal'),(8562,'Erode,Nasiyanur,Anur,Kaikatti,Thindal'),(8563,'Sathyamangalam,Chikkarasampalayam'),(8564,'Rangampalayam,Chennimalai,Edayankattuvalsu'),(8565,'Erode,Teachers,Colony,Edayankattuvalsu'),(8566,'Erode,Karungalpalayam'),(8567,'Erode,Pudur,Kavilipalayam'),(8568,'Erode,Perundurai,Sampath,Nagar,Erode,Collectorate'),(8569,'Erode,Surampatti,Erode,East'),(8570,'Erode,Perundurai,Erode,Collectorate'),(8571,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(8572,'Erode,Erode,East'),(8573,'Bhavani,Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(8574,'Erode,Periyar,Nagar,Erode,East'),(8575,'Erode,Erode,Collectorate'),(8576,'Erode,Veerappanchatram,Karungalpalayam'),(8577,'Kavandapadi,Kalichettipalayam.,Mettupalayam'),(8578,'Erode,Edayankattuvalsu'),(8579,'Erode,Surampatti,Edayankattuvalsu'),(8580,'Erode,Surampatti,Erode,East'),(8581,'Erode,Perundurai,Erode,Collectorate'),(8582,'Erode,Erode,Fort,Erode,East'),(8583,'Erode,Palayapalayam,Thindal'),(8584,'Erode,Chettipalayam,Erode,Railway,Colony'),(8585,'Erode,Nadarmedu,Erode,Railway,Colony'),(8586,'Erode,Karungalpalayam'),(8587,'Coimbatore,Tidel,Park,Coimbatore,Tidel,Park'),(8588,'Erode,Teachers,Colony,Erode,Collectorate'),(8589,'Erode,Teachers,Colony,Erode,Collectorate'),(8590,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(8591,'Ennai,Gowriwakkam'),(8592,'Ennai,Hindi,Prachar,Sabha'),(8593,'Ennai,Alwarthirunagar'),(8594,'Erode,Erode,East'),(8595,'Erode,Edayankattuvalsu'),(8596,'Ennai,600096'),(8597,'Bhavani,Kali,Vasavi,College'),(8598,'Ambattur,Amur,Attur,Chennai,Ambattur'),(8599,'Erode,Thindal,Thindal'),(8600,'Erode,Perundurai,Thindal,Thindal'),(8601,'Karai,Coimbatore,Ukkadam'),(8602,'Erode,Kollampalayam,Erode,Railway,Colony'),(8603,'Erode,Arasampatti,Kadirampatti'),(8604,'Erode,Anaipalayam'),(8605,'Erode,Thindal,Thindal'),(8606,'Erode,Erode,Collectorate'),(8607,'Ennai,Gowriwakkam'),(8608,'Ennai,Melakkottaiyur'),(8609,'Perundurai,Ingur'),(8610,'Gangapuram,Chittode'),(8611,'Erode,Nasiyanur,Anur,Kadirampatti'),(8612,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(8613,'Erode,Perundurai,Erode,Collectorate'),(8614,'Erode,Muncipal,Colony,Erode,Collectorate'),(8615,'Erode,Gobichettipalayam,Chettipalayam,Kadukkampalayam'),(8616,'Erode,Thindal,Thindal'),(8617,'Erode,Erode,Collectorate'),(8618,'Erode,Thirunagar,Colony,Karungalpalayam'),(8619,'Erode,Karungalpalayam'),(8620,'Erode,Erode,East'),(8621,'Erode,Erode,East'),(8622,'Erode,Erode,East'),(8623,'Erode,Surampatti,Erode,East'),(8624,'Thindal,Thindal'),(8625,'Erode,Karungalpalayam,Arungal,Chikkaiah,Naicker,College'),(8626,'Erode,Teachers,Colony,Erode,Collectorate'),(8627,'Iruppu,Karaipudur'),(8628,'Erode,Soolai,Chikkaiah,Naicker,College'),(8629,'Erode,Muncipal,Colony,Karungalpalayam'),(8630,'Erode,Voc,Park,Karungalpalayam'),(8631,'Erode,Erode,Collectorate'),(8632,'Erode,Erode,East'),(8633,'Erode,Erode,Fort,Erode,East'),(8634,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(8635,'Erode,Karungalpalayam,Amoor,Arungal,Karungalpalayam'),(8636,'Erode,Palakarai'),(8637,'Karumandisellipalayam,Ingur'),(8638,'Erode,Erode,East'),(8639,'Erode,Surampatti,Erode,East'),(8640,'Erode,Perundurai,Erode,Collectorate'),(8641,'Erode,Teachers,Colony,Erode,Collectorate'),(8642,'Attur,Kattur,Seerampalayam'),(8643,'Erode,Perundurai,Erode,Collectorate'),(8644,'Erode,Edayankattuvalsu'),(8645,'Erode,Thirunagar,Colony,Karungalpalayam'),(8646,'Erode,Edayankattuvalsu'),(8647,'Erode,Erode,East'),(8648,'Erode,Karungalpalayam'),(8649,'Erode,Sampath,Nagar,Erode,Collectorate'),(8650,'Erode,Nasiyanur,Anur,Edayankattuvalsu'),(8651,'Erode,Kollampalayam,Erode,Railway,Colony'),(8652,'Bhavani,Erode,Pudur,Peria,Agraharam'),(8653,'Erode,Karungalpalayam'),(8654,'Erode,Edayankattuvalsu'),(8655,'Bhavani,Erode,Kali,Vasavi,College'),(8656,'Erode,Edayankattuvalsu'),(8657,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(8658,'Erode,Erode,Fort,Nadarmedu,Erode,East'),(8659,'Ellapalayam,Ingur'),(8660,'Erode,Erode,East'),(8661,'Erode,Erode,Collectorate'),(8662,'Edayankattuvalsu,Edayankattuvalsu'),(8663,'Erode,Erode,Fort,Erode,East'),(8664,'Erode,Karungalpalayam'),(8665,'Erode,Thindal,Thindal'),(8666,'Erode,Muncipal,Colony,Veerappanchatram,Chikkaiah,Naicker,College'),(8667,'Erode,Erode,Collectorate'),(8668,'Chithode,Erode,Chittode'),(8669,'Elumathur,Erode,Kurichi,Mathur,Modakurichi,Nanjaiuthukuli,Athur,Elumathur'),(8670,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(8671,'Erode,Erode,Collectorate'),(8672,'Erode,Karungalpalayam'),(8673,'Erode,Amoor,Erode,Railway,Colony'),(8674,'Erode,Kasipalayam,Edayankattuvalsu'),(8675,'Erode,Edayankattuvalsu'),(8676,'Erode,Edayankattuvalsu'),(8677,'Erode,Peria,Agraharam'),(8678,'Erode,Chettipalayam,Erode,Railway,Colony'),(8679,'Erode,Soolai,Chikkaiah,Naicker,College'),(8680,'Seerampalayam,Seerampalayam'),(8681,'Erode,Muncipal,Colony,Erode,Collectorate'),(8682,'Perundurai,Vallipurathanpalayam,Kanagapuram'),(8683,'Erode,Palayapalayam,Ganapathi,Nagar,Ganapathy,Erode,Collectorate'),(8684,'Erode,Erode,Fort,Karungalpalayam'),(8685,'Ennai,Medavakkam,'),(8686,'Bhavani,Erode,Bhavani,Kudal'),(8687,'Erode,Pudur,Solar,Erode,Railway,Colony'),(8688,'Erode,Erode,Fort,Erode,East'),(8689,'Erode,Veerappanchatram,Karungalpalayam'),(8690,'Erode,Erode,East'),(8691,'Erode,Erode,Fort,Erode,East'),(8692,'Erode,Surampatti,Edayankattuvalsu'),(8693,'Erode,Edayankattuvalsu'),(8694,'Erode,Chidambaram,Erode,East'),(8695,'Erode,Erode,Fort,Erode,East'),(8696,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(8697,'Alapuram,Dharmapuri,Kamalapuram,Darapuram'),(8698,'Erode,Erode,East'),(8699,'Erode,Karungalpalayam,Marapalam,Arungal,Karungalpalayam'),(8700,'Bhavani,Erode,Chikkaiah,Naicker,College'),(8701,'Agraharam,Erode,Sivagiri,Erode,East'),(8702,'Erode,Erode,Fort,Chendur,Erode,East'),(8703,'Iruppu,Kallampalayam,Road'),(8704,'Erode,Surampatti,Edayankattuvalsu'),(8705,'Erode,Kollampalayam,Erode,Railway,Colony'),(8706,'Ambur,641407'),(8707,'Edayankattuvalsu,Edayankattuvalsu'),(8708,'Erode,Erode,Collectorate'),(8709,'Bhavani,Bhavani,Kudal'),(8710,'Erode,Rangampalayam,Edayankattuvalsu'),(8711,'Bhavani,Erode,Bhavani,Kudal'),(8712,'Erode,Pudur,Erumapalayam,Kallankattuvalasu'),(8713,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(8714,'Alampalayam,Seerampalayam'),(8715,'Erode,Kadirampatti'),(8716,'Erode,Erode,Fort,Erode,East'),(8717,'Erode,Erode,Railway,Colony'),(8718,'Erode,Erode,Railway,Colony'),(8719,'Coimbatore,R.S.Puram,East'),(8720,'Erode,Perundurai,Ingur'),(8721,'Erode,Erode,Fort,Erode,East'),(8722,'Erode,Erode,Fort,Erode,East'),(8723,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(8724,'Erode,Erode,Fort,Muncipal,Colony,Veerappanchatram,Erode,East'),(8725,'Erode,Erode,Fort,Erode,East'),(8726,'Erode,Erode,East'),(8727,'Erode,Karungalpalayam'),(8728,'Erode,Palayapalayam,Erode,Collectorate'),(8729,'Erode,Chikkaiah,Naicker,College'),(8730,'Erode,Erode,Fort,Erode,East'),(8731,'Erode,Karungalpalayam'),(8732,'Erode,Erode,Fort,Erode,East'),(8733,'Erode,Surampatti,Edayankattuvalsu'),(8734,'Erode,Karungalpalayam'),(8735,'Erode,Kanjikovil'),(8736,'Erode,Veerappanchatram,Karungalpalayam'),(8737,'Erode,Edayankattuvalsu'),(8738,'Erode,Edayankattuvalsu'),(8739,'Erode,Nasiyanur,Thingalur,Anur,Kadirampatti'),(8740,'Erode,Erode,East'),(8741,'Erode,Devagoundanur'),(8742,'Erode,Periyar,Nagar,Erode,East'),(8743,'Erode,Tiruchengodu,North'),(8744,'Bhavani,Erode,Peria,Agraharam'),(8745,'Komarapalayam,Kallankattuvalasu,Kallankattuvalasu'),(8746,'Erode,Chidambaram,Erode,East'),(8747,'Erode,Erode,Fort,Erode,East'),(8748,'Erode,Thindal,Thindal'),(8749,'Erode,Karungalpalayam'),(8750,'Erode,Erode,Collectorate'),(8751,'Erode,Karungalpalayam'),(8752,'Chithode,Erode,Chittode'),(8753,'Erode,Erode,Fort,Erode,Collectorate'),(8754,'Erode,Erode,Collectorate'),(8755,'Erode,Surampatti,Edayankattuvalsu'),(8756,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(8757,'Erode,Erode,East'),(8758,'Erode,Erode,Fort,Erode,East'),(8759,'Erode,Nasiyanur,Sampath,Nagar,Anur,Erode,Collectorate'),(8760,'Erode,Perundurai,Pungampadi,Kanagapuram'),(8761,'Erode,Karungalpalayam'),(8762,'Erode,Emur,Chikkaiah,Naicker,College'),(8763,'Erode,Amoor,Karungalpalayam'),(8764,'Erode,Erode,Fort,Erode,East'),(8765,'Erode,Nasiyanur,Anur,Thindal'),(8766,'Erode,Muncipal,Colony,Veerappanchatram,Chikkaiah,Naicker,College'),(8767,'Erode,Perundurai,Erode,Collectorate'),(8768,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(8769,'Agraharam,Erode,Erode,East'),(8770,'Erode,Surampatti,Edayankattuvalsu'),(8771,'Erode,Karungalpalayam,Amur,Arungal,Karungalpalayam'),(8772,'Erode,Erode,East'),(8773,'Erode,Erode,Fort,Erode,East'),(8774,'Erode,Erode,Collectorate'),(8775,'Erode,Ingur'),(8776,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(8777,'Pallipalayam,Pallipalayam'),(8778,'Erode,Surampatti,Erode,East'),(8779,'Erode,Karungalpalayam'),(8780,'Erode,Erode,East'),(8781,'Erode,Erode,Fort,Erode,East'),(8782,'Perundurai,Thiruvachi,Ingur'),(8783,'Sathyamangalam,Chikkarasampalayam'),(8784,'Erode,Palayapalayam,Edayankattuvalsu'),(8785,'Erode,Erode,East'),(8786,'Erode,Perundurai,Thindal'),(8787,'Erode,Perundurai,Erode,Collectorate'),(8788,'Alampalayam,Seerampalayam'),(8789,'Kollampalayam,Erode,Railway,Colony'),(8790,'Gandhipuram,Pallipalayam'),(8791,'Erode,Erode,Collectorate'),(8792,'Sathyamangalam,Bannari,Chikkarasampalayam'),(8793,'Erode,Marapalam,Erode,East'),(8794,'Erode,Palayapalayam,Perundurai,Thindal'),(8795,'Erode,Chikkaiah,Naicker,College'),(8796,'Erode,Thindal,Thindal'),(8797,'Erode,Erode,East'),(8798,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(8799,'Erode,Erode,East'),(8800,'Erode,Erode,Fort,Erode,East'),(8801,'Erode,Erode,Fort,Erode,East'),(8802,'Chennimalai,Kanagapuram'),(8803,'Erode,Erode,East'),(8804,'Erode,Lakkapuram,Pudur,Erode,Railway,Colony'),(8805,'Erode,Chikkaiah,Naicker,College'),(8806,'Erode,Erode,Railway,Colony'),(8807,'Erode,Soolai,Chikkaiah,Naicker,College'),(8808,'Erode,Erode,East'),(8809,'Erode,Palayapalayam,Erode,Collectorate'),(8810,'Kuttapalayam,Kuttapalayam'),(8811,'Anur,Kalpatti,Devagoundanur'),(8812,'Erode,Erode,Collectorate'),(8813,'Erode,Erode,Collectorate'),(8814,'Erode,Palayapalayam,Erode,Collectorate'),(8815,'Erode,Erode,East'),(8816,'Gobichettipalayam,Chettipalayam,Arakkankottai'),(8817,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(8818,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(8819,'Erode,Surampatti,Erode,Collectorate'),(8820,'Agraharam,Dharmapuri,Public,Offices'),(8821,'Erode,Thindal'),(8822,'Nallur,Alampalayam,Allur,Kadachanallur,Seerampalayam'),(8823,'Erode,Kollampalayam,Arur,Karur,Erode,Railway,Colony'),(8824,'Erode,Erode,Fort,Erode,East'),(8825,'Erode,Erode,East'),(8826,'Erode,Chikkaiah,Naicker,College'),(8827,'Erode,Nasiyanur,Anur,Thindal'),(8828,'Bhavani,Erode,Nallur,Allur,Ammapettai'),(8829,'Ennai,Ekkaduthangal'),(8830,'Erode,Gandhipuram,Karungalpalayam'),(8831,'Moolapalayam,Kali,Erode,Railway,Colony'),(8832,'Erode,Erode,Railway,Colony'),(8833,'Erode,Arur,Karur,Kavundampalayam,Erode,Railway,Colony'),(8834,'Erode,Periyar,Nagar,Erode,East'),(8835,'Erode,Thindal,Thindal'),(8836,'Erode,Perundurai,Thindal,Thindal'),(8837,'Erode,Perundurai,Erode,Collectorate'),(8838,'Erode,Perundurai,Erode,Collectorate'),(8839,'Erode,Ganapathipalayam,Komarapalayam,Athipalayam,Seerampalayam'),(8840,'Karai,Coimbatore,Industrial,Estate'),(8841,'Ennai,Alandur(Reopened,W.E.F.6.6.05)'),(8842,'Erode,Erode,Collectorate'),(8843,'Erode,Moolapalayam,Nadarmedu,Arur,Karur,Erode,Railway,Colony'),(8844,'Erode,Palayapalayam,Thindal'),(8845,'Komarapalayam,Kallankattuvalasu'),(8846,'Erode,Karungalpalayam'),(8847,'Erode,Kasipalayam,Edayankattuvalsu'),(8848,'Erode,Sampath,Nagar,Erode,Collectorate'),(8849,'Erode,Andikadu,Chikkaiah,Naicker,College'),(8850,'Bhavani,Bhavani,Kudal'),(8851,'Nasiyanur,Anur,Karamadai,Kadirampatti'),(8852,'Erode,Periyar,Nagar,Erode,East'),(8853,'Erode,Moolapalayam,Erode,Railway,Colony'),(8854,'Erode,Amoor,Karungalpalayam'),(8855,'Erode,Edayankattuvalsu'),(8856,'Pallipalayam,Pallipalayam'),(8857,'Bhavani,Erode,Peria,Agraharam'),(8858,'Erode,Erode,Collectorate'),(8859,'Erode,Erode,Fort,Erode,East'),(8860,'Erode,Perundurai,Thindal'),(8861,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(8862,'Erode,Vairapalayam,Karungalpalayam'),(8863,'Erode,Periyar,Nagar,Chidambaram,Erode,East'),(8864,'Erode,Solar,Arur,Karur,Erode,Railway,Colony'),(8865,'Perundurai,Ingur'),(8866,'Perundurai,Eral,Ingur'),(8867,'Erode,Chettipalayam,Erode,Railway,Colony'),(8868,'Erode,Palayapalayam,Erode,Collectorate'),(8869,'Erode,Erode,Fort,Erode,East'),(8870,'Erode,Emur,Chikkaiah,Naicker,College'),(8871,'Erode,Emur,Edayankattuvalsu'),(8872,'Erode,Arasampatti,Kadirampatti'),(8873,'Erode,Erode,Collectorate'),(8874,'Erode,Perundurai,Erode,Collectorate'),(8875,'Erode,Voc,Park,Karungalpalayam'),(8876,'Erode,Erode,Fort,Erode,East'),(8877,'Erode,Moolapalayam,Erode,Railway,Colony'),(8878,'Bhavani,Erode,Bhavani,Kudal'),(8879,'Erode,Soolai,Chikkaiah,Naicker,College'),(8880,'Veerappanchatram,Chikkaiah,Naicker,College'),(8881,'Erode,Erode,Fort,Erode,East'),(8882,'Erode,Solar,Thindal,Erode,Railway,Colony'),(8883,'Anthiyur,Alampalayam'),(8884,'Erode,Thindal'),(8885,'Erode,Pudur,Erode,Railway,Colony'),(8886,'Erode,Teachers,Colony,Erode,Collectorate'),(8887,'Erode,Erode,Collectorate'),(8888,'Erode,Appakudal'),(8889,'Erode,Perundurai,Ingur'),(8890,'Erode,Sampath,Nagar,Erode,Collectorate'),(8891,'Erode,Erode,Collectorate'),(8892,'Erode,Erode,Fort,Erode,East'),(8893,'Erode,Kavilipalayam'),(8894,'Erode,Edayankattuvalsu'),(8895,'Erode,Chikkaiah,Naicker,College'),(8896,'Bhavani,Erode,Peria,Agraharam'),(8897,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(8898,'Erode,Kollampalayam,Arur,Karur,Erode,Railway,Colony'),(8899,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(8900,'Erode,Thirunagar,Colony,Gandhipuram,Karungalpalayam'),(8901,'Erode,Chikkaiah,Naicker,College'),(8902,'Andipalayam,Erode,Railway,Colony'),(8903,'Pappampalayam,Alampalayam,Seerampalayam'),(8904,'Erode,Komarapalayam,Kallankattuvalasu'),(8905,'Erode,Komarapalayam,Amoor,Kamaraj,Nagar,Karungalpalayam'),(8906,'Erode,Erode,East'),(8907,'Erode,Erode,Fort,Karungalpalayam'),(8908,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(8909,'Erode,Periyar,Nagar,Erode,East'),(8910,'Erode,Emur,Erode,East'),(8911,'Erode,Karungalpalayam'),(8912,'Erode,Periyar,Nagar,Erode,East'),(8913,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(8914,'Bhavani,Erode,Pudur,Peria,Agraharam'),(8915,'Ingur,Ingur'),(8916,'Erode,Moolapalayam,Nadarmedu,Erode,Railway,Colony'),(8917,'Erode,Thirunagar,Colony,Karungalpalayam'),(8918,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(8919,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(8920,'Bhavani,Kamaraj,Nagar,Bhavani,Kudal'),(8921,'Erode,Thindal'),(8922,'Erode,Periya,Valasu,Chikkaiah,Naicker,College'),(8923,'Erode,Chikkaiah,Naicker,College'),(8924,'Erode,Erode,Fort,Erode,East'),(8925,'Erode,Erode,Collectorate'),(8926,'Erode,Perundurai,Ingur'),(8927,'Thindal,Thindal'),(8928,'Erode,Edayankattuvalsu'),(8929,'Kaspapettai,Pudur,Elayampalayam,Avalpundurai'),(8930,'Erode,Pariyur,Ariyur,Kadukkampalayam'),(8931,'Erode,Chikkaiah,Naicker,College'),(8932,'Erode,Adaiyur,Kuttapalayam'),(8933,'Erode,Moolapalayam,Erode,Railway,Colony'),(8934,'Tiruchengodu,North,Tiruchengodu,North'),(8935,'Erode,Vairapalayam,Karungalpalayam'),(8936,'Erode,Chidambaram,Erode,East'),(8937,'Erode,Moolapalayam,Arur,Karur,Erode,Railway,Colony'),(8938,'Chithode,Chittode'),(8939,'Erode,Kanagapuram,Vadamugam,Vellode,Kanagapuram'),(8940,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(8941,'Erode,Kavandapadi,Vellankoil'),(8942,'Erode,Kavandapadi,Kalichettipalayam.,Mettupalayam'),(8943,'Dharmapuri,Public,Offices,Dharmapuri,Public,Offices'),(8944,'Erode,Karungalpalayam'),(8945,'Erode,Erode,Collectorate'),(8946,'Erode,Edayankattuvalsu'),(8947,'Erode,Thindal'),(8948,'Erode,Surampatti,Erode,East'),(8949,'Erode,Erode,Fort,Erode,East'),(8950,'Erode,Perundurai,Erode,Collectorate'),(8951,'Erode,Perundurai,Ingur'),(8952,'Erode,Sampath,Nagar,Erode,Collectorate'),(8953,'Chinnagoundanur,Chinnagoundanur'),(8954,'Erode,Chidambaram,Erode,East'),(8955,'Erode,Erode,East'),(8956,'Erode,Palayapalayam,Thindal'),(8957,'Erode,Perundurai,Kanagapuram'),(8958,'Erode,Erode,Railway,Colony'),(8959,'Erode,Erode,Collectorate'),(8960,'Erode,Moolapalayam,Arur,Karur,Erode,Railway,Colony'),(8961,'Erode,Thirunagar,Colony,Gandhipuram,Karungalpalayam'),(8962,'Erode,Erode,Fort,Erode,East'),(8963,'Erode,Erode,East'),(8964,'Erode,Ayal,Dharapuram,Erode,Railway,Colony'),(8965,'Erode,Edayankattuvalsu'),(8966,'Karumathampatti,Karumathampatti'),(8967,'Sathyamangalam,Kavilipalayam'),(8968,'Komarapalayam,Kammavarpalayam,Kallankattuvalasu'),(8969,'Erode,Perundurai,Erode,Collectorate'),(8970,'Erode,Solar,Erode,Railway,Colony'),(8971,'Erode,Chikkaiah,Naicker,College'),(8972,'Erode,Teachers,Colony,Erode,Collectorate'),(8973,'Chithode,Erode,Chittode'),(8974,'Anthiyur,Alampalayam'),(8975,'Erode,Erode,East'),(8976,'Erode,Perundurai,Ingur'),(8977,'Erode,Erode,Fort,Erode,East'),(8978,'Erode,Periyar,Nagar,Chidambaram,Erode,East'),(8979,'Erode,Railway,Colony,Edayankattuvalsu'),(8980,'Avalpoondurai,Erode,Dharapuram,Avalpundurai'),(8981,'Erode,Arasampatti,Thindal'),(8982,'Erode,Nasiyanur,Soolai,Anur,Chikkaiah,Naicker,College'),(8983,'Erode,Soolai,Chikkaiah,Naicker,College'),(8984,'Erode,Edayankattuvalsu'),(8985,'Erode,Erode,East'),(8986,'Erode,Nasiyanur,Anur,Thindal'),(8987,'Erode,Emur,Chikkaiah,Naicker,College'),(8988,'Erode,Suriyampalayam,Kalichettipalayam.,Mettupalayam'),(8989,'Erode,Erode,East'),(8990,'Erode,Erode,East'),(8991,'Perundurai,Ariyur,Chennimalai,Basuvapatti'),(8992,'Avalpundurai,Avalpundurai'),(8993,'Erode,Veerappanchatram,Voc,Park,Karungalpalayam'),(8994,'Agraharam,Perundurai,Ingur'),(8995,'Erode,Surampatti,Edayankattuvalsu'),(8996,'Erode,Agaram,Karungalpalayam'),(8997,'Bhavani,Jambai,Dalavoipettai'),(8998,'Erode,Erode,East'),(8999,'Erode,Perundurai,Erode,Collectorate'),(9000,'Komarapalayam,Kallankattuvalasu'),(9001,'Erode,Thindal'),(9002,'Sivagiri,Ammankoil'),(9003,'Erode,Perundurai,Erode,Collectorate'),(9004,'Erode,Erode,East'),(9005,'Erode,Erode,East'),(9006,'Erode,Kanagapuram'),(9007,'Kallankattuvalasu,Kallankattuvalasu'),(9008,'Erode,Perundurai,Ingur'),(9009,'Erode,Moolapalayam,Erode,Railway,Colony'),(9010,'Erode,Thirunagar,Colony,Karungalpalayam'),(9011,'Erode,Erode,Fort,Erode,East'),(9012,'Erode,Surampatti,Edayankattuvalsu'),(9013,'Erode,Erode,Fort,Erode,East'),(9014,'Erode,Chikkaiah,Naicker,College'),(9015,'Erode,Erode,Fort,Erode,East'),(9016,'Erode,Erode,East'),(9017,'Erode,Thindal,Thindal'),(9018,'Erode,Thindal'),(9019,'Komarapalayam,Kallankattuvalasu'),(9020,'Bhavani,Gangapuram,Perundurai,Chittode'),(9021,'Kollampalayam,Arur,Isur,Karur,Erode,Railway,Colony'),(9022,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(9023,'Erode,Erode,Fort,Erode,East'),(9024,'Erode,Thindal'),(9025,'Erode,Erode,East'),(9026,'Erode,Erode,Fort,Erode,East'),(9027,'Bhavani,Erode,Vasavi,College'),(9028,'Erode,Erode,East'),(9029,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(9030,'Erode,Perundurai,Vadamugam,Vellode,Gnanipalayam,Ingur'),(9031,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(9032,'Erode,Thindal'),(9033,'Erode,Thindal'),(9034,'Erode,Chikkaiah,Naicker,College'),(9035,'Erode,Marapalam,Erode,East'),(9036,'Erode,Thindal'),(9037,'Erode,Chettipalayam,Erode,Railway,Colony'),(9038,'Erode,Solar,Erode,Railway,Colony'),(9039,'Erode,Seerampalayam'),(9040,'Erode,Erode,East'),(9041,'Erode,Nasiyanur,Anur,Thindal'),(9042,'Erode,Chikkaiah,Naicker,College'),(9043,'Thirunagar,Colony,Karungalpalayam'),(9044,'Chithode,Erode,Perode,Chittode'),(9045,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(9046,'Erode,Chennimalai,Edayankattuvalsu'),(9047,'Bhavani,Erode,Bhavani,Kudal'),(9048,'Erode,Thindal'),(9049,'Erode,Gobichettipalayam,Chettipalayam,Gobichettipalayam'),(9050,'Erode,Soolai,Chikkaiah,Naicker,College'),(9051,'Erode,Rangampalayam,Edayankattuvalsu'),(9052,'Erode,Karungalpalayam'),(9053,'Erode,Thindal'),(9054,'Erode,Erode,East'),(9055,'Erode,Solar,Arur,Karur,Erode,Railway,Colony'),(9056,'Erode,Chidambaram,Edayankattuvalsu'),(9057,'Pallipalayam,Pallipalayam'),(9058,'Erode,Thindal,Thindal'),(9059,'Komarapalayam,Kallankattuvalasu'),(9060,'Kurichi,Coimbatore,Ganapathy'),(9061,'Erode,Kollampalayam,Arur,Karur,Erode,Railway,Colony'),(9062,'Erode,Teachers,Colony,Erode,Collectorate'),(9063,'Erode,Perundurai,Erode,Collectorate'),(9064,'Erode,Erode,East'),(9065,'Attur,Chennimalai,Kattur,Basuvapatti'),(9066,'Erode,Pallipalayam'),(9067,'Erode,Karungalpalayam'),(9068,'Erode,Vellankoil'),(9069,'Erode,Edayankattuvalsu'),(9070,'Erode,Erode,Railway,Colony'),(9071,'Chithode,Kanji,Chittode'),(9072,'Agraharam,Arasampalayam,Seerampalayam'),(9073,'Erode,Chidambaram,Erode,East'),(9074,'Nadarmedu,Erode,Railway,Colony'),(9075,'Erode,Erode,Collectorate'),(9076,'Erode,Perundurai,Eral,Edayankattuvalsu'),(9077,'Erode,Erode,Fort,Erode,East'),(9078,'Athani,Pudur,Chikkarasampalayam'),(9079,'Erode,Periyar,Nagar,Erode,East'),(9080,'Erode,Koottapalli'),(9081,'Erode,Perundurai,Ingur'),(9082,'Erode,Nasiyanur,Anur,Kadirampatti'),(9083,'Erode,Erode,East'),(9084,'Erode,Erode,East'),(9085,'Erode,Seerampalayam'),(9086,'Erode,Palayapalayam,Edayankattuvalsu'),(9087,'Erode,Peria,Agraharam'),(9088,'Erode,Perundurai,Ingur'),(9089,'Erode,Palayapalayam,Teachers,Colony,Erode,Collectorate'),(9090,'Erode,Erode,Collectorate'),(9091,'Nasiyanur,Anur,Kadirampatti'),(9092,'Kanchipuram,Kanchipuram,Collectorate'),(9093,'Erode,Edayankattuvalsu'),(9094,'Erode,Thindal'),(9095,'Erode,Thindal'),(9096,'Erode,Pallipalayam'),(9097,'Erode,Karungalpalayam'),(9098,'Erode,Palayapalayam,Teachers,Colony,Erode,Collectorate'),(9099,'Erode,Perundurai,Erode,Collectorate'),(9100,'Erode,Surampatti,Edayankattuvalsu'),(9101,'Bhavani,Bhavani,Kudal'),(9102,'Perundurai,Thindal,Thindal'),(9103,'Erode,Chidambaram,Erode,East'),(9104,'Pallipalayam,Pallipalayam'),(9105,'Kurichi,Idappadi,Chettimankurichi'),(9106,'Thindal,Thindal'),(9107,'Erode,Chennimalai,Kanagapuram'),(9108,'Kollampalayam,Arur,Karur,Erode,Railway,Colony'),(9109,'Erode,Gobichettipalayam,Chettipalayam,Kadukkampalayam'),(9110,'Adaiyur,Kuttapalayam'),(9111,'Erode,Perundurai,Erode,Collectorate'),(9112,'Komarapalayam,Kallankattuvalasu'),(9113,'Erode,Erode,Fort,Erode,East'),(9114,'Erode,Moolapalayam,Erode,Railway,Colony'),(9115,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(9116,'Erode,Surampatti,Edayankattuvalsu'),(9117,'Perundurai,Erode,Collectorate'),(9118,'Erode,Tiruchengodu,North'),(9119,'Erode,Perundurai,Erode,Collectorate'),(9120,'Erode,Erode,East'),(9121,'Erode,Tiruchengodu,North'),(9122,'Erode,Erode,Fort,Erode,East'),(9123,'Erode,Kanjikovil'),(9124,'Erode,Thindal'),(9125,'Erode,Emur,Chikkaiah,Naicker,College'),(9126,'Erode,Perundurai,Thindal'),(9127,'Erode,Kavandapadi,Kalichettipalayam.,Mettupalayam'),(9128,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(9129,'Erode,Solar,Erode,Railway,Colony'),(9130,'Varapalayam,Alapuram,Iruppu,Karaipudur'),(9131,'Erode,Surampatti,Erode,East'),(9132,'Erode,Arur,Karur,Erode,Railway,Colony'),(9133,'Erode,Narayana,Valasu,Nasiyanur,Anur,Erode,Collectorate'),(9134,'Erode,Erode,East'),(9135,'Seerampalayam,Seerampalayam'),(9136,'Erode,Moolapalayam,Erode,Railway,Colony'),(9137,'Thottipalayam,Chinniyampalayam,Coimbatore,Vellanaipatti'),(9138,'Erode,Erode,East'),(9139,'Erode,Erode,Fort,Erode,East'),(9140,'Erode,Periyar,Nagar,Erode,East'),(9141,'Erode,Erode,East'),(9142,'Erode,Erode,Fort,Erode,East'),(9143,'Erode,Erode,East'),(9144,'Erode,Ganapathipalayam,Arur,Athipalayam,Karur,Ganapathipalayam'),(9145,'Erode,Erode,East'),(9146,'Erode,Perundurai,Angunagar,Erode,Collectorate'),(9147,'Palayapalayam,Perundurai,Erode,Collectorate'),(9148,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(9149,'Agraharam,Seerampalayam'),(9150,'Erode,Perundurai,Thindal'),(9151,'Erode,Periya,Valasu,Chikkaiah,Naicker,College'),(9152,'Erode,Kollampalayam,Erode,Railway,Colony'),(9153,'Erode,Erode,Fort,Erode,East'),(9154,'Iruppu,Karaipudur'),(9155,'Erode,Perundurai,Vallipurathanpalayam,Kanagapuram'),(9156,'Erode,Teachers,Colony,Erode,Collectorate'),(9157,'Erode,Marapalam,Erode,East'),(9158,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(9159,'Ammapettai,Anthiyur,Bhavani,Erode,Ammapet,Ammapettai'),(9160,'Erode,Edayankattuvalsu'),(9161,'Erode,Teachers,Colony,Edayankattuvalsu'),(9162,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(9163,'Erode,Palayapalayam,Teachers,Colony,Edayankattuvalsu'),(9164,'Erode,Chettipalayam,Erode,Railway,Colony'),(9165,'Erode,Perundurai,Ingur'),(9166,'Chithode,Erode,Chittode'),(9167,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(9168,'Kambiliyampatti,Kambiliyampatti'),(9169,'Erode,Edayankattuvalsu'),(9170,'Erode,Perundurai,Ingur'),(9171,'Erode,Erode,Collectorate'),(9172,'Erode,Thindal'),(9173,'Erode,Erode,Fort,Erode,East'),(9174,'Erode,Chettipalayam,Erode,Railway,Colony'),(9175,'Erode,Thirunagar,Colony,Karungalpalayam'),(9176,'Erode,Perundurai,Erode,Collectorate'),(9177,'Erode,Erode,Fort,Erode,East'),(9178,'Erode,Kasipalayam,Kollampalayam,Arur,Karur,Erode,Railway,Colony'),(9179,'Erode,Moolapalayam,Chettipalayam,Erode,Railway,Colony'),(9180,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(9181,'Erode,Erode,Fort,Erode,East'),(9182,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(9183,'Erode,Karungalpalayam'),(9184,'Bhavani,Erode,Chikkaiah,Naicker,College'),(9185,'Pallipalayam,Pallipalayam'),(9186,'Erode,Surampatti,Edayankattuvalsu'),(9187,'Morur,Morur'),(9188,'Erode,Marapalam,Erode,East'),(9189,'Erode,Erode,East'),(9190,'Bhavani,Erode,Chikkaiah,Naicker,College'),(9191,'Erode,Erode,Fort,Erode,Collectorate'),(9192,'Erode,Erode,East'),(9193,'Erode,Erode,Fort,Erode,East'),(9194,'Erode,Perundurai,Thindal,Thindal'),(9195,'Erode,Perundurai,Erode,Collectorate'),(9196,'Erode,Moolapalayam,Erode,Railway,Colony'),(9197,'Erode,Kalpalayam,Erode,Railway,Colony'),(9198,'Emur,Chikkaiah,Naicker,College'),(9199,'Erode,Erode,East'),(9200,'Erode,Chidambaram,Erode,East'),(9201,'Erode,Pudur,Solar,Erode,Railway,Colony'),(9202,'Erode,Karungalpalayam'),(9203,'Erode,Kalpalayam,Erode,Railway,Colony'),(9204,'Erode,Palayapalayam,Thindal'),(9205,'Erode,Moolapalayam,Kanji,Erode,Railway,Colony'),(9206,'Erode,Marapalam,Erode,East'),(9207,'Hogenakkal,Dinnabelur'),(9208,'Erode,Arasampatti,Kadirampatti'),(9209,'Kasipalayam,Erode,Railway,Colony'),(9210,'Erode,Thindal'),(9211,'Erode,Solar,Arur,Karur,Erode,Railway,Colony'),(9212,'Erode,Erode,Fort,Erode,East'),(9213,'Erode,Erode,East'),(9214,'Erode,Erode,East'),(9215,'Erode,Palayapalayam,Erode,Collectorate'),(9216,'Kattampatti,Bilichi'),(9217,'Erode,Thindal,Kanagapuram'),(9218,'Erode,Surampatti,Erode,East'),(9219,'Erode,Sampath,Nagar,Erode,Collectorate'),(9220,'Karungalpalayam,Karungalpalayam'),(9221,'Thottipalayam,Kathankanni,Tea,Nagar'),(9222,'Erode,Moolapalayam,Nadarmedu,Arur,Karur,Erode,Railway,Colony'),(9223,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(9224,'Erode,Chennimalai,Edayankattuvalsu'),(9225,'Erode,Karungalpalayam'),(9226,'Erode,Chikkaiah,Naicker,College'),(9227,'Erode,Erode,Fort,Erode,East'),(9228,'Erode,Palayapalayam,Erode,Collectorate'),(9229,'Erode,Erode,East'),(9230,'Erode,Periya,Valasu,Chikkaiah,Naicker,College'),(9231,'Iruppu,Ayyankalipalayam'),(9232,'Erode,Thindal,Thindal'),(9233,'Erode,Erode,East'),(9234,'Erode,Perundurai,Thindal'),(9235,'Erode,Erode,Collectorate'),(9236,'Erode,Solar,Arur,Karur,Erode,Railway,Colony'),(9237,'Erode,Erode,East'),(9238,'Erode,Karungalpalayam'),(9239,'Erode,Thindal,Thindal'),(9240,'Erode,Ganapathy,Chikkaiah,Naicker,College'),(9241,'Thindal,Thindal'),(9242,'Erode,Solar,Erode,Railway,Colony'),(9243,'Erode,Palayapalayam,Thindal'),(9244,'Erode,Erode,East'),(9245,'Erode,Chikkaiah,Naicker,College'),(9246,'Erode,Chikkaiah,Naicker,College'),(9247,'Bhavani,Erode,Chikkaiah,Naicker,College'),(9248,'Erode,Erode,East'),(9249,'Erode,Erode,East'),(9250,'Erode,Erode,Fort,Erode,East'),(9251,'Erode,Erode,Collectorate'),(9252,'Erode,Erode,East'),(9253,'Kavindapadi,Kanjikovil'),(9254,'Erode,Chikkaiah,Naicker,College'),(9255,'Sivagiri,Ammankoil'),(9256,'Erode,Chikkaiah,Naicker,College'),(9257,'Kurichi,Bodupatti'),(9258,'Erode,Erode,East'),(9259,'Pallipalayam,Pallipalayam'),(9260,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(9261,'Erode,Chittode'),(9262,'Erode,Karungalpalayam'),(9263,'Erode,Dharapuram,Erode,Railway,Colony'),(9264,'Gobichettipalayam,Kullampalayam,Chettipalayam,Kadukkampalayam'),(9265,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(9266,'Annur,Kannur,Karumathampatti,Karumathampatti'),(9267,'Erode,Erode,East'),(9268,'Erode,Chettipalayam,Erode,Railway,Colony'),(9269,'Sathyamangalam,Avalpundurai'),(9270,'Muncipal,Colony,Veerappanchatram,Chikkaiah,Naicker,College'),(9271,'Erode,Railway,Colony,Erode,East'),(9272,'Erode,Ganapathy,Erode,East'),(9273,'Anthiyur,Alampalayam'),(9274,'Erode,Surampatti,Edayankattuvalsu'),(9275,'Erode,Thindal,Thindal'),(9276,'Erode,Karungalpalayam'),(9277,'Bhavani,Erode,Erode,East'),(9278,'Chithode,Chittode'),(9279,'Erode,Erode,Fort,Erode,East'),(9280,'Erode,Erode,Fort,Erode,East'),(9281,'Erode,Erode,Collectorate'),(9282,'Erode,Muncipal,Colony,Veerappanchatram,Chikkaiah,Naicker,College'),(9283,'Perundurai,Ingur'),(9284,'Erode,Erode,East'),(9285,'Erode,Chidambaram,Erode,East'),(9286,'Erode,Palakarai'),(9287,'Erode,Athipalayam,Uppupalayam'),(9288,'Erode,Chikkaiah,Naicker,College'),(9289,'Erode,Moolapalayam,Erode,Railway,Colony'),(9290,'Erode,Surampatti,Edayankattuvalsu'),(9291,'Erode,Erode,East'),(9292,'Pallipalayam,Pallipalayam'),(9293,'Erode,Surampatti,Edayankattuvalsu'),(9294,'Erode,Perundurai,Ingur'),(9295,'Erode,Karungalpalayam'),(9296,'Erode,Moolapalayam,Erode,Railway,Colony'),(9297,'Erode,Erode,Fort,Erode,East'),(9298,'Erode,Kali,Bhavani,Kudal'),(9299,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(9300,'Erode,Erode,Fort,Erode,East'),(9301,'Bhavani,Bhavani,Kudal'),(9302,'Erode,Chidambaram,Erode,East'),(9303,'Erode,Erode,Collectorate'),(9304,'Erode,Erode,Fort,Erode,East'),(9305,'Agraharam,Bhavani,Erode,Peria,Agraharam'),(9306,'Anampatti,Avanam,Coimbatore,Keeranatham'),(9307,'Erode,Erode,East'),(9308,'Erode,Thindal,Thindal'),(9309,'Erode,Edayankattuvalsu'),(9310,'Ayal,Pallipalayam'),(9311,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(9312,'Erode,Kollampalayam,Arur,Karur,Erode,Railway,Colony'),(9313,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(9314,'Erode,Pallipalayam'),(9315,'Erode,Erode,Collectorate'),(9316,'Erode,Elumathur'),(9317,'Erode,Erode,East'),(9318,'Nadayanur,Nadayanur'),(9319,'Erode,Moolapalayam,Teachers,Colony,Edayankattuvalsu'),(9320,'Erode,Nasiyanur,Anur,Thindal'),(9321,'Erode,Chennimalai,Erode,East'),(9322,'Thamaraipalayam,Thamaraipalayam'),(9323,'Erode,Perundurai,Thindal,Thindal'),(9324,'Chithode,Chittode'),(9325,'Thindal,Thindal'),(9326,'Anthiyur,Bhavani,Erode,Peria,Agraharam'),(9327,'Erode,Surampatti,Erode,East'),(9328,'Erode,Soolai,Chikkaiah,Naicker,College'),(9329,'Erode,Nasiyanur,Sampath,Nagar,Anur,Erode,Collectorate'),(9330,'Erode,Periyar,Nagar,Erode,East'),(9331,'Chithode,Erode,Chikkaiah,Naicker,College'),(9332,'Anthiyur,Erode,Kannadipalayam'),(9333,'Chithode,Erode,Chittode'),(9334,'Erode,Chikkaiah,Naicker,College'),(9335,'Erode,Marapalam,Karungalpalayam'),(9336,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(9337,'Karungalpalayam,Arungal,Erode,East'),(9338,'Erode,Palayapalayam,Edayankattuvalsu'),(9339,'Erode,Kollampalayam,Erode,Railway,Colony'),(9340,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(9341,'Chikkaiah,Naicker,College,Chikkaiah,Naicker,College'),(9342,'Erode,Moolapalayam,Arur,Karur,Erode,Railway,Colony'),(9343,'Erode,Periyar,Nagar,Surampatti,Erode,East'),(9344,'Erode,Thindal,Thindal'),(9345,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(9346,'Erode,Erode,Fort,Erode,East'),(9347,'Kallankattuvalasu,Kallankattuvalasu'),(9348,'Erode,Erode,Collectorate'),(9349,'Ammapettai,Anthiyur,Bhavani,Ammapet,Ammapettai'),(9350,'Erode,Erode,East'),(9351,'Chithode,Chittode'),(9352,'Erode,Teachers,Colony,Erode,Collectorate'),(9353,'Bhavani,Erode,Kali,Bhavani,Kudal'),(9354,'Bhavani,Erode,Peria,Agraharam'),(9355,'Erode,Vairapalayam,Karungalpalayam'),(9356,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(9357,'Erode,Palayapalayam,Perundurai,Thindal'),(9358,'Erode,Chikkaiah,Naicker,College'),(9359,'Agraharam,Erode,Chikkaiah,Naicker,College'),(9360,'Erode,Ellapalayam,Emur,Chikkaiah,Naicker,College'),(9361,'Erode,Erode,Collectorate'),(9362,'Erode,Erode,East'),(9363,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(9364,'Erode,Thirunagar,Colony,Karungalpalayam'),(9365,'Erode,Edayankattuvalsu'),(9366,'Erode,Erode,East'),(9367,'Erode,Lakkapuram,Muthugoundanpalayam,Erode,Railway,Colony'),(9368,'Kasthuripatti,Kasthuripatti'),(9369,'Erode,Muncipal,Colony,Karungalpalayam'),(9370,'Erode,Soolai,Chikkaiah,Naicker,College'),(9371,'Erode,Chikkaiah,Naicker,College'),(9372,'Paruvachi,Dalavoipettai'),(9373,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(9374,'Erode,Erode,East'),(9375,'Erode,Dindal,Thindal'),(9376,'Thindal,Kanagapuram'),(9377,'Avalpoondurai,Erode,Chettipalayam,Erode,Railway,Colony'),(9378,'Erode,Solar,Erode,Railway,Colony'),(9379,'Erode,Surampatti,Edayankattuvalsu'),(9380,'Erode,Moolapalayam,Erode,Railway,Colony'),(9381,'Erode,Palayapalayam,Erode,Collectorate'),(9382,'Erode,Erode,East'),(9383,'Erode,Erode,East'),(9384,'Karungalpalayam,Arungal,Karungalpalayam'),(9385,'Erode,Kokkarayanpettai,Sivagiri,Erode,East'),(9386,'Erode,Erode,Fort,Erode,East'),(9387,'Gobichettipalayam,Chettipalayam,Karattadipalayam,Alukuli'),(9388,'Erode,Pallipalayam'),(9389,'Chinnapuliyur,Erode,Bhavani,Kudal'),(9390,'Erode,Palayapalayam,Erode,Collectorate'),(9391,'Nallur,Allur,Dindigul,Samayanallur'),(9392,'Erode,Perundurai,Kadirampatti'),(9393,'Erode,Moolapalayam,Arur,Karur,Erode,Railway,Colony'),(9394,'Erode,Erode,Railway,Colony'),(9395,'Erode,Chikkaiah,Naicker,College'),(9396,'Erode,Thindal,Thindal'),(9397,'Anthiyur,Alampalayam'),(9398,'Erode,Karungalpalayam'),(9399,'Erode,Emur,Chikkaiah,Naicker,College'),(9400,'Gobichettipalayam,Kottupullampalayam,Chettipalayam,Alukuli'),(9401,'Erode,Chennimalai,Erode,East'),(9402,'Erode,Edayankattuvalsu'),(9403,'Komarapalayam,Kallankattuvalasu'),(9404,'Erode,Gandhipuram,Karungalpalayam'),(9405,'Bhavani,Perundurai,Ingur'),(9406,'Erode,Erode,East'),(9407,'Boodanahalli,Boodanahalli'),(9408,'Erode,Kavandapadi,Kalichettipalayam.,Mettupalayam'),(9409,'Kalpatti,Chettichavadi'),(9410,'Erode,Karungalpalayam'),(9411,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(9412,'Erode,Surampatti,Edayankattuvalsu'),(9413,'Erode,Perundurai,Thindal'),(9414,'Erode,Perundurai,Sampath,Nagar,Edayankattuvalsu'),(9415,'Erode,Erode,Fort,Erode,East'),(9416,'Gobichettipalayam,Kavandapadi,Chettipalayam,Kalichettipalayam.,Mettupalayam'),(9417,'Erode,Perundurai,Athur,Ingur'),(9418,'Periya,Valasu,Chikkaiah,Naicker,College'),(9419,'Erode,Thindal'),(9420,'Erode,Palayapalayam,Thindal'),(9421,'Erode,Erode,Fort,Erode,East'),(9422,'Erode,Surampatti,Erode,East'),(9423,'Erode,Erode,Collectorate'),(9424,'Erode,Karungalpalayam'),(9425,'Erode,Karungalpalayam'),(9426,'Erode,Perundurai,Erode,Collectorate'),(9427,'Chithode,Coimbatore,Chittode'),(9428,'Agraharam,Bhavani,Erode,Peria,Agraharam'),(9429,'Erode,Erode,Fort,Erode,East'),(9430,'Perundurai,Ingur'),(9431,'Erode,Erode,Fort,Erode,East'),(9432,'Elur,Tiruchengodu,North'),(9433,'Erode,Erode,East'),(9434,'Erode,Karungalpalayam'),(9435,'Erode,Teachers,Colony,Erode,Collectorate'),(9436,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(9437,'Erode,Erode,East'),(9438,'Erode,Erode,Fort,Erode,East'),(9439,'Erode,Erode,Collectorate'),(9440,'Erode,Erode,Fort,Erode,East'),(9441,'Erode,Perundurai,Erode,Collectorate'),(9442,'Erode,Chittode'),(9443,'Erode,Erode,East'),(9444,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(9445,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(9446,'Marapalam,Erode,East'),(9447,'Erode,Soolai,Chikkaiah,Naicker,College'),(9448,'Erode,Teachers,Colony,Erode,Collectorate'),(9449,'Erode,Erode,East'),(9450,'Erode,Perundurai,Thindal,Kanagapuram'),(9451,'Erode,Erode,East'),(9452,'Erode,Ganapathi,Nagar,Thindal'),(9453,'Erode,Erode,East'),(9454,'Erode,Erode,East'),(9455,'Erode,Erode,Railway,Colony'),(9456,'Erode,Erode,East'),(9457,'Erode,Erode,Fort,Erode,East'),(9458,'Erode,Kasipalayam,Chennimalai,Edayankattuvalsu'),(9459,'Erode,Thindal,Thindal'),(9460,'Erode,Thindal,Thindal'),(9461,'Erode,Elumathur'),(9462,'Erode,Thindal,Thindal'),(9463,'Erode,Chidambaram,Erode,East'),(9464,'Thingalur,Nichampalayam'),(9465,'Komarapalayam,Kallankattuvalasu'),(9466,'Erode,Edayankattuvalsu'),(9467,'Erode,Moolapalayam,Erode,Railway,Colony'),(9468,'Erode,Chikkaiah,Naicker,College'),(9469,'Erode,Marapalam,Surampatti,Erode,East'),(9470,'Erode,Erode,Fort,Veerappanchatram,Erode,East'),(9471,'Erode,Karungalpalayam'),(9472,'Erode,Sampath,Nagar,Erode,Collectorate'),(9473,'Erode,Kasipalayam,Erode,East'),(9474,'Erode,Chettipalayam,Erode,Railway,Colony'),(9475,'Unjanaigoundampalayam,Unjanaigoundampalayam'),(9476,'Erode,Erode,Railway,Colony'),(9477,'Erode,Teachers,Colony,Erode,Collectorate'),(9478,'Erode,Chikkaiah,Naicker,College'),(9479,'Erode,Erode,Collectorate'),(9480,'Kurichi,Modakurichi,Ganapathipalayam'),(9481,'Kanagapuram,Kanagapuram'),(9482,'Erode,Perundurai,Erode,Collectorate'),(9483,'Erode,Perundurai,Chennimalai,Ingur'),(9484,'Erode,Kalpalayam,Erode,Railway,Colony'),(9485,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(9486,'Erode,Edayankattuvalsu'),(9487,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(9488,'Erode,Kollampalayam,Moolapalayam,Isur,Erode,Railway,Colony'),(9489,'Bhavani,Devagoundanur'),(9490,'Erode,Periyar,Nagar,Chennimalai,Erode,East'),(9491,'Bhavani,Kamaraj,Nagar,Bhavani,Kudal'),(9492,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(9493,'Erode,Erode,Fort,Erode,East'),(9494,'Erode,Karungalpalayam'),(9495,'Nasiyanur,Anur,Thindal'),(9496,'Erode,Arur,Karur,Erode,Railway,Colony'),(9497,'Anthiyur,Burgur,Alampalayam'),(9498,'Erode,Manickampalayam,Chikkaiah,Naicker,College'),(9499,'Erode,Erode,Railway,Colony'),(9500,'Erode,Edayankattuvalsu'),(9501,'Erode,Edayankattuvalsu'),(9502,'Erode,Perundurai,Thindal'),(9503,'Erode,Erode,East'),(9504,'Erode,Palayapalayam,Erode,Collectorate'),(9505,'Erode,Erode,Collectorate'),(9506,'Unjanaigoundampalayam,Unjanaigoundampalayam'),(9507,'Erode,Palayapalayam,Erode,Collectorate'),(9508,'Erode,Karungalpalayam'),(9509,'Erode,Karungalpalayam'),(9510,'Erode,Periyar,Nagar,Erode,East'),(9511,'Erode,Edayankattuvalsu'),(9512,'Chithode,Chittode'),(9513,'Erode,Thindal,Thindal'),(9514,'Erode,Erode,East'),(9515,'Pallipalayam,Pallipalayam'),(9516,'Erode,Chikkaiah,Naicker,College'),(9517,'Erode,Vasavi,College'),(9518,'Komarapalayam,Kallankattuvalasu'),(9519,'Erode,Erode,East'),(9520,'Kolathupalayam,Mukasipidariyur,Ariyur,Chennimalai,Basuvapatti'),(9521,'Erode,Erode,Fort,Marapalam,Erode,East'),(9522,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(9523,'Seerampalayam,Seerampalayam'),(9524,'Coimbatore,Gandhimaanagar'),(9525,'Erode,Perundurai,Thindal'),(9526,'Erode,Karungalpalayam'),(9527,'Erode,Basuvapatti'),(9528,'Erode,Pallipalayam'),(9529,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(9530,'Erode,Erode,Fort,Erode,East'),(9531,'Erode,Erode,Railway,Colony'),(9532,'Erode,Erode,East'),(9533,'Erode,Chikkaiah,Naicker,College'),(9534,'Bhavani,Kali,Vasavi,College'),(9535,'Erode,Nadarmedu,Railway,Colony,Erode,Railway,Colony'),(9536,'Erode,Moolapalayam,Arur,Karur,Erode,Railway,Colony'),(9537,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(9538,'Erode,Chittode'),(9539,'Erode,Perundurai,Thindal'),(9540,'Erode,Erode,East'),(9541,'Erode,Edayankattuvalsu'),(9542,'Arur,Karur,Karungalpalayam'),(9543,'Gobichettipalayam,Pariyur,Ariyur,Chettipalayam,Kadukkampalayam'),(9544,'Erode,Erode,East'),(9545,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(9546,'Sathyamangalam,Kavilipalayam'),(9547,'Erode,Erode,Fort,Erode,East'),(9548,'Erode,Solar,Arur,Karur,Erode,Railway,Colony'),(9549,'Erode,Thindal'),(9550,'Erode,Perundurai,Ichanda,Ingur'),(9551,'Erode,Erode,Fort,Erode,East'),(9552,'Erode,Moolapalayam,Erode,Railway,Colony'),(9553,'Erode,Kollampalayam,Erode,Railway,Colony'),(9554,'Erode,Erode,East'),(9555,'Thingalur,Ambal,Nichampalayam'),(9556,'Pallipalayam,Pallipalayam'),(9557,'Erode,Surampatti,Edayankattuvalsu'),(9558,'Pallipalayam,Pallipalayam'),(9559,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(9560,'Erode,Emur,Chikkaiah,Naicker,College'),(9561,'Erode,Nasiyanur,Perundurai,Anur,Kadirampatti'),(9562,'Erode,Erode,Collectorate'),(9563,'Erode,Kadirampatti'),(9564,'Erode,Chikkaiah,Naicker,College'),(9565,'Erode,Erode,Fort,Marapalam,Erode,East'),(9566,'Erode,Chikkaiah,Naicker,College'),(9567,'Erode,Marapalam,Karungalpalayam'),(9568,'Ammapettai,Erode,Kasipalayam,Rangampalayam,Ammapet,Kanagapuram'),(9569,'Erode,Perundurai,Kadirampatti'),(9570,'Erode,Erode,Fort,Erode,East'),(9571,'Erode,Erode,Fort,Erode,East'),(9572,'Erode,Kasipalayam,Solar,Erode,Railway,Colony'),(9573,'Erode,Kathirampatti,Perundurai,Kadirampatti'),(9574,'Arachalur,Erode,Avalpundurai'),(9575,'Erode,Periyar,Nagar,Erode,East'),(9576,'46,Pudur,Erode,Kollampalayam,Moolapalayam,Pudur,Erode,Railway,Colony'),(9577,'Erode,Thindal,Thindal'),(9578,'Chinnamalai,Nadarmedu,Erode,Railway,Colony'),(9579,'Erode,Teachers,Colony,Erode,Collectorate'),(9580,'Palayapalayam,Perundurai,Thindal'),(9581,'Kalpalayam,Erode,Railway,Colony'),(9582,'Erode,Palayapalayam,Erode,Collectorate'),(9583,'Erode,Erode,Collectorate'),(9584,'Pallipalayam,Pallipalayam'),(9585,'Erode,Mangalapatti'),(9586,'Erode,Erode,Railway,Colony'),(9587,'Erode,Nasiyanur,Anur,Arasampatti,Thindal'),(9588,'Bhavani,Bhavani,Kudal'),(9589,'Erode,Erode,East'),(9590,'Erode,Erode,Fort,Erode,East'),(9591,'Erode,Chikkaiah,Naicker,College'),(9592,'Erode,Ingur'),(9593,'Erode,Erode,Fort,Erode,East'),(9594,'Erode,Teachers,Colony,Edayankattuvalsu'),(9595,'Bhavani,Erode,Erode,Fort,Erode,East'),(9596,'Perundurai,Kanji,Kanjikovil,Ingur'),(9597,'Erode,Perundurai,Kadirampatti'),(9598,'Erode,Erode,Railway,Colony'),(9599,'Erode,Periyar,Nagar,Erode,East'),(9600,'Chithode,Erode,Chikkaiah,Naicker,College'),(9601,'Bhavani,Kalpalayam,Dalavoipettai'),(9602,'Erode,Erode,Fort,Erode,East'),(9603,'Erode,Mukasipidariyur,Periyar,Nagar,Ariyur,Basuvapatti'),(9604,'Erode,Marapalam,Surampatti,Erode,East'),(9605,'Erode,Palayapalayam,Erode,Collectorate'),(9606,'Erode,Erode,Fort,Karungalpalayam'),(9607,'Erode,Teachers,Colony,Erode,Collectorate'),(9608,'Golenpet,Golenpet'),(9609,'Erode,Arasampatti,Ellapalayam,Kadirampatti'),(9610,'Erode,Periyar,Nagar,Erode,East'),(9611,'Erode,Chikkaiah,Naicker,College'),(9612,'Erode,Arimalam,Erode,East'),(9613,'Erode,Erode,East'),(9614,'Gobichettipalayam,Chettipalayam,Gobichettipalayam'),(9615,'Erode,Seerampalayam'),(9616,'Erode,Pallipalayam'),(9617,'Erode,Moolapalayam,Erode,Railway,Colony'),(9618,'Erode,Thindal,Thindal'),(9619,'Erode,Erode,Collectorate'),(9620,'Komarapalayam,Chinnagoundanur'),(9621,'Elur,Tiruchengodu,North'),(9622,'Erode,Kathirampatti,Nanjanapuram,Kadirampatti'),(9623,'Erode,Perundurai,Kanagapuram'),(9624,'Erode,Rangampalayam,Edayankattuvalsu'),(9625,'Erode,Perundurai,Erode,Collectorate'),(9626,'Erode,Soolai,Chikkaiah,Naicker,College'),(9627,'Erode,Arur,Karur,Erode,Railway,Colony'),(9628,'Nasiyanur,Sampath,Nagar,Anur,Erode,Collectorate'),(9629,'Perundurai,Kadirampatti'),(9630,'Erode,Erode,Collectorate'),(9631,'Erode,Karungalpalayam'),(9632,'Erode,Erode,Collectorate'),(9633,'Erode,Gobichettipalayam,Chettipalayam,Gobichettipalayam'),(9634,'Erode,Erode,East'),(9635,'Erode,Erode,Fort,Erode,East'),(9636,'Erode,Arur,Karur,Erode,Railway,Colony'),(9637,'Ammapettai,Bhavani,Erode,Ammapet,Ammapettai'),(9638,'Erode,Chikkaiah,Naicker,College'),(9639,'Erode,Periyar,Nagar,Erode,East'),(9640,'Erode,Erode,Fort,Erode,East'),(9641,'Erode,Chidambaram,Erode,East'),(9642,'Erode,Gangapuram,Chittode'),(9643,'Erode,Erode,Collectorate'),(9644,'Erode,Arur,Karur,Erode,Railway,Colony'),(9645,'Erode,Chettipalayam,Erode,Railway,Colony'),(9646,'Erode,Edayankattuvalsu'),(9647,'Komarapalayam,Chinnagoundanur'),(9648,'Erode,Muncipal,Colony,Karungalpalayam'),(9649,'Erode,Kamaraj,Nagar,Erode,Railway,Colony'),(9650,'Pallipalayam,Pallipalayam'),(9651,'Erode,Periyar,Nagar,Erode,East'),(9652,'Erode,Erode,Collectorate'),(9653,'Kilampadi,Arur,Karur,Kolanalli'),(9654,'Erode,Erode,Fort,Erode,East'),(9655,'Erode,Chikkaiah,Naicker,College'),(9656,'Kavandapadi,Kalichettipalayam.,Mettupalayam'),(9657,'Erode,Pallipalayam'),(9658,'Erode,Edayankattuvalsu'),(9659,'Erode,Erode,East'),(9660,'Erode,Karungalpalayam'),(9661,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(9662,'Erode,Perundurai,Thindal,Thindal'),(9663,'Erode,Erode,Collectorate'),(9664,'Pallipalayam,Pallipalayam'),(9665,'Erode,Solar,Arur,Karur,Erode,Railway,Colony'),(9666,'Erode,Ellapalayam,Emur,Chikkaiah,Naicker,College'),(9667,'Erode,Chikkaiah,Naicker,College'),(9668,'Erode,Surampatti,Edayankattuvalsu'),(9669,'Nasiyanur,Anur,Kadirampatti'),(9670,'Erode,Sampath,Nagar,Erode,Collectorate'),(9671,'Erode,Gobichettipalayam,Modachur,Achur,Chettipalayam,Kadukkampalayam'),(9672,'Komarapalayam,Kallankattuvalasu'),(9673,'Kambiliyampatti,Kambiliyampatti'),(9674,'Erode,Karungalpalayam'),(9675,'Erode,Nasiyanur,Anur,Thindal'),(9676,'Erode,Thindal,Thindal'),(9677,'Erode,Muncipal,Colony,Karungalpalayam'),(9678,'Erode,Erode,Fort,Erode,East'),(9679,'Erode,Suriyampalayam,Peria,Agraharam'),(9680,'Erode,Erode,Collectorate'),(9681,'Arasampatti,Kaikatti,Edayankattuvalsu'),(9682,'Erode,Karungalpalayam'),(9683,'Erode,Edayankattuvalsu'),(9684,'Agraharam,Erode,Erode,East'),(9685,'Erode,Erode,Fort,Erode,East'),(9686,'Chithode,Erode,Chikkaiah,Naicker,College'),(9687,'Erode,Ganapathipalayam'),(9688,'Erode,Erode,Fort,Erode,East'),(9689,'Erode,Kollampalayam,Arur,Karur,Erode,Railway,Colony'),(9690,'Perundurai,Ingur'),(9691,'Erode,Erode,East'),(9692,'Erode,Perundurai,Erode,Collectorate'),(9693,'Erode,Erode,East'),(9694,'Erode,Thindal'),(9695,'Erode,Lakkapuram,Agamalai,Erode,Railway,Colony'),(9696,'Erode,Chikkaiah,Naicker,College'),(9697,'Erode,Thindal'),(9698,'Rangampalayam,Edayankattuvalsu'),(9699,'Erode,Pudur,Erode,Railway,Colony'),(9700,'Erode,Chikkaiah,Naicker,College'),(9701,'Erode,Solar,Erode,Railway,Colony'),(9702,'Erode,Erode,Fort,Erode,East'),(9703,'Pallipalayam,Pallipalayam'),(9704,'Perundurai,Kanji,Kanjikovil,Kanjikovil'),(9705,'Erode,Erode,Collectorate'),(9706,'Sathyamangalam,Chikkarasampalayam'),(9707,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(9708,'Coimbatore,Karumathampatti'),(9709,'Erode,Pudur,Peria,Agraharam'),(9710,'Erode,Chikkaiah,Naicker,College'),(9711,'Erode,Erode,East'),(9712,'Erode,Erode,Collectorate'),(9713,'Erode,Chikkaiah,Naicker,College'),(9714,'Dharmapuri,Kalichettipalayam.,Mettupalayam'),(9715,'Erode,Erode,East'),(9716,'Erode,Chikkaiah,Naicker,College'),(9717,'Thindal,Thindal'),(9718,'Erode,Erode,Collectorate'),(9719,'Erode,Periyar,Nagar,Erode,East'),(9720,'Erode,Chittode'),(9721,'Erode,Moolapalayam,Erode,Railway,Colony'),(9722,'Erode,Arasampatti,Kadirampatti'),(9723,'Erode,Rangampalayam,Edayankattuvalsu'),(9724,'Erode,Marapalam,Erode,East'),(9725,'Erode,Thindal,Thindal'),(9726,'Akkaraikodiveri,Gobichettipalayam,Chettipalayam,Karai,Akkaraikodiveri'),(9727,'Erode,Vairapalayam,Karungalpalayam'),(9728,'Erode,Chikkaiah,Naicker,College'),(9729,'Erode,Perundurai,Erode,Collectorate'),(9730,'Erode,Karungalpalayam'),(9731,'Erode,Kolanalli'),(9732,'Perundurai,Thingalur,Palakarai'),(9733,'Kuttapalayam,Kuttapalayam'),(9734,'Erode,Erode,East'),(9735,'Thirunagar,Colony,Karungalpalayam'),(9736,'Erode,Chikkaiah,Naicker,College'),(9737,'Erode,Palakarai'),(9738,'Palayapalayam,Thindal'),(9739,'Erode,Edayankattuvalsu'),(9740,'Erode,Pudur,Solar,Erode,Railway,Colony'),(9741,'Erode,Moolapalayam,Erode,Railway,Colony'),(9742,'Erode,Chidambaram,Erode,East'),(9743,'Gobichettipalayam,Nambiyur,Chettipalayam,Talguni'),(9744,'Erode,Palayapalayam,Erode,Collectorate'),(9745,'Erode,Moolapalayam,Erode,Railway,Colony'),(9746,'Erode,Erode,East'),(9747,'Erode,Perundurai,Thindal'),(9748,'Bhavani,Kali,Bhavani,Kudal'),(9749,'Erode,Edayankattuvalsu'),(9750,'Erode,Rangampalayam,Chennimalai,Edayankattuvalsu'),(9751,'Erode,Erode,East'),(9752,'Erode,Chidambaram,Erode,East'),(9753,'Erode,Perundurai,Erode,Collectorate'),(9754,'Erode,Perundurai,Kadirampatti'),(9755,'Chettipalayam,Erode,Railway,Colony'),(9756,'Erode,Erode,East'),(9757,'Erode,Erode,Fort,Erode,East'),(9758,'Agraharam,Erode,Peria,Agraharam'),(9759,'Erode,Perundurai,Erode,Railway,Colony'),(9760,'Erode,Erode,East'),(9761,'Kali,Bhavani,Kudal'),(9762,'Erode,Kavilipalayam'),(9763,'Erode,Muncipal,Colony,Veerappanchatram,Chikkaiah,Naicker,College'),(9764,'Erode,Erode,Railway,Colony'),(9765,'Erode,Pallipalayam'),(9766,'Erode,Erode,Collectorate'),(9767,'Dalavoipettai,Dalavoipettai'),(9768,'Erode,Erode,Fort,Erode,East'),(9769,'Erode,Lakkapuram,Erode,Railway,Colony'),(9770,'Erode,Lakkapuram,Erode,Railway,Colony'),(9771,'Bhavani,Bhavani,Kudal'),(9772,'Erode,Erode,East'),(9773,'Erode,Chikkaiah,Naicker,College'),(9774,'Erode,Vasavi,College'),(9775,'Erode,East,Erode,East'),(9776,'Erode,Surampatti,Edayankattuvalsu'),(9777,'Erode,Chettipalayam,Erode,Railway,Colony'),(9778,'Erode,Erode,Collectorate'),(9779,'Erode,Nasiyanur,Anur,Kadirampatti'),(9780,'Erode,Erode,Fort,Erode,East'),(9781,'Erode,Adiyur,Anaipalayam'),(9782,'Erode,Arur,Chinniyampalayam,Karur,Elumathur'),(9783,'Veerappanchatram,Chikkaiah,Naicker,College'),(9784,'Kalpatti,Chettichavadi'),(9785,'Erode,Zamin,Elampalli'),(9786,'Erode,Erode,Fort,Erode,Collectorate'),(9787,'Erode,Periyar,Nagar,Erode,East'),(9788,'Erode,Palayapalayam,Erode,Collectorate'),(9789,'Erode,Erode,Collectorate'),(9790,'Erode,Thingalur,Nichampalayam'),(9791,'Erode,Erode,East'),(9792,'Erode,Nallur,Nasiyanur,Allur,Anur,Thindal'),(9793,'Gobichettipalayam,Chettipalayam,Kallipatti,Gobichettipalayam'),(9794,'Erode,Erode,East'),(9795,'Erode,Thindal'),(9796,'Erode,Railway,Colony,Erode,Railway,Colony'),(9797,'Erode,Emur,Peria,Agraharam'),(9798,'Seerampalayam,Seerampalayam'),(9799,'Erode,Lakkapuram,Erode,Railway,Colony'),(9800,'Erode,Muncipal,Colony,Erode,Collectorate'),(9801,'Erode,Perundurai,Erode,Collectorate'),(9802,'Erode,Perundurai,Kanji,Kanjikovil,Kanjikovil'),(9803,'Erode,Karungalpalayam'),(9804,'Erode,Erode,Fort,Erode,East'),(9805,'Erode,Erode,Fort,Erode,East'),(9806,'Bhavani,Erode,Voc,Park,Peria,Agraharam'),(9807,'Anthiyur,Alampalayam'),(9808,'Erode,Kadirampatti'),(9809,'Erode,Periyar,Nagar,Edayankattuvalsu'),(9810,'Pudur,Erode,Railway,Colony'),(9811,'Erode,Erode,East'),(9812,'Erode,Thirunagar,Colony,Karungalpalayam'),(9813,'Bhavani,Peria,Agraharam'),(9814,'Komarapalayam,Seerampalayam'),(9815,'Chikkaiah,Naicker,College,Chikkaiah,Naicker,College'),(9816,'Erode,Edayankattuvalsu'),(9817,'Chithode,Kanji,Chittode'),(9818,'Erode,Nasiyanur,Anur,Kadirampatti'),(9819,'Erode,Periyar,Nagar,Surampatti,Erode,East'),(9820,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(9821,'Erode,Karungalpalayam'),(9822,'Chinniyampalayam,Mylampatti'),(9823,'Chithode,Erode,Chittode'),(9824,'Erode,Periyar,Nagar,Erode,East'),(9825,'Erode,Thindal,Thindal'),(9826,'Erode,Edayankattuvalsu'),(9827,'Erode,Palayapalayam,Erode,Collectorate'),(9828,'Erode,Edayankattuvalsu'),(9829,'Ellapalayam,Emur,Chikkaiah,Naicker,College'),(9830,'Erode,Chikkaiah,Naicker,College'),(9831,'Erode,Thindal'),(9832,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(9833,'Kurichi,Devanankurichi,Devanankurichi'),(9834,'Chithode,Erode,Chittode'),(9835,'Bhavani,Periyapuliyur,Chettipalayam,Kalichettipalayam.,Mettupalayam'),(9836,'Erode,Erode,East'),(9837,'Erode,Perundurai,Erode,Collectorate'),(9838,'Erode,Muncipal,Colony,Karungalpalayam'),(9839,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(9840,'Erode,Perundurai,Sullipalayam,Thuduppathi,Palakarai'),(9841,'Erode,Chidambaram,Erode,East'),(9842,'Erode,Karungalpalayam,Arungal,Karungalpalayam'),(9843,'Erode,Erode,Fort,Erode,East'),(9844,'Erode,Erode,Fort,Erode,East'),(9845,'Erode,Edayankattuvalsu'),(9846,'Erode,Arasampatti,Thindal'),(9847,'Erode,Thindal,Thindal'),(9848,'Erode,Nallur,Allur,Ganapathy,Karunampathi'),(9849,'Erode,Muncipal,Colony,Voc,Park,Karungalpalayam'),(9850,'Iruppu,Sarkarperiapalayam'),(9851,'Erode,Erode,Collectorate'),(9852,'Erode,Surampatti,Ayal,Erode,East'),(9853,'Komarapalayam,Kallankattuvalasu'),(9854,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(9855,'Erode,Erode,Fort,Erode,East'),(9856,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(9857,'Erode,Erode,East'),(9858,'Erode,Rangampalayam,Edayankattuvalsu'),(9859,'Erode,Erode,Fort,Chikkaiah,Naicker,College'),(9860,'Erode,Surampatti,Erode,East'),(9861,'Erode,Erode,Railway,Colony'),(9862,'Erode,Koorapalayam,Ingur'),(9863,'Erode,Palayapalayam,Erode,Collectorate'),(9864,'Erode,Erode,Fort,Erode,East'),(9865,'Erode,Marapalam,Karungalpalayam'),(9866,'Erode,Erode,Fort,Erode,East'),(9867,'Erode,Kadirampatti'),(9868,'Perundurai,Vijayapuri,Kambiliyampatti'),(9869,'Erode,Erode,Collectorate'),(9870,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(9871,'Erode,Teachers,Colony,Erode,Collectorate'),(9872,'Bhavani,Erode,Vasavi,College'),(9873,'Gobichettipalayam,Modachur,Achur,Chettipalayam,Kadukkampalayam'),(9874,'Erode,Thirunagar,Colony,Karungalpalayam'),(9875,'Erode,Thirunagar,Colony,Karungalpalayam'),(9876,'Erode,Erode,Fort,Erode,Collectorate'),(9877,'Erode,Moolapalayam,Erode,Railway,Colony'),(9878,'Erode,Perundurai,Thindal'),(9879,'Erode,Erode,East'),(9880,'Erode,Chikkaiah,Naicker,College'),(9881,'Erode,Kanagapuram,Edayankattuvalsu'),(9882,'Erode,Teachers,Colony,Erode,Collectorate'),(9883,'Erode,Avalpundurai'),(9884,'Erode,Perundurai,Erode,Collectorate'),(9885,'Erode,Sampath,Nagar,Erode,Collectorate'),(9886,'Erode,Edayankattuvalsu'),(9887,'Kodumudi,Avudayarparai'),(9888,'Erode,Ellapalayam,Emur,Chikkaiah,Naicker,College'),(9889,'Erode,Arasampatti,Kadirampatti'),(9890,'Perundurai,Ingur'),(9891,'Erode,Erode,East'),(9892,'Erode,Rangampalayam,Kanagapuram'),(9893,'Erode,Nasiyanur,Anur,Erode,Collectorate'),(9894,'Erode,Teachers,Colony,Erode,Collectorate'),(9895,'Erode,Karungalpalayam'),(9896,'Veerappanchatram,Chikkaiah,Naicker,College'),(9897,'Erode,Railway,Colony,Erode,Railway,Colony'),(9898,'Perundurai,Seenapuram,Athur,Palakarai'),(9899,'Coimbatore,Ganapathy'),(9900,'Erode,Erode,East'),(9901,'Erode,Pudur,Ambur,Avadi,Elumathur'),(9902,'Chithode,Erode,Gangapuram,Chittode'),(9903,'Erode,Kollampalayam,Erode,Railway,Colony'),(9904,'Gobichettipalayam,Chettipalayam,Gobichettipalayam'),(9905,'Erode,Erode,Fort,Erode,East'),(9906,'Erode,Edayankattuvalsu'),(9907,'Erode,Edayankattuvalsu'),(9908,'Erode,Erode,Collectorate'),(9909,'Erode,Erode,Fort,Erode,East'),(9910,'Erode,Chikkaiah,Naicker,College'),(9911,'Erode,Periyar,Nagar,Erode,East'),(9912,'Erode,Erode,Collectorate'),(9913,'Kanji,Kanjikovil,Kanjikovil'),(9914,'Erode,Kadirampatti'),(9915,'Erode,Sivagiri,Ammankoil'),(9916,'Erode,Edayankattuvalsu'),(9917,'Agraharam,Erode,Erode,East'),(9918,'Erode,Edayankattuvalsu'),(9919,'Erode,Thirunagar,Colony,Erode,East'),(9920,'Erode,Sampath,Nagar,Erode,Collectorate'),(9921,'Erode,Erode,Collectorate'),(9922,'Erode,Periya,Valasu,Chikkaiah,Naicker,College'),(9923,'Erode,Thindal,Kanagapuram'),(9924,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(9925,'Komarapalayam,Kallankattuvalasu'),(9926,'Erode,Erode,Fort,Erode,East'),(9927,'Erode,Erode,Fort,Erode,East'),(9928,'Erode,Edayankattuvalsu'),(9929,'Erode,Karungalpalayam'),(9930,'Gandhinagar,Iruppu,Ayyankalipalayam'),(9931,'Erode,Erode,Railway,Colony'),(9932,'Erode,Kollampalayam,Arur,Karur,Erode,Railway,Colony'),(9933,'Erode,Ganapathy,Erode,Collectorate'),(9934,'Erode,Thindal,Thindal'),(9935,'Erode,Chikkaiah,Naicker,College'),(9936,'Erode,Pallipalayam'),(9937,'Erode,Nallur,Nasiyanur,Allur,Anur,Thindal'),(9938,'Erode,Thirunagar,Colony,Karungalpalayam'),(9939,'Sampath,Nagar,Erode,Collectorate'),(9940,'Agraharam,Erode,Erode,East'),(9941,'Erode,Karungalpalayam'),(9942,'Kattampatti-Coimbatore,Kattampatti-Coimbatore'),(9943,'Erode,Erode,Fort,Erode,East'),(9944,'Chithode,Gangapuram,Chittode'),(9945,'Erode,Gandhipuram,Karungalpalayam'),(9946,'Erode,Erode,Fort,Erode,East'),(9947,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(9948,'Erode,Thirunagar,Colony,Karungalpalayam'),(9949,'Chithode,Chittode'),(9950,'Erode,Perundurai,Erode,Collectorate'),(9951,'Erode,Chikkaiah,Naicker,College'),(9952,'Erode,Erode,East'),(9953,'Erode,Erode,Fort,Erode,East'),(9954,'Erode,Teachers,Colony,Erode,Collectorate'),(9955,'Erode,Karungalpalayam'),(9956,'Erode,Erode,Railway,Colony'),(9957,'Erode,Erode,Fort,Erode,East'),(9958,'Erode,Thindal,Thindal'),(9959,'Erode,Edayankattuvalsu'),(9960,'Erode,Lakkapuram,Erode,Railway,Colony'),(9961,'Erode,Emur,Chikkaiah,Naicker,College'),(9962,'Erode,Teachers,Colony,Erode,Collectorate'),(9963,'Erode,Erode,East'),(9964,'Erode,Erode,Fort,Erode,East'),(9965,'Erode,Erode,East'),(9966,'Erode,Kollampalayam,Erode,Railway,Colony'),(9967,'Erode,Athipalayam,Erode,Railway,Colony'),(9968,'Kurichi,Modakurichi,Elumathur'),(9969,'Gangapuram,Chittode'),(9970,'Erode,Erode,East'),(9971,'Erode,Surampatti,Edayankattuvalsu'),(9972,'Lakkapuram,Erode,Railway,Colony'),(9973,'Erode,Erode,Collectorate'),(9974,'Erode,Arasampatti,Kadirampatti'),(9975,'Erode,Palayapalayam,Perundurai,Erode,Collectorate'),(9976,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(9977,'Erode,Karungalpalayam'),(9978,'Erode,Thirunagar,Colony,Karungalpalayam'),(9979,'Erode,Erode,Fort,Erode,East'),(9980,'Erode,Chikkaiah,Naicker,College'),(9981,'Erode,Muncipal,Colony,Karungalpalayam'),(9982,'Erode,Chikkaiah,Naicker,College'),(9983,'Erode,Thindal,Thindal'),(9984,'Erode,Periyar,Nagar,Erode,East'),(9985,'Erode,Erode,East'),(9986,'Komarapalayam,Kallankattuvalasu'),(9987,'Erode,Thindal'),(9988,'Erode,Soolai,Karumal,Karumalai,Chikkaiah,Naicker,College'),(9989,'Erode,Erode,Fort,Erode,East'),(9990,'Pudur,Coimbatore,Irugur,Athappagoundenpudur'),(9991,'Erode,Moolapalayam,Erode,Railway,Colony'),(9992,'Erode,Perundurai,Teachers,Colony,Erode,Collectorate'),(9993,'Muncipal,Colony,Veerappanchatram,Karungalpalayam'),(9994,'Erode,Chikkaiah,Naicker,College'),(9995,'Erode,Erode,Railway,Colony'),(9996,'Erode,Erode,Fort,Erode,East'),(9997,'Erode,Erode,East'),(9998,'Erode,Arur,Karur,Erode,Railway,Colony'),(9999,'Erode,Chikkaiah,Naicker,College'),(10000,'Perundurai,Ingur'),(10001,'Erode,Kollampalayam,Erode,Railway,Colony'),(10002,'Komarapalayam,Kallankattuvalasu,Kallankattuvalasu'),(10003,'Erode,Moolapalayam,Erode,Railway,Colony'),(10004,'Erode,Nadarmedu,Erode,Railway,Colony'),(10005,'Erode,Nadarmedu,Erode,Railway,Colony'),(10006,'Agraharam,Karungalpalayam,Arungal,Kali,Karai,Karungalpalayam'),(10007,'Erode,Chikkaiah,Naicker,College'),(10008,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(10009,'Erode,Erode,Fort,Erode,East'),(10010,'Erode,Erode,Fort,Erode,East'),(10011,'Erode,Chidambaram,Erode,East'),(10012,'Chennimalai,Basuvapatti'),(10013,'Erode,Erode,East'),(10014,'Erode,Arasampatti,Kadirampatti'),(10015,'Erode,Thirunagar,Colony,Karungalpalayam'),(10016,'Erode,Erode,Fort,Karungalpalayam'),(10017,'Erode,Erode,Fort,Erode,Collectorate'),(10018,'Erode,Edayankattuvalsu'),(10019,'Erode,Surampatti,Edayankattuvalsu'),(10020,'Erode,Surampatti,Erode,East'),(10021,'Erode,Kollampalayam,Pudur,Erode,Railway,Colony'),(10022,'Perundurai,Kadirampatti'),(10023,'Kurichi,Modakurichi,Ganapathipalayam'),(10024,'Nasiyanur,Anur,Kadirampatti'),(10025,'Perundurai,Thindal'),(10026,'Nadarmedu,Railway,Colony,Erode,Railway,Colony'),(10027,'Iruppu,Karukkankattupudur'),(10028,'Erode,Erode,East'),(10029,'Erode,Voc,Park,Karungalpalayam'),(10030,'Erode,Solar,Erode,Railway,Colony'),(10031,'Komarapalayam,Kallankattuvalasu'),(10032,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(10033,'Erode,Erode,Fort,Erode,East'),(10034,'Erode,Lakkapuram,Pudur,Erode,Railway,Colony'),(10035,'Erode,Perundurai,Thindal'),(10036,'Arur,Karur,Erode,Railway,Colony'),(10037,'Erode,Chikkaiah,Naicker,College'),(10038,'Erode,Edayankattuvalsu'),(10039,'Erode,Karungalpalayam'),(10040,'Erode,Erode,East'),(10041,'Erode,Kavandapadi,Kalichettipalayam.,Mettupalayam'),(10042,'Erode,Thindal,Thindal'),(10043,'Appakudal,Kavandapadi,Kalichettipalayam.,Mettupalayam'),(10044,'Erode,Voc,Park,Karungalpalayam'),(10045,'Kurichi,Modakurichi,Elumathur'),(10046,'Periyapuliyur,Kavindapadi,Kalichettipalayam.,Mettupalayam'),(10047,'Coimbatore,Ramnagar,Coimbatore'),(10048,'Erode,Moolapalayam,Erode,Railway,Colony'),(10049,'Erode,Erode,East'),(10050,'Erode,Veerappanchatram,Chikkaiah,Naicker,College'),(10051,'Thindal,Thindal'),(10052,'Erode,Edayankattuvalsu'),(10053,'Anjur,Muncipal,Colony,Veerappanchatram,Chikkaiah,Naicker,College'),(10054,'Erode,Erode,East'),(10055,'Thiruvachi,Karumandisellipalayam,Ingur'),(10056,'Kasthuripatti,Kasthuripatti'),(10057,'Kollampalayam,Erode,Railway,Colony'),(10058,'Erode,Elumathur'),(10059,'Erode,Kadirampatti'),(10060,'Erode,Muncipal,Colony,Chikkaiah,Naicker,College'),(10061,'Nanjaiuthukuli,Elumathur'),(10062,'Erode,Chidambaram,Erode,East'),(10063,'Erode,Chikkaiah,Naicker,College'),(10064,'Erode,Rangampalayam,Edayankattuvalsu'),(10065,'Erode,Perundurai,Erode,Collectorate'),(10066,'Coimbatore,Cbe,Mpl.Central,Busstand'),(10067,'Erode,Erode,Fort,Karungalpalayam'),(10068,'Erode,Erode,Fort,Erode,East'),(10069,'Erode,Kollampalayam,Arur,Karur,Erode,Railway,Colony'),(10070,'Erode,Thindal'),(10071,'Erode,Veerappanchatram,Voc,Park,Karungalpalayam'),(10072,'Ariyampalayam,Coimbatore,Ellapalayam,Karegoundenpalayam'),(10073,'Erode,Edayankattuvalsu'),(10074,'Erode,Chikkaiah,Naicker,College'),(10075,'Erode,Edayankattuvalsu'),(10076,'Kathirampatti,Perundurai,Kadirampatti'),(10077,'Erode,Periyar,Nagar,Erode,East'),(10078,'Erode,Erode,Fort,Erode,East'),(10079,'Erode,Erode,Fort,Erode,East'),(10080,'Erode,Teachers,Colony,Erode,Collectorate');
/*!40000 ALTER TABLE `area` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assessment_configuration`
--

DROP TABLE IF EXISTS `assessment_configuration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assessment_configuration` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Course_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Dept_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Dept_Code` int DEFAULT NULL,
  `Semester` int DEFAULT NULL,
  `Regulation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Class_Section` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub_Code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Assessment_Type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Assessment_Date` date DEFAULT NULL,
  `Max_Marks` int DEFAULT NULL,
  `Test_No` int DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Experiment_Count` int DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assessment_configuration`
--

LOCK TABLES `assessment_configuration` WRITE;
/*!40000 ALTER TABLE `assessment_configuration` DISABLE KEYS */;
/*!40000 ALTER TABLE `assessment_configuration` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `assessment_students`
--

DROP TABLE IF EXISTS `assessment_students`;
/*!50001 DROP VIEW IF EXISTS `assessment_students`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `assessment_students` AS SELECT 
 1 AS `Register_Number`,
 1 AS `Student_Name`,
 1 AS `Course_Name`,
 1 AS `Dept_Code`,
 1 AS `Dept_Name`,
 1 AS `Semester`,
 1 AS `Regulation`,
 1 AS `Class_Section`,
 1 AS `Sub_Code`,
 1 AS `Sub_Name`,
 1 AS `Assessment_Type`,
 1 AS `Assessment_Date`,
 1 AS `Max_Marks`,
 1 AS `Test_No`,
 1 AS `Experiment_Count`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `assets`
--

DROP TABLE IF EXISTS `assets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assets` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `asset_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `date` date DEFAULT NULL,
  `assets` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `condition` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `qty` int DEFAULT NULL,
  `rate` decimal(15,2) DEFAULT NULL,
  `amount` decimal(20,2) DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_asset_id` (`asset_id`) USING BTREE,
  KEY `idx_date` (`date`) USING BTREE,
  KEY `idx_status` (`status`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assets`
--

LOCK TABLES `assets` WRITE;
/*!40000 ALTER TABLE `assets` DISABLE KEYS */;
/*!40000 ALTER TABLE `assets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assignment_mark_entered`
--

DROP TABLE IF EXISTS `assignment_mark_entered`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignment_mark_entered` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Register_Number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Course_Name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Dept_Name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Dept_Code` int DEFAULT NULL,
  `Semester` int DEFAULT NULL,
  `Regulation` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Class_Section` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub_Code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub_Name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Assessment_Type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Assessment_Date` date DEFAULT NULL,
  `Assignment_No` int DEFAULT NULL,
  `Max_Marks` int DEFAULT NULL,
  `Obtained_Mark` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Entered_By` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `uk_assignment_mark` (`Register_Number`,`Sub_Code`,`Assignment_No`,`Assessment_Date`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=269 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignment_mark_entered`
--

LOCK TABLES `assignment_mark_entered` WRITE;
/*!40000 ALTER TABLE `assignment_mark_entered` DISABLE KEYS */;
/*!40000 ALTER TABLE `assignment_mark_entered` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `assignment_summary`
--

DROP TABLE IF EXISTS `assignment_summary`;
/*!50001 DROP VIEW IF EXISTS `assignment_summary`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `assignment_summary` AS SELECT 
 1 AS `Register_Number`,
 1 AS `Sub_Code`,
 1 AS `total_assignment_mark`,
 1 AS `total_assignment_max`,
 1 AS `assignment_percentage`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `attendance_configuration`
--

DROP TABLE IF EXISTS `attendance_configuration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance_configuration` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Dept_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Dept_Code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Semester` int DEFAULT NULL,
  `Regulation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub_Code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `TotalHours` int DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Sub_Type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Course_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance_configuration`
--

LOCK TABLES `attendance_configuration` WRITE;
/*!40000 ALTER TABLE `attendance_configuration` DISABLE KEYS */;
/*!40000 ALTER TABLE `attendance_configuration` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `attendance_summary`
--

DROP TABLE IF EXISTS `attendance_summary`;
/*!50001 DROP VIEW IF EXISTS `attendance_summary`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `attendance_summary` AS SELECT 
 1 AS `Register_Number`,
 1 AS `Sub_Code`,
 1 AS `total_classes`,
 1 AS `present_days`,
 1 AS `attendance_percentage`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `available_quota_seat`
--

DROP TABLE IF EXISTS `available_quota_seat`;
/*!50001 DROP VIEW IF EXISTS `available_quota_seat`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `available_quota_seat` AS SELECT 
 1 AS `Dept_Code`,
 1 AS `Dept_Name`,
 1 AS `Course_Name`,
 1 AS `total_gq_seats`,
 1 AS `total_mq_seats`,
 1 AS `total_seats`,
 1 AS `admitted_gq`,
 1 AS `admitted_mq`,
 1 AS `available_gq`,
 1 AS `available_mq`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `birthday_wishes`
--

DROP TABLE IF EXISTS `birthday_wishes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `birthday_wishes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `student_register_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `student_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sent_by_id` int DEFAULT NULL,
  `sent_by_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wish_message` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Happy Birthday!',
  `birthday_date` date DEFAULT NULL,
  `birthday_year` int GENERATED ALWAYS AS (year(`birthday_date`)) STORED,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `sent_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `unique_wish_per_student_per_year` (`student_id`,`birthday_year`) USING BTREE,
  KEY `idx_student_id` (`student_id`) USING BTREE,
  KEY `idx_student_register` (`student_register_number`) USING BTREE,
  KEY `idx_created_at` (`created_at`) USING BTREE,
  KEY `idx_birthday_year` (`birthday_year`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `birthday_wishes`
--

LOCK TABLES `birthday_wishes` WRITE;
/*!40000 ALTER TABLE `birthday_wishes` DISABLE KEYS */;
INSERT INTO `birthday_wishes` (`id`, `student_id`, `student_register_number`, `student_name`, `sent_by_id`, `sent_by_name`, `wish_message`, `birthday_date`, `created_at`, `sent_at`) VALUES (1,4530,'560021529044','KUMARAN B G',6,'Rajkumar','Happy Birthday! 🎉','2004-02-03','2026-02-03 13:25:42','2026-02-03 13:25:42');
/*!40000 ALTER TABLE `birthday_wishes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cashbook`
--

DROP TABLE IF EXISTS `cashbook`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cashbook` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `voucher` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `detail` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `category` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL,
  `mode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_date` (`date`) USING BTREE,
  KEY `idx_category` (`category`) USING BTREE,
  KEY `idx_type` (`type`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cashbook`
--

LOCK TABLES `cashbook` WRITE;
/*!40000 ALTER TABLE `cashbook` DISABLE KEYS */;
/*!40000 ALTER TABLE `cashbook` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_master`
--

DROP TABLE IF EXISTS `category_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category_master` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`category_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_master`
--

LOCK TABLES `category_master` WRITE;
/*!40000 ALTER TABLE `category_master` DISABLE KEYS */;
INSERT INTO `category_master` VALUES (1,'literature '),(2,'Computer Science'),(3,'Maths'),(4,'Chemistry'),(5,'social'),(6,'english'),(7,'tamil'),(9,'pharmacology'),(10,'pharmaceutics'),(11,'Clinical pharmacy'),(12,'Hospital pharmacy'),(13,'anatomy'),(14,'Analysis'),(15,'Microbiology'),(16,'Biochemistry');
/*!40000 ALTER TABLE `category_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `challan`
--

DROP TABLE IF EXISTS `challan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `challan` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `candidate_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `challan_date` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `course` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `sem` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `reg_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `challan_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `last_challan_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_candidate_type` (`candidate_type`) USING BTREE,
  KEY `idx_challan_date` (`challan_date`) USING BTREE,
  KEY `idx_course` (`course`) USING BTREE,
  KEY `idx_sem` (`sem`) USING BTREE,
  KEY `idx_reg_no` (`reg_no`) USING BTREE,
  KEY `idx_challan_no` (`challan_no`) USING BTREE,
  KEY `idx_status` (`status`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `challan`
--

LOCK TABLES `challan` WRITE;
/*!40000 ALTER TABLE `challan` DISABLE KEYS */;
/*!40000 ALTER TABLE `challan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `class_master`
--

DROP TABLE IF EXISTS `class_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `class_master` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Class_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Created_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `Updated_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `class_master`
--

LOCK TABLES `class_master` WRITE;
/*!40000 ALTER TABLE `class_master` DISABLE KEYS */;
INSERT INTO `class_master` VALUES (6,'A','2025-12-17 10:00:36','2025-12-17 10:00:36'),(7,'B','2025-12-17 10:00:38','2025-12-17 10:00:38');
/*!40000 ALTER TABLE `class_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `class_timetable`
--

DROP TABLE IF EXISTS `class_timetable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `class_timetable` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Course_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Dept_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Dept_Code` int DEFAULT NULL,
  `Semester` int DEFAULT NULL,
  `Year` int DEFAULT NULL,
  `Regulation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Class_Section` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Day_Order` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Period_1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Period_2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Period_3` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Period_4` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Period_5` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Period_6` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Created_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `Updated_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `class_timetable`
--

LOCK TABLES `class_timetable` WRITE;
/*!40000 ALTER TABLE `class_timetable` DISABLE KEYS */;
/*!40000 ALTER TABLE `class_timetable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `college_strength`
--

DROP TABLE IF EXISTS `college_strength`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `college_strength` (
  `id` int NOT NULL AUTO_INCREMENT,
  `CourseCode` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Branch` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Year_1` decimal(10,2) DEFAULT '0.00',
  `Year_2` decimal(10,2) DEFAULT '0.00',
  `Year_3` decimal(10,2) DEFAULT '0.00',
  `Year_4` decimal(10,2) DEFAULT '0.00',
  `Others` decimal(10,2) DEFAULT '0.00',
  `Total` decimal(10,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `college_strength`
--

LOCK TABLES `college_strength` WRITE;
/*!40000 ALTER TABLE `college_strength` DISABLE KEYS */;
/*!40000 ALTER TABLE `college_strength` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_master`
--

DROP TABLE IF EXISTS `community_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `community_master` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Community` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_master`
--

LOCK TABLES `community_master` WRITE;
/*!40000 ALTER TABLE `community_master` DISABLE KEYS */;
INSERT INTO `community_master` VALUES (1,'OC','2025-11-17 20:57:05','2026-01-07 13:52:49'),(2,'BC','2025-11-17 20:57:05','2026-01-07 13:52:51'),(3,'BCO','2025-11-17 20:57:05','2026-01-07 13:52:54'),(4,'BCM','2025-11-17 20:57:05','2026-01-07 13:52:56'),(5,'MBC/DNC','2026-01-07 13:53:01','2026-01-07 13:53:01'),(6,'SC','2026-01-07 13:53:03','2026-01-07 13:53:03'),(7,'SCA','2026-01-07 13:53:07','2026-01-07 13:53:07'),(8,'ST','2026-01-07 13:53:09','2026-01-07 13:53:09');
/*!40000 ALTER TABLE `community_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_details`
--

DROP TABLE IF EXISTS `course_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Course_Mode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Dept_Code` int DEFAULT NULL,
  `Dept_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Year_Of_Course` int DEFAULT NULL,
  `Course_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Dept_Order` int DEFAULT NULL,
  `AICTE_Approval` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `AICTE_Approval_No` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `S1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `S2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `S3` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `S4` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `S5` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `S6` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `S7` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `S8` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `R1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `R2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `R3` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `R4` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `R5` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `R6` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `R7` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `R8` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Intake` int DEFAULT NULL,
  `AddlSeats` int DEFAULT NULL,
  `OC` int DEFAULT NULL,
  `BC` int DEFAULT NULL,
  `BCM` int DEFAULT NULL,
  `MBC_DNC` int DEFAULT NULL,
  `SC` int DEFAULT NULL,
  `SCA` int DEFAULT NULL,
  `ST` int DEFAULT NULL,
  `Other` int DEFAULT NULL,
  `GoiQuota` int DEFAULT NULL,
  `MgtQuota` int DEFAULT NULL,
  `Ins_Type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `BCO` int DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_details`
--

LOCK TABLES `course_details` WRITE;
/*!40000 ALTER TABLE `course_details` DISABLE KEYS */;
INSERT INTO `course_details` VALUES (14,'Regular',4000,'D.PHARM (DIPLOMA IN PHARMACY)',2,'Pharmacy',1,'Approved','3003','','1234567890',NULL,NULL,NULL,NULL,NULL,NULL,'R20','R20','R20','R20','R20','R20','R20','R20',500,0,78,0,9,50,38,8,3,0,250,250,'Self-Finance',66),(15,'Regular',5010,'B.PHARM (BACHELOR OF PHARMACY)',4,'Pharmacy',2,'Approved','101',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,120,0,19,0,2,12,9,2,1,0,60,60,'Self-Finance',16),(16,'Regular',6101,'M.PHARM (MASTER OF PHARMACY)',2,'Pharmacy',2,'Approved','24343',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,60,12,9,0,1,6,5,1,0,0,30,30,'Self-Finance',8);
/*!40000 ALTER TABLE `course_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_fees`
--

DROP TABLE IF EXISTS `course_fees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_fees` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Academic_Year` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Mode_Of_Join` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Course_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Fee_Type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `FeeSem` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Entered_By` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Created_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `Updated_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=141 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_fees`
--

LOCK TABLES `course_fees` WRITE;
/*!40000 ALTER TABLE `course_fees` DISABLE KEYS */;
/*!40000 ALTER TABLE `course_fees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_master`
--

DROP TABLE IF EXISTS `course_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_master` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Course_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_master`
--

LOCK TABLES `course_master` WRITE;
/*!40000 ALTER TABLE `course_master` DISABLE KEYS */;
INSERT INTO `course_master` VALUES (1,'Pharmacy','2025-11-16 10:58:33','2025-12-16 10:58:58');
/*!40000 ALTER TABLE `course_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_mode_master`
--

DROP TABLE IF EXISTS `course_mode_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_mode_master` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Course_Mode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_mode_master`
--

LOCK TABLES `course_mode_master` WRITE;
/*!40000 ALTER TABLE `course_mode_master` DISABLE KEYS */;
INSERT INTO `course_mode_master` VALUES (1,'Regular','2025-11-16 11:49:07','2025-11-16 11:49:07'),(2,'Lateral Entry','2025-11-16 11:49:07','2025-11-16 11:49:07');
/*!40000 ALTER TABLE `course_mode_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `dept_attendance_date_wise`
--

DROP TABLE IF EXISTS `dept_attendance_date_wise`;
/*!50001 DROP VIEW IF EXISTS `dept_attendance_date_wise`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `dept_attendance_date_wise` AS SELECT 
 1 AS `Att_Date`,
 1 AS `Dept_Code`,
 1 AS `Dept_Name`,
 1 AS `present_count`,
 1 AS `absent_count`,
 1 AS `total_students`,
 1 AS `present_percentage`,
 1 AS `absent_percentage`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `designation_master`
--

DROP TABLE IF EXISTS `designation_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `designation_master` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Designation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `designation_master`
--

LOCK TABLES `designation_master` WRITE;
/*!40000 ALTER TABLE `designation_master` DISABLE KEYS */;
INSERT INTO `designation_master` VALUES (1,'Lecture','2025-11-16 11:05:00','2025-12-14 10:02:15'),(2,'Demonstrator','2025-11-16 11:05:00','2025-11-16 11:05:00'),(4,'Senior Lecturer','2025-11-16 11:05:00','2025-11-16 11:05:00'),(5,'Assistant Professor','2025-11-16 11:05:00','2025-11-16 11:05:00'),(6,'Associate Professor','2025-11-16 11:05:00','2025-11-16 11:05:00'),(7,'Professor','2025-11-16 11:05:00','2025-11-16 11:05:00'),(8,'HOD','2025-11-16 11:05:00','2025-11-20 07:05:55'),(9,'Vice-Principal','2025-11-16 11:05:00','2025-11-16 11:05:00'),(10,'Principal','2025-11-16 11:05:00','2025-11-16 11:05:00'),(11,'Dean','2025-11-16 11:05:00','2025-12-14 10:03:38'),(12,'Director (Pharmacy)','2025-11-16 11:05:00','2025-11-16 11:05:00'),(13,'Lab Technician','2025-11-16 11:05:00','2025-11-16 11:05:00'),(14,'Lab Assistant','2025-11-16 11:05:00','2025-11-16 11:05:00'),(15,'Laboratory Attendant','2025-11-16 11:05:00','2025-11-16 11:05:00'),(16,'Store Keeper','2025-11-16 11:05:00','2025-11-16 11:05:00'),(17,'Computer Lab Assistant','2025-11-16 11:05:00','2025-11-16 11:05:00'),(18,'Librarian','2025-11-16 11:05:00','2025-11-16 11:05:00'),(19,'Assistant Librarian','2025-11-16 11:05:00','2025-11-16 11:05:00'),(20,'Library Attendant','2025-11-16 11:05:00','2025-11-16 11:05:00'),(21,'Administrative Officer','2025-11-16 11:05:00','2025-11-16 11:05:00'),(22,'Office Superintendent','2025-11-16 11:05:00','2025-11-16 11:05:00'),(23,'Office Assistant','2025-11-16 11:05:00','2025-11-16 11:05:00'),(24,'Clerk','2025-11-16 11:05:00','2025-11-16 11:05:00'),(25,'Accountant','2025-11-16 11:05:00','2025-11-16 11:05:00'),(26,'Accounts Officer','2025-11-16 11:05:00','2025-11-16 11:05:00'),(27,'Cashier','2025-11-16 11:05:00','2025-11-16 11:05:00'),(28,'Receptionist','2025-11-16 11:05:00','2025-11-16 11:05:00'),(29,'Admission Coordinator','2025-11-16 11:05:00','2025-11-16 11:05:00'),(30,'Exam Cell In-Charge','2025-11-16 11:05:00','2025-11-16 11:05:00'),(31,'Controller of Examinations','2025-11-16 11:05:00','2025-11-16 11:05:00'),(32,'Training & Placement Officer','2025-11-16 11:05:00','2025-11-16 11:05:00'),(33,'CEO','2025-11-16 11:05:00','2025-11-16 11:05:00'),(34,'Managing Director','2025-11-16 11:05:00','2025-11-16 11:05:00'),(35,'Registrar','2025-11-16 11:05:00','2025-11-16 11:05:00'),(36,'Director (Administration)','2025-11-16 11:05:00','2025-11-16 11:05:00'),(37,'Controller of Administration','2025-11-16 11:05:00','2025-11-16 11:05:00'),(38,'Transport Officer','2025-11-20 07:06:09','2025-11-20 07:06:09'),(39,'Assistant Vice President','2025-11-22 18:57:00','2025-11-22 18:57:00'),(40,'Watchman Role','2025-12-04 19:04:00','2025-12-04 19:42:07');
/*!40000 ALTER TABLE `designation_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `district_master`
--

DROP TABLE IF EXISTS `district_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `district_master` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `District` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `State` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Created_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `Updated_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `district_master`
--

LOCK TABLES `district_master` WRITE;
/*!40000 ALTER TABLE `district_master` DISABLE KEYS */;
INSERT INTO `district_master` VALUES (1,'Ariyalur','Tamil Nadu','2025-11-22 12:54:05','2025-11-22 12:54:05'),(2,'Chengalpattu','Tamil Nadu','2025-11-22 12:54:05','2025-11-22 12:54:05'),(3,'Chennai','Tamil Nadu','2025-11-22 12:54:05','2025-11-22 12:54:05'),(4,'Coimbatore','Tamil Nadu','2025-11-22 12:54:05','2025-11-22 12:54:05'),(5,'Cuddalore','Tamil Nadu','2025-11-22 12:54:05','2025-11-22 12:54:05'),(6,'Dharmapuri','Tamil Nadu','2025-11-22 12:54:05','2025-11-22 12:54:05'),(7,'Dindigul','Tamil Nadu','2025-11-22 12:54:05','2025-11-22 12:54:05'),(8,'Erode','Tamil Nadu','2025-11-22 12:54:05','2025-11-22 12:54:05'),(9,'Kallakurichi','Tamil Nadu','2025-11-22 12:54:05','2025-11-22 12:54:05'),(10,'Kanchipuram','Tamil Nadu','2025-11-22 12:54:05','2025-11-22 12:54:05'),(11,'Kanyakumari','Tamil Nadu','2025-11-22 12:54:05','2025-11-22 12:54:05'),(12,'Karur','Tamil Nadu','2025-11-22 12:54:05','2025-11-22 12:54:05'),(13,'Krishnagiri','Tamil Nadu','2025-11-22 12:54:05','2025-11-22 12:54:05'),(14,'Madurai','Tamil Nadu','2025-11-22 12:54:05','2025-11-22 12:54:05'),(15,'Mayiladuthurai','Tamil Nadu','2025-11-22 12:54:05','2025-11-22 12:54:05'),(16,'Nagapattinam','Tamil Nadu','2025-11-22 12:54:05','2025-11-22 12:54:05'),(17,'Namakkal','Tamil Nadu','2025-11-22 12:54:05','2025-11-22 12:54:05'),(18,'Nilgiris','Tamil Nadu','2025-11-22 12:54:05','2025-11-22 12:54:05'),(19,'Perambalur','Tamil Nadu','2025-11-22 12:54:05','2025-11-22 12:54:05'),(20,'Pudukkottai','Tamil Nadu','2025-11-22 12:54:05','2025-11-22 12:54:05'),(21,'Ramanathapuram','Tamil Nadu','2025-11-22 12:54:05','2025-11-22 12:54:05'),(22,'Ranipet','Tamil Nadu','2025-11-22 12:54:05','2025-11-22 12:54:05'),(23,'Salem','Tamil Nadu','2025-11-22 12:54:05','2025-11-22 12:54:05'),(24,'Sivagangai','Tamil Nadu','2025-11-22 12:54:05','2025-11-22 12:54:05'),(25,'Tenkasi','Tamil Nadu','2025-11-22 12:54:05','2025-11-22 12:54:05'),(26,'Thanjavur','Tamil Nadu','2025-11-22 12:54:05','2025-11-22 12:54:05'),(27,'Theni','Tamil Nadu','2025-11-22 12:54:05','2025-11-22 12:54:05'),(28,'Thoothukudi','Tamil Nadu','2025-11-22 12:54:05','2025-11-22 12:54:05'),(29,'Tiruchirappalli','Tamil Nadu','2025-11-22 12:54:05','2025-11-22 12:54:05'),(30,'Tirunelveli','Tamil Nadu','2025-11-22 12:54:05','2025-11-22 12:54:05'),(31,'Tirupathur','Tamil Nadu','2025-11-22 12:54:05','2025-11-22 12:54:05'),(32,'Tiruppur','Tamil Nadu','2025-11-22 12:54:05','2025-11-22 12:54:05'),(33,'Tiruvallur','Tamil Nadu','2025-11-22 12:54:05','2025-11-22 12:54:05'),(34,'Tiruvannamalai','Tamil Nadu','2025-11-22 12:54:05','2025-11-22 12:54:05'),(35,'Tiruvarur','Tamil Nadu','2025-11-22 12:54:05','2025-11-22 12:54:05'),(36,'Vellore','Tamil Nadu','2025-11-22 12:54:05','2025-11-22 12:54:05'),(37,'Viluppuram','Tamil Nadu','2025-11-22 12:54:05','2025-11-22 12:54:05'),(38,'Virudhunagar','Tamil Nadu','2025-11-22 12:54:05','2025-11-22 12:54:05');
/*!40000 ALTER TABLE `district_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `drivers`
--

DROP TABLE IF EXISTS `drivers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `drivers` (
  `id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `driver_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `license_no` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `license_valid_till` date DEFAULT NULL,
  `assigned_vehicle_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_phone` (`phone`) USING BTREE,
  KEY `idx_assigned_vehicle` (`assigned_vehicle_id`) USING BTREE,
  KEY `idx_status` (`status`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `drivers`
--

LOCK TABLES `drivers` WRITE;
/*!40000 ALTER TABLE `drivers` DISABLE KEYS */;
/*!40000 ALTER TABLE `drivers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `elective_matser`
--

DROP TABLE IF EXISTS `elective_matser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `elective_matser` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Elective` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `elective_matser`
--

LOCK TABLES `elective_matser` WRITE;
/*!40000 ALTER TABLE `elective_matser` DISABLE KEYS */;
INSERT INTO `elective_matser` VALUES (1,'Yes','2025-11-16 12:35:40','2025-11-16 12:35:40'),(2,'No','2025-11-16 12:35:40','2025-11-16 12:35:40');
/*!40000 ALTER TABLE `elective_matser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enquiry_call_notes`
--

DROP TABLE IF EXISTS `enquiry_call_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enquiry_call_notes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tenant_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tenant_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `student_eqid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `student_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `call_note_date` date DEFAULT NULL,
  `call_note_time` time DEFAULT NULL,
  `outcome` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `call_notes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `next_follow_up` date DEFAULT NULL,
  `create_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enquiry_call_notes`
--

LOCK TABLES `enquiry_call_notes` WRITE;
/*!40000 ALTER TABLE `enquiry_call_notes` DISABLE KEYS */;
/*!40000 ALTER TABLE `enquiry_call_notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `enquiry_call_notes_tenant`
--

DROP TABLE IF EXISTS `enquiry_call_notes_tenant`;
/*!50001 DROP VIEW IF EXISTS `enquiry_call_notes_tenant`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `enquiry_call_notes_tenant` AS SELECT 
 1 AS `staff_name`,
 1 AS `staff_id`,
 1 AS `staff_mobile`,
 1 AS `staff_department`,
 1 AS `tenant_id`,
 1 AS `student_eqid`,
 1 AS `student_name`,
 1 AS `student_mobile`,
 1 AS `parent_name`,
 1 AS `parent_mobile`,
 1 AS `student_address`,
 1 AS `student_district`,
 1 AS `student_community`,
 1 AS `school_type`,
 1 AS `standard`,
 1 AS `student_reg_no`,
 1 AS `school_address`,
 1 AS `department`,
 1 AS `source`,
 1 AS `transport`,
 1 AS `hostel`,
 1 AS `call_notes_count`,
 1 AS `last_status`,
 1 AS `next_follow_up`,
 1 AS `Created_Date`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `exam_attendance`
--

DROP TABLE IF EXISTS `exam_attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `exam_date` date NOT NULL,
  `session` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `subject_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `subject_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dept_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dept_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `semester` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `regulation` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `hall_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `hall_name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `hall_capacity` int DEFAULT NULL,
  `seat_no` int DEFAULT NULL,
  `row` int DEFAULT NULL,
  `col` int DEFAULT NULL,
  `register_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `student_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `staff_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `attendance_status` enum('Present','Absent') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Present',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=151 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam_attendance`
--

LOCK TABLES `exam_attendance` WRITE;
/*!40000 ALTER TABLE `exam_attendance` DISABLE KEYS */;
/*!40000 ALTER TABLE `exam_attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exam_fee`
--

DROP TABLE IF EXISTS `exam_fee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_fee` (
  `id` int NOT NULL AUTO_INCREMENT,
  `RegNo` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `StudName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Course` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sem` int DEFAULT NULL,
  `Fine` decimal(10,2) DEFAULT '0.00',
  `Fee` decimal(10,2) DEFAULT '0.00',
  `TotFee` decimal(10,2) DEFAULT '0.00',
  `Sem_1` decimal(10,2) DEFAULT '0.00',
  `Sem_2` decimal(10,2) DEFAULT '0.00',
  `Sem_3` decimal(10,2) DEFAULT '0.00',
  `Sem_4` decimal(10,2) DEFAULT '0.00',
  `Sem_5` decimal(10,2) DEFAULT '0.00',
  `Sem_6` decimal(10,2) DEFAULT '0.00',
  `Sem_7` decimal(10,2) DEFAULT '0.00',
  `Sem_8` decimal(10,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam_fee`
--

LOCK TABLES `exam_fee` WRITE;
/*!40000 ALTER TABLE `exam_fee` DISABLE KEYS */;
/*!40000 ALTER TABLE `exam_fee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exam_generation`
--

DROP TABLE IF EXISTS `exam_generation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_generation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `exam_date` date NOT NULL,
  `session` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `subject_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `subject_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dept_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dept_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `semester` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `regulation` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `hall_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `hall_name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `hall_capacity` int DEFAULT NULL,
  `seat_no` int DEFAULT NULL,
  `row` int DEFAULT NULL,
  `col` int DEFAULT NULL,
  `register_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `student_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=150 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam_generation`
--

LOCK TABLES `exam_generation` WRITE;
/*!40000 ALTER TABLE `exam_generation` DISABLE KEYS */;
/*!40000 ALTER TABLE `exam_generation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exam_seat_allocations`
--

DROP TABLE IF EXISTS `exam_seat_allocations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_seat_allocations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `exam_date` date DEFAULT NULL,
  `session` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `subject_code` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dept_code` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `semester` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `regulation` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `hall_id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `hall_code` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `row` int DEFAULT NULL,
  `col` int DEFAULT NULL,
  `student_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `register_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_subject_hall_date` (`subject_code`,`hall_id`,`exam_date`) USING BTREE,
  KEY `idx_exam_date` (`exam_date`) USING BTREE,
  KEY `idx_hall` (`hall_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=143 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam_seat_allocations`
--

LOCK TABLES `exam_seat_allocations` WRITE;
/*!40000 ALTER TABLE `exam_seat_allocations` DISABLE KEYS */;
/*!40000 ALTER TABLE `exam_seat_allocations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `exam_seat_plan_report`
--

DROP TABLE IF EXISTS `exam_seat_plan_report`;
/*!50001 DROP VIEW IF EXISTS `exam_seat_plan_report`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `exam_seat_plan_report` AS SELECT 
 1 AS `exam_date`,
 1 AS `day_order`,
 1 AS `session`,
 1 AS `subject_code`,
 1 AS `subject_name`,
 1 AS `dept_code`,
 1 AS `dept_name`,
 1 AS `dept_short`,
 1 AS `semester`,
 1 AS `regulation`,
 1 AS `hall_code`,
 1 AS `hall_name`,
 1 AS `col`,
 1 AS `col_letter`,
 1 AS `seat_index`,
 1 AS `seat_label`,
 1 AS `register_number`,
 1 AS `student_name`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `exam_timetable`
--

DROP TABLE IF EXISTS `exam_timetable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_timetable` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `Exam_Date` date DEFAULT NULL,
  `Day_Order` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Session` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Dept_Code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Dept_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Regulation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Semester` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Year` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub_Code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Col_No` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `QPC` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Elective` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Elective_No` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Regular_Count` int DEFAULT NULL,
  `Arrear_Count` int DEFAULT NULL,
  `Created_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `Update_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_exam_date` (`Exam_Date`) USING BTREE,
  KEY `idx_session` (`Elective`) USING BTREE,
  KEY `idx_type` (`Elective_No`) USING BTREE,
  KEY `idx_subject_code` (`Dept_Name`) USING BTREE,
  KEY `idx_course_code` (`Dept_Code`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam_timetable`
--

LOCK TABLES `exam_timetable` WRITE;
/*!40000 ALTER TABLE `exam_timetable` DISABLE KEYS */;
/*!40000 ALTER TABLE `exam_timetable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `exam_timetable_student_list`
--

DROP TABLE IF EXISTS `exam_timetable_student_list`;
/*!50001 DROP VIEW IF EXISTS `exam_timetable_student_list`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `exam_timetable_student_list` AS SELECT 
 1 AS `exam_timetable_id`,
 1 AS `Exam_Date`,
 1 AS `Session`,
 1 AS `Dept_Code`,
 1 AS `QPC`,
 1 AS `Regulation`,
 1 AS `Semester`,
 1 AS `Sub_Code`,
 1 AS `Register_Number`,
 1 AS `Student_Name`,
 1 AS `Exam_Type`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `fee_collection`
--

DROP TABLE IF EXISTS `fee_collection`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fee_collection` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `reg_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `application_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `roll_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `department` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `class` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `section` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `fee_types` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `total_amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `paid_amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `pending_amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `last_payment_date` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `payment_mode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `branch_sec` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `seat_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `allocated_quota` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_reg_no` (`reg_no`) USING BTREE,
  KEY `idx_roll_no` (`roll_no`) USING BTREE,
  KEY `idx_status` (`status`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fee_collection`
--

LOCK TABLES `fee_collection` WRITE;
/*!40000 ALTER TABLE `fee_collection` DISABLE KEYS */;
/*!40000 ALTER TABLE `fee_collection` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fee_ledger`
--

DROP TABLE IF EXISTS `fee_ledger`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fee_ledger` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `roll_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `department` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `semester` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fee_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `balance` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `academic_year` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `updated_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_roll_no` (`roll_no`) USING BTREE,
  KEY `idx_department` (`department`) USING BTREE,
  KEY `idx_fee_type` (`fee_type`) USING BTREE,
  KEY `idx_academic_year` (`academic_year`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fee_ledger`
--

LOCK TABLES `fee_ledger` WRITE;
/*!40000 ALTER TABLE `fee_ledger` DISABLE KEYS */;
/*!40000 ALTER TABLE `fee_ledger` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fee_master`
--

DROP TABLE IF EXISTS `fee_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fee_master` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Fee_Type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fee_master`
--

LOCK TABLES `fee_master` WRITE;
/*!40000 ALTER TABLE `fee_master` DISABLE KEYS */;
INSERT INTO `fee_master` VALUES (9,'ADMISSION FEE','2025-12-16 17:29:25','2025-12-16 17:29:25'),(10,'APPLICATION FEE','2025-12-16 17:29:25','2025-12-16 17:29:25'),(11,'BOOKS & STATIONARY FEES','2025-12-16 17:29:25','2025-12-16 17:29:25'),(12,'BUS FEES','2025-12-16 17:29:25','2025-12-16 17:29:25'),(13,'COURSE COMPLETION CERTIFICATE FEE','2025-12-16 17:29:25','2025-12-16 17:29:25'),(14,'DEVELOPMENT FEE','2025-12-16 17:29:25','2025-12-16 17:29:25'),(15,'EXAM FEE','2025-12-16 17:29:25','2025-12-16 17:29:25'),(16,'EXAM FEES','2025-12-16 17:29:25','2025-12-16 17:29:25'),(17,'HOSTEL FEES','2025-12-16 17:29:25','2026-01-20 19:21:22'),(18,'INDUSTRIAL VISIT','2025-12-16 17:29:25','2025-12-16 17:29:25'),(19,'LABORATORY FEE','2025-12-16 17:29:25','2025-12-16 17:29:25'),(20,'MISCELLANEOUS FEE','2025-12-16 17:29:25','2025-12-16 17:29:25'),(21,'PROJECT FEE','2025-12-16 17:29:25','2025-12-16 17:29:25'),(22,'RECORD NOTE & SHEETS FEE','2025-12-16 17:29:25','2025-12-16 17:29:25'),(23,'RECORD NOTE BOOK FEE','2025-12-16 17:29:25','2025-12-16 17:29:25'),(24,'REGISTRATION FEE','2025-12-16 17:29:25','2025-12-16 17:29:25'),(25,'SEMESTER FEE','2025-12-16 17:29:25','2025-12-16 17:29:25'),(26,'SEMINAR FEE','2025-12-16 17:29:25','2025-12-16 17:29:25'),(27,'SUPPLEMENTARY EXAM FEE','2025-12-16 17:29:25','2025-12-16 17:29:25'),(28,'SUPPLEMENTARY EXAM FEES','2025-12-16 17:29:25','2025-12-16 17:29:25'),(29,'TEXT BOOK FEE','2025-12-16 17:29:25','2025-12-16 17:29:25'),(30,'TUITION FEE','2025-12-16 17:29:25','2025-12-16 17:29:25'),(31,'UNIFORM ,BOOKS & RECORD FEE','2025-12-16 17:29:25','2025-12-16 17:29:25'),(32,'UNIFORM FEE','2025-12-16 17:29:25','2025-12-16 17:29:25'),(33,'Breakage Fess','2026-01-07 12:22:59','2026-01-07 12:22:59');
/*!40000 ALTER TABLE `fee_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fee_recipt`
--

DROP TABLE IF EXISTS `fee_recipt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fee_recipt` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `date` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `department` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `sem` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fee_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `roll_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `application_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `student_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `total_amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `pay_now` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `paid_amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `pending_amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `security_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `academic` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `payment_mode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `reference_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_roll_no` (`roll_no`) USING BTREE,
  KEY `idx_application_no` (`application_no`) USING BTREE,
  KEY `idx_fee_type` (`fee_type`) USING BTREE,
  KEY `idx_student_name` (`student_name`) USING BTREE,
  KEY `idx_status` (`status`) USING BTREE,
  KEY `idx_date` (`date`) USING BTREE,
  KEY `idx_academic` (`academic`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fee_recipt`
--

LOCK TABLES `fee_recipt` WRITE;
/*!40000 ALTER TABLE `fee_recipt` DISABLE KEYS */;
/*!40000 ALTER TABLE `fee_recipt` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fees_details`
--

DROP TABLE IF EXISTS `fees_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fees_details` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Academic_Year` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Mode_of_Join` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Course_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Dept_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Dept_Code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Semester` int DEFAULT NULL,
  `Year` int DEFAULT NULL,
  `Type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Fees_Type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Amount` decimal(10,2) DEFAULT NULL,
  `Created_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `Updated_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=285 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fees_details`
--

LOCK TABLES `fees_details` WRITE;
/*!40000 ALTER TABLE `fees_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `fees_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hall_master`
--

DROP TABLE IF EXISTS `hall_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hall_master` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Hall_Code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Hall_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Total_Rows` int DEFAULT '0',
  `Total_Columns` int DEFAULT '0',
  `Seating_Capacity` int DEFAULT '0',
  `Hall_Type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Floor_Number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Block_Name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Location_Note` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Facilities` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Preference` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Active',
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hall_master`
--

LOCK TABLES `hall_master` WRITE;
/*!40000 ALTER TABLE `hall_master` DISABLE KEYS */;
/*!40000 ALTER TABLE `hall_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hr_leave_balance`
--

DROP TABLE IF EXISTS `hr_leave_balance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hr_leave_balance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `staff_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `leave_type_id` int NOT NULL,
  `academic_year` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `opening_balance` decimal(5,1) DEFAULT '0.0',
  `leaves_taken` decimal(5,1) DEFAULT '0.0',
  `leaves_adjusted` decimal(5,1) DEFAULT '0.0',
  `closing_balance` decimal(5,1) DEFAULT '0.0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `unique_balance` (`staff_id`,`leave_type_id`,`academic_year`) USING BTREE,
  KEY `leave_type_id` (`leave_type_id`) USING BTREE,
  CONSTRAINT `hr_leave_balance_ibfk_1` FOREIGN KEY (`leave_type_id`) REFERENCES `hr_leave_types` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hr_leave_balance`
--

LOCK TABLES `hr_leave_balance` WRITE;
/*!40000 ALTER TABLE `hr_leave_balance` DISABLE KEYS */;
/*!40000 ALTER TABLE `hr_leave_balance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hr_leave_requests`
--

DROP TABLE IF EXISTS `hr_leave_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hr_leave_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `staff_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `leave_type_id` int NOT NULL,
  `from_date` date NOT NULL,
  `to_date` date NOT NULL,
  `total_days` decimal(5,1) NOT NULL,
  `reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `status` enum('Pending','Approved','Rejected','Cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'Pending',
  `approved_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `rejection_reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `applied_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `leave_type_id` (`leave_type_id`) USING BTREE,
  KEY `idx_leave_requests_status` (`status`) USING BTREE,
  KEY `idx_leave_requests_staff` (`staff_id`) USING BTREE,
  CONSTRAINT `hr_leave_requests_ibfk_1` FOREIGN KEY (`leave_type_id`) REFERENCES `hr_leave_types` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hr_leave_requests`
--

LOCK TABLES `hr_leave_requests` WRITE;
/*!40000 ALTER TABLE `hr_leave_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `hr_leave_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hr_leave_types`
--

DROP TABLE IF EXISTS `hr_leave_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hr_leave_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `leave_code` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `leave_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `max_days_per_year` int DEFAULT '0',
  `carry_forward` tinyint(1) DEFAULT '0',
  `is_paid` tinyint(1) DEFAULT '1',
  `is_active` tinyint(1) DEFAULT '1',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `leave_code` (`leave_code`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hr_leave_types`
--

LOCK TABLES `hr_leave_types` WRITE;
/*!40000 ALTER TABLE `hr_leave_types` DISABLE KEYS */;
INSERT INTO `hr_leave_types` VALUES (1,'CL','Casual Leave',12,0,1,1,NULL,'2026-02-03 15:07:06','2026-02-03 15:07:06'),(2,'SL','Sick Leave',10,0,1,1,NULL,'2026-02-03 15:07:06','2026-02-03 15:07:06'),(3,'EL','Earned Leave',15,1,1,1,NULL,'2026-02-03 15:07:06','2026-02-03 15:07:06'),(4,'ML','Maternity Leave',180,0,1,1,NULL,'2026-02-03 15:07:06','2026-02-03 15:07:06'),(5,'PL','Paternity Leave',15,0,1,1,NULL,'2026-02-03 15:07:06','2026-02-03 15:07:06'),(6,'LOP','Loss of Pay',365,0,0,1,NULL,'2026-02-03 15:07:06','2026-02-03 15:07:06');
/*!40000 ALTER TABLE `hr_leave_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hr_payroll`
--

DROP TABLE IF EXISTS `hr_payroll`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hr_payroll` (
  `id` int NOT NULL AUTO_INCREMENT,
  `staff_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `payroll_month` int NOT NULL,
  `payroll_year` int NOT NULL,
  `working_days` int DEFAULT '0',
  `present_days` decimal(5,1) DEFAULT '0.0',
  `loss_of_pay_days` decimal(5,1) DEFAULT '0.0',
  `gross_earnings` decimal(12,2) DEFAULT '0.00',
  `total_deductions` decimal(12,2) DEFAULT '0.00',
  `net_salary` decimal(12,2) DEFAULT '0.00',
  `status` enum('Draft','Processed','Approved','Paid') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'Draft',
  `processed_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `processed_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `unique_payroll` (`staff_id`,`payroll_month`,`payroll_year`) USING BTREE,
  KEY `idx_payroll_month_year` (`payroll_month`,`payroll_year`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hr_payroll`
--

LOCK TABLES `hr_payroll` WRITE;
/*!40000 ALTER TABLE `hr_payroll` DISABLE KEYS */;
/*!40000 ALTER TABLE `hr_payroll` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hr_payroll_details`
--

DROP TABLE IF EXISTS `hr_payroll_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hr_payroll_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `payroll_id` int NOT NULL,
  `component_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `payroll_id` (`payroll_id`) USING BTREE,
  KEY `component_id` (`component_id`) USING BTREE,
  CONSTRAINT `hr_payroll_details_ibfk_1` FOREIGN KEY (`payroll_id`) REFERENCES `hr_payroll` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `hr_payroll_details_ibfk_2` FOREIGN KEY (`component_id`) REFERENCES `hr_salary_components` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hr_payroll_details`
--

LOCK TABLES `hr_payroll_details` WRITE;
/*!40000 ALTER TABLE `hr_payroll_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `hr_payroll_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hr_salary_components`
--

DROP TABLE IF EXISTS `hr_salary_components`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hr_salary_components` (
  `id` int NOT NULL AUTO_INCREMENT,
  `component_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `component_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `component_type` enum('Earning','Deduction') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `is_percentage` tinyint(1) DEFAULT '0',
  `percentage_of` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `default_amount` decimal(10,2) DEFAULT '0.00',
  `is_mandatory` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `display_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `component_code` (`component_code`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hr_salary_components`
--

LOCK TABLES `hr_salary_components` WRITE;
/*!40000 ALTER TABLE `hr_salary_components` DISABLE KEYS */;
INSERT INTO `hr_salary_components` VALUES (1,'BASIC','Basic Salary','Earning',0,NULL,0.00,1,1,1,'2026-02-03 15:07:06','2026-02-03 15:07:06'),(2,'HRA','House Rent Allowance','Earning',0,NULL,0.00,0,1,2,'2026-02-03 15:07:06','2026-02-03 15:07:06'),(3,'DA','Dearness Allowance','Earning',0,NULL,0.00,0,1,3,'2026-02-03 15:07:06','2026-02-03 15:07:06'),(4,'CONV','Conveyance Allowance','Earning',0,NULL,0.00,0,1,4,'2026-02-03 15:07:06','2026-02-03 15:07:06'),(5,'MED','Medical Allowance','Earning',0,NULL,0.00,0,1,5,'2026-02-03 15:07:06','2026-02-03 15:07:06'),(6,'SPECIAL','Special Allowance','Earning',0,NULL,0.00,0,1,6,'2026-02-03 15:07:06','2026-02-03 15:07:06'),(7,'PF','Provident Fund','Deduction',0,NULL,0.00,1,1,1,'2026-02-03 15:07:06','2026-02-03 15:07:06'),(8,'ESI','ESI','Deduction',0,NULL,0.00,0,1,2,'2026-02-03 15:07:06','2026-02-03 15:07:06'),(9,'PT','Professional Tax','Deduction',0,NULL,0.00,0,1,3,'2026-02-03 15:07:06','2026-02-03 15:07:06'),(10,'TDS','Tax Deducted at Source','Deduction',0,NULL,0.00,0,1,4,'2026-02-03 15:07:06','2026-02-03 15:07:06');
/*!40000 ALTER TABLE `hr_salary_components` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hr_shifts`
--

DROP TABLE IF EXISTS `hr_shifts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hr_shifts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `shift_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `break_duration` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '1 hour',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hr_shifts`
--

LOCK TABLES `hr_shifts` WRITE;
/*!40000 ALTER TABLE `hr_shifts` DISABLE KEYS */;
INSERT INTO `hr_shifts` VALUES (1,'Day Shift','09:00:00','18:00:00','1 hour',1,'2026-02-03 15:07:06','2026-02-03 15:07:06'),(2,'Night Shift','21:00:00','06:00:00','1 hour',1,'2026-02-03 15:07:06','2026-02-03 15:07:06'),(3,'Morning Shift','06:00:00','14:00:00','30 mins',1,'2026-02-03 15:07:06','2026-02-03 15:07:06'),(4,'Day Shift','09:00:00','18:00:00','1 hour',1,'2026-02-03 18:00:29','2026-02-03 18:00:29'),(5,'Night Shift','21:00:00','06:00:00','1 hour',1,'2026-02-03 18:00:29','2026-02-03 18:00:29'),(6,'Morning Shift','06:00:00','14:00:00','30 mins',1,'2026-02-03 18:00:29','2026-02-03 18:00:29');
/*!40000 ALTER TABLE `hr_shifts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hr_staff_attendance`
--

DROP TABLE IF EXISTS `hr_staff_attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hr_staff_attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `staff_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `attendance_date` date NOT NULL,
  `shift_id` int DEFAULT NULL,
  `punch_in` time DEFAULT NULL,
  `punch_out` time DEFAULT NULL,
  `status` enum('Present','Absent','Half Day','On Leave','On Duty','Late') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'Present',
  `remarks` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `marked_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `unique_attendance` (`staff_id`,`attendance_date`) USING BTREE,
  KEY `shift_id` (`shift_id`) USING BTREE,
  KEY `idx_attendance_date` (`attendance_date`) USING BTREE,
  KEY `idx_attendance_staff` (`staff_id`) USING BTREE,
  CONSTRAINT `hr_staff_attendance_ibfk_1` FOREIGN KEY (`shift_id`) REFERENCES `hr_shifts` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hr_staff_attendance`
--

LOCK TABLES `hr_staff_attendance` WRITE;
/*!40000 ALTER TABLE `hr_staff_attendance` DISABLE KEYS */;
/*!40000 ALTER TABLE `hr_staff_attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hr_staff_salary`
--

DROP TABLE IF EXISTS `hr_staff_salary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hr_staff_salary` (
  `id` int NOT NULL AUTO_INCREMENT,
  `staff_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `component_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `effective_from` date NOT NULL,
  `effective_to` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `component_id` (`component_id`) USING BTREE,
  CONSTRAINT `hr_staff_salary_ibfk_1` FOREIGN KEY (`component_id`) REFERENCES `hr_salary_components` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hr_staff_salary`
--

LOCK TABLES `hr_staff_salary` WRITE;
/*!40000 ALTER TABLE `hr_staff_salary` DISABLE KEYS */;
/*!40000 ALTER TABLE `hr_staff_salary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `income_expense_entries`
--

DROP TABLE IF EXISTS `income_expense_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `income_expense_entries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entry_date` date NOT NULL,
  `group_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `category_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `person_name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `authorization` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `payment_mode` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `detail` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `bill_no` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `income` decimal(12,2) DEFAULT '0.00',
  `expense` decimal(12,2) DEFAULT '0.00',
  `suspense` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `income_expense_entries`
--

LOCK TABLES `income_expense_entries` WRITE;
/*!40000 ALTER TABLE `income_expense_entries` DISABLE KEYS */;
/*!40000 ALTER TABLE `income_expense_entries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `income_expense_master`
--

DROP TABLE IF EXISTS `income_expense_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `income_expense_master` (
  `id` int NOT NULL AUTO_INCREMENT,
  `group_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `category_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `person_name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `group_name` (`group_name`,`category_name`,`person_name`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `income_expense_master`
--

LOCK TABLES `income_expense_master` WRITE;
/*!40000 ALTER TABLE `income_expense_master` DISABLE KEYS */;
/*!40000 ALTER TABLE `income_expense_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ins_type_master`
--

DROP TABLE IF EXISTS `ins_type_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ins_type_master` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Ins_Type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ins_type_master`
--

LOCK TABLES `ins_type_master` WRITE;
/*!40000 ALTER TABLE `ins_type_master` DISABLE KEYS */;
INSERT INTO `ins_type_master` VALUES (1,'Government','2025-11-16 11:45:09','2025-11-16 11:45:09'),(2,'Self-Finance','2025-11-16 11:45:09','2025-11-16 11:45:09'),(3,'Aided','2025-11-16 11:45:09','2025-11-16 11:45:09');
/*!40000 ALTER TABLE `ins_type_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `institution_master`
--

DROP TABLE IF EXISTS `institution_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `institution_master` (
  `ins_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `ins_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`ins_code`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `institution_master`
--

LOCK TABLES `institution_master` WRITE;
/*!40000 ALTER TABLE `institution_master` DISABLE KEYS */;
/*!40000 ALTER TABLE `institution_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `internal_theory`
--

DROP TABLE IF EXISTS `internal_theory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `internal_theory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Subcode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Regno` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SubName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `T1` int DEFAULT NULL,
  `T2` int DEFAULT NULL,
  `MTest` decimal(5,2) DEFAULT NULL,
  `MaxT` decimal(5,2) DEFAULT NULL,
  `MT5` decimal(5,2) DEFAULT NULL,
  `Test` decimal(5,2) DEFAULT NULL,
  `A1` int DEFAULT NULL,
  `A2` int DEFAULT NULL,
  `A3` int DEFAULT NULL,
  `Assign` decimal(5,2) DEFAULT NULL,
  `AttAvg` decimal(5,2) DEFAULT NULL,
  `AttMark` int DEFAULT NULL,
  `MTotal` decimal(6,2) DEFAULT NULL,
  `RTotal` decimal(6,2) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `internal_theory`
--

LOCK TABLES `internal_theory` WRITE;
/*!40000 ALTER TABLE `internal_theory` DISABLE KEYS */;
/*!40000 ALTER TABLE `internal_theory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `library_books`
--

DROP TABLE IF EXISTS `library_books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `library_books` (
  `id` int NOT NULL AUTO_INCREMENT,
  `book_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `author` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `isbn` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `category` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `book_language` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `publisher` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `edition` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `publication_year` year DEFAULT NULL,
  `number_of_pages` int DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `rack` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `position` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `book_cover` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `library_books`
--

LOCK TABLES `library_books` WRITE;
/*!40000 ALTER TABLE `library_books` DISABLE KEYS */;
/*!40000 ALTER TABLE `library_books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `log_details`
--

DROP TABLE IF EXISTS `log_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `log_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `role` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `login_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `action` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=222 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log_details`
--

LOCK TABLES `log_details` WRITE;
/*!40000 ALTER TABLE `log_details` DISABLE KEYS */;
INSERT INTO `log_details` VALUES (187,'10000001','Admin','2026-02-02 19:15:29','Logged in','2026-02-02 19:15:29','2026-02-02 19:15:29'),(188,'25BPLE01','Student','2026-02-02 19:18:05','Logged in','2026-02-02 19:18:05','2026-02-02 19:18:05'),(189,'10000001','Admin','2026-02-02 19:19:49','Logged in','2026-02-02 19:19:49','2026-02-02 19:19:49'),(190,'25BPLE01','Student','2026-02-02 19:44:41','Logged in','2026-02-02 19:44:41','2026-02-02 19:44:41'),(191,'10000001','Admin','2026-02-02 19:45:23','Logged in','2026-02-02 19:45:23','2026-02-02 19:45:23'),(192,'10000001','Admin','2026-02-03 09:35:01','Logged in','2026-02-03 09:35:01','2026-02-03 09:35:01'),(193,'10000001','Admin','2026-02-03 10:17:36','Logged in','2026-02-03 10:17:36','2026-02-03 10:17:36'),(194,'25BPLE01','Student','2026-02-03 11:00:39','Logged in','2026-02-03 11:00:39','2026-02-03 11:00:39'),(195,'10000001','Admin','2026-02-03 11:03:05','Logged in','2026-02-03 11:03:05','2026-02-03 11:03:05'),(196,'10000001','Admin','2026-02-03 20:33:07','Logged in','2026-02-03 20:33:07','2026-02-03 20:33:07'),(197,'10000001','Admin','2026-02-03 20:49:03','Logged in','2026-02-03 20:49:03','2026-02-03 20:49:03'),(198,'10000001','Admin','2026-02-03 21:27:13','Logged in','2026-02-03 21:27:13','2026-02-03 21:27:13'),(199,'10000001','Admin','2026-02-03 21:38:24','Logged in','2026-02-03 21:38:24','2026-02-03 21:38:24'),(200,'10000001','Admin','2026-02-03 21:48:18','Logged in','2026-02-03 21:48:18','2026-02-03 21:48:18'),(201,'10000001','Admin','2026-02-04 01:56:22','Logged in','2026-02-04 01:56:22','2026-02-04 01:56:22'),(202,'10000001','Admin','2026-02-04 02:03:24','Logged in','2026-02-04 02:03:24','2026-02-04 02:03:24'),(203,'10000001','Admin','2026-02-04 02:17:40','Logged in','2026-02-04 02:17:40','2026-02-04 02:17:40'),(204,'10000001','Admin','2026-02-04 03:14:40','Logged in','2026-02-04 03:14:40','2026-02-04 03:14:40'),(205,'10000001','Admin','2026-02-04 16:16:10','Logged in','2026-02-04 16:16:10','2026-02-04 16:16:10'),(206,'10000001','Admin','2026-02-04 16:25:18','Logged in','2026-02-04 16:25:18','2026-02-04 16:25:18'),(207,'10000001','Admin','2026-02-04 16:58:02','Logged in','2026-02-04 16:58:02','2026-02-04 16:58:02'),(208,'10000001','Admin','2026-02-04 14:54:41','Logged in','2026-02-04 14:54:41','2026-02-04 14:54:41'),(209,'10000001','Admin','2026-02-04 15:37:36','Logged in','2026-02-04 15:37:36','2026-02-04 15:37:36'),(210,'10000001','Admin','2026-02-05 06:06:02','Logged in','2026-02-05 06:06:02','2026-02-05 06:06:02'),(211,'10000001','Admin','2026-02-05 06:42:38','Logged in','2026-02-05 06:42:38','2026-02-05 06:42:38'),(212,'10000001','Admin','2026-02-05 06:52:31','Logged in','2026-02-05 06:52:31','2026-02-05 06:52:31'),(213,'10000001','Admin','2026-02-05 07:09:16','Logged in','2026-02-05 07:09:16','2026-02-05 07:09:16'),(214,'10000001','Admin','2026-02-05 07:44:45','Logged in','2026-02-05 07:44:45','2026-02-05 07:44:45'),(215,'10000001','Admin','2026-02-05 13:04:20','Logged in','2026-02-05 13:04:20','2026-02-05 13:04:20'),(216,'10000001','Admin','2026-02-05 13:16:13','Logged in','2026-02-05 13:16:13','2026-02-05 13:16:13'),(217,'10000001','Admin','2026-02-05 13:17:19','Logged in','2026-02-05 13:17:19','2026-02-05 13:17:19'),(218,'25BPLE01','Student','2026-02-05 13:22:51','Logged in','2026-02-05 13:22:51','2026-02-05 13:22:51'),(219,'25BPLE01','Student','2026-02-05 14:13:34','Logged in','2026-02-05 14:13:34','2026-02-05 14:13:34'),(220,'10000001','Admin','2026-02-05 14:23:20','Logged in','2026-02-05 14:23:20','2026-02-05 14:23:20'),(221,'25BPLE01','Student','2026-02-05 14:25:18','Logged in','2026-02-05 14:25:18','2026-02-05 14:25:18');
/*!40000 ALTER TABLE `log_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maintenance_records`
--

DROP TABLE IF EXISTS `maintenance_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maintenance_records` (
  `id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `vehicle_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `date` date NOT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cost` decimal(12,2) DEFAULT '0.00',
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_vehicle_id` (`vehicle_id`) USING BTREE,
  KEY `idx_date` (`date`) USING BTREE,
  CONSTRAINT `maintenance_records_ibfk_1` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maintenance_records`
--

LOCK TABLES `maintenance_records` WRITE;
/*!40000 ALTER TABLE `maintenance_records` DISABLE KEYS */;
/*!40000 ALTER TABLE `maintenance_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `wish_id` int NOT NULL,
  `student_user_id` int NOT NULL,
  `student_register_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('unread','read','archived') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'unread',
  `is_read` tinyint(1) DEFAULT '0',
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `unique_notification_per_student_per_wish` (`wish_id`,`student_user_id`) USING BTREE,
  KEY `idx_student_user_id` (`student_user_id`) USING BTREE,
  KEY `idx_student_register` (`student_register_number`) USING BTREE,
  KEY `idx_status` (`status`) USING BTREE,
  KEY `idx_created_at` (`created_at`) USING BTREE,
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`wish_id`) REFERENCES `birthday_wishes` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,1,4530,'560021529044','read',1,'2026-02-03 14:40:40','2026-02-03 13:25:42','2026-02-03 14:40:40');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `overall_att_date_wise`
--

DROP TABLE IF EXISTS `overall_att_date_wise`;
/*!50001 DROP VIEW IF EXISTS `overall_att_date_wise`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `overall_att_date_wise` AS SELECT 
 1 AS `Att_Date`,
 1 AS `total_present`,
 1 AS `total_absent`,
 1 AS `total_students`,
 1 AS `overall_present_percentage`,
 1 AS `overall_absent_percentage`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `placement`
--

DROP TABLE IF EXISTS `placement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `placement` (
  `id` int NOT NULL AUTO_INCREMENT,
  `REGNO` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `StudName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CNO` int DEFAULT NULL,
  `SEM` int DEFAULT NULL,
  `MarkPer` decimal(5,2) DEFAULT NULL,
  `Arrear` int DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `address` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mobile` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `PrvMark` decimal(5,2) DEFAULT NULL,
  `Sem1` decimal(5,2) DEFAULT NULL,
  `Sem2` decimal(5,2) DEFAULT NULL,
  `Sem3` decimal(5,2) DEFAULT NULL,
  `Sem4` decimal(5,2) DEFAULT NULL,
  `Sem5` decimal(5,2) DEFAULT NULL,
  `Sem6` decimal(5,2) DEFAULT NULL,
  `Sem7` decimal(5,2) DEFAULT NULL,
  `Sem8` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `placement`
--

LOCK TABLES `placement` WRITE;
/*!40000 ALTER TABLE `placement` DISABLE KEYS */;
/*!40000 ALTER TABLE `placement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `placement_details`
--

DROP TABLE IF EXISTS `placement_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `placement_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `register_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `stduent_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dept_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dept_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `semester` int DEFAULT NULL,
  `year` int DEFAULT NULL,
  `regulation` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `academic_year` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `company_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `company_location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `package_level` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `placement_details`
--

LOCK TABLES `placement_details` WRITE;
/*!40000 ALTER TABLE `placement_details` DISABLE KEYS */;
INSERT INTO `placement_details` VALUES (4,'25BPLE01','ARAVIND M','5010','B.PHARM (BACHELOR OF PHARMACY)',3,2,'A','2025-2026','TCS','Chennai','4LPA','2026-02-03 11:23:02','2026-02-03 11:23:02');
/*!40000 ALTER TABLE `placement_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `practical_exam_timetable`
--

DROP TABLE IF EXISTS `practical_exam_timetable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `practical_exam_timetable` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `Exam_Date` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Day_Order` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Session` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Dept_Code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Dept_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Regulation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Semester` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Year` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub_Code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Col_No` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `QPC` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Elective` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Elective_No` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Regular_Count` int DEFAULT NULL,
  `Arrear_Count` int DEFAULT NULL,
  `Created_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `Update_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_exam_date` (`Exam_Date`) USING BTREE,
  KEY `idx_session` (`Elective`) USING BTREE,
  KEY `idx_type` (`Elective_No`) USING BTREE,
  KEY `idx_subject_code` (`Dept_Name`) USING BTREE,
  KEY `idx_course_code` (`Dept_Code`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `practical_exam_timetable`
--

LOCK TABLES `practical_exam_timetable` WRITE;
/*!40000 ALTER TABLE `practical_exam_timetable` DISABLE KEYS */;
/*!40000 ALTER TABLE `practical_exam_timetable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `practical_mark`
--

DROP TABLE IF EXISTS `practical_mark`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `practical_mark` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Register_Number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Course_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Dept_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Dept_Code` int DEFAULT NULL,
  `Semester` int DEFAULT NULL,
  `Regulation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Class_Section` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub_Code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Assessment_Type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Assessment_Date` date DEFAULT NULL,
  `Test_No` int DEFAULT NULL,
  `Experiment_Count` int DEFAULT NULL,
  `Max_Marks` int DEFAULT NULL,
  `Obtained_Mark_Exp_1` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Obtained_Mark_Exp_2` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Obtained_Mark_Exp_3` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Obtained_Mark_Exp_4` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Obtained_Mark_Exp_5` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Obtained_Mark_Exp_6` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Obtained_Mark_Exp_7` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Obtained_Mark_Exp_8` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Obtained_Mark_Exp_9` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Obtained_Mark_Exp_10` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Obtained_Mark_Exp_11` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Obtained_Mark_Exp_12` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Obtained_Mark_Exp_13` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Obtained_Mark_Exp_14` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Obtained_Mark_Exp_15` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Entered_By` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=142 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `practical_mark`
--

LOCK TABLES `practical_mark` WRITE;
/*!40000 ALTER TABLE `practical_mark` DISABLE KEYS */;
/*!40000 ALTER TABLE `practical_mark` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `practical_mark_entered`
--

DROP TABLE IF EXISTS `practical_mark_entered`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `practical_mark_entered` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Register_Number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Course_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Dept_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Dept_Code` int DEFAULT NULL,
  `Semester` int DEFAULT NULL,
  `Regulation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Class_Section` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub_Code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Assessment_Type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Assessment_Date` date DEFAULT NULL,
  `Test_No` int DEFAULT NULL,
  `Experiment_Count` int DEFAULT NULL,
  `Max_Marks` int DEFAULT NULL,
  `Synopsis_1` int DEFAULT NULL,
  `Major_1` int DEFAULT NULL,
  `Minor_1` int DEFAULT NULL,
  `Viva_1` int DEFAULT NULL,
  `Total_1` int DEFAULT NULL,
  `Synopsis_2` int DEFAULT NULL,
  `Major_2` int DEFAULT NULL,
  `Minor_2` int DEFAULT NULL,
  `Viva_2` int DEFAULT NULL,
  `Total_2` int DEFAULT NULL,
  `Synopsis_3` int DEFAULT NULL,
  `Major_3` int DEFAULT NULL,
  `Minor_3` int DEFAULT NULL,
  `Viva_3` int DEFAULT NULL,
  `Total_3` int DEFAULT NULL,
  `Synopsis_4` int DEFAULT NULL,
  `Major_4` int DEFAULT NULL,
  `Minor_4` int DEFAULT NULL,
  `Viva_4` int DEFAULT NULL,
  `Total_4` int DEFAULT NULL,
  `Synopsis_5` int DEFAULT NULL,
  `Major_5` int DEFAULT NULL,
  `Minor_5` int DEFAULT NULL,
  `Viva_5` int DEFAULT NULL,
  `Total_5` int DEFAULT NULL,
  `Synopsis_6` int DEFAULT NULL,
  `Major_6` int DEFAULT NULL,
  `Minor_6` int DEFAULT NULL,
  `Viva_6` int DEFAULT NULL,
  `Total_6` int DEFAULT NULL,
  `Synopsis_7` int DEFAULT NULL,
  `Major_7` int DEFAULT NULL,
  `Minor_7` int DEFAULT NULL,
  `Viva_7` int DEFAULT NULL,
  `Total_7` int DEFAULT NULL,
  `Synopsis_8` int DEFAULT NULL,
  `Major_8` int DEFAULT NULL,
  `Minor_8` int DEFAULT NULL,
  `Viva_8` int DEFAULT NULL,
  `Total_8` int DEFAULT NULL,
  `Synopsis_9` int DEFAULT NULL,
  `Major_9` int DEFAULT NULL,
  `Minor_9` int DEFAULT NULL,
  `Viva_9` int DEFAULT NULL,
  `Total_9` int DEFAULT NULL,
  `Synopsis_10` int DEFAULT NULL,
  `Major_10` int DEFAULT NULL,
  `Minor_10` int DEFAULT NULL,
  `Viva_10` int DEFAULT NULL,
  `Total_10` int DEFAULT NULL,
  `Synopsis_11` int DEFAULT NULL,
  `Major_11` int DEFAULT NULL,
  `Minor_11` int DEFAULT NULL,
  `Viva_11` int DEFAULT NULL,
  `Total_11` int DEFAULT NULL,
  `Synopsis_12` int DEFAULT NULL,
  `Major_12` int DEFAULT NULL,
  `Minor_12` int DEFAULT NULL,
  `Viva_12` int DEFAULT NULL,
  `Total_12` int DEFAULT NULL,
  `Synopsis_13` int DEFAULT NULL,
  `Major_13` int DEFAULT NULL,
  `Minor_13` int DEFAULT NULL,
  `Viva_13` int DEFAULT NULL,
  `Total_13` int DEFAULT NULL,
  `Synopsis_14` int DEFAULT NULL,
  `Major_14` int DEFAULT NULL,
  `Minor_14` int DEFAULT NULL,
  `Viva_14` int DEFAULT NULL,
  `Total_14` int DEFAULT NULL,
  `Synopsis_15` int DEFAULT NULL,
  `Major_15` int DEFAULT NULL,
  `Minor_15` int DEFAULT NULL,
  `Viva_15` int DEFAULT NULL,
  `Total_15` int DEFAULT NULL,
  `Synopsis_16` int DEFAULT NULL,
  `Major_16` int DEFAULT NULL,
  `Minor_16` int DEFAULT NULL,
  `Viva_16` int DEFAULT NULL,
  `Total_16` int DEFAULT NULL,
  `Synopsis_17` int DEFAULT NULL,
  `Major_17` int DEFAULT NULL,
  `Minor_17` int DEFAULT NULL,
  `Viva_17` int DEFAULT NULL,
  `Total_17` int DEFAULT NULL,
  `Synopsis_18` int DEFAULT NULL,
  `Major_18` int DEFAULT NULL,
  `Minor_18` int DEFAULT NULL,
  `Viva_18` int DEFAULT NULL,
  `Total_18` int DEFAULT NULL,
  `Synopsis_19` int DEFAULT NULL,
  `Major_19` int DEFAULT NULL,
  `Minor_19` int DEFAULT NULL,
  `Viva_19` int DEFAULT NULL,
  `Total_19` int DEFAULT NULL,
  `Synopsis_20` int DEFAULT NULL,
  `Major_20` int DEFAULT NULL,
  `Minor_20` int DEFAULT NULL,
  `Viva_20` int DEFAULT NULL,
  `Total_20` int DEFAULT NULL,
  `Entered_By` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `practical_mark_entered`
--

LOCK TABLES `practical_mark_entered` WRITE;
/*!40000 ALTER TABLE `practical_mark_entered` DISABLE KEYS */;
/*!40000 ALTER TABLE `practical_mark_entered` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `practical_summary`
--

DROP TABLE IF EXISTS `practical_summary`;
/*!50001 DROP VIEW IF EXISTS `practical_summary`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `practical_summary` AS SELECT 
 1 AS `Register_Number`,
 1 AS `Sub_Code`,
 1 AS `practical_obtained`,
 1 AS `Max_Marks`,
 1 AS `practical_percentage`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `purchases`
--

DROP TABLE IF EXISTS `purchases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchases` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `purchase_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `date` date NOT NULL,
  `product_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `brand_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `company_vendor` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `purchase_order_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `order_date` date DEFAULT NULL,
  `dc_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `bill_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `bill_date` date DEFAULT NULL,
  `qty` decimal(14,2) DEFAULT '0.00',
  `rate` decimal(14,2) DEFAULT '0.00',
  `vat_applied` tinyint(1) DEFAULT '0',
  `tax_applied` tinyint(1) DEFAULT '0',
  `total_amount` decimal(18,2) DEFAULT '0.00',
  `current_stock` int DEFAULT '0',
  `total_stock` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idx_purchase_id` (`purchase_id`) USING BTREE,
  KEY `idx_product_name` (`product_name`) USING BTREE,
  KEY `idx_brand_name` (`brand_name`) USING BTREE,
  KEY `idx_company_vendor` (`company_vendor`) USING BTREE,
  KEY `idx_bill_no` (`bill_no`) USING BTREE,
  KEY `idx_purchase_order_no` (`purchase_order_no`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchases`
--

LOCK TABLES `purchases` WRITE;
/*!40000 ALTER TABLE `purchases` DISABLE KEYS */;
/*!40000 ALTER TABLE `purchases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `qp`
--

DROP TABLE IF EXISTS `qp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `qp` (
  `id` int NOT NULL AUTO_INCREMENT,
  `EQC` int DEFAULT NULL,
  `Course` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Cno` int DEFAULT NULL,
  `SubCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SubName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Elective` int DEFAULT NULL,
  `Sem` int DEFAULT NULL,
  `ColNo` int DEFAULT NULL,
  `Regl` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Candidates` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `qp`
--

LOCK TABLES `qp` WRITE;
/*!40000 ALTER TABLE `qp` DISABLE KEYS */;
/*!40000 ALTER TABLE `qp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quota_allocation`
--

DROP TABLE IF EXISTS `quota_allocation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quota_allocation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Type` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Course_Name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Dept_Code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `OC` int DEFAULT '0',
  `BC` int DEFAULT '0',
  `BCO` int DEFAULT '0',
  `BCM` int DEFAULT '0',
  `MBC` int DEFAULT '0',
  `SC` int DEFAULT '0',
  `SCA` int DEFAULT '0',
  `ST` int DEFAULT '0',
  `Other` int DEFAULT '0',
  `TotSeat` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quota_allocation`
--

LOCK TABLES `quota_allocation` WRITE;
/*!40000 ALTER TABLE `quota_allocation` DISABLE KEYS */;
/*!40000 ALTER TABLE `quota_allocation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recive_letter`
--

DROP TABLE IF EXISTS `recive_letter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recive_letter` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `letter_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `letter_date` date NOT NULL,
  `sender` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `replay` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `received_date` date DEFAULT NULL,
  `received_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `priority` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Normal',
  `department` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_sender` (`sender`) USING BTREE,
  KEY `idx_received_date` (`received_date`) USING BTREE,
  KEY `idx_department` (`department`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recive_letter`
--

LOCK TABLES `recive_letter` WRITE;
/*!40000 ALTER TABLE `recive_letter` DISABLE KEYS */;
/*!40000 ALTER TABLE `recive_letter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `regulation_master`
--

DROP TABLE IF EXISTS `regulation_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `regulation_master` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Regulation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regulation_master`
--

LOCK TABLES `regulation_master` WRITE;
/*!40000 ALTER TABLE `regulation_master` DISABLE KEYS */;
INSERT INTO `regulation_master` VALUES (6,'A','2025-12-13 07:27:16','2025-12-13 07:27:16');
/*!40000 ALTER TABLE `regulation_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `religion_matser`
--

DROP TABLE IF EXISTS `religion_matser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `religion_matser` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Religion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `religion_matser`
--

LOCK TABLES `religion_matser` WRITE;
/*!40000 ALTER TABLE `religion_matser` DISABLE KEYS */;
INSERT INTO `religion_matser` VALUES (1,'Hindu','2025-11-17 20:57:12','2025-11-17 20:57:12'),(2,'Christian','2025-11-17 20:57:12','2025-11-17 20:57:12'),(3,'Muslim','2025-11-17 20:57:12','2025-11-17 20:57:12');
/*!40000 ALTER TABLE `religion_matser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `routes`
--

DROP TABLE IF EXISTS `routes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `routes` (
  `id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `route_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `start_point` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `end_point` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `total_distance_km` decimal(10,2) DEFAULT NULL,
  `shift` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `assigned_vehicle_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_route_name` (`route_name`) USING BTREE,
  KEY `idx_assigned_vehicle` (`assigned_vehicle_id`) USING BTREE,
  KEY `idx_status` (`status`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `routes`
--

LOCK TABLES `routes` WRITE;
/*!40000 ALTER TABLE `routes` DISABLE KEYS */;
/*!40000 ALTER TABLE `routes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `semester_master`
--

DROP TABLE IF EXISTS `semester_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `semester_master` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Semester` int DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Year` int DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `semester_master`
--

LOCK TABLES `semester_master` WRITE;
/*!40000 ALTER TABLE `semester_master` DISABLE KEYS */;
INSERT INTO `semester_master` VALUES (1,1,'2025-11-16 12:30:51','2025-11-22 12:19:45',1),(2,2,'2025-11-16 12:30:51','2025-11-22 12:19:46',1),(3,3,'2025-11-16 12:30:51','2025-11-22 12:19:47',2),(4,4,'2025-11-16 12:30:51','2025-11-22 12:19:50',2),(5,5,'2025-11-16 12:30:51','2025-11-22 12:19:51',3),(6,6,'2025-11-16 12:30:51','2025-11-22 12:19:52',3),(7,7,'2025-11-16 12:30:51','2025-11-22 12:19:53',4),(9,8,'2025-11-20 06:54:22','2025-11-22 12:19:55',4);
/*!40000 ALTER TABLE `semester_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `send_letters`
--

DROP TABLE IF EXISTS `send_letters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `send_letters` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `recipient` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `message` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `type_of_post` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cost` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tracking_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Sent',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_recipient` (`recipient`) USING BTREE,
  KEY `idx_date` (`date`) USING BTREE,
  KEY `idx_tracking_number` (`tracking_number`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `send_letters`
--

LOCK TABLES `send_letters` WRITE;
/*!40000 ALTER TABLE `send_letters` DISABLE KEYS */;
/*!40000 ALTER TABLE `send_letters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settlements`
--

DROP TABLE IF EXISTS `settlements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `settlements` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `date` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `expense_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `detail` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `person` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_date` (`date`) USING BTREE,
  KEY `idx_expense_type` (`expense_type`) USING BTREE,
  KEY `idx_person` (`person`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settlements`
--

LOCK TABLES `settlements` WRITE;
/*!40000 ALTER TABLE `settlements` DISABLE KEYS */;
/*!40000 ALTER TABLE `settlements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sidebar_modules`
--

DROP TABLE IF EXISTS `sidebar_modules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sidebar_modules` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `module_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `module_category` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `module_key` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `display_order` int NOT NULL,
  `module_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`) USING BTREE,
  UNIQUE KEY `module_key` (`module_key`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=269 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sidebar_modules`
--

LOCK TABLES `sidebar_modules` WRITE;
/*!40000 ALTER TABLE `sidebar_modules` DISABLE KEYS */;
INSERT INTO `sidebar_modules` VALUES (19,'Dashboard','Common','dashboard',1,'/admin/adminDashboard',1,'2025-12-09 18:14:10','2026-01-05 19:59:12'),(21,'User Creation','Admin','file_user_creation',2,'/admin/user-creation',1,'2025-12-09 18:14:10','2026-01-05 19:59:14'),(22,'Log Details','Admin','file_log_details',3,'/admin/login-details',1,'2025-12-09 18:14:10','2026-01-05 19:59:15'),(23,'Academic Calendar','Master','Academic_AcademicCalendar',4,'/admin/master/academicCalendar',1,'2025-12-09 18:14:10','2026-01-05 19:59:17'),(24,'Department','Master','Academic_Department',5,'/admin/master/branch',1,'2025-12-09 18:14:10','2026-01-05 19:59:19'),(25,'Subject','Master','Academic_Subject',6,'/admin/master/subject',1,'2025-12-09 18:14:10','2026-01-05 19:59:21'),(26,'Class Allocation','Master','Academic_Class_Allocation',7,'/admin/master/classAllocation',1,'2025-12-09 18:14:10','2026-01-05 19:59:22'),(27,'Subject Allocation','Master','Academic_SubjectAllocation',8,'/admin/master/subjectAllocation',1,'2025-12-09 18:14:10','2026-01-05 19:59:23'),(28,'Time Table','Master','Academic_TimeTable',9,'/admin/master/ClassTimeTable',1,'2025-12-09 18:14:10','2026-01-05 19:59:23'),(29,'Staff Details','Master','Academic_StaffDetails',10,'/admin/master/StaffDetails',1,'2025-12-09 18:14:10','2026-01-05 20:00:03'),(30,'Fee Details','Master','Academic_FeeDetails',11,'/admin/master/FeeDetails',1,'2025-12-09 18:14:10','2026-01-05 20:00:05'),(31,'Course Master','Master','Others_CourseMaster',12,'/admin/master/courseMaster',1,'2025-12-09 18:14:10','2026-01-05 20:00:07'),(32,'Regulation Master','Master','Others_RegulationMaster',13,'/admin/master/regulationMaster',1,'2025-12-09 18:14:10','2026-01-05 20:00:08'),(33,'Semester Master','Master','Others_SemesterMaster',14,'/admin/master/semesterMaster',1,'2025-12-09 18:14:10','2026-01-05 20:00:09'),(34,'Fee Master','Master','Others_FeeMaster',15,'/admin/master/feeMaster',1,'2025-12-09 18:14:10','2026-01-05 20:00:10'),(35,'Academic Year Master','Master','Others_AcademicYearMaster',16,'/admin/master/academicYearMaster',1,'2025-12-09 18:14:10','2026-01-05 20:00:12'),(36,'Designation Master','Master','Others_DesignationMaster',17,'/admin/master/designationMaster',1,'2025-12-09 18:14:10','2026-01-05 20:00:13'),(37,'Student Enquiry','Admission','Enquiry_StudentEnquiry',38,'/admin/admission/enquiry/StudentEnquiry',1,'2025-12-09 23:20:29','2026-01-11 13:34:54'),(38,'Enquiry Report','Admission','Enquiry_EnquiryReport',41,'/admin/admission/enquiry/EnquiryReport',1,'2025-12-10 18:17:40','2026-01-26 16:01:54'),(39,'Quota Allocation','Admission','Application_QuotaAllocation',40,'/admin/admission/admission/QuotaAllocation',1,'2025-12-10 18:17:40','2026-01-11 13:34:59'),(40,'Application Issue','Admission','Application_ApplicationIssue',41,'/admin/admission/admission/ApplicationIssue',1,'2025-12-10 18:17:40','2026-01-11 13:35:00'),(41,'Student Register','Admission','Application_StudentRegister',42,'/admin/admission/admission/StudentDetails',1,'2025-12-10 18:17:40','2026-01-11 13:35:01'),(42,'Admitted Student','Admission','Application_AdmittedStudent',43,'/admin/admission/admission/AdmittingStudent',1,'2025-12-10 18:17:40','2026-01-11 13:35:02'),(43,'Photo Path','Admission','Application_PhotoPath',44,'/admin/admission/admission/PhotoPath',1,'2025-12-10 18:17:40','2026-01-11 13:35:03'),(45,'Student Profile','Admission','AdmissionReport_StudentProfile',45,'/admin/admission/AdmissionReports/StudentProfile',1,'2025-12-10 18:17:40','2026-01-11 13:35:04'),(46,'General Forms','Admission','AdmissionReport_GeneralForms',46,'/admin/admission/AdmissionReports/GeneralForms',1,'2025-12-10 18:17:40','2026-01-11 13:35:06'),(47,'Ranking','Admission','AdmissionReport_Ranking',47,'/admin/admission/AdmissionReports/Ranking',1,'2025-12-10 18:17:40','2026-01-11 13:35:07'),(48,'App Issue Coursewise','Admission','AdmissionReport_AppIssueCoursewise',48,'/admin/admission/AdmissionReports/AppIssuseCoursewise',1,'2025-12-10 18:17:40','2026-01-11 13:35:10'),(49,'App Issue Consolidate','Admission','AdmissionReport_AppIssueConsolidate',49,'/admin/admission/AdmissionReports/AppIssueConsolidate',1,'2025-12-10 18:17:40','2026-01-11 13:35:11'),(50,'Admitted List','Admission','AdmissionReport_AdmittedList',50,'/admin/admission/AdmissionReports/AdmittedList',1,'2025-12-10 18:17:40','2026-01-11 13:35:13'),(51,'Student Mark Details','Admission','AdmissionReport_StudentMarkDetails',51,'/admin/admission/AdmissionReports/StudentMarkDetails',1,'2025-12-10 18:17:40','2026-01-11 13:35:15'),(52,'Student Report','Admission','AdmissionReport_StudentReport',52,'/admin/admission/AdmissionReports/StudentReport',1,'2025-12-10 18:17:40','2026-01-11 13:35:18'),(53,'EditTC','Admission','Certificates_EditTc',53,'/admin/admission/certificates/editTc',1,'2025-12-10 18:17:40','2026-01-11 13:35:19'),(54,'TC','Admission','Certificates_Tc',54,'/admin/admission/certificates/tc',1,'2025-12-10 18:17:40','2026-01-11 13:35:21'),(55,'Fees Estimation','Admission','Certificates_FeesEstimation',55,'/admin/admission/certificates/FeesEstimation',1,'2025-12-10 18:17:40','2026-01-11 13:35:23'),(56,'Course Completion','Admission','Certificates_CourseCompletion',56,'/admin/admission/certificates/CourseCompletion',1,'2025-12-10 18:17:40','2026-01-11 13:35:24'),(57,'Conduct','Admission','Certificates_Conduct',57,'/admin/admission/certificates/conduct',1,'2025-12-10 18:17:40','2026-01-11 13:35:25'),(58,'Bonafide','Admission','Certificates_Bonafide',58,'/admin/admission/certificates/bonafide',1,'2025-12-10 18:17:40','2026-01-11 13:35:29'),(59,'Attendance Configuration','Academic','Attendance_AttendanceConfiguration',59,'/admin/academic/attendance/AttendanceConfiguration',1,'2025-12-10 18:17:40','2026-01-11 13:35:39'),(60,'Daily Attendance','Academic','Attendance_DailyAttendance',60,'/admin/academic/attendance/DailyAttendance',1,'2025-12-10 18:17:40','2026-01-11 13:35:40'),(61,'Marked Attendance','Academic','Attendance_MarkedAttendance',61,'/admin/academic/attendance/MarkedAttendance',1,'2025-12-10 18:17:40','2026-01-11 13:35:41'),(62,'Spell Attendance','Academic','Attendance_SpellAttendance',62,'/admin/academic/attendance/SpellAttendance',1,'2025-12-10 18:17:40','2026-01-11 13:35:43'),(63,'Assessment configuration','Academic','Assessment_AssessmentConfiguration',63,'/admin/academic/assessment/AssessmentConfiguration',1,'2025-12-10 18:17:40','2026-01-11 13:35:44'),(64,'Assignment Mark Entry','Academic','Assessment_AssignmentMarkEntry',64,'/admin/academic/assessment/AssignmentMarkEntry',1,'2025-12-10 18:17:40','2026-01-11 13:35:46'),(65,'Edit Assignment Mark','Academic','Assessment_AssignmentMarkReport',65,'/admin/academic/assessment/AssignmentReport',1,'2025-12-10 18:17:40','2026-01-11 13:35:47'),(66,'Unit Test Mark Entry','Academic','Assessment_UnitTestMarkEntry',66,'/admin/academic/assessment/UnitTestMarkEntry',1,'2025-12-10 18:17:40','2026-01-11 13:35:48'),(67,'Edit Unit Test Mark','Academic','Assessment_UnitTestMarkReport',67,'/admin/academic/assessment/UnitTestMarkReport',1,'2025-12-10 18:17:40','2026-01-11 13:35:50'),(68,'Practical Mark Entry','Academic','Assessment_PracticalMarkEntry',68,'/admin/academic/assessment/PracticalMark',1,'2025-12-10 18:17:40','2026-01-11 13:35:51'),(69,'Edit Practical Mark','Academic','Assessment_PracticalMarkReport',69,'/admin/academic/assessment/PracticalReport',1,'2025-12-10 18:17:40','2026-01-11 13:35:53'),(72,'Attendance Report','Academic','Attendance_AttendanceReport',70,'/admin/academic/attendance/AttendanceReport',1,'2025-12-12 18:17:21','2026-01-11 13:35:55'),(75,'Hall Details','Examination','Data Submission_HallDetails',72,'/admin/examination/datasubmission/HallDetails',1,'2025-12-20 11:18:30','2026-01-11 13:37:59'),(76,'Time Table','Examination','Data Submission_TimeTable',73,'/admin/examination/datasubmission/TimeTable',1,'2025-12-20 11:19:55','2026-01-11 13:37:59'),(77,'Nominal Roll','Examination','Data Submission_NominalRoll',74,'/admin/examination/datasubmission/NominalRoll',1,'2025-12-20 11:21:16','2026-01-11 13:37:59'),(78,'QP Requirement','Examination','Data Submission_QPRequirement',75,'/admin/examination/datasubmission/QPRequirement',1,'2025-12-20 11:22:04','2026-01-11 13:37:59'),(80,'Strength List','Examination','Data Submission_StrengthList',76,'/admin/examination/datasubmission/StrengthList',1,'2025-12-20 11:22:56','2026-01-11 13:37:59'),(86,'Exam Generation','Examination','Exam Process_ExamGeneration',77,'/admin/examination/examprocess/ExamGeneration',1,'2025-12-20 11:39:23','2026-01-11 13:37:59'),(88,'Hall Chart','Examination','Exam Process_HallChart',78,'/admin/examination/examprocess/HallChart',1,'2025-12-20 11:40:16','2026-01-11 13:37:59'),(89,'Seat Allocation','Examination','Exam Process_SeatAllocation',79,'/admin/examination/examProcess/SeatAllocation',1,'2025-12-20 11:40:28','2026-01-11 13:37:59'),(90,'Daywar Statement','Examination','Exam Process_DaywarStatement',80,'/admin/examination/examProcess/DaywarStatement',1,'2025-12-20 11:40:44','2026-01-11 13:37:59'),(91,'Digital Numbering','Examination','Exam Process_DigitalNumbering',81,'/admin/examination/examProcess/DigitalNumbering',1,'2025-12-20 11:41:05','2026-01-11 13:38:00'),(92,'Thoery NameList','Examination','Exam Process_TheoryNameList',82,'/admin/examination/examProcess/TheoryNameList',1,'2025-12-20 11:41:24','2026-01-11 13:38:01'),(94,'Edit ExamProcess','Examination','Exam Process_EditExamProcess',83,'/admin/examination/examProcess/EditExamProcess',1,'2025-12-20 11:41:57','2026-01-11 13:38:02'),(96,'Practical Panel','Examination','Practical/Model_PracticalPanel',84,'/admin/examination/practicalModel/PracticalPanel',1,'2025-12-20 11:44:44','2026-01-11 13:38:04'),(97,'Practical Time Table','Examination','Practical/Model_PracticalTimeTable',85,'/admin/examination/practicalModel/PracticalTimeTable',1,'2025-12-20 11:45:32','2026-01-11 13:38:05'),(98,'Practical NameList','Examination','Practical/Model_PracticalNameList',86,'/admin/examination/practicalModel/PracticalNameList',1,'2025-12-20 11:45:40','2026-01-11 13:38:08'),(105,'Absentees Entry','Examination','Exam Forms_AbsenteesEntry',87,'/admin/examination/examforms/AbsenteesEntry',1,'2025-12-20 11:51:28','2026-01-11 13:38:10'),(106,'Ex2 Present','Examination','Exam Forms_Ex2Present',88,'/admin/examination/examforms/Ex2Present',1,'2025-12-20 11:51:41','2026-01-11 13:38:11'),(107,'Ex2 Absent','Examination','Exam Forms_Ex2Absent',89,'/admin/examination/examforms/Ex2Absent',1,'2025-12-20 11:51:55','2026-01-11 13:38:12'),(129,'Add Book','Library','Management_Add book',90,'/admin/library/management/Addbook',1,'2026-01-03 17:46:11','2026-01-11 13:38:13'),(130,'Available Book','Library','Management_Available Books',91,'/admin/library/management/available-books',1,'2026-01-03 17:48:10','2026-01-11 13:38:15'),(134,'Add Borrrower','Library','Borrower_Add Borrower',92,'/admin/library/borrower/AddBorrower',1,'2026-01-03 17:52:48','2026-01-11 13:38:17'),(136,'Current Borrower','Library','Borrower_Current Borrower',93,'/admin/library/borrower/CurrentBorrower',1,'2026-01-03 18:12:01','2026-01-11 13:38:19'),(138,'Book Issue','Library','Circulation_Book Issue',94,'/admin/library/circulation/BookIssue',1,'2026-01-03 18:14:08','2026-01-11 13:38:21'),(139,'Book Issue Report','Library','Circulation_Book Issue Report',95,'/admin/library/circulation/BookIssueReport',1,'2026-01-03 18:15:09','2026-01-11 13:38:22'),(140,'Due Date Exit','Library','Circulation_Due Date Exit',96,'/admin/library/circulation/DueDateExitReport',1,'2026-01-03 18:16:09','2026-01-11 13:38:24'),(141,'No Due Certificate','Library','Circulation_No Due Certificate',97,'/admin/library/circulation/NoDueCertificate',1,'2026-01-03 18:18:07','2026-01-11 13:38:26'),(142,'Fine Report','Library','Reports_Fine Report',98,'/admin/library/fine/FineReport',1,'2026-01-03 18:18:53','2026-01-11 13:38:27'),(143,'Book History','Library','Reports_Book History',99,'/admin/library/reports/Bookhistory',1,'2026-01-03 18:19:46','2026-01-11 13:38:28'),(145,'UNIV External Mark','Academic','Assessment_UNIV External Mark',71,'/admin/academic/assessment/UNIVMarkEntry',1,'2026-01-09 18:30:06','2026-01-11 13:37:29'),(146,'Stock Entry & Report','Administrator','General Data_Stock Entry & Report',18,'/admin/administrator/office/stockmodule/StockEntry',1,'2026-01-10 13:06:21','2026-01-10 14:03:12'),(147,'Purchase Entry & Report','Administrator','General Data_Purchase Entry & Report',19,'/admin/administrator/office/stockmodule/PurchaseEntry',1,'2026-01-10 13:09:01','2026-01-10 14:03:13'),(148,'Asset Entry & Report','Administrator','General Data_Asset Entry & Report',20,'/admin/administrator/office/stockmodule/AssetEntry',1,'2026-01-10 13:10:34','2026-01-10 14:03:15'),(149,'Send Letter','Administrator','Letter Data_Send Letter',21,'/admin/administrator/office/lettermodule/SendLetter',1,'2026-01-10 13:14:35','2026-01-10 13:28:10'),(150,'Receive Letter','Administrator','Letter Data_Receive Letter',22,'/admin/administrator/office/lettermodule/ReceiveLetter',1,'2026-01-10 13:15:42','2026-01-10 14:15:12'),(151,'Student Fees','Administrator','Office_Student Fees',23,'/admin/administrator/office/feemodule/StudentFeesForm',1,'2026-01-10 13:30:04','2026-01-10 13:30:04'),(152,'Fees Receipt','Administrator','Office_Fees Receipt',24,'/admin/administrator/office/feemodule/FeeRecipt',1,'2026-01-10 13:31:09','2026-01-10 13:31:09'),(153,'Income & Expense','Administrator','Office_Income & Expense',25,'/admin/administrator/office/accountmodule/IncomeExpenseEntry',1,'2026-01-10 13:32:05','2026-01-10 13:32:05'),(154,'Settlement','Administrator','Office_Settlement',26,'/admin/administrator/office/accountmodule/Settlement',1,'2026-01-10 13:32:35','2026-01-10 13:32:42'),(155,'Income & Expenditure','Administrator','Office Report_Income & Expenditure',27,'/admin/administrator/office/accountmodule/IncomeExpenseReport',1,'2026-01-10 13:34:18','2026-01-10 13:34:18'),(156,'Fees Collection Report','Administrator','Office Report_Fees Collection Report',28,'/admin/administrator/office/feemodule/FeeType',1,'2026-01-10 13:35:25','2026-01-10 13:36:09'),(157,'Consolidate Report','Administrator','Office Report_Consolidate Report',29,'/admin/administrator/office/feemodule/ConsolidatedReportForm',1,'2026-01-10 13:38:45','2026-01-10 13:39:03'),(158,'Budget Report','Administrator','Office Report_Budget Report',30,'/admin/administrator/office/Budget/BudgetExpenseForm',1,'2026-01-10 13:40:30','2026-01-10 13:40:43'),(159,'Transport Master','Administrator','Transport_Transport Master',31,'/admin/administrator/transport/vehicle/TransportMaster',1,'2026-01-10 13:46:56','2026-01-10 13:46:56'),(160,'Transport Report','Administrator','Transport Report_Transport Report',32,'/admin/administrator/transport/vehicle/TransportReports',1,'2026-01-10 13:47:35','2026-01-10 13:52:07'),(161,'Student Bus Fees','Administrator','Transport_Student Bus Fees',33,'/admin/administrator/transport/fess&expense/StudentBusFee',1,'2026-01-10 13:49:22','2026-01-10 13:49:22'),(162,'Bus Fees Report','Administrator','Transport Report_Bus Fees Report',34,'/admin/administrator/transport/fess&expense/StudentBusFeeReports',1,'2026-01-10 13:50:10','2026-01-10 13:52:12'),(163,'Bus Maintance & Salary','Administrator','Transport_Bus Maintance & Salary',35,'/admin/administrator/transport/fess&expense/BusMaintenanceSalary',1,'2026-01-10 13:51:16','2026-01-10 13:51:16'),(164,'Bus Maintance & Salary Report','Administrator','Transport Report_Bus Maintance & Salary Report',36,'/admin/administrator/transport/fess&expense/BusMaintenanceSalaryReports',1,'2026-01-10 13:53:20','2026-01-10 13:53:20'),(165,'Enquiry Dashboard','Admission','Enquiry_Enquiry Dashboard',37,'/admin/admission/enquiry/EnquiryDashboard',1,'2026-01-10 21:51:07','2026-01-10 21:52:11'),(167,'Assign Call','Admission','Enquiry_Assign Call',38,'/admin/admission/enquiry/AssignCall',1,'2026-01-21 19:26:22','2026-01-21 19:26:31'),(168,'Caller Details','Admission','Enquiry_Caller Details',39,'/admin/admission/enquiry/CallerDetails',1,'2026-01-22 18:39:47','2026-01-22 18:39:57'),(169,'Lead Management','Admission','Enquiry_Lead Management',40,'/admin/admission/enquiry/LeadManagement',1,'2026-01-23 12:51:15','2026-01-23 12:51:24'),(170,'Arrear Entry','Academic','Assessment_Arrear Entry',72,'/admin/academic/assessment/ArrearEntry',1,'2026-01-29 17:25:17','2026-01-29 17:32:19'),(171,'Student Login','Admin','File_Student login',4,'/admin/studentLogin',1,'2026-01-29 19:09:21','2026-01-29 19:09:58'),(173,'Placement','Academic','Placement_Placement',73,'/admin/academic/placement/Placement',1,'2026-02-03 10:16:38','2026-02-03 10:53:07'),(174,'Placement Report','Academic','Placement_Placement Report',75,'/admin/academic/placement/PlacementReport',1,'2026-02-03 10:54:02','2026-02-03 15:49:45'),(175,'Consolidate Report','Academic','Consolidate Report',74,'/admin/academic/ConsolidatedReport',1,'2026-02-03 15:49:14','2026-02-03 15:52:23'),(241,'HR Dashboard','Human Resource','hrdashboard',101,'/hr/dashboard',1,'2026-02-03 19:55:38','2026-02-03 19:55:38'),(242,'Employee Management','Human Resource','hremployee',102,NULL,1,'2026-02-03 19:55:38','2026-02-03 19:55:38'),(243,'Staff Directory','Human Resource','hremployee_staffdirectory',103,'/hr/staff-directory',1,'2026-02-03 19:55:38','2026-02-03 19:55:38'),(244,'Add Employee','Human Resource','hremployee_addemployee',104,'/hr/add-employee',1,'2026-02-03 19:55:38','2026-02-03 19:55:38'),(245,'Employee Profile','Human Resource','hremployee_employeeprofile',105,'/hr/employee-profile',1,'2026-02-03 19:55:38','2026-02-03 19:55:38'),(246,'Attendance & Time','Human Resource','hrattendance',106,NULL,1,'2026-02-03 19:55:38','2026-02-03 19:55:38'),(247,'Staff Attendance','Human Resource','hrattendance_staffattendance',107,'/hr/staff-attendance',1,'2026-02-03 19:55:38','2026-02-03 19:55:38'),(248,'Attendance Report','Human Resource','hrattendance_attendancereport',108,'/hr/attendance-report',1,'2026-02-03 19:55:38','2026-02-03 19:55:38'),(249,'Time Office','Human Resource','hrattendance_timeoffice',109,'/hr/time-office',1,'2026-02-03 19:55:38','2026-02-03 19:55:38'),(250,'Leave Management','Human Resource','hrleave',110,NULL,1,'2026-02-03 19:55:38','2026-02-03 19:55:38'),(251,'Leave Configuration','Human Resource','hrleave_leaveconfiguration',111,'/hr/leave-configuration',1,'2026-02-03 19:55:38','2026-02-03 19:55:38'),(252,'Leave Application','Human Resource','hrleave_leaveapplication',112,'/hr/leave-application',1,'2026-02-03 19:55:38','2026-02-03 19:55:38'),(253,'Leave Approval','Human Resource','hrleave_leaveapproval',113,'/hr/leave-approval',1,'2026-02-03 19:55:38','2026-02-03 19:55:38'),(254,'Leave Register','Human Resource','hrleave_leaveregister',114,'/hr/leave-register',1,'2026-02-03 19:55:38','2026-02-03 19:55:38'),(255,'Payroll','Human Resource','hrpayroll',115,NULL,1,'2026-02-03 19:55:38','2026-02-03 19:55:38'),(256,'Salary Structure','Human Resource','hrpayroll_salarystructure',116,'/hr/salary-structure',1,'2026-02-03 19:55:38','2026-02-03 19:55:38'),(257,'Monthly Processing','Human Resource','hrpayroll_monthlyprocessing',117,'/hr/monthly-processing',1,'2026-02-03 19:55:38','2026-02-03 19:55:38'),(258,'Pay Slip Generation','Human Resource','hrpayroll_payslipgeneration',118,'/hr/payslip-generation',1,'2026-02-03 19:55:38','2026-02-03 19:55:38'),(259,'Payroll Reports','Human Resource','hrpayroll_payrollreports',119,'/hr/payroll-reports',1,'2026-02-03 19:55:38','2026-02-03 19:55:38'),(260,'HR Reports','Human Resource','hrreports',120,NULL,1,'2026-02-03 19:55:38','2026-02-03 19:55:38'),(261,'Employee Reports','Human Resource','hrreports_employeereports',121,'/hr/employee-reports',1,'2026-02-03 19:55:38','2026-02-03 19:55:38'),(262,'Attendance Reports','Human Resource','hrreports_attendancereports',122,'/hr/attendance-reports',1,'2026-02-03 19:55:38','2026-02-03 19:55:38'),(263,'Payroll Summary','Human Resource','hrreports_payrollsummary',123,'/hr/payroll-summary',1,'2026-02-03 19:55:38','2026-02-03 19:55:38'),(264,'Leave Analysis','Human Resource','hrreports_leaveanalysis',124,'/hr/leave-analysis',1,'2026-02-03 19:55:38','2026-02-03 19:55:38'),(265,'Memo','Admin','memo',15,'#',1,'2026-02-03 20:52:56','2026-02-03 20:52:56'),(266,'Staff Memo','Admin','memo_staffmemo',16,'/admin/academic/memo/StaffMemo',1,'2026-02-03 20:52:56','2026-02-03 20:52:56'),(267,'Student Memo','Admin','memo_studentmemo',17,'/admin/academic/memo/StudentMemo',1,'2026-02-03 20:52:56','2026-02-03 20:52:56'),(268,'Study Material','Academic','academic_studymaterial',50,'/admin/academic/study-material',1,'2026-02-03 20:53:18','2026-02-04 03:18:47');
/*!40000 ALTER TABLE `sidebar_modules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `source_master`
--

DROP TABLE IF EXISTS `source_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `source_master` (
  `id` int NOT NULL AUTO_INCREMENT,
  `source` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `source_master`
--

LOCK TABLES `source_master` WRITE;
/*!40000 ALTER TABLE `source_master` DISABLE KEYS */;
INSERT INTO `source_master` VALUES (1,'Instagram','2026-01-21 18:05:19','2026-01-21 18:05:19'),(2,'Facebook','2026-01-21 18:05:19','2026-01-21 18:05:19'),(3,'Twitter','2026-01-21 18:05:19','2026-01-21 18:05:19'),(4,'News','2026-01-21 18:05:19','2026-01-21 18:05:19'),(5,'Article','2026-01-21 18:05:19','2026-01-21 18:05:19'),(6,'TV Advertisement','2026-01-21 18:05:19','2026-01-21 18:05:19'),(7,'Referral Staff','2026-01-21 18:05:19','2026-01-21 18:05:19'),(8,'Referral Student','2026-01-21 18:05:19','2026-01-21 18:05:19'),(9,'Agents','2026-01-21 18:05:19','2026-01-21 18:05:19');
/*!40000 ALTER TABLE `source_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff_educational_details`
--

DROP TABLE IF EXISTS `staff_educational_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff_educational_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Staff_ID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `EmpNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Course` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Branch` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `College` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Class` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Percentage` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `FinalYear` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff_educational_details`
--

LOCK TABLES `staff_educational_details` WRITE;
/*!40000 ALTER TABLE `staff_educational_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `staff_educational_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff_master`
--

DROP TABLE IF EXISTS `staff_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff_master` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Staff_ID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Staff_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Designation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Qualification` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Experience` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Category` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Course_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Dept_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Dept_Code` int DEFAULT NULL,
  `DOB` date DEFAULT NULL,
  `Mobile` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Gender` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Basic_Pay` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `PF_Number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Joining_Date` date DEFAULT NULL,
  `Reliving_Date` date DEFAULT NULL,
  `Account_Number` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Bank_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `PAN_Number` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Aadhar_Number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Religion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Community` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Caste` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Temporary_Address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Permanent_Address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Photo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `User_ID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `User_Role` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Created_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `Updated_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Address` text COLLATE utf8mb4_general_ci,
  `City` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `State` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Pincode` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Blood_Group` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Aadhar_No` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Emergency_Contact` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Emergency_Contact_Name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Emergency_Contact_Relation` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `IFSC_Code` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff_master`
--

LOCK TABLES `staff_master` WRITE;
/*!40000 ALTER TABLE `staff_master` DISABLE KEYS */;
INSERT INTO `staff_master` VALUES (49,'GRTIPER1005','UDHAYAKUMAR E',NULL,'M.PHARM.,',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,NULL,'8148640704',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Udhaya@1985','Admin','2026-02-02 19:09:55','2026-02-02 19:12:38',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(50,'GRTIPER1007','SUNDARASEELAN J',NULL,'M.PHARM.,Ph.D',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,NULL,'9952075450',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'seelan74*','Admin','2026-02-02 19:09:55','2026-02-02 19:12:38',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(51,'GRTIPER1013','SOMANATHAN S S',NULL,'M.PHARM.,Ph.D.,MBA',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,NULL,'9052419507',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Somanathan@1013','Admin','2026-02-02 19:09:55','2026-02-02 19:12:38',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(52,'GRTIPER1014','MEENAKSHI K',NULL,'M.PHARM.,Ph.D',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,NULL,'9849614121',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Meena@1972','Admin','2026-02-02 19:09:55','2026-02-02 19:12:38',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(53,'GRTIPER1017','SURESH KUMAR C A',NULL,'M.PHARM.,Ph.D',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,NULL,'9943060495',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Suresh@1985','Admin','2026-02-02 19:09:55','2026-02-02 19:12:38',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(54,'GRTIPER1020','DHANALAKSHMI S',NULL,'M.PHARM.,Ph.D',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,NULL,'6381643550',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Dhanalakshmi@10','Admin','2026-02-02 19:09:55','2026-02-02 19:12:39',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(55,'GRTIPER1021','ANAND BABU S',NULL,'M.PHARM',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,NULL,'8939152555',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Anandbabu@1021','Admin','2026-02-02 19:09:55','2026-02-02 19:12:39',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(56,'GRTIPER1027','KUMARAVEL M',NULL,'M.PHARM',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,NULL,'8122770779',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Shanthanu@2022','Admin','2026-02-02 19:09:55','2026-02-02 19:12:39',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(57,'GRTIPER1028','UMAR FARUKSHA A',NULL,'M.PHARM.,Ph.D',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,NULL,'9894682819',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Umar@26','Admin','2026-02-02 19:09:55','2026-02-02 19:12:39',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(58,'GRTIPER1032','ANITHA BALAKRISHNAN',NULL,'M.PHARM',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,NULL,'9600950932',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'8220622493','Admin','2026-02-02 19:09:55','2026-02-02 19:12:39',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(59,'GRTIPER1034','PREMAVATHI K',NULL,'M.PHARM.,Ph.D',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,NULL,'9841958230',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Prema@123','Admin','2026-02-02 19:09:55','2026-02-02 19:12:39',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(60,'GRTIPER1037','GOWRI R',NULL,'M.PHARM.,Ph.D',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,NULL,'6381643550',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Gowri@1037','Admin','2026-02-02 19:09:55','2026-02-02 19:12:39',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(61,'GRTIPER1043','REGINA S',NULL,'M.PHARM',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,NULL,'9841128272',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'1983','Admin','2026-02-02 19:09:55','2026-02-02 19:12:39',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(62,'GRTIPER1044','RAVI M',NULL,'M.PHARM.,Ph.D',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,NULL,'6281033625',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Abinaya@99','Admin','2026-02-02 19:09:55','2026-02-02 19:12:39',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(63,'GRTIPER1045','SEKAR A M',NULL,'M.PHARM',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,NULL,'9360407812',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Sekar@1045','Admin','2026-02-02 19:09:55','2026-02-02 19:12:39',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(64,'GRTIPER1054','DEEPAK VENKATARAMAN N',NULL,'M.PHARM',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,NULL,'9865752167',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Rajni@1988','Admin','2026-02-02 19:09:55','2026-02-02 19:12:39',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(65,'GRTIPER1055','PRIYANKA N',NULL,'PHARM.D',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,NULL,'9962715373',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'npriyanka2102','Admin','2026-02-02 19:09:55','2026-02-02 19:12:39',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(66,'GRTIPER1058','Anand Babu K',NULL,'M.PHARM,Ph.D',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,NULL,'8531010505',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Anandbabu@1058','Admin','2026-02-02 19:09:55','2026-02-02 19:12:39',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(67,'GRTIPER1062','SUDALAIMANI M',NULL,'M.PHARM',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,NULL,'6380461092',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'1062','Admin','2026-02-02 19:09:55','2026-02-02 19:12:39',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(68,'GRTIPER1063','VELAMAHALAKSHMI N',NULL,'M.Pharm',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,NULL,'8825429109',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Vela@1063','Admin','2026-02-02 19:09:55','2026-02-02 19:12:39',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(69,'GRTIPER1067','RAMESH C N',NULL,'M.PHARM',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,NULL,'6303679761',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Ramesh@1067','Admin','2026-02-02 19:09:55','2026-02-02 19:12:39',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(70,'GRTIPER1068','SIREESHA R',NULL,'M.PHARM., Ph.D',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,NULL,'6303981837',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Siree@1989','Admin','2026-02-02 19:09:55','2026-02-02 19:12:39',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(71,'GRTIPER1069','SHENBAGAM K',NULL,'M.A., M.Ed',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,NULL,'9003754664',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'3115','Admin','2026-02-02 19:09:55','2026-02-02 19:12:39',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(72,'GRTIPER1072','KALAIVANI D',NULL,'M PHARM',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,NULL,'7708667044',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'1072','Admin','2026-02-02 19:09:55','2026-02-02 19:12:39',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(73,'GRTIPER1073','MAGESWARAN J',NULL,'B.PHARM',NULL,NULL,'Pharmacy','D.PHARM (DIPLOMA IN PHARMACY)',4000,NULL,'9047766844',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Mages@2001','Admin','2026-02-02 19:09:55','2026-02-02 19:12:39',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(74,'GRTIPER1075','NARENDRAN R',NULL,'B.SC',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,NULL,'6383920143',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'6364','Admin','2026-02-02 19:09:55','2026-02-02 19:12:39',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(75,'GRTIPER1076','ATCHAYA M',NULL,'M.PHARM',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,NULL,'9791978815',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Atchaya@1076','Admin','2026-02-02 19:09:55','2026-02-02 19:12:39',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(76,'GRTIPER1077','GAYATHRI T',NULL,'M.PHARM',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,NULL,'8760648537',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'010999','Admin','2026-02-02 19:09:55','2026-02-02 19:12:39',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(77,'GRTIPER1079','LIKITH KUMAR V',NULL,'M.PHARM',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,NULL,'9786121249',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Likith@2001','Admin','2026-02-02 19:09:55','2026-02-02 19:12:39',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(78,'GRTIPER1080','THULASI N',NULL,'B.PHARM',NULL,NULL,'Pharmacy','D.PHARM (DIPLOMA IN PHARMACY)',4000,NULL,'8438169341',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'deva1123','Admin','2026-02-02 19:09:55','2026-02-02 19:12:39',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(79,'GRTIPER1081','NANDHITHA G',NULL,'B.PHARM',NULL,NULL,'Pharmacy','D.PHARM (DIPLOMA IN PHARMACY)',4000,NULL,'7010798422',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Nand','Admin','2026-02-02 19:09:55','2026-02-02 19:12:39',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(80,'GRTIPER1082','ARULKUMAR R',NULL,'B.PHARM',NULL,NULL,'Pharmacy','D.PHARM (DIPLOMA IN PHARMACY)',4000,NULL,'9344694269',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Arul@700','Admin','2026-02-02 19:09:55','2026-02-02 19:12:39',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(81,'GRTIPER1084','ANUPRIYA A',NULL,'B.PHARM',NULL,NULL,'Pharmacy','D.PHARM (DIPLOMA IN PHARMACY)',4000,NULL,'6382319284',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'anu@2001','Admin','2026-02-02 19:09:55','2026-02-02 19:12:39',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(82,'GRTIPER1085','DHARSHINI R',NULL,'B.PHARM',NULL,NULL,'Pharmacy','D.PHARM (DIPLOMA IN PHARMACY)',4000,NULL,'8489977061',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'dharshu@123','Admin','2026-02-02 19:09:55','2026-02-02 19:12:39',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(83,'GRTIPER1086','MYTHILI I',NULL,'B.PHARM',NULL,NULL,'Pharmacy','D.PHARM (DIPLOMA IN PHARMACY)',4000,NULL,'6381544967',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'MYTHILI@2003','Admin','2026-02-02 19:09:55','2026-02-02 19:12:39',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(84,'GRTIPER1088','YUVARAJ K G',NULL,'M.PHARM',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,NULL,'8270263516',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'yuvaraj2006','Admin','2026-02-02 19:09:55','2026-02-02 19:12:39',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(85,'GRTIPER1090','NAVEENKUMAR N',NULL,'M.PHARM',NULL,NULL,'Pharmacy','D.PHARM (DIPLOMA IN PHARMACY)',4000,NULL,'9080441075',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Nk08062000','Admin','2026-02-02 19:09:55','2026-02-02 19:12:39',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(86,'GRTIPER1091','GAYATHRI S',NULL,'M.PHARM',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,NULL,'6379591338',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'G23@','Admin','2026-02-02 19:09:55','2026-02-02 19:12:39',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `staff_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff_memos`
--

DROP TABLE IF EXISTS `staff_memos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff_memos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci,
  `priority` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` date DEFAULT NULL,
  `departments` json DEFAULT NULL,
  `staff` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff_memos`
--

LOCK TABLES `staff_memos` WRITE;
/*!40000 ALTER TABLE `staff_memos` DISABLE KEYS */;
/*!40000 ALTER TABLE `staff_memos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `staff_subject`
--

DROP TABLE IF EXISTS `staff_subject`;
/*!50001 DROP VIEW IF EXISTS `staff_subject`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `staff_subject` AS SELECT 
 1 AS `Staff_Id`,
 1 AS `Staff_Name`,
 1 AS `Academic_Year`,
 1 AS `Course_Name`,
 1 AS `Dept_Code`,
 1 AS `Dept_Name`,
 1 AS `Semester`,
 1 AS `Regulation`,
 1 AS `Subject_Code`,
 1 AS `Subject_Name`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `stages`
--

DROP TABLE IF EXISTS `stages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stages` (
  `id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `route_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `stage_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `sequence_no` int DEFAULT '1',
  `distance_from_start_km` decimal(10,2) DEFAULT '0.00',
  `stage_fee` decimal(12,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_route_id` (`route_id`) USING BTREE,
  KEY `idx_sequence` (`route_id`,`sequence_no`) USING BTREE,
  CONSTRAINT `stages_ibfk_1` FOREIGN KEY (`route_id`) REFERENCES `routes` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stages`
--

LOCK TABLES `stages` WRITE;
/*!40000 ALTER TABLE `stages` DISABLE KEYS */;
/*!40000 ALTER TABLE `stages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_entries`
--

DROP TABLE IF EXISTS `stock_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_entries` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `stock_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `date` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `product_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `brand_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `rate` decimal(12,2) DEFAULT '0.00',
  `qty` decimal(12,2) DEFAULT '0.00',
  `scale` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `total_value` decimal(14,2) DEFAULT '0.00',
  `scan_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `scan_image_blob` longblob,
  `scan_image_mime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `scan_image_filename` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_by` int unsigned DEFAULT NULL,
  `updated_by` int unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_stock_id` (`stock_id`) USING BTREE,
  KEY `idx_code` (`code`) USING BTREE,
  KEY `idx_product_name` (`product_name`) USING BTREE,
  KEY `idx_brand_name` (`brand_name`) USING BTREE,
  KEY `idx_created_by` (`created_by`) USING BTREE,
  KEY `idx_updated_by` (`updated_by`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_entries`
--

LOCK TABLES `stock_entries` WRITE;
/*!40000 ALTER TABLE `stock_entries` DISABLE KEYS */;
/*!40000 ALTER TABLE `stock_entries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stocks`
--

DROP TABLE IF EXISTS `stocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stocks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `stock_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `date` date DEFAULT NULL,
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `product_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `brand_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `rate` decimal(12,2) DEFAULT NULL,
  `qty` decimal(12,2) DEFAULT NULL,
  `scale` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `total_value` decimal(14,2) DEFAULT NULL,
  `status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Active',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_stock_id` (`stock_id`) USING BTREE,
  KEY `idx_product_name` (`product_name`) USING BTREE,
  KEY `idx_brand_name` (`brand_name`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stocks`
--

LOCK TABLES `stocks` WRITE;
/*!40000 ALTER TABLE `stocks` DISABLE KEYS */;
/*!40000 ALTER TABLE `stocks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student` (
  `id` int NOT NULL AUTO_INCREMENT,
  `SNO` int DEFAULT NULL,
  `AppNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `RollNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `RegNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `StudName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Initials` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `DOB` date DEFAULT NULL,
  `Yno` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sem` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `syear` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CNO` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Course` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CourseType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Branch` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CouOrder` int DEFAULT NULL,
  `REGL1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `REGL2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `REGL3` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `REGL4` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `REGL5` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `REGL6` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `REGL7` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `REGL8` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SEM1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SEM2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SEM3` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SEM4` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SEM5` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SEM6` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SEM7` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SEM8` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Fine` int DEFAULT NULL,
  `Fee` decimal(10,2) DEFAULT NULL,
  `Remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `AddlNom` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Photo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Others` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sex` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Community` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `DateofAdm` date DEFAULT NULL,
  `Qulification` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Religion` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Nationality` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `YearofPass` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SubmissionDate` date DEFAULT NULL,
  `Age` int DEFAULT NULL,
  `FatherName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `MotherName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `MotherTongue` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `University` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `groupType` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `AdmittedUnder` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `TotalFee` decimal(10,2) DEFAULT NULL,
  `Address1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Address2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `State` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `District` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Pincode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Caste` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CommunityCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Mobile` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `State2` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `District2` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Pincode2` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Mobile2` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `isHosteller` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ModeOfJoining` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `NoOfAttempts` int DEFAULT NULL,
  `MsheetNo1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `MsheetNo2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `MsheetNo3` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `MsheetNo4` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `MsheetNo5` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ExamRegNo1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ExamRegNo2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ExamRegNo3` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ExamRegNo4` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ExamRegNo5` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Medium` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `EduState` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `YearOfPassing` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_attendance_entry`
--

DROP TABLE IF EXISTS `student_attendance_entry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_attendance_entry` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Att_Date` date DEFAULT NULL,
  `Day_Order` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Staff_ID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Staff_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Dept_Code` int DEFAULT NULL,
  `Dept_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Semester` int DEFAULT NULL,
  `Regulation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Class` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Subject_Code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Period` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Register_Number` varchar(3000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Att_Status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Entry_Time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `Updated_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=315587 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_attendance_entry`
--

LOCK TABLES `student_attendance_entry` WRITE;
/*!40000 ALTER TABLE `student_attendance_entry` DISABLE KEYS */;
INSERT INTO `student_attendance_entry` VALUES (315460,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','25BPLE01','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315461,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','25BPLE02','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315462,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','25BPLE03','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315463,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','25BPLE04','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315464,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','25BPLE05','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315465,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','25BPLE06','medicalLeave','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315466,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','25BPLE07','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315467,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','25BPLE08','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315468,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','25BPLE09','medicalLeave','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315469,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','25BPLE10','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315470,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','25BPLE11','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315471,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','25BPLE12','medicalLeave','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315472,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','25BPLE13','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315473,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560020529094','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315474,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529001','onDuty','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315475,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529002','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315476,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529003','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315477,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529004','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315478,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529006','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315479,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529007','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315480,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529008','medicalLeave','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315481,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529009','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315482,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529010','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315483,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529011','medicalLeave','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315484,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529012','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315485,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529013','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315486,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529014','onDuty','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315487,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529015','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315488,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529016','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315489,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529017','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315490,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529018','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315491,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529019','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315492,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529020','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315493,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529021','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315494,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529022','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315495,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529023','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315496,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529024','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315497,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529025','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315498,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529026','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315499,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529027','absent','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315500,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529028','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315501,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529029','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315502,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529030','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315503,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529031','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315504,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529032','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315505,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529033','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315506,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529034','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315507,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529035','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315508,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529036','medicalLeave','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315509,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529037','onDuty','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315510,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529038','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315511,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529039','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315512,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529040','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315513,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529041','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315514,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529042','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315515,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529043','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315516,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529044','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315517,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529045','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315518,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529046','medicalLeave','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315519,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529047','absent','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315520,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529048','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315521,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529049','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315522,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529050','medicalLeave','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315523,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529051','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315524,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529052','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315525,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529053','medicalLeave','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315526,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529055','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315527,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529056','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315528,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529057','medicalLeave','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315529,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529058','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315530,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529059','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315531,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529060','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315532,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529061','medicalLeave','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315533,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529062','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315534,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529063','medicalLeave','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315535,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529064','medicalLeave','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315536,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529065','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315537,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529066','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315538,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529067','onDuty','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315539,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529068','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315540,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529069','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315541,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529070','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315542,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529071','medicalLeave','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315543,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529072','onDuty','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315544,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529073','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315545,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529074','onDuty','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315546,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529075','onDuty','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315547,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529076','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315548,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529077','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315549,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529078','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315550,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529079','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315551,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529080','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315552,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529081','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315553,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529082','absent','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315554,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529084','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315555,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529085','present','2026-02-05 13:29:36','2026-02-05 13:29:36'),(315556,'2026-02-05','Day 1','1001','Admin',5010,'B.PHARM (BACHELOR OF PHARMACY)',1,'R2021','Class A','SUB001','1','560024529086','present','2026-02-05 13:29:36','2026-02-05 13:29:36');
/*!40000 ALTER TABLE `student_attendance_entry` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `student_attendance_view`
--

DROP TABLE IF EXISTS `student_attendance_view`;
/*!50001 DROP VIEW IF EXISTS `student_attendance_view`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `student_attendance_view` AS SELECT 
 1 AS `date`,
 1 AS `dayorder`,
 1 AS `dept_code`,
 1 AS `dept_name`,
 1 AS `semester`,
 1 AS `regulation`,
 1 AS `class`,
 1 AS `register_number`,
 1 AS `name`,
 1 AS `1`,
 1 AS `2`,
 1 AS `3`,
 1 AS `4`,
 1 AS `5`,
 1 AS `6`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `student_education_details`
--

DROP TABLE IF EXISTS `student_education_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_education_details` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Application_No` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_School_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Board` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Year_Of_Passing` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Register_No` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Marksheet_No` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Subject1` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Subject2` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Subject3` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Subject4` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Subject5` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Subject1_Max_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Subject1_Obtained_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Subject2_Max_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Subject2_Obtained_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Subject3_Max_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Subject3_Obtained_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Subject4_Max_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Subject4_Obtained_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Subject5_Max_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Subject5_Obtained_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Total_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Total_Obtained_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Percentage` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Att1_Marksheet_No` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Att1_Register_No` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Att1_Month` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Att1_Year` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Att1_Total_Marks` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Att2_Marksheet_No` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Att2_Register_No` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Att2_Month` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Att2_Year` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Att2_Total_Marks` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Att3_Marksheet_No` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Att3_Register_No` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Att3_Month` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Att3_Year` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Att3_Total_Marks` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Att4_Marksheet_No` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Att4_Register_No` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Att4_Month` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Att4_Year` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Att4_Total_Marks` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Att5_Marksheet_No` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Att5_Register_No` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Att5_Month` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Att5_Year` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SSLC_Att5_Total_Marks` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Institution_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Year_Of_Passing` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Subject1` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Subject2` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Subject3` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Subject4` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Subject5` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Subject1_Max_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Subject1_Obtained_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Subject2_Max_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Subject2_Obtained_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Subject3_Max_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Subject3_Obtained_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Subject4_Max_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Subject4_Obtained_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Subject5_Max_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Subject5_Obtained_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Total_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Total_Obtained_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Percentage` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Att1_Marksheet_No` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Att1_Register_No` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Att1_Month` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Att1_Year` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Att1_Total_Marks` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Att2_Marksheet_No` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Att2_Register_No` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Att2_Month` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Att2_Year` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Att2_Total_Marks` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Att3_Marksheet_No` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Att3_Register_No` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Att3_Month` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Att3_Year` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Att3_Total_Marks` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Att4_Marksheet_No` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Att4_Register_No` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Att4_Month` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Att4_Year` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Att4_Total_Marks` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Att5_Marksheet_No` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Att5_Register_No` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Att5_Month` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Att5_Year` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ITI_Att5_Total_Marks` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `VOC` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `VOC_Institution_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `VOC_Year_Of_Passing` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `VOC_Subject1` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `VOC_Subject2` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `VOC_Subject3` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `VOC_Subject4` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `VOC_Subject5` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `VOC_Subject6` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `VOC_Subject1_Max_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `VOC_Subject1_Obtained_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `VOC_Subject2_Max_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `VOC_Subject2_Obtained_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `VOC_Subject3_Max_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `VOC_Subject3_Obtained_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `VOC_Subject4_Max_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `VOC_Subject4_Obtained_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `VOC_Subject5_Max_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `VOC_Subject5_Obtained_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `VOC_Subject6_Max_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `VOC_Subject6_Obtained_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `VOC_Total_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `VOC_Total_Obtained_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `VOC_Percentage` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `HSC` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `HSC_School_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `HSC_Board` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `HSC_Year_Of_Passing` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `HSC_Register_No` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `HSC_Exam_Type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `HSC_Major_Stream` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `HSC_Subject1` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `HSC_Subject2` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `HSC_Subject3` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `HSC_Subject4` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `HSC_Subject5` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `HSC_Subject6` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `HSC_Subject1_Max_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `HSC_Subject1_Obtained_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `HSC_Subject2_Max_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `HSC_Subject2_Obtained_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `HSC_Subject3_Max_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `HSC_Subject3_Obtained_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `HSC_Subject4_Max_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `HSC_Subject4_Obtained_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `HSC_Subject5_Max_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `HSC_Subject5_Obtained_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `HSC_Subject6_Max_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `HSC_Subject6_Obtained_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `HSC_Total_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `HSC_Total_Obtained_Mark` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `HSC_Percentage` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `HSC_Cutoff` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_education_details`
--

LOCK TABLES `student_education_details` WRITE;
/*!40000 ALTER TABLE `student_education_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_education_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_enquiry`
--

DROP TABLE IF EXISTS `student_enquiry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_enquiry` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `student_eqid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `student_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mobile_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parent_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parent_mobile` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `district` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `community` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `standard` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `department` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `student_reg_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `school_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `school_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `school_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `source` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `transport` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `hostel` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`,`student_eqid`) USING BTREE,
  KEY `idx_student_name` (`student_eqid`) USING BTREE,
  KEY `idx_mobile_no` (`mobile_no`) USING BTREE,
  KEY `idx_parent_name` (`parent_name`) USING BTREE,
  KEY `idx_student_reg_no` (`student_reg_no`) USING BTREE,
  KEY `idx_standard` (`standard`) USING BTREE,
  KEY `idx_major_subject` (`department`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_enquiry`
--

LOCK TABLES `student_enquiry` WRITE;
/*!40000 ALTER TABLE `student_enquiry` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_enquiry` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_master`
--

DROP TABLE IF EXISTS `student_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_master` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Application_No` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Std_UID` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Register_Number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Student_Name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Gender` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Dob` date DEFAULT NULL,
  `Age` int DEFAULT NULL,
  `EMIS_No` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Std_Email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Photo_Path` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Father_Name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Father_Mobile` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Father_Occupation` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Mother_Name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Mother_Mobile` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Mother_Occupation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Guardian_Name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Guardian_Mobile` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Guardian_Occupation` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Guardian_Relation` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Blood_Group` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Nationality` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Religion` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Community` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Caste` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Physically_Challenged` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Marital_Status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Aadhaar_No` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Pan_No` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Mother_Tongue` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Father_Annual_Income` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Mother_Annual_Income` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Guardian_Annual_Income` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Permanent_District` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Permanent_State` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Permanent_Pincode` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Permanent_Address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Current_District` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Current_State` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Current_Pincode` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Current_Address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Scholarship` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `First_Graduate` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Bank_Loan` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Mode_Of_Joinig` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Reference` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Present` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Course_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Dept_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Dept_Code` int DEFAULT NULL,
  `Year_Of_Department` int DEFAULT NULL,
  `Medium_of_Instruction` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Semester` int DEFAULT NULL,
  `Year` int DEFAULT NULL,
  `Admission_Date` date DEFAULT NULL,
  `Hostel_Required` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Transport_Required` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Admission_Status` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Created_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `Updated_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Student_Mobile` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Total_Fees` decimal(10,2) DEFAULT NULL,
  `Paid_Fees` decimal(10,2) DEFAULT NULL,
  `Balance_Fees` decimal(10,2) DEFAULT NULL,
  `Type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Fees_Type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Academic_Year` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Roll_Number` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Regulation` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Class_Teacher` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Class` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Allocated_Quota` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Qualification` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Seat_No` int DEFAULT NULL,
  `Identification_of_Student` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `S1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `S2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `S3` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `S4` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `S5` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `S6` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `S7` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `S8` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `R1` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `R2` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `R3` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `R4` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `R5` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `R6` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `R7` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `R8` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `whether_completed` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `reason_leaving` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `leaving_date` date DEFAULT NULL,
  `tc_create_date` date DEFAULT NULL,
  `tc_issue_date` date DEFAULT NULL,
  `conduct_character` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tc_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Bank_Name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Bank_Branch` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Bank_IFSC_Code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Bank_Account_No` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Bank_MICR_Code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `role` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5467 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_master`
--

LOCK TABLES `student_master` WRITE;
/*!40000 ALTER TABLE `student_master` DISABLE KEYS */;
INSERT INTO `student_master` VALUES (5369,'1193','560024529101','25BPLE01','ARAVIND M','MALE','2005-11-16',19,NULL,'aravindm2837@gmail.com',NULL,'MUNNUSAMY',NULL,NULL,'BHAVANI V M','9943160537',NULL,'hello',NULL,NULL,NULL,NULL,'Indain','HINDU','BC','SHANAR',NULL,'Single','828920281283',NULL,'TAMIL','72000',NULL,NULL,'THIRUVALLUR','TAMIL NADU','602026','NO. 79 SANAR STREET, ANANDERI  VILLAGE, UTHUKOTTAI T.K., THIRUVALLUR DIST.','THIRUVALLUR','TAMIL NADU','602026','NO. 79 SANAR STREET, ANANDERI  VILLAGE, UTHUKOTTAI T.K., THIRUVALLUR DIST.','No','Yes','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'english',3,2,'2026-02-03','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-03 18:27:49','6385922544',NULL,NULL,NULL,NULL,NULL,'2025-2026','25BPLE01','A',NULL,'A',NULL,NULL,NULL,'scare on left hand',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'completed','course complemented','2026-02-03','2026-02-03','2026-02-03','Good','58/786/001/2026',NULL,NULL,NULL,NULL,NULL,'Student','25BPLE01'),(5370,'1204','560024529102','25BPLE02','MADHESH K','Male','2005-11-07',20,NULL,'mmadhesh038@gmail.com',NULL,'KRISHNAN J','9790397457','BUSSINESS','RAJKUMARI K','6369833413',NULL,'DEEPIKA K','6369833413',NULL,NULL,NULL,'INDIAN','HINDU','BC','YADHAVA',NULL,'Single','720627522508',NULL,'HINDI',NULL,NULL,NULL,'RANIPET','TAMIL NADU','631001','NO. 142 OLD BAZZAR STREET ARAKKONAM','RANIPET','TAMIL NADU','631001','NO. 142 OLD BAZZAR STREET ARAKKONAM','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,NULL,3,2,NULL,'No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9790397457',NULL,NULL,NULL,NULL,NULL,'2025-2026','25BPLE02','A',NULL,'A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','25BPLE02'),(5371,'1134','560024529105','25BPLE03','MOHAMED NASURUDEEN N','Male','2004-04-28',21,NULL,NULL,NULL,'NAGOOR MEERAN M B','8555068846','BUSINESS','SHABIRA BANU N',NULL,NULL,NULL,'8555068846',NULL,NULL,NULL,'INDIAN','MUSLIM','BCM','LABBAI',NULL,'Single','402803231009',NULL,'TAMIL',NULL,NULL,NULL,'CHITTOOR','ANDHRA PRADESH','511590','NO. 9-10 RAMANAIDU COLONY NAGARI PIN- 517 590\r','CHITTOOR','ANDHRA PRADESH','511590','NO. 9-10 RAMANAIDU COLONY NAGARI PIN- 517 590\r','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,NULL,3,2,NULL,'No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','8555068846',NULL,NULL,NULL,NULL,NULL,'2025-2026','25BPLE03','A',NULL,'A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','25BPLE03'),(5372,'1194','560024529106','25BPLE04','MOHAN P','Male','2005-03-13',20,NULL,NULL,NULL,'PANNEER SELVAM','9787819516','TAILOR','VANITHA','8122891163',NULL,NULL,NULL,NULL,NULL,NULL,'INDIAN','MUSLIM','MBC/DNC','KULALA KUYAVAR',NULL,'Single','289154239213',NULL,'TAMIL','96000',NULL,NULL,'THIRUVALLUR','TAMIL NADU','602026','NO. 6-A JJ NAGAR REDDY STREET UTHUKOTTAI , THIRUVALLUR DIST','THIRUVALLUR','TAMIL NADU','602026','NO. 6-A JJ NAGAR REDDY STREET UTHUKOTTAI , THIRUVALLUR DIST','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,NULL,3,2,NULL,'No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02',NULL,NULL,NULL,NULL,NULL,NULL,'2025-2026','25BPLE04','A',NULL,'A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','25BPLE04'),(5373,'1198','560024529107','25BPLE05','MURALI R','Male','2005-11-07',20,NULL,NULL,NULL,'RAJASEKAR P','8525989460','FARMER','MENAKA R','8525844235',NULL,NULL,'8525844235',NULL,NULL,NULL,'INDIAN','OTHERS','MBC/DNC','VANNIYAR',NULL,'Single','285051666693',NULL,'TAMIL','72000',NULL,NULL,'THIRUVALLUR','TAMIL NADU','631205','NO. 1/110, PILLAIYAR KOVIL STREET, CHERUKANUR, TIRUTTANI T.K, THIRUVALLUR DIST.','THIRUVALLUR','TAMIL NADU','631205','NO. 1/110, PILLAIYAR KOVIL STREET, CHERUKANUR, TIRUTTANI T.K, THIRUVALLUR DIST.','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,NULL,3,2,NULL,'No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','8525989460',NULL,NULL,NULL,NULL,NULL,'2025-2026','25BPLE05','A',NULL,'A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','25BPLE05'),(5374,'1197','560024529108','25BPLE06','NAVEEN KUMAR R K','Male','2004-10-17',20,NULL,NULL,NULL,'KOTHANDAN R G','9994551003','DY BDO','AMBIGA G','6374382213',NULL,NULL,NULL,NULL,NULL,NULL,'INDIAN','OTHERS','MBC/DNC','VANNIYAR',NULL,'Single','616739968033',NULL,'TAMIL',NULL,NULL,NULL,'THIRUVALLUR','TAMIL NADU','631303','NO. 1/253 RK PET., BDO OFFICE NEAR, R.K PET TALUK, THIRUVALLUR DIST','THIRUVALLUR','TAMIL NADU','631303','NO. 1/253 RK PET., BDO OFFICE NEAR, R.K PET TALUK, THIRUVALLUR DIST','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,NULL,3,2,NULL,'No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','6374382213',NULL,NULL,NULL,NULL,NULL,'2025-2026','25BPLE06','A',NULL,'A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','25BPLE06'),(5375,'1200','560024529109','25BPLE07','PREM KUMAR S','Male','2003-06-15',22,NULL,NULL,NULL,'SARAVANAN','9159574212','COOLI','AMMUKUTTY','8531001715',NULL,NULL,'9159574212',NULL,NULL,NULL,'INDIAN','OTHERS','SC','ADI DRAVIDAR',NULL,'Single','383372373131',NULL,'TAMIL','108000',NULL,NULL,'THIRUVALLUR','TAMIL NADU','631207','NO. 61 BAJANAIKOVIL STREET, SAMANDHAVADA, PALLIPET T.K , THIRUVALLUR DIST','THIRUVALLUR','TAMIL NADU','631207','NO. 61 BAJANAIKOVIL STREET, SAMANDHAVADA, PALLIPET T.K , THIRUVALLUR DIST','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,NULL,3,2,NULL,'No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9159574212',NULL,NULL,NULL,NULL,NULL,'2025-2026','25BPLE07','A',NULL,'A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','25BPLE07'),(5376,'1199','560024529110','25BPLE08','SHABEER S','Male','2003-12-16',21,NULL,NULL,NULL,'SHATHIK BASHA S','6381895161','OWN BUSINESS','PARVEENA S','6381895161',NULL,'ASHWAK S','6381895161',NULL,NULL,NULL,'INDIAN','OTHERS','BCM','LABBAI',NULL,'Single','749894361033',NULL,'TAMIL','108000',NULL,NULL,'RANIPET','TAMIL NADU','632513','NO. 3/33 SHOLINGHUR MAIN ROAD, KIZH PUDHUPETTAI, WALAJA T.K, RANIPET DIST, PIN-632 513','RANIPET','TAMIL NADU','632513','NO. 3/33 SHOLINGHUR MAIN ROAD, KIZH PUDHUPETTAI, WALAJA T.K, RANIPET DIST, PIN-632 513','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,NULL,3,2,NULL,'No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','6381895161',NULL,NULL,NULL,NULL,NULL,'2025-2026','25BPLE08','A',NULL,'A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','25BPLE08'),(5377,'1195','560024529111','25BPLE09','SANDEEP B','Male','2005-05-09',20,NULL,NULL,NULL,'BALU M','9626809159',NULL,'AMMU M','7339293377',NULL,NULL,'7339293377',NULL,NULL,NULL,'INDIAN','OTHERS','SC','ADI DRAVIDAR',NULL,'Single','359147320413',NULL,'TAMIL','72000',NULL,NULL,'RANIPET','TAMIL NADU','631002','NO. 131 JJ NAGAR NAGAVEDU VILLAGE ARAKKONAM POST, NEMILI T.K, RANIPET DIST, PIN - 631 002','RANIPET','TAMIL NADU','631002','NO. 131 JJ NAGAR NAGAVEDU VILLAGE ARAKKONAM POST, NEMILI T.K, RANIPET DIST, PIN - 631 002','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,NULL,3,2,NULL,'No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9626809159',NULL,NULL,NULL,NULL,NULL,'2025-2026','25BPLE09','A',NULL,'A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','25BPLE09'),(5378,'1192','560024529112','25BPLE10','VICKY S','Male','2005-01-22',20,NULL,NULL,NULL,'SETTU V','9360029532','FARMER','ANITHA S','9626232293',NULL,NULL,'9360029532',NULL,NULL,NULL,'INDIAN','OTHERS','SC','ADI DRAVIDAR',NULL,'Single','311144522882',NULL,'TAMIL','72000',NULL,NULL,'RANIPET','TAMIL NADU','631003','NO. 108 VEMBULIYAMMAN KOVIL STREET, ESALAPURAM VILLAGE, ICHIPUTTUR, RANIPET DIST, PIN - 631 003','RANIPET','TAMIL NADU','631003','NO. 108 VEMBULIYAMMAN KOVIL STREET, ESALAPURAM VILLAGE, ICHIPUTTUR, RANIPET DIST, PIN - 631 003','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,NULL,3,2,NULL,'No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9360029532',NULL,NULL,NULL,NULL,NULL,'2025-2026','25BPLE10','A',NULL,'A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','25BPLE10'),(5379,'1247',NULL,'25BPLE11','AGALYA D','Female','2005-05-23',20,NULL,'agaldevan235@gmail.com',NULL,'DEVAN T',NULL,'FARMER','MALAR M',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'INDIAN','HINDU','SC','ADI DRAVIDAR',NULL,'Single','615063045405',NULL,'TAMIL','84000',NULL,NULL,'THIRUVALLUR','TAMIL NADU','631303','NO.3/411, AMBEDKAR STREET, VEERANATHUR, R.K.PET TALUK, TIRUVALLUR DIST.','THIRUVALLUR','TAMIL NADU','631303','NO.3/411, AMBEDKAR STREET, VEERANATHUR, R.K.PET TALUK, TIRUVALLUR DIST.','No','No','No','Lateral',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,NULL,3,2,'2025-10-23','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9944172383',NULL,NULL,NULL,NULL,NULL,'2025-2026','25BPLE11','A',NULL,'A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','25BPLE11'),(5380,'1246',NULL,'25BPLE12','ARSATH A','Male','2005-05-17',20,NULL,'arsaTHD102030@gmail.com',NULL,'ABDUL RASHEED K',NULL,'CHEF','RAMIZA BI A',NULL,NULL,'ABDUL RASHEED K','8680032581',NULL,NULL,NULL,'INDIAN','MUSLIUM','BCM','LABBAI',NULL,'Single','864973562763',NULL,'TAMIL','108000',NULL,NULL,'THIRUVALLUR','TAMIL NADU','631209','NO.13, AKKAIYA NAIDU STREET, TIRUTTANI, TIRUVALLUR DIST','THIRUVALLUR','TAMIL NADU','631209','NO.13, AKKAIYA NAIDU STREET, TIRUTTANI, TIRUVALLUR DIST','No','Yes','No','Lateral',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,NULL,3,2,'2025-10-23','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9585072219',NULL,NULL,NULL,NULL,NULL,'2025-2026','25BPLE12','A',NULL,'A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','25BPLE12'),(5381,'1241',NULL,'25BPLE13','BABY M','Female','2004-10-25',21,NULL,NULL,NULL,'MAGIMAIDASS',NULL,'COOLI','MARIYA',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'INDIAN','CHRISTIAN','BC','ADI DRAVIDAR',NULL,'Single',NULL,NULL,'TAMIL','84000',NULL,NULL,'THIRUVALLUR','TAMIL NADU','631204','NO.67,MARI STREET,ARCOT KUPPAM POST,ARUMBAKKAM,THIRUVALLUR DIST','THIRUVALLUR','TAMIL NADU','631204','NO.67,MARI STREET,ARCOT KUPPAM POST,ARUMBAKKAM,THIRUVALLUR DIST','No','No','No','Lateral',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,NULL,3,2,'2025-10-16','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9360992332',NULL,NULL,NULL,NULL,NULL,'2025-2026','25BPLE13','A',NULL,'A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','25BPLE13'),(5382,'560020529094',NULL,'560020529094','THULASINGAM K H','Male','2002-12-02',NULL,NULL,'thulasingam.kh.20b@grt.edu.in',NULL,'K J HEMANATHAN',NULL,'BUSINESS','K KALAIVANI',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'INDIAN','HINDU','BC','KARUNEEGAR',NULL,NULL,NULL,NULL,'TAMIL','96000',NULL,NULL,'THIRUVALLUR','TAMIL NADU','631209','NO. 2/48 ,BHARATHIYAR STREET, TIRUTTANI,TIRUTTANI (TK),THIRUVALLUR (DT),PIN-631209','THIRUVALLUR','TAMIL NADU','631209','NO. 2/48 ,BHARATHIYAR STREET, TIRUTTANI,TIRUTTANI (TK),THIRUVALLUR (DT),PIN-631209','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,NULL,3,2,NULL,'No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9942021940',NULL,NULL,NULL,NULL,NULL,'2020-2028','20BP094','A',NULL,'A','MQ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560020529094'),(5383,'560024529001','560024529001','560024529001','AARIFA JEELANI J','Female','2007-05-04',NULL,NULL,'aarifajeelani.j.24b@grt.edu.in',NULL,'M I JAINUL AFDEEN',NULL,'HOTEL','J SYED ALI FATHIMA',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'A+','INDIAN','ISLAM','BCM','LABBAIS',NULL,NULL,'744080176739',NULL,'TAMIL','120000',NULL,NULL,'THIRUVALLUR','TAMIL NADU','602024','NO. 692,  TNHB PERUMALPATTU, VEPPAMPATTU, THIRUVALLUR. PIN - 602024','THIRUVALLUR','TAMIL NADU','602024','NO. 692,  TNHB PERUMALPATTU, VEPPAMPATTU, THIRUVALLUR. PIN - 602024','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-10-24','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9080946940',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP001','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,'BP301T','BP301T,BP302T,BP303T,BP304T,BP305P,BP306P,BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529001'),(5384,'560024529002','560024529002','560024529002','ABINAYA V','Female','2006-06-17',NULL,NULL,'abinaya.v.24b@grt.edu.in',NULL,'Mr. M VADIVEL',NULL,'FARMER','V KOMATHI',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'O+','INDIAN','HINDU','SCA','ARUNTHATHIYAR',NULL,NULL,'405360767375',NULL,'TAMIL','72000',NULL,NULL,'VELLORE','TAMIL NADU','632514','No. 317, MARIAMMAN KOVIL (ST), SRINIVASAAPURAM (V), PARAMASATHU (T), KATPADI (TK), VELLORE (DIST) - 632514','VELLORE','TAMIL NADU','632514','No. 317, MARIAMMAN KOVIL (ST), SRINIVASAAPURAM (V), PARAMASATHU (T), KATPADI (TK), VELLORE (DIST) - 632514','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9159420857',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP002','A',NULL,'A','MQ','HSc - Tamil Nadu Govt',NULL,NULL,'BP301T','BP301T,BP302T,BP303T,BP304T,BP305P,BP306P,BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529002'),(5385,'560024529003','560024529003','560024529003','AJAY S','Male','2006-06-02',NULL,NULL,'ajay.s.24b@grt.edu.in',NULL,'J SUKHDEV',NULL,'BUSNISS','S LEELA',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'O+','INDIAN','HINDU','BC','MALI',NULL,NULL,'806498709056',NULL,'HINDI','120000',NULL,NULL,'THIRUVALLUR','TAMIL NADU','631207','No.45,BAZAAR (ST),PALLIPATTU,THIRUVALLUR (DT), TAMILANDU- 631207','THIRUVALLUR','TAMIL NADU','631207','No.45,BAZAAR (ST),PALLIPATTU,THIRUVALLUR (DT), TAMILANDU- 631207','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-10-22','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9751204825',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP003','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,'BP301T','BP301T,BP302T,BP303T,BP304T,BP305P,BP306P,BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529003'),(5386,'560024529004','560024529004','560024529004','AKASH V','Male','2006-02-11',NULL,NULL,'akash.v.24b@grt.edu.in',NULL,'V VEERA RAGAVAN',NULL,'FARMER','V JEEVA',NULL,'HOUSE KEEPING (COMPANY)','BALASUBRAMANI K','7904276208','PHARMACISTS',NULL,'O+','INDIAN','HINDU','MBC','ODDAR',NULL,NULL,'792734859972',NULL,'TELUGU','108000',NULL,NULL,'THIRUVALLUR','TAMIL NADU','601201','No. 11, OTTAR (ST), OTTAR PALAYAM, EGUVARPALAYAM, IGUVARPALAYAM, THIRUVALLUR, TAMILNADU- 601201','THIRUVALLUR','TAMIL NADU','601201','No. 11, OTTAR (ST), OTTAR PALAYAM, EGUVARPALAYAM, IGUVARPALAYAM, THIRUVALLUR, TAMILNADU- 601201','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9791677506',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP004','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,'BP301T','BP301T,BP302T,BP303T,BP304T,BP305P,BP306P,BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529004'),(5387,'560024529006','560024529006','560024529006','ARTHIMA K','Female','2006-06-20',NULL,NULL,'arthima.k.24b@grt.edu.in',NULL,'K KUBENDRAN',NULL,'BUSNISS','K GOWRI',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'O+','INDIAN','HINDU','MBC','NAVITHAR',NULL,NULL,'497925780076',NULL,'TAMIL','72000',NULL,NULL,'THIRUVALLUR','TAMIL NADU','631209','No. 1/79-3, SANDI (ST), SURIYANAGARAM (TOWN), TIRUTTANI (TK), THIRIVALLUR (DT), TAMILNADU- 631209','THIRUVALLUR','TAMIL NADU','631209','No. 1/79-3, SANDI (ST), SURIYANAGARAM (TOWN), TIRUTTANI (TK), THIRIVALLUR (DT), TAMILNADU- 631209','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-10-22','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9751822608',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP006','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,'BP301T','BP301T,BP302T,BP303T,BP304T,BP305P,BP306P,BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529006'),(5388,'560024529007','560024529007','560024529007','ARULJOTHI S','Male','2007-07-19',NULL,NULL,'aruliothi.s.24b@grt.edu.in',NULL,'Mr. D SOMASUNDARAM',NULL,'AGRICULTURE','S ANANDHI',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'O+','INDIAN','HINDU','BC','AGAMUDAYAR',NULL,NULL,'245359385799',NULL,'TAMIL','84000',NULL,NULL,'VELLORE','TAMIL NADU','635809','No.33, RAIL ROAD (ST), VETTUVANAM (TOWN), ANICUT (TK), VELLORE (DT) , TAMILNADU- 635809','VELLORE','TAMIL NADU','635809','No.33, RAIL ROAD (ST), VETTUVANAM (TOWN), ANICUT (TK), VELLORE (DT) , TAMILNADU- 635809','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-10-23','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9092307155',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP007','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,'BP301T','BP301T,BP302T,BP303T,BP304T,BP305P,BP306P,BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529007'),(5389,'560024529008','560024529008','560024529008','ASHRAF A','Male','2006-08-07',NULL,NULL,'ashraf.a.24b@grt.edu.in',NULL,'A ANEEFA',NULL,'BUSNISS','A ZEENATH BEGAM',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'O-','INDIAN','ISLAM','BCM','LABBAIS',NULL,NULL,'670460695521',NULL,'TAMIL',NULL,NULL,NULL,'RANIPET','TAMIL NADU','631151','44/18C,PANNAKATTU PILLAIYAR KOVIL STREET,THAKKOLAM,ARAKKONAM,VELLORE,TAMILNADU-631151','RANIPET','TAMIL NADU','631151','44/18C,PANNAKATTU PILLAIYAR KOVIL STREET,THAKKOLAM,ARAKKONAM,VELLORE,TAMILNADU-631151','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9500789816',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP008','A',NULL,'A','MQ','HSc - Tamil Nadu Govt',NULL,NULL,'BP301T','BP301T,BP302T,BP303T,BP304T,BP305P,BP306P,BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529008'),(5390,'560024529009','560024529009','560024529009','ASHWINI K','Female','2006-09-25',NULL,NULL,'ashwini.k.24b@grt.edu.in',NULL,'P KUMAR',NULL,'DRIVER','K JESINTHA',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'B+','INDIAN','HINDU','SC','ADI DRAVIDA',NULL,NULL,'467419799272',NULL,'TAMIL','72000',NULL,NULL,'KANCHIPURAM','TAMIL NADU','602108','NO. 3/337 , 1ST STREET,PERUMAL KOVIL STREET,METTU COLONY,KANTHUR(TOWN), SRIPERUMBUDUR(TK),KANCHIPURAM(DT), TAMILNADU-602108','KANCHIPURAM','TAMIL NADU','602108','NO. 3/337 , 1ST STREET,PERUMAL KOVIL STREET,METTU COLONY,KANTHUR(TOWN), SRIPERUMBUDUR(TK),KANCHIPURAM(DT), TAMILNADU-602108','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-10-23','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9500651075',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP009','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,'BP301T','BP301T,BP302T,BP303T,BP304T,BP305P,BP306P,BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529009'),(5391,'560024529010','560024529010','560024529010','ATHURIKA A','Female','2007-07-09',NULL,NULL,'athurika.a.24b@grt.edu.in',NULL,'S ASOKAN',NULL,'DAILY WAVEGER','A THEEBAMANI',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'B+','INDIAN','HINDU','SC','ADI DRAVIDA',NULL,NULL,'978511801152',NULL,'TAMIL','72000',NULL,NULL,'RANIPET','TAMIL NADU','632501','5/160 , STREET OF ROAD STREET ,VELLAM(TOWN),SHOLINGUR(TK),RANIPET(DT),TAMILNADU-632501','RANIPET','TAMIL NADU','632501','5/160 , STREET OF ROAD STREET ,VELLAM(TOWN),SHOLINGUR(TK),RANIPET(DT),TAMILNADU-632501','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-10-24','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','8056893267',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP010','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,'BP301T','BP301T,BP302T,BP303T,BP304T,BP305P,BP306P,BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529010'),(5392,'560024529011','560024529011','560024529011','BHAVADHARANI P','Female','2006-06-12',NULL,NULL,'bhavadharani.p.24b@grt.edu.in',NULL,'C PONRAJ',NULL,'THEATRE ASSISTANT','P PONMANI',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'O+','INDIAN','HINDU','BC','NADAR',NULL,NULL,'778248168022',NULL,'TAMIL','96000',NULL,NULL,'THIRUVALLUR','TAMIL NADU','602026','39 STREET OF CHAVADI STREET\n,UTHUKOTTAI TOWN,\nUTHUKOTTAI(TK),\nTIRUVALLUR (DT),','THIRUVALLUR','TAMIL NADU','602026','39 STREET OF CHAVADI STREET\n,UTHUKOTTAI TOWN,\nUTHUKOTTAI(TK),\nTIRUVALLUR (DT),','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9444021857',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP011','A',NULL,'A','MQ','HSc - Tamil Nadu Govt',NULL,NULL,'BP301T','BP301T,BP302T,BP303T,BP304T,BP305P,BP306P,BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529011'),(5393,'560024529012','560024529012','560024529012','BHUVANESWARI J','Female','2007-02-14',NULL,NULL,'bhuvaneswari.j.24b@grt.edu.in',NULL,'M JANARDHANAN',NULL,'SHOP KEEPER','J MAMATHA',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'O+','INDIAN','HINDU','OC','KAMMA NAIDU',NULL,NULL,'308519642223',NULL,'TELUGU','96000',NULL,NULL,'THIRUVALLUR','TAMIL NADU','602023','NO. 1 PERUMAL KOVIL STREET, SENGUNDRAM VILLAGE, \nDEVANDAVAKKAM POST, \nUTHUKOTTAI TALUK, \nTHIRUVALLUR DIST, PIN 602 023','THIRUVALLUR','TAMIL NADU','602023','NO. 1 PERUMAL KOVIL STREET, SENGUNDRAM VILLAGE, \nDEVANDAVAKKAM POST, \nUTHUKOTTAI TALUK, \nTHIRUVALLUR DIST, PIN 602 023','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-10-22','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','6381610528',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP012','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,'BP301T','BP301T,BP302T,BP303T,BP304T,BP305P,BP306P,BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529012'),(5394,'560024529013','560024529013','560024529013','BOOPATHY R','Male','2007-09-13',NULL,NULL,'boopathy.r.24b@grt.edu.in',NULL,'RAJENDIRAN',NULL,NULL,'VANITHA',NULL,NULL,'NAVEEN','9363322589',NULL,NULL,'O+','INDIAN','HINDU','MBC','VANNIYAR',NULL,NULL,'742152702873',NULL,'TAMIL','96000',NULL,NULL,'RANIPET','TAMIL NADU','632502','No.325B, MAHENDRAVADI (TOWN), ARAKKONAM (TK)\nNEMILI(TK),\nRANIPET(DT),\nTAMILNADU-632502','RANIPET','TAMIL NADU','632502','No.325B, MAHENDRAVADI (TOWN), ARAKKONAM (TK)\nNEMILI(TK),\nRANIPET(DT),\nTAMILNADU-632502','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-10-22','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9751398877',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP013','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,'BP301T','BP301T,BP302T,BP303T,BP304T,BP305P,BP306P,BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529013'),(5395,'560024529014','560024529014','560024529014','CHARULATHA S','Female','2006-11-02',NULL,NULL,'charulatha.s.24b@grt.edu.in',NULL,'SAMANDAIYYA D',NULL,NULL,'SATHYA S',NULL,'HOUSE WIFE','PREMKUMAR','8056163061','COMPANY HR',NULL,'B+','INDIAN','HINDU','SC','ADI DRAVIDA',NULL,NULL,'476784010612',NULL,'TAMIL','72000',NULL,NULL,'THIRUVALLUR','TAMIL NADU','631208','NO.245  MARIYAMMAN KOVIL  STREET,KEECHALAM(TOWN),\nPALLIPATTU(TK),\nTIRUVALLUR(DT),\nTAMIL NADU -631208','THIRUVALLUR','TAMIL NADU','631208','NO.245  MARIYAMMAN KOVIL  STREET,KEECHALAM(TOWN),\nPALLIPATTU(TK),\nTIRUVALLUR(DT),\nTAMIL NADU -631208','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','8825577419',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP014','A',NULL,'A','MQ','HSc - Tamil Nadu Govt',NULL,NULL,'BP301T','BP301T,BP302T,BP303T,BP304T,BP305P,BP306P,BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529014'),(5396,'560024529015','560024529015','560024529015','DARSANI K','Female','2006-09-19',NULL,NULL,'darsani.k.24b@grt.edu.in',NULL,'KRISHNAMOORTHY V',NULL,'TVS','DHANALAKSHMI K',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'B+','INDIAN','HINDU','SC','ADI DRAVIDA',NULL,NULL,'446960898815',NULL,'TAMIL','72000',NULL,NULL,'RANIPET','TAMIL NADU','631102','NO.364,STREET OF WEST BOARDING PET,\nSHOLINGUR(TOWN),\nSHOLINGUR(TK),\nRANIPET(DT),\nTAMIL NADU -631102','RANIPET','TAMIL NADU','631102','NO.364,STREET OF WEST BOARDING PET,\nSHOLINGUR(TOWN),\nSHOLINGUR(TK),\nRANIPET(DT),\nTAMIL NADU -631102','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9940854534',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP015','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,'BP301T','BP301T,BP302T,BP303T,BP304T,BP305P,BP306P,BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529015'),(5397,'560024529016','560024529016','560024529016','DEEPIKA S','Female','2005-10-06',NULL,NULL,'deepika.s.24b@grt.edu.in',NULL,'SEENU A',NULL,'CONTRACTOR','UMAMAHESWARI S',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'O+','INDIAN','HINDU','BC','AGAMUDAYAR',NULL,NULL,'687614765695',NULL,'TAMIL','48000',NULL,NULL,'THIRUVANNAMALAI','TAMIL NADU','606907','N0.63/ A,STREET OF CC ROAD,\nPALVARTHUVENDRAN(TOWN),\nPOLUR(TK),\nTIRUVANAMALAI(DT),\nTAMIL NADU-606907','THIRUVANNAMALAI','TAMIL NADU','606907','N0.63/ A,STREET OF CC ROAD,\nPALVARTHUVENDRAN(TOWN),\nPOLUR(TK),\nTIRUVANAMALAI(DT),\nTAMIL NADU-606907','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9943306325',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP016','A',NULL,'A','MQ','HSc - Tamil Nadu Govt',NULL,NULL,'BP301T','BP301T,BP302T,BP303T,BP304T,BP305P,BP306P,BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529016'),(5398,'560024529017','560024529017','560024529017','DEVI BALA M','Female','2006-10-07',NULL,NULL,'devibala.m.24b@grt.edu.in',NULL,'MOHAN M',NULL,'FARMER','SATHYA M',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'O+','INDIAN','HINDU','SC','ADI DRAVIDA',NULL,NULL,'391977288747',NULL,'TAMIL','72000',NULL,NULL,'RANIPET','TAMIL NADU','631151','NO.190,STREET OF OTHAVADAI,\nANAIKATTAPUDUR(TOWN),\nARAKKONAM(TK),\nRANIPET(DT),\nTAMILNADU-631151','RANIPET','TAMIL NADU','631151','NO.190,STREET OF OTHAVADAI,\nANAIKATTAPUDUR(TOWN),\nARAKKONAM(TK),\nRANIPET(DT),\nTAMILNADU-631151','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9444744004',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP017','A',NULL,'A','GQ','CBSE - INDIA',NULL,NULL,'BP301T','BP301T,BP302T,BP303T,BP304T,BP305P,BP306P,BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529017'),(5399,'560024529018','560024529018','560024529018','DEVI PRIYA M','Female','2006-10-07',NULL,NULL,'devipriya.m.24b@grt.edu.in',NULL,'MOHAN M',NULL,'FARMER','SATHYA M',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'O+','INDIAN','HINDU','SC','ADI DRAVIDA',NULL,NULL,'975665568635',NULL,'TAMIL','72000',NULL,NULL,'RANIPET','TAMIL NADU','631151','NO 190, STREET OF OTHAVADAI,,\nANAIKATTAPUDUR(TOWN)\n,ARAKKONAM(TK)\n,RANIPET(DT)\n,TAMIL NADU-631151','RANIPET','TAMIL NADU','631151','NO 190, STREET OF OTHAVADAI,,\nANAIKATTAPUDUR(TOWN)\n,ARAKKONAM(TK)\n,RANIPET(DT)\n,TAMIL NADU-631151','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9444744004',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP018','A',NULL,'A','GQ','CBSE - INDIA',NULL,NULL,'BP301T','BP301T,BP302T,BP303T,BP304T,BP305P,BP306P,BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529018'),(5400,'560024529019','560024529019','560024529019','DHARSHAN S','Male','2007-03-09',NULL,NULL,'dharshan.s.24b@grt.edu.in',NULL,'SARAVANAN B',NULL,'DRIVER','SUSHELA S',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'B+','INDIAN','HINDU','BC','MUTHURAJA',NULL,NULL,'887330851595',NULL,'TAMIL','108000',NULL,NULL,'RANIPET','TAMIL NADU','631051','NO.137,STREET OF MAIN ROAD,\nR P NAGAR ,SAYANAVARAM(TOWN),\nNEMILI(TK),\nRANIPET(DT),\nTAMIL NADU-631051','RANIPET','TAMIL NADU','631051','NO.137,STREET OF MAIN ROAD,\nR P NAGAR ,SAYANAVARAM(TOWN),\nNEMILI(TK),\nRANIPET(DT),\nTAMIL NADU-631051','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9566766422',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP019','A',NULL,'A','MQ','HSc - Tamil Nadu Govt',NULL,NULL,'BP301T','BP301T,BP302T,BP303T,BP304T,BP305P,BP306P,BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529019'),(5401,'560024529020','560024529020','560024529020','DHARSHINI P','Female','2007-07-28',NULL,NULL,'dharshini.p.24b@grt.edu.in',NULL,'PUSHPARAJ M',NULL,'TASMACK','MARIYAMMA P',NULL,'HOUSE WIFE','POONUSWAMY M','9786999168','BUSNISS',NULL,'O+','INDIAN','HINDU','SC','ADI DRAVIDA',NULL,NULL,'531242558741',NULL,'TAMIL','120000',NULL,NULL,'THIRUVALLUR','TAMIL NADU','631207','NO.3, 1ST STREET ,PUDUPPATTU(TOWN),\nPALLIPATTU(TK),\nTIRUVALLUR(DT),\nTAMIL NADU-631207','THIRUVALLUR','TAMIL NADU','631207','NO.3, 1ST STREET ,PUDUPPATTU(TOWN),\nPALLIPATTU(TK),\nTIRUVALLUR(DT),\nTAMIL NADU-631207','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9159130025',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP020','A',NULL,'A','MQ','HSc - Tamil Nadu Govt',NULL,NULL,'BP301T','BP301T,BP302T,BP303T,BP304T,BP305P,BP306P,BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529020'),(5402,'560024529021','560024529021','560024529021','DHEENAN S','Male','2007-10-23',NULL,NULL,'dheenan.s.24b@grt.edu.in',NULL,'C. SURESH',NULL,'EX ARMY','S.UMA MAGESHWARI',NULL,NULL,NULL,NULL,NULL,NULL,'AB+','INDIAN','HINDU','SC','ADI DRAVIDA',NULL,NULL,'531612954687',NULL,'TAMIL','300000',NULL,NULL,'VELLORE','TAMIL NADU','632107','NO. 47/A FIRST STREET, SECOND HOUSE, MARATTIPALAYAM VILLAGE, G.R.PALAYAM POST, ANAICUT T.K, VELLORE DIST, PIN 632 107.','VELLORE','TAMIL NADU','632107','NO. 47/A FIRST STREET, SECOND HOUSE, MARATTIPALAYAM VILLAGE, G.R.PALAYAM POST, ANAICUT T.K, VELLORE DIST, PIN 632 107.','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-10-24','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','6382189080',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP021','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,'BP301T','BP301T,BP302T,BP303T,BP304T,BP305P,BP306P,BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529021'),(5403,'560024529022','560024529022','560024529022','DHIVAKAR H','Male','2007-05-30',NULL,NULL,'dhivakar.h.24b@grt.edu.in',NULL,'M. HARI DASS',NULL,'ELECTRICIAN','H. SARASWATHI',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'O+','INDIAN','HINDU','SC','ADI DRAVIDA',NULL,NULL,'571167415081',NULL,'TAMIL','108000',NULL,NULL,'RANIPET','TAMIL NADU','631051','NO.3/33, MIDDLE STREET PALLUR ARAKONAM RANIPET PINCODE 631051','RANIPET','TAMIL NADU','631051','NO.3/33, MIDDLE STREET PALLUR ARAKONAM RANIPET PINCODE 631051','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9843610653',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP022','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529022'),(5404,'560024529023','560024529023','560024529023','DINESH JAYAKUMAR','Male','2005-05-31',NULL,NULL,'dinesh.j.24b@grt.edu.in',NULL,'N JAYAKUMAR',NULL,'FARMER','J THILAGAVATHI',NULL,'HOUSE KEEPING','MAINKANDAN S','9655531747','DRIVER',NULL,'B+','INDIAN','HINDU','MBC','VANNIAKULA KSHATRIYA',NULL,NULL,'219821976356',NULL,'TAMIL','72000',NULL,NULL,'RANIPET','TAMIL NADU','632406','NO193 C BHAJANAI KOVIL STREET PULIYANTHANGAL WALAJAPET,BHEL RANIPET,VELLORE,TAMILNADU-632406','RANIPET','TAMIL NADU','632406','NO193 C BHAJANAI KOVIL STREET PULIYANTHANGAL WALAJAPET,BHEL RANIPET,VELLORE,TAMILNADU-632406','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-10-22','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9790043406',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP023','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529023'),(5405,'560024529024','560024529024','560024529024','EVANGELIN CHRISTINAL S','Female','2007-01-09',NULL,NULL,'evangelinchristinal.s.24b@grt.edu.in',NULL,'S. SOLOMON NATHAN',NULL,'CARPENTER','J.JENITHA',NULL,'NURSE','RAJESH BABU D','7708504715','TEACHER',NULL,'A+','INDIAN','CHRISTIAN','BC','ADI DRAVIDA',NULL,NULL,'201270492710',NULL,'TAMIL','96000',NULL,NULL,'RANIPET','TAMIL NADU','632513','NO. 118/3 139A PILLAIYAR KOIL STREET, BELLIYAPPPA NAGAR, AMMANANTHANGAL WALAJAPET RANIPET PIN 632 513','RANIPET','TAMIL NADU','632513','NO. 118/3 139A PILLAIYAR KOIL STREET, BELLIYAPPPA NAGAR, AMMANANTHANGAL WALAJAPET RANIPET PIN 632 513','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-10-22','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','8056554630',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP024','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529024'),(5406,'560024529025','560024529025','560024529025','GNANAPRAKASH S','Male','2006-08-13',NULL,NULL,'gnanaprakash.s.24b@grt.edu.in',NULL,'G.SENTHILKUMAR',NULL,'FARMER','S.KRISHNAVENI',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'B+','INDIAN','HINDU','MBC','VANNIAKULA KSHATRIYA',NULL,NULL,'348241622551',NULL,'TAMIL','72000',NULL,NULL,'RANIPET','TAMIL NADU','632501','NO. 87, BIG STREET, OZHUGUR , SHOLINGHUR T.K, RANIPET DIST, PIN 632 501.','RANIPET','TAMIL NADU','632501','NO. 87, BIG STREET, OZHUGUR , SHOLINGHUR T.K, RANIPET DIST, PIN 632 501.','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-10-23','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9789589039',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP025','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529025'),(5407,'560024529026','560024529026','560024529026','HAJERA THASLEMA M','Female','2006-12-24',NULL,NULL,'hajerathaslema.m.24b@grt.edu.in',NULL,'MOHAMMED SHABI',NULL,'COUIRER OFFICE','ZUBEDHA',NULL,'HOUSE WIFE','MOHAMMED YUSIFF','6380580039','DRIVER',NULL,'AB+','INDIAN','ISLAM','BCM','LABBAIS',NULL,NULL,'600491653514',NULL,'TAMIL','72000',NULL,NULL,'RANIPET','TAMIL NADU','631151','NO. 7 JJ NAGAR ARIKILAPADI VILLAGE, RANIPET. PIN 631 151','RANIPET','TAMIL NADU','631151','NO. 7 JJ NAGAR ARIKILAPADI VILLAGE, RANIPET. PIN 631 151','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9884580835',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP026','A',NULL,'A','MQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529026'),(5408,'560024529027','560024529027','560024529027','HARIHARA SUDHAN C','Male','2005-07-07',NULL,NULL,'hariharasudhan.c.24b@grt.edu.in',NULL,'D.CHEZHIYAN',NULL,'RETEIRED TEACHER','A. GEETHA',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'O+','INDIAN','HINDU','SC','ADI DRAVIDA',NULL,NULL,'217990089980',NULL,'TAMIL','463344',NULL,NULL,'VELLORE','TAMIL NADU','632007','NO. 8/1 VALLIMALAI ROAD, AVANGADU, PALLIKUPPAM POST, KATPADI VELLORE. PIN 632 007','VELLORE','TAMIL NADU','632007','NO. 8/1 VALLIMALAI ROAD, AVANGADU, PALLIKUPPAM POST, KATPADI VELLORE. PIN 632 007','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','8825420030',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP027','A',NULL,'A','MQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529027'),(5409,'560024529028','560024529028','560024529028','HARINI S','Female','2007-03-27',NULL,NULL,'harini.s.24b@grt.edu.in',NULL,'V.SEKAR',NULL,'DRIVER','S.LOGANAYAGI',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'A+','INDIAN','HINDU','SCA','ADI DRAVIDA',NULL,NULL,'475453740428',NULL,'TAMIL','96000',NULL,NULL,'RANIPET','TAMIL NADU','631002','NO. 62, ESWARAN KOVIL STREET,  ARUMBAKKAM POST, NAGAVEDU RANIPET DIST,','RANIPET','TAMIL NADU','631002','NO. 62, ESWARAN KOVIL STREET,  ARUMBAKKAM POST, NAGAVEDU RANIPET DIST,','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','7339279005',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP028','A',NULL,'A','MQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529028'),(5410,'560024529029','560024529029','560024529029','HARITHA E','Female','2006-11-10',NULL,NULL,'haritha.e.24b@grt.edu.in',NULL,'R. EKAMBARAM',NULL,'RAILWAY (RD)','E. MANJULA',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'B+','INDIAN','HINDU','BC','YADHAVA',NULL,NULL,'457850677508',NULL,'TAMIL','72000',NULL,NULL,'RANIPET','TAMIL NADU','631003','NO.10/41 NERUJI NAGAR 5TH STREET, 3 RD CROSS ARAKKONAM 631 003','RANIPET','TAMIL NADU','631003','NO.10/41 NERUJI NAGAR 5TH STREET, 3 RD CROSS ARAKKONAM 631 003','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9894978588',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP029','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529029'),(5411,'560024529030','560024529030','560024529030','JANANI K','Female','2007-06-06',NULL,NULL,'janani.k.24b@grt.edu.in',NULL,'KUMAR',NULL,'DRIVER','SUDHA',NULL,'HOUSE WIFE','SURESH R C','9943366143',NULL,NULL,'O+','INDIAN','HINDU','BC','VISWAKARMA',NULL,NULL,'534101488048',NULL,'TAMIL','60000',NULL,NULL,'THIRUVANNAMALAI','TAMIL NADU','606710','NO.162, BANK STREET, PARAMANANANDAL, CHENGAM TK, THIRUVANNAMALAI DIST','THIRUVANNAMALAI','TAMIL NADU','606710','NO.162, BANK STREET, PARAMANANANDAL, CHENGAM TK, THIRUVANNAMALAI DIST','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9943698959',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP030','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529030'),(5412,'560024529031','560024529031','560024529031','JANANI S','Female','2007-01-19',NULL,NULL,'janani.s.24b@grt.edu.in',NULL,'V SATHYARAJ',NULL,NULL,'S MOHANA',NULL,NULL,NULL,NULL,NULL,NULL,'O+','INDIAN','HINDU','MBC','NAVITHAR',NULL,NULL,'645767546815',NULL,'TAMIL','84000',NULL,NULL,'THIRUVALLUR','TAMIL NADU','631209','No.27, M G R NAGAR TIRUTTANI, TIRUVALLUR DIST PIN 631 209','THIRUVALLUR','TAMIL NADU','631209','No.27, M G R NAGAR TIRUTTANI, TIRUVALLUR DIST PIN 631 209','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','7825978294',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP031','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529031'),(5413,'560024529032','560024529032','560024529032','JAYA KUMAR T','Male','2006-11-26',NULL,NULL,'jayakumar.t.24b@grt.edu.in',NULL,'S THANIGAIMALAI',NULL,'COOLI','T DHARANI',NULL,'COLLI','SUDHAKAR M','9952220622','ELECTERICIAN',NULL,'O+','INDIAN','HINDU','BC','YADHAVA',NULL,NULL,'275897852400',NULL,'TAMIL','72000',NULL,NULL,'RANIPET','TAMIL NADU','632502','NO. 69 BAJANAI KOIL STREET, KOLLUMEDU MELERI POST, NEMILI T.K, RANIPET DIST, PIN 632 502','RANIPET','TAMIL NADU','632502','NO. 69 BAJANAI KOIL STREET, KOLLUMEDU MELERI POST, NEMILI T.K, RANIPET DIST, PIN 632 502','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9159939795',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP032','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529032'),(5414,'560024529033','560024529033','560024529033','JAYASURYA P','Male','2007-03-16',NULL,NULL,'jayasurya.p.24b@grt.edu.in',NULL,'S PRABAKARAN',NULL,'COMPANY','P UMARANI',NULL,'HOUSE WIFE','KARTHIKRAJA P','6383469873',NULL,NULL,'A-','INDIAN','HINDU','MBC','VANNAR',NULL,NULL,'884859481655',NULL,'TAMIL','96000',NULL,NULL,'RANIPET','TAMIL NADU','632513','NO.108 VIVEKANANDHAR , 2ND CROSS STREET, RAFEE NAGAR VANIVEDU, RANIPET DIST, PIN 632 513','RANIPET','TAMIL NADU','632513','NO.108 VIVEKANANDHAR , 2ND CROSS STREET, RAFEE NAGAR VANIVEDU, RANIPET DIST, PIN 632 513','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-10-22','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','7010370362',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP033','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529033'),(5415,'560024529034','560024529034','560024529034','KAMAL ESHWAR P','Male','2007-07-30',NULL,NULL,'kamaleshwar.p.24b@grt.edu.in',NULL,'R PADMANABAN',NULL,'PRIVATE BUSNISS','P SORNALATHA',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'B+','INDIAN','HINDU','BC','GAVARA',NULL,NULL,'975014302659',NULL,'TELUGU','120000',NULL,NULL,'THIRUVALLUR','TAMIL NADU','600054','NO. 150 GANGAI AMMAN KOVIL STREET, KAVARAPALAYAM AVADI, CHENNAI , THIRUVALLUR DIST, PIN 600 054','THIRUVALLUR','TAMIL NADU','600054','NO. 150 GANGAI AMMAN KOVIL STREET, KAVARAPALAYAM AVADI, CHENNAI , THIRUVALLUR DIST, PIN 600 054','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-10-22','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9445287065',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP034','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529034'),(5416,'560024529035','560024529035','560024529035','KARUNAMAYEE K','Female','1999-05-31',NULL,NULL,'karunamayee.k.24b@grt.edu.in',NULL,'B KANNAN',NULL,'BANK MANAGER','P RANJANI',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'O+','INDIAN','HINDU','OC','BRAHMIN',NULL,NULL,'726821666480',NULL,'TAMIL',NULL,NULL,NULL,'CHENNAI','TAMIL NADU','600078','OLD NO. 161/7, NEW NO. 17/7, BAGMAR FLATS, 94TH STREET, 15TH SECTOR, KK NAGAR, KODAMBAKAM, MAMBALAM (TK) CHENNAI','CHENNAI','TAMIL NADU','600078','OLD NO. 161/7, NEW NO. 17/7, BAGMAR FLATS, 94TH STREET, 15TH SECTOR, KK NAGAR, KODAMBAKAM, MAMBALAM (TK) CHENNAI','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','7402225164',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP035','A',NULL,'A','MQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529035'),(5417,'560024529036','560024529036','560024529036','KAVITHA S','Female','2007-01-02',NULL,NULL,'kavitha.s.24b@grt.edu.in',NULL,'S SARAVANAN',NULL,'COOLI','S MAGESWARI',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'B+','INDIAN','HINDU','MBC','NAVITHAR',NULL,NULL,'789493552881',NULL,'TAMIL','120000',NULL,NULL,'THIRUVALLUR','TAMIL NADU','602025','NO. 61A MALAIVAZHMAKKAL STREET, PUTLUR V & P, THIRUVALLUR DIST, PIN 602 025','THIRUVALLUR','TAMIL NADU','602025','NO. 61A MALAIVAZHMAKKAL STREET, PUTLUR V & P, THIRUVALLUR DIST, PIN 602 025','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-10-22','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','8870912439',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP036','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529036'),(5418,'560024529037','560024529037','560024529037','KAVIYARASU B','Male','2007-06-16',NULL,NULL,'kaviyarasu.b.24b@grt.edu.in',NULL,'S BABU',NULL,'MASON','B AMMU',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'O+','INDIAN','HINDU','BC','MUTHARAIYAR',NULL,NULL,'667496223179',NULL,'TAMIL','72000',NULL,NULL,'THIRUVALLUR','TAMIL NADU','631211','NO. 3/367, PALAIYAKARAR STREET, PERIYAKADAMBUR, TIRUTTANI T.K, THIRUVALLUR DIST','THIRUVALLUR','TAMIL NADU','631211','NO. 3/367, PALAIYAKARAR STREET, PERIYAKADAMBUR, TIRUTTANI T.K, THIRUVALLUR DIST','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9843817780',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP037','A',NULL,'A','MQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529037'),(5419,'560024529038','560024529038','560024529038','KEERTHANA S','Female','2007-07-03',NULL,NULL,'keerthana.s.24b@grt.edu.in',NULL,'A SIVAKUMAR',NULL,'COOLI','S VANISRI',NULL,'HOUSE WIFE','BABU S','9786817957','FASTER',NULL,'B+','INDIAN','HINDU','MBC','VANNIAKULA KSHATRIYA',NULL,NULL,'353917196317',NULL,'TAMIL','96000',NULL,NULL,'THIRUVALLUR','TAMIL NADU','602021','NO.113, BHARATHIYAR STREET, VILAPPAKKAM (TOWN), TIRUVALLUR (TK), TIRUVALLUR (DT)','THIRUVALLUR','TAMIL NADU','602021','NO.113, BHARATHIYAR STREET, VILAPPAKKAM (TOWN), TIRUVALLUR (TK), TIRUVALLUR (DT)','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-10-23','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','8682932811',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP038','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529038'),(5420,'560024529039','560024529039','560024529039','KEERTHANA V','Female','2006-11-08',NULL,NULL,'keerthana.v.24b@grt.edu.in',NULL,'P VENKATESAN',NULL,'BUS CONDUCTOR GOVT','V VALARMATHI',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'O-','INDIAN','HINDU','MBC','VANNIYAR',NULL,NULL,'225853953655',NULL,'TAMIL','72000',NULL,NULL,'RANIPET','TAMIL NADU','631003','NO.19/1A, RAMDOSS NAGAR, KAINOOR POST & VILLAGE, ARAKKONAM (TK),','RANIPET','TAMIL NADU','631003','NO.19/1A, RAMDOSS NAGAR, KAINOOR POST & VILLAGE, ARAKKONAM (TK),','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-10-22','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9047845787',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP039','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529039'),(5421,'560024529040','560024529040','560024529040','KEERTHIKA S','Female','2007-03-16',NULL,NULL,'keerthika.s.24b@grt.edu.in',NULL,'D SURESH',NULL,'LABOUR','S SIVAGAMI',NULL,'HOUSE WIFE','SHANKAR A','7824000422','LABOUR',NULL,'O+','INDIAN','HINDU','MBC','SOZHIA CHETTY',NULL,NULL,'881029322124',NULL,'TAMIL','108000',NULL,NULL,'RANIPET','TAMIL NADU','631003','NO.148, MIDDLE STREET, KEELANTHUR (TOWN), ARAKKONAM (TK), RANIPET','RANIPET','TAMIL NADU','631003','NO.148, MIDDLE STREET, KEELANTHUR (TOWN), ARAKKONAM (TK), RANIPET','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9360619451',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP040','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529040'),(5422,'560024529041','560024529041','560024529041','KIRAN P','Male','2007-07-30',NULL,NULL,'kiran.p.24b@grt.edu.in',NULL,'D PALANI MURUGAN',NULL,'DAILY WAVEGER','P GAYATHRI',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'AB+','INDIAN','HINDU','SC','ADI DRAVIDA',NULL,NULL,'332760107518',NULL,'TAMIL','96000',NULL,NULL,'RANIPET','TAMIL NADU','631004','NO.286, METTU NAGAR STREET, KEELKUPPAM (v), ARAKKONAM (TK), RANIPET (DT)','RANIPET','TAMIL NADU','631004','NO.286, METTU NAGAR STREET, KEELKUPPAM (v), ARAKKONAM (TK), RANIPET (DT)','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','8760267643',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP041','A',NULL,'A','MQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529041'),(5423,'560024529042','560024529042','560024529042','KOKILGANT S V','Male','2006-12-26',NULL,NULL,'kokilgant.sv.24b@grt.edu.in',NULL,'M SUNDARAMOORTHY',NULL,'COLLY','K G VANITHA',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'O+','INDIAN','HINDU','MBC','VANNIAKULA KSHATRIYA',NULL,NULL,'972980619503',NULL,'TAMIL','72000',NULL,NULL,'THIRUVALLUR','TAMIL NADU','631209','NO. 2/9, BIG STREET, PATTABIRAMAPURAM (V & P), TIRUTTANI T.K, THIRUVALLUR DIST, 631 209','THIRUVALLUR','TAMIL NADU','631209','NO. 2/9, BIG STREET, PATTABIRAMAPURAM (V & P), TIRUTTANI T.K, THIRUVALLUR DIST, 631 209','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-10-22','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9840048851',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP042','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529042'),(5424,'560024529043','560024529043','560024529043','LAKSHAN S','Male','2006-10-09',NULL,NULL,'lakshan.s.24b@grt.edu.in',NULL,'M SURESH BABU',NULL,'BUSNISS','S SUMATHY',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'B+','INDIAN','HINDU','BC','AGAMUDAYAR',NULL,NULL,'996508508558',NULL,'TAMIL','120000',NULL,NULL,'VELLORE','TAMIL NADU','632002','NO.269/A, 15TH STREET, GANDHINAGAR VILLAGE, VIRUPAKSHIPURAM \n (TOWN), VELLORE  (TK),  VELLORE (DT)','VELLORE','TAMIL NADU','632002','NO.269/A, 15TH STREET, GANDHINAGAR VILLAGE, VIRUPAKSHIPURAM \n (TOWN), VELLORE  (TK),  VELLORE (DT)','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','8778950051',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP043','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529043'),(5425,'560024529044','560024529044','560024529044','LOGA LAKSHMI R','Female','2007-02-23',NULL,NULL,'logalakshmi.r.24b@grt.edu.in',NULL,'K RAMU',NULL,'FARMER','R VANISRI',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'B+','INDIAN','HINDU','BC','VANIA CHETTIAR',NULL,NULL,'667429932791',NULL,'TAMIL','96000',NULL,NULL,'VELLORE','TAMIL NADU','631204','NO.210/2 THENNANDAI STREET, THOMOOR TOWN , THIRUVALLUR TK, THIRUVALLUR DT 631204','VELLORE','TAMIL NADU','631204','NO.210/2 THENNANDAI STREET, THOMOOR TOWN , THIRUVALLUR TK, THIRUVALLUR DT 631204','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9952703329',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP044','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529044'),(5426,'560024529045','560024529045','560024529045','LOGASRI K','Female','2006-08-16',NULL,NULL,'logasri.k.24b@grt.edu.in',NULL,'R KARTHIKEYAN',NULL,'DRIVER','K GOWTHAMI',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'B+','INDIAN','HINDU','MBC','VANNIYAR',NULL,NULL,'546890637120',NULL,'TAMIL','84000',NULL,NULL,'RANIPET','TAMIL NADU','632511','NO.1/11, ROAD STREET, PUDERI, ESAIYANUR VILLAGE, ARCOT TALUK, RANIPET DIST, PIN 632511','RANIPET','TAMIL NADU','632511','NO.1/11, ROAD STREET, PUDERI, ESAIYANUR VILLAGE, ARCOT TALUK, RANIPET DIST, PIN 632511','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-26','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','8778127349',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP045','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529045'),(5427,'560024529046','560024529046','560024529046','LOHITH O G','Male','2006-08-15',NULL,NULL,'lohith.og.24b@grt.edu.in',NULL,'O R GIRIDHARA',NULL,NULL,'O MUNI LAKSHMI',NULL,'HOUSE WIFE','JAYA PRATHAP A K','9342487050',NULL,NULL,'B+','INDIAN','HINDU','BC','IDIGA',NULL,NULL,'574001201806',NULL,'TELUGU','96000',NULL,NULL,'THIRUVALLUR','TAMIL NADU','631209','NO. 19/8, SHANMUGAM STREET, TIRUTTANI TALUK, THIRUVALLUR DIST, PIN 631 209','THIRUVALLUR','TAMIL NADU','631209','NO. 19/8, SHANMUGAM STREET, TIRUTTANI TALUK, THIRUVALLUR DIST, PIN 631 209','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9894065379',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP046','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529046'),(5428,'560024529047','560024529047','560024529047','MADHUMITHA E','Female','2005-09-29',NULL,NULL,'madhumitha.e.24b@grt.edu.in',NULL,'R EZHIL BABU',NULL,'ASST ENGINEER / TNEB','E THENMOZHI',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'O+','INDIAN','HINDU','SC','ADI DRAVIDA',NULL,NULL,'255598775888',NULL,'TAMIL','519720',NULL,NULL,'THIRUVALLUR','TAMIL NADU','631210','NO.3/100, PARASAKTHI NAGAR, THIRUVALANGADU, TIRUTTANI TALUK, THIRUVALLUR DIST, PIN 631210','THIRUVALLUR','TAMIL NADU','631210','NO.3/100, PARASAKTHI NAGAR, THIRUVALANGADU, TIRUTTANI TALUK, THIRUVALLUR DIST, PIN 631210','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9994347503',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP047','A',NULL,'A','MQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529047'),(5429,'560024529048','560024529048','560024529048','MANNARU SRI LOHITHA','Female','2007-07-10',NULL,NULL,'mannarusrilohitha.m.24b@grt.edu.in',NULL,'MANNARU RAMBABU',NULL,NULL,'NINDRA HIMABINDU',NULL,'TEACHER','NINDRA VIJAYDHAR','9985368494','AGRICUTURE',NULL,'O+','INDIAN','HINDU','BC','MUTRASI',NULL,NULL,'267224103046',NULL,'TELUGU',NULL,NULL,NULL,'OTHERS','ANDHRA PRADESH','517589','NO. 1/252 BAJANAGUDI STREET, RAJANAGARAM VILLAGE PICHATUR MANDAL, THIRUPATHI DIST, PIN 517 581.','OTHERS','ANDHRA PRADESH','517589','NO. 1/252 BAJANAGUDI STREET, RAJANAGARAM VILLAGE PICHATUR MANDAL, THIRUPATHI DIST, PIN 517 581.','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9346357735',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP048','A',NULL,'A','MQ','OTHERS / NON-TNHSc',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529048'),(5430,'560024529049','560024529049','560024529049','MOHAMED KULFINNAS','Female','2005-10-13',NULL,NULL,'mohamedkulfinnas.m.24b@grt.edu.in',NULL,'ALIKHAN MOHAMED FAROOK',NULL,'BUSNISS','ALIKHAN JARINA BEGUM',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'O+','INDIAN','ISLAM','BCM','LABBAIS',NULL,NULL,'651378132804',NULL,'TAMIL',NULL,NULL,NULL,'OTHERS','ANDHRA PRADESH','517501','NO. 13-2-240A, NAWABPETA, CHITOOR DIST,THIRUPATHI','OTHERS','ANDHRA PRADESH','517501','NO. 13-2-240A, NAWABPETA, CHITOOR DIST,THIRUPATHI','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9866253715',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP049','A',NULL,'A','MQ','OTHERS / NON-TNHSc',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529049'),(5431,'560024529050','560024529050','560024529050','MOHAMMED AIF J','Male','2006-10-26',NULL,NULL,'mohammedaif.j.24b@grt.edu.in',NULL,'A JAILABDEEN',NULL,'TAILOR','J SEYAD ALI SHAIMA',NULL,'HOUSE WIFE','KHAJA NAZURUDEEN H','7373135290','ENGINEER',NULL,'O+','INDIAN','ISLAM','BCM','LABBAIS',NULL,NULL,'561876836987',NULL,'TAMIL','96000',NULL,NULL,'THIRUVALLUR','TAMIL NADU','631209','NO. 14,THIRUVALLUVAR STREET, SUBRAMANIYA NAGAR, TIRUTTANI, THIRUVALLUR, PIN 631209','THIRUVALLUR','TAMIL NADU','631209','NO. 14,THIRUVALLUVAR STREET, SUBRAMANIYA NAGAR, TIRUTTANI, THIRUVALLUR, PIN 631209','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-10-22','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','8015578304',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP050','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529050'),(5432,'560024529051','560024529051','560024529051','MOSHITHA B','Female','2006-11-14',NULL,NULL,'moshitha.b.24b@grt.edu.in',NULL,'Mr. G BABU',NULL,'POLICE','K S SUJATHA',NULL,'HOUSE WIFE','SHARMILA J','8940021040','HOUSE WIFE',NULL,'B+','INDIAN','HINDU','BC','GAVARA',NULL,NULL,'955422055145',NULL,'TELUGU','1038780',NULL,NULL,'THIRUVALLUR','TAMIL NADU','602001','NO. 98, KOHINOOR AVENU, ICMR BACK SIDE TALUKA POLICE STATION THIRUVALLUR','THIRUVALLUR','TAMIL NADU','602001','NO. 98, KOHINOOR AVENU, ICMR BACK SIDE TALUKA POLICE STATION THIRUVALLUR','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-10-22','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9445202571',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP051','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529051'),(5433,'560024529052','560024529052','560024529052','NANDHINI V','Female','2007-03-12',NULL,NULL,'nandhini.v.24b@grt.edu.in',NULL,'K VINAYAGA MOORTHY',NULL,'FARMER','V VACHALA',NULL,'FARMER','PAVENDAN V','9632911389','PRIVATE SECTER',NULL,'A-','INDIAN','HINDU','MBC','VANNIYAR',NULL,NULL,'292882705021',NULL,'TAMIL','96000',NULL,NULL,'RANIPET','TAMIL NADU','631003','NO.167, PILLAIYAR KOVIL STREET, CHITTERI (V), ARAKKONAM (TK)','RANIPET','TAMIL NADU','631003','NO.167, PILLAIYAR KOVIL STREET, CHITTERI (V), ARAKKONAM (TK)','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9159207588',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP052','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529052'),(5434,'560024529053','560024529053','560024529053','NANTHAKUMAR G','Male','2007-09-17',NULL,NULL,'nanthakumar.g.24b@grt.edu.in',NULL,'T GANDHI',NULL,'BARBER','K DEVI',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'A+','INDIAN','HINDU','MBC','NAVITHAR',NULL,NULL,'267962584594',NULL,'TAMIL','72000',NULL,NULL,'THIRUVALLUR','TAMIL NADU','631302','NO.1/62, PILLAIYAR KOVIL STREET, SAGASRAPADMAPURAM, ERUMBI POST, R.K.PET T.K','THIRUVALLUR','TAMIL NADU','631302','NO.1/62, PILLAIYAR KOVIL STREET, SAGASRAPADMAPURAM, ERUMBI POST, R.K.PET T.K','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-10-22','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9944915822',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP053','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529053'),(5435,'560024529054','560024529054','560024529054','NEELAM I','Female','2005-11-03',NULL,NULL,'neelam.i.24b@grt.edu.in',NULL,'H INDAR',NULL,'BUSNISS','I SHAMU',NULL,'HOUSE WIFE','AAAA',NULL,'AAA',NULL,'O+','INDIAN','HINDU','OBC','MAS',NULL,NULL,'556724658142',NULL,'HINDI','72000',NULL,NULL,'THIRUVALLUR','TAMIL NADU','631202','NO. 2/42, BAZAAR STREET, ATHIMANJERIPET, KODIVALASA (V), PALLIPET (TK)','THIRUVALLUR','TAMIL NADU','631202','NO. 2/42, BAZAAR STREET, ATHIMANJERIPET, KODIVALASA (V), PALLIPET (TK)','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Left','2026-02-02 19:40:54','2026-02-02 19:44:02','9445368868',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP054','A',NULL,'A','MQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529054'),(5436,'560024529055','560024529055','560024529055','NISHA T','Female','2007-05-28',NULL,NULL,'nisha.t.24b@grt.edu.in',NULL,'S THIRUMAL',NULL,'COLLY','AMMU',NULL,'ANGANVADI HELIPER','SANTHOSH S','8870328813','STUDY',NULL,'B+','INDIAN','HINDU','MBC','VANNIYAR',NULL,NULL,'528665615726',NULL,'TAMIL','72000',NULL,NULL,'RANIPET','TAMIL NADU','632505','NO.96, METTU STREET, VEDANTHANGAL, KIZVEERANAM POST, NEMILI (TK), RANIPET DIST.','RANIPET','TAMIL NADU','632505','NO.96, METTU STREET, VEDANTHANGAL, KIZVEERANAM POST, NEMILI (TK), RANIPET DIST.','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-10-22','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','6369062378',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP055','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529055'),(5437,'560024529056','560024529056','560024529056','NIVETHA A','Female','2006-09-28',NULL,NULL,'nivetha.a.24b@grt.edu.in',NULL,'A AMARNATH',NULL,'CONIRACT SUPERVISOR','A KARUMARI',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'O+','INDIAN','HINDU','SC','ADI DRAVIDA',NULL,NULL,'746595786631',NULL,'TAMIL','72000',NULL,NULL,'THIRUVALLUR','TAMIL NADU','602001','NO. 157/2B, J.N. ROAD, GANDHIPURAM, THIRUVALLUR.','THIRUVALLUR','TAMIL NADU','602001','NO. 157/2B, J.N. ROAD, GANDHIPURAM, THIRUVALLUR.','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-10-22','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:02','9894174587',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP056','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529056'),(5438,'560024529057','560024529057','560024529057','NIZAM B','Male','2007-01-08',NULL,NULL,'nizam.b.24b@grt.edu.in',NULL,'P BALUMAGENDRAN',NULL,'FARMER','B JERINA',NULL,'HOUSE WIFE','SENTHAMSELVAM','9786335767','ELECTERICIAN',NULL,'A+','INDIAN','ISLAM','BCM','LABBAIS',NULL,NULL,'637864990911',NULL,'TAMIL','72000',NULL,NULL,'RANIPET','TAMIL NADU','631052','NO. 17, ARAKKONAM ROAD, PANAPAKKAM, NEMILI, RANIPET DIST.','RANIPET','TAMIL NADU','631052','NO. 17, ARAKKONAM ROAD, PANAPAKKAM, NEMILI, RANIPET DIST.','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-10-22','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:03','9360518203',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP057','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529057'),(5439,'560024529058','560024529058','560024529058','PAVITHRA M D','Female','2007-03-05',NULL,NULL,'pavithra.md.24b@grt.edu.in',NULL,'MEDHUR DAYALAN',NULL,'CARPENTER','D CHAMUNDESWARI',NULL,'HOUSE WIFE','RAJESH P','8688109986','EMPLOYEE',NULL,'A+','INDIAN','HINDU','BC','VISWABRAHMIN',NULL,NULL,'627958721477',NULL,'TELUGU','90000',NULL,NULL,'OTHERS','ANDHRA PRADESH','517587','NO.3-253/4A RAJU STREET PICHATUR CHITTOOR DIST','OTHERS','ANDHRA PRADESH','517587','NO.3-253/4A RAJU STREET PICHATUR CHITTOOR DIST','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:03','9985128286',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP058','A',NULL,'A','MQ','OTHERS / NON-TNHSc',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529058'),(5440,'560024529059','560024529059','560024529059','RAGUNATH V','Male','2006-12-15',NULL,NULL,'ragunath.v.24b@grt.edu.in',NULL,'R VELMURUGAN',NULL,'FARMER','V REVATHI',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'O+','INDIAN','HINDU','SC','ADI DRAVIDA',NULL,NULL,'294889514904',NULL,'TAMIL','48000',NULL,NULL,'ARIYALUR','TAMIL NADU','621803','NO.3/272, NORTH STREET, RATHAPURAM VILLAGE, ERAVANGUDI TOWN, UDAYARPALAYAM TALUK, ARIYALUR DIST, PIN 621803','ARIYALUR','TAMIL NADU','621803','NO.3/272, NORTH STREET, RATHAPURAM VILLAGE, ERAVANGUDI TOWN, UDAYARPALAYAM TALUK, ARIYALUR DIST, PIN 621803','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-10-23','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:03','8489457375',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP059','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529059'),(5441,'560024529060','560024529060','560024529060','RAMYA J','Female','2007-05-01',NULL,NULL,'ramya.j.24b@grt.edu.in',NULL,'K JANARTHANAN',NULL,'CARPENTER','J KOKILA',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'O+','INDIAN','HINDU','SC','ADI DRAVIDA',NULL,NULL,'596630268033',NULL,'TAMIL','84000',NULL,NULL,'VELLORE','TAMIL NADU','632113','NO. 7/12, NEW COLONY STREET, CHOLAVARAM TOWN, VELLORE TALUK, VELLORE DIST, PIN 632113','VELLORE','TAMIL NADU','632113','NO. 7/12, NEW COLONY STREET, CHOLAVARAM TOWN, VELLORE TALUK, VELLORE DIST, PIN 632113','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:03','7550353126',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP060','A',NULL,'A','MQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529060'),(5442,'560024529061','560024529061','560024529061','RAVIKUMAR M V','Male','2005-03-17',NULL,NULL,'ravikumar.mv.24b@grt.edu.in',NULL,'M V VISWANATHAN',NULL,'TEACHER','M V RAJESWARI',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'A+','INDIAN','HINDU','BC','SENGUNTHAR',NULL,NULL,'635272326034',NULL,'TAMIL',NULL,NULL,NULL,'THIRUVALLUR','TAMIL NADU','631202','NO.259, BIG STREET, ATHIMANJERI PETTAI, PALLIPET TALUK','THIRUVALLUR','TAMIL NADU','631202','NO.259, BIG STREET, ATHIMANJERI PETTAI, PALLIPET TALUK','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-10-24','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:03','9445187472',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP061','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529061'),(5443,'560024529062','560024529062','560024529062','RISHI S','Male','2007-06-25',NULL,NULL,'rishi.s.24b@grt.edu.in',NULL,'R SIVAKUMAR',NULL,'FARMER','S DEEPA',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'O+','INDIAN','HINDU','BC','AGAMUDAYAR',NULL,NULL,'720464439677',NULL,'TAMIL','72000',NULL,NULL,'THIRUVALLUR','TAMIL NADU','631302','NO.949, VINAYAKAR KOVIL STREET, VENKATAPURAM VILLAGE, VEDIYANGADU (POST) R.K PET TALUK.','THIRUVALLUR','TAMIL NADU','631302','NO.949, VINAYAKAR KOVIL STREET, VENKATAPURAM VILLAGE, VEDIYANGADU (POST) R.K PET TALUK.','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:03','6380021112',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP062','A',NULL,'A','MQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529062'),(5444,'560024529063','560024529063','560024529063','SANDHIYA K','Female','2006-12-06',NULL,NULL,'sandhiya.k.24b@grt.edu.in',NULL,'A KIRUBAKARAN',NULL,'TVS WORKER','K SARGUNA',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'A+','INDIAN','HINDU','SC','ADI DRAVIDA',NULL,NULL,'750792781264',NULL,'TAMIL','96000',NULL,NULL,'RANIPET','TAMIL NADU','632505','NO. 5/62 BAJANAI KOVIL STREET, PULIVALAM','RANIPET','TAMIL NADU','632505','NO. 5/62 BAJANAI KOVIL STREET, PULIVALAM','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:03','7904939213',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP063','A',NULL,'A','MQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529063'),(5445,'560024529064','560024529064','560024529064','SARANRAJ C','Male','2002-04-25',NULL,NULL,'saranraj.c.24b@grt.edu.in',NULL,'T CHANDIRAN',NULL,'COLLY','G GOVINDHAMMA',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'O+','INDIAN','HINDU','SC','ADI DRAVIDA',NULL,NULL,'219120746372',NULL,'TAMIL','96000',NULL,NULL,'THIRUVALLUR','TAMIL NADU','631207','NO. 587, IST STREET, KARIMBEDU COLONY PALLIPATTU T.K','THIRUVALLUR','TAMIL NADU','631207','NO. 587, IST STREET, KARIMBEDU COLONY PALLIPATTU T.K','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:03','6385921073',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP064','A',NULL,'A','MQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529064'),(5446,'560024529065','560024529065','560024529065','SARATHI K','Male','2006-05-30',NULL,NULL,'sarathi.k.24b@grt.edu.in',NULL,'E KAMALAKANNAN',NULL,'FARMER','K VENNILA',NULL,'HOUSE WIFE','PANDIYAN K','9786857512','FARMER',NULL,'O+','INDIAN','HINDU','MBC','VANNIAKULA KSHATRIYA',NULL,NULL,'963174721070',NULL,'TAMIL','72000',NULL,NULL,'RANIPET','TAMIL NADU','631102','NO. 44, ETHIRAJ STREET, SHOLINGHUR MOTUR','RANIPET','TAMIL NADU','631102','NO. 44, ETHIRAJ STREET, SHOLINGHUR MOTUR','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:03','8667368523',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP065','A',NULL,'A','MQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529065'),(5447,'560024529066','560024529066','560024529066','SARAVANAN S','Male','2007-03-07',NULL,NULL,'saravanan.s.24b@grt.edu.in',NULL,'B SAKTHIVEL',NULL,'COLLY','S USHA',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'B+','INDIAN','HINDU','BC','YADHAVA',NULL,NULL,'636217617018',NULL,'TAMIL','78000',NULL,NULL,'VILLUPURAM','TAMIL NADU','605802','NO. 13/4, EAST STREET, SIRPANANTHAN (V), VANAPUTAM (TK)','VILLUPURAM','TAMIL NADU','605802','NO. 13/4, EAST STREET, SIRPANANTHAN (V), VANAPUTAM (TK)','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-10-23','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:03','7299345896',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP066','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529066'),(5448,'560024529067','560024529067','560024529067','SHARMILA K','Female','2007-06-23',NULL,NULL,'sharmila.k.24b@grt.edu.in',NULL,'V KARUNAKARAN',NULL,'COLLY','K LATHA',NULL,'HOUSE WIFE','ANANDAN N','9159325877','PRIVATE',NULL,'A+','INDIAN','HINDU','BC','SENGUNTHAR',NULL,NULL,'788640348365',NULL,'TAMIL','108000',NULL,NULL,'THIRUVALLUR','TAMIL NADU','631302','NO. 4/694, KAMARAJAR STREET, SRI KALIKAPURAM, R.K.PET.','THIRUVALLUR','TAMIL NADU','631302','NO. 4/694, KAMARAJAR STREET, SRI KALIKAPURAM, R.K.PET.','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-10-22','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:03','9750672542',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP067','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529067'),(5449,'560024529068','560024529068','560024529068','SHARMILA V','Female','2006-10-20',NULL,NULL,'sharmila.v.24b@grt.edu.in',NULL,'S VETRIVELAN',NULL,'CLERK','J PARVATHI',NULL,'TEACHER',NULL,NULL,NULL,NULL,'A+','INDIAN','HINDU','MBC','MEENAVER',NULL,NULL,'514669813329',NULL,'TAMIL','96000',NULL,NULL,'THIRUVALLUR','TAMIL NADU','631209','NO. 65/22, BHARATHIYAR STREET, TIRUTTANI','THIRUVALLUR','TAMIL NADU','631209','NO. 65/22, BHARATHIYAR STREET, TIRUTTANI','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-10-22','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:03','8940099394',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP068','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529068'),(5450,'560024529069','560024529069','560024529069','SRI LEKHA N','Female','2006-11-05',NULL,NULL,'srilekha.n.24b@grt.edu.in',NULL,'S NAGARAJAN',NULL,'TNEB','N PORKODI',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'A+','INDIAN','HINDU','BC','SENGUNTHAR',NULL,NULL,'832515844736',NULL,'TAMIL','675072',NULL,NULL,'KANCHIPURAM','TAMIL NADU','631501','NO. 58/80A, NARAYANA PALAYAM STREET','KANCHIPURAM','TAMIL NADU','631501','NO. 58/80A, NARAYANA PALAYAM STREET','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:03','9994909433',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP069','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529069'),(5451,'560024529070','560024529070','560024529070','SUBASH Y','Male','2006-10-18',NULL,NULL,'subash.y.24b@grt.edu.in',NULL,'P YESUPATHAM',NULL,'PRIVATE JOB','Y BHAVANI',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'B+','INDIAN','CHRISTIAN','BC','ADI DRAVIDA',NULL,NULL,'941761940534',NULL,'TAMIL','84000',NULL,NULL,'RANIPET','TAMIL NADU','631102','NO.46 SCHOOL STREET PERUKANCHI COLONY SHOLINGAR TALUK RANIPET DIST PIN.631 102','RANIPET','TAMIL NADU','631102','NO.46 SCHOOL STREET PERUKANCHI COLONY SHOLINGAR TALUK RANIPET DIST PIN.631 102','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-10-22','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:03','9080139378',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP070','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529070'),(5452,'560024529071','560024529071','560024529071','SUJITHA J','Female','2006-11-09',NULL,NULL,'sujitha.j.24b@grt.edu.in',NULL,'A JAGAN',NULL,'FARMER','J LAKSHMI',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'O+','INDIAN','HINDU','SC','ADI DRAVIDA',NULL,NULL,'701237412525',NULL,'TAMIL','108000',NULL,NULL,'THIRUVALLUR','TAMIL NADU','631209','NO. 2/53, KOVIL STREET, VELANJERI VILLAGE POST, TIRUTTANI TALUK, TIRUVALLUR DIST','THIRUVALLUR','TAMIL NADU','631209','NO. 2/53, KOVIL STREET, VELANJERI VILLAGE POST, TIRUTTANI TALUK, TIRUVALLUR DIST','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-25','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:03','9677814402',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP071','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529071'),(5453,'560024529072','560024529072','560024529072','SUJITHA M','Female','2007-02-18',NULL,NULL,'sujitha.m.24b@grt.edu.in',NULL,'J MANIVEL PANDI',NULL,'COOLI','M RADHA MANI',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'O+','INDIAN','HINDU','BC','NADAR',NULL,NULL,'397412350803',NULL,'TAMIL','84000',NULL,NULL,'MADURAI','TAMIL NADU','625535','NO.11/5/9, KAMARAJAR STREET, ELUMALAI (V), PERAIYUR TALUK, MADURAI DIST.','MADURAI','TAMIL NADU','625535','NO.11/5/9, KAMARAJAR STREET, ELUMALAI (V), PERAIYUR TALUK, MADURAI DIST.','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-10-23','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:03','9940993933',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP072','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529072'),(5454,'560024529073','560024529073','560024529073','TAMILAZHAGI T','Female','2007-03-06',NULL,NULL,'tamilazhagi.t.24b@grt.edu.in',NULL,'Y THOLKAPPIAR',NULL,'DAILY WAVEGER','T PUNITHAVATHY',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'B+','INDIAN','CHRISTIAN','BC','ADI DRAVIDA',NULL,NULL,'886764080370',NULL,'TAMIL','96000',NULL,NULL,'THIRUVALLUR','TAMIL NADU','631203','NO.262, MADHA KOIL STREET, PATTARAI PERUMPUDHUR, THIRUVALLUR DIST','THIRUVALLUR','TAMIL NADU','631203','NO.262, MADHA KOIL STREET, PATTARAI PERUMPUDHUR, THIRUVALLUR DIST','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:03','9789473049',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP073','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529073'),(5455,'560024529074','560024529074','560024529074','THARUN B','Male','2007-07-07',NULL,NULL,'tharun.b.24b@grt.edu.in',NULL,'J BALAJI',NULL,'COLLI','S POORNIMA',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'B+','INDIAN','HINDU','SC','ADI DRAVIDA',NULL,NULL,'752313171399',NULL,'TAMIL',NULL,NULL,NULL,'THIRUVALLUR','TAMIL NADU','631206','NO. 3/83, MAARIYAMMAN KOVIL STREET, KRISHNASAMUDHARAM, TIRUTTANI (TK), THIRUVALLUR DIST','THIRUVALLUR','TAMIL NADU','631206','NO. 3/83, MAARIYAMMAN KOVIL STREET, KRISHNASAMUDHARAM, TIRUTTANI (TK), THIRUVALLUR DIST','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:03','9677598744',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP074','A',NULL,'A','MQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529074'),(5456,'560024529075','560024529075','560024529075','UDHAY KIRAN A M','Male','2006-12-31',NULL,NULL,'udhaykiran.am.24b@grt.edu.in',NULL,'M MURUGAN',NULL,'MEDICAL SHOP','M AMUDHA',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'B+','INDIAN','HINDU','BC','VANIYAR',NULL,NULL,'251951360775',NULL,'TAMIL','96000',NULL,NULL,'THIRUVALLUR','TAMIL NADU','631209','NO. 5 2ND CROSS STREET, AKKAIYA NAIDU STREET, THIRUTTANI, PIN 631 209','THIRUVALLUR','TAMIL NADU','631209','NO. 5 2ND CROSS STREET, AKKAIYA NAIDU STREET, THIRUTTANI, PIN 631 209','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-10-22','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:03','9944958208',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP075','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529075'),(5457,'560024529076','560024529076','560024529076','VAISHNAVI H','Female','2006-04-30',NULL,NULL,'vaishnavi.h.24b@grt.edu.in',NULL,'M HARIBABU',NULL,'ENGINEER','H NIRMALA',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'A+','INDIAN','HINDU','BC','AGAMUDAYAR',NULL,NULL,'960119760009',NULL,'TAMIL',NULL,NULL,NULL,'CHENNAI','TAMIL NADU','600080','PLOT NO. 998, 42TH STREET  KORATTUR, AMBATHUR','CHENNAI','TAMIL NADU','600080','PLOT NO. 998, 42TH STREET  KORATTUR, AMBATHUR','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:03','8220968094',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP076','A',NULL,'A','MQ','CBSE - INDIA',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529076'),(5458,'560024529077','560024529077','560024529077','VALLARASU Y','Male','2007-08-06',NULL,NULL,'vallarasu.y.24b@grt.edu.in',NULL,'M YESU',NULL,'FARMER','Y VIJAYA',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'A+','INDIAN','HINDU','SC','ADI DRAVIDA',NULL,NULL,'850609739702',NULL,'TAMIL','84000',NULL,NULL,'THIRUVALLUR','TAMIL NADU','631302','No:251, MARIYAMMAN KOVIL STREET, MEESARAKANDAPURAM COLONY, MEESARAKANDAPURAM, THIRUVALLUR -631302','THIRUVALLUR','TAMIL NADU','631302','No:251, MARIYAMMAN KOVIL STREET, MEESARAKANDAPURAM COLONY, MEESARAKANDAPURAM, THIRUVALLUR -631302','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-10-22','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:03','9787846091',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP077','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529077'),(5459,'560024529078','560024529078','560024529078','VARSHA M','Female','2007-06-15',NULL,NULL,'varsha.m.24b@grt.edu.in',NULL,'T MGR',NULL,'COOLI','M ABI',NULL,'HOUSE WIFE','VINODHRAJ P','9941560630','SALARIED',NULL,'A+','INDIAN','HINDU','SC','ADI DRAVIDA',NULL,NULL,'482674808678',NULL,'TAMIL','144000',NULL,NULL,'KRISHNAGIRI','TAMIL NADU','635109','NO. 818/15, MARUTHI NAGAR, ZUZUVADI, HOSUR, KRISHNAGIRI DIST, PIN 635109','KRISHNAGIRI','TAMIL NADU','635109','NO. 818/15, MARUTHI NAGAR, ZUZUVADI, HOSUR, KRISHNAGIRI DIST, PIN 635109','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:03','8553005471',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP078','A',NULL,'A','MQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529078'),(5460,'560024529079','560024529079','560024529079','VASANTH T','Male','2006-08-16',NULL,NULL,'vasanth.t.24b@grt.edu.in',NULL,'G THANGAMANI',NULL,'TNEB','M KALAIVANI',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'B+','INDIAN','HINDU','SC','ADI DRAVIDA',NULL,NULL,'552339429952',NULL,'TAMIL','600000',NULL,NULL,'RANIPET','TAMIL NADU','632401','NO.12 OLD TIRUTTANI ROAD ,OTTERI,RANIPET DIST.','RANIPET','TAMIL NADU','632401','NO.12 OLD TIRUTTANI ROAD ,OTTERI,RANIPET DIST.','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-25','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:03','9952782159',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP079','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529079'),(5461,'560024529080','560024529080','560024529080','VETRI G','Male','2006-10-12',NULL,NULL,'vetri.g.24b@grt.edu.in',NULL,'C GOPI',NULL,'MACHANIC','G SUNITHA',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'O+','INDIAN','HINDU','BC','YADHAVA',NULL,NULL,'374289025654',NULL,'TELUGU','42000',NULL,NULL,'THIRUVALLUR','TAMIL NADU','601102','NO.367 PERUMAL KOVIL STREET, ERANANKUPPAM, VADAMADURAI, UTHUKOTTAI,','THIRUVALLUR','TAMIL NADU','601102','NO.367 PERUMAL KOVIL STREET, ERANANKUPPAM, VADAMADURAI, UTHUKOTTAI,','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:03','7845756843',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP080','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529080'),(5462,'560024529081','560024529081','560024529081','VETRI VELU R','Male','2007-02-25',NULL,NULL,'vetrivelu.r.24b@grt.edu.in',NULL,'RAMAMOORTHI',NULL,NULL,'R RATHIKA',NULL,'HOUSE WIFE','CHINNARASU R','9884926593','PRODUCTION SUPERVISOR',NULL,'O+','INDIAN','HINDU','SC','ADI DRAVIDA',NULL,NULL,'454252752254',NULL,'TAMIL','108000',NULL,NULL,'THIRUVALLUR','TAMIL NADU','601204','NO.34, NGO NAGAR, PONNERI TALUK,','THIRUVALLUR','TAMIL NADU','601204','NO.34, NGO NAGAR, PONNERI TALUK,','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-10-23','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:03','9361542911',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP081','A',NULL,'A','MQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529081'),(5463,'560024529082','560024529082','560024529082','VIDHIYA V','Female','2006-12-20',NULL,NULL,'vidhiya.v.24b@grt.edu.in',NULL,'E VIJI',NULL,'FARMER','V JAYANTHI',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'O+','INDIAN','HINDU','SC','ADI DRAVIDA',NULL,NULL,'394833603322',NULL,'TAMIL','72000',NULL,NULL,'THIRUVALLUR','TAMIL NADU','631302','NO. 1/110A,DESAPALAYAM.ASWAREVANTHAPURAM POST,  R K PET.','THIRUVALLUR','TAMIL NADU','631302','NO. 1/110A,DESAPALAYAM.ASWAREVANTHAPURAM POST,  R K PET.','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:03','9787417556',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP082','A',NULL,'A','MQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529082'),(5464,'560024529084','560024529084','560024529084','VISHAL S','Male','2006-05-05',NULL,NULL,'vishal.s.24b@grt.edu.in',NULL,'R SURESH',NULL,'COLLI','S ESWARI',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'O+','INDIAN','HINDU','SC','ADI DRAVIDA',NULL,NULL,'801043804770',NULL,'TAMIL','84000',NULL,NULL,'THIRUVALLUR','TAMIL NADU','631209','NO. 2/274 TANK STREET, VELANJERI, TIRUTTANI T.K, THIRUVALLUR DIST,','THIRUVALLUR','TAMIL NADU','631209','NO. 2/274 TANK STREET, VELANJERI, TIRUTTANI T.K, THIRUVALLUR DIST,','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-11-27','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:03','7010728413',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP084','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529084'),(5465,'560024529085','560024529085','560024529085','VIYASH J','Male','2006-03-31',NULL,NULL,'viyash.j.24b@grt.edu.in',NULL,'G JAYAKUMAR',NULL,'COLLI','J MAHADEVI',NULL,'TEACHER',NULL,NULL,NULL,NULL,'AB+','INDIAN','HINDU','SC','ADI DRAVIDA',NULL,NULL,'626910594169',NULL,'TAMIL','72000',NULL,NULL,'THIRUVALLUR','TAMIL NADU','601201','NO.225B, PERUMAL KOVIL STREET, EGUVARPALAYAM, GUMMIDIPOONDI.','THIRUVALLUR','TAMIL NADU','601201','NO.225B, PERUMAL KOVIL STREET, EGUVARPALAYAM, GUMMIDIPOONDI.','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-10-23','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:03','7845181871',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP085','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529085'),(5466,'560024529086','560024529086','560024529086','YAMUNA DEVI V','Female','2007-06-01',NULL,NULL,'yamunadevi.v.24b@grt.edu.in',NULL,'K VINAYAKAM',NULL,'FLOWER SHOP','V NITHIYA',NULL,'HOUSE WIFE',NULL,NULL,NULL,NULL,'AB+','INDIAN','HINDU','SC','ADI DRAVIDA',NULL,NULL,'805475150693',NULL,'TAMIL','96000',NULL,NULL,'THIRUVALLUR','TAMIL NADU','631209','NO.15B, Dr RADHA KRISHNAN STREET, TIRUTTANI','THIRUVALLUR','TAMIL NADU','631209','NO.15B, Dr RADHA KRISHNAN STREET, TIRUTTANI','No','No','No','Regular',NULL,NULL,'Pharmacy','B.PHARM (BACHELOR OF PHARMACY)',5010,4,'ENGLISH',3,2,'2024-10-22','No',NULL,'Admitted','2026-02-02 19:40:54','2026-02-02 19:44:03','9444777819',NULL,NULL,NULL,NULL,NULL,'2024-2028','24BP086','A',NULL,'A','GQ','HSc - Tamil Nadu Govt',NULL,NULL,NULL,'BP307P,BP308P,BPCOMN3',NULL,NULL,NULL,NULL,NULL,NULL,'A','A',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Student','560024529086');
/*!40000 ALTER TABLE `student_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_memos`
--

DROP TABLE IF EXISTS `student_memos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_memos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci,
  `priority` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` date DEFAULT NULL,
  `courses` json DEFAULT NULL,
  `departments` json DEFAULT NULL,
  `students` json DEFAULT NULL,
  `semester` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `year` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `section` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_memos`
--

LOCK TABLES `student_memos` WRITE;
/*!40000 ALTER TABLE `student_memos` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_memos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_photos`
--

DROP TABLE IF EXISTS `student_photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_photos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `department` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `department_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `year` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `student_reg_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `student_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `photo_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_student_reg_no` (`student_reg_no`) USING BTREE,
  KEY `idx_department_code` (`department_code`) USING BTREE,
  KEY `idx_year` (`year`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_photos`
--

LOCK TABLES `student_photos` WRITE;
/*!40000 ALTER TABLE `student_photos` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_photos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `student_subject_consolidated_report`
--

DROP TABLE IF EXISTS `student_subject_consolidated_report`;
/*!50001 DROP VIEW IF EXISTS `student_subject_consolidated_report`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `student_subject_consolidated_report` AS SELECT 
 1 AS `Register_Number`,
 1 AS `Student_Name`,
 1 AS `Dept_Code`,
 1 AS `Dept_Name`,
 1 AS `Semester`,
 1 AS `Year`,
 1 AS `Regulation`,
 1 AS `Sub_Code`,
 1 AS `Sub_Name`,
 1 AS `assignment_percentage`,
 1 AS `unit_test_percentage`,
 1 AS `practical_percentage`,
 1 AS `attendance_percentage`,
 1 AS `final_consolidated_percentage`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `student_weekly_attendance`
--

DROP TABLE IF EXISTS `student_weekly_attendance`;
/*!50001 DROP VIEW IF EXISTS `student_weekly_attendance`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `student_weekly_attendance` AS SELECT 
 1 AS `date`,
 1 AS `month_no`,
 1 AS `month_name`,
 1 AS `week_no`,
 1 AS `dayorder`,
 1 AS `Dept_Code`,
 1 AS `Dept_Name`,
 1 AS `Semester`,
 1 AS `Regulation`,
 1 AS `Class`,
 1 AS `Register_Number`,
 1 AS `name`,
 1 AS `P1`,
 1 AS `P2`,
 1 AS `P3`,
 1 AS `P4`,
 1 AS `P5`,
 1 AS `P6`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `studentdetails`
--

DROP TABLE IF EXISTS `studentdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `studentdetails` (
  `id` int NOT NULL AUTO_INCREMENT,
  `BorrowerID` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `StudentName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `RegisterNumber` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Department` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Year` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Section` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Gender` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `DateOfBirth` date DEFAULT NULL,
  `JoiningDate` date DEFAULT NULL,
  `PhoneNumber` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `EmailID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `BorrowLimit` int DEFAULT '3',
  `Status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Remarks` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `PhotoPath` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studentdetails`
--

LOCK TABLES `studentdetails` WRITE;
/*!40000 ALTER TABLE `studentdetails` DISABLE KEYS */;
/*!40000 ALTER TABLE `studentdetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `studentfee`
--

DROP TABLE IF EXISTS `studentfee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `studentfee` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `roll_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `reg_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `student_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `department` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `sem` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `fee_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `amount` decimal(12,2) DEFAULT NULL,
  `status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `academic_year` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `security_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_roll_no` (`roll_no`) USING BTREE,
  KEY `idx_reg_no` (`reg_no`) USING BTREE,
  KEY `idx_status` (`status`) USING BTREE,
  KEY `idx_academic_year` (`academic_year`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studentfee`
--

LOCK TABLES `studentfee` WRITE;
/*!40000 ALTER TABLE `studentfee` DISABLE KEYS */;
/*!40000 ALTER TABLE `studentfee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `study_materials`
--

DROP TABLE IF EXISTS `study_materials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `study_materials` (
  `id` int NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `stored_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `file_path` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `file_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `file_size` bigint DEFAULT NULL,
  `material_type` enum('notes','question_paper','assignment','presentation','video','other') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'notes',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `course_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `dept_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `dept_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `semester` int NOT NULL,
  `year` int DEFAULT NULL,
  `regulation` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `section` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `subject_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `subject_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `uploaded_by` int DEFAULT NULL,
  `staff_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `staff_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_course` (`course_name`) USING BTREE,
  KEY `idx_dept` (`dept_code`) USING BTREE,
  KEY `idx_semester` (`semester`) USING BTREE,
  KEY `idx_regulation` (`regulation`) USING BTREE,
  KEY `idx_subject` (`subject_code`) USING BTREE,
  KEY `idx_created` (`created_at`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `study_materials`
--

LOCK TABLES `study_materials` WRITE;
/*!40000 ALTER TABLE `study_materials` DISABLE KEYS */;
/*!40000 ALTER TABLE `study_materials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subject_allocation`
--

DROP TABLE IF EXISTS `subject_allocation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subject_allocation` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Staff_Id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Staff_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Academic_Year` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sem_Type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Course_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub1_Code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub1_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub1_Dept_Code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub1_Dept_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub1_Semester` int DEFAULT NULL,
  `Sub1_Regulation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub2_Code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub2_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub2_Dept_Code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub2_Dept_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub2_Semester` int DEFAULT NULL,
  `Sub2_Regulation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub3_Code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub3_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub3_Dept_Code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub3_Dept_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub3_Semester` int DEFAULT NULL,
  `Sub3_Regulation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub4_Code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub4_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub4_Dept_Code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub4_Dept_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub4_Semester` int DEFAULT NULL,
  `Sub4_Regulation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub5_Code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub5_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub5_Dept_Code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub5_Dept_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub5_Semester` int DEFAULT NULL,
  `Sub5_Regulation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub6_Code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub6_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub6_Dept_Code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub6_Dept_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub6_Semester` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub6_Regulation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub7_Code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub7_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub7_Dept_Code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub7_Dept_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub7_Semester` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub7_Regulation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Created_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `Update_At` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `Dept_Code` int DEFAULT NULL,
  `Dept_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Semester` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Regulation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Class_Section` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subject_allocation`
--

LOCK TABLES `subject_allocation` WRITE;
/*!40000 ALTER TABLE `subject_allocation` DISABLE KEYS */;
/*!40000 ALTER TABLE `subject_allocation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `subject_consolidated_report`
--

DROP TABLE IF EXISTS `subject_consolidated_report`;
/*!50001 DROP VIEW IF EXISTS `subject_consolidated_report`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `subject_consolidated_report` AS SELECT 
 1 AS `Register_Number`,
 1 AS `Sub_Code`,
 1 AS `assignment_percentage`,
 1 AS `unit_test_percentage`,
 1 AS `practical_percentage`,
 1 AS `attendance_percentage`,
 1 AS `final_consolidated_percentage`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `subject_master`
--

DROP TABLE IF EXISTS `subject_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subject_master` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Dept_Code` int DEFAULT NULL,
  `Sub_Code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Semester` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Col_No` int DEFAULT NULL,
  `Sub_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Regulation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub_Type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Elective` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Elective_No` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `QPC` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Max_Mark` int DEFAULT NULL,
  `Pass_Mark` int DEFAULT NULL,
  `Internal_Max_Mark` int DEFAULT NULL,
  `Internal_Min_Mark` int DEFAULT NULL,
  `External_Max_Mark` int DEFAULT NULL,
  `External_Min_Mark` int DEFAULT NULL,
  `Total_Hours` int DEFAULT NULL,
  `Created_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `Updated_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=130309 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subject_master`
--

LOCK TABLES `subject_master` WRITE;
/*!40000 ALTER TABLE `subject_master` DISABLE KEYS */;
INSERT INTO `subject_master` VALUES (109,5010,'BP301T','3',NULL,'Pharmaceutical Organic Chemistry II','A','T','0','0',NULL,100,35,25,9,75,26,NULL,'2026-02-02 19:04:17','2026-02-02 19:07:09'),(110,5010,'BP302T','3',NULL,'Physical Pharmaceutics I','A','T','0','0',NULL,100,35,25,9,75,26,NULL,'2026-02-02 19:04:17','2026-02-02 19:07:09'),(111,5010,'BP303T','3',NULL,'Pharmaceutical  Microbiology','A','T','0','0',NULL,100,35,25,9,75,26,NULL,'2026-02-02 19:04:17','2026-02-02 19:07:09'),(112,5010,'BP304T','3',NULL,'Pharmaceutical Engineering','A','T','0','0',NULL,100,35,25,9,75,26,NULL,'2026-02-02 19:04:17','2026-02-02 19:07:09'),(113,5010,'BP305P','3',NULL,'Pharmaceutical Organic ChemistryII Practical','A','P','0','0',NULL,100,35,25,9,75,26,NULL,'2026-02-02 19:04:17','2026-02-02 19:07:09'),(114,5010,'BP306P','3',NULL,'PhysicalPharmaceuticsI Practical','A','P','0','0',NULL,100,35,25,9,75,26,NULL,'2026-02-02 19:04:17','2026-02-02 19:07:09'),(115,5010,'BP307P','3',NULL,'Pharmaceutical  Microbiology Practical','A','P','0','0',NULL,100,35,25,9,75,26,NULL,'2026-02-02 19:04:17','2026-02-02 19:07:09'),(116,5010,'BP308P','3',NULL,'Pharmaceutical Engineering Practical','A','P','0','0',NULL,100,35,25,9,75,26,NULL,'2026-02-02 19:04:17','2026-02-02 19:07:09'),(117,5010,'BPCOMN3','3',NULL,'Communication Skills','A','P','0','0',NULL,100,35,25,9,75,26,NULL,'2026-02-02 19:04:17','2026-02-02 19:07:09');
/*!40000 ALTER TABLE `subject_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subject_type_matser`
--

DROP TABLE IF EXISTS `subject_type_matser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subject_type_matser` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Sub_Type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subject_type_matser`
--

LOCK TABLES `subject_type_matser` WRITE;
/*!40000 ALTER TABLE `subject_type_matser` DISABLE KEYS */;
INSERT INTO `subject_type_matser` VALUES (1,'Theory','2025-11-16 12:37:37','2025-11-16 12:37:37'),(2,'Practical','2025-11-16 12:37:37','2025-11-16 12:37:37');
/*!40000 ALTER TABLE `subject_type_matser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tenant_data`
--

DROP TABLE IF EXISTS `tenant_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tenant_data` (
  `id` int NOT NULL AUTO_INCREMENT,
  `staff_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `staff_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Mobile` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Dept_Name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tenant_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tenant_data`
--

LOCK TABLES `tenant_data` WRITE;
/*!40000 ALTER TABLE `tenant_data` DISABLE KEYS */;
INSERT INTO `tenant_data` VALUES (1,'GRTIPER1005','UDHAYAKUMAR E','Telecaller','8148640704','B.PHARM (BACHELOR OF PHARMACY)',NULL,'2026-02-05 13:43:44'),(2,'GRTIPER1007','SUNDARASEELAN J','Telecaller','9952075450','B.PHARM (BACHELOR OF PHARMACY)',NULL,'2026-02-05 13:43:44'),(3,'GRTIPER1013','SOMANATHAN S S','Telecaller','9052419507','B.PHARM (BACHELOR OF PHARMACY)',NULL,'2026-02-05 13:43:44'),(4,'GRTIPER1014','MEENAKSHI K','Telecaller','9849614121','B.PHARM (BACHELOR OF PHARMACY)',NULL,'2026-02-05 13:43:44'),(5,'GRTIPER1017','SURESH KUMAR C A','Telecaller','9943060495','B.PHARM (BACHELOR OF PHARMACY)',NULL,'2026-02-05 13:43:44');
/*!40000 ALTER TABLE `tenant_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tenant_details`
--

DROP TABLE IF EXISTS `tenant_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tenant_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `staff_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `staff_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `staff_mobile` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `staff_department` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tenant_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `student_eqid` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `student_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `student_mobile` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parent_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parent_mobile` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `student_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `student_district` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `student_community` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `school_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `standard` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `student_reg_no` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `school_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `department` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `source` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `transport` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `hostel` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `remarks` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `reminder` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tenant_details`
--

LOCK TABLES `tenant_details` WRITE;
/*!40000 ALTER TABLE `tenant_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `tenant_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `total_caller_count`
--

DROP TABLE IF EXISTS `total_caller_count`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `total_caller_count` (
  `id` int NOT NULL AUTO_INCREMENT,
  `staff_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `staff_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Mobile` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Dept_Name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `caller_count` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `total_caller_count`
--

LOCK TABLES `total_caller_count` WRITE;
/*!40000 ALTER TABLE `total_caller_count` DISABLE KEYS */;
INSERT INTO `total_caller_count` VALUES (1,'GRTIPER1005','UDHAYAKUMAR E','Telecaller','8148640704','B.PHARM (BACHELOR OF PHARMACY)',0),(2,'GRTIPER1007','SUNDARASEELAN J','Telecaller','9952075450','B.PHARM (BACHELOR OF PHARMACY)',0),(3,'GRTIPER1013','SOMANATHAN S S','Telecaller','9052419507','B.PHARM (BACHELOR OF PHARMACY)',0),(4,'GRTIPER1014','MEENAKSHI K','Telecaller','9849614121','B.PHARM (BACHELOR OF PHARMACY)',0),(5,'GRTIPER1017','SURESH KUMAR C A','Telecaller','9943060495','B.PHARM (BACHELOR OF PHARMACY)',0);
/*!40000 ALTER TABLE `total_caller_count` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transfer_certificate`
--

DROP TABLE IF EXISTS `transfer_certificate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transfer_certificate` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tc_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `reg_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `father_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `caste` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nationality` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `religion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `sex` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `year` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `sem` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `date_of_admission` date DEFAULT NULL,
  `date_left` date DEFAULT NULL,
  `date_of_transfer` date DEFAULT NULL,
  `scholarship` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `course` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `qualified` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `medium` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Identification_of_Student` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `reason_for_leaving` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `conduct` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_reg_no` (`reg_no`) USING BTREE,
  KEY `idx_tc_no` (`tc_no`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transfer_certificate`
--

LOCK TABLES `transfer_certificate` WRITE;
/*!40000 ALTER TABLE `transfer_certificate` DISABLE KEYS */;
/*!40000 ALTER TABLE `transfer_certificate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transport_entry`
--

DROP TABLE IF EXISTS `transport_entry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transport_entry` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `entry_date` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `shift` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `bus_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `vehicle_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `capacity` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `registration_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fitness_expiry` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `permit_expiry` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `insurance_expiry` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `route_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `route_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `stage_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `stage_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `driver` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `driver_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `gate_entry_time` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `gate_exit_time` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `start_odo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `end_odo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `distance` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collected_amount` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fuel_issued` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fuel_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mileage` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `issues` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_entry_date` (`entry_date`) USING BTREE,
  KEY `idx_bus_number` (`bus_number`) USING BTREE,
  KEY `idx_route_name` (`route_name`) USING BTREE,
  KEY `idx_shift` (`shift`) USING BTREE,
  KEY `idx_driver` (`driver`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transport_entry`
--

LOCK TABLES `transport_entry` WRITE;
/*!40000 ALTER TABLE `transport_entry` DISABLE KEYS */;
/*!40000 ALTER TABLE `transport_entry` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unit_test_mark_entered`
--

DROP TABLE IF EXISTS `unit_test_mark_entered`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unit_test_mark_entered` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Register_Number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Course_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Dept_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Dept_Code` int DEFAULT NULL,
  `Semester` int DEFAULT NULL,
  `Regulation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Class_Section` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub_Code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Assessment_Type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Assessment_Date` date DEFAULT NULL,
  `Test_No` int DEFAULT NULL,
  `Max_Marks` int DEFAULT NULL,
  `Obtained_Mark` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Entered_By` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `ukn_assignment_mark` (`Register_Number`,`Sub_Code`,`Test_No`,`Assessment_Date`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unit_test_mark_entered`
--

LOCK TABLES `unit_test_mark_entered` WRITE;
/*!40000 ALTER TABLE `unit_test_mark_entered` DISABLE KEYS */;
/*!40000 ALTER TABLE `unit_test_mark_entered` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `unit_test_summary`
--

DROP TABLE IF EXISTS `unit_test_summary`;
/*!50001 DROP VIEW IF EXISTS `unit_test_summary`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `unit_test_summary` AS SELECT 
 1 AS `Register_Number`,
 1 AS `Sub_Code`,
 1 AS `total_unit_mark`,
 1 AS `total_unit_max`,
 1 AS `unit_test_percentage`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `univ_mark_entered`
--

DROP TABLE IF EXISTS `univ_mark_entered`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `univ_mark_entered` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Register_Number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Student_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Dept_Code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Semester` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Regulation` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Academic_Year` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub_Code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Sub_Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Internal_Mark` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `External_Mark` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Total_Mark` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Attempt_Level` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Entered_By` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `univ_mark_entered`
--

LOCK TABLES `univ_mark_entered` WRITE;
/*!40000 ALTER TABLE `univ_mark_entered` DISABLE KEYS */;
/*!40000 ALTER TABLE `univ_mark_entered` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_details`
--

DROP TABLE IF EXISTS `user_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `UserID` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `UPassword` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `UserName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Qualification` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Department` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Role` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Contact` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Subcode1` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Subcode2` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Subcode3` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Subcode4` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Subcode5` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Subcode6` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Batch1` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Batch2` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Batch3` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Batch4` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Batch5` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Batch6` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Section1` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Section2` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Section3` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Section4` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Section5` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Section6` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_details`
--

LOCK TABLES `user_details` WRITE;
/*!40000 ALTER TABLE `user_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `role` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `staff_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `staff_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `username` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `module_access` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`) USING BTREE,
  UNIQUE KEY `username` (`username`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (6,'Admin','Rajkumar','10000001','10000001','$2b$10$3Xru4DmF2QmQaTAEAMAZp.9pKTHqSoI1l7lQtpdHDXjE7EVvJjFbW','dashboard,file_user_creation,file_log_details,Academic_AcademicCalendar,Academic_Department,Academic_Subject,Academic_Class_Allocation,Academic_SubjectAllocation,Academic_TimeTable,Academic_StaffDetails,Academic_FeeDetails,Others_CourseMaster,Others_RegulationMaster,Others_SemesterMaster,Others_FeeMaster,Others_AcademicYearMaster,Others_DesignationMaster,Enquiry_StudentEnquiry,Enquiry_EnquiryReport,Application_QuotaAllocation,Application_ApplicationIssue,Application_StudentRegister,Application_AdmittedStudent,Application_PhotoPath,Application_AdmissionStatus,AdmissionReport_StudentProfile,AdmissionReport_GeneralForms,AdmissionReport_Ranking,AdmissionReport_AppIssueCoursewise,AdmissionReport_AppIssueConsolidate,AdmissionReport_AdmittedList,AdmissionReport_StudentMarkDetails,AdmissionReport_StudentReport,Certificates_EditTc,Certificates_Tc,Certificates_FeesEstimation,Certificates_CourseCompletion,Certificates_Conduct,Certificates_Bonafide,Attendance_AttendanceConfiguration,Attendance_DailyAttendance,Attendance_MarkedAttendance,Attendance_SpellAttendance,Assessment_AssessmentConfiguration,Assessment_AssignmentMarkEntry,Assessment_AssignmentMarkReport,Assessment_UnitTestMarkEntry,Assessment_UnitTestMarkReport,Assessment_PracticalMarkEntry,Assessment_PracticalMarkReport,Attendance_AttendanceReport,Data Submission_ExamSettings,Data Submission_HallDetails,Data Submission_TimeTable,Data Submission_NominalRoll,Data Submission_QPRequirement,Data Submission_StrengthList,Data Submission_CheckList,Exam Process_ExamGeneration,Exam Process_HallChart,Exam Process_SeatAllocation,Exam Process_DaywarStatement,Exam Process_DigitalNumbering,Exam Process_TheoryNameList,Exam Process_QPDistribution,Exam Process_EditExamProcess,Exam Process_DuplicateFinder,Practical/Model_PracticalPanel,Practical/Model_PracticalTimeTable,Practical/Model_PracticalNameList,Exam Forms_AbsenteesEntry,Exam Forms_Ex2Present,Exam Forms_Ex2Absent,Data Submission_ExamFee','2025-12-10 19:34:28','2025-12-10 19:34:28');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_roles`
--

DROP TABLE IF EXISTS `users_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_roles` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `role` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_roles`
--

LOCK TABLES `users_roles` WRITE;
/*!40000 ALTER TABLE `users_roles` DISABLE KEYS */;
INSERT INTO `users_roles` VALUES (20,'Admin','2026-02-03 21:33:15','2026-02-03 21:33:15'),(21,'Student','2026-02-03 21:33:15','2026-02-03 21:33:15'),(22,'Staff','2026-02-03 21:33:15','2026-02-03 21:33:15'),(23,'HOD','2026-02-03 21:33:15','2026-02-03 21:33:15'),(24,'Principal','2026-02-03 21:33:15','2026-02-03 21:33:15'),(25,'Accountant','2026-02-03 21:33:15','2026-02-03 21:33:15'),(26,'Librarian','2026-02-03 21:33:15','2026-02-03 21:33:15'),(27,'Admission Officer','2026-02-03 21:33:15','2026-02-03 21:33:15'),(28,'Examination Officer','2026-02-03 21:33:15','2026-02-03 21:33:15'),(29,'Placement Officer','2026-02-03 21:33:15','2026-02-03 21:33:15'),(30,'HR Manager','2026-02-03 21:33:15','2026-02-03 21:33:15'),(31,'Transport Manager','2026-02-03 21:33:15','2026-02-03 21:33:15'),(32,'Registrar','2026-02-03 21:33:15','2026-02-03 21:33:15'),(33,'Bursar','2026-02-03 21:33:15','2026-02-03 21:33:15'),(34,'Faculty','2026-02-03 21:33:15','2026-02-03 21:33:15'),(35,'Teaching Assistant','2026-02-03 21:33:15','2026-02-03 21:33:15'),(36,'Lab Technician','2026-02-03 21:33:15','2026-02-03 21:33:15'),(37,'Office Assistant','2026-02-03 21:33:15','2026-02-03 21:33:15'),(38,'Security Officer','2026-02-03 21:33:15','2026-02-03 21:33:15'),(39,'Support Staff','2026-02-03 21:33:15','2026-02-03 21:33:15');
/*!40000 ALTER TABLE `users_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicles`
--

DROP TABLE IF EXISTS `vehicles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicles` (
  `id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `vehicle_number` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `vehicle_type` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `registration_no` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `reg_expiry` date DEFAULT NULL,
  `seating_capacity` int DEFAULT NULL,
  `fuel_type` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `assigned_driver_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Active',
  `remarks` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `vehicle_number` (`vehicle_number`) USING BTREE,
  KEY `idx_vehicle_number` (`vehicle_number`) USING BTREE,
  KEY `idx_assigned_driver` (`assigned_driver_id`) USING BTREE,
  KEY `idx_status` (`status`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicles`
--

LOCK TABLES `vehicles` WRITE;
/*!40000 ALTER TABLE `vehicles` DISABLE KEYS */;
/*!40000 ALTER TABLE `vehicles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wish_audit_log`
--

DROP TABLE IF EXISTS `wish_audit_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wish_audit_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_type` enum('wish_created','wish_sent','notification_read','notification_archived','duplicate_attempt') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `triggered_by_id` int DEFAULT NULL,
  `triggered_by_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_student_id` int NOT NULL,
  `wish_id` int DEFAULT NULL,
  `notification_id` int DEFAULT NULL,
  `message` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_action_type` (`action_type`) USING BTREE,
  KEY `idx_target_student` (`target_student_id`) USING BTREE,
  KEY `idx_wish_id` (`wish_id`) USING BTREE,
  KEY `idx_created_at` (`created_at`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wish_audit_log`
--

LOCK TABLES `wish_audit_log` WRITE;
/*!40000 ALTER TABLE `wish_audit_log` DISABLE KEYS */;
INSERT INTO `wish_audit_log` VALUES (1,'wish_created',6,'Rajkumar',4530,1,1,'Wish sent to KUMARAN B G',NULL,NULL,'2026-02-03 13:25:42');
/*!40000 ALTER TABLE `wish_audit_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Current Database: `cms`
--

USE `cms`;

--
-- Final view structure for view `assessment_students`
--

/*!50001 DROP VIEW IF EXISTS `assessment_students`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `assessment_students` AS select `student_master`.`Register_Number` AS `Register_Number`,`student_master`.`Student_Name` AS `Student_Name`,`assessment_configuration`.`Course_Name` AS `Course_Name`,`assessment_configuration`.`Dept_Code` AS `Dept_Code`,`assessment_configuration`.`Dept_Name` AS `Dept_Name`,`assessment_configuration`.`Semester` AS `Semester`,`assessment_configuration`.`Regulation` AS `Regulation`,`assessment_configuration`.`Class_Section` AS `Class_Section`,`assessment_configuration`.`Sub_Code` AS `Sub_Code`,`assessment_configuration`.`Sub_Name` AS `Sub_Name`,`assessment_configuration`.`Assessment_Type` AS `Assessment_Type`,`assessment_configuration`.`Assessment_Date` AS `Assessment_Date`,`assessment_configuration`.`Max_Marks` AS `Max_Marks`,`assessment_configuration`.`Test_No` AS `Test_No`,`assessment_configuration`.`Experiment_Count` AS `Experiment_Count` from (`assessment_configuration` left join `student_master` on(((`assessment_configuration`.`Course_Name` = `student_master`.`Course_Name`) and (`assessment_configuration`.`Dept_Name` = `student_master`.`Dept_Name`) and (`assessment_configuration`.`Dept_Code` = `student_master`.`Dept_Code`) and (`assessment_configuration`.`Semester` = `student_master`.`Semester`) and (`assessment_configuration`.`Regulation` = `student_master`.`Regulation`) and (`assessment_configuration`.`Class_Section` = `student_master`.`Class`)))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `assignment_summary`
--

/*!50001 DROP VIEW IF EXISTS `assignment_summary`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `assignment_summary` AS select `assignment_mark_entered`.`Register_Number` AS `Register_Number`,`assignment_mark_entered`.`Sub_Code` AS `Sub_Code`,sum(`assignment_mark_entered`.`Obtained_Mark`) AS `total_assignment_mark`,sum(`assignment_mark_entered`.`Max_Marks`) AS `total_assignment_max`,round(((sum(`assignment_mark_entered`.`Obtained_Mark`) / sum(`assignment_mark_entered`.`Max_Marks`)) * 100),2) AS `assignment_percentage` from `assignment_mark_entered` group by `assignment_mark_entered`.`Register_Number`,`assignment_mark_entered`.`Sub_Code` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `attendance_summary`
--

/*!50001 DROP VIEW IF EXISTS `attendance_summary`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `attendance_summary` AS select `student_attendance_entry`.`Register_Number` AS `Register_Number`,`student_attendance_entry`.`Subject_Code` AS `Sub_Code`,count(0) AS `total_classes`,sum((case when (`student_attendance_entry`.`Att_Status` in ('P','OD','present','onduty')) then 1 else 0 end)) AS `present_days`,round(((sum((case when (`student_attendance_entry`.`Att_Status` in ('P','OD','present','onduty')) then 1 else 0 end)) / count(0)) * 100),2) AS `attendance_percentage` from `student_attendance_entry` group by `student_attendance_entry`.`Register_Number`,`student_attendance_entry`.`Subject_Code` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `available_quota_seat`
--

/*!50001 DROP VIEW IF EXISTS `available_quota_seat`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `available_quota_seat` AS select `cd`.`Dept_Code` AS `Dept_Code`,`cd`.`Dept_Name` AS `Dept_Name`,`cd`.`Course_Name` AS `Course_Name`,`cd`.`GoiQuota` AS `total_gq_seats`,`cd`.`MgtQuota` AS `total_mq_seats`,(`cd`.`GoiQuota` + `cd`.`MgtQuota`) AS `total_seats`,(select count(0) from `student_master` `sm1` where ((`sm1`.`Dept_Code` = `cd`.`Dept_Code`) and (`sm1`.`Course_Name` = `cd`.`Course_Name`) and (`sm1`.`Admission_Status` = 'Admitted') and (`sm1`.`Allocated_Quota` = 'GQ'))) AS `admitted_gq`,(select count(0) from `student_master` `sm2` where ((`sm2`.`Dept_Code` = `cd`.`Dept_Code`) and (`sm2`.`Course_Name` = `cd`.`Course_Name`) and (`sm2`.`Admission_Status` = 'Admitted') and (`sm2`.`Allocated_Quota` = 'MQ'))) AS `admitted_mq`,(`cd`.`GoiQuota` - (select count(0) from `student_master` `sm1` where ((`sm1`.`Dept_Code` = `cd`.`Dept_Code`) and (`sm1`.`Course_Name` = `cd`.`Course_Name`) and (`sm1`.`Admission_Status` = 'Admitted') and (`sm1`.`Allocated_Quota` = 'GQ')))) AS `available_gq`,(`cd`.`MgtQuota` - (select count(0) from `student_master` `sm2` where ((`sm2`.`Dept_Code` = `cd`.`Dept_Code`) and (`sm2`.`Course_Name` = `cd`.`Course_Name`) and (`sm2`.`Admission_Status` = 'Admitted') and (`sm2`.`Allocated_Quota` = 'MQ')))) AS `available_mq` from `course_details` `cd` order by `cd`.`Dept_Code`,`cd`.`Course_Name` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `dept_attendance_date_wise`
--

/*!50001 DROP VIEW IF EXISTS `dept_attendance_date_wise`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `dept_attendance_date_wise` AS select `a`.`Att_Date` AS `Att_Date`,`a`.`Dept_Code` AS `Dept_Code`,`a`.`Dept_Name` AS `Dept_Name`,count(distinct (case when (`a`.`Att_Status` in ('present','onDuty')) then `a`.`Register_Number` end)) AS `present_count`,count(distinct (case when (`a`.`Att_Status` in ('absent','medicalLeave')) then `a`.`Register_Number` end)) AS `absent_count`,`s`.`total_students` AS `total_students`,round(((count(distinct (case when (`a`.`Att_Status` in ('present','onDuty')) then `a`.`Register_Number` end)) * 100.0) / nullif(`s`.`total_students`,0)),0) AS `present_percentage`,round(((count(distinct (case when (`a`.`Att_Status` in ('absent','medicalLeave')) then `a`.`Register_Number` end)) * 100.0) / nullif(`s`.`total_students`,0)),0) AS `absent_percentage` from (`student_attendance_entry` `a` join (select `student_master`.`Dept_Code` AS `Dept_Code`,count(0) AS `total_students` from `student_master` where (`student_master`.`Admission_Status` = 'Admitted') group by `student_master`.`Dept_Code`) `s` on((`s`.`Dept_Code` = `a`.`Dept_Code`))) group by `a`.`Att_Date`,`a`.`Dept_Code`,`a`.`Dept_Name`,`s`.`total_students` order by `a`.`Att_Date` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `enquiry_call_notes_tenant`
--

/*!50001 DROP VIEW IF EXISTS `enquiry_call_notes_tenant`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `enquiry_call_notes_tenant` AS select `td`.`staff_name` AS `staff_name`,`td`.`staff_id` AS `staff_id`,`td`.`staff_mobile` AS `staff_mobile`,`td`.`staff_department` AS `staff_department`,`td`.`tenant_id` AS `tenant_id`,`td`.`student_eqid` AS `student_eqid`,`td`.`student_name` AS `student_name`,`td`.`student_mobile` AS `student_mobile`,`td`.`parent_name` AS `parent_name`,`td`.`parent_mobile` AS `parent_mobile`,`td`.`student_address` AS `student_address`,`td`.`student_district` AS `student_district`,`td`.`student_community` AS `student_community`,`td`.`school_type` AS `school_type`,`td`.`standard` AS `standard`,`td`.`student_reg_no` AS `student_reg_no`,`td`.`school_address` AS `school_address`,`td`.`department` AS `department`,`td`.`source` AS `source`,`td`.`transport` AS `transport`,`td`.`hostel` AS `hostel`,coalesce(`cnt`.`call_notes_count`,0) AS `call_notes_count`,`last_call`.`outcome` AS `last_status`,`last_call`.`next_follow_up` AS `next_follow_up`,`td`.`CreatedAt` AS `Created_Date` from ((`tenant_details` `td` left join (select `enquiry_call_notes`.`student_eqid` AS `student_eqid`,`enquiry_call_notes`.`tenant_id` AS `tenant_id`,count(0) AS `call_notes_count` from `enquiry_call_notes` where (`enquiry_call_notes`.`call_note_date` is not null) group by `enquiry_call_notes`.`student_eqid`,`enquiry_call_notes`.`tenant_id`) `cnt` on(((`td`.`student_eqid` = `cnt`.`student_eqid`) and (`td`.`staff_id` = `cnt`.`tenant_id`)))) left join (select `e1`.`student_eqid` AS `student_eqid`,`e1`.`tenant_id` AS `tenant_id`,`e1`.`outcome` AS `outcome`,`e1`.`next_follow_up` AS `next_follow_up` from (`enquiry_call_notes` `e1` join (select `enquiry_call_notes`.`student_eqid` AS `student_eqid`,`enquiry_call_notes`.`tenant_id` AS `tenant_id`,max(concat(`enquiry_call_notes`.`call_note_date`,' ',`enquiry_call_notes`.`call_note_time`)) AS `last_call_dt` from `enquiry_call_notes` where (`enquiry_call_notes`.`call_note_date` is not null) group by `enquiry_call_notes`.`student_eqid`,`enquiry_call_notes`.`tenant_id`) `e2` on(((`e1`.`student_eqid` = `e2`.`student_eqid`) and (`e1`.`tenant_id` = `e2`.`tenant_id`) and (concat(`e1`.`call_note_date`,' ',`e1`.`call_note_time`) = `e2`.`last_call_dt`))))) `last_call` on(((`td`.`student_eqid` = `last_call`.`student_eqid`) and (`td`.`staff_id` = `last_call`.`tenant_id`)))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `exam_seat_plan_report`
--

/*!50001 DROP VIEW IF EXISTS `exam_seat_plan_report`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `exam_seat_plan_report` AS select `eg`.`exam_date` AS `exam_date`,`ac`.`Day_Order` AS `day_order`,`eg`.`session` AS `session`,`eg`.`subject_code` AS `subject_code`,`eg`.`subject_name` AS `subject_name`,`eg`.`dept_code` AS `dept_code`,trim(replace(substring_index(`eg`.`dept_name`,'(',-(1)),')','')) AS `dept_name`,substring_index(`eg`.`dept_name`,' ',1) AS `dept_short`,`eg`.`semester` AS `semester`,`eg`.`regulation` AS `regulation`,`eg`.`hall_code` AS `hall_code`,`eg`.`hall_name` AS `hall_name`,`eg`.`col` AS `col`,char((`eg`.`col` + 65)) AS `col_letter`,row_number() OVER (PARTITION BY `eg`.`exam_date`,`eg`.`session`,`eg`.`hall_code`,`eg`.`col` ORDER BY `eg`.`seat_no` )  AS `seat_index`,concat(char((`eg`.`col` + 65)),row_number() OVER (PARTITION BY `eg`.`exam_date`,`eg`.`session`,`eg`.`hall_code`,`eg`.`col` ORDER BY `eg`.`seat_no` ) ) AS `seat_label`,`eg`.`register_number` AS `register_number`,`eg`.`student_name` AS `student_name` from (`exam_generation` `eg` left join `academic_calendar` `ac` on((`ac`.`Calendar_Date` = `eg`.`exam_date`))) order by `eg`.`exam_date`,`eg`.`session`,`eg`.`hall_code`,`eg`.`col`,row_number() OVER (PARTITION BY `eg`.`exam_date`,`eg`.`session`,`eg`.`hall_code`,`eg`.`col` ORDER BY `eg`.`seat_no` )  */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `exam_timetable_student_list`
--

/*!50001 DROP VIEW IF EXISTS `exam_timetable_student_list`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `exam_timetable_student_list` AS select `et`.`id` AS `exam_timetable_id`,`et`.`Exam_Date` AS `Exam_Date`,`et`.`Session` AS `Session`,`et`.`Dept_Code` AS `Dept_Code`,`et`.`QPC` AS `QPC`,`et`.`Regulation` AS `Regulation`,`et`.`Semester` AS `Semester`,`sm`.`Sub_Code` AS `Sub_Code`,`st`.`Register_Number` AS `Register_Number`,`st`.`Student_Name` AS `Student_Name`,'R' AS `Exam_Type` from ((`exam_timetable` `et` join `subject_master` `sm` on(((`sm`.`QPC` = `et`.`QPC`) and (`sm`.`Dept_Code` = `et`.`Dept_Code`)))) join `student_master` `st` on(((`st`.`Dept_Code` = `et`.`Dept_Code`) and (`st`.`Admission_Status` = 'Admitted') and (find_in_set(`sm`.`Sub_Code`,(case `et`.`Semester` when 1 then `st`.`S1` when 2 then `st`.`S2` when 3 then `st`.`S3` when 4 then `st`.`S4` when 5 then `st`.`S5` when 6 then `st`.`S6` when 7 then `st`.`S7` when 8 then `st`.`S8` end)) > 0)))) union all select `et`.`id` AS `exam_timetable_id`,`et`.`Exam_Date` AS `Exam_Date`,`et`.`Session` AS `Session`,`et`.`Dept_Code` AS `Dept_Code`,`et`.`QPC` AS `QPC`,`et`.`Regulation` AS `Regulation`,`et`.`Semester` AS `Semester`,`sm`.`Sub_Code` AS `Sub_Code`,`st`.`Register_Number` AS `Register_Number`,`st`.`Student_Name` AS `Student_Name`,'A' AS `Exam_Type` from ((`exam_timetable` `et` join `subject_master` `sm` on(((`sm`.`QPC` = `et`.`QPC`) and (`sm`.`Dept_Code` = `et`.`Dept_Code`)))) join `student_master` `st` on(((`st`.`Dept_Code` = `et`.`Dept_Code`) and (`st`.`Admission_Status` = 'Admitted') and (((`et`.`Semester` > 1) and (find_in_set(`sm`.`Sub_Code`,`st`.`S1`) > 0)) or ((`et`.`Semester` > 2) and (find_in_set(`sm`.`Sub_Code`,`st`.`S2`) > 0)) or ((`et`.`Semester` > 3) and (find_in_set(`sm`.`Sub_Code`,`st`.`S3`) > 0)) or ((`et`.`Semester` > 4) and (find_in_set(`sm`.`Sub_Code`,`st`.`S4`) > 0)) or ((`et`.`Semester` > 5) and (find_in_set(`sm`.`Sub_Code`,`st`.`S5`) > 0)) or ((`et`.`Semester` > 6) and (find_in_set(`sm`.`Sub_Code`,`st`.`S6`) > 0)) or ((`et`.`Semester` > 7) and (find_in_set(`sm`.`Sub_Code`,`st`.`S7`) > 0)))))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `overall_att_date_wise`
--

/*!50001 DROP VIEW IF EXISTS `overall_att_date_wise`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `overall_att_date_wise` AS select `d`.`Att_Date` AS `Att_Date`,sum(`d`.`present_count`) AS `total_present`,sum(`d`.`absent_count`) AS `total_absent`,sum(`d`.`total_students`) AS `total_students`,round(((sum(`d`.`present_count`) * 100.0) / nullif(sum(`d`.`total_students`),0)),0) AS `overall_present_percentage`,round(((sum(`d`.`absent_count`) * 100.0) / nullif(sum(`d`.`total_students`),0)),0) AS `overall_absent_percentage` from `dept_attendance_date_wise` `d` group by `d`.`Att_Date` order by `d`.`Att_Date` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `practical_summary`
--

/*!50001 DROP VIEW IF EXISTS `practical_summary`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `practical_summary` AS select `practical_mark`.`Register_Number` AS `Register_Number`,`practical_mark`.`Sub_Code` AS `Sub_Code`,((((((((((((((ifnull(`practical_mark`.`Obtained_Mark_Exp_1`,0) + ifnull(`practical_mark`.`Obtained_Mark_Exp_2`,0)) + ifnull(`practical_mark`.`Obtained_Mark_Exp_3`,0)) + ifnull(`practical_mark`.`Obtained_Mark_Exp_4`,0)) + ifnull(`practical_mark`.`Obtained_Mark_Exp_5`,0)) + ifnull(`practical_mark`.`Obtained_Mark_Exp_6`,0)) + ifnull(`practical_mark`.`Obtained_Mark_Exp_7`,0)) + ifnull(`practical_mark`.`Obtained_Mark_Exp_8`,0)) + ifnull(`practical_mark`.`Obtained_Mark_Exp_9`,0)) + ifnull(`practical_mark`.`Obtained_Mark_Exp_10`,0)) + ifnull(`practical_mark`.`Obtained_Mark_Exp_11`,0)) + ifnull(`practical_mark`.`Obtained_Mark_Exp_12`,0)) + ifnull(`practical_mark`.`Obtained_Mark_Exp_13`,0)) + ifnull(`practical_mark`.`Obtained_Mark_Exp_14`,0)) + ifnull(`practical_mark`.`Obtained_Mark_Exp_15`,0)) AS `practical_obtained`,`practical_mark`.`Max_Marks` AS `Max_Marks`,round(((((((ifnull(`practical_mark`.`Obtained_Mark_Exp_1`,0) + ifnull(`practical_mark`.`Obtained_Mark_Exp_2`,0)) + ifnull(`practical_mark`.`Obtained_Mark_Exp_3`,0)) + ifnull(`practical_mark`.`Obtained_Mark_Exp_4`,0)) + ifnull(`practical_mark`.`Obtained_Mark_Exp_5`,0)) / `practical_mark`.`Max_Marks`) * 100),2) AS `practical_percentage` from `practical_mark` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `staff_subject`
--

/*!50001 DROP VIEW IF EXISTS `staff_subject`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `staff_subject` AS select `subject_allocation`.`Staff_Id` AS `Staff_Id`,`subject_allocation`.`Staff_Name` AS `Staff_Name`,`subject_allocation`.`Academic_Year` AS `Academic_Year`,`subject_allocation`.`Course_Name` AS `Course_Name`,`subject_allocation`.`Dept_Code` AS `Dept_Code`,`subject_allocation`.`Dept_Name` AS `Dept_Name`,`subject_allocation`.`Semester` AS `Semester`,`subject_allocation`.`Regulation` AS `Regulation`,`subject_allocation`.`Sub1_Code` AS `Subject_Code`,`subject_allocation`.`Sub1_Name` AS `Subject_Name` from `subject_allocation` where (`subject_allocation`.`Sub1_Code` is not null) union all select `subject_allocation`.`Staff_Id` AS `Staff_Id`,`subject_allocation`.`Staff_Name` AS `Staff_Name`,`subject_allocation`.`Academic_Year` AS `Academic_Year`,`subject_allocation`.`Course_Name` AS `Course_Name`,`subject_allocation`.`Dept_Code` AS `Dept_Code`,`subject_allocation`.`Dept_Name` AS `Dept_Name`,`subject_allocation`.`Semester` AS `Semester`,`subject_allocation`.`Regulation` AS `Regulation`,`subject_allocation`.`Sub2_Code` AS `Subject_Code`,`subject_allocation`.`Sub2_Name` AS `Subject_Name` from `subject_allocation` where (`subject_allocation`.`Sub2_Code` is not null) union all select `subject_allocation`.`Staff_Id` AS `Staff_Id`,`subject_allocation`.`Staff_Name` AS `Staff_Name`,`subject_allocation`.`Academic_Year` AS `Academic_Year`,`subject_allocation`.`Course_Name` AS `Course_Name`,`subject_allocation`.`Dept_Code` AS `Dept_Code`,`subject_allocation`.`Dept_Name` AS `Dept_Name`,`subject_allocation`.`Semester` AS `Semester`,`subject_allocation`.`Regulation` AS `Regulation`,`subject_allocation`.`Sub3_Code` AS `Subject_Code`,`subject_allocation`.`Sub3_Name` AS `Subject_Name` from `subject_allocation` where (`subject_allocation`.`Sub3_Code` is not null) union all select `subject_allocation`.`Staff_Id` AS `Staff_Id`,`subject_allocation`.`Staff_Name` AS `Staff_Name`,`subject_allocation`.`Academic_Year` AS `Academic_Year`,`subject_allocation`.`Course_Name` AS `Course_Name`,`subject_allocation`.`Dept_Code` AS `Dept_Code`,`subject_allocation`.`Dept_Name` AS `Dept_Name`,`subject_allocation`.`Semester` AS `Semester`,`subject_allocation`.`Regulation` AS `Regulation`,`subject_allocation`.`Sub4_Code` AS `Subject_Code`,`subject_allocation`.`Sub4_Name` AS `Subject_Name` from `subject_allocation` where (`subject_allocation`.`Sub4_Code` is not null) union all select `subject_allocation`.`Staff_Id` AS `Staff_Id`,`subject_allocation`.`Staff_Name` AS `Staff_Name`,`subject_allocation`.`Academic_Year` AS `Academic_Year`,`subject_allocation`.`Course_Name` AS `Course_Name`,`subject_allocation`.`Dept_Code` AS `Dept_Code`,`subject_allocation`.`Dept_Name` AS `Dept_Name`,`subject_allocation`.`Semester` AS `Semester`,`subject_allocation`.`Regulation` AS `Regulation`,`subject_allocation`.`Sub5_Code` AS `Subject_Code`,`subject_allocation`.`Sub5_Name` AS `Subject_Name` from `subject_allocation` where (`subject_allocation`.`Sub5_Code` is not null) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `student_attendance_view`
--

/*!50001 DROP VIEW IF EXISTS `student_attendance_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `student_attendance_view` AS select `s`.`Att_Date` AS `date`,`s`.`Day_Order` AS `dayorder`,`s`.`Dept_Code` AS `dept_code`,`s`.`Dept_Name` AS `dept_name`,`s`.`Semester` AS `semester`,`s`.`Regulation` AS `regulation`,`s`.`Class` AS `class`,`s`.`Register_Number` AS `register_number`,coalesce(`m`.`Student_Name`,'') AS `name`,max((case when (`s`.`Period` = 1) then (case when (`s`.`Att_Status` = 'onduty') then 'OD' when (`s`.`Att_Status` = 'absent') then 'A' when (`s`.`Att_Status` = 'present') then 'P' when (`s`.`Att_Status` = 'medical leave') then 'ML' end) end)) AS `1`,max((case when (`s`.`Period` = 2) then (case when (`s`.`Att_Status` = 'onduty') then 'OD' when (`s`.`Att_Status` = 'absent') then 'A' when (`s`.`Att_Status` = 'present') then 'P' when (`s`.`Att_Status` = 'medical leave') then 'ML' end) end)) AS `2`,max((case when (`s`.`Period` = 3) then (case when (`s`.`Att_Status` = 'onduty') then 'OD' when (`s`.`Att_Status` = 'absent') then 'A' when (`s`.`Att_Status` = 'present') then 'P' when (`s`.`Att_Status` = 'medical leave') then 'ML' end) end)) AS `3`,max((case when (`s`.`Period` = 4) then (case when (`s`.`Att_Status` = 'onduty') then 'OD' when (`s`.`Att_Status` = 'absent') then 'A' when (`s`.`Att_Status` = 'present') then 'P' when (`s`.`Att_Status` = 'medical leave') then 'ML' end) end)) AS `4`,max((case when (`s`.`Period` = 5) then (case when (`s`.`Att_Status` = 'onduty') then 'OD' when (`s`.`Att_Status` = 'absent') then 'A' when (`s`.`Att_Status` = 'present') then 'P' when (`s`.`Att_Status` = 'medical leave') then 'ML' end) end)) AS `5`,max((case when (`s`.`Period` = 6) then (case when (`s`.`Att_Status` = 'onduty') then 'OD' when (`s`.`Att_Status` = 'absent') then 'A' when (`s`.`Att_Status` = 'present') then 'P' when (`s`.`Att_Status` = 'medical leave') then 'ML' end) end)) AS `6` from (`student_attendance_entry` `s` left join `student_master` `m` on((`s`.`Register_Number` = `m`.`Register_Number`))) group by `s`.`Att_Date`,`s`.`Day_Order`,`s`.`Dept_Code`,`s`.`Dept_Name`,`s`.`Semester`,`s`.`Regulation`,`s`.`Class`,`s`.`Register_Number`,`m`.`Student_Name` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `student_subject_consolidated_report`
--

/*!50001 DROP VIEW IF EXISTS `student_subject_consolidated_report`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `student_subject_consolidated_report` AS select `s`.`Register_Number` AS `Register_Number`,`s`.`Student_Name` AS `Student_Name`,`s`.`Dept_Code` AS `Dept_Code`,`d`.`Dept_Name` AS `Dept_Name`,`s`.`Semester` AS `Semester`,`s`.`Year` AS `Year`,`s`.`Regulation` AS `Regulation`,`sub`.`Sub_Code` AS `Sub_Code`,`sub`.`Sub_Name` AS `Sub_Name`,`c`.`assignment_percentage` AS `assignment_percentage`,`c`.`unit_test_percentage` AS `unit_test_percentage`,`c`.`practical_percentage` AS `practical_percentage`,`c`.`attendance_percentage` AS `attendance_percentage`,`c`.`final_consolidated_percentage` AS `final_consolidated_percentage` from (((`subject_consolidated_report` `c` join `student_master` `s` on((`c`.`Register_Number` = `s`.`Register_Number`))) join `subject_master` `sub` on((`c`.`Sub_Code` = `sub`.`Sub_Code`))) join `course_details` `d` on((`s`.`Dept_Code` = `d`.`Dept_Code`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `student_weekly_attendance`
--

/*!50001 DROP VIEW IF EXISTS `student_weekly_attendance`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `student_weekly_attendance` AS select `s`.`Att_Date` AS `date`,month(`s`.`Att_Date`) AS `month_no`,monthname(`s`.`Att_Date`) AS `month_name`,ceiling((dayofmonth(`s`.`Att_Date`) / 7)) AS `week_no`,`s`.`Day_Order` AS `dayorder`,`s`.`Dept_Code` AS `Dept_Code`,`s`.`Dept_Name` AS `Dept_Name`,`s`.`Semester` AS `Semester`,`s`.`Regulation` AS `Regulation`,`s`.`Class` AS `Class`,`s`.`Register_Number` AS `Register_Number`,coalesce(`m`.`Student_Name`,'') AS `name`,max((case when (`s`.`Period` = 1) then (case when (`s`.`Att_Status` = 'onduty') then 'OD' when (`s`.`Att_Status` = 'absent') then 'A' when (`s`.`Att_Status` = 'present') then 'P' when (`s`.`Att_Status` = 'medical leave') then 'ML' end) end)) AS `P1`,max((case when (`s`.`Period` = 2) then (case when (`s`.`Att_Status` = 'onduty') then 'OD' when (`s`.`Att_Status` = 'absent') then 'A' when (`s`.`Att_Status` = 'present') then 'P' when (`s`.`Att_Status` = 'medical leave') then 'ML' end) end)) AS `P2`,max((case when (`s`.`Period` = 3) then (case when (`s`.`Att_Status` = 'onduty') then 'OD' when (`s`.`Att_Status` = 'absent') then 'A' when (`s`.`Att_Status` = 'present') then 'P' when (`s`.`Att_Status` = 'medical leave') then 'ML' end) end)) AS `P3`,max((case when (`s`.`Period` = 4) then (case when (`s`.`Att_Status` = 'onduty') then 'OD' when (`s`.`Att_Status` = 'absent') then 'A' when (`s`.`Att_Status` = 'present') then 'P' when (`s`.`Att_Status` = 'medical leave') then 'ML' end) end)) AS `P4`,max((case when (`s`.`Period` = 5) then (case when (`s`.`Att_Status` = 'onduty') then 'OD' when (`s`.`Att_Status` = 'absent') then 'A' when (`s`.`Att_Status` = 'present') then 'P' when (`s`.`Att_Status` = 'medical leave') then 'ML' end) end)) AS `P5`,max((case when (`s`.`Period` = 6) then (case when (`s`.`Att_Status` = 'onduty') then 'OD' when (`s`.`Att_Status` = 'absent') then 'A' when (`s`.`Att_Status` = 'present') then 'P' when (`s`.`Att_Status` = 'medical leave') then 'ML' end) end)) AS `P6` from (`student_attendance_entry` `s` left join `student_master` `m` on((`s`.`Register_Number` = `m`.`Register_Number`))) group by `s`.`Att_Date`,month(`s`.`Att_Date`),monthname(`s`.`Att_Date`),ceiling((dayofmonth(`s`.`Att_Date`) / 7)),`s`.`Day_Order`,`s`.`Dept_Code`,`s`.`Dept_Name`,`s`.`Semester`,`s`.`Regulation`,`s`.`Class`,`s`.`Register_Number`,`m`.`Student_Name` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `subject_consolidated_report`
--

/*!50001 DROP VIEW IF EXISTS `subject_consolidated_report`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `subject_consolidated_report` AS select `a`.`Register_Number` AS `Register_Number`,`a`.`Sub_Code` AS `Sub_Code`,ifnull(`a`.`assignment_percentage`,0) AS `assignment_percentage`,ifnull(`u`.`unit_test_percentage`,0) AS `unit_test_percentage`,ifnull(`p`.`practical_percentage`,0) AS `practical_percentage`,ifnull(`atd`.`attendance_percentage`,0) AS `attendance_percentage`,round(((((ifnull(`a`.`assignment_percentage`,0) * 0.20) + (ifnull(`u`.`unit_test_percentage`,0) * 0.30)) + (ifnull(`p`.`practical_percentage`,0) * 0.30)) + (ifnull(`atd`.`attendance_percentage`,0) * 0.20)),2) AS `final_consolidated_percentage` from (((`assignment_summary` `a` left join `unit_test_summary` `u` on(((`a`.`Register_Number` = `u`.`Register_Number`) and (`a`.`Sub_Code` = `u`.`Sub_Code`)))) left join `practical_summary` `p` on(((`a`.`Register_Number` = `p`.`Register_Number`) and (`a`.`Sub_Code` = `p`.`Sub_Code`)))) left join `attendance_summary` `atd` on(((`a`.`Register_Number` = `atd`.`Register_Number`) and (`a`.`Sub_Code` = `atd`.`Sub_Code`)))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `unit_test_summary`
--

/*!50001 DROP VIEW IF EXISTS `unit_test_summary`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `unit_test_summary` AS select `unit_test_mark_entered`.`Register_Number` AS `Register_Number`,`unit_test_mark_entered`.`Sub_Code` AS `Sub_Code`,sum(`unit_test_mark_entered`.`Obtained_Mark`) AS `total_unit_mark`,sum(`unit_test_mark_entered`.`Max_Marks`) AS `total_unit_max`,round(((sum(`unit_test_mark_entered`.`Obtained_Mark`) / sum(`unit_test_mark_entered`.`Max_Marks`)) * 100),2) AS `unit_test_percentage` from `unit_test_mark_entered` group by `unit_test_mark_entered`.`Register_Number`,`unit_test_mark_entered`.`Sub_Code` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-05 14:27:23
