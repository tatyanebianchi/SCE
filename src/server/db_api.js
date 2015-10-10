/*****************************************************************************
 * Interface de programação da apliação.  Responsável  por  retornar  dados  e
 * formatar em JSON para posterior envio ao cliente utilizando websockets.
 ****************************************************************************/

'use strict'

var mysql_pool = require('./db_pool.js');

/**
 * @param {Function} callback
 */
exports.get_empresas = function(return_data) {
    mysql_pool.query("SELECT * FROM sce.empresa;", return_data);
}

/**
 * @param {Function} callback
 */
exports.get_orientadores = function(return_data) {
    mysql_pool.query("SELECT * FROM sce.orientador;", return_data);
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


exports.search_estagiario = function(search, return_data) {
    mysql_pool.query("SELECT * FROM sce.estagiario WHERE sce.estagiario.nome LIKE " + search + "%");
}

exports.insert_estagiario = function(callback) {
    //mysql_pool.query()
}

exports.insert_empresa = function(callback) {

}
