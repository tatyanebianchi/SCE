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

// Definindo uma variável basejs global para uso posterior.
window.basejs = true;

document.body.ondragstart = false;

if(typeof jQuery === "undefined") {
  throw new Error("base.js need jQuery in order to some functions work.")
}
else {
  // Um pouco de falso positivo aqui.
  var bootstrap = (typeof $().popover == 'function');

  if(bootstrap === 'undefined' || bootstrap) {
    $(function () {
      $('[data-toggle="popover"]').popover()
    })

    // Inicializando o componente tooltip.
    $(function () {
    		$('[data-toggle="tooltip"]').tooltip()
    })

    // thanks http://goo.gl/WJj13H
    $('body').tooltip({
      selector: '[data-toggle=tooltip]'
    })
  }

  $(document).ready(function() {
    // Eventos em botões desabilitados não irão disparar.
    $('.disabled').click(function(ev) {
      ev.preventDefault();
      ev.stopPropagation();
    })

    var animation_time = 550;

    // alerts são ignoráveis
    $('.sce-alert').click(function() {
        $(this).slideUp(animation_time);
    });
  });
}

/**
 *
 * @param elemento_id
 * @param valor
 */
function setElementValue(elemento_id, valor) {
  var elemento = document.getElementById(elemento_id);
  if(elemento === 'null') {
    console.error('O elemento ' + elemento_id + ' procurado não foi encontrado.');
  }
  else {
    elemento.value = valor;
  }
}

function getElementById(elemento_id) {
  if(elemento_id !== 'null') {
    return document.getElementById(elemento_id);
  }
  else {
    console.error('elemento_id não pode ser nulo.');
  }
}
