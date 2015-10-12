/**
 * notification.js
 * Author: Rafael Campos Nunes.
 * License: GPLv3
 *
 * API de notificão do SCE.
 */

if(typeof jQuery == "undefined") {
    throw new Error("notification.js needs jQuery to work");
}
else {
    function erro(mensagem) {
        $("#notificacao").addClass("sce-alert sce-alert-danger")
        .html(mensagem)
        .slideDown(150).removeClass("hidden");
    }

    function alerta(mensagem) {
        $("#notificacao").addClass("sce-alert sce-alert-warning")
        .html(mensagem)
        .slideDown(150).removeClass("hidden");
    }

    function informacao(mensagem) {
        $("#notificacao").addClass("sce-alert sce-alert-info")
        .html(mensagem)
        .slideDown(150).removeClass("hidden");
    }

    function sucesso(mensagem) {
        $("#notificacao").addClass("sce-alert sce-alert-success")
        .html(mensagem)
        .slideDown(150).removeClass("hidden");
    }
}
