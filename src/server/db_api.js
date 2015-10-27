/*****************************************************************************
 * Interface de programação da apliação.  Responsável  por  retornar  dados  e
 * formatar em JSON para posterior envio ao cliente utilizando websockets.
 ****************************************************************************/

'use strict'

// SCE
var mysql_pool  = require('./db_pool.js'),
    utils       = require('./server_utils.js');

// Node.js
var node_utils  = require('util');

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
 * @param search
 * @param {Function} callback
 */
exports.search_estagiario = function(search, return_data) {
    mysql_pool.query("SELECT * FROM sce.estagiario WHERE sce.estagiario.nome LIKE " + search + "%", return_data);
}

exports.insert_estagiario = function(data, callback) {
    node_utils.inspect(data);

    mysql_pool.query('INSERT INTO `sce`.`estagiario` (`matricula`,' +
                                                  '`nome`,' +
                                                  '`periodo_inicio`,' +
                                                  '`periodo_fim`,' +
                                                  '`empresa`,' +
                                                  '`orientador_siap`,' +
                                                  '`empresa_idEmpresa`,' +
                                                  '`turma_idturma`)' +
                                                  'VALUES (' +
                                                          '`' + data[0] + '`,' +
                                                          '`' + data[1] + '`,' +
                                                          '`' + data[2] + '`,' +
                                                          '`' + data[3] + '`,' +
                                                          '`' + data[4] + '`,' +
                                                          '`' + data[5] + '`,' +
                                                          '`' + data[6] + '`,' +
                                                          '`' + data[7] + '`,', callback)
}

exports.insert_empresa = function(callback) {

}

/**
 *
 */
exports.query = function(query, callback) {
    mysql_pool.query(query, callback);
}
