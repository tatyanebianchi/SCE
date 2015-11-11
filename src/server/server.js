/***************************************************************************
  * Servidor HTTP SCE.
  *
  *
  *************************************************************************/

// node.js
var path        = require('path'),
    cluster     = require('cluster');
    node_utils  = require('util'),
    os          = require('os');

// SCE
var utils       = require('./server_utils.js');

if(process.argv[2] == ("-d" || "-debug")) {
    utils.set_debug(true);
    utils.write_log('Servidor iniciando em modo debug. Informações adicionais serão mostradas no console.', '900');
}
else if(process.argv[2] == '-h') {
    console.log('\tnodejs server <opções>');
    console.log('\nOpões: ');
    console.log('\t-d: opção debug, o servidor vai funcionar em modo debug, o' +
              'que o fará emitir mensagens de aviso/erro na stdout.');
    console.log('\t-h: opção ajuda, mostra esse menu.');
    process.exit();
}

if(cluster.isMaster) {
    // Início da escrita no log.
    utils.write_log('\n\n\n\n\n=================== SERVER INIT: ' + Date() + '====================');

   utils.write_log('Iniciando servidor com ' + os.cpus().length + ' workers', '900');

    /* Inicia um processo adjacente ao processo mestre. Optimizando para máquinas
     * com mais de um núcleo.
     */
     for(var i = 0; i < os.cpus().length; i++) {
       cluster.fork();
     }


    // Reiniciando o processo se houve exceção.
    cluster.on('exit', function(worker, code, signal) {
        setTimeout(function() {
          if(utils.is_debug()) {
              node_utils.log('worker '+ worker.process.pid + ' morreu ('+ (signal || code) + '). Reiniciando...');
          }

          utils.write_log('Algo sério aconteceu e o cluster está reiniciando o worker.', '904');

          cluster.fork();
        }, 500);
    });

    cluster.on('online', function(worker) {
        node_utils.log('O worker ' + worker.id + ' está executando.');
    });
}
else {
  // SCE
  var ws          = require('./web_socket.js'),
      login       = require('./login.js'),
      cadastro    = require('./cadastro.js');

    // express e middleware
    var express     = require('express'),
        bodyParser  = require('body-parser');

    var app         = express();
    /**
     * Pasta padrão para os arquivos do cliente
     */
    app.use(express.static('../public'));
    /**
     * Middleware bodyParser
     */
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // Inicializando o web socket.
    ws.init();

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

    app.post("/cadastra_orientador", function(req, res) {
        cadastro.cadastra_orientador(req.body, res);
    });

    app.post("/cadastra_turma", function(req, res) {
        cadastro.cadastra_turma(req.body, res);
    });

    /**
     * Seção do software a ser implementada posteriormente
     */
     app.post("/cadastra_usuario", function(req, res) {
        cadastro.cadastra_usuario(req.body, res);
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

      utils.write_log('Servidor executando em: ' + process.cwd(), '900')
      utils.write_log('Servidor escutando em: http://' + host + ':' + port, '900');
    });

    process.on('uncaughtException', function(err) {
        // construindo a pilha de rastreamento (I know, it sounds weird in portuguese)
        var stack = err.stack;

        ws.send_json({
          code: '1004',
          desc: '[INTERNAL_SERVER_ERROR]',
          value: 'O servidor sofreu um problema grave, por favor, contate o administrador.'
        })

        utils.write_log('Exceção: ' + stack, '904');
        node_utils.log("Exceção: " + stack);
        node_utils.inspect(stack);
        process.exit(7);
    });
}
