-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: ecologica
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `beneficio`
--

DROP TABLE IF EXISTS `beneficio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `beneficio` (
  `id_beneficio` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(100) NOT NULL,
  `descricao` text,
  `pontos_necessarios` int NOT NULL,
  PRIMARY KEY (`id_beneficio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `beneficio`
--

LOCK TABLES `beneficio` WRITE;
/*!40000 ALTER TABLE `beneficio` DISABLE KEYS */;
/*!40000 ALTER TABLE `beneficio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `campanha`
--

DROP TABLE IF EXISTS `campanha`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `campanha` (
  `id_campanha` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(100) NOT NULL,
  `descricao` text,
  `data_inicio` date DEFAULT NULL,
  `data_fim` date DEFAULT NULL,
  `id_apoiadora` int DEFAULT NULL,
  PRIMARY KEY (`id_campanha`),
  KEY `id_apoiadora` (`id_apoiadora`),
  KEY `idx_campanha_datas` (`data_inicio`,`data_fim`),
  CONSTRAINT `campanha_ibfk_1` FOREIGN KEY (`id_apoiadora`) REFERENCES `empresaapoiadora` (`id_apoiadora`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campanha`
--

LOCK TABLES `campanha` WRITE;
/*!40000 ALTER TABLE `campanha` DISABLE KEYS */;
/*!40000 ALTER TABLE `campanha` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empresaapoiadora`
--

DROP TABLE IF EXISTS `empresaapoiadora`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empresaapoiadora` (
  `id_apoiadora` int NOT NULL,
  `cnpj` varchar(18) NOT NULL,
  `endereco` varchar(200) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id_apoiadora`),
  UNIQUE KEY `cnpj` (`cnpj`),
  CONSTRAINT `empresaapoiadora_ibfk_1` FOREIGN KEY (`id_apoiadora`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empresaapoiadora`
--

LOCK TABLES `empresaapoiadora` WRITE;
/*!40000 ALTER TABLE `empresaapoiadora` DISABLE KEYS */;
INSERT INTO `empresaapoiadora` VALUES (3,'98.765.432/0001-11','Av. Sustentável, 200','(11) 98888-7777');
/*!40000 ALTER TABLE `empresaapoiadora` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empresarecicladora`
--

DROP TABLE IF EXISTS `empresarecicladora`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empresarecicladora` (
  `id_recicladora` int NOT NULL,
  `cnpj` varchar(18) NOT NULL,
  `endereco` varchar(200) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id_recicladora`),
  UNIQUE KEY `cnpj` (`cnpj`),
  CONSTRAINT `empresarecicladora_ibfk_1` FOREIGN KEY (`id_recicladora`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empresarecicladora`
--

LOCK TABLES `empresarecicladora` WRITE;
/*!40000 ALTER TABLE `empresarecicladora` DISABLE KEYS */;
INSERT INTO `empresarecicladora` VALUES (2,'12.345.678/0001-99','Rua das Árvores, 100','(11) 99999-8888');
/*!40000 ALTER TABLE `empresarecicladora` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estatistica`
--

DROP TABLE IF EXISTS `estatistica`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estatistica` (
  `id_estatistica` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `tipo` varchar(100) DEFAULT NULL,
  `valor` decimal(10,2) DEFAULT NULL,
  `data` date DEFAULT NULL,
  PRIMARY KEY (`id_estatistica`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `estatistica_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estatistica`
--

LOCK TABLES `estatistica` WRITE;
/*!40000 ALTER TABLE `estatistica` DISABLE KEYS */;
/*!40000 ALTER TABLE `estatistica` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historico`
--

DROP TABLE IF EXISTS `historico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historico` (
  `id_historico` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `acao` varchar(200) DEFAULT NULL,
  `data` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_historico`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `historico_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historico`
--

LOCK TABLES `historico` WRITE;
/*!40000 ALTER TABLE `historico` DISABLE KEYS */;
/*!40000 ALTER TABLE `historico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `localcoleta`
--

DROP TABLE IF EXISTS `localcoleta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `localcoleta` (
  `id_local` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) DEFAULT NULL,
  `endereco` varchar(200) DEFAULT NULL,
  `id_recicladora` int DEFAULT NULL,
  PRIMARY KEY (`id_local`),
  KEY `id_recicladora` (`id_recicladora`),
  CONSTRAINT `localcoleta_ibfk_1` FOREIGN KEY (`id_recicladora`) REFERENCES `empresarecicladora` (`id_recicladora`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `localcoleta`
--

LOCK TABLES `localcoleta` WRITE;
/*!40000 ALTER TABLE `localcoleta` DISABLE KEYS */;
/*!40000 ALTER TABLE `localcoleta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `noticia`
--

DROP TABLE IF EXISTS `noticia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `noticia` (
  `id_noticia` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(150) DEFAULT NULL,
  `conteudo` text,
  `data_publicacao` date DEFAULT NULL,
  `autor` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_noticia`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `noticia`
--

LOCK TABLES `noticia` WRITE;
/*!40000 ALTER TABLE `noticia` DISABLE KEYS */;
/*!40000 ALTER TABLE `noticia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ranking`
--

DROP TABLE IF EXISTS `ranking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ranking` (
  `id_ranking` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `pontos` int DEFAULT '0',
  `posicao` int DEFAULT NULL,
  PRIMARY KEY (`id_ranking`),
  KEY `id_usuario` (`id_usuario`),
  KEY `idx_ranking_pontos` (`pontos`),
  CONSTRAINT `ranking_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ranking`
--

LOCK TABLES `ranking` WRITE;
/*!40000 ALTER TABLE `ranking` DISABLE KEYS */;
/*!40000 ALTER TABLE `ranking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solicitacao`
--

DROP TABLE IF EXISTS `solicitacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solicitacao` (
  `id_solicitacao` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `id_recicladora` int DEFAULT NULL,
  `descricao` text,
  `status` enum('pendente','andamento','concluida') DEFAULT 'pendente',
  `data_solicitacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_solicitacao`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_recicladora` (`id_recicladora`),
  KEY `idx_solicitacao_status` (`status`),
  CONSTRAINT `solicitacao_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `solicitacao_ibfk_2` FOREIGN KEY (`id_recicladora`) REFERENCES `empresarecicladora` (`id_recicladora`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitacao`
--

LOCK TABLES `solicitacao` WRITE;
/*!40000 ALTER TABLE `solicitacao` DISABLE KEYS */;
/*!40000 ALTER TABLE `solicitacao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `tipo_usuario` enum('cidadao','recicladora','apoiadora','admin') NOT NULL,
  `data_cadastro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_usuario_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Admin Geral','admin@sistema.com','8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92','admin','2025-09-14 22:57:28'),(2,'Recicladora Verde','contato@verde.com','8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92','recicladora','2025-09-14 22:58:50'),(3,'Apoiadora Eco','eco@apoio.com','8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92','apoiadora','2025-09-14 22:59:59');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `vw_ranking`
--

DROP TABLE IF EXISTS `vw_ranking`;
/*!50001 DROP VIEW IF EXISTS `vw_ranking`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_ranking` AS SELECT 
 1 AS `nome`,
 1 AS `pontos`,
 1 AS `posicao`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_solicitacoes`
--

DROP TABLE IF EXISTS `vw_solicitacoes`;
/*!50001 DROP VIEW IF EXISTS `vw_solicitacoes`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_solicitacoes` AS SELECT 
 1 AS `id_solicitacao`,
 1 AS `usuario`,
 1 AS `recicladora`,
 1 AS `descricao`,
 1 AS `status`,
 1 AS `data_solicitacao`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `vw_ranking`
--

/*!50001 DROP VIEW IF EXISTS `vw_ranking`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_ranking` AS select `u`.`nome` AS `nome`,`r`.`pontos` AS `pontos`,rank() OVER (ORDER BY `r`.`pontos` desc )  AS `posicao` from (`ranking` `r` join `usuario` `u` on((`u`.`id_usuario` = `r`.`id_usuario`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_solicitacoes`
--

/*!50001 DROP VIEW IF EXISTS `vw_solicitacoes`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_solicitacoes` AS select `s`.`id_solicitacao` AS `id_solicitacao`,`u`.`nome` AS `usuario`,`e`.`cnpj` AS `recicladora`,`s`.`descricao` AS `descricao`,`s`.`status` AS `status`,`s`.`data_solicitacao` AS `data_solicitacao` from ((`solicitacao` `s` join `usuario` `u` on((`u`.`id_usuario` = `s`.`id_usuario`))) join `empresarecicladora` `e` on((`e`.`id_recicladora` = `s`.`id_recicladora`))) */;
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

-- Dump completed on 2025-10-05 23:44:35
