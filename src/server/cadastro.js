/**
 *
 *
 */

// SCE
var db_api  = require('./db_api.js'),
    utils   = require('./server_utils.js'),
    ws      = require('./web_socket.js');


exports.cadastra_estagiario = function(req, res) {

    utils.write_log('Requisição de cadastro de estagiario recebido', '906');

    //foto atualmente não suportada no sce.
    var empresa_siap = null;
    // dados a ser enviados para cadastro.
    var data = []

    db_api.query("SELECT idEmpresa FROM `sce`.`empresa` WHERE nome = \""
                 + req.estagiario.empresa + "\"",
                 function(data, err) {
                     if(data) {
                        // Captura a primeira linha retornada da pesquisa.
                        empresa_siap = data[0].idEmpresa;

                        var estagiario = [];

                        estagiario.push(req.estagiario.matricula);
                        estagiario.push(req.estagiario.nome);
                        estagiario.push("2015-05-05"); // periodo_inicio
                        estagiario.push("2015-05-05"); // periodo_fim
                        // estagiario.push(req.estagiario.periodo_inicio);
                        // estagiario.push(req.estagiario.periodo_fim);
                        estagiario.push(req.estagiario.empresa);
                        estagiario.push(req.estagiario.orientador);
                        estagiario.push(empresa_siap);
                        estagiario.push(""); // foto
                        estagiario.push("2284");
                        estagiario.push(req.estagiario.observacao);

                        db_api.insert_estagiario(estagiario, function callback(data, err) {
                          if(data) {
                              utils.write_log('Estagiário inserido.' + data, '903')
                          }
                          else {
                              if(utils.is_debug()) {
                                console.log(err);
                              }

                              utils.write_log('[DB_API_ERR] ' + err, '904');

                              res.sendFile(utils.get_file('cadastra_estagiario.html'));
                              ws.send_json(JSON.stringify({
                                  code: '1004',
                                  desc: '[DB_API_ERR]',
                                  value: err
                              }));
                          }
                        });
                     }
                     else {
                        utils.write_log('[DB_API_ERR] ' + err, '904');
                        res.sendFile(utils.get_file('cadastra_estagiario.html'));

                        if(utils.is_debug()) {
                            console.log(err);
                        }
                     }
                 });
}

exports.cadastra_empresa = function(req, res) {
    utils.write_log('Requisição de cadastro de empresa recebido', '906');
}

// TODO: implementar depois
exports.cadastra_usuario = function(req, res) {

}
