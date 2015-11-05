/**
 *
 *
 */

'use strict'

// SCE
var db_api  = require('./db_api.js'),
    utils   = require('./server_utils.js');

// nodejs
var util    = require('util');

var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({
    port: 9005
  });

exports.init = function() {
    if(utils.is_debug()) {
        util.log('Web socket inicializado');
    }

    utils.write_log('Web socket inicializado', '900');
}

/**
 * @param message Mensagem a ser enviada ao cliente.
 */
exports.send_message = function(message) {
      if(utils.is_debug()) {
          util.log("Mensagem a ser enviada: " + message);
      }

      utils.write_log('Mensagem a ser enviada ao cliente: ' + message, '907');
      wss.on('connection', function(ws) {
          ws.send(message, function(error) {
              utils.write_log("Erro ao enviar informação ao cliente: " + error, '904');
              if(utils.is_debug()) {
                  util.log("Erro ao enviar informação ao cliente: " + error);
              }
          });
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
        util.log("Mensagem a ser enviada: " + message);
    }

    utils.write_log('Mensagem a ser enviada ao cliente: ' + message, '907');
    wss.on('connection', function(ws) {
        ws.send(JSON.stringify(message), function(error) {
            utils.write_log("Erro ao enviar informação ao cliente: " + error, '904');
            if(utils.is_debug()) {
                util.log("Erro ao enviar informação ao cliente: " + error);
            }
        });
    });
}

/**
 * @param ws
 * Função para conversar com o cliente, isto é, quando algum cliente da
 * aplicação requisita algo o servidor interpreta a requisição e manda a
 * informação necessária de volta ao cliente.
 */
wss.on('connection', function connection(ws) {
    ws.on('error', function(error) {
        util.log("WebSockets sofreu um erro: " + error);
    });

    ws.on('open', function() {
        util.log("Cliente conectado");
    });

    ws.on('message', function(message) {
        if(utils.is_debug()) {
            util.log("Mensagem do cliente recebida: " + message);
        }

        utils.write_log('Mensagem do cliente recebida: ' + message, '906');

        message = JSON.parse(message);

        // TODO: Verificar se o socket está aberto para enviar a mensagem.
        switch (message.code) {
            case '1006': // requisição
                switch (message.desc) {
                  case 'get_companies':
                      db_api.get_empresas(function(data, err) {
                          if(utils.is_debug()) {
                              utils.type("Objeto retornado do banco de dados", data);
                              utils.type("Erro no banco de dados", err);
                          }

                          if (data) {
                              var empresas = [];
                              for (var i = 0; i < data.length; i++) {
                                  empresas.push(data[i]);
                              }

                              send_message(ws, 'empresas', empresas, 'get_companies');
                          }
                          else {
                              if(utils.is_debug()) {
                                  util.log('Erro em \'get_companies\': ' + err);
                              }

                              send_error(ws, '[DB_API_ERR]', err, 'get_companies');
                              utils.write_log('[DB_API_ERR] ' + err, '904');
                          }
                      });
                      break;
                  case 'search':
                      db_api.search_estagiario(message.value, function(data, err) {
                          if(utils.is_debug()) {
                              utils.type("Objeto retornado do banco de dados", data);
                              utils.type("Erro no banco de dados", err);
                          }

                          if(data) {
                              var pesquisa_estagiarios = [];
                              for (var i = 0; i < data.length; i++) {
                                  pesquisa_estagiarios.push(data[i]);
                              }

                              send_message(ws, 'estagiarios', pesquisa_estagiarios, 'search');
                          }
                          else {
                              if(utils.is_debug()) {
                                  util.log('Erro em \'search\': ' + err);
                              }

                              send_error(ws, '[DB_API_ERR]', err, 'search');
                              utils.write_log('[DB_API_ERR]' + err, '904');

                          }
                      });
                      break;
                  case 'get_tutors':
                      db_api.get_orientadores(function(data, err) {
                          if(utils.is_debug()) {
                              utils.type("Objeto retornado do banco de dados", data);
                              utils.type("Erro no banco de dados", err);
                          }

                          if (data) {
                              var orientadores = [];
                              for (var i = 0; i < data.length; i++) {
                                  orientadores.push(data[i]);
                              }

                              send_message(ws, 'orientadores', orientadores, 'get_tutors');
                          }
                          else {
                              if(utils.is_debug()) {
                                  util.log('Erro em \'get_tutors\': ' + err);
                              }

                              send_error(ws, '[DB_API_ERR]', err, 'get_tutors')
                              utils.write_log('[DB_API_ERR] ' + err, '904');
                          }
                      });
                      break;
                  case 'get_classes':
                      db_api.get_classes(function(data, err) {
                          if(utils.is_debug()) {
                              utils.type("Objeto retornado do banco de dados", data);
                              utils.type("Erro no banco de dados", err);
                          }

                          if(data) {
                              var classes = []

                              for(var i = 0; i < data.length; i++) {
                                  classes.push(data[i]);
                              }

                              send_message(ws, 'classes', classes, 'get_classes');
                          }
                          else {
                              // TODO: enviar erro ao cliente
                              if(utils.is_debug()) {
                                util.log('Erro em \'get_classes\': ' + err)
                              }

                              send_error(ws, '[DB_API_ERR]', err, 'get_classes');
                              utils.write_log('[DB_API_ERR] ' + err, '904');
                          }
                      })
                      break;
                }
                break;
        }
    });
});

/**
 * Função auxiliar que envia uma mensagem através do web socket.
 * code: 1007. Mais informações sobre a estrutura da mensagem em README.md.
 * @param ws
 * @param _desc
 * @param {Object} _value valor a ser enviado ao cliente.
 */
function send_message(ws, _desc, _value) {
    if(utils.is_debug()) {
        util.log("Mensagem a ser enviada: " + _desc + ' - ' + _value);
    }

    utils.write_log('Mensagem a ser enviada ao cliente: ' + _desc + ' - ' + _value, '907');

    ws.send(JSON.stringify({
      code: '1007',
      desc: _desc,
      value: _value
    }), function(error) {
        if(error) {
            utils.write_log('Erro ao enviar informação ao cliente em \'' + where + '\': ' + error, '904');
            if(utils.is_debug()) {
                util.log('Erro ao tentar enviar a mensagem \'' + _desc + '\' para o cliente em \'' + where + '\': ' + error);
            }
        }
    });
}

/**
 * Função auxiliar que enviar uma mensagem de erro através do web socket.
 * code: 1004. Mais informações sobre a estrutura da mensagem em README.md.
 * @param ws
 * @param _desc
 * @param {Object} _value valor a ser enviado ao cliente.
 */
function send_error(ws, _desc, _value, where) {
    if(utils.is_debug()) {
        util.log("Mensagem a ser enviada: " + _desc + ' - ' + _value);
    }

    utils.write_log('Mensagem a ser enviada ao cliente: ' + _desc + ' - ' + _value, '907');

    ws.send(JSON.stringify({
      code: '1004',
      desc: _desc,
      value: _value
    }), function(error) {
        if(error) {
            utils.write_log('Erro ao enviar informação ao cliente em \'' + where + '\': ' + error, '904');
            if(utils.is_debug()) {
                util.log('Erro ao tentar enviar a mensagem \'' + _desc + '\' para o cliente em \'' + where + '\': ' + error);
            }
        }
    });
}
