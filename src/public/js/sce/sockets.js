/**
  * sockets.js
  * Author: Rafael Campos Nunes.
  * License: GPLv3
  *
  * Script que abre uma conexão com o websocket specificado e define o objeto
  * sockets para utilização posterior por outro script.
  */

(function () {
    'use strict'

    var ws,
        sockets,
        ws_port = 9005;


    ws = new WebSocket('ws://' + window.location.hostname + ":" + ws_port)

    if(ws != null) {
      sockets = true;
    }
    else {
      console.error('Conexão com o websocket não pôde ser estabelecida, o servidor pode estar fora do ar');
    }

    window.ws = ws;
    window.sockets = sockets;
    window.ws_port = ws_port
})();
