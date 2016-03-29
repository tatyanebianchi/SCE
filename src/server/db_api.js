/**
 * Este arquivo pertence ao SCE - Sistema de Controle de Estágio -, cuja função
 * é realizar o controle de estágio para discentes do IFPA.
 * Copyright (C) 2015  Rafael Campos Nunes
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * Interface de programação da apliação.  Responsável  por  retornar ou enviar
 * dados do banco de dados para posterior tratamento,  e  finalmente  enviar a
 * informação ao cliente.
 */

'use strict'

// SCE
var mysqlPool = require('./db_pool.js')
var SCEUtils = require('./server_utils.js')

// Node.js
var mysql = require('mysql')

/**
 * Função que retorna todas as empresas da tabela empresas do
 * banco de dados do SCE.
 * @param {Function} callback Função chamada após a query no banco
 * de dados.
 */
exports.getEmpresas = function (callback) {
  mysqlPool.query('SELECT * FROM sce.empresa;', callback)
}

/**
 * @param {Function} callback Função chamada após a query no banco
 * de dados.
 */
exports.getOrientadores = function (callback) {
  mysqlPool.query('SELECT * FROM sce.orientador;', callback)
}

/**
* @param {Function} callback Função chamada após a query no banco
 * de dados.
 */
exports.getClasses = function (callback) {
  mysqlPool.query('SELECT * FROM sce.turma;', callback)
}

/**
 * @param {Function} callback Função chamada após a query no banco
 * de dados.
 */
exports.getEstagiarios = function (callback) {
  mysqlPool.query('SELECT * FROM sce.estagiario;', callback)
}

/**
 * @param {Function} callback Função chamada após a query no banco
 * de dados.
 */
exports.getUsuarios = function (return_data) {
  mysqlPool.query('SELECT * FROM sce.usuario;', return_data)
}

/**
 * @param {String} table A tabela utilizada para procurar pelo valor what.
 * @param {Object} search_value O valor da pesquisa. É definido como o exemplo:
 * {
 *  "search_string" : "string a ser pesquisada no bd",
 *  "search_for": ["rótulo do que pesquisar no bd", "pesquisar pelo que?"]
 * }
 * @param {Function} callback Função chamada após a query no banco
 * de dados.
 */
exports.search = function (table, search_obj, return_data) {
  var constantesDePesquisa = {
    nome: 'WHERE nome LIKE ?',
    matricula: 'WHERE matricula LIKE ?',
    siap: 'WHERE siap LIKE ?',
    id_turma: 'WHERE id_turma LIKE ?',
    id_empresa: 'WHERE id_empresa LIKE ?'
  }

  var sqlQuery = 'SELECT * FROM ?? '

  if (search_obj.search_for[1] === 'nome') {
    sqlQuery += constantesDePesquisa.nome
    search_obj.search_string += '%'
  } else if (search_obj.search_for[1] === 'matricula') {
    sqlQuery += constantesDePesquisa.matricula
    search_obj.search_string += '%'
  } else if (search_obj.search_for[1] === 'siap') {
    sqlQuery += constantesDePesquisa.siap
    search_obj.search_string += '%'
  } else if (search_obj.search_for[1] === 'id_empresa') {
    sqlQuery += constantesDePesquisa.id_empresa
  } else if (search_obj.search_for[1] === 'id_turma') {
    sqlQuery += constantesDePesquisa.id_turma
    search_obj.search_string += '%'
  }

  var inserts = [table, search_obj.search_string]

  sqlQuery = mysql.format(sqlQuery, inserts)

  SCEUtils.writeLog('Query a ser executada no banco de dados: ' + sqlQuery, '903')
  mysqlPool.query(sqlQuery, return_data)
}

/**
 * Método para inserir um estagiário ao banco de dados.
 * @param {Array} data
 * @param {Function} callback Função chamada após a query no banco
 * de dados.
 */
exports.insertEstagiario = function (data, callback) {
  // Usando prepared statements.
  var sqlQuery = 'INSERT INTO sce.estagiario (??, ??, ??, ??, ??,' +
                                            '??, ??, ??, ??, ??)' +
                                            ' VALUES (?, ?, ?, ?,' +
                                            ' ?, ?, ?, ?, ?, ?)'

  var inserts = ['matricula', 'nome', 'periodo_inicio', 'periodo_fim', 'empresa',
                 'foto', 'observacao', 'empresa_id_empresa', 'turma_id_turma',
                 'orientador_siap', data[0], data[1], data[2], data[3], data[4],
                 data[5], data[6], data[7], data[8], data[9]]

  sqlQuery = mysql.format(sqlQuery, inserts)

  SCEUtils.writeLog('Query a ser executada no banco de dados: ' + sqlQuery, '903')
  mysqlPool.query(sqlQuery, callback)
}

/**
 * Método para inserir uma empresa ao banco de dados.
 * @param {Array} data
 * @param {Function} callback Função chamada após a query no banco
 * de dados.
 */
exports.insertEmpresa = function (data, callback) {
  // Usando prepared statements.
  var sqlQuery = 'INSERT INTO sce.empresa (??, ??, ??, ??, ??,' +
                                            '??, ??, ??, ??, ??)' +
                                            'VALUES (?, ?, ?, ?,' +
                                            '?, ?, ?, ?, ?, ?)'

  var inserts = ['nome', 'razao_social', 'cnpj', 'email', 'telefone',
                 'telefone_2', 'endereco_rua', 'endereco_numero',
                 'endereco_bairro', 'endereco_cep', data[0], data[1], data[2],
                 data[3], data[4], data[5], data[6], data[7], data[8], data[9]]

  sqlQuery = mysql.format(sqlQuery, inserts)

  SCEUtils.writeLog('Query a ser executada no banco de dados: ' + sqlQuery, '903')
  mysqlPool.query(sqlQuery, callback)
}

/**
 * Método para inserir um orientador ao banco de dados.
 * @param {Array} data Um vetor contendo todos os dados para a inserção do orientador
 * @param {Funcion} callback Função chamada após a execução da query.
 */
exports.insertOrientador = function (data, callback) {
  var sqlQuery = 'INSERT INTO sce.orientador (??, ??) VALUES (?, ?)'

  var inserts = ['siap', 'nome', data[0], data[1]]

  sqlQuery = mysql.format(sqlQuery, inserts)

  SCEUtils.writeLog('Query a ser executada no banco de dados: ' + sqlQuery, '903')
  mysqlPool.query(sqlQuery, callback)
}

exports.insertTurma = function (data, callback) {
  var sqlQuery = 'INSERT INTO turma (??, ??, ??) VALUES(?, ?, ?)'

  var inserts = ['id_turma', 'turno', 'curso', data[0], data[1], data[2]]

  sqlQuery = mysql.format(sqlQuery, inserts)

  SCEUtils.writeLog('Query a ser executada no banco de dados: ' + sqlQuery, '903')
  mysqlPool.query(sqlQuery, callback)
}

/**
 * Método para remover uma empresa do banco de dados.
 * @param {Array} idEmpresa
 * @param {Function} callback Função chamada após a query no banco
 * de dados.
 */
exports.deleteEmpresa = function (idEmpresa, callback) {
  var sqlQuery = 'DELETE FROM sce.empresa ' +
                  'WHERE sce.empresa.id_empresa = ?'

  var inserts = [idEmpresa]

  sqlQuery = mysql.format(sqlQuery, inserts)

  SCEUtils.writeLog('Query a ser executada no banco de dados: ' + sqlQuery, '903')
  mysqlPool.query(sqlQuery, callback)
}

/**
 * Método para remover um estagiário do banco de dados.
 * @param {String} matricula
 * @param {Function} callback Função a ser chamada após a execução da query.
 */
exports.deleteEstagiario = function (matricula, callback) {
  var sqlQuery = 'DELETE FROM sce.estagiario ' +
                  'WHERE sce.estagiario.matricula = ?'

  var inserts = [matricula]

  sqlQuery = mysql.format(sqlQuery, inserts)

  SCEUtils.writeLog('Query a ser executada no banco de dados: ' + sqlQuery, '903')
  mysqlPool.query(sqlQuery, callback)
}

/**
 * Método para remover um orientador do banco de dados.
 * @param {Integer} siap
 * @param {Function} callback Função a ser chamada após a execução da query.
 */
exports.deleteOrientador = function (siap, callback) {
  var sqlQuery = 'DELETE FROM sce.orientador ' +
                  'WHERE sce.orientador.siap = ?'

  var inserts = [siap]

  sqlQuery = mysql.format(sqlQuery, inserts)

  SCEUtils.writeLog('Query a ser executada no banco de dados: ' + sqlQuery, '903')
  mysqlPool.query(sqlQuery, callback)
}

/**
 * Função para remover uma turma do banco de dados.
 * @param {String} idTurma
 * @param {Function} callback Função a ser chamada após a execução da query.
 */
exports.deleteTurma = function (idTurma, callback) {
  var sqlQuery = 'DELETE FROM sce.turma ' +
                  'WHERE sce.turma.id_turma = ?'

  var inserts = [idTurma]

  sqlQuery = mysql.format(sqlQuery, inserts)

  SCEUtils.writeLog('Query a ser executada no banco de dados: ' + sqlQuery, '903')
  mysqlPool.query(sqlQuery, callback)
}

/**
 * TODO: Terminar e testar, não finalizado.
 * Função para atualizar uma linha da tabela estagiário no banco de dados.
 * @param {Integer} matricula Antiga matricula, utilizada para identificar o estagiário
 * no banco de dados.
 * @param {Array} data Os dados para atualização do estagiário.
 * @param {Function} callback Função a ser chamada após a execução da query.
 */
exports.updateEstagiario = function (matricula, data, callback) {
  var sqlQuery = 'UPDATE estagiario SET nome = ?, periodo_inicio = ?, periodo_fim = ?,  ' +
                  'empresa = ?, foto = ?, observacao = ? WHERE matricula = ?'

  var inserts = []

  sqlQuery = mysql.format(sqlQuery, inserts)
  mysqlPool.query(sqlQuery, callback)
}

/**
 * TODO: Terminar e testar, não finalizado.
 * Função para atualizar uma linha da tabela empresa no banco de dados.
 * @param {Integer} idEmpresa Antigo id_empres, utilizado para identificar a empresa
 * a ser atualizada.
 * @param {Array} data Os dados para atualização do orientador
 * @param {Function} callback Função a ser chamada após a execução da query.
 */
exports.updateEmpresa = function (idEmpresa, data, callback) {
  var sqlQuery = 'UPDATE empresa SET nome = ?, razao_social = ?, cnpj = ?, email = ?, ' +
                  'telefone = ?, telefone_2 = ?, endereco_rua = ?, endereco_numero = ?, ' +
                  'endereco_bairro = ?, endereco_cep = ? WHERE id_empresa = ?'

  var inserts = [data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7], data[8],
                 data[9], idEmpresa]

  sqlQuery = mysql.format(sqlQuery, inserts)
}

/**
 * Função para atualizar uma linha da tabela orientador no banco de dados.
 * @param {Integer} siap Antigo siap, utilizado para identificar o orientador
 * a ser atualizado.
 * @param {Array} data Os dados para atualização do orientador
 * @param {Function} callback Função a ser chamada após a execução da query.
 */
exports.updateOrientador = function (siap, data, callback) {
  var sqlQuery = 'UPDATE sce.orientador SET siap = ?, nome = ? WHERE siap = ?'

  var inserts = [data[0], data[1], siap]

  sqlQuery = mysql.format(sqlQuery, inserts)

  SCEUtils.writeLog('Query a ser executada no banco de dados: ' + sqlQuery, '903')
  mysqlPool.query(sqlQuery, callback)
}

/**
 * Função para atualizar uma linha da tabela turma no banco de dados.
 * @param {Integer} idTurma Antigo id_turma, utilizado para identificar a
 * turma a ser atualizada.
 * @param {Array} data Os dados para atualização da turma.
 * @param {Function} callback Função a ser chamada após a execução da query.
 */
exports.updateTurma = function (idTurma, data, callback) {
  var sqlQuery = 'UPDATE sce.turma SET id_turma = ?, turno = ?, curso = ? WHERE id_turma = ?'

  var inserts = [data[0], data[1], data[2], idTurma]

  sqlQuery = mysql.format(sqlQuery, inserts)

  SCEUtils.writeLog('Query a ser executada no banco de dados: ' + sqlQuery, '903')
  mysqlPool.query(sqlQuery, callback)
}

/**
 * Função para executar uma query generalizada (não específica).
 * @param {String} query O comando a ser executado no banco de dados.
 * @param {Function} callback Função a ser chamada após a execução da query.
 */
exports.query = function (query, callback) {
  mysqlPool.query(query, callback)
}
