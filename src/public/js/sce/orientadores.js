/**
  * orientadores.js
  * Author: Rafael Campos Nunes.
  * License: GPLv3
  *
  */

// Verificando se o objeto sockets existe na página.
if(typeof sockets == "undefined") {
    throw new Error("This script requires sockets.js, verify if it was included.");
}
else {
   var page_url = window.location.pathname;

   ws.onopen = function(e) {
       console.log("Conexão com o web socket bem sucedida na porta %s", ws_port);
   }

   ws.onerror = function(e) {
       console.log("Erro de conexão com o websocket, provavelmente o servidor foi desligado.");
   }

   ws.onclose = function(e) {
     console.log("Conexão com o websocket fechada.");
   }

   ws.onmessage = function(data) {
       data = JSON.parse(data.data);

       switch(data.code) {
          case '1007':
              switch(data.desc) {
                  case 'orientadores':
                      for(var i = 0; i < data.value.length; i++) {
                          $('#resultado_pesquisa').append(
                            '<tr>' +
                            ' <td>' + data.value[i].nome + '</td>' +
                            ' <td>' + data.value[i].siap + '</td>' +
                            ' <td class="text-center"><div class="btn-group btn-group-lg">' +
                            '  <button class="btn sce-btn-primary" title="Editar informações do orientador" data-toggle="tooltip" data-container="body" onClick=""><i class="libre libre-edit"></i>' +
                            '  <button class="btn sce-btn-default" title="Visualizar informações do orientador" data-toggle="tooltip" data-container="body" onClick=""><i class="libre libre-content"></i></button>' +
                            '  <button class="btn sce-btn-danger" title="Remover orientador" data-toggle="tooltip" data-container="body" onClick=""><i class="libre libre-trash"></i></button></div>' +
                            ' </td>' +
                            '</tr>'
                          );
                      }

                      $('#resultado_pesquisa').fadeIn("slow");
                      $('#botao_pesquisa').removeClass('disabled');
                      break;
              }
              break;

          case '1004':
              if(typeof data.value.code == 'undefined') {
                  $('#error_box').html(
                    'Um erro ocorreu ao fazer a pesquisa. Erro: <strong>' +
                    data.desc + ' ' + data.value + '</strong>'
                  ).fadeIn('slow');
              }
              else {
                  $('#error_box').html(
                    'Um erro ocorreu ao fazer a pesquisa. Erro: <strong>' +
                    data.desc + ' ' + data.value.code + '</strong>.'
                  ).fadeIn('slow');
              }

              $('#botao_pesquisa').removeClass('disabled');
              break;
       }
   }

   $("#pesquisa_por_nome").click(function(e) {
       e.preventDefault();
       pesquisa_orientador('nome');
   });

   $("#pesquisa_por_siap").click(function(e) {
       e.preventDefault();
       pesquisa_orientador('siap');
   });

   function pesquisa_orientador(search_key) {
       var search = $("#campo_orientador").val();

       var _search_for = []
       _search_for[0] = 'orientador';
       _search_for[1] = search_key;

       // esconder qualquer alerta previamente aberto.
       $('#error_box').fadeOut(200);
       $('#botao_pesquisa').addClass('disabled');

       // Reseta a tabela para uma nova pesquisa.
       $('#resultado_pesquisa').html(
         '<tr>' +
           '<th class="text-center">Nome</th>' +
           '<th class="text-center">SIAP</th>' +
           '<th class="text-center">Ações</th>' +
         '</tr>'
       );

       // objeto de pesquisa.
       var pesquisa = {
         search_string: search,
         search_for: _search_for
       }

       ws.send(JSON.stringify({
           code: '1006',
           desc: 'search',
           value: pesquisa
       }));
   }
}
