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

if(typeof jQuery == "undefined") {
  throw new Error("notification.js needs jQuery to work");
}
else {
  var animationTime = 500,
  	  notificacao = true;

  var classes = 'sce-alert sce-notification-danger sce-notification-warning ' +
  							'sce-notification-info sce-notification-success';

  $(document).ready(function() {
  	/**
  	 *
  	 */
  	 function limpaNotificacao(callback) {
  	 	$("#notificacao").removeClass(classes);
  	 	callback();
  	 }

	  window.notificacao_erro = function(mensagem) {
	  	limpaNotificacao(function() {
	  		$("#notificacao").addClass("sce-notification sce-notification-danger")
		    .html(mensagem)
		    .slideDown(animationTime)
		    .removeClass("sce-hide");
	  	});
	  }

	  /**
  	 *
  	 */
	  window.notificacao_alerta = function(mensagem) {
	  	limpaNotificacao(function() {
		    $("#notificacao").addClass("sce-notification sce-notification-warning")
		    .html(mensagem)
		    .slideDown(animationTime)
		    .removeClass("sce-hide");
	  	});
	  }

	  /**
  	 *
  	 */
	  window.notificacao_informacao = function(mensagem) {
	  	limpaNotificacao(function() {
		    $("#notificacao").addClass("sce-notification sce-notification-info")
		    .html(mensagem)
		    .slideDown(animationTime)
		    .removeClass("sce-hide");
		  });
	  }

	  /**
  	 * 
  	 */
	  window.notificacao_sucesso = function(mensagem) {
	    limpaNotificacao(function() {
		    $("#notificacao").addClass("sce-notification sce-notification-success")
		    .html(mensagem)
		    .slideDown(animationTime)
		    .removeClass("sce-hide");
		  });
	  }

	  /**
	   * @param delay Se definido, vai ser utilizado como tempo de delay
	   * para esconder a notificação. Caso contrário, um valor padrão será
	   * utilizado.
	   */
	  window.esconder_notificacao = function(delay) {
	  	var delayTime = 350;

	  	if (delay !== 'undefined') {
	  		delayTime = delay;
	  	}

	    $("#notificacao")
	    .delay(delayTime)
	    .slideUp(animationTime);
	  }

	  window.notificacao = notificacao;
  });
}
