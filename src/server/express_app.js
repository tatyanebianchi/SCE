/***************************************************************************
  * Servidor HTTP SCE.
  *
  *
  *************************************************************************/
var express     = require('express');
var bodyParser  = require('body-parser');
var database    = require('./db_pool.js');
var app         = express();

app.use(bodyParser());

/**
 * Pasta padrão para os arquivos do cliente
 */
app.use(express.static('../public'));

app.get("login", function(req, res) {

});

app.post("/login", function(req, res) {
    var email = req.body.usuario.email;
    var pass  = req.body.usuario.senha;

    // TODO: Login
    database.handle_db(req, res);

    console.log("email: %s pass: %s", email, pass);
});

var server = app.listen(9000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('SCE server listening at http://%s:%s', host, port);
});
