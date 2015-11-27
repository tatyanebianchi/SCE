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

if(typeof sockets == 'undefined') {
   throw new Error('This script requires sockets.js, verify if it was included.');
}
if (typeof notificacao == 'undefined') {
  throw new Error("This script requires notification.js, verify if it was included.");
}
else {
  $(document).ready(function() {
    var pageUrl = window.location.pathname;

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
              // HACK: Estou quebrando o padrão (W3C) sobre IDs únicas nesse algorítmo.
              for(var i = 0; i < data.value.length; i++) {
                if(pageUrl == '/' || pageUrl == '/index.html') {
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
                      ' <div class="btn-group btn-group-lg" role="group" id="grupoAcoes">' +
                      '  <button class="btn sce-btn-primary disabled" title="Editar informações do estagiário" data-toggle="tooltip" data-container="body" data-matricula="'+ data.value[i].matricula +'" id="botaoEdita"><i class="libre libre-edit"></i></button>' +
                      '  <button class="btn sce-btn-default disabled" title="Ver informações do estagiário" data-toggle="tooltip" data-container="body" data-matricula="'+ data.value[i].matricula +'" id="botaoVer"><i class="libre libre-content"></i></button>' +
                      '  <button class="btn sce-btn-danger" title="Excluir estagiário" data-toggle="tooltip" data-container="body" data-matricula="'+ data.value[i].matricula +'" id="botaoRemove"><i class="libre libre-trash"></i></button>' +
                      ' </div>' +
                      '</td>' +
                    '</tr>'
                  ).fadeIn(250);
                }
                else if(pageUrl == '/remove_estagiario.html') {
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
                      // HACK: Olha isso, que gambi.
                      ' <div id="grupoAcoes">' +
                      '   <button class="btn sce-btn-danger" title="Excluir estagiário" data-toggle="tooltip" data-matricula="'+ data.value[i].matricula +'" data-row="'+ i +'" id="botaoRemove">Remover estagiário <i class="libre libre-trash"></i></button>' +
                      ' </div>' +
                      '</td>' +
                    '</tr>'
                  ).fadeIn(250);
                }
              }
              // habilitando o uso do botão novamente.
              $('#botao_pesquisa').removeClass('disabled');
              break;

            case 'delete_estagiario':
              notificacao_sucesso('Estagiário removido <i class="libre libre-check-yes"></i>');
              esconder_notificacao(1500);
              break;
          } // switch data.desc
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

      $("table tbody tr td #grupoAcoes").on('click', function(e) {
        if(e.target !== e.currentTarget) {
          var clickedItem = e.target.id,
              linhaNumero = parseInt(e.target.dataset.row) + 1;

          if(clickedItem === 'botaoVer') {
            acaoVer('estagiario', e.target.dataset.matricula);
          }
          else if(clickedItem === 'botaoEdita') {
            acaoEdita('estagiario', e.target.dataset.matricula);
          }
          else if(clickedItem === 'botaoRemove') {
            acaoRemove('estagiario', e.target.dataset.matricula);
            getElementById('resultado_pesquisa').deleteRow(linhaNumero);
          }
        }
        e.stopPropagation();
      });
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
      ).fadeOut(30);

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
  });
}
