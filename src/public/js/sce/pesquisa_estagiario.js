/**
 * Script para pesquisa de um estagiário no front-end.
 */

 // Verificando se o objeto sockets existe na página.
 if(typeof sockets == "undefined") {
     throw new Error("This script requires sockets.js, verify if it was included.");
 }
else {
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
                                    '</td>' +
                                '</tr>'
                            ).fadeIn(250);
                        }

                        // habilitando o uso do botão novamente.
                        $('#botao_pesquisa').removeClass('disabled');
                        break;
                }
                break;
            case '1004':
                $('#error_box').html(
                  'Um erro ocorreu ao fazer a pesquisa. Erro: <strong>' + data.desc + ' ' +
                  data.value + '</strong>'
                ).fadeIn("slow");
                $('#botao_pesquisa').removeClass('disabled');
                break;
        }
    }

    function pesquisa_estagiario() {
        var nome = document.getElementById("campo_estagiario").value;

        // esconder qualquer alerta previamente aberto para não causar confusão
        $('#error_box').fadeOut(200);
        $('#botao_pesquisa').addClass('disabled');

        // Adiciona os cabeçalhos das colunas.
        $('#resultado_pesquisa').html(
          '<tr>' +
            '<th>Nome</th>' +
            '<th>Turma</th>' +
            '<th>Matrícula</th>' +
            '<th>Ações</th>' +
          '</tr>'
        );

        ws.send(JSON.stringify({
            code: '1006',
            desc: 'search',
            value: nome
        }));

        return true;
    }
}
