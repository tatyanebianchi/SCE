/**
 *
 */

 // Verificando se o objeto sockets existe na página.
 if(typeof sockets == "undefined") {
     throw new Error("This script requires sockets.js, verify if it was included.");
 }
else {
    ws.onopen = function(e) {
        console.log("Conexão com o web socket bem sucedida na porta %s", ws_port);
        carregar_lista();
    }

    ws.onerror = function(e) {
        console.log("Erro de conexão com o websocket, provavelmente o servidor foi desligado.");
    }

    ws.onclose = function(e) {
      console.log("Conexão com o websocket fechada.");
    }

    ws.onmessage = function(data) {
        // Transformando os dados em JSON novamente.
        data = JSON.parse(data.data);

        switch (data.code) {
            case '1007':
                switch(data.desc) {
                    case 'empresas':
                        $('#tabela-empresas').fadeIn("fast");
                        for(var i = 0; i < data.value.length; i++) {
                            $('#tabela-empresas').append(
                                "<tr><td>"+ data.value[i].nome + "</td>" +
                                "<td>" + data.value[i].telefone + "</td>" +
                                "<td>" + data.value[i].email + "</td>" +
                                "<td class='text-center'><div class='btn-group btn-group-lg' role='group'><button class='btn sce-btn-primary' title='Editar informações da empresa'><i class='libre libre-edit'></i></button>" +
                                "<button class='btn sce-btn-default' title='Ver informações da empresa'><i class='libre libre-content'></i></button>" +
                                "<button class='btn sce-btn-danger' title='Excluir empresa'><i class='libre libre-trash'></i></button></div></td></tr>"
                            ).fadeIn("slow");
                        }
                        break;
                  }
                break;
            case '1004':
                $('p#error_box').html(
                  '<button type="button" class="close" data-dismiss="alert" title="Clique para fechar">' +
                  '<span aria-hidden="true"> &times;</span></button> Erro no sistema (1004): ' + data.desc
                );
                $('p#error_box').removeClass('hide').fadeIn("slow");
                break;

        }
    }

    /**
     *
     */
    function carregar_lista() {
      // TODO: Capturar e escrever todas as empresas que estão no banco de dados.
      ws.send(JSON.stringify({
          code: '1006',
          desc: 'get_companies'
      }));
    }
}
