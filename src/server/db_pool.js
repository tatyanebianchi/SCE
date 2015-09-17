/****************************************************************************
 *
 *
 *
 ****************************************************************************/

//'use strict'


var mysql   = require('mysql');

var mysql_pool = mysql.createPool({
    connectionLimit   : 100, // Máximo número de conexões permitidas.
    host              : "localhost",
    user              : "sce",
    password          : "sce_password",
    database          : "sce",
    debugging         : false
});

exports.get_connection = function(req, res) {
    mysql_pool.getConnection(function(error, connection) {
        if(error) {
          res.json({"code" : 100, "status" : "connection database error", "error" : error});
          if(connection) {
              connection.release();
          }
          return;
        }
        else {
            console.log("Connected. ID: " + connection.threadId);
            connection.query("SELECT * FROM usuario", function(error, rows) {
                if(error) {
                  console.log(error);
                }
                else {
                  res.json(rows);
                }
            });
            return connection;
        }
     });
}
