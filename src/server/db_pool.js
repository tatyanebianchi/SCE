/****************************************************************************
 * Responsável por gerenciar as conexões com o banco de dados e também fazer
 * querys ao banco.
 *
 *
 ****************************************************************************/

'use strict'


var mysql   = require('mysql');

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
 *
 * @param query_data
 */
exports.query = function(query_data, callback_return) {
    pool.getConnection(function(err, connection) {
        if(err) {
          callback_return(undefined, err)
        }
        else { // conexão ok
            connection.query(query_data, function(err, rows) {
                if(err) {
                    // retorna o estado dessa função para a função passada por argumento.
                    callback_return(undefined, err);
                  }
                else {
                    // retorna o estado dessa função para a função passada por argumento.
                    if(rows == "") {
                        callback_return(undefined, "The query has returned null." +
                                        " May be occurred from a bad formatted query." +
                                        " Or no result was found on the database.");
                    }
                    else {
                        callback_return(rows, undefined);
                    }
                }
            });
        }

        // Does connection pooling rightly.
        connection.release();
    });
}
