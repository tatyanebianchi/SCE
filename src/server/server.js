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
var webSocket   = require('./web_socket.js');
var login       = require('./login.js');
var utils       = require('./server_utils.js')
var cadastro    = require('./cadastro.js')

// node.js
var path        = require('path');


var debug = false;
if(process.argv[2] == ("-d" || "-debug")) {
  debug = true;
}

/**
 * Pasta padrão para os arquivos do cliente
 */
app.use(express.static('../public'));
/**
 *
 */
app.use(bodyParser());

// Inicializando o web socket.
webSocket.init();

app.get("/", function (req, res) {
    console.log("get on /");
    // webSocket.init();
});

app.get("/logout", function(req, res) {
    // TODO: logout. Destruir sessão e cookies.
    login.logout(req, res);
});

app.post("/login", function(req, res) {
    // TODO: Login. Criar sessão e armazenar cookies
    login.do_login(req.body, res);
});

app.post("/cadastra_empresa", function(req, res) {
    cadastro.cadastra_empresa(req.body, res);
});

app.post("/cadastra_estagiario", function(req, res) {
    cadastro.cadastra_estagiario(req.body, res);
});

/**
 * Seção do software a ser implementada posteriormente
 */
 app.post("/cadastra_usuario", function(req, res) {

 });

/**
 * Capturando o erro 404.
 */
app.use(function(req, res, next) {
  res.status(404);
  res.sendFile(utils.get_file("404.html"));
});

var server = app.listen(9000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('SCE server listening at http://%s:%s', host, port);
});
