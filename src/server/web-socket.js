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
    // Por que não funciona aqui?
    // wss.on('connection', function(ws) {
    //    // argumento da função callback
    //    ws.on('message', function incoming(message) {
    //      console.log("received: %s", message);
    //    });
    //
    //    ws.send("Data from SCE server");
    // });
}

console.log("websocket init hit");

exports.send_message = function(message) {
    console.log("message to be sent: " + message);
    wss.on('connection', function(ws) {
        ws.send(message);
    });
}

exports.send_json = function(message) {
  console.log("message to be sent: " + message);
  wss.on('connection', function(ws) {
      ws.send(JSON(message));
  });
}
