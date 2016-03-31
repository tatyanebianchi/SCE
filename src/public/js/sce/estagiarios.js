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

if (typeof basejs === 'undefined') {
  throw new Error('This script requires base.js, verify if it was included.')
} else if (typeof sockets === 'undefined') {
  throw new Error('This script requires sockets.js, verify if it was included.')
} else if (typeof notificacao === 'undefined') {
  throw new Error('This script requires notification.js, verify if it was included.')
} else {
  $(document).ready(function () {
    window.ws.onopen = function (e) {
      console.log('Conexão com o web socket bem sucedida na porta %s', window.ws_port)
      carregarInformacoes(function () {
        setTimeout(function () {
          $('#submit_button').removeClass('disabled')
          window.notificacao_sucesso('Informações carregadas <i class="libre libre-check-yes"></i>')
          window.esconder_notificacao(750)
        }, 1000)
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
        case '1000': // cadastro bem sucedido
          window.notificacao_sucesso(data.desc + ' <i class="libre libre-check-yes"></i>')
          break
        case '1004':
          window.handleError(data)
          $('button#submit').addClass('disabled')
          break
      }
    }

    /**
     * @param {Function} callback
     */
    function carregarInformacoes (callback) {
      window.notificacao_informacao('Carregando dados para cadastro...')
      $('submit_button').addClass('disabled')

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

      callback()
    }

    window.limparCampos = function () {
      var elementosForm = document.getElementsByClassName('form-control')

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

    // Declarações a respeito do form abaixo.
    var form
    form = document.querySelector('.form-horizontal')

    function verifica_informacoes (event) {
      var confirma_data = false
      var confirma_select = false

      // Prevenindo o comportamento padrão se confirma é falso
      // if(confirma_data == false || confirma_select == false) {
      event.preventDefault()
      // }

      // Regex para data no formato AAAA-MM-DD
      var data_regex = /([0-2][1-9]|[1-3][0-1])-([0][1-9]|[1][0-2])-[0-9][0-9][0-9][0-9]/g

      if ($('#data_inicio').val().match(data_regex) != null) {
        $('#data_inicio').parent().parent('div.form-group').removeClass('has-warning')
        confirma_data = true
      } else {
        $('#data_inicio').parent().parent('div.form-group').addClass('has-warning')
        confirma_data = false
      }
      if ($('#data_fim').val().match(data_regex) != null) {
        $('#data_fim').parent().parent('div.form-group').removeClass('has-warning')
        confirma_data = true
      } else {
        $('#data_fim').parent().parent('div.form-group').addClass('has-warning')
        confirma_data = false
      }

      if ($('select#select-turno').val() !== 'none' &&
        $('select#select-turma').val() !== 'none' &&
        $('select#select-empresa').val() !== 'none' &&
        $('select#select-orientador').val() !== 'none') {
        confirma_select = true
      } else {
        var elements = document.cadastra_estagiario.elements

        for (var i = 0, element; element = elements[i++];) {
          if (element.type == 'select-one' && element.value === 'none') {
            var nome = element.id
            $('select#' + nome).parent().parent('div.form-group').addClass('has-warning')
          } else if (element.type === 'select-one' && element.value === 'none') {
            var nome = element.id
            $('select#' + nome).parent().parent('div.form-group').removeClass('has-warning')
          }
        }
        confirma_select = false
      }

      if (confirma_data && confirma_select) {
        // Invertendo a data para ser enviada ao banco de dados.
        window.setElementValue('data_inicio', $('#data_inicio').val().split('-').reverse().join('-'))
        window.setElementValue('data_fim', $('#data_fim').val().split('-').reverse().join('-'))

        form.submit()
      }
    } // verifica_informacoes

    form.addEventListener('submit', verifica_informacoes, false)
  })
}
