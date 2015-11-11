/**
 * web_socket.js
 * Author: Rafael Campos Nunes.
 * License: GPLv3
 *
 * Script cuja função  é  receber,  interpretar  e  responder  clientes em suas
 * respectivas requisições.
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
          util.log('Mensagem a ser enviada:' + util.inspect(message));
      }

      utils.write_log('Mensagem a ser enviada ao cliente: ' + message, '907');
      wss.on('connection', function(ws) {
          if(message) {
              ws.send(message, function(error) {
                  if(error) {
                      utils.write_log("Erro ao enviar informação ao cliente: " + error, '904');
                      if(utils.is_debug()) {
                          util.log("Erro ao enviar informação ao cliente: " + error);
                      }
                  }
              });
          }
      });
}

/**
 * Não envie grandes mensagens em JSON haja vista que JSON.parse é uma função
 * síncrona e pode travar o servidor. Procurando uma maneira de fazer código
 * non-blocking.
 *
 * @param {Object} message Mensagem em JSON a ser enviada ao cliente.
 */
exports.send_json = function(message) {
    if(utils.is_debug()) {
        util.log('Mensagem a ser enviada: ' + util.inspect(message));
    }

    utils.write_log('Mensagem a ser enviada ao cliente: ' + message, '907');
    wss.on('connection', function(ws) {
        if(message) {
            ws.send(JSON.stringify(message), function(error) {
                if(error) {
                    utils.write_log("Erro ao enviar informação ao cliente: " + error, '904');
                    if(utils.is_debug()) {
                        util.log("Erro ao enviar informação ao cliente: " + error);
                    }
                }
            });
        }
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
        if(error) {
            util.log("WebSockets sofreu um erro: " + error);
        }
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
                              empresas = data.slice();

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
                      if(message.value.search_for[0] === 'estagiario') {
                          db_api.search('estagiario', message.value, function(data, err) {
                              if(utils.is_debug()) {
                                  utils.type("Objeto retornado do banco de dados", data);
                                  utils.type("Erro no banco de dados", err);
                              }

                              if(data) {
                                  var pesquisa_estagiarios = [];
                                  pesquisa_estagiarios = data.slice();

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
                      }
                      else if(message.value.search_for[0] === 'turma') {
                          db_api.search('turma', message.value, function(data, err) {
                              if(utils.is_debug()) {
                                  utils.type("Objeto retornado do banco de dados", data);
                                  utils.type("Erro no banco de dados", err);
                              }

                              if(data) {
                                  var turmas = [];
                                  turmas = data.slice();

                                  send_message(ws, 'turmas', turmas, 'search');
                              }
                              else {
                                  if(utils.is_debug()) {
                                      util.log('Erro em \'search\': ' + err);
                                  }

                                  send_error(ws, '[DB_API_ERR]', err, 'search');
                                  utils.write_log('[DB_API_ERR]' + err, '904');
                              }
                          });
                      }
                      else if(message.value.search_for[0] === 'orientador') {
                          db_api.search('orientador', message.value, function(data, err) {
                              if(utils.is_debug()) {
                                  utils.type("Objeto retornado do banco de dados", data);
                                  utils.type("Erro no banco de dados", err);
                              }

                              if(data) {
                                  var orientadores = [];
                                  orientadores = data.slice();

                                  send_message(ws, 'orientadores', orientadores, 'search');
                              }
                              else {
                                  if(utils.is_debug()) {
                                      util.log('Erro em \'search\': ' + err);
                                  }

                                  send_error(ws, '[DB_API_ERR]', err, 'search');
                                  utils.write_log('[DB_API_ERR]' + err, '904');
                              }
                          });
                      }
                      else {
                        // NOTE: alguém por acaso está tentando fazer XSS
                      }
                      break;
                  case 'get_tutors':
                      db_api.get_orientadores(function(data, err) {
                          if(utils.is_debug()) {
                              utils.type("Objeto retornado do banco de dados", data);
                              utils.type("Erro no banco de dados", err);
                          }

                          if (data) {
                              var orientadores = [];
                              orientadores = data.slice();

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
                              classes = data.slice();

                              send_message(ws, 'classes', classes, 'get_classes');
                          }
                          else {
                              if(utils.is_debug()) {
                                util.log('Erro em \'get_classes\': ' + err)
                              }

                              send_error(ws, '[DB_API_ERR]', err, 'get_classes');
                              utils.write_log('[DB_API_ERR] ' + err, '904');
                          }
                      });
                      break;
                  case 'delete_turma':
                      db_api.delete_turma(message.value, function(data, err) {
                          if(utils.is_debug()) {
                              utils.type("Objeto retornado do banco de dados", data);
                              utils.type("Erro no banco de dados", err);
                          }

                          if(data) {
                              send_message(ws, 'delete_turma', null, 'delete_turma');
                          }
                          else {
                              if(utils.is_debug()) {
                                util.log('Erro em \'delete_turma\': ' + err)
                              }

                              send_error(ws, '[DB_API_ERR]', err, 'delete_turma');
                              utils.write_log('[DB_API_ERR] ' + err, '904');
                          }
                      });
                      break;
                  case 'delete_estagiario':
                      db_api.delete_estagiario(message.value, function(data, err) {
                        if(utils.is_debug()) {
                            utils.type("Objeto retornado do banco de dados", data);
                            utils.type("Erro no banco de dados", err);
                        }

                        if(data) {
                            send_message(ws, 'delete_estagiario', null, 'delete_estagiario');
                        }
                        else {
                            if(utils.is_debug()) {
                              util.log('Erro em \'delete_estagiario\': ' + err)
                            }

                            send_error(ws, '[DB_API_ERR]', err, 'delete_estagiario');
                            utils.write_log('[DB_API_ERR] ' + err, '904');
                        }
                      });
                      break;
                  case 'delete_orientador':
                      db_api.delete_orientador(message.value, function(data, err) {
                          if(utils.is_debug()) {
                              utils.type("Objeto retornado do banco de dados", data);
                              utils.type("Erro no banco de dados", err);
                          }

                          if(data) {
                              send_message(ws, 'delete_orientador', null, 'delete_orientador');
                          }
                          else {
                              if(utils.is_debug()) {
                                util.log('Erro em \'delete_orientador\': ' + err)
                              }

                              send_error(ws, '[DB_API_ERR]', err, 'delete_orientador');
                              utils.write_log('[DB_API_ERR] ' + err, '904');
                          }
                      });
                      break;
                }
                break;
        }
    });
});

/**
 * Função auxiliar que envia uma mensagem através do web socket.
 * code: 1007. Mais informações sobre a estrutura da mensagem em README.md.
 * @param {Object} ws
 * @param {String} _desc Descrição do valor a ser enviado ao cliente.
 * @param {Object} _value Valor a ser enviado ao cliente.
 * @param {String} where Onde ocorreu o envio.
 */
function send_message(ws, _desc, _value, where) {
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
 * @param {Object} ws
 * @param {String} _desc Descrição do valor a ser enviado ao cliente.
 * @param {Object} _value Valor a ser enviado ao cliente.
 * @param {String} where Onde ocorreu o envio.
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
