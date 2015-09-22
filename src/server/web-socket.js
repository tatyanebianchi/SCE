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
wss.on('connection', function(ws) {
   // argumento da função callback
   ws.on('message', function incoming(message) {
     console.log("received: %s", message);
   });

   ws.send("Data from SCE server");
});
