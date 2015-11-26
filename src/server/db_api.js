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
 * Interface de programação da apliação.  Responsável  por  retornar  dados do
 * banco de dados para posterior tratamento, e finalmente enviar a informação
 * ao cliente.
 */

'use strict'

// SCE
var mysqlPool  = require('./db_pool.js'),
    utils       = require('./server_utils.js');

// Node.js
var node_utils  = require('util'),
    mysql       = require('mysql');

/**
 * @param {Function} callback
 */
exports.get_empresas = function(return_data) {
    mysqlPool.query("SELECT * FROM sce.empresa;", return_data);
}

/**
 * @param {Function} callback
 */
exports.get_orientadores = function(return_data) {
    mysqlPool.query("SELECT * FROM sce.orientador;", return_data);
}

/**
 * @param {Function} callback
 */
exports.get_classes = function(return_data) {
  mysqlPool.query("SELECT * FROM sce.turma;", return_data);
}

/**
 * @param {Function} callback
 */
exports.get_estagiarios = function(return_data) {
    mysqlPool.query("SELECT * FROM sce.estagiario;", return_data);
}

/**
 * @param {Function} callback
 */
exports.getUsuarios = function(return_data) {
    mysqlPool.query("SELECT * FROM sce.usuario;", return_data);
}

/**
 * @param {String} table A tabela utilizada para procurar pelo valor what.
 * @param {Object} search_value O valor da pesquisa. É definido como o exemplo:
 * {
 *  "search_string" : "string a ser pesquisada no bd",
 *  "search_for": ["rótulo do que pesquisar no bd", "pesquisar pelo que?"]
 * }
 * @param {Function} callback
 */
exports.search = function(table, search_obj, return_data) {
  var constantesDePesquisa = {
      nome: 'WHERE nome LIKE ?',
      matricula: 'WHERE matricula = ?',
      siap: 'WHERE siap = ?',
      id_turma: 'WHERE id_turma LIKE ?'
  }

  var sqlQuery = 'SELECT * FROM ??';

  // if(search_obj.search_for) {
    if(search_obj.search_for[1] == 'nome') {
        sqlQuery += constantesDePesquisa.nome;
        search_obj.search_string += '%';
    }
    else if(search_obj.search_for[1] == 'matricula') {
        sqlQuery += constantesDePesquisa.matricula;
    }
    else if(search_obj.search_for[1] == 'siap') {
        sqlQuery += constantesDePesquisa.siap;
    }
    else if(search_obj.search_for[1] == 'null') {
      sqlQuery += constantesDePesquisa.id_turma;
      search_obj.search_string += '%';
    }
  // }

  var inserts = [table, search_obj.search_string];

  sqlQuery = mysql.format(sqlQuery, inserts);

  utils.writeLog('Query a ser executada no banco de dados: ' + sqlQuery, '903');
  mysqlPool.query(sqlQuery, return_data);
}


exports.insert_estagiario = function(data, callback) {
  // Usando prepared statements.
  var sqlQuery = "INSERT INTO sce.estagiario (??, ??, ??, ??, ??," +
                                            "??, ??, ??, ??, ??)" +
                                            " VALUES (?, ?, ?, ?," +
                                            " ?, ?, ?, ?, ?, ?)";

  var inserts = ['matricula', 'nome', 'periodo_inicio', 'periodo_fim', 'empresa',
                 'foto', 'observacao', 'empresa_id_empresa', 'turma_id_turma',
                 'orientador_siap', data[0], data[1], data[2], data[3], data[4],
                 data[5],data[6], data[7], data[8], data[9]];

  sqlQuery = mysql.format(sqlQuery, inserts);

  utils.writeLog('Query a ser executada no banco de dados: ' + sqlQuery, '903');
  mysqlPool.query(sqlQuery, callback);
}

/**
 * @param {Function} callback
 */
exports.insert_empresa = function(data, callback) {
  // Usando prepared statements.
  var sqlQuery = 'INSERT INTO sce.empresa (??, ??, ??, ??, ??,' +
                                            '??, ??, ??, ??, ??)' +
                                            'VALUES (?, ?, ?, ?,' +
                                            '?, ?, ?, ?, ?, ?)';

  var inserts = ['nome', 'razao_social', 'cnpj', 'email', 'telefone',
                 'telefone_2', 'endereco_rua', 'endereco_numero',
                 'endereco_bairro', 'endereco_cep', data[0], data[1], data[2],
                 data[3], data[4], data[5],data[6], data[7], data[8], data[9]];

  sqlQuery = mysql.format(sqlQuery, inserts);

  utils.writeLog('Query a ser executada no banco de dados: ' + sqlQuery, '903');
  mysqlPool.query(sqlQuery, callback);
}

exports.insert_orientador = function(data, callback) {
  var sqlQuery = 'INSERT INTO sce.orientador (??, ??) VALUES (?, ?)';

  var inserts = ['siap', 'nome', data[0], data[1]];

  sqlQuery = mysql.format(sqlQuery, inserts);

  utils.writeLog('Query a ser executada no banco de dados: ' + sqlQuery, '903');
  mysqlPool.query(sqlQuery, callback);
}

exports.insert_turma = function(data, callback) {
  var sqlQuery = 'INSERT INTO turma (??, ??, ??) VALUES(?, ?, ?)';

  var inserts = ['id_turma', 'turno', 'curso', data[0], data[1], data[2]];

  sqlQuery = mysql.format(sqlQuery, inserts);

  utils.writeLog('Query a ser executada no banco de dados: ' + sqlQuery, '903');
  mysqlPool.query(sqlQuery, callback);
}

/**
 * @param {Function} callback
 */
exports.delete_empresa = function(id_empresa, callback) {
  var sqlQuery = 'DELETE FROM sce.empresa' +
                  'WHERE sce.empresa.id_empresa == ?';

  var inserts = [id_empresa];

  sqlQuery = mysql.format(sqlQuery, inserts);
  mysqlPool.query(sqlQuery, callback);
}

/**
 * @param {String} matricula
 * @param {Function} callback
 */
exports.delete_estagiario = function(matricula, callback) {
  var sqlQuery = 'DELETE FROM sce.estagiario' +
                  'WHERE sce.estagiario.matricula == ?';

  var inserts = [matricula];

  sqlQuery = mysql.format(sqlQuery, inserts);
  mysqlPool.query(sqlQuery, callback);
}

/**
 * @param {Number} siap
 * @param {Function} callback
 */
exports.delete_orientador = function(siap, callback) {
  var sqlQuery = 'DELETE FROM sce.orientador' +
                  'WHERE sce.orientador.siap == ?';

  var inserts = [siap];

  sqlQuery = mysql.format(sqlQuery, inserts);
  mysqlPool.query(sqlQuery, callback);
}

/**
 * @param {String} id_turma
 * @param {Function} callback
 */
exports.delete_turma  = function(id_turma, callback) {
  var sqlQuery = 'DELETE FROM sce.turma' +
                  'WHERE sce.turma.id_turma == ?';

  var inserts = [id_turma];

  sqlQuery = mysql.format(sqlQuery, inserts);
  mysqlPool.query(sqlQuery, callback);
}


// TODO: criar os update.

/**
 * @param {String} query O comando a ser executado no banco de dados.
 * @param {Function} callback
 */
exports.query = function(query, callback) {
    mysqlPool.query(query, callback);
}
