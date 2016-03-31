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
     * Preparando as configurações da página.
     */
    var decodedURL = decodeURIComponent(window.location).split('/')
    var what = null
    var key = null

    what = decodedURL[decodedURL.length - 2]
    key = decodedURL[decodedURL.length - 1]

    /**
     * Método que habilita a edição do formulário;
     */
    window.habilitarEdicao = function () {
      $('#botao-atualizar').prop('disabled', false)
      $('#botao-limpa-campos').prop('disabled', false)
      $('#cabecalho-visualiza').hide('fast', function () {
        $('#cabecalho-edita').show('slow')
      })

      document.title = 'SCE - Editar ' + what

      var elementosForm = $('.form-control')

      for (var elemento in elementosForm) {
        if (elementosForm[elemento].type === 'text' ||
            elementosForm[elemento].type === 'textarea' ||
            elementosForm[elemento].type === 'number') {
          $(elementosForm[elemento]).prop('readonly', false)
        } else if (elementosForm[elemento].type === 'select-one') {
          $(elementosForm[elemento]).prop('disabled', false)
        }
      }
    }

    for (var i in decodedURL) {
      if (decodedURL[i] === 'visualize') {
        $('#cabecalho-visualiza').show()
        document.title = 'SCE - Visualize ' + what
      } else if (decodedURL[i] === 'edite') {
        $('#cabecalho-edita').show('slow')
        window.habilitarEdicao()
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
     * Função que popula o formulário da página com os dados vindos
     * do WebSocket.
     * @param {Array} dados Um array de um objeto, o objeto contém
     * informações sobre a entidade em questão.
     */
    function populaForm (dados) {
      var elementosForm = $('.form-control')
      var entidade = dados.value[0]

      // gambi rules.
      for (var i = 0; i < elementosForm.length; i++) {
        for (var caracteristica in entidade) {
          if (caracteristica == elementosForm[i].name.split('[')[1].split(']')[0]) {
            if (elementosForm[i].type === 'select-one') {
              elementosForm[i].value = entidade[caracteristica]
              break
            }
            elementosForm[i].value = entidade[caracteristica]
            break
          }
        }
      }
    }

    /**
     * Método para limpar todos os campos do formulário.
     */
    window.limparCampos = function () {
      var elementosForm = $('.form-control')

      for (var elemento in elementosForm) {
        if (elementosForm[elemento].type === 'text' ||
            elementosForm[elemento].type === 'textarea' ||
            elementosForm[elemento].type === 'number') {
          elementosForm[elemento].value = ''
        } else if (elementosForm[elemento].type === 'select-one') {
          elementosForm[elemento].value = 'none'
        }
      }
    }

    /**
     * Função que envia os dados via WebSockets para atualização de entidades
     * no SCE.
     * @param {String} what A entidade a ser atualizada.
     */
    window.atualiza = function (what) {
      var dados = validaForm(what)

      objetoAtualizacao = {
        code: '1006',
        desc: null,
        value: dados
      }

      switch (what) {
        case 'estagiario':
          objeto.desc = 'atualiza_estagiario'
          break
        case 'orientador':
          objeto.desc = 'atualiza_orientador'
          break
        case 'empresa':
          objeto.desc = 'atualiza_empresa'
          break
        case 'turma':
          objeto.dec = 'atualiza_turma'
          break
      }


      if (objetoAtualizacao.desc !== null) {
        ws.send(JSON.stringify({ objetoAtualizacao }))
      } else {
        throw new Error('Não foi possível enviar a atualização ao servidor devido ' +
                  'ao objeto sem descrição.')
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
  }) // document.ready
}
