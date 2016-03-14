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

/**
 * Este arquivo define um objeto global chamado sockets, ws como também ws_port, sem eles (os objetos)
 * a aplicação não funcionará apropriadamente.
 */
(function () {
  'use strict'

  var ws
  var sockets
  var ws_port = 9005
  var socketRefreshId
  var stopRefreshId = false

  window.bootWebSocket = function () {
    return new WebSocket('ws://' + window.location.hostname + ':' + ws_port)
  }

  ws = window.bootWebSocket()

  // se ws está com estado OPEN ou está CONNECTING.
  if (ws.readyState === 0 || ws.readyState === 1) {
    sockets = true
  } else {
    console.error('A conexão com o WebSockets não ocorreu como esperado.')
  }

  window.ws = ws
  window.sockets = sockets
  window.ws_port = ws_port
  window.socketRefreshId = socketRefreshId
  window.stopRefreshId = stopRefreshId
})()

/**
 * Método para tentar se conectar ao servidor do SCE.
 */
window.reconectar = function () {
  if (window.ws.readyState === 3) {
    window.ws = window.bootWebSocket()
  } else if (window.ws.readyState === 0 || window.ws.readyState === 1) {
    sockets = true
    window.esconder_notificacao()
    window.setTimeout(window.location.reload(true), 1000)
  }
}

/**
 * 
 */
window.socketRefreshId = window.setInterval(function () {
  if (window.location.pathname !== '/status.html') {
    if (window.ws.readyState !== 1) {
      stopRefreshId = true
      window.esconder_notificacao()
      window.notificacao_erro('Perdemos a conexão com o servidor.<br>' +
      '<button class="btn btn-out-danger center" onclick="window.reconectar()">Reconectar</button>', true)
    }
  }
}, 2000)

/**
 * É, eu sei, um setInterval para parar outro setInterval.
 */ 
window.setInterval(function () {
  if (stopRefreshId === true) {
    window.clearInterval(window.socketRefreshId)
  }
}, 2500)

