-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: valve_monitoring
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
-- Table structure for table `data_quality_monitoring`
--

DROP TABLE IF EXISTS `data_quality_monitoring`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `data_quality_monitoring` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '监控ID',
  `device_id` bigint NOT NULL COMMENT '设备ID',
  `check_time` datetime NOT NULL COMMENT '检查时间',
  `completeness_score` decimal(3,2) DEFAULT NULL COMMENT '完整性评分(0-1)',
  `missing_fields` text COLLATE utf8mb4_unicode_ci COMMENT '缺失字段',
  `validity_score` decimal(3,2) DEFAULT NULL COMMENT '有效性评分(0-1)',
  `invalid_values` text COLLATE utf8mb4_unicode_ci COMMENT '无效值',
  `consistency_score` decimal(3,2) DEFAULT NULL COMMENT '一致性评分(0-1)',
  `inconsistent_fields` text COLLATE utf8mb4_unicode_ci COMMENT '不一致字段',
  `timeliness_score` decimal(3,2) DEFAULT NULL COMMENT '及时性评分(0-1)',
  `delay_seconds` int DEFAULT NULL COMMENT '延迟秒数',
  `overall_score` decimal(3,2) DEFAULT NULL COMMENT '总体质量评分(0-1)',
  `quality_level` tinyint DEFAULT NULL COMMENT '质量等级: 1-优秀, 2-良好, 3-一般, 4-差',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_device_id` (`device_id`),
  KEY `idx_check_time` (`check_time`),
  KEY `idx_quality_level` (`quality_level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='数据质量监控表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data_quality_monitoring`
--

LOCK TABLES `data_quality_monitoring` WRITE;
/*!40000 ALTER TABLE `data_quality_monitoring` DISABLE KEYS */;
/*!40000 ALTER TABLE `data_quality_monitoring` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `valve_history_data`
--

DROP TABLE IF EXISTS `valve_history_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `valve_history_data` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '数据ID',
  `device_id` bigint NOT NULL COMMENT '设备ID',
  `valve_status` tinyint DEFAULT NULL COMMENT '阀门状态: 0-关闭, 1-开启, 2-中间位置',
  `open_degree` decimal(5,2) DEFAULT NULL COMMENT '开度(%)',
  `pressure` decimal(10,3) DEFAULT NULL COMMENT '压力(MPa)',
  `temperature` decimal(5,2) DEFAULT NULL COMMENT '温度(℃)',
  `flow_rate` decimal(10,3) DEFAULT NULL COMMENT '流量(m³/h)',
  `control_signal` decimal(5,2) DEFAULT NULL COMMENT '控制信号(%)',
  `feedback_signal` decimal(5,2) DEFAULT NULL COMMENT '反馈信号(%)',
  `voltage` decimal(5,2) DEFAULT NULL COMMENT '电压(V)',
  `current` decimal(5,2) DEFAULT NULL COMMENT '电流(A)',
  `power` decimal(8,2) DEFAULT NULL COMMENT '功率(W)',
  `motor_status` tinyint DEFAULT NULL COMMENT '电机状态: 0-停止, 1-运行, 2-故障',
  `position_status` tinyint DEFAULT NULL COMMENT '位置状态: 0-未到位, 1-到位',
  `communication_quality` tinyint DEFAULT NULL COMMENT '通信质量: 0-差, 1-一般, 2-良好',
  `signal_strength` tinyint DEFAULT NULL COMMENT '信号强度(%)',
  `data_quality` tinyint DEFAULT NULL COMMENT '数据质量: 0-无效, 1-有效, 2-异常',
  `data_time` datetime NOT NULL COMMENT '数据时间',
  `collection_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '采集时间',
  PRIMARY KEY (`id`),
  KEY `idx_device_id` (`device_id`),
  KEY `idx_data_time` (`data_time`),
  KEY `idx_collection_time` (`collection_time`),
  KEY `idx_data_time_device` (`data_time`,`device_id`),
  KEY `idx_history_device_time` (`device_id`,`data_time`),
  KEY `idx_history_time_quality` (`data_time`,`data_quality`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='历史数据表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `valve_history_data`
--

LOCK TABLES `valve_history_data` WRITE;
/*!40000 ALTER TABLE `valve_history_data` DISABLE KEYS */;
/*!40000 ALTER TABLE `valve_history_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `valve_realtime_data`
--

DROP TABLE IF EXISTS `valve_realtime_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `valve_realtime_data` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '数据ID',
  `device_id` bigint NOT NULL COMMENT '设备ID',
  `valve_status` tinyint DEFAULT NULL COMMENT '阀门状态: 0-关闭, 1-开启, 2-中间位置',
  `open_degree` decimal(5,2) DEFAULT NULL COMMENT '开度(%)',
  `pressure` decimal(10,3) DEFAULT NULL COMMENT '压力(MPa)',
  `temperature` decimal(5,2) DEFAULT NULL COMMENT '温度(℃)',
  `flow_rate` decimal(10,3) DEFAULT NULL COMMENT '流量(m³/h)',
  `control_signal` decimal(5,2) DEFAULT NULL COMMENT '控制信号(%)',
  `feedback_signal` decimal(5,2) DEFAULT NULL COMMENT '反馈信号(%)',
  `voltage` decimal(5,2) DEFAULT NULL COMMENT '电压(V)',
  `current` decimal(5,2) DEFAULT NULL COMMENT '电流(A)',
  `power` decimal(8,2) DEFAULT NULL COMMENT '功率(W)',
  `motor_status` tinyint DEFAULT NULL COMMENT '电机状态: 0-停止, 1-运行, 2-故障',
  `position_status` tinyint DEFAULT NULL COMMENT '位置状态: 0-未到位, 1-到位',
  `communication_quality` tinyint DEFAULT NULL COMMENT '通信质量: 0-差, 1-一般, 2-良好',
  `signal_strength` tinyint DEFAULT NULL COMMENT '信号强度(%)',
  `data_time` datetime NOT NULL COMMENT '数据时间',
  `collection_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '采集时间',
  PRIMARY KEY (`id`),
  KEY `idx_device_id` (`device_id`),
  KEY `idx_data_time` (`data_time`),
  KEY `idx_collection_time` (`collection_time`),
  KEY `idx_valve_status` (`valve_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='实时数据表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `valve_realtime_data`
--

LOCK TABLES `valve_realtime_data` WRITE;
/*!40000 ALTER TABLE `valve_realtime_data` DISABLE KEYS */;
/*!40000 ALTER TABLE `valve_realtime_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `valve_statistics`
--

DROP TABLE IF EXISTS `valve_statistics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `valve_statistics` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '统计ID',
  `device_id` bigint NOT NULL COMMENT '设备ID',
  `statistics_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '统计类型: 日统计/月统计/年统计',
  `statistics_date` date NOT NULL COMMENT '统计日期',
  `open_degree_avg` decimal(5,2) DEFAULT NULL COMMENT '平均开度(%)',
  `open_degree_min` decimal(5,2) DEFAULT NULL COMMENT '最小开度(%)',
  `open_degree_max` decimal(5,2) DEFAULT NULL COMMENT '最大开度(%)',
  `open_time_hours` decimal(8,2) DEFAULT NULL COMMENT '开启时间(小时)',
  `close_time_hours` decimal(8,2) DEFAULT NULL COMMENT '关闭时间(小时)',
  `pressure_avg` decimal(10,3) DEFAULT NULL COMMENT '平均压力(MPa)',
  `pressure_min` decimal(10,3) DEFAULT NULL COMMENT '最小压力(MPa)',
  `pressure_max` decimal(10,3) DEFAULT NULL COMMENT '最大压力(MPa)',
  `temperature_avg` decimal(5,2) DEFAULT NULL COMMENT '平均温度(℃)',
  `temperature_min` decimal(5,2) DEFAULT NULL COMMENT '最低温度(℃)',
  `temperature_max` decimal(5,2) DEFAULT NULL COMMENT '最高温度(℃)',
  `flow_rate_total` decimal(15,3) DEFAULT NULL COMMENT '总流量(m³)',
  `flow_rate_avg` decimal(10,3) DEFAULT NULL COMMENT '平均流量(m³/h)',
  `power_consumption` decimal(10,2) DEFAULT NULL COMMENT '功耗(kWh)',
  `operation_count` int DEFAULT NULL COMMENT '操作次数',
  `fault_count` int DEFAULT NULL COMMENT '故障次数',
  `alarm_count` int DEFAULT NULL COMMENT '报警次数',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_device_type_date` (`device_id`,`statistics_type`,`statistics_date`),
  KEY `idx_device_id` (`device_id`),
  KEY `idx_statistics_type` (`statistics_type`),
  KEY `idx_statistics_date` (`statistics_date`),
  CONSTRAINT `valve_statistics_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `valve_system`.`valve_devices` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='统计数据表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `valve_statistics`
--

LOCK TABLES `valve_statistics` WRITE;
/*!40000 ALTER TABLE `valve_statistics` DISABLE KEYS */;
/*!40000 ALTER TABLE `valve_statistics` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-05 21:59:55
