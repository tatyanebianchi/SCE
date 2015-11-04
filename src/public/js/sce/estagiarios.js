/**
 * Realiza o cadastro do estagiário assim como a captura de informações para
 * preenchimento de alguns campos.
 */

// Verificando se o objeto sockets existe na página.
if(typeof sockets == "undefined") {
    throw new Error("This script requires sockets.js, verify if it was included.");
}
else {
    ws.onopen = function(e) {
        console.log("Conexão com o web socket bem sucedida na porta %s", ws_port);
        carregar_informacoes(function() {
            setTimeout(function() {
              $("#submit_button").removeClass("disabled");
              notificacao_sucesso('Informações carregadas <i class="libre libre-check-yes"></i>');
              esconder_notificacao();
            }, 2000);

        });
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
                switch (data.desc) {
                    case 'empresas':
                        if(data.value) {
                            for (var i = 0; i < data.value.length; i++) {
                              $('select#select-empresa').append(
                                  '<option value="'+ data.value[i].nome +'">' + data.value[i].nome + '</option>'
                              )
                            }
                        }
                        break;
                    case 'orientadores':
                        if(data.value) {
                            for (var i = 0; i < data.value.length; i++) {
                              $('select#select-orientador').append(
                                  '<option value="'+ data.value[i].siap +'">' + data.value[i].nome + '</option>'
                              )
                            }
                        }
                        break;
                    case 'classes':
                        if(data.value) {
                            for (var i = 0; i < data.value.length; i++) {
                              $('select#select-turma').append(
                                  '<option value="'+ data.value[i].id_turma +'">' + data.value[i].id_turma + ' - ' +  data.value[i].curso +  '</option>'
                              )
                            }
                        }
                        break;
                }
                break;
            case '1000': // cadastro bem sucedido
                notificacao_sucesso(data.desc + " <i class='libre libre-check-yes'></i>");
                break;
            case '1004':
                // TODO: Tratar erro de duplicação de chave primária.
                $('h4#modal-titulo').html('Erro 1004');
                $('div#modal-corpo').addClass('bg bg-danger');
                if(data.desc == "[DB_API_ERR]") {
                    $('div#modal-corpo').html(
                      "O sistema não pôde obter algumas" +
                      " informações para o cadastro.<br>");

                    if(typeof data.value !== 'undefined') {
                        $('div#modal-corpo').append(
                            '<br><strong> Descrição do erro: ' + data.desc + '</strong>' +
                            "<br><strong>Erro: " + data.value.code + ", errno: " + data.value.errno + '</strong>'
                        );
                    }
                    else {
                        $('div#modal-corpo').append(
                            '<br><strong> Descrição do erro: ' + data.desc + '</strong>' +
                            '<br><strong> Erro: ' + data.err + '</strong>'
                        );
                    }
                }

                $('div#modal-rodape').html('<button class="btn btn-danger" data-dismiss="modal">Ok</button>');
                $('div#cadastro-estado').modal('show');
                $('button#submit').addClass('disabled');
                break;
        }
    }

    /**
     *
     */
    function carregar_informacoes(callback_return) {
        notificacao_alerta('Carregando dados para cadastro...');
        $("submit_button").addClass(" disabled ");

        ws.send(JSON.stringify({
            code: '1006',
            desc: 'get_companies'
        }));

        ws.send(JSON.stringify({
            code: '1006',
            desc: 'get_tutors'
        }));

        ws.send(JSON.stringify({
            code: '1006',
            desc: 'get_classes'
        }));

        callback_return();
    }

    function verificar_informacoes() {
        //
        var data_regex = /[0-9][0-9][1-9][0-9]-([0][1-9]|[1][0-2])-([0-2][1-9]|[3][0-1])/g;

        // TODO: fazer a verificação de todos os dados.

        if($('select#select-turno').val() != "none" &&
           $('select#select-turma').val() != "none" &&
           $('select#select-empresa').val() != "none" &&
           $('select#select-orientador').val() != "none") {

            if($('#data_inicio').val().match(data_regex) != null && $('#data_fim').val().match(data_regex) != null) {
                return true;
            }
            else {
                $('#data_inicio').parent().parent('div.form-group').addClass('has-warning');
                $('#data_fim').parent().parent('div.form-group').addClass('has-warning');
                return false;
            }
        }
        else {
            var elements = document.cadastra_estagiario.elements;

            for(var i = 0, element; element = elements[i++];) {
                if(element.type == "select-one" && element.value == "none") {
                    var nome = element.id;
                    $('select#' + nome).parent().parent("div.form-group").addClass("has-warning");
                }
                else if(element.type == "select-one" && element.value == "none") {
                  var nome = element.id;
                  $('select#' + nome).parent().parent("div.form-group").removeClass("has-warning");
                }
            }
            return false;
        }
    }
 }
