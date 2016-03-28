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
 * Script para gerenciar a edição e a visualização de dados do sistema.
 */

if (typeof basejs === 'undefined') {
  throw new Error('This script requires base.js, verify if it was included.')
} else if (typeof sockets === 'undefined') {
  throw new Error('This script requires sockets.js, verify if it was included.')
} else if (typeof notificacao === 'undefined') {
  throw new Error('This script requires notification.js, verify if it was included.')
} else {
  $(document).ready(function () {
    /**
     * Preparando a pesquisa no banco de dados
     */
    var decodedURL = decodeURIComponent(window.location.href).split('/')
    var visualize = false
    var what = null
    var key = null

    for (var i in decodedURL) {
      if (decodedURL[i] === 'visualize') {
        visualize = true
      }
    }

    what = decodedURL[decodedURL.length - 2]
    key = decodedURL[decodedURL.length - 1]

    var pesquisa = {
      search_string: key,
      search_for: [null, null]
    }

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
            case 'estagiarios':
              break
            case 'orientadores':
              break
            case 'empresas':
              break
            case 'turmas':
              break
          }
          break
        case '1004':
          window.handleError(data)
          break
      }
    }

    /**
     * Enviando requisição de pesquisa para o servidor.
     */
    switch (what) {
      case 'estagiario':
        pesquisa.search_for[0] = 'estagiario'
        pesquisa.search_for[1] = 'matricula'

        window.ws.send(JSON.stringify({
          code: '1006',
          desc: 'search',
          value: pesquisa
        }))
        break
      case 'empresa':
        pesquisa.search_for[0] = 'empresa'
        pesquisa.search_for[1] = 'id_empresa'

        window.ws.send(JSON.stringify({
          code: '1006',
          desc: 'search',
          value: pesquisa
        }))
        break
      case 'turma':
        pesquisa.search_for[0] = 'turma'
        pesquisa.search_for[1] = 'id_turma'

        window.ws.send(JSON.stringify({
          code: '1006',
          desc: 'search',
          value: pesquisa
        }))
        break
      case 'orientador':
        pesquisa.search_for[0] = 'orientador'
        pesquisa.search_for[1] = 'siap'

        window.ws.send(JSON.stringify({
          code: '1006',
          desc: 'search',
          value: pesquisa
        }))
        break
      default:
        console.error('URL mal formatada.')
        break
    }
  })
}
