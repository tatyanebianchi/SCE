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

if (typeof sockets == 'undefined') {
  throw new Error('This script requires sockets.js, verify if it was included.')
} else {
  $(document).ready(function () {
    var segundos = 10
    var classes = 'label-danger label-success label-warning label-info label-default'

    var messageIcon = '<div class="libre-stack">' +
                      '  <i class="libre libre-stack-1x libre-circle"></i>' +
                      '  <i class="libre libre-stack-1x libre-info text-white"></i>' +
                      '</div>'

    window.setInterval(function () {
      if (window.ws.readyState === 1) {
        window.ws.send(JSON.stringify({
          code: '1006',
          desc: 'get_db_status'
        }))

        window.ws.send(JSON.stringify({
          code: '1006',
          desc: 'get_server_status'
        }))
      }
      segundos = 10
      window.reconectar()
    }, 10000)

		$('#contador').html('Atualizando dados em ' + segundos + ' segundos...')

    window.setInterval(function () {
      segundos--
			$('#contador').html('Atualizando dados em ' + segundos + ' segundos...')
    }, 1000)

    window.ws.onopen = function (e) {
      console.log('Conexão com o web socket bem sucedida na porta %s', window.ws_port)
      esconderErroServidor()

      window.ws.send(JSON.stringify({
        code: '1006',
        desc: 'get_db_status'
      }))

      window.ws.send(JSON.stringify({
        code: '1006',
        desc: 'get_server_status'
      }))
      // TODO: Achar um jeito de se conectar ao WebSocket do servidor se por acaso ele cair
      mudarEstado('conexao-servidor', 'label-success', 'online')
    }

    window.ws.onerror = function (e) {
      console.log('Erro de conexão com o websocket, provavelmente o servidor foi desligado.')
      mudarEstado('conexao-servidor', 'label-danger', 'offline')
      mudarEstado('conexao-bd', 'label-danger', 'sem conexão')
      mostrarErroServidor()
    }

    window.ws.onclose = function (e) {
      console.log('Conexão com o websocket fechada, provavelmente o servidor foi desligado.')
      mudarEstado('conexao-servidor', 'label-danger', 'offline')
      mudarEstado('conexao-bd', 'label-danger', 'sem conexão')
      mostrarErroServidor()
    }

    window.ws.onmessage = function (data) {
      data = JSON.parse(data.data)

      switch (data.code) {
        case '1007':
          switch (data.desc) {
            case 'database_state':
              mudarEstado('conexao-bd', 'label-success', 'conectado')
              // FIXME: Exibir a versão do banco nesse campo.
              $('#versao-bd').html(data.value.version['VERSION()'])
              $('#erro-bd').fadeOut(500)
              break
            case 'server_state':
              $('#nodejs-ver').html(data.value.nodejsVer)
              $('#sce-logdir').html(data.value.logDir)
              $('#sce-contador-excecao').html(data.value.exceptions)
              break
          }
          break

        case '1004':
          switch (data.desc) {
            case 'database_state':
              if (data.value.connection === false) {
                mudarEstado('conexao-bd', 'label-danger', 'sem conexão')
                $('#erro-bd').html(messageIcon + ' Erro no banco de dados: <b>' + data.value.error.code +
                              '</b>. Peça para o administrador verificar se o banco de dados está ligado.')
                             .fadeIn(500)
              } else {
                mudarEstado('conexao-bd', 'label-success', 'conectado')
                $('#erro-bd').html(messageIcon + ' Erro no banco de dados: ' + data.value.error.code)
                             .fadeIn(500)
              }
              break
            case 'server_state':
              $('#nodejs-ver').html(data.value.nodejsVer)
              $('#sce-logdir').html(data.value.logDir)
              $('#sce-contador-excecao').html(data.value.exceptions)
              break
          }
          break
      }
    }

    /**
     * Função auxiliar para mudar o "estado" de um elemento.
     * @param elementoNome O nome do elemento que contém o estado de algo.
     * @param classe Classe a ser inserida no elemento para estilizacão do elemento.
     * @param estado Estado do elemento e.g. true, false, offline, online, sem conexão e conectado.
     */
    function mudarEstado (elementoNome, classe, estado) {
      $('#' + elementoNome).removeClass(classes)
                              .addClass(classe)
                              .html(estado)
    }

    function mostrarErroServidor () {
       $('#erro-servidor').html(messageIcon + ' Não foi possível assegurar a conexão com o servidor.')
                             .fadeIn(500)
       $('#erro-bd').html(messageIcon + ' Não foi possível assegurar a conexão com o banco de dados.')
                    .fadeIn(500)
       $('#botao-reconecta').fadeIn(500)                    
    }

    function esconderErroServidor () {
      $('#erro-servidor').fadeOut(500)
      $('#botao-reconecta').fadeOut(300)
    }
  })
}
