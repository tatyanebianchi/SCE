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
 * Esse script controla o comportamento dos botões de visualizar e editar,
 * redirecionando o usuário às respectivas páginas de visualização e de edição.
 */

'use strict'

// Verificando se o objeto sockets existe na página.
if (typeof sockets === 'undefined') {
  throw new Error('This script requires sockets.js, verify if it was included.')
} else {
  $(document).ready(function () {
    /**
     * @param {String} what O que remover?
     * @param {Integer} key A chave que descreve o que vai ser removido, é
     * uma chave única.
     */
    window.acaoRemove = function (what, key) {
      var descricaoRequisicao = null

      switch (what) {
        case 'estagiario':
          descricaoRequisicao = 'delete_estagiario'
          break

        case 'orientador':
          descricaoRequisicao = 'delete_orientador'
          break

        case 'empresa':
          descricaoRequisicao = 'delete_empresa'
          break

        case 'turma':
          descricaoRequisicao = 'delete_turma'
          break

        case 'usuario':
          descricaoRequisicao = 'delete_usuario'
          break
      }


      if (descricaoRequisicao !== null) {
        ws.send(JSON.stringify({
          code: '1006',
          desc: descricaoRequisicao,
          value: key
        }))
      }
    }

    /**
     * @param {String} what O que remover?
     * @param {Integer} key A chave que descreve o que vai ser removido, é
     * uma chave única.
     */
    window.acaoEdita = function (what, key) {
      var encodedString = encodeURIComponent('/edita/' + what + '/' + key)
      window.location = '/acoes.html?' + encodedString
    }

    /**
     * @param {String} what O que remover?
     * @param {Integer} key A chave que descreve o que vai ser removido, é
     * uma chave única.
     */
    window.acaoVer = function (what, key) {
      var encodedString = encodeURIComponent('/visualize/' + what + '/' + key)
      window.location = '/acoes.html?' + encodedString
    }
  })
}
