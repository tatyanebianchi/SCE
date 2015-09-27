/**
 *
 *
 */

var ws;
var ws_port = 9005

// Conectando ao web socket
ws = new WebSocket('ws://' + window.location.hostname + ':' + ws_port);

ws.onopen = function(data) {
  console.log("Conexão com o web socket bem sucedida na porta %s", ws_port);
}

ws.onmessage = function(data) {
  console.log(data);
  console.log(data.data);
  data = JSON.parse(data.data);

  console.log(data.type);

  // switch(data.type) {
  //   case 'auth_error': {
  //       var error_box = document.getElementById("auth_error");
  //       // TODO: retirar a classe hide do elemento.
  //   }
  // }
}
