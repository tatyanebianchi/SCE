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

if (typeof jQuery == 'undefined') {
  throw new Error('notification.js needs jQuery to work')
} else {
  /**
   * TODO: Refatorar tudo isso em um objeto.
   */
  var animationTime = 500
  var notificacao = true
  var alturaLinha = 20
  var alturaTela = document.documentElement.clientHeight

  var classes = 'sce-alert sce-notification-danger sce-notification-warning ' +
                'sce-notification-info sce-notification-success'

  $(document).ready(function () {
  /**
   * Limpa as classes do elemento com o id notificacao.
   * @param {Function} callback Função chamada após a remoção de todas as classes da notiicação
   */
    function limpaNotificacao (callback) {
      $('#notificacao').removeClass(classes)
      callback()
    }

    /**
     * Mostra uma notificação com o estado de erro.
     * @param {String} A mensagem a ser exibida para o usuário na notificação.
     * @param {Bool} Se a notificação deve ocupar a tela toda ou não.
     */
    window.notificacao_erro = function (mensagem, telaCheia) {
      if (telaCheia !== false && telaCheia !== undefined) {
        limpaNotificacao(function () {
          $('#notificacao').addClass('sce-notification sce-notification-danger')
          .css('height', alturaTela)
          .css('line-height', alturaLinha)
          .html(mensagem)
          .slideDown(animationTime)
          .removeClass('sce-hide')
        })
      } else {
        limpaNotificacao(function () {
          $('#notificacao').addClass('sce-notification sce-notification-danger')
          .html(mensagem)
          .slideDown(animationTime)
          .removeClass('sce-hide')
        })
      }
    }

    /**
     * Mostra uma notificação com o estado de alerta.
     * @param {String} A mensagem a ser exibida para o usuário na notificação.
     * @param {Bool} Se a notificação deve ocupar a tela toda ou não.
     */
    window.notificacao_alerta = function (mensagem, telaCheia) {
      if (telaCheia !== false && telaCheia !== undefined) {
        limpaNotificacao(function () {
          $('#notificacao').addClass('sce-notification sce-notification-warning')
          .css('height', alturaTela)
          .css('line-height', alturaLinha)
          .html(mensagem)
          .slideDown(animationTime)
          .removeClass('sce-hide')
        })
      } else {
        limpaNotificacao(function () {
          $('#notificacao').addClass('sce-notification sce-notification-warning')
          .html(mensagem)
          .slideDown(animationTime)
          .removeClass('sce-hide')
        })
      }
    }

    /**
     * Mostra uma notificação com o estado de informação.
     * @param {String} A mensagem a ser exibida para o usuário na notificação.
     * @param {Bool} Se a notificação deve ocupar a tela toda ou não.
     */
    window.notificacao_informacao = function (mensagem, telaCheia) {
      if (telaCheia !== false && telaCheia !== undefined) {
        limpaNotificacao(function () {
          $('#notificacao').addClass('sce-notification sce-notification-info')
          .css('height', alturaTela)
          .css('line-height', alturaLinha)
          .html(mensagem)
          .slideDown(animationTime)
          .removeClass('sce-hide')
        })
      } else {
        limpaNotificacao(function () {
          $('#notificacao').addClass('sce-notification sce-notification-info')
          .html(mensagem)
          .slideDown(animationTime)
          .removeClass('sce-hide')
        })
      }
    }

    /**
     * Mostra uma notificação com o estado de sucesso.
     * @param {String} A mensagem a ser exibida para o usuário na notificação.
     * @param {Bool} Se a notificação deve ocupar a tela toda ou não.
     */
    window.notificacao_sucesso = function (mensagem, telaCheia) {
      if (telaCheia !== false && telaCheia !== undefined) {
        limpaNotificacao(function () {
          $('#notificacao').addClass('sce-notification sce-notification-success')
          .css('height', alturaTela)
          .css('line-height', alturaLinha)
          .html(mensagem)
          .slideDown(animationTime)
          .removeClass('sce-hide')
        })
      } else {
        limpaNotificacao(function () {
          $('#notificacao').addClass('sce-notification sce-notification-success')
          .html(mensagem)
          .slideDown(animationTime)
          .removeClass('sce-hide')
        })
      }
    }

    /**
     * @param delay Se definido, vai ser utilizado como tempo de delay
     * para esconder a notificação. Caso contrário, um valor padrão será
     * utilizado.
     */
    window.esconder_notificacao = function (delay) {
      var delayTime = 350

      if (delay !== undefined) {
        delayTime = delay
      }

      if (!$('#notificacao').hasClass('sce-hide')) {
        $('#notificacao')
        .delay(delayTime)
        .slideUp(animationTime)
      }
    }

    window.notificacao = notificacao
  })
}
