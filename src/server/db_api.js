/*****************************************************************************
 * Interface de programação da apliação.  Responsável  por  retornar  dados  e
 * formatar em JSON para posterior envio ao cliente utilizando websockets.
 ****************************************************************************/

'use strict'

// SCE
var mysql_pool  = require('./db_pool.js'),
    utils       = require('./server_utils.js');

// Node.js
var node_utils  = require('util'),
    mysql       = require('mysql');

/**
 * @param {Function} callback
 */
exports.get_empresas = function(return_data) {
    mysql_pool.query("SELECT * FROM sce.empresa;", return_data);
    // return return_data(undefined);
}

/**
 * @param {Function} callback
 */
exports.get_orientadores = function(return_data) {
    mysql_pool.query("SELECT * FROM sce.orientador;", return_data);
    // return return_data(undefined);
}

/**
 * @param {Function} callback
 */
exports.get_classes = function(return_data) {
  mysql_pool.query("SELECT * FROM sce.turma;", return_data);
}

/**
 * @param {Function} callback
 */
exports.get_estagiarios = function(return_data) {
    mysql_pool.query("SELECT * FROM sce.estagiario;", return_data);
}

/**
 * @param {Function} callback
 */
exports.get_usuarios = function(return_data) {
    mysql_pool.query("SELECT * FROM sce.usuario;", return_data);
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

  var constantes_de_pesquisa = {
      nome: "WHERE nome LIKE ?",
      matricula: "WHERE matricula = ?",
      siap: "WHERE siap = ?",
      id_turma: "WHERE id_turma LIKE ?"
  }

  var sql_query = "SELECT * FROM ?? ";

  if(search_obj.search_for[1] == 'nome') {
      sql_query += constantes_de_pesquisa.nome;
      search_obj.search_string += '%';
  }
  else if(search_obj.search_for[1] == 'matricula') {
      sql_query += constantes_de_pesquisa.matricula;
  }
  else if(search_obj.search_for[1] == 'siap') {
      sql_query += constantes_de_pesquisa.siap;
  }
  else if(search_obj.search_for[1] == null) {
    sql_query += constantes_de_pesquisa.id_turma;
    search_obj.search_string += '%';
  }

  var inserts = [table, search_obj.search_string];

  sql_query = mysql.format(sql_query, inserts);

  utils.write_log('Query a ser executada no banco de dados: ' + sql_query, '903');
  mysql_pool.query(sql_query, return_data);
}


exports.insert_estagiario = function(data, callback) {

    // Usando prepared statements.
    var sql_query = "INSERT INTO sce.estagiario (??, ??, ??, ??, ??," +
                                              "??, ??, ??, ??, ??)" +
                                              " VALUES (?, ?, ?, ?," +
                                              " ?, ?, ?, ?, ?, ?)";

    var inserts = ['matricula', 'nome', 'periodo_inicio', 'periodo_fim', 'empresa',
                   'foto', 'observacao', 'empresa_id_empresa', 'turma_id_turma',
                   'orientador_siap', data[0], data[1], data[2], data[3], data[4],
                   data[5],data[6], data[7], data[8], data[9]];

    sql_query = mysql.format(sql_query, inserts);

    utils.write_log('Query a ser executada no banco de dados: ' + sql_query, '903');
    mysql_pool.query(sql_query, callback);
}

/**
 * @param {Function} callback
 */
exports.insert_empresa = function(data, callback) {
    // Usando prepared statements.
    var sql_query = 'INSERT INTO sce.empresa (??, ??, ??, ??, ??,' +
                                              '??, ??, ??, ??, ??)' +
                                              'VALUES (?, ?, ?, ?,' +
                                              '?, ?, ?, ?, ?, ?)';

    var inserts = ['nome', 'razao_social', 'cnpj', 'email', 'telefone',
                   'telefone_2', 'endereco_rua', 'endereco_numero',
                   'endereco_bairro', 'endereco_cep', data[0], data[1], data[2],
                   data[3], data[4], data[5],data[6], data[7], data[8], data[9]];

    sql_query = mysql.format(sql_query, inserts);

    utils.write_log('Query a ser executada no banco de dados: ' + sql_query, '903');
    mysql_pool.query(sql_query, callback);
}

exports.insert_orientador = function(data, callback) {
    var sql_query = 'INSERT INTO orientador (??, ??) VALUES (?, ?)';

    var inserts = ['siap', 'nome', data[0], data[1]];

    sql_query = mysql.format(sql_query, inserts);

    utils.write_log('Query a ser executada no banco de dados: ' + sql_query, '903');
    mysql_pool.query(sql_query, callback);
}

exports.insert_turma = function(data, callback) {
    var sql_query = 'INSERT INTO turma (??, ??, ??) VALUES(?, ?, ?)';

    var inserts = ['id_turma', 'turno', 'curso', data[0], data[1], data[2]];

    sql_query = mysql.format(sql_query, inserts);

    utils.write_log('Query a ser executada no banco de dados: ' + sql_query, '903');
    mysql_pool.query(sql_query, callback);
}

/**
 * @param {Function} callback
 */
exports.delete_empresa = function(id_empresa, callback) {

}

/**
 * @param {String} matricula
 * @param {Function} callback
 */
exports.delete_estagiario = function(matricula, callback) {

}

/**
 * @param {Number} siap
 * @param {Function} callback
 */
exports.delete_orientador = function(siap, callback) {

}

/**
 * @param {String} id_turma
 * @param {Function} callback
 */
exports.delete_turma  = function(id_turma, callback) {

}

/**
 *
 */
exports.query = function(query, callback) {
    mysql_pool.query(query, callback);
}
