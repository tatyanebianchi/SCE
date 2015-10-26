/**
 * Arquivo para prover diversas utilidades ao servidor.
 */

var path = require('path'),
    fs   = require('fs'),
    util = require('util');

// variável que controla se o sce está em modo debug.
var sce_debug = false;

// Caminho relativo para o arquivo server.log
var log_file = './log/server.log';

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

exports.write_log = function(message, error_code) {
    var date = Date();
    fs.open(log_file, 'a', function(err, fd) {
        if(err) {
            console.log('Erro ao abrir o arquivo ' + log_file + ' para escrita.');
        }
        else {
            var log_message = date + ' LOG: ' + error_code + ' -> ' + message +
                              '\n';

            fs.appendFileSync(log_file, log_message, 'utf8',
                              function(err) {
                                  if(err) {
                                      console.log("Erro ao adicionar texto para"
                                      + " o arquivo.")
                                  }
                              });
        }
    })
}
