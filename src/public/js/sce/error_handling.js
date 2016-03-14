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

if (typeof jQuery == 'undefind') {
  throw new Error('error_handling.js needs jQuery to work')
} else {
  // variável que ficará exposta para testes de inclusão deste arquivo
  var errorHandling = true

  $(document).ready(function () {
    var messageElement = $('p#error_box')
    var classes = 'sce-alert-danger sce-alert-warning sce-alert-success sce-alert-info'
    var infoIcon = '<div class="libre-stack">' +
                      '  <i class="libre libre-stack-1x libre-circle"></i>' +
                      '  <i class="libre libre-stack-1x libre-info text-white"></i>' +
                      '</div>'

    /**
     * Função que remove todas as classes do alerta.
     * @param {Function} callback Função chamada após o término da remoção de classes.
     */
    function limpaAlerta (callback) {
      messageElement.removeClass(classes)
      callback()
    }

    /**
     * @param data
     */
    window.handleError = function (data) {
      limpaAlerta(function () {
        switch (data.value.code) {
          case 'ECONNREFUSED': // conexão com o servidor recusada
            messageElement.html(infoIcon + ' Erro de conexão (1004). Verifique o <a href="status.html">estado do ' +
                                'sistema</a>.')
                          .addClass('sce-alert-warning')
                          .fadeIn('slow')
            break
          case 'ER_DUP_ENTRY': // duplicação de chave primária
            messageElement.html(infoIcon + ' As informações inseridas no cadastro já constam no banco de dados do ' +
                                'sistema. Verifique se o que você inseriu está correto, para mais informações ' +
                                'visite a <a href="ajuda.html#title-8">ajuda</a>')
                          .addClass('sce-alert-warning')
                          .fadeIn('slow')
            break
          case undefined: // código de erro indefinido
            messageElement.html(infoIcon + ' ' + data.value)
                          .addClass('sce-alert-warning')
                          .fadeIn('slow')
            break
          default:
            messageElement.html(infoIcon +
                                ' Um erro não identificado ocorreu, por favor, reporte o erro ao administrador. ' +
                                'Erro: <strong>' + data.desc + ' ' + data.value + '</strong>')
                          .addClass('sce-alert-danger')
                          .fadeIn('slow')
            break
        }
      })
    }
  })
}
