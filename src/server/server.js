/***************************************************************************
  * Servidor HTTP SCE.
  *
  *
  *************************************************************************/

// express e middleware
var express     = require('express');
var bodyParser  = require('body-parser');
var app         = express();

// SCE
var webSocket   = require('./web-socket.js');
var login       = require('./login.js');

// node.js
var path        = require('path');


var debug = false;
if(process.argv[2] = "-d") {
  debug = true;
}

/**
 *
 */
app.use(bodyParser());

/**
 * Pasta padrão para os arquivos do cliente
 */
app.use(express.static('../public'));

app.get("/", function (req, res) {
    console.log("get on /");
    webSocket.init();
});

app.post("/login", function(req, res) {
    var email = req.body.usuario.email;
    var pass  = req.body.usuario.senha;

    // TODO: Login
    login.do_login(email, pass);
});


var server = app.listen(9000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('SCE server listening at http://%s:%s', host, port);
});
