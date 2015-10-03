/*****************************************************************************
 * Interface de programação da apliação.  Responsável  por  retornar  dados  e
 * formatar em JSON para posterior envio ao cliente utilizando websockets.
 ****************************************************************************/

'use strict'

var mysql_pool = require('./db_pool.js');

/**
 * @param {Function} callback
 */
exports.getEmpresas = function(return_data) {
    mysql_pool.query("SELECT * FROM sce.empresa;", return_data);
}

/**
 * @param {Function} callback
 */
exports.getOrientadores = function(return_data) {
    mysql_pool.query("SELECT * FROM sce.orientador;", return_data);
}

/**
 * @param {Function} callback
 */
exports.getEstagiarios = function(return_data) {
    mysql_pool.query("SELECT * FROM sce.estagiario;", return_data);
}

/**
 * @param {Function} callback
 */
exports.getUsuarios = function(return_data) {
  mysql_pool.query("SELECT * FROM sce.usuario;", return_data);
}
