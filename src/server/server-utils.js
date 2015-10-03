/**
 * Arquivo para prover diversas utilidades ao servidor.
 */

var path = require('path');


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
 * @param data
 */
exports.type = function(data) {
    console.log(typeof(data));
}
