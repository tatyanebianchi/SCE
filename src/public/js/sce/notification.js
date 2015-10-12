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
    var animation_time = 500;

    function erro(mensagem) {
        $("#notificacao").addClass("sce-alert sce-alert-danger")
        .html(mensagem)
        .slideDown(animation_time)
        .removeClass("hidden");
    }

    function alerta(mensagem) {
        $("#notificacao").addClass("sce-alert sce-alert-warning")
        .html(mensagem)
        .slideDown(animation_time)
        .removeClass("hidden");
    }

    function informacao(mensagem) {
        $("#notificacao").addClass("sce-alert sce-alert-info")
        .html(mensagem)
        .slideDown(animation_time)
        .removeClass("hidden");
    }

    function sucesso(mensagem) {
        $("#notificacao").addClass("sce-alert sce-alert-success")
        .html(mensagem)
        .slideDown(animation_time)
        .removeClass("hidden");
    }

    function esconder_notificacao() {
        $("#notificacao")
        .slideUp(animation_time)
    }
}
