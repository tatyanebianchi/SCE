/**
 *
 *
 */

'use strict'

var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({
    port: 9005
  });

exports.init = function() {
    console.log("websocket init hit");
}

/**
 *
 * @param message Mensagem a ser enviada ao cliente.
 */
exports.send_message = function(message) {
    console.log("message to be sent: " + message);
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
  console.log("message to be sent: " + message);
  wss.on('connection', function(ws) {
      ws.send(JSON.stringify(message));
  });
}
