/**
  * base.js
  * Author: Rafael Campos Nunes.
  * License: GPLv3
  *
  * Script base para a aplicação. Ele inicializa e define propriedades de alguns
  * elementos, assim como também ações dos mesmos.
  */


if(typeof jQuery == "undefined") {
    throw new Error("base.js need jQuery in order to work.")
}
else {
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


    var animation_time = 550;

    // alerts são ignoráveis
    $('.sce-alert').click(function() {
        $(this).slideUp(animation_time);
    });
}
