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
    // user      : "sica_server",
    // password  : "sica", // this neither
    user      : "root", //do not use this in production
    password  : "mariadb_password",
    database  : ""
});

sica_db_connection.connect(function(error) {
    if(error) {
      console.error("Error connecting on the database. Error stack: " +
                    error.stack);
    }

    console.log("Connection to the database ok!");
});

sica_db_connection.query("SELECT * FROM mysql.user",
    function(error, rows) {
      if(error) {

      }
      else {
        for(var i = 0; i < rows.length; i++)
            console.log(rows[i]);
      }
})

sica_db_connection.end();


// Make API.
// sica_db_connection.query("SELECT * FROM sica.Professor",
//   function(error, rows, fields) {
//     if(error) {
//       throw error;
//     }
//
//     for(var i = 0; i < rows.length; i++) {
//       console.log("Professores:" + rows[i].nome);
//     }
//   }
// );
