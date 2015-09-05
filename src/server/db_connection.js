/******************************************************************************
  *
  *
  *
  *
  *
  ****************************************************************************/

var mysql = require('mysql');

var sica_db_connection = mysql.createConnection({
    host      : "localhost",
    // user      : "sce_server",
    // password  : "sce", // this neither
    user      : "root", //do not use this in production
    password  : "mariadb_password",
    database  : ""
});

sce_db_connection.connect(function(error) {
    if(error) {
      console.error("Error connecting on the database. Error stack: " +
                    error.stack);
    }

    console.log("Connection to the database ok!");
});

sce_db_connection.query("SELECT * FROM mysql.user",
    function(error, rows) {
      if(error) {

      }
      else {
        for(var i = 0; i < rows.length; i++)
            console.log(rows[i]);
      }
})

sce_db_connection.end();
