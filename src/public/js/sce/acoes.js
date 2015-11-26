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

// Verificando se o objeto sockets existe na página.
if (typeof sockets == 'undefined') {
  throw new Error('This script requires sockets.js, verify if it was included.');
}
else {
  $(document).ready(function() {
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

    }

    // NOTE: O nome dos modais podem não estar semânticamente claros.

    /**
     * @param {String} what O que remover?
     * @param {Integer} key A chave que descreve o que vai ser removido, é
     * uma chave única.
     */
    window.acaoRemove = function(what, key) {
      $('#removeModal').modal('show');
    }

    /**
     * @param {String} what O que remover?
     * @param {Integer} key A chave que descreve o que vai ser removido, é
     * uma chave única.
     */
    window.acaoEdita = function(what, key) {
      $('#editaModal').modal('show');
    }

    /**
     * @param {String} what O que remover?
     * @param {Integer} key A chave que descreve o que vai ser removido, é
     * uma chave única.
     */
    window.acaoVer = function(what, key) {
      $('#verModal').modal('show');
    }
  });
}
