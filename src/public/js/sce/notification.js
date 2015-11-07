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

    var classes = 'sce-alert sce-alert-danger sce-alert-warning sce-alert-info' +
                  'sce-alert-success'

    function notificacao_erro(mensagem) {
        $("#notificacao").addClass("sce-alert sce-alert-danger")
        .html(mensagem)
        .slideDown(animation_time)
        .removeClass("hidden");
    }

    function notificacao_alerta(mensagem) {
        $("#notificacao").addClass("sce-alert sce-alert-warning")
        .html(mensagem)
        .slideDown(animation_time)
        .removeClass("hidden");
    }

    function notificacao_informacao(mensagem) {
        $("#notificacao").addClass("sce-alert sce-alert-info")
        .html(mensagem)
        .slideDown(animation_time)
        .removeClass("hidden");
    }

    function notificacao_sucesso(mensagem) {
        $("#notificacao").addClass("sce-alert sce-alert-success")
        .html(mensagem)
        .slideDown(animation_time)
        .removeClass("hidden");
    }

    function esconder_notificacao() {
        $("#notificacao")
        .delay(750)
        .slideUp(animation_time);
    }
}
