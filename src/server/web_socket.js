/**
 *
 *
 */

'use strict'

// SCE
var db_api  = require('./db_api.js'),
    utils   = require('./server_utils.js');


var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({
    port: 9005
  });

exports.init = function() {
    utils.write_log('Web socket inicializado', '900');
}

/**
 * @param message Mensagem a ser enviada ao cliente.
 */
exports.send_message = function(message) {
      if(utils.is_debug()) {
          console.log("Mensagem a ser enviada: " + message);
      }

      utils.write_log('Mensagem a ser enviada ao cliente: ' + message, '907');
      wss.on('connection', function(ws) {
          ws.send(message);
      });
}

/**
 * Não envie grandes mensagens em JSON haja vista que JSON.parse é uma função
 * síncrona e pode travar o servidor. Procurando uma maneira de fazer código
 * non-blocking.
 *
 * @param message Mensagem em JSON a ser enviada ao cliente.
 */
exports.send_json = function(message) {
    if(utils.is_debug()) {
        console.log("Mensagem a ser enviada: " + message);
    }

    utils.write_log('Mensagem a ser enviada ao cliente: ' + message, '907');
    wss.on('connection', function(ws) {
        ws.send(JSON.stringify(message));
    });
}

/**
 * @param ws
 * Função para conversar com o cliente, isto é, quando algum cliente da
 * aplicação requisita algo o servidor interpreta a requisição e manda a
 * informação necessária de volta ao cliente.
 */
wss.on('connection', function connection(ws) {
    ws.on('message', function(message) {
        if(utils.is_debug()) {
            console.log("Mensagem do cliente recebida: " + message);
        }

        utils.write_log('Mensagem do cliente recebida: ' + message, '906');

        message = JSON.parse(message);

        switch (message.code) {
            case '1006': // requisição
                switch (message.desc) {
                  case 'get_companies':
                      db_api.get_empresas(function(data, err) {
                          if(utils.is_debug()) {
                              utils.type("Objeto retornado do banco de dados", data);
                              utils.type("Erro no banco de dados", err);
                          }

                          var empresas = [];
                          if (data) {
                              for (var i = 0; i < data.length; i++) {
                                  empresas.push(data[i]);
                              }

                              ws.send(JSON.stringify({
                                  code: '1007', // resposta da requisição
                                  desc: 'empresas',
                                  value: empresas
                              }));
                          }
                          else {
                            ws.send(JSON.stringify({
                                code: '1004', // resposta da requisição
                                desc: '[DB_API_ERR]',
                                value: err
                            }));

                            utils.write_log('', '904');
                          }
                      });
                      break;
                  case 'search':
                      console.log(message.value);
                      db_api.search_estagiario(message.value, function(data, err) {
                          // unstable.
                          if(data) {
                              for (var i = 0; i < data.length; i++) {
                                console.log(data[i]);
                              }
                          }
                      });
                      break;
                  case 'get_tutors':
                      db_api.get_orientadores(function(data, err) {
                          if(utils.is_debug()) {
                              utils.type("Objeto retornado do banco de dados", data);
                              utils.type("Erro no banco de dados", err);
                          }

                          var orientadores = [];
                          if (data) {
                              for (var i = 0; i < data.length; i++) {
                                  orientadores.push(data[i]);
                              }
                              ws.send(JSON.stringify({
                                  code: '1007',
                                  desc: 'orientadores',
                                  value: orientadores
                              }));
                          }
                          else {
                            ws.send(JSON.stringify({
                                code: '1004',
                                desc: '[DB_API_ERR]',
                                value: err
                            }));

                            utils.write_log('', '904');
                          }
                      });
                      break;
                  case 'get_classes':
                      db_api.get_classes(function(data, err) {
                          if(data) {
                              var classes = []

                              for(var i = 0; i < data.length; i++) {
                                  classes.push(data[i]);
                              }

                              ws.send(JSON.stringify({
                                code: '1007',
                                desc: 'classes',
                                value: classes
                              }));
                          }
                          else {
                              utils.write_log('', '904');
                          }
                      })
                      break;
                }
                break;
        }
    });
});
