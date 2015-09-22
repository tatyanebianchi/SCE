/**
 * Arquivo para prover diversas utilidades ao servidor.
 */

var path = require('path');


// Diretório absoluto para a pasta pública - do cliente -.
exports.public_dir = function() {
  return path.join(process.cwd(), "../public/");
}
