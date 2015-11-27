/**
 * Este arquivo pertence ao SCE - Sistema de Controle de Estágio -, cuja função
 * é realizar o controle de estágio para discentes do IFPA.
 * Copyright (C) 2015  Rafael Campos Nunes
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
 
'use strict'

if(typeof sockets == "undefined") {
  throw new Error("This script requires sockets.js, verify if it was included.");
}
if(typeof notificacao == "undefined") {
  throw new Error("This script requires notification.js, verify if it was included.");
}
else {
  $(document).ready(function() {
    ws.onopen = function(e) {
      console.log("Conexão com o web socket bem sucedida na porta %s", ws_port);
      carregar_empresas(function() {
        notificacao_sucesso('Empresas carregadas <i class="libre libre-check-yes"></i>');
        esconder_notificacao();
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

      switch (data.code) {
        case '1007':
          switch(data.desc) {
            case 'empresas':
              for(var i = 0; i < data.value.length; i++) {
                $('#tabela-empresas').append(
                  '<tr>' +
                  ' <td>'+ data.value[i].nome + '</td>' +
                  ' <td>' + data.value[i].telefone + '</td>' +
                  ' <td>' + data.value[i].email + '</td>' +
                  ' <td class="text-center">' +
                  '   <div class="btn-group btn-group-lg" role="group" id="grupoAcoes">' +
                  '     <button class="btn sce-btn-primary disabled" data-toggle="tooltip" data-container="body" title="Editar informações da empresa" data-id='+ data.value[i].id_empresa +' data-row="'+ i +'" id="botaoEdita"><i class="libre libre-edit"></i></button>' +
                  '     <button class="btn sce-btn-default disabled" data-toggle="tooltip" data-container="body" title="Ver informações da empresa" data-id='+ data.value[i].id_empresa +' data-row="'+ i +'" id="botaoVer"><i class="libre libre-content"></i></button>' +
                  '     <button class="btn sce-btn-danger" data-toggle="tooltip" data-container="body" title="Excluir empresa" data-id='+ data.value[i].id_empresa +' data-row="'+ i +'" id="botaoRemove"><i class="libre libre-trash"></i></button></div>' +
                  ' </td>' +
                  '</tr>'
                );
              }

              $('#tabela-empresas').fadeIn(350); 
              break;

            case 'delete_empresa':
              notificacao_sucesso('Empresa removida');
              esconder_notificacao(1500);
              break;
            }
          break;
        case '1004':
          $('p#error_box').html(
            '<button type="button" class="close" data-dismiss="alert" title="Clique para fechar">' +
            '<span aria-hidden="true"> &times;</span></button> Erro no sistema (1004): ' + data.desc
          );
          $('p#error_box').removeClass('sce-hide').fadeIn("slow");
          break;
      }

      $("table tr td #grupoAcoes").on('click', function(e) {
        if(e.target !== e.currentTarget) {
          var clickedItem = e.target.id,
              linhaNumero = parseInt(e.target.dataset.row) + 1;

          if(clickedItem === 'botaoVer') {
            acaoVer('empresa', e.target.dataset.id);
          }
          else if(clickedItem === 'botaoEdita') {
            acaoEdita('empresa', e.target.dataset.id);
          }
          else if(clickedItem === 'botaoRemove') {
            acaoRemove('empresa', e.target.dataset.id);
            getElementById('tabela-empresas').deleteRow(linhaNumero);
          }
        }
        e.stopPropagation();
      });
    }

    /**
     * Carrega a lista de empresas para o cliente.
     */
    function carregar_empresas(callback) {
      notificacao_informacao('Carregando empresas...');

      ws.send(JSON.stringify({
        code: '1006',
        desc: 'get_companies'
      }));

      callback();
    }
  });
}
