-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: valve_system
-- ------------------------------------------------------
-- Server version	8.0.40

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
-- Table structure for table `alarm_types`
--

DROP TABLE IF EXISTS `alarm_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alarm_types` (
  `type_id` bigint NOT NULL AUTO_INCREMENT COMMENT '报警类型ID',
  `type_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '报警类型名称',
  `type_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '报警类型编码',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT '报警类型描述',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`type_id`),
  UNIQUE KEY `type_code` (`type_code`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alarm_types`
--

LOCK TABLES `alarm_types` WRITE;
/*!40000 ALTER TABLE `alarm_types` DISABLE KEYS */;
INSERT INTO `alarm_types` VALUES (1,'压力过高','HIGH_PRESSURE','压力过高','2025-11-04 07:12:22'),(2,'温度过高','HIGH_TEMPERATURE','温度过高','2025-11-04 07:12:22'),(3,'流量异常','FLOW_ABNORMAL','流量异常','2025-11-04 07:12:22'),(4,'通信中断','COMMUNICATION_LOST','通信中断','2025-11-04 07:12:22');
/*!40000 ALTER TABLE `alarm_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `role_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '角色名称',
  `role_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '角色编码',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT '角色描述',
  `permissions` text COLLATE utf8mb4_unicode_ci COMMENT '权限JSON',
  `status` tinyint DEFAULT '1' COMMENT '状态: 0-禁用, 1-启用',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_name` (`role_name`),
  UNIQUE KEY `role_code` (`role_code`),
  KEY `idx_role_code` (`role_code`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'系统管理员','ADMIN','系统最高权限管理员','{\"all\": true}',1,'2025-11-04 03:32:48','2025-11-04 03:32:48'),(2,'操作员','OPERATOR','设备操作员，具有设备控制权限','{\"device_control\": true, \"alarm_view\": true, \"data_query\": true}',1,'2025-11-04 03:32:48','2025-11-04 03:32:48'),(3,'监控员','MONITOR','设备监控员，具有查看权限','{\"device_view\": true, \"alarm_view\": true, \"data_query\": true}',1,'2025-11-04 03:32:48','2025-11-04 03:32:48'),(4,'维护员','MAINTENANCE','设备维护员，具有维护相关权限','{\"device_maintenance\": true, \"alarm_handle\": true, \"data_query\": true}',1,'2025-11-04 03:32:48','2025-11-04 03:32:48'),(5,'只读用户','READONLY','只读用户，只能查看数据','{\"device_view\": true, \"data_query\": true}',1,'2025-11-04 03:32:48','2025-11-04 03:32:48'),(7,'user','USER','普通用户','[\"view\",\"monitor\"]',1,'2025-11-04 06:56:59','2025-11-04 06:56:59');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_configs`
--

DROP TABLE IF EXISTS `system_configs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_configs` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '配置ID',
  `config_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '配置键',
  `config_value` text COLLATE utf8mb4_unicode_ci COMMENT '配置值',
  `config_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'string' COMMENT '配置类型: string/int/float/json',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT '配置描述',
  `is_editable` tinyint DEFAULT '1' COMMENT '是否可编辑',
  `category` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '配置分类',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `config_key` (`config_key`),
  KEY `idx_config_key` (`config_key`),
  KEY `idx_category` (`category`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统配置表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_configs`
--

LOCK TABLES `system_configs` WRITE;
/*!40000 ALTER TABLE `system_configs` DISABLE KEYS */;
INSERT INTO `system_configs` VALUES (1,'system_name','阀门监控系统','string','系统名称',1,'system','2025-11-04 03:33:03','2025-11-04 03:33:03'),(2,'data_retention_days','3650','int','数据保留天数(默认10年)',1,'data','2025-11-04 03:33:03','2025-11-04 03:33:03'),(3,'realtime_data_interval','5','int','实时数据采集间隔(秒)',1,'monitoring','2025-11-04 03:33:03','2025-11-04 03:33:03'),(4,'alarm_check_interval','30','int','报警检查间隔(秒)',1,'alarm','2025-11-04 03:33:03','2025-11-04 03:33:03'),(5,'max_concurrent_users','100','int','最大并发用户数',1,'system','2025-11-04 03:33:03','2025-11-04 03:33:03'),(6,'session_timeout','3600','int','会话超时时间(秒)',1,'security','2025-11-04 03:33:03','2025-11-04 03:33:03'),(7,'enable_email_notification','true','boolean','启用邮件通知',1,'notification','2025-11-04 03:33:03','2025-11-04 03:33:03'),(8,'enable_sms_notification','false','boolean','启用短信通知',1,'notification','2025-11-04 03:33:03','2025-11-04 03:33:03'),(9,'database_backup_interval','24','int','数据库备份间隔(小时)',1,'maintenance','2025-11-04 03:33:03','2025-11-04 03:33:03'),(10,'log_retention_days','90','int','日志保留天数',1,'system','2025-11-04 03:33:03','2025-11-04 03:33:03');
/*!40000 ALTER TABLE `system_configs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户名',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '密码(加密存储)',
  `real_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '真实姓名',
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '邮箱',
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '电话',
  `role_id` bigint NOT NULL COMMENT '角色ID',
  `department` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '部门',
  `status` tinyint DEFAULT '1' COMMENT '状态: 0-禁用, 1-启用',
  `last_login_time` datetime DEFAULT NULL COMMENT '最后登录时间',
  `last_login_ip` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '最后登录IP',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `idx_username` (`username`),
  KEY `idx_role_id` (`role_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','admin123','系统管理员','admin@valvesystem.com',NULL,1,'IT部门',1,NULL,NULL,'2025-11-04 03:33:08','2025-11-04 06:48:27'),(2,'chen','123456',NULL,'1980547323@qq.com',NULL,7,NULL,1,NULL,NULL,'2025-11-04 08:12:52','2025-11-04 08:12:52');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `valve_alarms`
--

DROP TABLE IF EXISTS `valve_alarms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `valve_alarms` (
  `alarm_id` bigint NOT NULL AUTO_INCREMENT COMMENT '报警ID',
  `device_id` bigint NOT NULL COMMENT '设备ID',
  `alarm_type_id` bigint NOT NULL COMMENT '报警类型ID',
  `alarm_message` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '报警消息',
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'active' COMMENT '状态: active/acknowledged/resolved',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `acknowledged_at` datetime DEFAULT NULL COMMENT '确认时间',
  `resolved_at` datetime DEFAULT NULL COMMENT '解决时间',
  `acknowledged_by` bigint DEFAULT NULL COMMENT '确认人ID',
  `resolved_by` bigint DEFAULT NULL COMMENT '解决人ID',
  `acknowledge_note` text COLLATE utf8mb4_unicode_ci COMMENT '确认备注',
  `resolve_note` text COLLATE utf8mb4_unicode_ci COMMENT '解决备注',
  PRIMARY KEY (`alarm_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `valve_alarms`
--

LOCK TABLES `valve_alarms` WRITE;
/*!40000 ALTER TABLE `valve_alarms` DISABLE KEYS */;
INSERT INTO `valve_alarms` VALUES (1,1,1,'设备压力过高，请注意检查','active','2025-11-04 07:12:22',NULL,NULL,NULL,NULL,NULL,NULL),(2,2,1,'设备压力异常，需要维护','active','2025-11-04 07:12:22',NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `valve_alarms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `valve_device_types`
--

DROP TABLE IF EXISTS `valve_device_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `valve_device_types` (
  `type_id` bigint NOT NULL AUTO_INCREMENT COMMENT '设备类型ID',
  `type_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '设备类型名称',
  `type_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '设备类型编码',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT '设备类型描述',
  `status` tinyint DEFAULT '1' COMMENT '状态: 0-禁用, 1-启用',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`type_id`),
  UNIQUE KEY `type_code` (`type_code`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `valve_device_types`
--

LOCK TABLES `valve_device_types` WRITE;
/*!40000 ALTER TABLE `valve_device_types` DISABLE KEYS */;
INSERT INTO `valve_device_types` VALUES (1,'球阀','BALL_VALVE','用于截断或调节介质流量',1,'2025-11-04 07:12:22'),(2,'蝶阀','BUTTERFLY_VALVE','适用于大口径管道的调节控制',1,'2025-11-04 07:12:22'),(3,'截止阀','GLOBE_VALVE','用于精确调节流量',1,'2025-11-04 07:12:22'),(4,'闸阀','GATE_VALVE','用于完全开启或关闭管道',1,'2025-11-04 07:12:22');
/*!40000 ALTER TABLE `valve_device_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `valve_devices`
--

DROP TABLE IF EXISTS `valve_devices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `valve_devices` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '设备ID',
  `device_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '设备名称',
  `device_type_id` bigint NOT NULL COMMENT '设备类型ID',
  `device_address` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '设备地址',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT '设备描述',
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'offline' COMMENT '状态: online/offline/maintenance',
  `last_online` datetime DEFAULT NULL COMMENT '最后在线时间',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `valve_devices`
--

LOCK TABLES `valve_devices` WRITE;
/*!40000 ALTER TABLE `valve_devices` DISABLE KEYS */;
INSERT INTO `valve_devices` VALUES (1,'管道1号球阀',1,'DEV-001','示例设备','online','2025-11-04 15:12:22','2025-11-04 07:12:22','2025-11-04 07:12:22'),(2,'管道2号蝶阀',2,'DEV-002','示例设备','online','2025-11-04 15:12:22','2025-11-04 07:12:22','2025-11-04 07:12:22'),(3,'管道3号截止阀',3,'DEV-003','示例设备','offline','2025-11-04 15:12:22','2025-11-04 07:12:22','2025-11-04 07:12:22'),(4,'管道4号闸阀',4,'DEV-004','示例设备','online','2025-11-04 15:12:22','2025-11-04 07:12:22','2025-11-04 07:12:22');
/*!40000 ALTER TABLE `valve_devices` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-05 22:12:16
