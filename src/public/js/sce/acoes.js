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
  'use strict'
  
  $(document).ready(function () {
    /**
     * Preparando as configurações da página.
     */
    var decodedURL = decodeURIComponent(window.location).split('/')
    var what = null
    var key = null
    // Variável que guarda os dados recebidos pelo WebSocket da entidade em questão.
    var dadosEntidade = null

    what = decodedURL[decodedURL.length - 2]
    key = decodedURL[decodedURL.length - 1]

    for (var i in decodedURL) {
      if (decodedURL[i] === 'visualize') {
        $('#cabecalho-visualiza').show('slow')
        document.title = 'SCE - Visualize ' + what
      }
    }

    /**
     * Método para fazer o form escolhido ficar visível e
     * excluir os outros forms da página.
     * @param {String} which Qual form a ser ser motrado na página.
     */
    function mostraForm (which) {
      var forms = {
        'turma': '#form-turma',
        'empresa': '#form-empresa',
        'orientador': '#form-orientador',
        'estagiario': '#form-estagiario'
      }

      for (var form in forms) {
        if (form === which) {
          $(forms[form]).show('slow')
        } else {
          $(forms[form]).remove()
        }
      }
    }

    /**
     * Remove a entidade do sistema
     * @param {String} which Qual entidade do sistema remover
     */
    window.removerEntidade = function (which) {
      switch (which) {
        case 'estagiario':
          window.acaoRemove(which, key)
          window.notificacao_informacao('Removendo estagiário...')
          if ($('#error_box').hasClass('sce-hide')) {
            window.notificacao_informacao('Redirecionando em 5 segundos...')
            window.setTimeout(function () {
              window.location = '/'
            }, 5000)
          }
          break
        case 'empresa':
          window.acaoRemove(which, key)
          window.notificacao_informacao('Removendo empresa...')
          if ($('#error_box').hasClass('sce-hide')) {
            window.notificacao_informacao('Redirecionando em 5 segundos...')
            window.setTimeout(function () {
              window.location = '/empresas.html'
            }, 5000)
          }
          break
        case 'orientador':
          window.acaoRemove(which, key)
          window.notificacao_informacao('Removendo orientador...')
          if ($('#error_box').hasClass('sce-hide')) {
            window.notificacao_informacao('Redirecionando em 5 segundos...')
            window.setTimeout(function () {
              window.location = '/orientadores.html'
            }, 5000)
          }
          break
        case 'turma':
          window.acaoRemove(which, key)
          window.notificacao_informacao('Removendo turma...')
          if ($('#error_box').hasClass('sce-hide')) {
            window.notificacao_informacao('Redirecionando em 5 segundos...')
            window.setTimeout(function () {
              window.location = '/turmas.html'
            }, 5000)
          }
          break
      }
    }

    /**
     * Função que popula o formulário da página com os dados vindos
     * do WebSocket.
     * @param {Array} dados Um array de um objeto, o objeto contém
     * informações sobre a entidade em questão.
     */
    function populaForm (dados) {
      window.notificacao_informacao('Carregando informações...')
      var elementosForm = $('.form-control')

      if (dados) {
        dadosEntidade = dados.value[0]
      }

      // Not the best way to do it... O(n^2), although this is not so processing intensive.
      for (var i = 0; i < elementosForm.length; i++) {
        for (var caracteristica in dadosEntidade) {
          if (caracteristica == elementosForm[i].name.split('[')[1].split(']')[0]) {
            if (elementosForm[i].type === 'select-one') {
              elementosForm[i].value = dadosEntidade[caracteristica]
              break
            } else {
              if (caracteristica === 'periodo_inicio' || caracteristica === 'periodo_fim') {
                elementosForm[i].value = dadosEntidade[caracteristica].split('T')[0].split('-').reverse().join('-')
                break
              }
              elementosForm[i].value = dadosEntidade[caracteristica]
            }
            break
          }
        }
      }
    }

    var pesquisa = {
      search_string: key,
      search_for: [null, null]
    }

    window.ws.onopen = function (e) {
      console.log('Conexão com o web socket bem sucedida na porta %s', window.ws_port)

      var objetoPesquisa = {
        code: '1006',
        desc: 'search',
        value: null
      }

      switch (what) {
        case 'estagiario':
          pesquisa.search_for[0] = 'estagiario'
          pesquisa.search_for[1] = 'matricula'

          objetoPesquisa.value = pesquisa
          break
        case 'empresa':
          pesquisa.search_for[0] = 'empresa'
          pesquisa.search_for[1] = 'id_empresa'

          objetoPesquisa.value = pesquisa
          break
        case 'turma':
          pesquisa.search_for[0] = 'turma'
          pesquisa.search_for[1] = 'id_turma'

          objetoPesquisa.value = pesquisa
          break
        case 'orientador':
          pesquisa.search_for[0] = 'orientador'
          pesquisa.search_for[1] = 'siap'

          objetoPesquisa.value = pesquisa
          break
        default:
          console.error('URL mal formatada.')
          break
      }

      if (objetoPesquisa.value !== null) {
        window.ws.send(JSON.stringify(objetoPesquisa))
      }
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
              /* O formulário do estagiário depende de outras informações como
               * as empresas, orientadores e turmas disponíveis, por esse motivo
               * é necessário buscar essas informações antes de popular o formulário
               * com as informações do estagiário especificado.
               */
              window.ws.send(JSON.stringify({
                code: '1006',
                desc: 'get_companies'
              }))

              window.ws.send(JSON.stringify({
                code: '1006',
                desc: 'get_tutors'
              }))

              window.ws.send(JSON.stringify({
                code: '1006',
                desc: 'get_classes'
              }))

              // TODO: As informações da empresa, turma e orientadores estão sendo preenchidas
              // antes dos selects estarem populados com as informações, e por isso não estão
              // aparecendo.
              mostraForm('estagiario')
              populaForm(data)
              break
            case 'orientadores':
              mostraForm('orientador')
              populaForm(data)
              break
            case 'empresas':
              mostraForm('empresa')
              populaForm(data)
              break
            case 'turmas':
              mostraForm('turma')
              populaForm(data)
              break
            case 'lista_empresas':
              if (data.value) {
                for (var i = 0; i < data.value.length; i++) {
                  $('select#select-empresa').append(
                      '<option value="' + data.value[i].nome + '">' + data.value[i].nome + '</option>'
                  )
                }
              }
              break
            case 'lista_orientadores':
              if (data.value) {
                for (i = 0; i < data.value.length; i++) {
                  $('select#select-orientador').append(
                      '<option value="' + data.value[i].siap + '">' + data.value[i].nome + '</option>'
                  )
                }
              }
              break
            case 'lista_turmas':
              if (data.value) {
                for (i = 0; i < data.value.length; i++) {
                  $('select#select-turma').append(
                    '<option value="' + data.value[i].id_turma + '">' + data.value[i].id_turma + ' - ' + data.value[i].curso + '</option>'
                  )
                }
              }
              break
          }
          break
        case '1004':
          window.handleError(data)
          break
      }
    }

    // Executa um segundo populamento por causa das informações que chegam após a aparição
    // do formulário.
    window.setTimeout(function () {
      populaForm()
      window.notificacao_sucesso('Informações carregadas!')
      window.esconder_notificacao(750)
    }, 1000)
  }) // document.ready
}
