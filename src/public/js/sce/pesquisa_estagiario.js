/**
 * Script para pesquisa de um estagiário no front-end.
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
        data = JSON.parse(data.data)

        switch (data.code) {
            case '1007':
                switch(data.desc) {
                    case 'estagiarios':
                        for(var i = 0; i < data.value.length; i++) {
                            if(page_url == '/') {
                              $('#resultado_pesquisa').append(
                                '<tr>' +
                                    '<td>' +
                                        data.value[i].nome +
                                    '</td>' +
                                    '<td>' +
                                        data.value[i].turma_id_turma +
                                    '</td>' +
                                    '<td>' +
                                        data.value[i].matricula +
                                    '</td>' +
                                    '<td class="text-center">' +
                                    " <div class='btn-group btn-group-lg' role='group'>" +
                                    "   <button type='button' class='btn btn-primary' title='Editar informações do estagiário' data-toggle='tooltip' data-container='body' onClick=''><i class='libre libre-edit'></i></button>" +
                                    "   <button class='btn btn-default' title='Ver informações do estagiário' data-toggle='tooltip' data-container='body' onClick=''><i class='libre libre-content'></i></button>" +
                                    "   <button class='btn btn-danger' title='Excluir estagiário' data-toggle='tooltip' data-container='body' onClick=''><i class='libre libre-trash'></i></button>" +
                                    " </div>" +
                                    ' </td>' +
                                  '</tr>'
                              ).fadeIn(250);
                            }
                            else if(page_url == '/remove_estagiario.html') {
                              $('#resultado_pesquisa').append(
                                '<tr>' +
                                    '<td>' +
                                        data.value[i].nome +
                                    '</td>' +
                                    '<td>' +
                                        data.value[i].turma_id_turma +
                                    '</td>' +
                                    '<td>' +
                                        data.value[i].matricula +
                                    '</td>' +
                                    '<td class="text-center">' +
                                    " <button class='btn sce-btn-danger' title='Excluir estagiário' onClick='remover_estagiario()'>Remover estagiário <i class='libre libre-trash'></i></button>" +
                                    '</td>' +
                                '</tr>'
                              ).fadeIn(250);
                            }
                        }
                        // habilitando o uso do botão novamente.
                        $('#botao_pesquisa').removeClass('disabled');
                        break;
                }
                break;
            case '1004':
                if(typeof data.value.code == 'undefined') {
                    $('#error_box').html(
                      'Um erro ocorreu ao fazer a pesquisa. Erro: <strong>' + data.desc + ' ' +
                      data.value + '</strong>'
                    ).fadeIn("slow");
                }
                else {
                    $('#error_box').html(
                      'Um erro ocorreu ao fazer a pesquisa. Erro: <strong>' + data.desc + ' ' +
                      data.value.code + '</strong>'
                    ).fadeIn("slow");
                }
                $('#botao_pesquisa').removeClass('disabled');
                break;
        }
    }


    $("#pesquisa_por_nome").click(function(e) {
        e.preventDefault();
        pesquisa_estagiario('nome');
    });

    $("#pesquisa_por_matricula").click(function(e) {
        e.preventDefault();
        pesquisa_estagiario('matricula');
    });

    function pesquisa_estagiario(search_key) {
        var search = document.getElementById("campo_estagiario").value;

        var _search_for = []
        _search_for[0] = 'estagiario';
        _search_for[1] = search_key;

        // esconder qualquer alerta previamente aberto.
        $('#error_box').fadeOut(200);
        $('#botao_pesquisa').addClass('disabled');

        // Reseta a tabela para uma nova pesquisa.
        $('#resultado_pesquisa').html(
          '<tr>' +
            '<th>Nome</th>' +
            '<th>Turma</th>' +
            '<th>Matrícula</th>' +
            '<th>Ações</th>' +
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
