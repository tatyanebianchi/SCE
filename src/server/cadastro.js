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
 *
 * Script para gerenciar todo tipo de cadastro  feito no  aplicação.  Planejo,
 * futuramente, modificar isso para ser feito somente com web sockets, ao invés
 * de utilizar esse script.
 */

// SCE
var db_api  = require('./db_api.js'),
    utils   = require('./server_utils.js'),
    ws      = require('./web_socket.js');


exports.cadastraEstagiario = function(req, res) {
  utils.write_log('Requisição de cadastro de estagiario recebido', '906');

  var empresa_siap = null;
  // Dados do estagiário a ser enviado ao banco de dados.
  var estagiario = [];

  // NOTE: sql_injection abaixo.
  db_api.query("SELECT id_empresa FROM sce.empresa WHERE nome = \""
               + req.estagiario.empresa + "\"",
               function(empresa_query_data,  empresa_query_err) {
                   if(empresa_query_data) {
                      empresa_siap = empresa_query_data[0].id_empresa;

                      estagiario.push(req.estagiario.matricula);
                      estagiario.push(req.estagiario.nome);
                      estagiario.push(req.estagiario.periodo_inicio);
                      estagiario.push(req.estagiario.periodo_fim);
                      estagiario.push(req.estagiario.empresa);
                      estagiario.push(""); // foto, por enquanto a função não vai ser implementada.
                      estagiario.push(req.estagiario.observacao);
                      estagiario.push(empresa_siap);
                      estagiario.push(req.estagiario.turma);
                      estagiario.push(req.estagiario.orientador);

                      db_api.insert_estagiario(estagiario, function(data, err) {
                        if(data) {
                          utils.write_log('Estagiário(a) ' +  estagiario[1] + ' inserido(a) no sistema', '903');
                          res.sendFile(utils.getFile('cadastra_estagiario.html'));

                          ws.send_json({
                              code: '1000',
                              desc: 'Cadastro bem sucedido'
                          });
                        }
                        else {
                          if(utils.is_debug()) {
                            console.log("Erro ao inserir estagiário: " + err);
                          }

                          utils.write_log('[DB_API_ERR] ' + err, '904');
                          res.sendFile(utils.getFile('cadastra_estagiario.html'));

                          ws.send_json({
                              code: '1004',
                              desc: '[DB_API_ERR]',
                              value: err
                          });

                          // ws.send(JSON.stringify({
                          //     code:  '1004',
                          //     desc:  '[DB_API_ERR]',
                          //     value: err
                          // }), function(error) {
                          //     utils.write_log("Erro ao enviar informação ao cliente: " + error, '904');
                          //     if(utils.is_debug()) {
                          //         console.log("Erro ao enviar mensagem ao cliente: " + error);
                          //     }
                          // });
                        }
                      });
                   }
                   else {
                       if(utils.is_debug()) {
                           console.log("Erro ao buscar id da empresa: " + empresa_query_err);
                       }

                      utils.write_log('[DB_API_ERR] ' + empresa_query_err, '904');
                      res.sendFile(utils.getFile('cadastra_estagiario.html'));

                      ws.send_json({
                        code: '1004',
                        desc: '[DB_API_ERR]',
                        value: empresa_query_err
                      });

                      // ws.send(JSON.stringify({
                      //     code:  '1004',
                      //     desc:  '[DB_API_ERR]',
                      //     value: err
                      // }), function(error) {
                      //     utils.write_log("Erro ao enviar informação ao cliente: " + error, '904');
                      //     if(utils.is_debug()) {
                      //         console.log("Erro ao enviar mensagem ao cliente: " + error);
                      //     }
                      // });
                   }
               });
}

exports.cadastraEmpresa = function(req, res) {
  utils.write_log('Requisição de cadastro de empresa recebido', '906');

  // dados da empresa
  var empresa = [];

  empresa.push(req.empresa.nome);
  empresa.push(req.empresa.razao_social);
  empresa.push(req.empresa.cnpj);
  empresa.push(req.empresa.email);
  empresa.push(req.empresa.telefone);
  empresa.push(req.empresa.telefone_2);
  empresa.push(req.empresa.rua);
  empresa.push(req.empresa.numero);
  empresa.push(req.empresa.bairro);
  empresa.push(req.empresa.cep);

  db_api.insert_empresa(empresa, function(data, err) {
    if(data) {
      utils.write_log('Empresa ' +  empresa[0] + ' inserida no sistema', '903');
      res.sendFile(utils.getFile('empresas.html'));

      ws.send_json({
          code: '1000',
          desc: 'Cadastro bem sucedido'
      });

      // ws.send(JSON.stringify({
      //     code: '1000',
      //     desc: 'Cadastro bem sucedido'
      // }), function(error) {
      //     utils.write_log("Erro ao enviar informação ao cliente: " + error, '904');
      //     if(utils.is_debug()) {
      //         console.log("Erro ao enviar mensagem ao cliente: " + error);
      //     }
      // });
    }
    else {
      if(utils.is_debug()) {
        console.log("Erro ao inserir estagiário: " + err);
      }

      utils.write_log('[DB_API_ERR] ' + err, '904');
      res.sendFile(utils.getFile('empresas.html'));

      ws.send_json({
        code: '1004',
        desc: '[DB_API_ERR]',
        value: err
      });

      // ws.send(JSON.stringify({
      //     code:  '1004',
      //     desc:  '[DB_API_ERR]',
      //     value: err
      // }), function(error) {
      //     utils.write_log("Erro ao enviar informação ao cliente: " + error, '904');
      //     if(utils.is_debug()) {
      //         console.log("Erro ao enviar mensagem ao cliente: " + error);
      //     }
      // });
    }
  });
}


exports.cadastraOrientador = function(req, res) {
    utils.write_log('Requisição de cadastro de orientador recebido', '906');
    // dados que irão para o banco de dados.
    var orientador = [];

    orientador[0] = req.orientador.siap;
    orientador[1] = req.orientador.nome;

    db_api.insert_orientador(orientador, function(data, err) {
        if(data) {
            utils.write_log('Orientador ' +  orientador[1] + ' inserido no sistema', '903');
            res.sendFile(utils.getFile('orientadores.html'));

            ws.send_json({
                code: '1000',
                desc: 'Cadastro bem sucedido'
            });
        }
        else {
            if(utils.is_debug()) {
              console.log("Erro ao inserir orientador: " + err);
            }

            utils.write_log('[DB_API_ERR] ' + err, '904');
            res.sendFile(utils.getFile('orientadores.html'));

            ws.send_json({
                code: '1004',
                desc: '[DB_API_ERR]',
                value: err
            });
        }
    });
}

exports.cadastraTurma = function(req, res) {
    utils.write_log('Requisição de cadastro de turma recebido', '906');
    // dados que irão para o banco de dados.
    var turma = [];

    turma[0] = req.turma.id_turma;
    turma[1] = req.turma.turno;
    turma[2] = req.turma.curso;

    db_api.insert_turma(turma, function(data, err) {
        if(data) {
            utils.write_log('Turma ' +  turma[2] + ' inserida no sistema', '903');
            res.sendFile(utils.getFile('turmas.html'));

            ws.send_json({
                code: '1000',
                desc: 'Cadastro bem sucedido'
            });
        }
        else {
            if(utils.is_debug()) {
              console.log("Erro ao inserir turma: " + err);
            }

            utils.write_log('[DB_API_ERR] ' + err, '904');
            res.sendFile(utils.getFile('turmas.html'));

            ws.send_json({
                code: '1004',
                desc: '[DB_API_ERR]',
                value: err
            });
        }
    });
}

// TODO: implementar depois
exports.cadastraUsuario = function(req, res) {

}
