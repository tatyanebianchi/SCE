/**
 * Arquivo para prover diversas utilidades ao servidor.
 */

var path = require('path');

// variável que controla se o sce está em modo debug.
var sce_debug = false;

// Diretório absoluto para a pasta pública - do cliente -.
exports.public_dir = function() {
    return path.join(process.cwd(), "../public/");
}

/**
 * @param file
 */
exports.get_file = function(file) {
    var public_dir = path.join(process.cwd(), "../public/");
    return path.join(public_dir, file);
}

/**
 * @param mensagem
 * @param data
 */
exports.type = function(mensagem, data) {
    console.log(mensagem + " -> " + typeof(data));
}

exports.is_debug = function() {
  return sce_debug;
}

exports.set_debug = function(boolean) {
  sce_debug = boolean;
}
