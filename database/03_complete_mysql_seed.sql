-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: studentbank_db
-- ------------------------------------------------------
-- Server version	8.0.46

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
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `account_number` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint NOT NULL,
  `account_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'STUDENT_WALLET',
  `balance` decimal(12,2) NOT NULL DEFAULT '0.00',
  `currency` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'INR',
  `upi_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `qr_code_token` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `daily_spend_limit` decimal(12,2) NOT NULL DEFAULT '5000.00',
  `monthly_spend_limit` decimal(12,2) NOT NULL DEFAULT '30000.00',
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `account_number` (`account_number`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `upi_id` (`upi_id`),
  UNIQUE KEY `qr_code_token` (`qr_code_token`),
  KEY `idx_account_num` (`account_number`),
  KEY `idx_upi_id` (`upi_id`),
  CONSTRAINT `fk_account_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_positive_balance` CHECK ((`balance` >= 0.00))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` (`id`, `account_number`, `user_id`, `account_type`, `balance`, `currency`, `upi_id`, `qr_code_token`, `daily_spend_limit`, `monthly_spend_limit`, `status`, `created_at`, `updated_at`) VALUES (1,'SB20268849102',1,'STUDENT_WALLET',4850.00,'INR','rahul.sharma@studentbank','032fbccc-99e5-4a81-b5fb-00d6e8dc1bb2',5000.00,30000.00,'ACTIVE','2026-11-21 13:01:56','2026-11-21 13:01:56');
INSERT INTO `accounts` (`id`, `account_number`, `user_id`, `account_type`, `balance`, `currency`, `upi_id`, `qr_code_token`, `daily_spend_limit`, `monthly_spend_limit`, `status`, `created_at`, `updated_at`) VALUES (2,'SB20267739182',2,'STUDENT_WALLET',5200.00,'INR','priya.patel@studentbank','cb73ac7a-4ef5-4222-81b1-1a09646ba6de',5000.00,30000.00,'ACTIVE','2026-11-21 13:01:57','2026-11-21 13:01:57');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin_users`
--

DROP TABLE IF EXISTS `admin_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `admin_level` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'MODERATOR',
  `department` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'FinTech Oversight',
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `fk_admin_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_users`
--

LOCK TABLES `admin_users` WRITE;
/*!40000 ALTER TABLE `admin_users` DISABLE KEYS */;
/*!40000 ALTER TABLE `admin_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_history`
--

DROP TABLE IF EXISTS `chat_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_history` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `session_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_prompt` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `ai_response` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokens_used` int DEFAULT '0',
  `intent_detected` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_chat_user_session` (`user_id`,`session_id`),
  CONSTRAINT `fk_chat_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_history`
--

LOCK TABLES `chat_history` WRITE;
/*!40000 ALTER TABLE `chat_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expense_categories`
--

DROP TABLE IF EXISTS `expense_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expense_categories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Tag',
  `color_hex` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#2563EB',
  `is_custom` tinyint(1) NOT NULL DEFAULT '0',
  `user_id` bigint DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `fk_category_user` (`user_id`),
  KEY `idx_cat_code` (`code`),
  CONSTRAINT `fk_category_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expense_categories`
--

LOCK TABLES `expense_categories` WRITE;
/*!40000 ALTER TABLE `expense_categories` DISABLE KEYS */;
INSERT INTO `expense_categories` (`id`, `name`, `code`, `icon`, `color_hex`, `is_custom`, `user_id`, `created_at`) VALUES (1,'Food & Canteen','FOOD_CANTEEN','Utensils','#F59E0B',0,NULL,'2026-11-19 11:51:23');
INSERT INTO `expense_categories` (`id`, `name`, `code`, `icon`, `color_hex`, `is_custom`, `user_id`, `created_at`) VALUES (2,'Books & Stationary','BOOKS_STATIONARY','BookOpen','#3B82F6',0,NULL,'2026-11-19 11:51:23');
INSERT INTO `expense_categories` (`id`, `name`, `code`, `icon`, `color_hex`, `is_custom`, `user_id`, `created_at`) VALUES (3,'College & Exam Fees','COLLEGE_FEES','GraduationCap','#10B981',0,NULL,'2026-11-19 11:51:23');
INSERT INTO `expense_categories` (`id`, `name`, `code`, `icon`, `color_hex`, `is_custom`, `user_id`, `created_at`) VALUES (4,'Hostel & PG Rent','HOSTEL_RENT','Home','#6366F1',0,NULL,'2026-11-19 11:51:23');
INSERT INTO `expense_categories` (`id`, `name`, `code`, `icon`, `color_hex`, `is_custom`, `user_id`, `created_at`) VALUES (5,'Travel & Metro','TRAVEL_METRO','Bus','#EC4899',0,NULL,'2026-11-19 11:51:23');
INSERT INTO `expense_categories` (`id`, `name`, `code`, `icon`, `color_hex`, `is_custom`, `user_id`, `created_at`) VALUES (6,'Subscriptions & Tech','SUBSCRIPTIONS','Laptop','#8B5CF6',0,NULL,'2026-11-19 11:51:23');
INSERT INTO `expense_categories` (`id`, `name`, `code`, `icon`, `color_hex`, `is_custom`, `user_id`, `created_at`) VALUES (7,'Entertainment & Outings','ENTERTAINMENT','Film','#EF4444',0,NULL,'2026-11-19 11:51:23');
INSERT INTO `expense_categories` (`id`, `name`, `code`, `icon`, `color_hex`, `is_custom`, `user_id`, `created_at`) VALUES (8,'Healthcare & Medical','HEALTHCARE','HeartPulse','#14B8A6',0,NULL,'2026-11-19 11:51:23');
INSERT INTO `expense_categories` (`id`, `name`, `code`, `icon`, `color_hex`, `is_custom`, `user_id`, `created_at`) VALUES (9,'Personal Care','PERSONAL_CARE','Smile','#84CC16',0,NULL,'2026-11-19 11:51:23');
INSERT INTO `expense_categories` (`id`, `name`, `code`, `icon`, `color_hex`, `is_custom`, `user_id`, `created_at`) VALUES (10,'General & Miscellaneous','MISCELLANEOUS','Tag','#64748B',0,NULL,'2026-11-19 11:51:23');
/*!40000 ALTER TABLE `expense_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fee_reminders`
--

DROP TABLE IF EXISTS `fee_reminders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fee_reminders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `fee_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_amount` decimal(12,2) NOT NULL,
  `paid_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `due_date` date NOT NULL,
  `academic_term` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `receipt_number` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_fee_user` (`user_id`,`status`),
  CONSTRAINT `fk_fee_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fee_reminders`
--

LOCK TABLES `fee_reminders` WRITE;
/*!40000 ALTER TABLE `fee_reminders` DISABLE KEYS */;
INSERT INTO `fee_reminders` (`id`, `user_id`, `fee_type`, `title`, `total_amount`, `paid_amount`, `due_date`, `academic_term`, `status`, `receipt_number`, `created_at`, `updated_at`) VALUES (1,1,'TUITION','Semester 5 Tuition Fee',45000.00,0.00,'2026-12-16','Semester 5 (2026-27)','PENDING',NULL,'2026-11-21 13:01:56','2026-11-21 13:01:56');
INSERT INTO `fee_reminders` (`id`, `user_id`, `fee_type`, `title`, `total_amount`, `paid_amount`, `due_date`, `academic_term`, `status`, `receipt_number`, `created_at`, `updated_at`) VALUES (2,1,'HOSTEL','Hostel & Mess Charges',24000.00,24000.00,'2026-11-11','Semester 5 (2026-27)','PAID',NULL,'2026-11-21 13:01:56','2026-11-21 13:01:56');
INSERT INTO `fee_reminders` (`id`, `user_id`, `fee_type`, `title`, `total_amount`, `paid_amount`, `due_date`, `academic_term`, `status`, `receipt_number`, `created_at`, `updated_at`) VALUES (3,1,'EXAMINATION','Mid-Semester Examination Fee',2200.00,0.00,'2026-12-31','Semester 5 (2026-27)','PENDING',NULL,'2026-11-21 13:01:56','2026-11-21 13:01:56');
INSERT INTO `fee_reminders` (`id`, `user_id`, `fee_type`, `title`, `total_amount`, `paid_amount`, `due_date`, `academic_term`, `status`, `receipt_number`, `created_at`, `updated_at`) VALUES (4,2,'TUITION','Semester 4 BITS Tuition',60000.00,0.00,'2026-12-11','Academic Year 2026-27','PENDING',NULL,'2026-11-21 13:01:57','2026-11-21 13:01:56');
/*!40000 ALTER TABLE `fee_reminders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `financial_challenges`
--

DROP TABLE IF EXISTS `financial_challenges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `financial_challenges` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `challenge_type` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `duration_days` int NOT NULL,
  `reward_points` int NOT NULL DEFAULT '100',
  `target_savings` decimal(12,2) NOT NULL DEFAULT '0.00',
  `badge_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `financial_challenges`
--

LOCK TABLES `financial_challenges` WRITE;
/*!40000 ALTER TABLE `financial_challenges` DISABLE KEYS */;
INSERT INTO `financial_challenges` (`id`, `title`, `description`, `challenge_type`, `duration_days`, `reward_points`, `target_savings`, `badge_name`, `is_active`, `created_at`) VALUES (1,'30-Day ₹50 Daily Habit','Save just ₹50 into your emergency goal every day for 30 consecutive days.','30_DAY_SAVINGS',30,250,1500.00,'Consistency Champion',1,'2026-11-19 11:51:24');
INSERT INTO `financial_challenges` (`id`, `title`, `description`, `challenge_type`, `duration_days`, `reward_points`, `target_savings`, `badge_name`, `is_active`, `created_at`) VALUES (2,'No Swiggy / Zomato Week','Cook or eat in the college canteen for 7 full days to curtail unnecessary weekend delivery splurges.','NO_SWIGGY_WEEK',7,150,1200.00,'Canteen Connoisseur',1,'2026-11-19 11:51:24');
INSERT INTO `financial_challenges` (`id`, `title`, `description`, `challenge_type`, `duration_days`, `reward_points`, `target_savings`, `badge_name`, `is_active`, `created_at`) VALUES (3,'Roommate Budget Matcher','Stay under your shared room budget limit for an entire monthly cycle.','BUDGET_STREAK',30,300,2000.00,'Budget Wizard',1,'2026-11-19 11:51:24');
INSERT INTO `financial_challenges` (`id`, `title`, `description`, `challenge_type`, `duration_days`, `reward_points`, `target_savings`, `badge_name`, `is_active`, `created_at`) VALUES (4,'First ₹10,000 Milestone','Accumulate a verified total savings balance of ₹10,000 in your StudentBank goal vaults.','SAVINGS_MILESTONE',60,500,10000.00,'Vault Master',1,'2026-11-19 11:51:24');
/*!40000 ALTER TABLE `financial_challenges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `monthly_budgets`
--

DROP TABLE IF EXISTS `monthly_budgets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `monthly_budgets` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `category_id` bigint DEFAULT NULL,
  `month_year` varchar(7) COLLATE utf8mb4_unicode_ci NOT NULL,
  `allocated_amount` decimal(12,2) NOT NULL,
  `spent_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `alert_threshold_percentage` int NOT NULL DEFAULT '80',
  `is_alert_triggered` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_month_category` (`user_id`,`month_year`,`category_id`),
  KEY `fk_budget_category` (`category_id`),
  KEY `idx_budget_lookup` (`user_id`,`month_year`),
  CONSTRAINT `fk_budget_category` FOREIGN KEY (`category_id`) REFERENCES `expense_categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_budget_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `monthly_budgets`
--

LOCK TABLES `monthly_budgets` WRITE;
/*!40000 ALTER TABLE `monthly_budgets` DISABLE KEYS */;
INSERT INTO `monthly_budgets` (`id`, `user_id`, `category_id`, `month_year`, `allocated_amount`, `spent_amount`, `alert_threshold_percentage`, `is_alert_triggered`, `created_at`, `updated_at`) VALUES (1,1,1,'2026-11',3500.00,1850.00,80,0,'2026-11-21 13:01:56','2026-11-21 13:01:56');
INSERT INTO `monthly_budgets` (`id`, `user_id`, `category_id`, `month_year`, `allocated_amount`, `spent_amount`, `alert_threshold_percentage`, `is_alert_triggered`, `created_at`, `updated_at`) VALUES (2,1,2,'2026-11',1500.00,650.00,80,0,'2026-11-21 13:01:56','2026-11-21 13:01:56');
INSERT INTO `monthly_budgets` (`id`, `user_id`, `category_id`, `month_year`, `allocated_amount`, `spent_amount`, `alert_threshold_percentage`, `is_alert_triggered`, `created_at`, `updated_at`) VALUES (3,1,5,'2026-11',1000.00,380.00,80,0,'2026-11-21 13:01:56','2026-11-21 13:01:56');
INSERT INTO `monthly_budgets` (`id`, `user_id`, `category_id`, `month_year`, `allocated_amount`, `spent_amount`, `alert_threshold_percentage`, `is_alert_triggered`, `created_at`, `updated_at`) VALUES (4,1,6,'2026-11',500.00,250.00,80,0,'2026-11-21 13:01:56','2026-11-21 13:01:56');
INSERT INTO `monthly_budgets` (`id`, `user_id`, `category_id`, `month_year`, `allocated_amount`, `spent_amount`, `alert_threshold_percentage`, `is_alert_triggered`, `created_at`, `updated_at`) VALUES (5,2,1,'2026-11',3000.00,450.00,80,0,'2026-11-21 13:01:57','2026-11-21 13:01:56');
INSERT INTO `monthly_budgets` (`id`, `user_id`, `category_id`, `month_year`, `allocated_amount`, `spent_amount`, `alert_threshold_percentage`, `is_alert_triggered`, `created_at`, `updated_at`) VALUES (6,2,2,'2026-11',1500.00,850.00,80,0,'2026-11-21 13:01:57','2026-11-21 13:01:56');
INSERT INTO `monthly_budgets` (`id`, `user_id`, `category_id`, `month_year`, `allocated_amount`, `spent_amount`, `alert_threshold_percentage`, `is_alert_triggered`, `created_at`, `updated_at`) VALUES (7,2,5,'2026-11',1000.00,500.00,80,0,'2026-11-21 13:01:57','2026-11-21 13:01:56');
/*!40000 ALTER TABLE `monthly_budgets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `notification_type` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `action_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_notif_user_unread` (`user_id`,`is_read`),
  CONSTRAINT `fk_notif_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `transaction_reference` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint NOT NULL,
  `recipient_upi` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `fee_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `gateway_provider` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'STUDENTBANK_MOCK_PAY',
  `payment_status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'SUCCESS',
  `payment_method` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'UPI',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `transaction_reference` (`transaction_reference`),
  KEY `fk_pay_user` (`user_id`),
  KEY `idx_pay_ref` (`transaction_reference`),
  CONSTRAINT `fk_pay_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `savings_goals`
--

DROP TABLE IF EXISTS `savings_goals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `savings_goals` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_amount` decimal(12,2) NOT NULL,
  `saved_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `target_date` date NOT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'GADGET',
  `monthly_installment` decimal(12,2) NOT NULL DEFAULT '0.00',
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'IN_PROGRESS',
  `icon` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Target',
  `color_hex` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#0D9488',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_goal_user` (`user_id`,`status`),
  CONSTRAINT `fk_goal_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_target_amount` CHECK ((`target_amount` > 0.00))
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `savings_goals`
--

LOCK TABLES `savings_goals` WRITE;
/*!40000 ALTER TABLE `savings_goals` DISABLE KEYS */;
INSERT INTO `savings_goals` (`id`, `user_id`, `title`, `description`, `target_amount`, `saved_amount`, `target_date`, `category`, `monthly_installment`, `status`, `icon`, `color_hex`, `created_at`, `updated_at`) VALUES (1,1,'MacBook M3 / Coding Laptop','Upgrading for AI and Distributed Systems projects',65000.00,28000.00,'2027-05-21','GADGET',6000.00,'IN_PROGRESS','Target','#0D9488','2026-11-21 13:01:56','2026-11-21 13:01:56');
INSERT INTO `savings_goals` (`id`, `user_id`, `title`, `description`, `target_amount`, `saved_amount`, `target_date`, `category`, `monthly_installment`, `status`, `icon`, `color_hex`, `created_at`, `updated_at`) VALUES (2,1,'Emergency Student Vault','For urgent medical or sudden travel expenses',10000.00,6500.00,'2027-02-21','EMERGENCY',1500.00,'IN_PROGRESS','Target','#0D9488','2026-11-21 13:01:56','2026-11-21 13:01:56');
INSERT INTO `savings_goals` (`id`, `user_id`, `title`, `description`, `target_amount`, `saved_amount`, `target_date`, `category`, `monthly_installment`, `status`, `icon`, `color_hex`, `created_at`, `updated_at`) VALUES (3,1,'Semester Break Goa Trip','Hostel wing annual graduation trip',12000.00,8500.00,'2027-01-21','TRAVEL',2000.00,'IN_PROGRESS','Target','#0D9488','2026-11-21 13:01:56','2026-11-21 13:01:56');
INSERT INTO `savings_goals` (`id`, `user_id`, `title`, `description`, `target_amount`, `saved_amount`, `target_date`, `category`, `monthly_installment`, `status`, `icon`, `color_hex`, `created_at`, `updated_at`) VALUES (4,2,'iPad Air for Digital Notes','Apple iPad with Pencil for lecture diagrams',45000.00,9000.00,'2027-04-21','TECH',4000.00,'IN_PROGRESS','Target','#0D9488','2026-11-21 13:01:57','2026-11-21 13:01:56');
/*!40000 ALTER TABLE `savings_goals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scholarship_applications`
--

DROP TABLE IF EXISTS `scholarship_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scholarship_applications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `scholarship_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `application_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `submission_date` date NOT NULL,
  `status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'SUBMITTED',
  `documents_submitted_json` text COLLATE utf8mb4_unicode_ci,
  `notes` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `disbursed_amount` decimal(12,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `application_number` (`application_number`),
  KEY `fk_appl_scholarship` (`scholarship_id`),
  KEY `idx_appl_user` (`user_id`),
  CONSTRAINT `fk_appl_scholarship` FOREIGN KEY (`scholarship_id`) REFERENCES `scholarships` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_appl_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scholarship_applications`
--

LOCK TABLES `scholarship_applications` WRITE;
/*!40000 ALTER TABLE `scholarship_applications` DISABLE KEYS */;
/*!40000 ALTER TABLE `scholarship_applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scholarships`
--

DROP TABLE IF EXISTS `scholarships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scholarships` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `scholarship_type` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `award_amount` decimal(12,2) NOT NULL,
  `eligibility_criteria` text COLLATE utf8mb4_unicode_ci,
  `applicable_courses` text COLLATE utf8mb4_unicode_ci,
  `min_cgpa` decimal(3,2) DEFAULT NULL,
  `max_family_income` decimal(12,2) DEFAULT NULL,
  `application_deadline` date NOT NULL,
  `official_link` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `required_documents` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_schol_type` (`scholarship_type`),
  KEY `idx_schol_deadline` (`application_deadline`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scholarships`
--

LOCK TABLES `scholarships` WRITE;
/*!40000 ALTER TABLE `scholarships` DISABLE KEYS */;
INSERT INTO `scholarships` (`id`, `title`, `provider_name`, `scholarship_type`, `award_amount`, `eligibility_criteria`, `applicable_courses`, `min_cgpa`, `max_family_income`, `application_deadline`, `official_link`, `required_documents`, `is_active`, `created_at`, `updated_at`) VALUES (1,'Central Sector Scheme of Scholarship for College and University Students','Ministry of Education, Govt. of India','GOVERNMENT',20000.00,'Top 20th percentile in Class 12 board exams, enrolled in regular graduation course','B.Tech, B.Sc, B.Com, MBBS, BA',8.00,450000.00,'2026-12-31','https://scholarships.gov.in','Class 12 Marks Sheet, Income Certificate, Aadhar Card, College Bonafide',1,'2026-11-19 11:51:23','2026-11-19 11:51:23');
INSERT INTO `scholarships` (`id`, `title`, `provider_name`, `scholarship_type`, `award_amount`, `eligibility_criteria`, `applicable_courses`, `min_cgpa`, `max_family_income`, `application_deadline`, `official_link`, `required_documents`, `is_active`, `created_at`, `updated_at`) VALUES (2,'Reliance Foundation Undergraduate Scholarships','Reliance Foundation','PRIVATE',50000.00,'First-year undergraduate students in any stream with minimum 60% in Class 12','All Degree Programs',7.50,600000.00,'2026-11-30','https://reliancefoundation.org','Class 12 Marksheet, Family Income Proof, Bonafide Letter, Entrance Exam Scorecard',1,'2026-11-19 11:51:23','2026-11-19 11:51:23');
INSERT INTO `scholarships` (`id`, `title`, `provider_name`, `scholarship_type`, `award_amount`, `eligibility_criteria`, `applicable_courses`, `min_cgpa`, `max_family_income`, `application_deadline`, `official_link`, `required_documents`, `is_active`, `created_at`, `updated_at`) VALUES (3,'Post-Matric Scholarship Scheme for Minorities','Ministry of Minority Affairs','GOVERNMENT',30000.00,'Minimum 50% marks in previous final exam and family income within limits','Engineering, Medicine, Arts, Science, Commerce',7.00,250000.00,'2026-12-15','https://scholarships.gov.in','Previous Exam Marksheet, Domicile Certificate, Minority Certificate, Bank Passbook',1,'2026-11-19 11:51:23','2026-11-19 11:51:23');
INSERT INTO `scholarships` (`id`, `title`, `provider_name`, `scholarship_type`, `award_amount`, `eligibility_criteria`, `applicable_courses`, `min_cgpa`, `max_family_income`, `application_deadline`, `official_link`, `required_documents`, `is_active`, `created_at`, `updated_at`) VALUES (4,'Tata Trusts Means-Grant for College Students','Tata Trusts','PRIVATE',40000.00,'Students enrolled in recognised Indian universities demonstrating financial hardship','Undergraduate & Postgraduate',7.80,400000.00,'2027-01-15','https://tatatrusts.org','College ID, Fee Receipts, Income Certificate, Statement of Purpose',1,'2026-11-19 11:51:23','2026-11-19 11:51:23');
INSERT INTO `scholarships` (`id`, `title`, `provider_name`, `scholarship_type`, `award_amount`, `eligibility_criteria`, `applicable_courses`, `min_cgpa`, `max_family_income`, `application_deadline`, `official_link`, `required_documents`, `is_active`, `created_at`, `updated_at`) VALUES (5,'AICTE Pragati Scholarship Scheme for Girl Students','AICTE, Govt. of India','GOVERNMENT',50000.00,'Female students admitted to first year of Degree Level course in AICTE approved institution','Technical Degree Courses',7.50,800000.00,'2026-12-20','https://aicte-india.org','AICTE Admission Letter, Caste Certificate (if applicable), Income Proof, Aadhar',1,'2026-11-19 11:51:23','2026-11-19 11:51:23');
/*!40000 ALTER TABLE `scholarships` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `security_logs`
--

DROP TABLE IF EXISTS `security_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `security_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `event_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_agent` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `device_info` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'SUCCESS',
  `details` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_sec_user` (`user_id`),
  KEY `idx_sec_event` (`event_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `security_logs`
--

LOCK TABLES `security_logs` WRITE;
/*!40000 ALTER TABLE `security_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `security_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shared_expenses`
--

DROP TABLE IF EXISTS `shared_expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shared_expenses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_by_user_id` bigint NOT NULL,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_amount` decimal(12,2) NOT NULL,
  `split_method` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'EQUAL',
  `group_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_shared_creator` (`created_by_user_id`),
  CONSTRAINT `fk_shared_owner` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shared_expenses`
--

LOCK TABLES `shared_expenses` WRITE;
/*!40000 ALTER TABLE `shared_expenses` DISABLE KEYS */;
/*!40000 ALTER TABLE `shared_expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_profiles`
--

DROP TABLE IF EXISTS `student_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_profiles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `student_id_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `university_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `college_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `course_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `department` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `academic_year` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `semester` int NOT NULL DEFAULT '1',
  `date_of_birth` date DEFAULT NULL,
  `emergency_contact` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Karnataka',
  `city` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Bengaluru',
  `monthly_allowance` decimal(12,2) NOT NULL DEFAULT '5000.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `idx_profile_university` (`university_name`),
  KEY `idx_profile_student_id` (`student_id_number`),
  CONSTRAINT `fk_profile_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_profiles`
--

LOCK TABLES `student_profiles` WRITE;
/*!40000 ALTER TABLE `student_profiles` DISABLE KEYS */;
INSERT INTO `student_profiles` (`id`, `user_id`, `student_id_number`, `university_name`, `college_name`, `course_name`, `department`, `academic_year`, `semester`, `date_of_birth`, `emergency_contact`, `state`, `city`, `monthly_allowance`, `created_at`, `updated_at`) VALUES (1,1,'210050012','IIT Bombay - Indian Institute of Technology','Main Campus, Powai','B.Tech - Computer Science & Engineering','Computer Science & Engineering','3rd Year',5,NULL,NULL,'Maharashtra','Mumbai',6000.00,'2026-11-21 13:01:56','2026-11-21 13:01:56');
INSERT INTO `student_profiles` (`id`, `user_id`, `student_id_number`, `university_name`, `college_name`, `course_name`, `department`, `academic_year`, `semester`, `date_of_birth`, `emergency_contact`, `state`, `city`, `monthly_allowance`, `created_at`, `updated_at`) VALUES (2,2,'2023A7PS0123P','BITS Pilani','Pilani Campus, Rajasthan','B.E. (Hons) - Electronics & Communication','Electrical & Electronics','2nd Year',4,NULL,NULL,'Rajasthan','Pilani',7000.00,'2026-11-21 13:01:57','2026-11-21 13:01:57');
/*!40000 ALTER TABLE `student_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_rewards`
--

DROP TABLE IF EXISTS `student_rewards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_rewards` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `badge_title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `badge_category` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `points_awarded` int NOT NULL DEFAULT '50',
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Award',
  `unlocked_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_reward_user` (`user_id`),
  CONSTRAINT `fk_reward_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_rewards`
--

LOCK TABLES `student_rewards` WRITE;
/*!40000 ALTER TABLE `student_rewards` DISABLE KEYS */;
INSERT INTO `student_rewards` (`id`, `user_id`, `badge_title`, `badge_category`, `points_awarded`, `description`, `icon_name`, `unlocked_at`) VALUES (1,1,'Smart Budget Master','BUDGET_MASTER',200,'Maintained less than 80% budget consumption for 2 consecutive cycles','Award','2026-11-21 13:01:56');
INSERT INTO `student_rewards` (`id`, `user_id`, `badge_title`, `badge_category`, `points_awarded`, `description`, `icon_name`, `unlocked_at`) VALUES (2,1,'Early Bird Saver','SAVER',150,'Contributed regularly to the Laptop Goal without interruption','Zap','2026-11-21 13:01:56');
INSERT INTO `student_rewards` (`id`, `user_id`, `badge_title`, `badge_category`, `points_awarded`, `description`, `icon_name`, `unlocked_at`) VALUES (3,2,'Active Learner','STUDENT',150,'Enrolled in 4 semester modules','Award','2026-11-21 13:01:57');
/*!40000 ALTER TABLE `student_rewards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscriptions`
--

DROP TABLE IF EXISTS `subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscriptions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `service_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `billing_cycle` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'MONTHLY',
  `cost` decimal(12,2) NOT NULL,
  `next_billing_date` date NOT NULL,
  `student_discount_applied` tinyint(1) NOT NULL DEFAULT '1',
  `category_id` bigint DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_sub_cat` (`category_id`),
  KEY `idx_sub_user` (`user_id`),
  CONSTRAINT `fk_sub_cat` FOREIGN KEY (`category_id`) REFERENCES `expense_categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_sub_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscriptions`
--

LOCK TABLES `subscriptions` WRITE;
/*!40000 ALTER TABLE `subscriptions` DISABLE KEYS */;
/*!40000 ALTER TABLE `subscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `reference_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `category_id` bigint DEFAULT NULL,
  `transaction_type` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `balance_after` decimal(12,2) NOT NULL,
  `currency` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'INR',
  `payment_mode` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'UPI',
  `merchant_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `transaction_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'COMPLETED',
  `is_recurring` tinyint(1) NOT NULL DEFAULT '0',
  `receipt_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reference_id` (`reference_id`),
  KEY `fk_trans_account` (`account_id`),
  KEY `fk_trans_category` (`category_id`),
  KEY `idx_trans_user_date` (`user_id`,`transaction_date`),
  KEY `idx_trans_ref` (`reference_id`),
  CONSTRAINT `fk_trans_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_trans_category` FOREIGN KEY (`category_id`) REFERENCES `expense_categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_trans_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_trans_amount` CHECK ((`amount` > 0.00))
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` (`id`, `reference_id`, `account_id`, `user_id`, `category_id`, `transaction_type`, `amount`, `balance_after`, `currency`, `payment_mode`, `merchant_name`, `description`, `transaction_date`, `status`, `is_recurring`, `receipt_url`, `created_at`) VALUES (1,'8c9f184a-3f02-4673-be35-84dd7c3ba817',1,1,NULL,'INCOME',6000.00,6000.00,'INR','UPI','Parents / Bank Transfer','Monthly College Allowance','2026-11-03 13:01:56','COMPLETED',0,NULL,'2026-11-21 13:01:56');
INSERT INTO `transactions` (`id`, `reference_id`, `account_id`, `user_id`, `category_id`, `transaction_type`, `amount`, `balance_after`, `currency`, `payment_mode`, `merchant_name`, `description`, `transaction_date`, `status`, `is_recurring`, `receipt_url`, `created_at`) VALUES (2,'807e1afd-3551-4dfb-a451-38ac9ce93c90',1,1,1,'EXPENSE',120.00,5880.00,'INR','UPI','Hostel 12 Canteen','Lunch & Cold Coffee','2026-11-06 13:01:56','COMPLETED',0,NULL,'2026-11-21 13:01:56');
INSERT INTO `transactions` (`id`, `reference_id`, `account_id`, `user_id`, `category_id`, `transaction_type`, `amount`, `balance_after`, `currency`, `payment_mode`, `merchant_name`, `description`, `transaction_date`, `status`, `is_recurring`, `receipt_url`, `created_at`) VALUES (3,'587e7e95-f394-4edc-844d-99dbf87246a9',1,1,2,'EXPENSE',650.00,5230.00,'INR','CARD','Powai Book Depot','Algorithms Textbook & Lab Notebooks','2026-11-09 13:01:56','COMPLETED',0,NULL,'2026-11-21 13:01:56');
INSERT INTO `transactions` (`id`, `reference_id`, `account_id`, `user_id`, `category_id`, `transaction_type`, `amount`, `balance_after`, `currency`, `payment_mode`, `merchant_name`, `description`, `transaction_date`, `status`, `is_recurring`, `receipt_url`, `created_at`) VALUES (4,'447b37d8-2953-4b8e-9dda-7a1fa33cbccd',1,1,5,'EXPENSE',380.00,4850.00,'INR','UPI','Mumbai Metro Card','Monthly Metro Recharge','2026-11-12 13:01:56','COMPLETED',0,NULL,'2026-11-21 13:01:56');
INSERT INTO `transactions` (`id`, `reference_id`, `account_id`, `user_id`, `category_id`, `transaction_type`, `amount`, `balance_after`, `currency`, `payment_mode`, `merchant_name`, `description`, `transaction_date`, `status`, `is_recurring`, `receipt_url`, `created_at`) VALUES (5,'f4ce10c3-a7b1-479f-a189-e248e7450a71',1,1,1,'EXPENSE',480.00,4370.00,'INR','UPI','Swiggy India','Weekend Pizza with Hostel Roommates','2026-11-15 13:01:56','COMPLETED',0,NULL,'2026-11-21 13:01:56');
INSERT INTO `transactions` (`id`, `reference_id`, `account_id`, `user_id`, `category_id`, `transaction_type`, `amount`, `balance_after`, `currency`, `payment_mode`, `merchant_name`, `description`, `transaction_date`, `status`, `is_recurring`, `receipt_url`, `created_at`) VALUES (6,'043a2972-8040-44fe-be11-ea36d4bd49ed',1,1,6,'EXPENSE',59.00,4311.00,'INR','NET_BANKING','Spotify India','Spotify Student Premium Plan','2026-11-17 13:01:56','COMPLETED',0,NULL,'2026-11-21 13:01:56');
INSERT INTO `transactions` (`id`, `reference_id`, `account_id`, `user_id`, `category_id`, `transaction_type`, `amount`, `balance_after`, `currency`, `payment_mode`, `merchant_name`, `description`, `transaction_date`, `status`, `is_recurring`, `receipt_url`, `created_at`) VALUES (7,'387e6c0f-4009-45d4-8492-06128f6aecc4',1,1,NULL,'INCOME',1200.00,5511.00,'INR','UPI','Peer Tutoring','Java Programming Mentorship Payment','2026-11-19 13:01:56','COMPLETED',0,NULL,'2026-11-21 13:01:56');
INSERT INTO `transactions` (`id`, `reference_id`, `account_id`, `user_id`, `category_id`, `transaction_type`, `amount`, `balance_after`, `currency`, `payment_mode`, `merchant_name`, `description`, `transaction_date`, `status`, `is_recurring`, `receipt_url`, `created_at`) VALUES (8,'af9a89d0-8a1a-4628-818e-65cb7ec0b477',1,1,1,'EXPENSE',661.00,4850.00,'INR','UPI','Campus Cafe Bistro','Snacks & Group Study Refreshments','2026-11-21 07:01:56','COMPLETED',0,NULL,'2026-11-21 13:01:56');
INSERT INTO `transactions` (`id`, `reference_id`, `account_id`, `user_id`, `category_id`, `transaction_type`, `amount`, `balance_after`, `currency`, `payment_mode`, `merchant_name`, `description`, `transaction_date`, `status`, `is_recurring`, `receipt_url`, `created_at`) VALUES (9,'f1d726af-3acd-4bf1-a268-820f95bb63f4',2,2,NULL,'INCOME',7000.00,7000.00,'INR','UPI','Parents / Stipend','Monthly College Allowance','2026-11-11 13:01:57','COMPLETED',0,NULL,'2026-11-21 13:01:57');
INSERT INTO `transactions` (`id`, `reference_id`, `account_id`, `user_id`, `category_id`, `transaction_type`, `amount`, `balance_after`, `currency`, `payment_mode`, `merchant_name`, `description`, `transaction_date`, `status`, `is_recurring`, `receipt_url`, `created_at`) VALUES (10,'78a41156-cefe-40ef-b7b9-956c7288689f',2,2,1,'EXPENSE',450.00,6550.00,'INR','UPI','BITS Cafeteria','Breakfast & Snacks','2026-11-13 13:01:57','COMPLETED',0,NULL,'2026-11-21 13:01:57');
INSERT INTO `transactions` (`id`, `reference_id`, `account_id`, `user_id`, `category_id`, `transaction_type`, `amount`, `balance_after`, `currency`, `payment_mode`, `merchant_name`, `description`, `transaction_date`, `status`, `is_recurring`, `receipt_url`, `created_at`) VALUES (11,'5d9d4360-8597-40db-aa42-5592325b2a74',2,2,2,'EXPENSE',850.00,5700.00,'INR','CARD','Campus Stationery','Sem 4 Lab Manuals','2026-11-16 13:01:57','COMPLETED',0,NULL,'2026-11-21 13:01:57');
INSERT INTO `transactions` (`id`, `reference_id`, `account_id`, `user_id`, `category_id`, `transaction_type`, `amount`, `balance_after`, `currency`, `payment_mode`, `merchant_name`, `description`, `transaction_date`, `status`, `is_recurring`, `receipt_url`, `created_at`) VALUES (12,'a561a405-77f4-43b2-afcb-54e479066a98',2,2,5,'EXPENSE',500.00,5200.00,'INR','UPI','Bus Travel','Bus Pass Recharge','2026-11-19 13:01:57','COMPLETED',0,NULL,'2026-11-21 13:01:57');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `public_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ROLE_STUDENT',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_email_verified` tinyint(1) NOT NULL DEFAULT '0',
  `otp_code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `otp_expiry_time` datetime DEFAULT NULL,
  `two_factor_enabled` tinyint(1) NOT NULL DEFAULT '0',
  `transaction_pin` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `profile_image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `public_id` (`public_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone_number` (`phone_number`),
  KEY `idx_user_email` (`email`),
  KEY `idx_user_role` (`role`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `public_id`, `email`, `password_hash`, `full_name`, `phone_number`, `role`, `is_active`, `is_email_verified`, `otp_code`, `otp_expiry_time`, `two_factor_enabled`, `transaction_pin`, `profile_image_url`, `created_at`, `updated_at`) VALUES (1,'a18b4cea-85a1-4b00-8c1a-570558ca1c46','rahul.sharma@iitb.ac.in','$2a$10$GxfiE/RR/IE6Qcgud9NIFuVBSHtCcglFDcKmm4OeDvJi9tuBNVPRi','Rahul Sharma','9876543210','ROLE_STUDENT',1,1,NULL,NULL,0,NULL,NULL,'2026-11-21 13:01:56','2026-11-21 13:01:56');
INSERT INTO `users` (`id`, `public_id`, `email`, `password_hash`, `full_name`, `phone_number`, `role`, `is_active`, `is_email_verified`, `otp_code`, `otp_expiry_time`, `two_factor_enabled`, `transaction_pin`, `profile_image_url`, `created_at`, `updated_at`) VALUES (2,'b5f92f1c-fe0e-4cf5-b259-191293bb43a3','priya.patel@bits.ac.in','$2a$10$NJc4FOgmdXDbw9hK1QKZyuJ1bnzYGQuzc7LmsrimL7QUnIKWNLea2','Priya Patel','9823011223','ROLE_STUDENT',1,1,NULL,NULL,0,NULL,NULL,'2026-11-21 13:01:57','2026-11-21 13:01:57');
INSERT INTO `users` (`id`, `public_id`, `email`, `password_hash`, `full_name`, `phone_number`, `role`, `is_active`, `is_email_verified`, `otp_code`, `otp_expiry_time`, `two_factor_enabled`, `transaction_pin`, `profile_image_url`, `created_at`, `updated_at`) VALUES (3,'875ab68d-201b-4632-9953-8e6faa2bcc8f','admin@studentbank.com','$2a$10$AEWJpwSIY7wtQLohPMcvZuuk4KDExfupmPAqv4Mf6WRzucIoYSXZK','Platform Administrator','9999999999','ROLE_ADMIN',1,1,NULL,NULL,0,NULL,NULL,'2026-11-21 13:01:57','2026-11-21 13:01:57');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-21 18:34:00
