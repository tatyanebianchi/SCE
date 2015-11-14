/**
  * db_pool.js
  * Author: Rafael Campos Nunes.
  * License: GPLv3
  *
  * Pool de conexões.
  *
  * Responsável por gerenciar as conexões com o banco de dados e também fazer
  * querys ao banco.
  */

'use strict'

var mysql   = require('mysql');

// SCE
var utils = require('./server_utils.js');

/**
 * Pool de conexões para o banco de dados
 */
var pool = mysql.createPool({
    connectionLimit   : 100, // Máximo número de conexões permitidas.
    host              : "localhost",
    user              : "sce",
    password          : "sce_password",
    database          : "sce",
    debugging         : false
});

/**
 * @param query_data a query a ser executada no banco de dados.
 * @param {Function} callback chamado ao finalizar a query.
 */
exports.query = function(query_data, callback_return) {
    pool.getConnection(function(err, connection) {
        if(err) {
            callback_return(undefined, err)
            utils.write_log('Um erro ocorreu ao tentar conectar ao servidor. Erro: ' + err, '904')
        }
        else { // conexão ok
            connection.query(query_data, function(err, rows) {
                if(err) {
                    callback_return(undefined, err);
                  }
                else {
                    if(rows == "") {
                        callback_return(undefined, "Nenhum resultado foi encontrado");
                    }
                    else {
                        callback_return(rows, undefined);
                    }
                }
            });
        }

        // Does connection pooling rightly.
        if(connection) {
            connection.release();
        }
    });
}
