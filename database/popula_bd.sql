-- Script para popular o banco de dados SCE.
-- Utilizado somente para testes.
--


-- Inserção de orientadores
INSERT INTO `sce`.`orientador` (`siap`, `nome`) VALUES ('110', 'Franciel Amorim');
INSERT INTO `sce`.`orientador` (`siap`, `nome`) VALUES ('111', 'Michell Loureiro');
INSERT INTO `sce`.`orientador` (`siap`, `nome`) VALUES ('112', 'Landry Silva');

-- Inserção de empresas
INSERT INTO `sce`.`empresa` (`id_empresa`, `nome`, `razao_social`, 
							 `cnpj`, `email`, `telefone`, `telefone_2`, 
                             `endereco_rua`, `endereco_numero`, 
                             `endereco_bairro`, `endereco_cep`) 
                             VALUES ('1', 'Supernorte', 
									 'Supermercados do Norte do Brasil Ltda.',
                                     '05327241000163', 
                                     '',
                                     '',
                                     '',
                                     'Rua Lauro Sodré',
                                     '640',
                                     'São José',
                                     '');

INSERT INTO `sce`.`empresa` (`id_empresa`, `nome`, `razao_social`, 
							 `cnpj`, `email`, `telefone`, `telefone_2`, 
                             `endereco_rua`, `endereco_numero`, 
                             `endereco_bairro`, `endereco_cep`) 
                             VALUES ('2', 'Eletronorte', 
									 'Centrais Elétricas do Norte do Brasil S/A Ele.',
                                     '00357038002240', 
                                     '',
                                     '',
                                     '',
                                     'Av. Professora Edna Affi',
                                     '8444',
                                     'Tijucal',
                                     '');

-- Inserção de turmas
INSERT INTO `sce`.`turma` (`id_turma`, `turno`, `curso`) 
						  VALUES ('T228-4MA', 'Matutino', 
                          'Manutenção e Suporte à Informática');
                          
-- INSERT INTO `sce`.`turma` (`id_turma`, `turno`, `curso`) VALUES ('', '', '');
-- INSERT INTO `sce`.`turma` (`id_turma`, `turno`, `curso`) VALUES ('', '', '');