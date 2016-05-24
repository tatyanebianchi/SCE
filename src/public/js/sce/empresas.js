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

if (typeof sockets === 'undefined') {
  throw new Error('This script requires sockets.js, verify if it was included.')
}
if (typeof notificacao === 'undefined') {
  throw new Error('This script requires notification.js, verify if it was included.')
} else {
  $(document).ready(function () {
    var linhaEmpresa = null;

    window.ws.onopen = function (e) {
      console.log('Conexão com o web socket bem sucedida na porta %s', window.ws_port)
      carregar_empresas(function () {
        window.notificacao_sucesso('Empresas carregadas <i class="libre libre-check-yes"></i>')
        window.esconder_notificacao()
      })
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
            case 'lista_empresas':
              if (data.value[0].nome === undefined) {
                window.handleError(data)
              } else {
                for (var i = 0; i < data.value.length; i++) {
                  $('#tabela-empresas').append(
                    '<tr>' +
                    ' <td>' + data.value[i].nome + '</td>' +
                    ' <td>' + (data.value[i].telefone == null ? 'Nenhum telefone informado' : data.value[i].telefone) + '</td>' +
                    ' <td>' + (data.value[i].email == null ? 'Nenhum email informado' : data.value[i].email) + '</td>' +
                    ' <td class="text-center">' +
                    '   <div class="btn-group btn-group-lg" role="group" id="grupoAcoes">' +
                    '     <button class="btn sce-btn-default" data-toggle="tooltip" data-container="body" title="Ver informações da empresa" data-id="' + data.value[i].id_empresa + '" data-row="' + i + '" id="botaoVer"><i class="libre libre-content"></i></button>' +
                    '     <button class="btn sce-btn-danger" data-toggle="tooltip" data-container="body" title="Excluir empresa" data-id="' + data.value[i].id_empresa + '" data-row="' + i + '" id="botaoRemove"><i class="libre libre-trash"></i></button></div>' +
                    ' </td>' +
                    '</tr>'
                  ).fadeIn(250)
                }
              }
              break

            case 'delete_empresa':
              if (linhaEmpresa !== null) {
                document.getElementById('tabela-empresas').deleteRow(linhaEmpresa)
              }
              window.notificacao_sucesso('Empresa removida')
              window.esconder_notificacao(1500)
              break
          }
          break
        case '1004':
          window.handleError(data)
          break
      }

      $('table tr td #grupoAcoes').on('click', function (e) {
        if (e.target !== e.currentTarget) {
          var clickedItem = e.target.id

          if (parseInt(e.target.dataset.row, 10) === 0) {
            linhaEmpresa = parseInt(e.target.dataset.row, 10)
          } else {
            linhaEmpresa = parseInt(e.target.dataset.row, 10) + 1
          }

          if (clickedItem === 'botaoVer') {
            window.acaoVer('empresa', e.target.dataset.id)
          } else if (clickedItem === 'botaoRemove') {
            window.acaoRemove('empresa', e.target.dataset.id)
          }
        }
        e.stopPropagation()
      })
    }

    /**
     * Carrega a lista de empresas para o cliente.
     */
    function carregar_empresas (callback) {
      window.notificacao_informacao('Carregando empresas...')

      window.ws.send(JSON.stringify({
        code: '1006',
        desc: 'get_companies'
      }))

      callback()
    }
  })
}
