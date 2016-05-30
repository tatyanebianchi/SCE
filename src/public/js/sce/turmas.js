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

function pesquisa_turma () {
  'use strict'
  
  var search = $('#campo_turma').val()

  var _search_for = []
  _search_for[0] = 'turma'
  _search_for[1] = 'id_turma'

  // esconder qualquer alerta previamente aberto.
  $('#error_box').fadeOut(200)
  $('#botao_pesquisa').addClass('disabled')

  // Reseta a tabela para uma nova pesquisa.
  $('#resultado_pesquisa').html(
    '<tr>' +
      '<th class="text-center">Curso</th>' +
      '<th class="text-center">Turma</th>' +
      '<th class="text-center">Turno</th>' +
      '<th class="text-center">Ações</th>' +
    '</tr>'
  ).fadeOut(30)

  // objeto de pesquisa.
  var pesquisa = {
    search_string: search,
    search_for: _search_for
  }

  window.ws.send(JSON.stringify({
    code: '1006',
    desc: 'search',
    value: pesquisa
  }))
}

if (typeof sockets === 'undefined') {
  throw new Error('This script requires sockets.js, verify if it was included.')
}
if (typeof notificacao === 'undefined') {
  throw new Error('This script requires notification.js, verify if it was included.')
} else {
  'use strict'

  window.ws.onopen = function (e) {
    console.log('Conexão com o web socket bem sucedida na porta %s', window.ws_port)
  }

  window.ws.onerror = function (e) {
    console.log('Erro de conexão com o websocket, provavelmente o servidor foi desligado.')
  }

  window.ws.onclose = function (e) {
    console.log('Conexão com o websocket fechada.')
  }

  window.ws.onmessage = function (data) {
    data = JSON.parse(data.data)

    switch (data.code) {
      case '1007':
        switch (data.desc) {
          case 'turmas':
            if (data.value[0].id_turma === undefined) {
              window.handleError(data)
            } else {
              for (var i = 0; i < data.value.length; i++) {
                $('#resultado_pesquisa').append(
                  '<tr>' +
                  ' <td>' + data.value[i].curso + '</td>' +
                  ' <td>' + data.value[i].id_turma + '</td>' +
                  ' <td>' + data.value[i].turno + '</td>' +
                  ' <td class="text-center">' +
                  '  <div class="btn-group btn-group-lg" role="group" id="grupoAcoes">' +
                  '   <button class="btn sce-btn-default" title="Visualizar informações da turma" data-toggle="tooltip" data-container="body" data-idturma="' + data.value[i].id_turma + '" data-row="' + i + '" id="botaoVer"><i class="libre libre-content"></i></button>' +
                  '   <button class="btn sce-btn-danger" title="Remover turma" data-toggle="tooltip" data-container="body" data-idturma="' + data.value[i].id_turma + '" data-row="' + i + '" id="botaoRemove"><i class="libre libre-trash"></i></button>' +
                  '  </div>' +
                  ' </td>' +
                  '</tr>'
                ).fadeIn(250)
              }
            }
            $('#botao_pesquisa').removeClass('disabled')
            break

          case 'delete_turma':
            window.notificacao_sucesso('Turma removida <i class="libre libre-check-yes"></i>')
            window.esconder_notificacao(1500)
            break
        }
        break
      case '1004':
        window.handleError(data)
        $('#botao_pesquisa').removeClass('disabled')
        break
    }

    $('table tbody tr td #grupoAcoes').on('click', function (e) {
      if (e.target !== e.currentTarget) {
        var clickedItem = e.target.id
        var linhaNumero = parseInt(e.target.dataset.row, 10) + 1

        if (clickedItem === 'botaoVer') {
          window.acaoVer('turma', e.target.dataset.idturma)
        } else if (clickedItem === 'botaoRemove') {
          window.acaoRemove('turma', e.target.dataset.idturma)
          document.getElementById('resultado_pesquisa').deleteRow(linhaNumero)
          pesquisa_turma()
        }
      }
      e.stopPropagation()
    })
  }
}
