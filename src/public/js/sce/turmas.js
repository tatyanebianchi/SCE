/**
  * turmas.js
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
                case 'turmas':
                    for(var i = 0; i < data.value.length; i++) {
                        $('#resultado_pesquisa').append(
                          '<tr>' +
                          ' <td>' + data.value[i].curso + '</td>' +
                          ' <td>' + data.value[i].id_turma + '</td>' +
                          ' <td>' + data.value[i].turno + '</td>' +
                          ' <td class="text-center"><div class="btn-group btn-group-lg">' +
                          '  <button class="btn sce-btn-primary" title="Editar informações da turma" data-toggle="tooltip" data-container="body" onClick=""><i class="libre libre-edit"></i>' +
                          '  <button class="btn sce-btn-default" title="Visualizar informações da turma" data-toggle="tooltip" data-container="body" onClick=""><i class="libre libre-content"></i></button>' +
                          '  <button class="btn sce-btn-danger" title="Remover turma" data-toggle="tooltip" data-container="body" onClick=""><i class="libre libre-trash"></i></button></div>' +
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

   function pesquisa_turma(search_key) {
       var search = $("#campo_turma").val();

       var _search_for = []
       _search_for[0] = 'turma';
       _search_for[1] = search_key;

       // esconder qualquer alerta previamente aberto.
       $('#error_box').fadeOut(200);
       $('#botao_pesquisa').addClass('disabled');

       // Reseta a tabela para uma nova pesquisa.
       $('#resultado_pesquisa').html(
         '<tr>' +
           '<th class="text-center">Curso</th>' +
           '<th class="text-center">Turma</th>' +
           '<th class="text-center">Turno</th>' +
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
