-- -----------------------------------------------------
-- Schema ecologica
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `ecologica` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `ecologica` ;

-- -----------------------------------------------------
-- Tabela `usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `usuario` (
  `id_usuario` BIGINT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `cpf` VARCHAR(14) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `senha` VARCHAR(255) NOT NULL,
  `tipo_usuario` VARCHAR(255) NOT NULL,
  `data_cadastro` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `status` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id_usuario`),
  INDEX `idx_usuario_email` (`email` ASC) VISIBLE
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Tabela `empresaapoiadora`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `empresaapoiadora` (
  `id_apoiadora` BIGINT NOT NULL,
  `cnpj` VARCHAR(18) NOT NULL UNIQUE,
  `endereco` VARCHAR(200) NULL DEFAULT NULL,
  `telefone` VARCHAR(20) NULL DEFAULT NULL,
  PRIMARY KEY (`id_apoiadora`),
  CONSTRAINT `fk_empresaapoiadora_usuario`
    FOREIGN KEY (`id_apoiadora`)
    REFERENCES `usuario` (`id_usuario`)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Tabela `empresarecicladora`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `empresarecicladora` (
  `id_recicladora` BIGINT NOT NULL,
  `cnpj` VARCHAR(18) NOT NULL UNIQUE,
  `endereco` VARCHAR(200) NULL DEFAULT NULL,
  `telefone` VARCHAR(20) NULL DEFAULT NULL,
  PRIMARY KEY (`id_recicladora`),
  CONSTRAINT `fk_empresarecicladora_usuario`
    FOREIGN KEY (`id_recicladora`)
    REFERENCES `usuario` (`id_usuario`)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Tabela `beneficio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `beneficio` (
  `id_beneficio` BIGINT NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(100) NOT NULL,
  `descricao` TEXT NULL DEFAULT NULL,
  `pontos_necessarios` INT NOT NULL,
  PRIMARY KEY (`id_beneficio`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Tabela `campanha`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `campanha` (
  `id_campanha` BIGINT NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(100) NOT NULL,
  `descricao` TEXT NULL DEFAULT NULL,
  `data_inicio` DATE NULL DEFAULT NULL,
  `data_fim` DATE NULL DEFAULT NULL,
  `id_apoiadora` BIGINT NULL DEFAULT NULL,
  PRIMARY KEY (`id_campanha`),
  INDEX `idx_campanha_datas` (`data_inicio` ASC, `data_fim` ASC) VISIBLE,
  INDEX `fk_campanha_apoiadora_idx` (`id_apoiadora` ASC) VISIBLE,
  CONSTRAINT `fk_campanha_apoiadora`
    FOREIGN KEY (`id_apoiadora`)
    REFERENCES `empresaapoiadora` (`id_apoiadora`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Tabela `estatistica`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `estatistica` (
  `id_estatistica` BIGINT NOT NULL AUTO_INCREMENT,
  `id_usuario` BIGINT NULL DEFAULT NULL,
  `tipo` VARCHAR(100) NULL DEFAULT NULL,
  `valor` DECIMAL(10,2) NULL DEFAULT NULL,
  `data` DATE NULL DEFAULT NULL,
  PRIMARY KEY (`id_estatistica`),
  INDEX `fk_estatistica_usuario_idx` (`id_usuario` ASC) VISIBLE,
  CONSTRAINT `fk_estatistica_usuario`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Tabela `historico` (REFATORADA para RN008)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `historico` (
  `id_historico` BIGINT NOT NULL AUTO_INCREMENT,
  `id_usuario` BIGINT NULL DEFAULT NULL,
  `descricao` VARCHAR(200) NULL DEFAULT NULL,
  `pontos` INT NOT NULL DEFAULT 0,
  `data` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `expirado` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id_historico`),
  INDEX `fk_historico_usuario_idx` (`id_usuario` ASC) VISIBLE,
  CONSTRAINT `fk_historico_usuario`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Tabela `localcoleta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `localcoleta` (
  `id_local` BIGINT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NULL DEFAULT NULL,
  `endereco` VARCHAR(200) NULL DEFAULT NULL,
  `id_recicladora` BIGINT NULL DEFAULT NULL,
  PRIMARY KEY (`id_local`),
  INDEX `fk_localcoleta_recicladora_idx` (`id_recicladora` ASC) VISIBLE,
  CONSTRAINT `fk_localcoleta_recicladora`
    FOREIGN KEY (`id_recicladora`)
    REFERENCES `empresarecicladora` (`id_recicladora`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Tabela `noticia`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `noticia` (
  `id_noticia` BIGINT NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(150) NULL DEFAULT NULL,
  `conteudo` TEXT NULL DEFAULT NULL,
  `data_publicacao` DATE NULL DEFAULT NULL,
  `autor` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`id_noticia`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Tabela `ranking`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ranking` (
  `id_ranking` BIGINT NOT NULL AUTO_INCREMENT,
  `id_usuario` BIGINT NULL DEFAULT NULL,
  `pontos` INT NULL DEFAULT '0',
  `posicao` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id_ranking`),
  UNIQUE INDEX `id_usuario_UNIQUE` (`id_usuario` ASC) VISIBLE,
  INDEX `idx_ranking_pontos` (`pontos` DESC) VISIBLE,
  CONSTRAINT `fk_ranking_usuario`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Tabela `solicitacao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `solicitacao` (
  `id_solicitacao` BIGINT NOT NULL AUTO_INCREMENT,
  `id_usuario` BIGINT NULL DEFAULT NULL,
  `id_recicladora` BIGINT NULL DEFAULT NULL,
  `descricao` TEXT NULL DEFAULT NULL,
  `status` VARCHAR(255) NULL DEFAULT 'pendente',
  `data_solicitacao` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_solicitacao`),
  INDEX `fk_solicitacao_usuario_idx` (`id_usuario` ASC) VISIBLE,
  INDEX `fk_solicitacao_recicladora_idx` (`id_recicladora` ASC) VISIBLE,
  INDEX `idx_solicitacao_status` (`status` ASC) VISIBLE,
  CONSTRAINT `fk_solicitacao_recicladora`
    FOREIGN KEY (`id_recicladora`)
    REFERENCES `empresarecicladora` (`id_recicladora`),
  CONSTRAINT `fk_solicitacao_usuario`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Tabela `password_reset_token`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `password_reset_token` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `token` VARCHAR(255) NOT NULL UNIQUE,
  `id_usuario` BIGINT NOT NULL,
  `expiry_date` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_reset_token_usuario_idx` (`id_usuario` ASC) VISIBLE,
  CONSTRAINT `fk_reset_token_usuario`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `usuario` (`id_usuario`)
    ON DELETE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabela `tipos_materiais`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tipos_materiais` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `nome_tipo` VARCHAR(255) NULL,
  `descricao` TEXT NULL,
  `ativo` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabela `materiais_coletar`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `materiais_coletar` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `nome_material` VARCHAR(255) NULL,
  `descricao` TEXT NULL,
  `reciclavel` TINYINT(1) NOT NULL DEFAULT 0,
  `tipo_material_id` BIGINT NULL,
  `local_coleta_id` BIGINT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_materiais_tipo_idx` (`tipo_material_id` ASC) VISIBLE,
  INDEX `fk_materiais_local_idx` (`local_coleta_id` ASC) VISIBLE,
  CONSTRAINT `fk_materiais_tipo`
    FOREIGN KEY (`tipo_material_id`)
    REFERENCES `tipos_materiais` (`id`),
  CONSTRAINT `fk_materiais_local`
    FOREIGN KEY (`local_coleta_id`)
    REFERENCES `localcoleta` (`id_local`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabela `gestao_conteudo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gestao_conteudo` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `tipo_conteudo` VARCHAR(255) NULL,
  `titulo` VARCHAR(255) NULL,
  `descricao` TEXT NULL,
  `publicado` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabela `exibicao_orientacoes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `exibicao_orientacoes` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(255) NULL,
  `conteudo` TEXT NULL,
  `ativo` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabela `permissao_uso_pontos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `permissao_uso_pontos` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `usuario_id` BIGINT NULL,
  `permitido` TINYINT(1) NOT NULL DEFAULT 0,
  `motivo` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_permissao_usuario_idx` (`usuario_id` ASC) VISIBLE,
  CONSTRAINT `fk_permissao_usuario`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `usuario` (`id_usuario`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabela `cadastro_dias_horarios` (REFATORADA para RN010/RN017)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cadastro_dias_horarios` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `local_coleta_id` BIGINT NOT NULL,
  `dia_semana` VARCHAR(255) NULL,
  `horario_inicio` VARCHAR(255) NULL,
  `horario_fim` VARCHAR(255) NULL,
  `ativo` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX `fk_dias_horarios_local_idx` (`local_coleta_id` ASC) VISIBLE,
  CONSTRAINT `fk_dias_horarios_local`
    FOREIGN KEY (`local_coleta_id`)
    REFERENCES `localcoleta` (`id_local`)
    ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `localcoleta_tipos_materiais` (
  `local_id` BIGINT NOT NULL,
  `tipo_id` BIGINT NOT NULL,
  PRIMARY KEY (`local_id`, `tipo_id`),
  INDEX `idx_local_tipo_local` (`local_id` ASC),
  INDEX `idx_local_tipo_material` (`tipo_id` ASC),
  CONSTRAINT `fk_lctm_local`
    FOREIGN KEY (`local_id`)
    REFERENCES `localcoleta` (`id_local`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_lctm_tipo`
    FOREIGN KEY (`tipo_id`)
    REFERENCES `tipos_materiais` (`id`)
    ON DELETE CASCADE
) ENGINE = InnoDB;
-- -----------------------------------------------------
-- Inserção de Dados
-- -----------------------------------------------------
LOCK TABLES `usuario` WRITE;
INSERT INTO `usuario` (`id_usuario`, `nome`, `cpf`, `email`, `senha`, `tipo_usuario`, `data_cadastro`, `status`) VALUES
(1, 'Admin Geral', '000.000.000-00', 'admin@sistema.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'admin', '2025-09-14 22:57:28', 'ATIVO'),
(2, 'Recicladora Verde', '111.111.111-11', 'contato@verde.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'recicladora', '2025-09-14 22:58:50', 'ATIVO'),
(3, 'Apoiadora Eco', '222.222.222-22', 'eco@apoio.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'apoiadora', '2025-09-14 22:59:59', 'ATIVO');
UNLOCK TABLES;

LOCK TABLES `empresarecicladora` WRITE;
INSERT INTO `empresarecicladora` VALUES (2,'12.345.678/0001-99','Rua das Árvores, 100','(11) 99999-8888');
UNLOCK TABLES;

LOCK TABLES `empresaapoiadora` WRITE;
INSERT INTO `empresaapoiadora` VALUES (3,'98.765.432/0001-11','Av. Sustentável, 200','(11) 98888-7777');
UNLOCK TABLES;