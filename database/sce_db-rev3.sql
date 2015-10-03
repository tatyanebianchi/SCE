-- MySQL Script generated by MySQL Workbench
-- 10/03/15 12:07:35
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema sce
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema sce
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `sce` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `sce` ;

-- -----------------------------------------------------
-- Table `sce`.`orientador`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sce`.`orientador` (
  `siap` INT NOT NULL COMMENT '',
  `nome` VARCHAR(45) NOT NULL COMMENT '',
  PRIMARY KEY (`siap`)  COMMENT '')
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sce`.`empresa`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sce`.`empresa` (
  `idEmpresa` INT NOT NULL AUTO_INCREMENT COMMENT '',
  `nome` VARCHAR(45) NOT NULL COMMENT '',
  `razao social` VARCHAR(45) NULL COMMENT '',
  `cnpj` VARCHAR(45) NULL COMMENT '',
  `email` VARCHAR(45) NULL COMMENT '',
  `telefone` INT(11) NULL COMMENT '',
  `telefone_2` INT(11) NULL COMMENT '',
  `endereco_rua` VARCHAR(45) NULL COMMENT '',
  `endereco_numero` VARCHAR(45) NULL COMMENT '',
  `endereco_bairro` VARCHAR(45) NULL COMMENT '',
  `endereco_cep` VARCHAR(45) NULL COMMENT '',
  PRIMARY KEY (`idEmpresa`)  COMMENT '')
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sce`.`turma`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sce`.`turma` (
  `idturma` INT NOT NULL COMMENT '',
  `turno` VARCHAR(45) NOT NULL COMMENT '',
  `curso` VARCHAR(45) NOT NULL COMMENT '',
  PRIMARY KEY (`idturma`)  COMMENT '')
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sce`.`estagiario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sce`.`estagiario` (
  `matricula` INT NOT NULL COMMENT '',
  `nome` VARCHAR(45) NOT NULL COMMENT '',
  `periodo_inicio` DATE NOT NULL COMMENT '',
  `periodo_fim` DATE NOT NULL COMMENT '',
  `empresa` VARCHAR(45) NOT NULL COMMENT '',
  `orientador_siap` INT NOT NULL COMMENT '',
  `empresa_idEmpresa` INT NOT NULL COMMENT '',
  `foto` VARCHAR(256) NULL COMMENT '',
  `turma_idturma` INT NOT NULL COMMENT '',
  `observacao` VARCHAR(1024) NULL COMMENT '',
  PRIMARY KEY (`matricula`)  COMMENT '',
  INDEX `fk_estagiario_orientador_idx` (`orientador_siap` ASC)  COMMENT '',
  INDEX `fk_estagiario_empresa1_idx` (`empresa_idEmpresa` ASC)  COMMENT '',
  INDEX `fk_estagiario_turma1_idx` (`turma_idturma` ASC)  COMMENT '',
  CONSTRAINT `fk_estagiario_orientador`
    FOREIGN KEY (`orientador_siap`)
    REFERENCES `sce`.`orientador` (`siap`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_estagiario_empresa1`
    FOREIGN KEY (`empresa_idEmpresa`)
    REFERENCES `sce`.`empresa` (`idEmpresa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_estagiario_turma1`
    FOREIGN KEY (`turma_idturma`)
    REFERENCES `sce`.`turma` (`idturma`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sce`.`table1`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sce`.`table1` (
)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sce`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sce`.`usuario` (
  `usuario` VARCHAR(20) NOT NULL COMMENT '',
  `senha` VARCHAR(255) NOT NULL COMMENT '',
  `email` VARCHAR(45) NULL COMMENT '',
  PRIMARY KEY (`usuario`)  COMMENT '')
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
