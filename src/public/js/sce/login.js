/**
 *
 *
 */

// Verificando se o objeto sockets existe na página.
if(typeof sockets === "undefined") {
  $('#botao_login').addClass('disabled');

  throw new Error("This script requires sockets.js, verify if it was included.");
}
else {
  ws.onopen = function(e) {
      console.log('Conexão com o web socket bem sucedida na porta %s', ws_port);
  }

  ws.onerror = function(e) {
      console.log('Erro de conexão com o websocket, provavelmente o servidor foi desligado.');
  }

  ws.onclose = function(e) {
    console.log('Conexão com o websocket fechada.');
  }

  ws.onmessage = function(data) {
    data = JSON.parse(data.data)

    switch (data.code) {
      case '1007':

        break;
      case '1004':
        $('#error_box').html(
          'Um erro ocorreu ao fazer login. Erro: <strong>' + data.desc + '</strong>'
        ).fadeIn("slow");
        $('#botao_login').removeClass('disabled');
        break;
      case '1001':
        $('#error_box').fadeIn("slow");
        $('#botao_login').removeClass('disabled');
        break;
    }
  }
}

function doLogin() {
  $('#botao_login').addClass('disabled');

  if(typeof sockets === 'undefined') {
    return false;
  }
  else {
    return true;
  }
}
