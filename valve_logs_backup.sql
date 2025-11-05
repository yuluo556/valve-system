-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: valve_logs
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
-- Table structure for table `communication_logs`
--

DROP TABLE IF EXISTS `communication_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `communication_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  `device_id` bigint NOT NULL COMMENT '设备ID',
  `device_code` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '设备编码',
  `communication_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '通信类型: Modbus/OPC/MQTT/HTTP',
  `protocol_version` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '协议版本',
  `command_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '命令类型: 读/写',
  `function_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '功能码',
  `request_data` text COLLATE utf8mb4_unicode_ci COMMENT '请求数据',
  `request_time` datetime DEFAULT NULL COMMENT '请求时间',
  `request_size` int DEFAULT NULL COMMENT '请求数据大小',
  `response_data` text COLLATE utf8mb4_unicode_ci COMMENT '响应数据',
  `response_time` datetime DEFAULT NULL COMMENT '响应时间',
  `response_size` int DEFAULT NULL COMMENT '响应数据大小',
  `communication_status` tinyint NOT NULL COMMENT '通信状态: 0-失败, 1-成功, 2-超时, 3-异常',
  `error_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '错误码',
  `error_message` text COLLATE utf8mb4_unicode_ci COMMENT '错误消息',
  `response_time_ms` int DEFAULT NULL COMMENT '响应时间(毫秒)',
  `retry_count` int DEFAULT '0' COMMENT '重试次数',
  `local_ip` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '本地IP',
  `remote_ip` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '远程IP',
  `local_port` int DEFAULT NULL COMMENT '本地端口',
  `remote_port` int DEFAULT NULL COMMENT '远程端口',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_device_id` (`device_id`),
  KEY `idx_communication_type` (`communication_type`),
  KEY `idx_communication_status` (`communication_status`),
  KEY `idx_request_time` (`request_time`),
  KEY `idx_response_time` (`response_time`),
  CONSTRAINT `communication_logs_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `valve_system`.`valve_devices` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='通信日志表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `communication_logs`
--

LOCK TABLES `communication_logs` WRITE;
/*!40000 ALTER TABLE `communication_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `communication_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `device_control_logs`
--

DROP TABLE IF EXISTS `device_control_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `device_control_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  `device_id` bigint NOT NULL COMMENT '设备ID',
  `device_code` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '设备编码',
  `device_name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '设备名称',
  `control_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '控制类型: 开关控制/开度调节/参数设置',
  `control_command` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '控制指令',
  `control_value` decimal(15,6) DEFAULT NULL COMMENT '控制值',
  `control_unit` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '控制单位',
  `user_id` bigint NOT NULL COMMENT '操作用户ID',
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户名',
  `execution_status` tinyint DEFAULT '0' COMMENT '执行状态: 0-待执行, 1-执行中, 2-成功, 3-失败, 4-超时',
  `execution_time` int DEFAULT NULL COMMENT '执行时间(秒)',
  `send_time` datetime DEFAULT NULL COMMENT '指令发送时间',
  `response_time` datetime DEFAULT NULL COMMENT '响应时间',
  `result_value` decimal(15,6) DEFAULT NULL COMMENT '结果值',
  `result_unit` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '结果单位',
  `execution_result` text COLLATE utf8mb4_unicode_ci COMMENT '执行结果',
  `error_message` text COLLATE utf8mb4_unicode_ci COMMENT '错误信息',
  `priority` tinyint DEFAULT '5' COMMENT '优先级: 1-最高, 10-最低',
  `control_strategy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '控制策略: 手动/自动/联动',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_device_id` (`device_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_control_type` (`control_type`),
  KEY `idx_execution_status` (`execution_status`),
  KEY `idx_send_time` (`send_time`),
  KEY `idx_priority` (`priority`),
  CONSTRAINT `device_control_logs_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `valve_system`.`valve_devices` (`id`),
  CONSTRAINT `device_control_logs_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `valve_system`.`users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='设备控制日志表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `device_control_logs`
--

LOCK TABLES `device_control_logs` WRITE;
/*!40000 ALTER TABLE `device_control_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `device_control_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_run_logs`
--

DROP TABLE IF EXISTS `system_run_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_run_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  `log_level` tinyint NOT NULL COMMENT '日志级别: 1-DEBUG, 2-INFO, 3-WARN, 4-ERROR, 5-FATAL',
  `log_source` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '日志来源: 系统/通信/数据采集/报警处理',
  `module_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '模块名称',
  `log_title` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '日志标题',
  `log_message` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '日志消息',
  `log_details` text COLLATE utf8mb4_unicode_ci COMMENT '日志详情',
  `thread_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '线程名称',
  `class_name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '类名称',
  `method_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '方法名称',
  `related_device_id` bigint DEFAULT NULL COMMENT '关联设备ID',
  `related_user_id` bigint DEFAULT NULL COMMENT '关联用户ID',
  `related_operation_id` bigint DEFAULT NULL COMMENT '关联操作ID',
  `execution_time` int DEFAULT NULL COMMENT '执行时间(毫秒)',
  `memory_usage` bigint DEFAULT NULL COMMENT '内存使用量(bytes)',
  `log_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '日志时间',
  PRIMARY KEY (`id`),
  KEY `idx_log_level` (`log_level`),
  KEY `idx_log_source` (`log_source`),
  KEY `idx_module_name` (`module_name`),
  KEY `idx_log_time` (`log_time`),
  KEY `idx_related_device_id` (`related_device_id`),
  KEY `idx_related_user_id` (`related_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统运行日志表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_run_logs`
--

LOCK TABLES `system_run_logs` WRITE;
/*!40000 ALTER TABLE `system_run_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `system_run_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_operation_logs`
--

DROP TABLE IF EXISTS `user_operation_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_operation_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  `user_id` bigint DEFAULT NULL COMMENT '用户ID',
  `username` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户名',
  `real_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '真实姓名',
  `operation_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '操作类型: 登录/登出/查看/新增/修改/删除/控制',
  `operation_module` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '操作模块: 用户管理/设备管理/监控/报警/系统配置',
  `operation_action` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '操作动作',
  `operation_target` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '操作对象',
  `target_id` bigint DEFAULT NULL COMMENT '对象ID',
  `request_method` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '请求方法',
  `request_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '请求URL',
  `request_params` text COLLATE utf8mb4_unicode_ci COMMENT '请求参数',
  `request_ip` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '请求IP',
  `user_agent` text COLLATE utf8mb4_unicode_ci COMMENT '用户代理',
  `response_status` int DEFAULT NULL COMMENT '响应状态码',
  `response_time` int DEFAULT NULL COMMENT '响应时间(毫秒)',
  `response_result` text COLLATE utf8mb4_unicode_ci COMMENT '响应结果',
  `business_data` text COLLATE utf8mb4_unicode_ci COMMENT '业务数据',
  `result_status` tinyint DEFAULT NULL COMMENT '结果状态: 0-失败, 1-成功',
  `error_message` text COLLATE utf8mb4_unicode_ci COMMENT '错误信息',
  `operation_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_operation_type` (`operation_type`),
  KEY `idx_operation_module` (`operation_module`),
  KEY `idx_operation_time` (`operation_time`),
  KEY `idx_request_ip` (`request_ip`),
  KEY `idx_result_status` (`result_status`),
  CONSTRAINT `user_operation_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `valve_system`.`users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户操作日志表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_operation_logs`
--

LOCK TABLES `user_operation_logs` WRITE;
/*!40000 ALTER TABLE `user_operation_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_operation_logs` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-05 21:59:44
